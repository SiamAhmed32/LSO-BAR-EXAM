import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from '@/lib/api/cartApi';

export const CART_NAME = 'APP_CART';

// Helper to get user-specific cart key
const getUserCartKey = (userId?: string | null): string => {
	if (typeof window === 'undefined') return CART_NAME;
	if (!userId) return CART_NAME;
	return `${CART_NAME}_${userId}`;
};

// Helper to clean up old/empty cart keys from localStorage
const cleanupOldCartKeys = (currentUserId?: string | null): void => {
	if (typeof window === 'undefined') return;
	
	const currentCartKey = getUserCartKey(currentUserId);
	const keysToRemove: string[] = [];
	
	// Find all APP_CART keys
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key && key.startsWith(CART_NAME)) {
			// Keep current user's cart, remove others
			if (key !== currentCartKey) {
				try {
					const cartData = localStorage.getItem(key);
					if (cartData) {
						const parsed = JSON.parse(cartData);
						// Remove if empty or if it's from a different user
						if (!parsed.cartItems || parsed.cartItems.length === 0) {
							keysToRemove.push(key);
						}
					} else {
						keysToRemove.push(key);
					}
				} catch {
					// If parsing fails, remove the key
					keysToRemove.push(key);
				}
			}
		}
	}
	
	// Remove old/empty cart keys
	keysToRemove.forEach(key => {
		localStorage.removeItem(key);
		console.log(`🧹 Cleaned up old cart key: ${key}`);
	});
};

export type CartItem = {
	uniqueId: string;
	id: string;
	_id: string;
	name: string;
	price: number;
	unitPrice: number;
	vat: number;
	image?: string;
	qty: number;
	// Variation-specific fields
	selectedSize?: string;
	selectedColor?: string;
	variationId?: string;
	variantStock?: number;
	variantName?: string;
	variantId?: string;
};

export type Address = {
	name: string;
	phone: string;
	email: string;
	street: string;
	city: string;
	country?: string;
	state?: string;
	postalCode: string;
};

type State = {
	cartItems: CartItem[];
	totalItems?: number;
	subTotal: number;
	total: number;
	tax: number;
	isLoading: boolean;
	vat: number;
	shipping: number;
	discount: number;
	user: string;
	userId: string | null; // Store current user ID for cart isolation
	address: any;
	isAddressSet: boolean;
	toggleCart: boolean;
};

const tax = 0;

const initialState: State = {
	cartItems: [],
	totalItems: 0,
	subTotal: 0,
	total: 0,
	tax: tax,
	isLoading: false,
	vat: 0,
	shipping: 0,
	discount: 0,
	user: 'guest',
	userId: null, // No user ID initially
	address: {},
	isAddressSet: false,
	toggleCart: false,
};

// Helper function to save state to local storage
const saveStateToLocalStorage = (state: typeof initialState) => {
	if (typeof window === 'undefined') return;
	// Use userId from state, fallback to null for guest
	const userId = state.userId || null;
	const cartKey = getUserCartKey(userId);
	localStorage.setItem(cartKey, JSON.stringify(state));
};

// Helper function to load state from local storage
const loadStateFromLocalStorage = (userId?: string | null): typeof initialState | null => {
	if (typeof window === 'undefined') return null;
	const cartKey = getUserCartKey(userId);
	const stored = localStorage.getItem(cartKey);
	if (!stored) return null;
	try {
		return JSON.parse(stored);
	} catch {
		return null;
	}
};

// Helper function to calculate totals
const calculateTotals = (state: State) => {
	state.subTotal = state.cartItems.reduce((total: number, cartItem: CartItem) => {
		return total + cartItem.price * cartItem.qty;
	}, 0);

	state.vat = state.cartItems.reduce((total: number, cartItem: CartItem) => {
		if (cartItem.vat) {
			return total + ((cartItem.price * cartItem.vat) / 100) * cartItem.qty;
		}
		return total; // Fixed to remove unnecessary else block
	}, 0);

	state.total = state.subTotal + state.vat + state.shipping - state.discount;
	state.totalItems = state.cartItems.reduce((total, item) => total + item.qty, 0);
};

// Async thunks for backend API integration
export const addExamToCartBackend = createAsyncThunk(
	'cart/addExamToCartBackend',
	async (
		{ examType, examSet }: { examType: 'barrister' | 'solicitor'; examSet: 'set-a' | 'set-b' },
		{ rejectWithValue }
	) => {
		try {
			const response = await cartApi.addExamToCart(examType, examSet);
			if (!response.success) {
				return rejectWithValue(response.error || 'Failed to add exam to cart');
			}
			return { examType, examSet, cartData: response.data };
		} catch (error: any) {
			return rejectWithValue(error.message || 'Failed to add exam to cart');
		}
	}
);

