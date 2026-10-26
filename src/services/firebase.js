import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Firebase configuration using environment variables
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'doctor-app-a26e4.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'doctor-app-a26e4',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'doctor-app-a26e4.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '673191812078',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:673191812078:web:e4cdd2d3ac04b36853ccff',
};

// Initialize Firebase safely (avoid duplicate app initialization in dev / HMR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Upload any File or Blob to Firebase Storage and retrieve public download URL
 * @param {File|Blob} file - The file to upload
 * @param {string} storagePath - e.g. 'DoctorApp/doc001/gallery/img_1.jpg'
 * @returns {Promise<string>} Download URL
 */
export const uploadFileToStorage = async (file, storagePath) => {
  try {
    const fileRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Firebase Storage upload error:', error);
    throw error;
  }
};

/**
 * Delete a file from Firebase Storage given its full URL or path
 */
export const deleteFileFromStorage = async (filePathOrUrl) => {
  try {
    const fileRef = ref(storage, filePathOrUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.warn('Firebase Storage delete warning (file may not exist):', error);
  }
};

/**
 * Helper to determine current active doctor ID from URL query params, env, or fallback
 */
export const getActiveDoctorId = () => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const urlDocId = params.get('doctorId');
    if (urlDocId) return urlDocId;
  }
  return import.meta.env.VITE_DOCTOR_ID || 'doc001';
};

export default app;
