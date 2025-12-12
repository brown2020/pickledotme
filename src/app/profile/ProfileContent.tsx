import { PageBackground } from "@/components/layout/page/PageBackground";
import { ProfileClient } from "./_components/ProfileClient";

/**
 * Profile content - AuthGuard handled by layout
 */
export function ProfileContent() {
  return (
    <PageBackground variant="default-with-padding">
      <ProfileClient />
    </PageBackground>
  );
}
