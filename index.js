const express = require('express');
const app = express();

const formidable = require('formidable');

app.post('/api/upload', (req, res, next) => {
  // Imports Google Cloud client library
  const vision = require('@google-cloud/vision');

  // Creates Vision service client
  const client = new vision.ImageAnnotatorClient();

  // Parses reqest body to image buffer
  const form = formidable({ multiples: false });

  let fileBuffer = null;
  
  form.onPart = (part) => {
    part.on('data', (buffer) => {
      if (part.mime) {
        fileBuffer = Buffer.from(buffer);
      }
    });
  };

  const myPromise = new Promise ((resolve, reject) => {

    // Set response headers
    res.set('Access-Control-Allow-Origin', "*");
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Request-Headers', 'Content-Type');

    const returnedReqestBody = {
      image: { content: null },
      // All features can be find here
      // https://googleapis.dev/nodejs/vision/latest/google.cloud.vision.v1.Feature.html
      // features: [
      //   {type: 'DOCUMENT_TEXT_DETECTION'}
      // ],
    };

    form.parse(req, (err) => {
      // Set promise state to Reject
      if (err)  reject(err);

      // Construct request body for Vision API
      returnedReqestBody.image.content = fileBuffer;
      console.log('returned request body:: ', returnedReqestBody);
    });
    resolve(returnedReqestBody);
  })
  .then((visionRequestBody) => {
    // Call Vision API
    return client.documentTextDetection(visionRequestBody);
  })
  .then(response => {
    // Return success
    console.log('VISION API SUCCESS');
    console.log(response[0].fullTextAnnotation);
    res.status(200).send(response[0].fullTextAnnotation);
  })
  .catch(error => {
    // Return Error
    console.log(error);
    res.status(500).send(error);
  });
});
 
app.listen(8081, () => {
  console.log('Server listening on http://localhost:8081 ...');
});


exports.detectText = (cloudFunctionRequest, res) => {

  const AUTH_API = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  console.log('content-type::', cloudFunctionRequest.get('content-type'));
  console.log('body:: ', cloudFunctionRequest.body);

  res.status(200).send('SUCCESS');

};