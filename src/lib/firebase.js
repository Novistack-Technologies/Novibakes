// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, doc,
  getDocs,getDoc, addDoc, setDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID
};

// Initialize Firebase (reuse the existing app if one is already running,
// e.g. during Vite HMR, instead of re-initializing and throwing app/duplicate-app)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error("[firebase.js] Failed to set auth persistence:", err);
});
;
const analytics = getAnalytics(app);


export { firebaseConfig };

export { doc, collection, getDocs, getDoc, addDoc, setDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp };


// ─── Cloudinary upload (unsigned preset) ────────────────────────────────────
export async function uploadToCloudinary(file) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset    = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !preset) throw new Error("Cloudinary env vars not set");

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", preset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error("Cloudinary upload failed");
  const data = await res.json();
  return { url: data.secure_url, publicId: data.public_id };
}


export async function getCollection(col, orderByField = "createdAt") {
  const q = query(collection(db, col), orderBy(orderByField, "asc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getDocument(col, id) {
  const snap = await getDoc(doc(db, col, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}
// export async function getOrderByOrderId(orderId) {
//   const q = query(
//     collection(db, "orders"),
//     where("orderId", "==", orderId)
//   );
//   const snap = await getDocs(q);
//   if (snap.empty) return null;
//   return { id: snap.docs[0].id, ...snap.docs[0].data() };
// }

export async function addDocument(col, data) {
  return addDoc(collection(db, col), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export async function updateDocument(col, id, data) {
  return updateDoc(doc(db, col, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDocument(col, id) {
  return deleteDoc(doc(db, col, id));
}
