import adam from "@/assets/destruction-of-adam.png";
import dove from "@/assets/landing-crow.jpg";
import gate from "@/assets/the-narrow-gate.jpg";

export type Artwork = {
  id: string;
  slug: string;
  title: string;
  year: number;
  instagram: string;
  width: number;
  height: number;
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
    id: "destruction-of-adam",
    slug: "destruction-of-adam",
    title: "The Destruction of Adam",
    year: 2026,
    instagram: "https://www.instagram.com/p/DdVPrF4t59m/",
    width: 90,
    height: 50,
    price: 1400,
    image: adam,
  },
  {
    id: "dove-from-heaven",
    slug: "dove-from-heaven",
    title: "Then he sent out a dove",
    year: 2025,
    instagram: "https://www.instagram.com/p/DH7NTtVtYgx/",
    width: 90,
    height: 50,
    price: 1260,
    image: dove,
  },
  {
    id: "the-narrow-gate",
    slug: "the-narrow-gate",
    title: "The Narrow Gate",
    year: 2026,
    instagram: "https://www.instagram.com/p/DdVPrF4t59m/",
    width: 72,
    height: 96,
    price: 139000,
    image: gate,
  },
];
export const frames: Frame[] = [
  { name: "No frame", price: 0, key: "none" },
  { name: "Black", price: 1800, key: "black" },
  { name: "Gold ornate", price: 3200, key: "gold" },
  { name: "Natural wood", price: 2200, key: "wood" },
  { name: "White", price: 1800, key: "white" },
];
export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
