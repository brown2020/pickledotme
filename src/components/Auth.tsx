import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";

const provider = new GoogleAuthProvider();

interface AuthProps {
  userId: string | null; // Accepts userId string or null
}

export default function Auth({ userId }: AuthProps) {
  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {userId ? (
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded mt-4"
        >
          Sign Out
        </button>
      ) : (
        <button
          onClick={signIn}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}
