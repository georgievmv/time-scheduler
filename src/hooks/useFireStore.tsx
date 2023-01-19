import { getDoc, updateDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useContext } from "react";
import { Context } from "../store/app-context";

const useFireStore = () => {
  const { uid } = useContext(Context);

  const userRef = doc(db, "users", uid);
  const sendRequest = async (
    task: "updateDoc" | "getDoc" | "setDoc",
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
    } else if (task === "setDoc") {
      try {
        const response = await setDoc(userRef, payload);
        return response;
      } catch (e) {
        alert(e);
      }
    }
  };

  return sendRequest;
};

export default useFireStore;
