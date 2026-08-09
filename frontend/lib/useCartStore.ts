import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: number;
  nama: string;
  harga: number;
  jumlah: number;
  stok?: number;
  foto?: string;
}

interface CartState {
  cart: CartItem[];
  addItem: (item: Omit<CartItem, "jumlah">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist( // tambah persist 
    (set, get) => ({
      cart: [],

      addItem: (product) => {
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === product.id);
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, jumlah: item.jumlah + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, jumlah: 1 }] };
        });
      },

      // Remove an item dari IDnya
      removeItem: (id) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        }));
      },

      // Menambah atw mengurang item quantity by 1
      updateQuantity: (id, delta) => {
        set((state) => ({
          cart: state.cart
            .map((item) => {
              if (item.id === id) {
                const newQuantity = item.jumlah + delta;
                return newQuantity > 0 ? { ...item, jumlah: newQuantity } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null),
        }));
      },

      clearCart: () => set({ cart: [] }),

      getTotalPrice: () => {
        return get().cart.reduce(
          (total, item) => total + item.harga * item.jumlah,
          0
        );
      },

      // Menghitung total item count
      getTotalItems: () => {
        return get().cart.reduce((total, item) => total + item.jumlah, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);