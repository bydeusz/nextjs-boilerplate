"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { SearchInput } from "@/components/inputs/Search/Search";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";

type Product = {
  id: string;
  image_url: string;
  name: string;
  content: string;
  price: number;
};

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/product/get")
      .then((res) => res.json())
      .then((json) => {
        setLoading(false);
        setProducts(json);
      });
  }, []);

  useEffect(() => {}, [products]);

  const filterProducts = (value: string) => {
    setLoading(true);
    fetch(`/api/product/search`, {
      headers: {
        query: value,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setProducts(json);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const resetProducts = () => {
    setLoading(true);
    fetch("/api/product/get")
      .then((res) => res.json())
      .then((json) => {
        setProducts(json);
        setLoading(false);
      });
  };

  return (
    <>
      <div className="flex gap-2 items-center">
        <SearchInput
          placeholder="Search product"
          name="product-search"
          id="product-search"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="flex text-xs bg-primary border border-primary text-white rounded-md h-[36px] w-[36px] items-center justify-center"
          type="button"
          onClick={() => {
            filterProducts(search);
          }}>
          <MagnifyingGlassIcon className="h-[18px] w-[18px]" />
        </button>
        <button
          className="flex text-xs border border-gray-600 text-black rounded-md h-[36px] w-[36px] items-center justify-center"
          type="button"
          onClick={() => {
            resetProducts();
          }}>
          <XMarkIcon className="h-[18px] w-[18px]" />
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="flex gap-6 p-4 border rounded-md">
              <div className="w-1/4">
                <div className="w-full h-[250px] bg-gray-100 overflow-hidden">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    width={250}
                    height={250}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="space-y-2 w-3/4">
                <p className="text-sm text-gray-900 font-semibold">
                  {product.name}
                </p>
                <p className="text-xs text-gray-600">{product.content}</p>
                <p className="text-sm font-semibold text-green-500">
                  € {product.price},-
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};
