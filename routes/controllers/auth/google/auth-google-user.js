require("dotenv").config();
const { stringify } = require("querystring");
const axios = require("axios");
const { google } = require('googleapis');
const jwt = require("jsonwebtoken");
const dbConnectionUser = require("../../../../services/dbConnectionUser");
const mongoose = require('mongoose'), Schema = mongoose.Schema, UserGoogle = require('../../../models/db/user');

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = `${process.env.ROOT_URI}auth/google`;

exports.getGoogleAuthURL = () => {
  const rootURL = "https://accounts.google.com/o/oauth2/auth";
  const options = {
    redirect_uri: redirectUri,
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  return `${rootURL}?${stringify(options)}`
}


exports.getGoogleToken = async ({ code }, res) => {

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );
  // Get access and refresh tokens (if access_type is offline)
  const googleToken = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(googleToken);

  let id_token = googleToken["tokens"]["id_token"];
  let access_token = googleToken["tokens"]["access_token"];

  // Fetch the user's profile with the access token and bearer
  const googleUser = await axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`
        }
      }
    )
    .then(async response => {
      console.log("Obtuve usuario", response.data)

      const userExist = await dbConnectionUser.GetUserGoogleByGoogleID(response.data.id);
      //if the user doesn't exist in the DB, we'll create it
      if (userExist == null) {
        console.log("Create user because doesnt exist in the DB", userExist);
        await CreateUserGoogle(response.data);
      }
      else{
        console.log("The user already exist in our DB", userExist);
      }

      return response.data;
    })
    .catch(error => {
      console.log("access_token", access_token)
      console.log("id_token", id_token)
      console.error(`Failed to fetch user`)
      throw new Error(error.message)
    })

  const token = jwt.sign(googleUser, process.env.JWT_SECRET, {
    expiresIn: '1h',
  })

  return token;
}


exports.getGoogleUser = async () => {
  const code = req.query.code

  const { id_token, access_token } = await getTokens({
    code,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: redirectUri
  })

  // Fetch the user's profile with the access token and bearer
  const googleUser = await axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`
        }
      }
    )
    .then(res => res.data)
    .catch(error => {
      console.error(`Failed to fetch user`)
      throw new Error(error.message)
    })

  const token = jwt.sign(googleUser, process.env.JWT_SECRET)

  res.cookie(COOKIE_NAME, token, {
    maxAge: 900000,
    httpOnly: true,
    secure: false
  })

  res.redirect(process.env.ROOT_URI)
}

CreateUserGoogle = async (userGoogle) => {
  console.log("Usuario Google", userGoogle)
  let newUser = new UserGoogle();
  newUser.googleId = userGoogle.id;
  newUser.email = userGoogle.email;
  newUser.given_name = userGoogle.given_name;
  newUser.family_name = userGoogle.family_name;
  newUser.verified_email = userGoogle.verified_email;
  newUser.dateCreate = new Date();
  console.log("Nuevo usuario", newUser)
  return await dbConnectionUser.CreateUserGoogle(newUser);
}

ValidateUserGoogle = (idUserGoogle) => {
  return dbConnectionUser.FindUserGoogleByGoogleID(idUserGoogle);
}
