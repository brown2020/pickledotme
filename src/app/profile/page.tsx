import { Metadata } from "next";
import { ProfileContent } from "./ProfileContent";

export const metadata: Metadata = {
  title: "Your Profile",
  description:
    "View your game statistics, recent activity, and track your progress across all Pickle.me games.",
  openGraph: {
    title: "Your Profile | Pickle.me",
    description: "View your game statistics and track your progress.",
  },
};

export default function ProfilePage() {
  return <ProfileContent />;
}
