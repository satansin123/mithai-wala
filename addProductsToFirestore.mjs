import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { join } from 'path';

// Initialize the Admin SDK with your Firebase project configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serviceAccountRaw = fs.readFileSync(`${__dirname}/sweets-ecom-firebase-adminsdk-cavh9-3b332d287e.json`, 'utf-8');
const serviceAccount = JSON.parse(serviceAccountRaw);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://sweets-ecom.firebaseio.com' // Replace with your project ID
});

const db = admin.firestore();

// Load product data from JSON file
const productsDataPath = join(__dirname, 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsDataPath, 'utf-8'));

// Function to add product data to Firestore
async function addProductsToFirestore(productsData) {
  try {
    for (const product of productsData) {
      // Create a document reference with a unique ID or specify your own ID structure
      const docRef = db.collection(product.collection).doc();

      // Add product data to the document
      await docRef.set({
        fit: product.fit,
        description: product.description,
        model: product.model,
        price: product.price,
        slug: product.slug,
        type: product.type,
        variants: product.variants,
      });
      console.log(`Product added successfully with ID: ${docRef.id}`);
    }
  } catch (error) {
    console.error('Error adding products:', error);
  }
}

addProductsToFirestore(productsData);