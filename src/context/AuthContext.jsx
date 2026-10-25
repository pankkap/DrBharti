import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { getDoctorProfile, saveDoctorProfile } from '../services/doctorFirebaseService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('doctor_app_admin');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // Synchronize Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const activeDocId = import.meta.env.VITE_DOCTOR_ID || firebaseUser.uid || 'doc001';
        const userObj = {
          uid: firebaseUser.uid,
          doctorId: activeDocId,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || '',
          role: 'Admin',
        };

        setAdminUser(userObj);
        localStorage.setItem('doctor_app_admin', JSON.stringify(userObj));

        // Sync or initialize profile in Firestore if not already present
        try {
          const existingProfile = await getDoctorProfile(activeDocId);
          if (!existingProfile) {
            await saveDoctorProfile(activeDocId, {
              doctorId: activeDocId,
              name: firebaseUser.displayName || 'Doctor',
              email: firebaseUser.email,
              avatar: firebaseUser.photoURL || '',
              createdAt: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.warn('Could not sync initial doctor profile in Firestore:', err);
        }
      } else {
        // If not authenticated via Firebase, check if using local demo admin session
        const saved = localStorage.getItem('doctor_app_admin');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.isDemo) {
              setAdminUser(parsed);
              setLoading(false);
              return;
            }
          } catch (e) {}
        }
        setAdminUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Email & Password Sign In
  const loginWithEmail = async (email, password) => {
    setAuthError('');
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      const activeDocId = import.meta.env.VITE_DOCTOR_ID || user.uid || 'doc001';
      const userObj = {
        uid: user.uid,
        doctorId: activeDocId,
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        photoURL: user.photoURL || '',
        role: 'Admin',
      };
      setAdminUser(userObj);
      localStorage.setItem('doctor_app_admin', JSON.stringify(userObj));
      return { success: true, user: userObj };
    } catch (error) {
      console.warn('Firebase Email login failed, checking demo fallback:', error.code, error.message);

      // Fallback: If user enters the default demo credentials or auth provider isn't enabled yet
      if (email === 'admin@doctor.com' && password === 'admin123') {
        const demoUser = {
          uid: 'demo_doctor_admin',
          doctorId: 'demo_doctor_admin',
          name: 'Dr. John Smith (Admin)',
          email: 'admin@doctor.com',
          role: 'Admin',
          isDemo: true,
        };
        setAdminUser(demoUser);
        localStorage.setItem('doctor_app_admin', JSON.stringify(demoUser));
        return { success: true, user: demoUser };
      }

      const msg = error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password'
        ? 'Invalid email or password. Please check your credentials.'
        : error.message || 'Authentication error. Please try again.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  // Register New Doctor with Email & Password
  const registerWithEmail = async (email, password, doctorInfo = {}) => {
    setAuthError('');
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      if (doctorInfo.name) {
        await updateProfile(user, { displayName: doctorInfo.name });
      }

      const activeDocId = import.meta.env.VITE_DOCTOR_ID || user.uid || 'doc001';
      const userObj = {
        uid: user.uid,
        doctorId: activeDocId,
        name: doctorInfo.name || user.email.split('@')[0],
        email: user.email,
        role: 'Admin',
      };

      setAdminUser(userObj);
      localStorage.setItem('doctor_app_admin', JSON.stringify(userObj));

      // Create new Doctor Profile document in Firestore under DoctorApp/{activeDocId}
      await saveDoctorProfile(activeDocId, {
        doctorId: activeDocId,
        name: doctorInfo.name || 'Doctor',
        email: user.email,
        title: doctorInfo.title || 'General Physician & Specialist',
        specialization: doctorInfo.specialization || 'General Healthcare',
        phone: doctorInfo.phone || '',
        clinicName: doctorInfo.clinicName || 'Care Dental & Medical Clinic',
        createdAt: new Date().toISOString(),
      });

      return { success: true, user: userObj };
    } catch (error) {
      console.error('Firebase registration error:', error);
      const msg = error.code === 'auth/email-already-in-use'
        ? 'This email is already registered. Please sign in instead.'
        : error.message || 'Registration failed.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  // Google Sign In (Popup)
  const loginWithGoogle = async () => {
    setAuthError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userObj = {
        uid: user.uid,
        doctorId: user.uid,
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        photoURL: user.photoURL || '',
        role: 'Admin',
      };

      setAdminUser(userObj);
      localStorage.setItem('doctor_app_admin', JSON.stringify(userObj));

      // Save / merge doctor profile in Firestore
      await saveDoctorProfile(user.uid, {
        doctorId: user.uid,
        name: user.displayName || 'Doctor',
        email: user.email,
        avatar: user.photoURL || '',
        lastLogin: new Date().toISOString(),
      });

      return { success: true, user: userObj };
    } catch (error) {
      console.error('Google Sign In error:', error);
      const msg = error.code === 'auth/popup-closed-by-user'
        ? 'Sign in popup was closed before completing.'
        : error.message || 'Failed to sign in with Google.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  // Legacy login method for backward compatibility
  const login = (email, password) => {
    return loginWithEmail(email, password);
  };

  // Sign Out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase signout error:', err);
    }
    setAdminUser(null);
    localStorage.removeItem('doctor_app_admin');
  };

  const doctorId = import.meta.env.VITE_DOCTOR_ID || adminUser?.doctorId || adminUser?.uid || 'doc001';

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        doctorId,
        isAuthenticated: !!adminUser,
        loading,
        authError,
        login,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
