"use client";

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useUser } from "@/components/context";
import { loadUserCartFromBackend, setUserId, clearUserCart } from "@/store/slices/cartSlice";
import type { AppDispatch } from "@/store";

/**
 * Component that loads user's cart from backend when they log in
 * Should be placed in the root layout or a high-level component
 */
export default function CartLoader() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useUser();
  const hasLoadedRef = useRef(false);
  const previousUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const currentUserId = user?.id || null;
    
    // If user changed (different user logged in) or user logged out
    if (previousUserIdRef.current !== null && previousUserIdRef.current !== currentUserId) {
      console.log("🛒 CartLoader: User changed from", previousUserIdRef.current, "to", currentUserId);
      // Clear previous user's cart from Redux (localStorage is already user-specific)
      // setUserId will handle saving previous user's cart and loading new user's cart
      hasLoadedRef.current = false; // Allow loading for new user
    }
    
    // Update previous user ID
    previousUserIdRef.current = currentUserId;
    
    if (isAuthenticated && user?.id) {
      // Set user ID in cart state (this saves previous user's cart and loads new user's cart)
      dispatch(setUserId(user.id));
      
      // Only load from backend once when user becomes authenticated
      if (!hasLoadedRef.current) {
        hasLoadedRef.current = true;
        console.log("🛒 CartLoader: User authenticated, loading cart from backend...", user.id);
        // Load user's cart from backend when authenticated
        dispatch(loadUserCartFromBackend())
          .unwrap()
          .then((items) => {
            console.log("🛒 CartLoader: Cart loaded successfully", items);
          })
          .catch((error) => {
            console.error("🛒 CartLoader: Failed to load cart", error);
          });
      }
    } else if (!isAuthenticated) {
      // User logged out - clear user ID (this will save current user's cart before clearing)
      dispatch(setUserId(null));
      hasLoadedRef.current = false;
      console.log("🛒 CartLoader: User logged out, cart cleared");
    }
  }, [isAuthenticated, user?.id, dispatch]);

  return null; // This component doesn't render anything
}

