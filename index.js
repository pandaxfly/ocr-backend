exports.detectText = (req, res) => {

  const AUTH_API = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  // Imports Google Cloud client library
  const vision = require('@google-cloud/vision');

  // Creates Vision service client
  const client = new vision.ImageAnnotatorClient();

  // Construct request
  const request = {
    image: {
      content: req.body,
    },
    // All features can be find here
    // https://googleapis.dev/nodejs/vision/latest/google.cloud.vision.v1.Feature.html
    // features: [
    //   {type: 'DOCUMENT_TEXT_DETECTION'}
    // ],
  };

  // Call GCP Vision Service
  client.documentTextDetection(request)
    .then(response => {
      res.status(200).send(response[0].fullTextAnnotation);
    })
    .catch(err => {
      res.status(500).send(err);
    });
};