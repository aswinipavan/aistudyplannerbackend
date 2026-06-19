import { apiClient } from './client';

export interface OrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface VerifyPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const subscriptionsApi = {
  createOrder: async (plan: 'monthly' | 'yearly'): Promise<OrderResponse> => {
    // Mocking POST /api/subscriptions/order
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          orderId: `order_${Date.now()}`,
          amount: plan === 'monthly' ? 49900 : 499900, // in paise
          currency: 'INR',
          keyId: 'rzp_test_mockkey12345',
        });
      }, 1000);
    });
  },

  verifyPayment: async (data: VerifyPayload): Promise<{ success: boolean }> => {
    // Mocking POST /api/subscriptions/verify
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  },

  getStatus: async (): Promise<{ isPremium: boolean }> => {
    // Mocking GET /api/subscriptions/status
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ isPremium: true });
      }, 500);
    });
  }
};
