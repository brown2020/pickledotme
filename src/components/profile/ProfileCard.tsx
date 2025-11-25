import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

interface ProfileCardProps {
  title: string;
  children: React.ReactNode;
}

export function ProfileCard({ title, children }: ProfileCardProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
