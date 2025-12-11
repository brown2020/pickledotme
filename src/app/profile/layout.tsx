import { AuthGuard } from "@/components/AuthGuard";

/**
 * Profile section layout with auth loading state
 * Route protection is handled by proxy.ts
 */
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
