import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, CreditCard, Waves, CheckCircle, AlertCircle, Zap } from 'lucide-react-native';

export default function AddCashNFCGlass() {
  const router = useRouter();
  const { user } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (scanning) {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.3,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [scanning]);

  const startNFCScan = async () => {
    if (Platform.OS === 'web') {
      alert('NFC is only available on mobile devices');
      return;
    }

    setScanning(true);
    setStatus('scanning');

    setTimeout(() => {
      setStatus('success');
      setAmount(1000);
      setScanning(false);

      setTimeout(() => {
        router.back();
      }, 2500);
    }, 3000);
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
        <Text style={styles.title}>Tap to Add Cash</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        {status === 'idle' && (
          <>
            <BlurView intensity={30} tint="dark" style={styles.nfcCircleBlur}>
              <LinearGradient
                colors={['rgba(163, 245, 66, 0.2)', 'rgba(163, 245, 66, 0.05)']}
                style={styles.nfcCircle}
              >
                <CreditCard color="#a3f542" size={64} strokeWidth={2} />
              </LinearGradient>
            </BlurView>

            <Text style={styles.instruction}>Tap your card to add funds</Text>
            <Text style={styles.subtext}>
              Position your debit or credit card on the back of your phone
            </Text>

            <BlurView intensity={20} tint="dark" style={styles.featuresCardBlur}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
                style={styles.featuresCard}
              >
                {[
                  { text: 'Instant top-up', icon: Zap },
                  { text: 'Secure & encrypted', icon: CheckCircle },
                  { text: 'No card details saved', icon: CheckCircle }
                ].map(({ text, icon: Icon }, i) => (
                  <View key={i} style={styles.feature}>
                    <View style={styles.featureIcon}>
                      <Icon color="#00ff88" size={18} />
                    </View>
                    <Text style={styles.featureText}>{text}</Text>
                  </View>
                ))}
              </LinearGradient>
            </BlurView>

            <BlurView intensity={25} tint="dark" style={styles.scanButtonBlur}>
              <Pressable onPress={startNFCScan}>
                <LinearGradient
                  colors={['rgba(163, 245, 66, 0.3)', 'rgba(163, 245, 66, 0.15)']}
                  style={styles.scanButton}
                >
                  <Waves color="#a3f542" size={24} />
                  <Text style={styles.scanButtonText}>Start NFC Scan</Text>
                </LinearGradient>
              </Pressable>
            </BlurView>
          </>
        )}

        {status === 'scanning' && (
          <>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <BlurView intensity={30} tint="dark" style={styles.scanningCircleBlur}>
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                  <LinearGradient
                    colors={['rgba(163, 245, 66, 0.3)', 'rgba(163, 245, 66, 0.1)']}
                    style={styles.scanningCircle}
                  >
                    <Waves color="#a3f542" size={64} strokeWidth={2.5} />
                  </LinearGradient>
                </Animated.View>
              </BlurView>
            </Animated.View>

            <Text style={styles.scanningText}>Scanning...</Text>
            <Text style={styles.subtext}>Hold your card steady</Text>

            <View style={styles.pulseContainer}>
              {[1, 2, 3].map((i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.pulseRing,
                    {
                      width: 160 + (i * 40),
                      height: 160 + (i * 40),
                      opacity: 0.8 - (i * 0.2),
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

            <Text style={styles.successText}>Success!</Text>
            <Text style={styles.amountText}>KSh {amount.toFixed(2)}</Text>
            <Text style={styles.subtext}>Added to your Zenti Wallet</Text>

            <BlurView intensity={20} tint="dark" style={styles.successBadgeBlur}>
              <LinearGradient
                colors={['rgba(0, 255, 136, 0.2)', 'rgba(0, 255, 136, 0.05)']}
                style={styles.successBadge}
              >
                <Zap color="#00ff88" size={16} />
                <Text style={styles.successBadgeText}>No fees • Instant</Text>
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

            <Text style={styles.errorText}>Scan Failed</Text>
            <Text style={styles.subtext}>Please try again or use another method</Text>

            <BlurView intensity={25} tint="dark" style={styles.retryButtonBlur}>
              <Pressable onPress={startNFCScan}>
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

      <BlurView intensity={20} tint="dark" style={styles.infoCardBlur}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
          style={styles.infoCard}
        >
          <Text style={styles.infoTitle}>Supported Cards</Text>
          <Text style={styles.infoText}>Visa, Mastercard, Co-op, Equity, KCB, NCBA</Text>
        </LinearGradient>
      </BlurView>
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
  nfcCircleBlur: {
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: 'rgba(163, 245, 66, 0.4)',
  },
  nfcCircle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningCircleBlur: {
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: 'rgba(163, 245, 66, 0.6)',
  },
  scanningCircle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCircleBlur: {
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
    marginBottom: 40,
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
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
    marginBottom: 40,
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
  scanningText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#a3f542',
    textAlign: 'center',
    marginBottom: 12,
  },
  successText: {
    fontSize: 32,
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
  amountText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 40,
  },
  featuresCardBlur: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  featuresCard: {
    padding: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  featureIcon: {
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
  },
  scanButtonBlur: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(163, 245, 66, 0.3)',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  scanButtonText: {
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
    borderColor: 'rgba(163, 245, 66, 0.5)',
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
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a3f542',
  },
  infoCardBlur: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  infoCard: {
    padding: 20,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 20,
  },
});
