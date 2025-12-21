// Cart API client for exam-level cart operations
// Uses backend cart API to track which exams are in cart

export interface CartApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: any;
}

// Cache for exam metadata to avoid multiple API calls
let metadataCache: Record<string, { id: string; price: number; examTime: string; questionCount: number; attemptCount: number | null }> | null = null;
let metadataCachePromise: Promise<Record<string, { id: string; price: number; examTime: string; questionCount: number; attemptCount: number | null }>> | null = null;

// Get exam metadata with caching - only fetches once, reuses cached result
async function getExamMetadata(): Promise<Record<string, { id: string; price: number; examTime: string; questionCount: number; attemptCount: number | null }>> {
  // Return cached data if available
  if (metadataCache !== null) {
    return metadataCache;
  }

  // If a fetch is already in progress, wait for it
  if (metadataCachePromise !== null) {
    return metadataCachePromise;
  }

  // Start new fetch and cache the promise
  metadataCachePromise = (async () => {
    try {
      const response = await fetch("/api/exams/metadata", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch exam metadata");
      }

      const data = await response.json();
      const metadata = data?.data || {};
      
      // Cache the result
      metadataCache = metadata;
      return metadata;
    } catch (error) {
      console.error("Error fetching exam metadata:", error);
      // Clear the promise so we can retry
      metadataCachePromise = null;
      throw error;
    }
  })();

  return metadataCachePromise;
}

// Helper to get exam ID from exam type and set by calling the metadata endpoint (public, no purchase required)
// Uses cached metadata to avoid multiple API calls
async function getExamId(
  examType: "barrister" | "solicitor",
  examSet: "set-a" | "set-b"
): Promise<string | null> {
  try {
    const metadata = await getExamMetadata();
    
    // Build the key to match metadata format: "barrister-set-a", "solicitor-set-b", etc.
    const key = `${examType}-${examSet}`;
    const examMeta = metadata[key];
    
    return examMeta?.id || null;
  } catch (error) {
    console.error("Error getting exam ID from metadata:", error);
    return null;
  }
}

export interface UserCartItem {
  examId: string;
  examType: string;
  examSet: string;
  title: string;
  price: number;
}