export const checkExamInCart = createAsyncThunk(
	'cart/checkExamInCart',
	async (
		{ examType, examSet }: { examType: 'barrister' | 'solicitor'; examSet: 'set-a' | 'set-b' },
		{ rejectWithValue }
	) => {
		try {
			const isInCart = await cartApi.isExamInCart(examType, examSet);
			return { examType, examSet, isInCart };
		} catch (error: any) {
			return rejectWithValue(error.message || 'Failed to check cart');
		}
	}
);

// Load user's cart from backend on login
export const loadUserCartFromBackend = createAsyncThunk(
	'cart/loadUserCartFromBackend',
	async (_, { rejectWithValue }) => {
		try {
			const response = await cartApi.getUserCartItems();
			if (!response.success) {
				return rejectWithValue(response.error || 'Failed to load cart');
			}
			return response.data || [];
		} catch (error: any) {
			return rejectWithValue(error.message || 'Failed to load cart from backend');
		}
	}
);

export const cartSlice = createSlice({
	name: 'cart',
	initialState: initialState, // Don't load from localStorage initially - wait for user to be set
	reducers: {
		calculateCartTotals: (state, action) => {
			const { subTotal = 0, total = 0, vat = 0, discount = 0, shipping = 0 } = action.payload;
			state.subTotal = subTotal;
			state.total = total;
			state.vat = vat;
			state.total = total;
			state.total = total;
			state.discount = discount;
			state.shipping = shipping;
			saveStateToLocalStorage(state);
		},

		addToCart: (state, action) => {
			const { item, qty = 1 } = action.payload;
			if (qty <= 0) return;

			// Create unique ID based on product and variation
			const baseId = item?._id || item?.id;
			const variationPart =
				item.variationId || `${item.selectedSize || 'no-size'}-${item.selectedColor || 'no-color'}`;
			const uniqueId = `${baseId}-${variationPart}`;

			// Check stock if variation has stock info
			const availableStock = item.variantStock || item.stock || Infinity;
			if (availableStock < qty) {
				console.warn('Insufficient stock for item:', item.name);
				return;
			}

			const existItem = state.cartItems.find(
				(stateItem: CartItem) => stateItem.uniqueId === uniqueId
			);

			if (existItem) {
				const updatedQty = Number(existItem.qty) + Number(qty);

				// Check stock for updated quantity
				if (availableStock < updatedQty) {
					console.warn('Insufficient stock for updated quantity:', item.name);
					return;
				}

				const updatedPrice = existItem.unitPrice * updatedQty;

				state.cartItems = state.cartItems.map((stateItem: CartItem) =>
					stateItem.uniqueId === uniqueId
						? {
								...stateItem,
								qty: updatedQty,
								price: updatedPrice,
						  }
						: stateItem
				);
			} else {
				const newItem: CartItem = {
					uniqueId: uniqueId,
					_id: item._id || item.id,
					id: item.id || item._id,
					name: item.name,
					price: item.price * qty,
					unitPrice: item.price,
					vat: item.vat || 0,
					qty: qty,
					image: item.image,
					// Variation-specific fields
					selectedSize: item.selectedSize,
					selectedColor: item.selectedColor,
					variationId: item.variationId,
					variantStock: item.variantStock || item.stock,
					variantName:
						item.selectedSize && item.selectedColor
							? `${item.selectedSize} / ${item.selectedColor}`
							: item.selectedSize || item.selectedColor || '',
					variantId: item.variationId,
				};

				state.cartItems = [...state.cartItems, newItem];
			}

			state.toggleCart = true; // Show cart when item is added
			calculateTotals(state);
			const { toggleCart, ...stt } = state;
			saveStateToLocalStorage({ toggleCart: false, ...stt });
		},

		setAddress: (state, action) => {
			state.address = action.payload;
			state.isAddressSet = true;
		},

		setToggleCart: (state, action) => {
			state.toggleCart = action.payload;
		},

		removeAddress: state => {
			state.address = {};
			state.isAddressSet = false;
		},

		deleteOneFromCart: (state, action) => {
			const uniqueId = action.payload; // Now expects uniqueId instead of just _id
			const findItem = state.cartItems.find(
				(stateItem: CartItem) => stateItem.uniqueId === uniqueId
			);

			if (findItem) {
				if (findItem.qty > 1) {
					state.cartItems = state.cartItems.map((stateItem: CartItem) =>
						stateItem.uniqueId === uniqueId
							? {
									...stateItem,
									qty: stateItem.qty - 1,
									price: stateItem.unitPrice * (stateItem.qty - 1),
							  }
							: stateItem
					);
				} else {
					// Remove item if qty is 1
					state.cartItems = state.cartItems.filter(
						(stateItem: CartItem) => stateItem.uniqueId !== uniqueId
					);
				}

				if (state.cartItems.length === 0) {
					state.totalItems = 0;
					state.subTotal = 0;
					state.total = 0;
					state.vat = 0;
					state.shipping = 0;
					state.discount = 0;
				}
			}

			calculateTotals(state);
			const { toggleCart, ...stt } = state;
			saveStateToLocalStorage({ toggleCart: false, ...stt });
		},
		/******  674052a1-d31f-48f3-80e2-5814cfb5bbd3  *******/

		deleteSingleItemFromCart: (state, action) => {
			const uniqueId = action.payload; // Now expects uniqueId instead of just _id
			const findItem = state.cartItems.find(
				(stateItem: CartItem) => stateItem.uniqueId === uniqueId
			);
			if (findItem) {
				state.cartItems = state.cartItems.filter(
					(stateItem: CartItem) => stateItem.uniqueId !== uniqueId
				);
			}
			if (state.cartItems.length === 0) {
				state.totalItems = 0;
				state.subTotal = 0;
				state.total = 0;
				state.vat = 0;
				state.shipping = 0;
				state.discount = 0;
			}
			calculateTotals(state);
			saveStateToLocalStorage(state);
		},

		deleteAllFromCart: state => {
			state.cartItems = [];
			state.totalItems = 0;
			state.subTotal = 0;
			state.total = 0;
			state.vat = 0;
			state.shipping = 0;
			state.discount = 0;
			state.user = 'guest';

			saveStateToLocalStorage(state);
		},

		updateUser: (state, action) => {
			state.user = action.payload;
		},
		
		// Set user ID and load their cart from localStorage
		setUserId: (state, action: { payload: string | null }) => {
			const newUserId = action.payload;
			
			// If user is changing, save current cart to old user's localStorage first
			if (state.userId && state.userId !== newUserId) {
				saveStateToLocalStorage(state);
			}
			
			// Clean up old/empty cart keys when user changes
			if (typeof window !== 'undefined' && state.userId !== newUserId) {
				cleanupOldCartKeys(newUserId);
			}
			
			// Update userId and user field
			state.userId = newUserId;
			state.user = newUserId ? newUserId : 'guest'; // Set user field based on userId
			
			// For authenticated users: Don't load from localStorage here
			// Backend sync (loadUserCartFromBackend) will be the source of truth
			// This prevents stale localStorage data from appearing after payment
			if (newUserId) {
				// For authenticated users, clear cart state initially
				// Backend sync will populate it correctly
				state.cartItems = [];
				state.subTotal = 0;
				state.total = 0;
				state.totalItems = 0;
				state.vat = 0;
				state.shipping = 0;
				state.discount = 0;
				state.user = newUserId; // Set user field
				// Note: loadUserCartFromBackend will load the actual cart from backend
			} else {
				// Guest user: load from localStorage (no backend sync for guests)
				const guestCart = loadStateFromLocalStorage(null);
				if (guestCart && guestCart.cartItems && guestCart.cartItems.length > 0) {
					state.cartItems = guestCart.cartItems;
					state.subTotal = guestCart.subTotal || 0;
					state.total = guestCart.total || 0;
					state.totalItems = guestCart.totalItems || 0;
					state.vat = guestCart.vat || 0;
					state.shipping = guestCart.shipping || 0;
					state.discount = guestCart.discount || 0;
					calculateTotals(state);
				} else {
					// Guest user, clear cart
					state.cartItems = [];
					state.subTotal = 0;
					state.total = 0;
					state.totalItems = 0;
					state.vat = 0;
					state.shipping = 0;
					state.discount = 0;
				}
				state.user = 'guest'; // Set user field
			}
		},
		
		// Clear cart for current user
		clearUserCart: (state) => {
			// Save empty cart to current user's localStorage
			if (state.userId) {
				const emptyState = { ...initialState, userId: state.userId };
				saveStateToLocalStorage(emptyState);
			}
			// Clear state
			state.cartItems = [];
			state.subTotal = 0;
			state.total = 0;
			state.totalItems = 0;
			state.vat = 0;
			state.shipping = 0;
			state.discount = 0;
		},

	resetCart: state => {
		// Clear state first
		state.cartItems = [];
		state.totalItems = 0;
		state.subTotal = 0;
		state.total = 0;
		state.vat = 0;
		state.shipping = 0;
		state.discount = 0;
		state.user = 'guest';
		state.address = {};
		state.isAddressSet = false;
		
		// Clear localStorage for current user (if logged in) or guest
		if (typeof window !== 'undefined') {
			const userId = state.userId || null;
			const cartKey = getUserCartKey(userId);
			localStorage.removeItem(cartKey);
		}
		// Note: userId is kept here, but setUserId(null) will be called on logout to clear it
	},
		setCartLoading: (state, action) => {
			state.isLoading = action.payload;
		},
	},
	extraReducers: (builder) => {
		// Add exam to cart backend
		builder
			.addCase(addExamToCartBackend.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(addExamToCartBackend.fulfilled, (state, action) => {
				state.isLoading = false;
				// Backend cart is tracked separately, but we keep local state for UI
				// The actual cart state is managed by checking backend
			})
			.addCase(addExamToCartBackend.rejected, (state) => {
				state.isLoading = false;
			});
		// Check exam in cart
		builder
			.addCase(checkExamInCart.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(checkExamInCart.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(checkExamInCart.rejected, (state) => {
				state.isLoading = false;
			});
		// Load user cart from backend
		builder
			.addCase(loadUserCartFromBackend.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(loadUserCartFromBackend.fulfilled, (state, action) => {
				state.isLoading = false;
			
				// Update user field to match userId (fixes "guest" issue when logged in)
				if (state.userId) {
					state.user = state.userId;
				}
			
				// Load cart items from backend (backend is the source of truth for authenticated users)
				const backendItems: CartItem[] = [];
				if (action.payload && Array.isArray(action.payload)) {
					action.payload.forEach((item: any) => {
						// Handle both lowercase (from API) and uppercase (legacy) formats
						const examType = (item.examType || "").toLowerCase();
						const examSet = (item.examSet || "").toLowerCase();
						
						// Generate exam name from examType and examSet
						const type = examType === "barrister" ? "Barrister" : examType === "solicitor" ? "Solicitor" : "";
						const set = examSet === "set-a" ? "Set A" : examSet === "set-b" ? "Set B" : examSet === "set_a" ? "Set A" : examSet === "set_b" ? "Set B" : "";
						const examName = `${type} ${set}`.trim();
						
						if (examName && item.examId) {
							const cartItem: CartItem = {
								uniqueId: `${item.examId}-no-variation`,
								id: item.examId,
								_id: item.examId,
								name: examName,
								price: item.price || 0,
								unitPrice: item.price || 0,
								vat: 0,
								qty: 1,
							};
							backendItems.push(cartItem);
						}
					});
				}
				
				// Clean up old/empty cart keys when loading from backend
				if (typeof window !== 'undefined') {
					cleanupOldCartKeys(state.userId);
				}
				
				// Use backend cart as source of truth for authenticated users
				// BACKEND ALWAYS OVERRIDES localStorage (this fixes the stale cart issue)
				if (backendItems.length === 0) {
					// Backend cart is empty - clear everything (user purchased items or cart was cleared)
					// This overrides any localStorage items that might have been loaded by setUserId
					state.cartItems = [];
					state.subTotal = 0;
					state.total = 0;
					state.totalItems = 0;
					state.vat = 0;
					state.shipping = 0;
					state.discount = 0;
					
					// Clear localStorage to keep it in sync (for current user and any old keys)
					if (typeof window !== 'undefined') {
						if (state.userId) {
							const cartKey = getUserCartKey(state.userId);
							localStorage.removeItem(cartKey);
						}
						// Also clear guest cart if it exists
						const guestCartKey = getUserCartKey(null);
						localStorage.removeItem(guestCartKey);
					}
				} else {
					// Backend has items - use backend as source of truth, ignore localStorage
					// This ensures backend always takes precedence
					state.cartItems = [...backendItems];
				}
				
				calculateTotals(state);
				saveStateToLocalStorage(state);
			})
			.addCase(loadUserCartFromBackend.rejected, (state) => {
				state.isLoading = false;
			});
	},
});

export const {
	addToCart,
	deleteOneFromCart,
	deleteAllFromCart,
	deleteSingleItemFromCart,
	resetCart,
	setCartLoading,
	calculateCartTotals,
	updateUser,
	setUserId,
	clearUserCart,
	setAddress,
	removeAddress,
	setToggleCart,
} = cartSlice.actions;

export default cartSlice.reducer;
