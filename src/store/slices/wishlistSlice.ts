import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const WISHLIST_NAME = "NEXA_WISHLIST";

// Helper to get user-specific wishlist key
const getWishlistKey = (userId?: string | null): string => {
  if (typeof window === "undefined") return WISHLIST_NAME;
  if (!userId) return `${WISHLIST_NAME}_guest`;
  return `${WISHLIST_NAME}_${userId}`;
};

// Load wishlist from localStorage
const loadStateFromLocalStorage = (userId?: string | null): WishlistState => {
  if (typeof window !== "undefined") {
    try {
      const wishlistKey = getWishlistKey(userId);
      const storedState = localStorage.getItem(wishlistKey);
      return storedState ? JSON.parse(storedState) : { items: [] };
    } catch (error) {
      console.error("Error loading wishlist from localStorage:", error);
      return { items: [] };
    }
  }
  return { items: [] };
};

// Save wishlist to localStorage
const saveStateToLocalStorage = (state: WishlistState, userId?: string | null) => {
  if (typeof window !== "undefined") {
    try {
      const wishlistKey = getWishlistKey(userId);
      localStorage.setItem(wishlistKey, JSON.stringify(state));
    } catch (error) {
      console.error("Error saving wishlist to localStorage:", error);
    }
  }
};

interface WishlistState {
  items: any[];
  userId?: string | null; // Store current user ID for wishlist isolation
}

const initialState: WishlistState = { items: [], userId: null };

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string | null>) => {
      const newUserId = action.payload;
      
      // If user is changing, save current wishlist to old user's localStorage first
      if (state.userId && state.userId !== newUserId) {
        saveStateToLocalStorage(state, state.userId);
      }
      
      // Update userId
      state.userId = newUserId;
      
      // Load wishlist for new user from localStorage
      const userWishlist = loadStateFromLocalStorage(newUserId);
      state.items = userWishlist.items || [];
    },
    addToWishlist: (state, action: PayloadAction<any>) => {
      const exists = state.items.some(
        (item: any) => item.id === action.payload.id
      );
      if (!exists) {
        state.items = [...state.items, action.payload]; // Avoid direct mutation
        saveStateToLocalStorage(state, state.userId);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item: any) => item.id !== action.payload
      );
      saveStateToLocalStorage(state, state.userId);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveStateToLocalStorage(state, state.userId);
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist, setUserId: setWishlistUserId } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
