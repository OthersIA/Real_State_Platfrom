import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase.config.js";
import { AuthContext } from "./AuthContext";
import Swal from "sweetalert2";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const googleProvider = new GoogleAuthProvider();

  // ✅ Google sign-in returns the full result
   const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        // Reload to get fresh profile info
        await auth.currentUser.reload();
        setUser(auth.currentUser);
        return result;
      });
  };

  // ✅ Email/password sign up returns userCredential
  const signUp = (email, password, name) => {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return updateProfile(user, { displayName: name }).then(() => {
          setUser({ ...auth.currentUser });
          return userCredential; // Return so caller gets userCredential
        });
      });
  };

  // ✅ Email/password sign in
  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ✅ Profile update
  const updateUserProfile = async (displayName, photoURL) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, { displayName, photoURL });
    setUser({ ...auth.currentUser });
  };

  // ✅ SweetAlert logout with confirmation
  const logOut = () => {
    return Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        return signOut(auth)
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Logged out!",
              text: "You have been successfully logged out.",
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((error) => {
            console.error("Logout error:", error);
            Swal.fire("Error", "Failed to log out.", "error");
          });
      }
    });
  };

  // ✅ Simple sign out (without SweetAlert)
  const signOutUser = () => {
    setIsLoading(true);
    return signOut(auth);
  };

  // ✅ Listen for auth state change
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unSubscribe();
  }, []);

  const userInfo = {
    user,
    setUser,
    isLoading,
    signUp,
    signIn,
    signInWithGoogle,
    updateUserProfile,
    logOut,
    signOutUser,
  };

  return (
    <AuthContext.Provider value={userInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
