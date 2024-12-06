import Link from "next/link";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  showLink?: boolean;
}

export default function FeatureCard({
  icon,
  title,
  description,
  link,
  showLink = false,
}: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {showLink && (
        <Link
          href={link}
          className="text-green-600 hover:text-green-700 font-medium"
        >
          Try it out →
        </Link>
      )}
    </div>
  );
}
