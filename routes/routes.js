const express = require("express");
const router = express.Router();
require("dotenv").config();

const authMiddle = require('./controllers/middleware/authMiddleware');
const authUser = require('./controllers/auth/auth-user');
const authGoogleUser = require('./controllers/auth/google/auth-google-user');
const filesCloudVision = require('./controllers/cloud-vision/vision-files');
const faceCloudVision = require('./controllers/cloud-vision/vision-face-detection');
const imagesController = require('./controllers/images/images')

router.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

//NORMAL AUTH
router.post('/auth/register', async (req, res) => {
  return res.send(authUser.RegisterUser(req))
})

router.post('/auth/login', async (req, res) => {
  return res.send(authUser.LoginUser(req))
})

//GET AUTH GOOGLE 
router.get("/auth/google/url", (req, response) => {
  return response.send(authGoogleUser.getGoogleAuthURL());
})

//GET TOKEN GOOGLE AND CREATE COOKIE WITH TOKEN
router.get("/auth/google", async (req, res) => {
  const code = req.query.code
  const token = await authGoogleUser.getGoogleToken({ code });
console.log("token", token)
  res.cookie(process.env.COOKIE_NAME, token, {
    maxAge: 900000,
    httpOnly: true,
    secure: false
  })

  res.redirect(process.env.ROOT_URI)
})


//VISION CLOUD
router.get("/cloud/files/localize", authMiddle.VerifyToken, async (req, res) => {
  return res.send(await filesCloudVision.LocalizeObjects());
})

router.get("/cloud/files/text", async (req, res) => {
  return res.send(await filesCloudVision.DetectFulltext());
})

router.get("/cloud/files/landmarks", async (req, res) => {
  return res.send(await filesCloudVision.DetectLandmarks());
})

router.get("/cloud/files/label", async (req, res) => {
  return res.send(await filesCloudVision.DetectLabels());
})

//********FACE DETECTION
router.get("/cloud/images/face", async (req, res) => {
  return res.send(await faceCloudVision.DetectFaces());
})

//********GET IMAGES COLLECTION
router.get("/images", async (req, res) => {
  return res.send(await imagesController.GetAllImages());
})

router.get("/images", async (req, res) => {
  return res.send(await imagesController.GetImagesByID(req.id));
})

router.put("/images", async (req, res) => {
  return res.send(await imagesController.UpdateImagesByID(req));
})

router.delete("/images", async (req, res) => {
  return res.send(await imagesController.DeleteImagesByID(req.id));
})

//********GET IMAGES COLLECTION
router.get("/documents", async (req, res) => {
  return res.send(await imagesController.GetAllImages());
})

router.get("/documents", async (req, res) => {
  return res.send(await imagesController.GetImagesByID(req.id));
})

router.delete("/documents", async (req, res) => {
  return res.send(await imagesController.DeleteImagesByID(req.id));
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