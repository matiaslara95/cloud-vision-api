const express = require("express");
const router = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");

const cloudVision = require('./controllers/images/cloud-vision');

router.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

// //IMAGE CONTROLLER
router.get("/auth/google/url", (req, response) => {
  return response.send(cloudVision.getGoogleAuthURL());
})

router.get("/auth/google", async (req, res) => {
  const code = req.query.code
  const token = await cloudVision.getGoogleToken({ code });
console.log("token", token)
  res.cookie(process.env.COOKIE_NAME, token, {
    maxAge: 900000,
    httpOnly: true,
    secure: false
  })

  res.redirect(process.env.ROOT_URI)
})

router.get("/auth/me", async (req, res) => {
  console.log("get me")
  try {
    const decoded = jwt.verify(req.cookies[process.env.COOKIE_NAME], JWT_SECRET)
    console.log("decoded", decoded)
    return res.send(decoded)
  } catch (err) {
    console.log(err)
    res.send(null)
  }
})


module.exports = router;