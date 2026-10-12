import adam from "@/assets/destruction-of-adam.png";
import dove from "@/assets/landing-crow.jpg";
import reach from "@/assets/everlasting-reach.jpg";
import knight from "@/assets/the-knight.jpg";
import butterfly from "@/assets/gilded-butterfly.jpg";

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
export type FormatKey = "mounted" | "canvas";
export type Size = { key: string; w: number; h: number; price: number };
export type Format = { key: FormatKey; name: string; sizes: Size[] };

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
    id: "everlasting-reach",
    slug: "everlasting-reach",
    title: "Everlastingly Reaching",
    year: 2026,
    instagram: "https://www.instagram.com/p/DUxVxOqjmjl/",
    width: 72,
    height: 96,
    price: 1490,
    image: reach,
  },
  {
    id: "the-knight",
    slug: "the-knight",
    title: "The Knight",
    year: 2023,
    instagram: "",
    width: 72,
    height: 102,
    price: 1290,
    image: knight,
  },
  {
    id: "gilded-butterfly",
    slug: "gilded-butterfly",
    title: "The Gilded Butterfly",
    year: 2026,
    instagram: "",
    width: 72,
    height: 102,
    price: 1490,
    image: butterfly,
  },
];

export const formats: Format[] = [
  {
    key: "mounted",
    name: "Mounted Print",
    sizes: [
      { key: "10x8", w: 10, h: 8, price: 5149 },
      { key: "12x8", w: 12, h: 8, price: 5249 },
      { key: "12x10", w: 12, h: 10, price: 5899 },
    ],
  },
  {
    key: "canvas",
    name: "Canvas",
    sizes: [
      { key: "14x8", w: 14, h: 8, price: 6386 },
      { key: "15x8", w: 15, h: 8, price: 6386 },
      { key: "16x9", w: 16, h: 9, price: 6794 },
    ],
  },
];

// Finds the price for a format + size. Returns undefined if that combo doesn't exist.
export const priceFor = (formatKey: string, sizeKey: string) =>
  formats.find((f) => f.key === formatKey)?.sizes.find((s) => s.key === sizeKey)?.price;

// Shows a size the right way around for the artwork: tall pieces get 8×10 instead of 10×8.
export const sizeLabel = (size: Size, artwork: Artwork) =>
  artwork.height > artwork.width ? `${size.h}×${size.w}"` : `${size.w}×${size.h}"`;

export const money = (cents: number) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  }).format(cents / 100);
