"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Loading } from "@/components/lables/Loading/Loading";
import { Badge } from "@/components/lables/Badge/Badge";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

interface Item {
  id: string;
  name: string;
  column_values: {
    id: string;
    value: string;
    text: string;
  }[];
}

interface OrdersProps {
  onItemSelect: (item: any) => void;
  t: any;
}

export default function Orders({ onItemSelect, t }: OrdersProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchItems = async (nextCursor: string | null = null) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/monday/orders${nextCursor ? `?cursor=${nextCursor}` : ""}`,
      );
      const data = await response.json();

      const filteredItems = data.items.filter((item: any) => {
        const text1Column = item.column_values.find(
          (col: any) => col.id === "text1",
        );
        const text2Column = item.column_values.find(
          (col: any) => col.id === "text2",
        );
        return text1Column?.text === "Logo" && text2Column?.text !== "";
      });

      setItems((prevItems) => {
        const newItems = filteredItems.filter(
          (newItem: any) =>
            !prevItems.some((prevItem) => prevItem.id === newItem.id),
        );
        return [...prevItems, ...newItems];
      });
      setCursor(data.nextCursor || null);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleLoadMore = async () => {
    if (!cursor) return;
    setIsLoadingMore(true);
    await fetchItems(cursor);
    setIsLoadingMore(false);
  };

  const handleSelectItem = useCallback(
    (item: Item) => {
      setSelectedItem(item);
      onItemSelect(item);
    },
    [onItemSelect],
  );

  const itemListMemo = useMemo(
    () => (
      <>
        {items.map((item) => (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => handleSelectItem(item)}
              className={`relative block bg-white w-full border-b-[1px] p-4 space-y-1 text-left hover:text-pink-600 ${
                selectedItem && selectedItem.id === item.id
                  ? "text-pink-600 bg-gray-50"
                  : ""
              }`}>
              <Badge className="absolute top-2 right-2 bg-yellow-100 border border-pink-200 text-yellow-600">
                Controle
              </Badge>

              <div className="text-sm font-semibold">
                {item.column_values[4].text
                  ? item.column_values[4].text
                  : item.name}
              </div>
              <div className="text-xs text-gray-500">
                {item.column_values[2].text}
              </div>
              <ChevronRightIcon className="absolute bottom-2 right-2 w-4 h-4" />
            </button>
          </div>
        ))}
      </>
    ),
    [items, selectedItem, handleSelectItem],
  );

  return (
    <>
      {isLoading && !isLoadingMore ? (
        <div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-600">
            <Loading className="h-6 w-6" />
          </div>
        </div>
      ) : (
        <>
          <div>{itemListMemo}</div>
          <div className="p-2">
            <button
              onClick={handleLoadMore}
              disabled={!cursor || isLoadingMore}
              className="w-full py-2 rounded-md bg-pink-600 text-white font-medium hover:bg-pink-400 text-sm transition-colors duration-200">
              {isLoadingMore ? t.orders.loading : t.orders.button}
            </button>
          </div>
        </>
      )}
    </>
  );
}
