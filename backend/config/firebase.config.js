import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let firebaseAdmin = null;

// Only initialize Firebase if all required environment variables are present
if (process.env.FIREBASE_PROJECT_ID && 
    process.env.FIREBASE_CLIENT_EMAIL && 
    process.env.FIREBASE_PRIVATE_KEY) {
  try {
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error.message);
  }
} else {
  console.log('Firebase configuration incomplete. Social login will not be available.');
}

export default firebaseAdmin;
