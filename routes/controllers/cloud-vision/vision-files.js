require("dotenv").config();
const vision = require('@google-cloud/vision');
const { stringify } = require("querystring");
const fs = require('fs').promises;
const dbConnection = require("../../../services/dbConnection");
const mongoose = require('mongoose'), Schema = mongoose.Schema, Document = require('../../models/db/documents');

const CREDENTIALS = JSON.parse(JSON.stringify({
  }));  

const CONFIG = {
    credentials : {
        private_key: CREDENTIALS.private_key,
        client_email: process.env.CLIENT_EMAIL,
    }
}
exports.DetectFulltext = async () => {
    // Creates a client
    const client = new vision.ImageAnnotatorClient(CONFIG);

    const fileName = 'C:\\Users\\Administrador\\source\\repos\\cloud-vision-api\\files\\englishtext.jpg';

    // Read a local image as a text document
    const [result] = await client.documentTextDetection(fileName);
    fs.writeFile('result.txt', JSON.stringify(result.fullTextAnnotation), 'utf8');

    const fullTextAnnotation = result.fullTextAnnotation;
    console.log(`Full text: ${fullTextAnnotation.text}`);

    let document = new Document();    
    document.language = "English";
    document.dateScanned = new Date();
    document.text = fullTextAnnotation.text;
    document.type = "imagen";    

    dbConnection.CreateDocument("documents", document);
    // fullTextAnnotation.pages.forEach(page => {
    //     page.blocks.forEach(block => {
    //         console.log(`Block confidence: ${block.confidence}`);
    //         block.paragraphs.forEach(paragraph => {
    //             console.log(`Paragraph confidence: ${paragraph.confidence}`);
    //             paragraph.words.forEach(word => {
    //                 const wordText = word.symbols.map(s => s.text).join('');
    //                 console.log(`Word text: ${wordText}`);
    //                 console.log(`Word confidence: ${word.confidence}`);
    //                 word.symbols.forEach(symbol => {
    //                     console.log(`Symbol text: ${symbol.text}`);
    //                     console.log(`Symbol confidence: ${symbol.confidence}`);
    //                 });
    //             });
    //         });
    //     });
    // });
    // [END vision_fulltext_detection]
    return fullTextAnnotation.text;
}

exports.DetectLandmarks = async () => {
    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    const fileName = 'C:\\Users\\Administrador\\source\\repos\\cloud-vision-api\\files\\family.jpg';

    // Performs landmark detection on the local file
    const [result] = await client.landmarkDetection(fileName);
    fs.writeFile('result.txt', JSON.stringify([result]), 'utf8');
    const landmarks = result.landmarkAnnotations;
    console.log('Landmarks:');
    landmarks.forEach(landmark => console.log(landmark));
    // [END vision_landmark_detection]
}

exports.DetectLabels = async (req, res) => {
    // Creates a client
    const client = new vision.ImageAnnotatorClient(CONFIG);

    const fileName = 'C:\\Users\\Administrador\\source\\repos\\cloud-vision-api\\files\\family.jpg';

    // Performs label detection on the local file
    const [result] = await client.labelDetection(fileName);
    const labels = result.labelAnnotations;
    console.log('Labels:');
    labels.forEach(label => console.log(label.description));
    // [END vision_label_detection]
    return JSON.stringify([result]);
}


exports.LocalizeObjects = async () => {
    const fs = require('fs');

    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    const fileName = 'C:\\Users\\Administrador\\source\\repos\\cloud-vision-api\\files\\torres-del-paine.jpg';

    const request = {
        image: { content: fs.readFileSync(fileName) },
    };

    const [result] = await client.objectLocalization(request);
    const objects = result.localizedObjectAnnotations;
    console.log(JSON.stringify(objects))
    objects.forEach(object => {
      console.log(`Name: ${object.name}`);
      console.log(`Confidence: ${object.score}`);
      const vertices = object.boundingPoly.normalizedVertices;
      vertices.forEach(v => console.log(`x: ${v.x}, y:${v.y}`));
    });
    // [END vision_localize_objects]
}

