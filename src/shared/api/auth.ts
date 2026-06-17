import {
  signInWithPopup,
  signOut,
  deleteUser,
} from "firebase/auth";
import { collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";

export const authAPI = {
  signInWithGoogle: async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  },

  logout: async () => {
    await signOut(auth);
  },

  deleteAccount: async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    // 사용자의 모든 사이트 삭제
    const sitesRef = collection(db, "sites");
    const q = query(sitesRef, where("userId", "==", user.uid));
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Firebase Auth 계정 삭제
    await deleteUser(user);
  },
};
