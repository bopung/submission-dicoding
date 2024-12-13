const predictClassification = require("../services/InferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");
const { Firestore } = require('@google-cloud/firestore');
const path = require('path');

const pathKey = path.resolve('./submissionmlgc-stevanus-aa6ccd022975.json'); 

// Initialize Firestore with the project ID and key file
const db = new Firestore({
  projectId: 'submissionmlgc-stevanus',
  keyFilename: pathKey, // Ensure the path to the service account key file is correct
});

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  console.log("Received image data:", image); // Add logging for the received image data
  const { model } = request.server.app;
  const { confidenceScore, label, suggestion } = await predictClassification(
    model,
    image
  );
  console.log("Prediction results:", confidenceScore, label, suggestion); // Log prediction results
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id: id,
    result: label,
    suggestion: suggestion,
    createdAt: createdAt,
  };

  await storeData(id, data);

  const response = h.response({
    status: "success",
    message:
      confidenceScore > 99
        ? "Model is predicted successfully"
        : "Model is predicted successfully but under threshold. Please use the correct picture",
    data,
  });
  response.code(201);
  return response;
}


async function predictHistories(request, h) {
  const { model } = request.server.app;

  // Use Firestore to get prediction histories
  const predictCollection = db.collection("stevanus");  // This references the 'stevanus' collection
  const snapshot = await predictCollection.get();
  const result = [];
  
  snapshot.forEach((doc) => {
    result.push({
      id: doc.id,
      history: {
        result: doc.data().result,
        createdAt: doc.data().createdAt,
        suggestion: doc.data().suggestion,
        id: doc.data().id,
      },
    });
  });
  
  return h.response({
    status: "success",
    data: result,
  });
}

module.exports = { postPredictHandler, predictHistories };
