import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Platform, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Smartphone, QrCode as QrIcon, X, CheckCircle2 } from 'lucide-react-native';
import { useZenti } from '@/contexts/ZentiContext';
import PaymentFeedback from '@/components/PaymentFeedback';

const { width } = Dimensions.get('window');

export default function ReceivePaymentScreen() {
  const params = useLocalSearchParams();
  const amountStr = params.amount as string || '0';
  const amountNum = parseFloat(amountStr);
  
  const { session, createSession, lockSession, completeSession, failSession, resetSession } = useZenti();
  const [status, setStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [timeLeft, setTimeLeft] = useState(60);
  const router = useRouter();

  const isAndroid = Platform.OS === 'android';

  useEffect(() => {
    // Automatically generate session on entry
    const sessionId = createSession(amountNum);
    
    // Timer for expiration
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      resetSession();
    };
  }, []);

  const handleSimulatePayment = (method: 'qr' | 'nfc') => {
    if (!session || session.status !== 'pending') return;
    if (timeLeft === 0) return;

    if (lockSession(method)) {
      setTimeout(() => {
        const success = Math.random() > 0.1;
        if (success) {
          completeSession();
          setStatus('success');
        } else {
          failSession();
          setStatus('failed');
        }
      }, 1500);
    }
  };

  const isLocked = session?.status === 'locked' || session?.status === 'completed';
  const isExpired = timeLeft === 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color="#fff" size={24} />
        </Pressable>
        <Text style={styles.title}>Secure POS</Text>
        <View style={styles.timerBadge}>
           <Text style={[styles.timerText, isExpired && { color: '#FF4D4D' }]}>{timeLeft}s</Text>
        </View>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Merchant POS Terminal</Text>
        <Text style={styles.amountText}>KES {amountNum.toLocaleString()}</Text>
      </View>

      <View style={styles.paymentBox}>
         <View style={[styles.qrContainer, isLocked && session?.method !== 'qr' && styles.dimmed]}>
            {isExpired ? (
              <View style={styles.expiredContent}>
                <X color="#FF4D4D" size={48} />
                <Text style={styles.expiredText}>Session Expired</Text>
              </View>
            ) : (
              <View style={styles.qrWrapper}>
                <QRCode
                  value={JSON.stringify({ 
                    s: session?.id, 
                    a: amountNum, 
                    m: 'M-12345', // Merchant ID 
                    t: 'zenti-pos' 
                  })}
                  size={width * 0.55}
                  color={isLocked ? '#444' : '#000'}
                  backgroundColor="#fff"
                />
                {isLocked && session?.method === 'qr' && (
                  <View style={styles.qrOverlay}>
                    <ActivityIndicator color="#fff" size="large" />
                    <Text style={styles.processingText}>Processing QR...</Text>
                  </View>
                )}
              </View>
            )}
         </View>

         <View style={styles.guideContainer}>
            <View style={styles.methodIcon}>
               {isAndroid ? <Smartphone color="#fff" size={32} /> : <QrIcon color="#fff" size={32} />}
            </View>
            <Text style={styles.guideText}>
               {isAndroid ? "Scan or Hold Near to Pay" : "Scan QR code to Pay"}
            </Text>
            {isAndroid && !isLocked && !isExpired && (
                <View style={styles.nfcPulse} />
            )}
         </View>
      </View>

      {/* NFC Action specifically for Android Simulation */}
      {isAndroid && !isLocked && !isExpired && (
        <Pressable style={styles.nfcSimBtn} onPress={() => handleSimulatePayment('nfc')}>
          <Text style={styles.nfcSimBtnText}>Simulate NFC Tap</Text>
        </Pressable>
      )}
      
      {!isLocked && !isExpired && (
        <Pressable style={styles.qrSimBtn} onPress={() => handleSimulatePayment('qr')}>
          <Text style={styles.qrSimBtnText}>Simulate QR Scan</Text>
        </Pressable>
      )}

      {isExpired && (
        <Pressable style={styles.resetBtn} onPress={() => router.back()}>
          <Text style={styles.resetBtnText}>New Transaction</Text>
        </Pressable>
      )}

      <PaymentFeedback 
        status={status} 
        amount={amountNum} 
        onFinished={() => {
          setStatus('idle');
          router.replace('/');
        }} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  timerBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timerText: {
    color: '#00FF88',
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  amountLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  amountText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1,
  },
  paymentBox: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 32,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
    marginBottom: 40,
  },
  qrWrapper: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 16,
  },
  qrOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
     color: '#fff',
     fontSize: 14,
     fontWeight: '600',
     marginTop: 12,
  },
  dimmed: {
     opacity: 0.3,
  },
  expiredContent: {
     width: width * 0.55,
     height: width * 0.55,
     justifyContent: 'center',
     alignItems: 'center',
     gap: 12,
  },
  expiredText: {
     color: '#000',
     fontSize: 16,
     fontWeight: '700',
  },
  guideContainer: {
     alignItems: 'center',
     gap: 12,
  },
  methodIcon: {
     width: 60,
     height: 60,
     borderRadius: 30,
     backgroundColor: 'rgba(255,255,255,0.08)',
     justifyContent: 'center',
     alignItems: 'center',
  },
  guideText: {
     color: '#fff',
     fontSize: 18,
     fontWeight: '600',
     textAlign: 'center',
  },
  nfcPulse: {
     position: 'absolute',
     top: -10,
     width: 80,
     height: 80,
     borderRadius: 40,
     borderWidth: 2,
     borderColor: '#00FF88',
     opacity: 0.5,
  },
  nfcSimBtn: {
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
    marginHorizontal: 40,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
    marginBottom: 12,
    alignItems: 'center',
  },
  nfcSimBtnText: {
    color: '#00FF88',
    fontWeight: '700',
    fontSize: 14,
  },
  qrSimBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: 40,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 40,
    alignItems: 'center',
  },
  qrSimBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  resetBtn: {
    backgroundColor: '#fff',
    marginHorizontal: 40,
    padding: 18,
    borderRadius: 24,
    marginBottom: 40,
    alignItems: 'center',
  },
  resetBtnText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 16,
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  amountLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    marginBottom: 8,
  },
  amountText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1,
  },
  methodsContainer: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  qrSection: {
    alignItems: 'center',
    gap: 16,
  },
  methodTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
  },
  lockedQr: {
    opacity: 0.5,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 40,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  separatorText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 12,
    fontWeight: '700',
  },
  nfcSection: {
    alignItems: 'center',
    gap: 12,
  },
  nfcText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'center',
  },
  disabledSection: {
    opacity: 0.2,
  },
  demoHelper: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  demoButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  demoButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  }
});
