const { Firestore } = require('@google-cloud/firestore');
const path = require('path');

// Ensure the path is correct, and resolve the path to the service account key
const pathKey = path.resolve('./submissionmlgc-stevanus-aa6ccd022975.json'); 

async function storeData(id, data) {
  try {
    // Initialize Firestore with the project ID and key file
    const db = new Firestore({
      projectId: 'submissionmlgc-stevanus',
      keyFilename: pathKey,  // Use the correct path to the service account key
    });
    
    // Reference the 'predict' collection
    const predictCollection = db.collection('stevanus');
    
    // Store data in the document with the specified ID
    await predictCollection.doc(id).set(data);
    
    console.log("Data stored successfully with ID:", id);  // Log success
  } catch (error) {
    console.error("Error storing data:", error);  // Log error if any occurs
    throw new Error("Error storing data in Firestore");  // Optionally throw the error for further handling
  }
}

module.exports = storeData;
