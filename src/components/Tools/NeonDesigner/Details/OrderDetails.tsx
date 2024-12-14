import Link from "next/link";
import Image from "next/image";

import {
  CalendarDaysIcon,
  PaintBrushIcon,
  SwatchIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";

interface OrderDetailsProps {
  item: any;
}

export default function OrderDetails({ item }: OrderDetailsProps) {
  return (
    <div className="overflow-y-scroll h-full w-2/6 p-4 bg-white border rounded-md space-y-4">
      <div>
        <h2 className="text-base font-bold">
          Order voor{" "}
          {item.column_values[4].text ? item.column_values[4].text : item.name}
        </h2>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold">Voorbeeld:</p>
        <div className="relative bg-gray-100 size-64 rounded-sm overflow-hidden">
          {item.column_values[6].text &&
          /\.(jpg|jpeg|png|webp)$/.test(item.column_values[6].text) ? (
            <Image
              src={item.column_values[6].text}
              alt="Logo"
              className="absolute w-full h-full object-center object-cover"
              width={200}
              height={200}
            />
          ) : null}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold">Aangeleverd bestand:</p>
        <Link
          className="text-sm underline underline-offset-4 text-pink-600 hover:no-underline"
          target="_blank"
          href={item.column_values[6].text}>
          Bestand bekijken
        </Link>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold">Specificaties:</p>
        <div className="flex gap-2 items-center text-sm">
          <CalendarDaysIcon className="h-6 w-6 text-pink-600" />
          <div>{item.column_values[3].text}</div>
        </div>
        <div className="flex gap-2 items-center text-sm">
          <PaintBrushIcon className="h-6 w-6 text-pink-600" />
          <div>
            {item.column_values[10].text ? (
              <>{item.column_values[10].text}</>
            ) : (
              "Afmetingen ontbreken"
            )}
          </div>
        </div>
        <div className="flex gap-2 items-center text-sm">
          <SwatchIcon className="h-6 w-6 text-pink-600" />
          <div>{item.column_values[11].text}</div>
        </div>
        <div className="flex gap-2 items-center text-sm">
          <ClipboardIcon className="h-6 w-6 text-pink-600" />
          <div>{item.column_values[13].text}</div>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold">Notities van de klant:</p>
        <p className="text-sm text-gray-500">
          {item.column_values[14].text ? (
            <>{item.column_values[14].text}</>
          ) : (
            "Geen notities"
          )}
        </p>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold">Interne notities:</p>
        <p className="text-sm text-gray-500">
          {item.column_values[18].text ? (
            <>{item.column_values[18].text}</>
          ) : (
            "Geen notities"
          )}
        </p>
      </div>
    </div>
  );
}
