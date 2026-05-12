import { configureStore, createSlice } from '@reduxjs/toolkit';

// localStorage helpers

function loadState() {
  try {
    const raw = localStorage.getItem('jordan_store');
    const parsed = raw ? JSON.parse(raw) : {};

    // Load wishlist from per-user key (source of truth)
    let wishlistIds = [];
    try {
      const userRaw = localStorage.getItem('jordan_user');
      if (userRaw) {
        const user = JSON.parse(userRaw);
        if (user?.loggedIn && user?.email) {
          const perUserRaw = localStorage.getItem('jordan_wishlist_' + user.email.toLowerCase());
          if (perUserRaw) {
            const ids = JSON.parse(perUserRaw);
            // Filter out stale numeric ids
            wishlistIds = Array.isArray(ids)
              ? ids.filter(id => typeof id === 'string' && !/^\d+$/.test(id))
              : [];
          }
        }
      }
    } catch { /* ignore */ }

    // Load cart from per-user key
    let cartItems = [];
    try {
      const userRaw2 = localStorage.getItem('jordan_user');
      if (userRaw2) {
        const user2 = JSON.parse(userRaw2);
        if (user2?.loggedIn && user2?.email) {
          const cRaw = localStorage.getItem('jordan_cart_' + user2.email.toLowerCase());
          if (cRaw) {
            const parsed2 = JSON.parse(cRaw);
            cartItems = Array.isArray(parsed2) ? parsed2 : [];
          }
        }
      }
    } catch { /* ignore */ }

    return {
      ...parsed,
      wishlist: { ids: wishlistIds, open: false },
      cart:     { items: cartItems, open: false },
    };
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
    loadWishlist(state, action) {
      // Replace ids with the given array (used on login)
      state.ids = action.payload || [];
    },
    clearWishlist(state) {
      state.ids = [];
    },
  },
});

export const { toggleWishlist, clearWishlist, setWishlistOpen, loadWishlist } = wishlistSlice.actions;

// Per-user wishlist helpers
// Key pattern: jordan_wishlist_{email}
export function getUserWishlistKey(email) {
  return `jordan_wishlist_${email.toLowerCase()}`;
}

export function saveUserWishlist(email, ids) {
  try {
    localStorage.setItem(getUserWishlistKey(email), JSON.stringify(ids));
  } catch { /* ignore */ }
}

export function loadUserWishlist(email) {
  try {
    const raw = localStorage.getItem(getUserWishlistKey(email));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

// Per-user cart helpers
// Key pattern: jordan_cart_{email}
export function getUserCartKey(email) {
  return `jordan_cart_${email.toLowerCase()}`;
}

export function saveUserCart(email, items) {
  try {
    localStorage.setItem(getUserCartKey(email), JSON.stringify(items));
  } catch { /* ignore */ }
}

export function loadUserCart(email) {
  try {
    const raw = localStorage.getItem(getUserCartKey(email));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

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
    loadCart(state, action) {
      state.items = action.payload || [];
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
  loadCart,
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

// Returns the email of the currently logged-in user (from localStorage)
function getCurrentUserEmail() {
  try {
    const raw = localStorage.getItem('jordan_user');
    if (!raw) return null;
    return JSON.parse(raw)?.email?.toLowerCase() || null;
  } catch {
    return null;
  }
}

export const selectOrders = (state) => {
  const email = getCurrentUserEmail();
  if (!email) return [];
  return state.orders.list.filter(o =>
    // Support legacy orders (no userEmail) only for the session that created them
    o.userEmail ? o.userEmail === email : false
  );
};

export const selectActiveOrders = (state) => selectOrders(state).filter(o => o.status === 'active');

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
    // Only orders go into the shared key; wishlist & cart are per-user
    saveState({ orders });

    const email = getCurrentUserEmail();
    if (email) {
      if (wishlist.ids.length > 0) saveUserWishlist(email, wishlist.ids);
      if (cart.items.length > 0)   saveUserCart(email, cart.items);
    }
  }, 300);
});