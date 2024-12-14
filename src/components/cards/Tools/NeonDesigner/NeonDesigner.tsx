import Link from "next/link";
import { Badge } from "@/components/lables/Badge/Badge";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

interface NeonDesignerProps {
  lang: string;
  t: any;
}

export default function NeonDesigner({ lang, t }: NeonDesignerProps) {
  return (
    <Link
      href={`/${lang}/tools/neon-designer`}
      className="bg-white border border-gray-300 p-6 rounded-md hover:shadow-md space-y-4">
      <div className="flex justify-between">
        <div className="font-semibold text-sm">
          {t.tools.neonDesigner.title}
        </div>
        <Badge size="sm">AI</Badge>
      </div>
      <div>
        <p className="text-sm">{t.tools.neonDesigner.desc}</p>
      </div>
      <div className="flex items-center space-x-2 text-pink-500 font-semibold">
        <p className="text-sm">{t.tools.neonDesigner.button}</p>
        <ChevronRightIcon className="h-4 w-4" />
      </div>
    </Link>
  );
}
