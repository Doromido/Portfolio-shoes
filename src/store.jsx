import { configureStore, createSlice } from '@reduxjs/toolkit';

// localStorage helpers

function loadState() {
  try {
    const raw = localStorage.getItem('jordan_store');
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);

    // Valid ids look like 'h1'..'h6' or 'w1'..'w18'
    if (parsed?.wishlist?.ids) {
      const hasStale = parsed.wishlist.ids.some(id => typeof id === 'number' || /^\d+$/.test(id));
      if (hasStale) {
        parsed.wishlist.ids = [];
      }
    }
    return parsed;
  } catch {
    return undefined;
  }
}

function saveState(state) {
  try {
    localStorage.setItem('jordan_store', JSON.stringify(state));
  } catch {
    // quota exceeded or private mode — silently ignore
  }
}

// Wishlist slice
// State: { ids: [1, 3, 5, ...] }

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { ids: [], open: false },
  reducers: {
    setWishlistOpen(state, action) {
      state.open = action.payload;
    },
    toggleWishlist(state, action) {
      const id = action.payload;
      const idx = state.ids.indexOf(id);
      if (idx === -1) {
        state.ids.push(id);
      } else {
        state.ids.splice(idx, 1);
      }
    },
    clearWishlist(state) {
      state.ids = [];
    },
  },
});

export const { toggleWishlist, clearWishlist, setWishlistOpen } = wishlistSlice.actions;

// Selectors
export const selectWishlistIds    = (state) => state.wishlist.ids;
export const selectIsWishlisted   = (id) => (state) => state.wishlist.ids.includes(id);
export const selectWishlistCount  = (state) => state.wishlist.ids.length;
export const selectWishlistOpen   = (state) => state.wishlist.open;

// Cart slice
// State: { items: [{ id, name, img, price, qty }, ...] }

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], open: false },
  reducers: {
    addToCart(state, action) {
      const product = action.payload;            // { id, name, img, price, color?, accent?, sale?, size? }
      // Match key: id + color (if any) + size (if any)
      // This allows the same product in different sizes to be separate cart entries
      const matchKey = i =>
        i.id === product.id &&
        (product.color ? i.color === product.color : !i.color || i.color === product.color) &&
        (product.size  ? i.size  === product.size  : !i.size);
      
      const existing = state.items.find(matchKey);
      
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...product, qty: 1 });
      }
    },
    removeFromCart(state, action) {
      const { id, color, size } = typeof action.payload === 'object' 
        ? action.payload 
        : { id: action.payload, color: undefined, size: undefined };
      
      state.items = state.items.filter(i => {
        const sameId    = i.id === id;
        const sameColor = color ? i.color === color : true;
        const sameSize  = size  ? i.size  === size  : !i.size;
        return !(sameId && sameColor && sameSize);
      });
    },
    updateQty(state, action) {
      const { id, color, size, qty } = action.payload;
      
      const item = state.items.find(i => {
        const sameId    = i.id === id;
        const sameColor = color ? i.color === color : !i.color;
        const sameSize  = size  !== undefined ? i.size === size : true;
        return sameId && sameColor && sameSize;
      });
      
      if (item) {
        if (qty <= 0) {
          state.items = state.items.filter(i => {
            const sameId    = i.id === id;
            const sameColor = color ? i.color === color : !i.color;
            const sameSize  = size !== undefined ? i.size === size : true;
            return !(sameId && sameColor && sameSize);
          });
        } else {
          item.qty = qty;
        }
      }
    },
    setItemSize(state, action) {
      // payload: { id, color, oldSize, size }
      // Used only for items added WITHOUT a size (from catalogue) — lets user pick one in cart
      const { id, color, oldSize, size } = action.payload;
      const item = state.items.find(i =>
        i.id === id &&
        (color ? i.color === color : !i.color) &&
        (oldSize !== undefined ? i.size === oldSize : !i.size)
      );
      if (item) item.size = size;
    },
    clearCart(state) {
      state.items = [];
    },
    setCartOpen(state, action) {
      state.open = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQty,
  setItemSize,
  clearCart,
  setCartOpen,
} = cartSlice.actions;

// Selectors
export const selectCartItems  = (state) => state.cart.items;
export const selectCartOpen   = (state) => state.cart.open;
export const selectCartCount  = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.qty, 0);
export const selectCartTotal  = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);

// Orders slice
// State: { list: [{ id, num, date, items, delivery, total, shipping, status }] }
// status: 'active' | 'cancelled'

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { list: [] },
  reducers: {
    placeOrder(state, action) {
      state.list.unshift(action.payload); // newest first
    },
    cancelOrder(state, action) {
      const order = state.list.find(o => o.id === action.payload);
      if (order) order.status = 'cancelled';
    },
  },
});

export const { placeOrder, cancelOrder } = ordersSlice.actions;

export const selectOrders       = (state) => state.orders.list;
export const selectActiveOrders = (state) => state.orders.list.filter(o => o.status === 'active');

// Store

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    wishlist: wishlistSlice.reducer,
    cart:     cartSlice.reducer,
    orders:   ordersSlice.reducer,
  },
  preloadedState: preloadedState
    ? {
        wishlist: preloadedState.wishlist,
        cart: {
          ...preloadedState.cart,
          open: false,
        },
        orders: preloadedState.orders || { list: [] },
      }
    : undefined,
});

// Subscribe to store changes - save to localStorage (debounced 300ms)
let saveTimer;
store.subscribe(() => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const { wishlist, cart, orders } = store.getState();
    saveState({ wishlist, cart, orders });
  }, 300);
});