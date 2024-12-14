import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PrismaClient, Prisma, Products } from "@prisma/client";

export const run = async () => {
  const db = new PrismaClient();

  const products = [
    {
      name: "Apple iPhone 14 128GB Geel",
      content:
        "Apple iPhone 14 128GB Geel is een alleskunner. Met de verbeterde standaard- en groothoeklens maak je nog scherpere foto's dan zijn voorganger, Apple iPhone 13. Daarnaast heeft de TrueDepth selfiecamera autofocus. Zo ligt de focus sneller op je gezicht en blijft het beeld bijvoorbeeld scherp als je beweegt tijdens het videobellen, ook bij weinig licht. Dankzij de krachtige A15 Bionic chip en 4 GB werkgeheugen bewerk je snel al je foto's en multitask je erop los. Je bewaart je foto's en apps op het 128 GB opslaggeheugen. Met de speciale Action Mode blijven al je video's stabiel als je iets opneemt waarbij je veel beweegt. Op het 6,1 inch OLED scherm kijk je in hoge kwaliteit naar al je favoriete series en films. Wil je meer schermruimte? Kies van voor iPhone 14 Plus. Let op: Apple levert geen oplader en oordopjes mee. Gebruik daarom je huidige accessoires of schaf ze los aan.",
      brand: "Apple",
      price: 796,
      image_url:
        "https://coolblue.bynder.com/m/7c035a1ef403937d/bannerImage-924412.png",
      delivery: "Voor 23.59 uur besteld, morgen gratis bezorgd",
    },
  ];

  const vectorStore = PrismaVectorStore.withModel<Products>(db).create(
    new OpenAIEmbeddings(),
    {
      prisma: Prisma,
      tableName: "Products",
      vectorColumnName: "embedding",
      columns: {
        id: PrismaVectorStore.IdColumn,
        content: PrismaVectorStore.ContentColumn,
      },
    },
  );

  await db.$transaction(
    products.map((product) =>
      db.products.create({
        data: {
          ...product,
        },
      }),
    ),
  );

  // Example product search query
  const exampleQuery = "Apple iPhone advanced camera features";
  const searchResults = await vectorStore.similaritySearch(exampleQuery, 1);
  console.log(searchResults);
};
