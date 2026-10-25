import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { INITIAL_PATIENTS } from '../data/initialData';

/**
 * Helper to convert an image URL (local asset, base64 dataURL, or remote URL) to a Blob
 */
const urlToBlob = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.blob();
  } catch (error) {
    console.warn(`Could not fetch blob for ${url}:`, error);
    return null;
  }
};

/**
 * Upload an image to Firebase Cloud Storage and return download URL
 */
const uploadImageToCloudStorage = async (imageSource, storagePath) => {
  try {
    let blob = null;
    if (imageSource instanceof Blob || imageSource instanceof File) {
      blob = imageSource;
    } else if (typeof imageSource === 'string') {
      blob = await urlToBlob(imageSource);
    }

    if (!blob) {
      return { success: false, url: typeof imageSource === 'string' ? imageSource : '', error: 'Could not create file blob' };
    }

    const storageRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { success: true, url: downloadURL };
  } catch (err) {
    console.error(`Firebase Storage upload failed for ${storagePath}:`, err);
    return {
      success: false,
      url: typeof imageSource === 'string' ? imageSource : '',
      error: err.code === 'storage/unauthorized'
        ? 'Firebase Storage: Permission Denied (403). Please update your Storage Rules in Firebase Console to allow write.'
        : err.message || 'Storage upload error',
    };
  }
};

/**
 * Upload and Seed all current local data and photos into Firebase (Firestore & Storage) for doc001
 */
