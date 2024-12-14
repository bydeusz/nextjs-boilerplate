"use client";
import { useState } from "react";
import Orders from "@/components/Lists/Orders/Orders";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import OrderDetails from "@/components/Tools/NeonDesigner/Details/OrderDetails";
import LogoDesigner from "../LogoDesigner/LogoDesigner";

interface DesignerProps {
  lang: string;
  t: any;
}

export default function Container({ t }: DesignerProps) {
  const [item, setItem] = useState<any>(null);

  const handleSelectItem = (item: any) => {
    console.log(item);
    setItem(item);
  };

  return (
    <div className="flex" style={{ height: "100vh" }}>
      <div className="w-[320px] bg-white border-r-[1px] overflow-y-scroll sticky top-0 flex-shrink-0">
        <Orders
          t={t}
          onItemSelect={(selectedItem) => {
            handleSelectItem(selectedItem);
          }}
        />
      </div>
      <div className="flex-grow z-50">
        {!item ? (
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-2/6 block rounded-lg border-2 border-dashed border-gray-300 p-12 text-center space-y-2">
            <ShieldExclamationIcon className="w-8 h-8 text-pink-600 mx-auto" />
            <h2 className="text-base font-medium">
              {t.pages.designer.notification.title}
            </h2>
            <p className="text-sm">{t.pages.designer.notification.desc}</p>
          </div>
        ) : (
          <div className="overflow-hidden h-screen w-full">
            <div className="h-screen p-4 flex gap-4">
              <OrderDetails item={item} />
              <LogoDesigner
                name={
                  item.column_values[4].text
                    ? item.column_values[4].text
                    : item.name
                }
                size={item.column_values[13].text.replace("cm", "")}
                defaultColor={item.column_values[10].text}
                id={item.id}
                logo={item.column_values[6].text}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
