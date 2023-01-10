import {
  getDoc,
  updateDoc,
  doc,
  deleteDoc,
  DocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase";
import { useContext } from "react";
import { Context } from "../store/app-context";

const useFireStore = () => {
  const { uid } = useContext(Context);

  const userRef = doc(db, "users", uid);
  const sendRequest = async (
    task: "updateDoc" | "getDoc",
    payload?: {}
  ): Promise<any> => {
    if (task === "updateDoc") {
      try {
        const response = await updateDoc<any>(userRef, payload);

        return response;
      } catch (e) {
        alert(e);
      }
    } else if (task === "getDoc") {
      try {
        const response = await getDoc(userRef);
        return response;
      } catch (e) {
        alert(e);
      }
    }
  };

  return sendRequest;
};

export default useFireStore;
