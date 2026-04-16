import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Delete, Divide, Minus, Plus, X, Scan, QrCode, LayoutGrid } from 'lucide-react-native';
import { useZenti } from '@/contexts/ZentiContext';
import SwipeButton from '@/components/SwipeButton';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence,
  withTiming,
  FadeInUp,
  withRepeat
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PayScreen() {
  const [amount, setAmount] = useState('0');
  const [mathResult, setMathResult] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const { mode: modeParam, type } = useLocalSearchParams();
  const [mode, setMode] = useState<'send' | 'request'>((modeParam as any) || 'send');
  const { showIsland, selectedRecipient, completeSession, balance } = useZenti();

  const amountScale = useSharedValue(1);
  const swipeKey = useSharedValue(0);
  const rippleScale = useSharedValue(1);
  const rippleOpacity = useSharedValue(0.5);

  const animatedAmountStyle = useAnimatedStyle(() => ({
    transform: [{ scale: amountScale.value }],
  }));

  const animatedRippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  useState(() => {
    rippleScale.value = withRepeat(withTiming(1.5, { duration: 2000 }), -1, true);
    rippleOpacity.value = withRepeat(withTiming(0, { duration: 2000 }), -1, false);
  });

  const handleNumberPress = (num: string) => {
    amountScale.value = withSequence(withTiming(1.1, { duration: 50 }), withSpring(1));
    if (amount === '0' && num !== '.') {
      setAmount(num);
    } else if (amount.length < 10) {
      setAmount(amount + num);
    }
  };

  const handleDecimalPress = () => {
    amountScale.value = withSequence(withTiming(1.1, { duration: 50 }), withSpring(1));
    if (!amount.includes('.')) {
      setAmount(amount + '.');
    }
  };

  const handleDelete = () => {
    amountScale.value = withSequence(withTiming(0.9, { duration: 50 }), withSpring(1));
    if (amount.length === 1) {
      setAmount('0');
      setMathResult(null);
    } else {
      setAmount(amount.slice(0, -1));
    }
  };

  const handleOperator = (op: string) => {
    try {
      const result = eval(amount);
      if (typeof result === 'number' && !isNaN(result)) {
        setMathResult(result);
      }
    } catch (e) {}
  };

  const useResult = () => {
    if (mathResult !== null) {
      setAmount(mathResult.toString());
      setMathResult(null);
    }
  };

  const handleConfirm = () => {
    const amountNum = parseFloat(amount);
    if (amountNum > 0) {
      if (mode === 'request' && type === 'general') {
        setIsGenerating(true);
        setTimeout(() => {
          setIsGenerating(false);
          setSuccess(true);
        }, 3000);
      } else {
        showIsland({ type: 'pending', amount: amountNum, recipient: selectedRecipient || undefined });
        setTimeout(() => {
          completeSession();
          setSuccess(true);
        }, 1500);
      }
    }
  };

  if (isGenerating) {
    return (
      <View style={styles.generatingContainer}>
        <View style={styles.qrWrapper}>
           <Animated.View style={[styles.ripple, animatedRippleStyle]} />
           <QrCode color="#fff" size={120} />
        </View>
        <Text style={styles.generatingTitle}>Generating Request</Text>
        <Text style={styles.generatingSub}>Hold near customer's phone or show QR</Text>
        <Text style={styles.generatingAmount}>KES {amount}</Text>
        
        <Pressable style={styles.cancelGen} onPress={() => setIsGenerating(false)}>
          <Text style={styles.cancelGenText}>Cancel</Text>
        </Pressable>
      </View>
    );
  }

  if (success) {
    return (
      <View style={styles.successContainer}>
        <Animated.View entering={FadeInUp} style={styles.successContent}>
          <View style={styles.successBadge}>
             <Text style={styles.successBadgeText}>$</Text>
          </View>
          
          <Text style={styles.successActionType}>
            {mode === 'request' ? 'Request Sent' : 'Payment Sent'}
          </Text>
          <Text style={styles.successRecipient}>
            {mode === 'request' ? `From ${selectedRecipient?.name || 'User'}` : `To ${selectedRecipient?.name || 'User'}`}
          </Text>

          <Text style={styles.successAmount}>KES {parseFloat(amount).toLocaleString()}</Text>
          <Text style={styles.successTime}>Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </Animated.View>

        <Pressable 
          style={styles.doneButton} 
          onPress={() => {
            setSuccess(false);
            router.replace('/');
          }}
        >
          <View style={styles.doneButtonContent}>
             <Text style={styles.doneButtonText}>✓ Completed</Text>
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
         <Pressable style={styles.closeButton} onPress={() => router.back()}>
            <X color="#fff" size={28} />
         </Pressable>
         
         {selectedRecipient ? (
           <View style={styles.recipientHeader}>
              <View style={[styles.miniAvatar, { backgroundColor: selectedRecipient.color || '#333' }]}>
                 <Text style={styles.miniAvatarText}>{selectedRecipient.name[0]}</Text>
              </View>
              <Text style={styles.recipientName}>To {selectedRecipient.name}</Text>
           </View>
         ) : (
           <View style={styles.tabContainer}>
              <Pressable 
                style={[styles.tab, mode === 'send' && styles.activeTab]} 
                onPress={() => setMode('send')}
              >
                <Text style={[styles.tabText, mode === 'send' && styles.activeTabText]}>Send</Text>
              </Pressable>
              <Pressable 
                style={[styles.tab, mode === 'request' && styles.activeTab]} 
                onPress={() => setMode('request')}
              >
                <Text style={[styles.tabText, mode === 'request' && styles.activeTabText]}>Request</Text>
              </Pressable>
           </View>
         )}

         <Pressable style={[styles.closeButton]}>
            <LayoutGrid color="#fff" size={24} opacity={0.6} />
         </Pressable>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>KES</Text>
        <Animated.View style={animatedAmountStyle}>
          <Text style={styles.amountText}>{amount}</Text>
          {mathResult !== null && (
            <Pressable onPress={useResult}>
              <Text style={styles.resultText}>= {mathResult}</Text>
            </Pressable>
          )}
        </Animated.View>
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.swipeContainer}>
          {parseFloat(amount) > 0 ? (
            <SwipeButton 
              onComplete={handleConfirm} 
              title={mode === 'send' ? "Swipe to send" : "Swipe to request"}
              revertOnFinish={true}
            />
          ) : (
            <View style={styles.placeholderButton}>
                <Text style={styles.placeholderText}>
                  Enter amount
                </Text>
            </View>
          )}
        </View>

        <View style={styles.operatorRow}>
          <Pressable style={styles.opKey} onPress={() => handleOperator('+')}><Plus color="#fff" size={20} /></Pressable>
          <Pressable style={styles.opKey} onPress={() => handleOperator('-')}><Minus color="#fff" size={20} /></Pressable>
          <Pressable style={styles.opKey} onPress={() => handleOperator('*')}><X color="#fff" size={16} /></Pressable>
          <Pressable style={styles.opKey} onPress={() => handleOperator('/')}><Divide color="#fff" size={20} /></Pressable>
        </View>

        <View style={styles.keyboardContainer}>
          {[
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['.', '0', 'delete']
          ].map((row, i) => (
            <View key={i} style={styles.keyboardRow}>
              {row.map((key) => (
                <Key 
                   key={key} 
                   label={key} 
                   onPress={() => {
                     if (key === 'delete') handleDelete();
                     else if (key === '.') handleDecimalPress();
                     else handleNumberPress(key);
                   }} 
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function Key({ label, onPress }: { label: string, onPress: () => void }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.06);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: `rgba(255,255,255,${opacity.value})`,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92);
    opacity.value = withTiming(0.12, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withTiming(0.06, { duration: 100 });
  };

  return (
    <AnimatedPressable 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.key, animatedStyle]}
    >
      {label === 'delete' ? <Delete color="#fff" size={24} /> : <Text style={styles.keyText}>{label}</Text>}
    </AnimatedPressable>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  recipientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniAvatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  recipientName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 4,
    borderRadius: 24,
  },
  tab: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabText: {
    color: '#000',
    fontWeight: '700',
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 160,
    marginTop: 10,
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginRight: 8,
    opacity: 0.8,
  },
  amountText: {
    fontSize: 84,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -2,
  },
  resultText: {
    fontSize: 24,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: -8,
  },
  controlsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  swipeContainer: {
    paddingHorizontal: 24,
    marginBottom: 40,
    height: 64,
  },
  placeholderButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  placeholderText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 16,
    fontWeight: '600',
  },
  operatorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 24,
  },
  opKey: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  key: {
    flex: 1,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 36,
  },
  keyText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  successBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  successBadgeText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '800',
  },
  successActionType: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  successRecipient: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 40,
  },
  successAmount: {
    color: '#fff',
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: -2,
    marginBottom: 12,
  },
  successTime: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 16,
    fontWeight: '600',
  },
  doneButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#22C55E',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  doneButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  generatingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  qrWrapper: {
    width: 240,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  ripple: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  generatingTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  generatingSub: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 40,
  },
  generatingAmount: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 60,
  },
  cancelGen: {
    padding: 16,
  },
  cancelGenText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 16,
    fontWeight: '700',
  }
});
