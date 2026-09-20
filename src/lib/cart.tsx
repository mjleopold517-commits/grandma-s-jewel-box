import * as React from "react";

export type CartItem = {
  productId: string;
  slug: string;
  title: string;
  priceCents: number;
  image: string;
  quantity: number;
  maxQuantity: number;
  oneOfAKind: boolean;
};

type CartState = {
  items: CartItem[];
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  subtotalCents: number;
  count: number;
};

const CartContext = React.createContext<CartState | null>(null);
const STORAGE_KEY = "gvj-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [open, setOpen] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add = React.useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i.productId === item.productId);
      if (existing) {
        const next = Math.min(existing.quantity + quantity, item.maxQuantity);
        return current.map((i) => (i.productId === item.productId ? { ...i, ...item, quantity: next } : i));
      }
      return [...current, { ...item, quantity: Math.min(quantity, item.maxQuantity) }];
    });
  }, []);

  const setQuantity = React.useCallback((productId: string, quantity: number) => {
    setItems((current) =>
      current
        .map((i) =>
          i.productId === productId
            ? { ...i, quantity: Math.max(0, Math.min(quantity, i.maxQuantity)) }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const remove = React.useCallback((productId: string) => {
    setItems((current) => current.filter((i) => i.productId !== productId));
  }, []);

  const clear = React.useCallback(() => setItems([]), []);

  const subtotalCents = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  const value: CartState = {
    items,
    open,
    setOpen,
    add,
    setQuantity,
    remove,
    clear,
    subtotalCents,
    count,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
