import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface TransactionState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  checkout: () => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  cart: [],
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  checkout: () => {
    const total = get().cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // SIMULASI OTOMATISASI KEUANGAN:
    console.log('[Pencatatan Otomatis] Pengeluaran UMKM tercatat: Rp${total}');
    console.log('[Pencatatan Otomatis] Pendapatan Petani tercatat: Rp${total}');
    
    set({ cart: [] }); // Ngereset keranjang after checkout berhasil
    alert("Pesanan Berhasil! Keuangan otomatis tercatat.");
  }
}));