export const syncAllDataToFirebase = async (doctorId = 'doc001', currentAppData = {}, onProgress = () => {}) => {
  const docId = doctorId || 'doc001';
  const results = {
    profileUploaded: false,
    photosUploaded: 0,
    appointmentsUploaded: 0,
    patientsUploaded: 0,
    galleryUploaded: 0,
    storageErrors: [],
    firestoreErrors: [],
  };

  // 1. Upload Doctor Profile & Avatar Photo
  onProgress('Uploading Doctor Profile & Avatar to Firebase Storage...', 15);
  const profile = currentAppData.doctorProfile || {};
  let cloudAvatarUrl = profile.avatar;

  if (profile.avatar) {
    const ext = profile.avatar.includes('png') ? 'png' : 'jpg';
    const avatarPath = `DoctorApp/${docId}/profile/avatar_${Date.now()}.${ext}`;
    const uploadRes = await uploadImageToCloudStorage(profile.avatar, avatarPath);
    if (uploadRes.success) {
      cloudAvatarUrl = uploadRes.url;
      results.photosUploaded += 1;
    } else {
      results.storageErrors.push(`Avatar Photo: ${uploadRes.error}`);
    }
  }

  try {
    const doctorDocRef = doc(db, 'DoctorApp', docId);
    await setDoc(
      doctorDocRef,
      {
        ...profile,
        doctorId: docId,
        avatar: cloudAvatarUrl || profile.avatar || '',
        services: currentAppData.services || [],
        testimonials: currentAppData.testimonials || [],
        faqs: currentAppData.faqs || [],
        whatsappSettings: currentAppData.whatsappSettings || {},
        discountConfig: currentAppData.discountConfig || {},
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    results.profileUploaded = true;
  } catch (err) {
    console.error('Firestore error uploading profile:', err);
    results.firestoreErrors.push(`Doctor Profile: ${err.message}`);
  }

  // 2. Upload Appointments to Firestore
  onProgress('Uploading Appointments to Firestore...', 40);
  const appointmentsList = currentAppData.appointments || [];
  for (const apt of appointmentsList) {
    if (!apt.id) continue;
    try {
      const aptDocRef = doc(db, 'DoctorApp', docId, 'appointments', apt.id);
      await setDoc(
        aptDocRef,
        {
          ...apt,
          doctorId: docId,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      results.appointmentsUploaded += 1;
    } catch (err) {
      console.error(`Firestore error uploading appointment ${apt.id}:`, err);
      results.firestoreErrors.push(`Appointment ${apt.id}: ${err.message}`);
    }
  }

  // 3. Upload Patients to Firestore
  onProgress('Uploading Patient Directory to Firestore...', 65);
  const patientsMap = {};

  if (Array.isArray(currentAppData.patients)) {
    currentAppData.patients.forEach((p) => {
      if (p.mobile || p.id) {
        const key = p.mobile || p.id;
        patientsMap[key] = { ...p, doctorId: docId };
      }
    });
  }

  appointmentsList.forEach((apt) => {
    const key = apt.mobile;
    if (key && !patientsMap[key]) {
      patientsMap[key] = {
        id: `PAT-${key.replace(/\D/g, '')}`,
        name: apt.patientName,
        mobile: apt.mobile,
        email: apt.email || '',
        age: apt.age || '',
        gender: apt.gender || '',
        address: apt.address || '',
        lastVisit: apt.preferredDate || '',
        lastProblem: apt.problem || '',
        totalVisits: 1,
        lastAppointmentId: apt.id,
        lastAppointmentStatus: apt.status || 'Pending',
        doctorId: docId,
        createdAt: apt.createdAt || new Date().toISOString(),
      };
    } else if (key && patientsMap[key]) {
      patientsMap[key].lastVisit = apt.preferredDate || patientsMap[key].lastVisit;
      patientsMap[key].lastProblem = apt.problem || patientsMap[key].lastProblem;
      patientsMap[key].lastAppointmentId = apt.id || patientsMap[key].lastAppointmentId;
      patientsMap[key].lastAppointmentStatus = apt.status || patientsMap[key].lastAppointmentStatus;
    }
  });

  // If still empty, seed default INITIAL_PATIENTS
  if (Object.keys(patientsMap).length === 0 && Array.isArray(INITIAL_PATIENTS)) {
    INITIAL_PATIENTS.forEach((p) => {
      const key = p.mobile || p.id;
      patientsMap[key] = { ...p, doctorId: docId };
    });
  }

  for (const pat of Object.values(patientsMap)) {
    const patientId = pat.id || `PAT-${(pat.mobile || '').replace(/\D/g, '') || Date.now()}`;
    try {
      const patDocRef = doc(db, 'DoctorApp', docId, 'patients', patientId);
      await setDoc(
        patDocRef,
        {
          ...pat,
          id: patientId,
          doctorId: docId,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      results.patientsUploaded += 1;
    } catch (err) {
      console.error(`Firestore error uploading patient ${patientId}:`, err);
      results.firestoreErrors.push(`Patient ${patientId}: ${err.message}`);
    }
  }

  // 4. Upload Clinic Gallery Photos to Firebase Storage & Firestore
  onProgress('Uploading Clinic Gallery photos to Cloud Storage...', 85);
  const galleryItems = currentAppData.gallery || [];
  for (const gal of galleryItems) {
    if (!gal.id) continue;
    let storageUrl = gal.imageUrl;

    if (gal.imageUrl) {
      const photoPath = `DoctorApp/${docId}/gallery/${gal.id}_${Date.now()}.jpg`;
      const uploadRes = await uploadImageToCloudStorage(gal.imageUrl, photoPath);
      if (uploadRes.success) {
        storageUrl = uploadRes.url;
        results.photosUploaded += 1;
      } else {
        results.storageErrors.push(`Gallery "${gal.title}": ${uploadRes.error}`);
      }
    }

    try {
      const galDocRef = doc(db, 'DoctorApp', docId, 'gallery', gal.id);
      await setDoc(
        galDocRef,
        {
          ...gal,
          imageUrl: storageUrl,
          doctorId: docId,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      results.galleryUploaded += 1;
    } catch (err) {
      console.error(`Firestore error uploading gallery ${gal.id}:`, err);
      results.firestoreErrors.push(`Gallery ${gal.id}: ${err.message}`);
    }
  }

  const hasStorageErrors = results.storageErrors.length > 0;
  const hasFirestoreErrors = results.firestoreErrors.length > 0;
  const success = !hasStorageErrors && !hasFirestoreErrors;

  onProgress(success ? 'Sync Complete! All data and photos are live in Firebase.' : 'Sync completed with permission notices.', 100);

  return {
    success,
    hasStorageErrors,
    hasFirestoreErrors,
    results,
  };
};
