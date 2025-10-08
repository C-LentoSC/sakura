export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

const STORAGE_KEY = 'sakura-cart';

function read(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function getCart(): CartItem[] {
  return read();
}

export function saveCart(items: CartItem[]) {
  write(items);
}

export function addItem(item: CartItem) {
  const items = read();
  const idx = items.findIndex(i => i.id === item.id);
  if (idx >= 0) {
    items[idx].quantity += item.quantity;
  } else {
    items.push(item);
  }
  write(items);
}

export function updateQuantity(id: number, quantity: number) {
  let items = read();
  items = items
    .map(i => (i.id === id ? { ...i, quantity } : i))
    .filter(i => i.quantity > 0);
  write(items);
}

export function removeItem(id: number) {
  const items = read().filter(i => i.id !== id);
  write(items);
}

export function clearCart() {
  write([]);
}

export function getSubtotal(): number {
  return read().reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function getTotalQuantity(): number {
  return read().reduce((sum, i) => sum + i.quantity, 0);
}
