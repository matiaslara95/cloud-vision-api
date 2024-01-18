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

    return await dbConnection.CreateDocument("documents", document);
    
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
    // return fullTextAnnotation.text;
}

/* 
    Landmark Detection detects popular natural and human-made structures within an image.
*/
exports.DetectLandmarks = async () => {
    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    const fileName = 'C:\\Users\\Administrador\\source\\repos\\cloud-vision-api\\files\\paris.jpg';

    // Performs landmark detection on the local file
    const [result] = await client.landmarkDetection(fileName);
    const landmarks = result.landmarkAnnotations;
    console.log('Landmarks:');
    landmarks.forEach(landmark => console.log(landmark));
    // [END vision_landmark_detection]
    return JSON.stringify([result]);
}

/**
 * The Vision API can detect and extract information about entities in an image, across a broad group of categories.
    Labels can identify general objects, locations, activities, animal species, products, and more. If you need targeted custom labels, Cloud AutoML Vision allows you to train a custom machine learning model to classify images.
    Labels are returned in English only. The Cloud Translation API can translate English labels into any of a number of other languages.
 */
exports.DetectLabels = async (req, res) => {
    // Creates a client
    const client = new vision.ImageAnnotatorClient(CONFIG);

    const fileName = 'C:\\Users\\Administrador\\source\\repos\\cloud-vision-api\\files\\paris.jpg';

    // Performs label detection on the local file
    const [result] = await client.labelDetection(fileName);
    const labels = result.labelAnnotations;
    console.log('Labels:');
    labels.forEach(label => console.log(label.description));
    // [END vision_label_detection]
    return JSON.stringify(labels);
}

/*
 *  The Vision API can detect and extract multiple objects in an image with Object Localization.
    
    Object localization identifies multiple objects in an image and provides a LocalizedObjectAnnotation for each object in the image. 
    Each LocalizedObjectAnnotation identifies information about the object, the position of the object, and rectangular bounds for the region of the image that contains the object. 

    Object localization identifies both significant and less-prominent objects in an image.

    Object information is returned in English only. The Cloud Translation can translate English labels into various other languages.    
*/
exports.LocalizeObjects = async () => {
    const fs = require('fs');

    // Creates a client
    const client = new vision.ImageAnnotatorClient(CONFIG);

    const fileName = 'C:\\Users\\Administrador\\source\\repos\\cloud-vision-api\\files\\motorway.jpg';

    const request = {
        image: { content: fs.readFileSync(fileName) },
    };

    const [result] = await client.objectLocalization(request);
    const objects = result.localizedObjectAnnotations;
    // objects.forEach(object => {
    //   console.log(`Name: ${object.name}`);
    //   console.log(`Confidence: ${object.score}`);
    //   const vertices = object.boundingPoly.normalizedVertices;
    //   vertices.forEach(v => console.log(`x: ${v.x}, y:${v.y}`));
    // });
    // [END vision_localize_objects]
    return JSON.stringify(objects);
}

