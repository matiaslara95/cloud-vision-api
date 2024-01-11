require("dotenv").config();
const vision = require('@google-cloud/vision');
const { stringify } = require("querystring");


exports.ImageAnnotator = async () => {
    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    const fileName = './images/Foto de camara.png';

    // Performs property detection on the local file
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


exports.DetectFulltext = async () => {  
    // Creates a client
    const client = new vision.ImageAnnotatorClient();
  
    const fileName = './images/la-siesta.png';
  
    // Read a local image as a text document
    const [result] = await client.documentTextDetection(fileName);
    const fullTextAnnotation = result.fullTextAnnotation;
    console.log(`Full text: ${fullTextAnnotation.text}`);
    // fullTextAnnotation.pages.forEach(page => {
    //   page.blocks.forEach(block => {
    //     console.log(`Block confidence: ${block.confidence}`);
    //     block.paragraphs.forEach(paragraph => {
    //       console.log(`Paragraph confidence: ${paragraph.confidence}`);
    //       paragraph.words.forEach(word => {
    //         const wordText = word.symbols.map(s => s.text).join('');
    //         console.log(`Word text: ${wordText}`);
    //         console.log(`Word confidence: ${word.confidence}`);
    //         word.symbols.forEach(symbol => {
    //           console.log(`Symbol text: ${symbol.text}`);
    //           console.log(`Symbol confidence: ${symbol.confidence}`);
    //         });
    //       });
    //     });
    //   });
    // });
    // [END vision_fulltext_detection]
    return fullTextAnnotation.text;
  }

  exports.LocalizeObjects = async () => {
    const fs = require('fs');
  
    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    const fileName = `./images/Foto de camara.png`;

    const request = {
      image: {content: fs.readFileSync(fileName)},
    };
  
    const [result] = await client.objectLocalization(request);
    const objects = result.localizedObjectAnnotations;
    console.log(JSON.stringify(objects))
    // objects.forEach(object => {
    //   console.log(`Name: ${object.name}`);
    //   console.log(`Confidence: ${object.score}`);
    //   const vertices = object.boundingPoly.normalizedVertices;
    //   vertices.forEach(v => console.log(`x: ${v.x}, y:${v.y}`));
    // });
    // [END vision_localize_objects]
  }