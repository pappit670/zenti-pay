import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Smartphone, Zap, CheckCircle, AlertCircle, CreditCard } from 'lucide-react-native';

export default function POSPayment() {
  const router = useRouter();
  const { user } = useAuth();
  const { merchantId, amount } = useLocalSearchParams();
  const [merchant, setMerchant] = useState<any>(null);
  const [status, setStatus] = useState<'ready' | 'processing' | 'success' | 'error'>('ready');
  const [pulseAnim] = useState(new Animated.Value(1));
  const [rotateAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadMerchant();
  }, []);

  useEffect(() => {
    if (status === 'processing') {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.2,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [status]);

  const loadMerchant = async () => {
    if (!merchantId) return;

    const { data } = await supabase
      .from('profiles')
      .select('full_name, business_name, verification_status')
      .eq('id', merchantId)
      .maybeSingle();

    if (data) setMerchant(data);
  };

  const processPOSPayment = async () => {
    if (!user || !merchantId || !amount) return;

    setStatus('processing');

    try {
      const { data: senderAccount } = await supabase
        .from('accounts')
        .select('id, balance')
        .eq('user_id', user.id)
        .eq('is_primary', true)
        .maybeSingle();

      const payAmount = parseFloat(amount as string);

      if (!senderAccount || Number(senderAccount.balance) < payAmount) {
        setStatus('error');
        return;
      }

      const { data: merchantAccount } = await supabase
        .from('accounts')
        .select('id')
        .eq('user_id', merchantId)
        .eq('is_primary', true)
        .maybeSingle();

      if (!merchantAccount) {
        setStatus('error');
        return;
      }

      await supabase.from('transactions').insert({
        account_id: senderAccount.id,
        user_id: user.id,
        type: 'send',
        amount: payAmount,
        currency: 'KSH',
        recipient_name: merchant?.business_name || merchant?.full_name,
        description: 'POS Payment',
        status: 'completed',
      });

      await supabase.from('transactions').insert({
        account_id: merchantAccount.id,
        user_id: merchantId as string,
        type: 'receive',
        amount: payAmount,
        currency: 'KSH',
        sender_name: user.email,
        description: 'POS Payment',
        status: 'completed',
      });

      await supabase
        .from('accounts')
        .update({ balance: Number(senderAccount.balance) - payAmount })
        .eq('id', senderAccount.id);

      setStatus('success');

      setTimeout(() => {
        router.back();
      }, 2500);
    } catch (error) {
      console.error('Error processing POS payment:', error);
      setStatus('error');
    }
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#0f3460', '#16213e']}
        style={styles.backgroundGradient}
      />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <BlurView intensity={20} tint="dark" style={styles.backButton}>
            <ArrowLeft color="#ffffff" size={20} />
          </BlurView>
        </Pressable>
        <Text style={styles.title}>POS Payment</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        {status === 'ready' && (
          <>
            <BlurView intensity={30} tint="dark" style={styles.phoneCircleBlur}>
              <LinearGradient
                colors={['rgba(163, 245, 66, 0.3)', 'rgba(163, 245, 66, 0.1)']}
                style={styles.phoneCircle}
              >
                <Smartphone color="#a3f542" size={64} strokeWidth={2} />
              </LinearGradient>
            </BlurView>

            <Text style={styles.instruction}>Tap to Pay with Zenti</Text>
            <Text style={styles.subtext}>
              Your phone is your wallet. No card needed.
            </Text>

            <BlurView intensity={25} tint="dark" style={styles.merchantCardBlur}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.02)']}
                style={styles.merchantCard}
              >
                <View style={styles.merchantInfo}>
                  <Text style={styles.merchantLabel}>Paying to</Text>
                  <Text style={styles.merchantName}>
                    {merchant?.business_name || merchant?.full_name || 'Business'}
                  </Text>
                  {merchant?.verification_status === 'verified' && (
                    <View style={styles.verifiedBadge}>
                      <CheckCircle color="#00ff88" size={14} />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  )}
                </View>
                <View style={styles.amountContainer}>
                  <Text style={styles.amountLabel}>Amount</Text>
                  <Text style={styles.amount}>KSh {parseFloat(amount as string).toFixed(2)}</Text>
                </View>
              </LinearGradient>
            </BlurView>

            <BlurView intensity={20} tint="dark" style={styles.featuresCardBlur}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.01)']}
                style={styles.featuresCard}
              >
                {[
                  { text: 'Instant payment', icon: Zap },
                  { text: 'No transaction fees', icon: CheckCircle },
                  { text: 'Secure & encrypted', icon: CheckCircle }
                ].map(({ text, icon: Icon }, i) => (
                  <View key={i} style={styles.feature}>
                    <Icon color="#00ff88" size={16} />
                    <Text style={styles.featureText}>{text}</Text>
                  </View>
                ))}
              </LinearGradient>
            </BlurView>

            <BlurView intensity={25} tint="dark" style={styles.payButtonBlur}>
              <Pressable onPress={processPOSPayment}>
                <LinearGradient
                  colors={['rgba(163, 245, 66, 0.3)', 'rgba(163, 245, 66, 0.15)']}
                  style={styles.payButton}
                >
                  <CreditCard color="#a3f542" size={24} />
                  <Text style={styles.payButtonText}>Pay KSh {amount}</Text>
                </LinearGradient>
              </Pressable>
            </BlurView>
          </>
        )}

        {status === 'processing' && (
          <>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <BlurView intensity={30} tint="dark" style={styles.processingCircleBlur}>
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                  <LinearGradient
                    colors={['rgba(163, 245, 66, 0.4)', 'rgba(163, 245, 66, 0.1)']}
                    style={styles.processingCircle}
                  >
                    <Zap color="#a3f542" size={64} strokeWidth={2.5} />
                  </LinearGradient>
                </Animated.View>
              </BlurView>
            </Animated.View>

            <Text style={styles.processingText}>Processing...</Text>
            <Text style={styles.subtext}>Completing your payment</Text>

            <View style={styles.pulseContainer}>
              {[1, 2, 3].map((i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.pulseRing,
                    {
                      width: 160 + (i * 40),
                      height: 160 + (i * 40),
                      opacity: 0.6 - (i * 0.15),
                      transform: [{ scale: pulseAnim }]
                    }
                  ]}
                />
              ))}
            </View>
          </>
        )}

        {status === 'success' && (
          <>
            <BlurView intensity={30} tint="dark" style={styles.successCircleBlur}>
              <LinearGradient
                colors={['rgba(0, 255, 136, 0.3)', 'rgba(0, 255, 136, 0.1)']}
                style={styles.successCircle}
              >
                <CheckCircle color="#00ff88" size={64} strokeWidth={2.5} />
              </LinearGradient>
            </BlurView>

            <Text style={styles.successText}>Payment Complete!</Text>
            <Text style={styles.successAmount}>KSh {parseFloat(amount as string).toFixed(2)}</Text>
            <Text style={styles.subtext}>
              Paid to {merchant?.business_name || merchant?.full_name}
            </Text>

            <BlurView intensity={20} tint="dark" style={styles.successBadgeBlur}>
              <LinearGradient
                colors={['rgba(0, 255, 136, 0.2)', 'rgba(0, 255, 136, 0.05)']}
                style={styles.successBadge}
              >
                <Zap color="#00ff88" size={16} />
                <Text style={styles.successBadgeText}>Instant • No fees</Text>
              </LinearGradient>
            </BlurView>
          </>
        )}

        {status === 'error' && (
          <>
            <BlurView intensity={30} tint="dark" style={styles.errorCircleBlur}>
              <LinearGradient
                colors={['rgba(255, 68, 68, 0.3)', 'rgba(255, 68, 68, 0.1)']}
                style={styles.errorCircle}
              >
                <AlertCircle color="#ff4444" size={64} strokeWidth={2.5} />
              </LinearGradient>
            </BlurView>

            <Text style={styles.errorText}>Payment Failed</Text>
            <Text style={styles.subtext}>
              {Number(user && amount) > 0 ? 'Insufficient balance' : 'Please try again'}
            </Text>

            <BlurView intensity={25} tint="dark" style={styles.retryButtonBlur}>
              <Pressable onPress={() => setStatus('ready')}>
                <LinearGradient
                  colors={['rgba(163, 245, 66, 0.3)', 'rgba(163, 245, 66, 0.15)']}
                  style={styles.retryButton}
                >
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </LinearGradient>
              </Pressable>
            </BlurView>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  phoneCircleBlur: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: 'rgba(163, 245, 66, 0.5)',
  },
  phoneCircle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingCircleBlur: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: 'rgba(163, 245, 66, 0.6)',
  },
  processingCircle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCircleBlur: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 136, 0.6)',
  },
  successCircle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorCircleBlur: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: 'rgba(255, 68, 68, 0.6)',
  },
  errorCircle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  processingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#a3f542',
    textAlign: 'center',
    marginBottom: 12,
  },
  successText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00ff88',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 12,
  },
  successAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 32,
  },
  merchantCardBlur: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  merchantCard: {
    padding: 24,
  },
  merchantInfo: {
    marginBottom: 16,
  },
  merchantLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 6,
  },
  merchantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedText: {
    fontSize: 13,
    color: '#00ff88',
    fontWeight: '600',
  },
  amountContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  amountLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 6,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#a3f542',
  },
  featuresCardBlur: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  featuresCard: {
    padding: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  payButtonBlur: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(163, 245, 66, 0.3)',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#a3f542',
  },
  pulseContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 2,
    borderColor: 'rgba(163, 245, 66, 0.4)',
  },
  successBadgeBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  successBadgeText: {
    fontSize: 14,
    color: '#00ff88',
    fontWeight: '600',
  },
  retryButtonBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(163, 245, 66, 0.3)',
  },
  retryButton: {
    paddingHorizontal: 48,
    paddingVertical: 16,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a3f542',
  },
});
