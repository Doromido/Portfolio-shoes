import { configureStore, createSlice } from '@reduxjs/toolkit';

// localStorage helpers

function loadState() {
  try {
    const raw = localStorage.getItem('jordan_store');
    return raw ? JSON.parse(raw) : undefined;
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
      const product = action.payload;            // { id, name, img, price, color?, accent?, sale? }
      // For products with colors, we compare id+color, for others - only id
      const matchKey = product.color 
        ? (i => i.id === product.id && i.color === product.color)
        : (i => i.id === product.id);
      
      const existing = state.items.find(matchKey);
      
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...product, qty: 1 });
      }
    },
    removeFromCart(state, action) {
      const { id, color } = typeof action.payload === 'object' 
        ? action.payload 
        : { id: action.payload, color: undefined };
      
      state.items = state.items.filter(i => {
        if (color) {
          return !(i.id === id && i.color === color);
        }
        return i.id !== id;
      });
    },
    updateQty(state, action) {
      const { id, color, qty } = action.payload;
      
      const item = state.items.find(i => {
        if (color) {
          return i.id === id && i.color === color;
        }
        return i.id === id;
      });
      
      if (item) {
        if (qty <= 0) {
          state.items = state.items.filter(i => {
            if (color) {
              return !(i.id === id && i.color === color);
            }
            return i.id !== id;
          });
        } else {
          item.qty = qty;
        }
      }
    },
    setItemSize(state, action) {
      // payload: { id, color, size }
      const { id, color, size } = action.payload;
      const item = state.items.find(
        i => i.id === id && i.color === color
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

// Store

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    wishlist: wishlistSlice.reducer,
    cart:     cartSlice.reducer,
  },
  // Restore persisted state (open drawer state is intentionally not persisted)
  preloadedState: preloadedState
    ? {
        wishlist: preloadedState.wishlist,
        cart: {
          ...preloadedState.cart,
          open: false,   // always start with cart closed
        },
      }
    : undefined,
});

// Subscribe to store changes - save to localStorage (debounced 300ms)
let saveTimer;
store.subscribe(() => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const { wishlist, cart } = store.getState();
    saveState({ wishlist, cart });
  }, 300);
});