const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
    try {
      const model = await tf.loadGraphModel('https://storage.googleapis.com/model-stevanus/model.json');
      console.log("Model loaded successfully");
      return model;
    } catch (error) {
      console.error("Error loading model from URL:", error);
      console.error("Stack trace:", error.stack);  // Log the stack trace for more details
      throw new Error("Model loading failed");
    }
  }
  

module.exports = loadModel; // Ensure the function is exported
