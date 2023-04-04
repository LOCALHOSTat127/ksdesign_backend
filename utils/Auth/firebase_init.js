import admin from "firebase-admin";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const DB_SCC_CERT = require("../../data/ksdesign-b376a-firebase-adminsdk-i21ix-9d4fba04fa.json");



admin.initializeApp({
    credential: admin.credential.cert(DB_SCC_CERT)
});

export const FIREBASE_DB = admin.firestore();
