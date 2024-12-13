const { Firestore } = require('@google-cloud/firestore');
const path = require('path');

const pathKey = path.resolve('./Stevanus-Submission.json')
     
async function storeData(id, data) {

  try {
    const db = new Firestore({
      projectId: 'submissionmlgc-stevanus',
      keyFilename: pathKey,
    });
 
    const predictCollection = db.collection('predict');
    return predictCollection.doc(id).set(data);
  }catch(error) {
    console.error(error);
  }
}
 
module.exports = storeData;