const express = require("express");
const router = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");

const loginGoogleApis = require('./controllers/google/login-google-apis');
const filesCloudVision = require('./controllers/cloud-vision/vision-files');
const faceCloudVision = require('./controllers/cloud-vision/vision-face-detection');
const { Router } = require("express");

router.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

//GET AUTH GOOGLE 
router.get("/auth/google/url", (req, response) => {
  return response.send(loginGoogleApis.getGoogleAuthURL());
})

//GET TOKEN GOOGLE AND CREATE COOKIE WITH TOKEN
router.get("/auth/google", async (req, res) => {
  const code = req.query.code
  const token = await loginGoogleApis.getGoogleToken({ code });
console.log("token", token)
  res.cookie(process.env.COOKIE_NAME, token, {
    maxAge: 900000,
    httpOnly: true,
    secure: false
  })

  res.redirect(process.env.ROOT_URI)
})

router.get("/cloud/files/getInfo", (req, res) => {
  return filesCloudVision.LocalizeObjects();
})

router.get("/cloud/files/text", (req, res) => {
  return filesCloudVision.DetectFulltext();
})

router.get("/cloud/files/landmarks", (req, res) => {
  return filesCloudVision.DetectLandmarks();
})

router.get("/cloud/files/label", async (req, res) => {
  return await filesCloudVision.DetectLabels();
})

router.get("/cloud/images/face", async (req, res) => {
  return await faceCloudVision.DetectFaces();
})

//NOT WORKING (AT THE MOMENT)
// router.get("/auth/me", async (req, res) => {
//   console.log("get me")
//   try {
//     const decoded = jwt.verify(req.cookies[process.env.COOKIE_NAME], JWT_SECRET)
//     console.log("decoded", decoded)
//     return res.send(decoded)
//   } catch (err) {
//     console.log(err)
//     res.send(null)
//   }
// })


module.exports = router;