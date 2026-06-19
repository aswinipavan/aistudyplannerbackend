import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { useAuthStore } from '../../store/authStore';
import { useSubscriptionStatus, useCreateOrder, useVerifyPayment } from './hooks/useSubscription';
import { Theme } from '../../theme';

export const SubscriptionScreen = () => {
  const { user, completeOnboarding } = useAuthStore();
  const { data: statusData, isLoading: statusLoading } = useSubscriptionStatus();
  const createOrderMutation = useCreateOrder();
  const verifyPaymentMutation = useVerifyPayment();
  const [processing, setProcessing] = useState(false);

  const isPremium = statusData?.isPremium || user?.isPremium;

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    setProcessing(true);
    try {
      // 1. Create order on backend
      const order = await createOrderMutation.mutateAsync(plan);

      // 2. Open Razorpay Checkout
      const options = {
        description: `Premium ${plan} subscription`,
        image: 'https://i.imgur.com/3g7nmJC.png', // Mock logo
        currency: order.currency,
        key: order.keyId,
        amount: order.amount,
        name: 'AI Study Planner',
        order_id: order.orderId,
        prefill: {
          email: user?.email || '',
          name: user?.name || '',
        },
        theme: { color: Theme.light.colors.primary }
      };

      const data = await RazorpayCheckout.open(options);

      // 3. Verify payment on backend
      await verifyPaymentMutation.mutateAsync({
        razorpay_order_id: data.razorpay_order_id,
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
      });

      // 4. Update local state
      completeOnboarding({ isPremium: true });
      Alert.alert('Success', 'Welcome to Premium!');

    } catch (error: any) {
      // Razorpay throws an error object on cancellation/failure
      console.error(error);
      Alert.alert('Payment Failed', error.description || 'Something went wrong. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (statusLoading) {
    return <View style={styles.center}><ActivityIndicator color={Theme.light.colors.primary} /></View>;
  }

  if (isPremium) {
    return (
      <View style={styles.center}>
        <Text style={styles.premiumText}>✨ You are a Premium Member ✨</Text>
        <Text style={styles.subText}>Enjoy unlimited AI tutoring and analytics.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upgrade to Premium</Text>
      <Text style={styles.subtitle}>Unlock your full potential with AI-driven study plans and personalized tutoring.</Text>

      <View style={styles.card}>
        <Text style={styles.planTitle}>Monthly Plan</Text>
        <Text style={styles.planPrice}>₹499 / month</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => handleSubscribe('monthly')}
          disabled={processing}
        >
          {processing ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Subscribe Monthly</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.planTitle}>Yearly Plan</Text>
        <Text style={styles.planPrice}>₹4999 / year</Text>
        <Text style={styles.savingsText}>Save ₹989</Text>
        <TouchableOpacity 
          style={[styles.button, styles.yearlyButton]}
          onPress={() => handleSubscribe('yearly')}
          disabled={processing}
        >
          {processing ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Subscribe Yearly</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.light.colors.background, padding: Theme.light.spacing.lg, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Theme.light.colors.background },
  premiumText: { ...Theme.light.typography.h1, color: Theme.light.colors.primary, textAlign: 'center', marginBottom: 10 },
  subText: { ...Theme.light.typography.body, color: Theme.light.colors.textSecondary },
  
  header: { ...Theme.light.typography.h1, color: Theme.light.colors.text, marginBottom: Theme.light.spacing.sm },
  subtitle: { ...Theme.light.typography.body, color: Theme.light.colors.textSecondary, marginBottom: Theme.light.spacing.xl },
  
  card: {
    backgroundColor: Theme.light.colors.surface,
    padding: Theme.light.spacing.xl,
    borderRadius: 16,
    marginBottom: Theme.light.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.light.colors.border,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  planTitle: { ...Theme.light.typography.h2, color: Theme.light.colors.text, marginBottom: 8 },
  planPrice: { fontSize: 24, fontWeight: 'bold', color: Theme.light.colors.primary, marginBottom: Theme.light.spacing.lg },
  savingsText: { ...Theme.light.typography.caption, color: '#4CAF50', fontWeight: 'bold', marginBottom: Theme.light.spacing.md },
  
  button: {
    backgroundColor: Theme.light.colors.primary,
    paddingVertical: Theme.light.spacing.md,
    paddingHorizontal: Theme.light.spacing.xl,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
  },
  yearlyButton: {
    backgroundColor: '#000',
  },
  buttonText: { ...Theme.light.typography.h3, color: Theme.light.colors.surface },
});
