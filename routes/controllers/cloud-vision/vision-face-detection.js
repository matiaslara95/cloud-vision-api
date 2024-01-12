require("dotenv").config();
const vision = require('@google-cloud/vision');

exports.DetectFaces = async () => {
    const client = new vision.ImageAnnotatorClient();
    
    const fileName = 'C:\\Users\\Administrador\\source\\repos\\cloud-vision-api\\files\\family.jpg';

    const [result] = await client.faceDetection(fileName);
    const faces = result.faceAnnotations;
    console.log('Faces:');
    faces.forEach((face, i) => {
      console.log(`  Face #${i + 1}:`);
      console.log(`    Joy: ${face.joyLikelihood}`);
      console.log(`    Anger: ${face.angerLikelihood}`);
      console.log(`    Sorrow: ${face.sorrowLikelihood}`);
      console.log(`    Surprise: ${face.surpriseLikelihood}`);
    });
  }