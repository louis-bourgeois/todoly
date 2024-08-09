// firebaseConfig.js
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccount = path.join(
  __dirname,
  "./todoly-430912-firebase-adminsdk-np6ok-88e1a12385.json"
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "todoly-430912.appspot.com",
});

const bucket = admin.storage().bucket();

export { bucket };
