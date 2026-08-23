// ==========================================================================
// Authentication Module (Firebase + Seamless Local Storage Fallback)
// ==========================================================================

import { auth, db, isFirebaseConfigured } from './firebase-config.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { showToast } from './utils.js';

// Local storage key constants for demo fallback
const LOCAL_USERS_KEY = 'iconsult_local_users';
const LOCAL_SESSION_KEY = 'iconsult_current_session';

/**
 * Validate username format (3-20 alphanumeric characters or underscores)
 */
export function isValidUsername(username) {
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(username);
}

/**
 * Check if username is already taken
 */
export async function isUsernameAvailable(username) {
  const cleanUsername = username.trim().toLowerCase();
  
  if (isFirebaseConfigured && db) {
    const usernameRef = doc(db, 'usernames', cleanUsername);
    const snap = await getDoc(usernameRef);
    return !snap.exists();
  } else {
    const localUsers = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '{}');
    return !localUsers[cleanUsername];
  }
}

/**
 * Register new user with Email, Password & Unique Username
 */
export async function registerUser(email, password, username, displayName) {
  const cleanUsername = username.trim().toLowerCase();
  
  if (!isValidUsername(cleanUsername)) {
    throw new Error('Username must be 3-20 characters long and contain only letters, numbers, or underscores.');
  }

  const available = await isUsernameAvailable(cleanUsername);
  if (!available) {
    throw new Error(`Username "@${cleanUsername}" is already taken. Please choose another.`);
  }

  const defaultAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`;

  if (isFirebaseConfigured && auth && db) {
    // Firebase Registration
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userProfile = {
      uid: user.uid,
      username: cleanUsername,
      displayName: displayName.trim() || cleanUsername,
      tagline: 'Welcome to my official profile page!',
      bio: 'Digital creator, developer, and builder. Check out my featured links below.',
      avatarUrl: defaultAvatar,
      theme: 'midnight',
      links: [
        {
          id: 'link-1',
          title: 'Welcome to my page',
          url: 'https://github.com',
          icon: 'fa-solid fa-star',
          badge: 'Featured',
          active: true
        }
      ],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
    await setDoc(doc(db, 'usernames', cleanUsername), { uid: user.uid });
  } else {
    // LocalStorage Fallback Registration
    const uid = 'local-uid-' + Date.now();
    const userProfile = {
      uid,
      email,
      password,
      username: cleanUsername,
      displayName: displayName.trim() || cleanUsername,
      tagline: 'Welcome to my official profile page!',
      bio: 'Digital creator, developer, and builder. Check out my featured links below.',
      avatarUrl: defaultAvatar,
      theme: 'midnight',
      links: [
        {
          id: 'link-1',
          title: 'Welcome to my page',
          url: 'https://github.com',
          icon: 'fa-solid fa-star',
          badge: 'Featured',
          active: true
        }
      ],
      createdAt: new Date().toISOString()
    };

    const localUsers = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '{}');
    localUsers[cleanUsername] = userProfile;
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(localUsers));
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({ uid, username: cleanUsername }));
  }

  showToast('Account registered successfully!', 'success');
  window.location.href = 'dashboard.html';
}

/**
 * Log in existing user
 */
export async function loginUser(email, password) {
  if (isFirebaseConfigured && auth) {
    await signInWithEmailAndPassword(auth, email, password);
  } else {
    // LocalStorage Fallback Authentication
    const localUsers = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '{}');
    const matchedUsername = Object.keys(localUsers).find(
      u => localUsers[u].email === email && localUsers[u].password === password
    );

    if (!matchedUsername) {
      throw new Error('Invalid credentials. Tip: Click "1-Click Demo Login" below or register a new account.');
    }

    const user = localUsers[matchedUsername];
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({ uid: user.uid, username: user.username }));
  }

  showToast('Logged in successfully!', 'success');
  window.location.href = 'dashboard.html';
}

/**
 * Instant 1-Click Demo Login
 */
export async function loginDemoAccount() {
  const demoProfile = {
    uid: 'demo-uid-123',
    email: 'demo@iconsult.com',
    username: 'demo',
    displayName: 'Dr. Alex Rivers',
    tagline: 'Clinical Psychologist & Wellness Consultant',
    bio: 'Helping individuals cultivate mental clarity, resilience, and personal growth.',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=alex_rivers',
    theme: 'psychologist',
    links: [
      { id: '1', title: 'Schedule a Consultation', url: 'https://calendar.google.com', badge: 'Book Now', active: true },
      { id: '2', title: 'Official Website & Articles', url: 'https://github.com', badge: 'Featured', active: true },
      { id: '3', title: 'Listen to Podcast on Spotify', url: 'https://spotify.com', badge: 'Podcast', active: true }
    ]
  };

  const localUsers = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '{}');
  localUsers['demo'] = demoProfile;
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(localUsers));
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({ uid: 'demo-uid-123', username: 'demo' }));

  showToast('Logged into Demo Account!', 'success');
  window.location.href = 'dashboard.html';
}

/**
 * Send password reset email
 */
export async function resetPassword(email) {
  if (!email) throw new Error('Please enter your email address.');
  if (isFirebaseConfigured && auth) {
    await sendPasswordResetEmail(auth, email);
    showToast('Password reset link sent to your email.', 'info');
  } else {
    showToast('Demo Mode: Password reset simulated for ' + email, 'info');
  }
}

/**
 * Sign out user
 */
export async function logoutUser() {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  } else {
    localStorage.removeItem(LOCAL_SESSION_KEY);
  }
  showToast('Signed out successfully.', 'info');
  window.location.href = 'auth.html';
}

/**
 * Guard route for protected pages
 */
export function protectRoute(callback) {
  if (isFirebaseConfigured && auth) {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = 'auth.html';
      } else if (callback) {
        callback(user);
      }
    });
  } else {
    let session = JSON.parse(localStorage.getItem(LOCAL_SESSION_KEY) || 'null');
    
    // Auto-initialize demo session if none exists
    if (!session) {
      session = { uid: 'demo-uid-123', username: 'demo' };
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));
    }
    
    if (callback) {
      callback({ uid: session.uid, username: session.username });
    }
  }
}
