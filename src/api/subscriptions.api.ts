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
    const planType = plan === 'monthly' ? 'PREMIUM_MONTHLY' : 'PREMIUM_YEARLY';
    const response = await apiClient.post<any>('/api/subscriptions/order', { planType });
    return response.data.data;
  },

  verifyPayment: async (data: VerifyPayload): Promise<{ success: boolean }> => {
    const response = await apiClient.post<any>('/api/subscriptions/verify', {
      razorpayOrderId: data.razorpay_order_id,
      razorpayPaymentId: data.razorpay_payment_id,
      razorpaySignature: data.razorpay_signature
    });
    const success = response.data.success || response.data.data?.status === 'SUCCESS' || response.data.data?.status === 'COMPLETED';
    return { success };
  },

  getStatus: async (): Promise<{ isPremium: boolean }> => {
    const response = await apiClient.get<any>('/api/subscriptions/status');
    const subData = response.data.data;
    const isPremium = subData && subData.planType !== 'FREE';
    return { isPremium };
  }
};
