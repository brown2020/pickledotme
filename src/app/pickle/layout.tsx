import { AuthGuard } from "@/components/AuthGuard";

/**
 * Pickle section layout with auth loading state
 * Route protection is handled by proxy.ts
 */
export default function PickleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
