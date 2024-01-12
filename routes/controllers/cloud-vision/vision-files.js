require("dotenv").config();
const vision = require('@google-cloud/vision');
const { stringify } = require("querystring");
const fs = require('fs').promises;

const CREDENTIALS = JSON.parse(JSON.stringify({
  }));  

const CONFIG = {
    credentials : {
        private_key: CREDENTIALS.private_key,
        client_email: process.env.CLIENT_EMAIL,
    }
}

// You can send multiple files to be annotated, this sample demonstrates how to do this with one file. 
// If you want to use multiple files, you have to create a request object for each file that you want annotated.
exports.BatchAnnotateFiles = async () => {
    const client = new vision.ImageAnnotatorClient();

    const inputConfig = {
        mimeType: 'application/pdf',
        content: await fs.readFile("C:\\Users\\Administrador\\source\\repos\\cloud-vision-api\\files\\resume.pdf"),
    };

    // Set the type of annotation you want to perform on the file
    // https://cloud.google.com/vision/docs/reference/rpc/google.cloud.vision.v1#google.cloud.vision.v1.Feature.Type
    const features = [{ type: 'DOCUMENT_TEXT_DETECTION' }];

    // Build the request object for that one file. Note: for additional files you have to create
    // additional file request objects and store them in a list to be used below.
    // Since we are sending a file of type `application/pdf`, we can use the `pages` field to
    // specify which pages to process. The service can process up to 5 pages per document file.
    // https://cloud.google.com/vision/docs/reference/rpc/google.cloud.vision.v1#google.cloud.vision.v1.AnnotateFileRequest
    const fileRequest = {
        inputConfig: inputConfig,
        features: features,
        // Annotate the first two pages and the last one (max 5 pages)
        // First page starts at 1, and not 0. Last page is -1.
        pages: [1, 2, -1],
    };

    // Add each `AnnotateFileRequest` object to the batch request.
    const request = {
        requests: [fileRequest],
    };

    // Make the synchronous batch request.
    const [result] = await client.batchAnnotateFiles(request);

    // Process the results, just get the first result, since only one file was sent in this
    // sample.
    const responses = result.responses[0].responses;

    for (const response of responses) {
        console.log(`Full text: ${response.fullTextAnnotation.text}`);
        for (const page of response.fullTextAnnotation.pages) {
            for (const block of page.blocks) {
                console.log(`Block confidence: ${block.confidence}`);
                for (const paragraph of block.paragraphs) {
                    console.log(` Paragraph confidence: ${paragraph.confidence}`);
                    for (const word of paragraph.words) {
                        const symbol_texts = word.symbols.map(symbol => symbol.text);
                        const word_text = symbol_texts.join('');
                        console.log(
                            `  Word text: ${word_text} (confidence: ${word.confidence})`
                        );
                        for (const symbol of word.symbols) {
                            console.log(
                                `   Symbol: ${symbol.text} (confidence: ${symbol.confidence})`
                            );
                        }
                    }
                }
            }
        }
    }
}

exports.DetectFulltext = async () => {
    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    const fileName = './images/la-siesta.png';

    // Read a local image as a text document
    const [result] = await client.documentTextDetection(fileName);
    const fullTextAnnotation = result.fullTextAnnotation;
    console.log(`Full text: ${fullTextAnnotation.text}`);
    fullTextAnnotation.pages.forEach(page => {
        page.blocks.forEach(block => {
            console.log(`Block confidence: ${block.confidence}`);
            block.paragraphs.forEach(paragraph => {
                console.log(`Paragraph confidence: ${paragraph.confidence}`);
                paragraph.words.forEach(word => {
                    const wordText = word.symbols.map(s => s.text).join('');
                    console.log(`Word text: ${wordText}`);
                    console.log(`Word confidence: ${word.confidence}`);
                    word.symbols.forEach(symbol => {
                        console.log(`Symbol text: ${symbol.text}`);
                        console.log(`Symbol confidence: ${symbol.confidence}`);
                    });
                });
            });
        });
    });
    // [END vision_fulltext_detection]
    return fullTextAnnotation.text;
}

exports.DetectLandmarks = async () => {
    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    const fileName = 'C:\\Users\\Administrador\\source\\repos\\cloud-vision-api\\files\\family.jpg';

    // Performs landmark detection on the local file
    const [result] = await client.landmarkDetection(fileName);
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

