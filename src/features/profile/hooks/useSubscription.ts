import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionsApi, VerifyPayload } from '../../../api/subscriptions.api';

export const SUBSCRIPTION_STATUS_KEY = ['subscription', 'status'];

export const useSubscriptionStatus = () => {
  return useQuery({
    queryKey: SUBSCRIPTION_STATUS_KEY,
    queryFn: subscriptionsApi.getStatus,
  });
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (plan: 'monthly' | 'yearly') => subscriptionsApi.createOrder(plan),
  });
};

export const useVerifyPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: VerifyPayload) => subscriptionsApi.verifyPayment(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SUBSCRIPTION_STATUS_KEY });
    }
  });
};
