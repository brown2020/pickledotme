import { db } from "@/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export const saveDilemma = async (
  userId: string,
  dilemma: string,
  advice: string
) => {
  const dilemmasCollection = collection(db, "dilemmas");
  await addDoc(dilemmasCollection, {
    userId,
    dilemma,
    advice,
    createdAt: new Date(),
  });
};
