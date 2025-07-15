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

  const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider)
      .then((result) => {
        // console.log("Google signed-in user:", result.user);
      });
  };


  const signUp = (email, password, name) => {
    // Register user with email/password
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // After signing up, update the profile with name
        // console.log("Signed up user:", user);
        return updateProfile(user, { displayName: name });
      })
      .then(() => {
        setUser({ ...auth.currentUser });
      });
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
    // .then((userCredential) => {
    //   console.log("Signed in user:", userCredential.user);
    // });
  };

  const updateUserProfile = async (displayName, photoURL) => {
    await updateProfile(auth.currentUser, { displayName, photoURL });
    setUser({ ...auth.currentUser });
  };

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
              timer: 1500
            });
          })
          .catch((error) => {
            console.error("Logout error:", error);
            Swal.fire("Error", "Failed to log out.", "error");
          });
      }
    });
  };

  const signOutUser = () => {
        setIsLoading(true);
        return signOut(auth)
    }


  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
      // console.log("User in the auth state change", currentUser)
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
