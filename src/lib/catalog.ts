import vigil from "@/assets/the-vigil.jpg";
import bread from "@/assets/bread-and-ash.jpg";
import gate from "@/assets/the-narrow-gate.jpg";

export type Artwork = {
  id: string;
  slug: string;
  title: string;
  year: number;
  medium: string;
  width: number;
  height: number;
  description: string;
  price: number;
  image: string;
  audio?: string;
};
export type Frame = {
  name: string;
  price: number;
  key: "none" | "black" | "gold" | "wood" | "white";
};

export const artworks: Artwork[] = [
  {
    id: "the-vigil",
    slug: "the-vigil",
    title: "The Vigil",
    year: 2026,
    medium: "Oil and gold leaf on canvas",
    width: 76,
    height: 96,
    description: "A figure keeps watch over a flame no darkness can consume.",
    price: 148000,
    image: vigil,
  },
  {
    id: "bread-and-ash",
    slug: "bread-and-ash",
    title: "Bread and Ash",
    year: 2025,
    medium: "Oil on linen",
    width: 92,
    height: 92,
    description: "Daily bread, mortal dust, and the quiet holiness held between them.",
    price: 126000,
    image: bread,
  },
  {
    id: "the-narrow-gate",
    slug: "the-narrow-gate",
    title: "The Narrow Gate",
    year: 2026,
    medium: "Oil and cold wax on canvas",
    width: 72,
    height: 96,
    description: "An opening appears only when the eye has grown accustomed to the dark.",
    price: 139000,
    image: gate,
  },
];
export const frames: Frame[] = [
  { name: "No frame", price: 0, key: "none" },
  { name: "Black", price: 18000, key: "black" },
  { name: "Gold ornate", price: 32000, key: "gold" },
  { name: "Natural wood", price: 22000, key: "wood" },
  { name: "White", price: 18000, key: "white" },
];
export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