export const cartApi = {
  // Clear metadata cache (useful when exam prices/metadata are updated)
  clearMetadataCache(): void {
    metadataCache = null;
    metadataCachePromise = null;
  },

  // Get user's cart for a specific exam (creates cart if doesn't exist)
  async getCart(examId: string): Promise<CartApiResponse> {
    try {
      const response = await fetch(`/api/cart?examId=${examId}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "Failed to get cart",
        };
      }

      return {
        success: true,
        data: data.data,
        message: data.message,
      };
    } catch (error) {
      console.error("Get cart error:", error);
      return {
        success: false,
        error: "Failed to fetch cart",
      };
    }
  },

  // Get all exams in user's cart by checking all possible exam combinations
  // Note: Backend finds cart by userId only (one cart per user), so we need to check which exam the cart is for
  async getUserCartItems(): Promise<CartApiResponse<UserCartItem[]>> {
    try {
      // Fetch all user carts at once (no examId = get all carts)
      const response = await fetch("/api/cart", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "Failed to get user cart items",
        };
      }

      const carts = (data.data || []) as any[];

      // Get exam metadata using cached function (only fetches once)
      let metadata: Record<string, { id: string; price: number; examTime: string; questionCount: number; attemptCount: number | null }> = {};
      try {
        metadata = await getExamMetadata();
      } catch (error) {
        console.error("Failed to fetch exam metadata:", error);
      }

      // Map backend carts to frontend cart items
      const cartItems: UserCartItem[] = [];

      // Map of exam database IDs to frontend exam IDs
      const examIdMap: Record<string, { id: string; examType: string; examSet: string }> = {};
      
      // Build exam ID map by checking all possible exams
      const examTypes: Array<{
        examType: "barrister" | "solicitor";
        examSet: "set-a" | "set-b";
        id: string;
      }> = [
        { examType: "barrister", examSet: "set-a", id: "barrister-set-a" },
        { examType: "barrister", examSet: "set-b", id: "barrister-set-b" },
        { examType: "solicitor", examSet: "set-a", id: "solicitor-set-a" },
        { examType: "solicitor", examSet: "set-b", id: "solicitor-set-b" },
      ];

      // Use cached metadata instead of calling getExamId multiple times
      for (const exam of examTypes) {
        try {
          const key = `${exam.examType}-${exam.examSet}`;
          const examMeta = metadata[key];
          if (examMeta?.id) {
            examIdMap[examMeta.id] = {
              id: exam.id,
              examType: exam.examType,
              examSet: exam.examSet,
            };
          }
        } catch (error) {
          console.error(`Failed to get exam ID for ${exam.id}:`, error);
        }
      }

      // Process each cart from backend
      for (const cart of carts) {
        const examInfo = examIdMap[cart.examId];
        if (examInfo) {
          const meta = metadata[examInfo.id] || { price: 0 };
          cartItems.push({
            examId: examInfo.id,
            examType: examInfo.examType as "barrister" | "solicitor",
            examSet: examInfo.examSet as "set-a" | "set-b",
            title: cart.exam?.title || `${examInfo.examType.charAt(0).toUpperCase() + examInfo.examType.slice(1)} Exam ${examInfo.examSet.toUpperCase()}`,
            price: meta.price || 0,
          });
        }
      }

      return {
        success: true,
        data: cartItems,
        message: "User cart items retrieved successfully",
      };
    } catch (error) {
      console.error("Get user cart items error:", error);
      return {
        success: false,
        error: "Failed to fetch user cart items",
      };
    }
  },

  // Check if exam is in cart
  // Note: Backend cart API finds cart by userId only, not by examId
  // So we can't reliably check which specific exams are in cart via backend
  // This function is kept for future use but should not be relied upon for checking cart status
  async isExamInCart(
    examType: "barrister" | "solicitor",
    examSet: "set-a" | "set-b"
  ): Promise<boolean> {
    try {
      const examId = await getExamId(examType, examSet);
      if (!examId) return false;

      // Try to get cart - but note: backend finds by userId, not examId
      // So this will return the user's cart regardless of examId
      const cartResponse = await this.getCart(examId);
      if (!cartResponse.success || !cartResponse.data) return false;

      // Check if the cart's examId matches the requested exam
      const cartData = cartResponse.data as any;
      return cartData.examId === examId;
    } catch (error) {
      console.error("Check cart error:", error);
      return false;
    }
  },

  // Add exam to cart (creates cart for that exam)
  async addExamToCart(
    examType: "barrister" | "solicitor",
    examSet: "set-a" | "set-b"
  ): Promise<CartApiResponse> {
    try {
      const examId = await getExamId(examType, examSet);

      if (!examId) {
        return {
          success: false,
          error: "Exam not found",
        };
      }

      // GET request creates cart if it doesn't exist
      const response = await fetch(`/api/cart?examId=${examId}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "Failed to add exam to cart",
        };
      }

      return {
        success: true,
        data: data.data,
        message: "Exam added to cart successfully",
      };
    } catch (error) {
      console.error("Add exam to cart error:", error);
      return {
        success: false,
        error: "Failed to add exam to cart",
      };
    }
  },

  // Remove exam from cart (deletes cart for that exam)
  async removeExamFromCart(
    examType: "barrister" | "solicitor",
    examSet: "set-a" | "set-b"
  ): Promise<CartApiResponse> {
    try {
      const examId = await getExamId(examType, examSet);

      if (!examId) {
        return {
          success: false,
          error: "Exam not found",
        };
      }

      // Delete cart for this exam
      const response = await fetch(`/api/cart/exam?examId=${examId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "Failed to remove exam from cart",
        };
      }

      return {
        success: true,
        data: data.data,
        message: "Exam removed from cart successfully",
      };
    } catch (error) {
      console.error("Remove exam from cart error:", error);
      return {
        success: false,
        error: "Failed to remove exam from cart",
      };
    }
  },
};

