import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { money, type Artwork, type Frame } from "@/lib/catalog";

type CartItem = { artwork: Artwork; frame: Frame; quantity: number };
type CartValue = {
  items: CartItem[];
  add: (artwork: Artwork, frame: Frame) => void;
  setQuantity: (id: string, frame: string, quantity: number) => void;
  count: number;
  subtotal: number;
};
const CartContext = createContext<CartValue | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    const stored = localStorage.getItem("icxc-cart");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        localStorage.removeItem("icxc-cart");
      }
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("icxc-cart", JSON.stringify(items));
  }, [items]);
  const value = useMemo<CartValue>(
    () => ({
      items,
      add: (artwork, frame) =>
        setItems((current) => {
          const match = current.find(
            (item) => item.artwork.id === artwork.id && item.frame.key === frame.key,
          );
          return match
            ? current.map((item) =>
                item === match ? { ...item, quantity: item.quantity + 1 } : item,
              )
            : [...current, { artwork, frame, quantity: 1 }];
        }),
      setQuantity: (id, frame, quantity) =>
        setItems((current) =>
          quantity < 1
            ? current.filter((item) => !(item.artwork.id === id && item.frame.key === frame))
            : current.map((item) =>
                item.artwork.id === id && item.frame.key === frame ? { ...item, quantity } : item,
              ),
        ),
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce(
        (sum, item) => sum + (item.artwork.price + item.frame.price) * item.quantity,
        0,
      ),
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
            cart.items.map((item) => (
              <div
                key={`${item.artwork.id}-${item.frame.key}`}
                className="grid grid-cols-[72px_1fr] gap-4 border-b border-border pb-5"
              >
                <img src={item.artwork.image} alt="" className="h-24 w-[72px] object-cover" />
                <div>
                  <h3 className="font-display text-xl">{item.artwork.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.frame.name}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="icon"
                        size="icon"
                        onClick={() =>
                          cart.setQuantity(item.artwork.id, item.frame.key, item.quantity - 1)
                        }
                      >
                        {item.quantity === 1 ? <Trash2 /> : <Minus />}
                      </Button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="icon"
                        size="icon"
                        onClick={() =>
                          cart.setQuantity(item.artwork.id, item.frame.key, item.quantity + 1)
                        }
                      >
                        <Plus />
                      </Button>
                    </div>
                    <span>{money((item.artwork.price + item.frame.price) * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))
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
