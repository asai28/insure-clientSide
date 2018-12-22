import { auth } from './firebase';

// Register
export const doCreateUserWithEmailAndPassword = (email, password) =>
  auth.createUserWithEmailAndPassword(email, password);

// Login
export const doSignInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

// Logout
export const doSignOut = () =>
  auth.signOut();

//Fetch current UserId
export const getUserId = () => {
  return auth.currentUser.uid;
}