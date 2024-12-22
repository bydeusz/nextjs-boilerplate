import Link from "next/link";
import { Badge } from "@/components/lables/Badge/Badge";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

interface DefaultCardProps {
  title: string;
  description: string;
  badge: string;
  button: string;
  href: string;
}

export default function DefaultCard({
  title,
  description,
  badge,
  button,
  href,
}: DefaultCardProps) {
  return (
    <Link
      href={href}
      className="bg-white border border-gray-300 p-6 rounded-md hover:shadow-md space-y-6">
      <div className="flex justify-between">
        <div className="font-semibold text-sm">{title}</div>
        <Badge size="sm">{badge}</Badge>
      </div>
      <div>
        <p className="text-sm">{description}</p>
      </div>
      <div className="flex items-center space-x-2 text-primary font-medium">
        <p className="text-sm">{button}</p>
        <ChevronRightIcon className="h-4 w-4" />
      </div>
    </Link>
  );
}
