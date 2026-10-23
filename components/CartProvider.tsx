"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import type { CartLine } from "@/lib/types";

type State = { lines: CartLine[]; open: boolean };

type Action =
  | { type: "add"; line: Omit<CartLine, "quantity">; quantity: number }
  | { type: "setQty"; key: string; quantity: number }
  | { type: "remove"; key: string }
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "open"; open: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add": {
      const existing = state.lines.find((l) => l.key === action.line.key);
      const lines = existing
        ? state.lines.map((l) => (l.key === action.line.key ? { ...l, quantity: l.quantity + action.quantity } : l))
        : [...state.lines, { ...action.line, quantity: action.quantity }];
      return { lines, open: true };
    }
    case "setQty":
      return {
        ...state,
        lines: state.lines
          .map((l) => (l.key === action.key ? { ...l, quantity: action.quantity } : l))
          .filter((l) => l.quantity > 0),
      };
    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.key !== action.key) };
    case "hydrate":
      return { ...state, lines: action.lines };
    case "open":
      return { ...state, open: action.open };
  }
}

type CartContextValue = State & {
  count: number;
  subtotal: number;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "cart:v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], open: false });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: "hydrate", lines: JSON.parse(saved) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {}
  }, [state.lines, hydrated]);

  const add = useCallback(
    (line: Omit<CartLine, "quantity">, quantity = 1) => dispatch({ type: "add", line, quantity }),
    [],
  );
  const setQuantity = useCallback((key: string, quantity: number) => dispatch({ type: "setQty", key, quantity }), []);
  const remove = useCallback((key: string) => dispatch({ type: "remove", key }), []);
  const setOpen = useCallback((open: boolean) => dispatch({ type: "open", open }), []);

  const value = useMemo<CartContextValue>(
    () => ({
      ...state,
      count: state.lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: state.lines.reduce((n, l) => n + l.quantity * l.price, 0),
      add,
      setQuantity,
      remove,
      setOpen,
    }),
    [state, add, setQuantity, remove, setOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
