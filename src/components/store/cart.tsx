import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formats, money, priceFor, sizeLabel, type Artwork, type FormatKey } from "@/lib/catalog";

// One line in the cart: which artwork, which format + size, and how many.
export type CartItem = {
  artwork: Artwork;
  formatKey: FormatKey;
  sizeKey: string;
  quantity: number;
};

// The "variant" is format + size together, e.g. "canvas-16x9".
// Same artwork in two different variants = two separate cart lines.
const variantOf = (item: { formatKey: string; sizeKey: string }) =>
  `${item.formatKey}-${item.sizeKey}`;

// Price and description for a cart line, always read from the price list in catalog.ts.
export function itemDetails(item: CartItem) {
  const format = formats.find((f) => f.key === item.formatKey);
  const size = format?.sizes.find((s) => s.key === item.sizeKey);
  return {
    unitPrice: priceFor(item.formatKey, item.sizeKey) ?? 0,
    label: format && size ? `${format.name} · ${sizeLabel(size, item.artwork)}` : "Unavailable",
  };
}

type CartValue = {
  items: CartItem[];
  add: (artwork: Artwork, formatKey: FormatKey, sizeKey: string) => void;
  setQuantity: (artworkId: string, variant: string, quantity: number) => void;
  count: number;
  subtotal: number;
};

// New storage name, so carts saved with the old frame system don't load into the new one.
const STORAGE_KEY = "icxc-cart-v2";

const CartContext = createContext<CartValue | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  // Stays false until the saved cart has been read, so we never save over it with an empty cart.
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        // Drop anything whose format/size no longer exists in the price list
        const parsed: CartItem[] = JSON.parse(stored);
        setItems(parsed.filter((item) => priceFor(item.formatKey, item.sizeKey) !== undefined));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    localStorage.removeItem("icxc-cart"); // clean up the old frame-based cart
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return; // don't save before we've loaded
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);
  const value = useMemo<CartValue>(
    () => ({
      items,
      add: (artwork, formatKey, sizeKey) =>
        setItems((current) => {
          const variant = variantOf({ formatKey, sizeKey });
          const match = current.find(
            (item) => item.artwork.id === artwork.id && variantOf(item) === variant,
          );
          return match
            ? current.map((item) =>
                item === match ? { ...item, quantity: item.quantity + 1 } : item,
              )
            : [...current, { artwork, formatKey, sizeKey, quantity: 1 }];
        }),
      setQuantity: (artworkId, variant, quantity) =>
        setItems((current) =>
          quantity < 1
            ? current.filter(
                (item) => !(item.artwork.id === artworkId && variantOf(item) === variant),
              )
            : current.map((item) =>
                item.artwork.id === artworkId && variantOf(item) === variant
                  ? { ...item, quantity }
                  : item,
              ),
        ),
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + itemDetails(item).unitPrice * item.quantity, 0),
    }),
    [items],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export const useCart = () => {
  const value = useContext(CartContext);
  if (!value) throw new Error("Cart unavailable");
  return value;
};
export function CartDrawer() {
  const cart = useCart();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="icon"
          size="icon"
          aria-label={`Cart, ${cart.count} items`}
          className="relative"
        >
          <ShoppingBag />
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center bg-primary px-1 text-[10px] text-primary-foreground">
            {cart.count}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-3xl font-normal">Your collection</SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex-1 space-y-6 overflow-auto">
          {cart.items.length === 0 ? (
            <p className="text-muted-foreground">Your cart is empty.</p>
          ) : (
            cart.items.map((item) => {
              const { unitPrice, label } = itemDetails(item);
              const variant = variantOf(item);
              return (
                <div
                  key={`${item.artwork.id}-${variant}`}
                  className="grid grid-cols-[72px_1fr] gap-4 border-b border-border pb-5"
                >
                  <img src={item.artwork.image} alt="" className="h-24 w-[72px] object-cover" />
                  <div>
                    <h3 className="font-display text-xl">{item.artwork.title}</h3>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="icon"
                          size="icon"
                          aria-label="Remove one"
                          onClick={() =>
                            cart.setQuantity(item.artwork.id, variant, item.quantity - 1)
                          }
                        >
                          {item.quantity === 1 ? <Trash2 /> : <Minus />}
                        </Button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <Button
                          variant="icon"
                          size="icon"
                          aria-label="Add one"
                          onClick={() =>
                            cart.setQuantity(item.artwork.id, variant, item.quantity + 1)
                          }
                        >
                          <Plus />
                        </Button>
                      </div>
                      <span>{money(unitPrice * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="border-t border-border pt-5">
          <div className="mb-5 flex justify-between text-xl">
            <span>Subtotal</span>
            <span>{money(cart.subtotal)}</span>
          </div>
          <Button asChild variant="gallery" size="lg" className="w-full">
            <Link to="/checkout">Proceed to checkout</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
