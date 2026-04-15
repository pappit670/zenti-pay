import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  withSequence,
  runOnJS,
  interpolate,
  Extrapolate,
  withRepeat
} from 'react-native-reanimated';
import { Check, X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface PaymentFeedbackProps {
  status: 'success' | 'failed' | 'idle';
  amount?: number;
  onFinished: () => void;
}

export default function PaymentFeedback({ status, amount, onFinished }: PaymentFeedbackProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const glow = useSharedValue(1);

  useEffect(() => {
    if (status !== 'idle') {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 12 });
      
      glow.value = withRepeat(
        withTiming(1.2, { duration: 1000 }),
        -1,
        true
      );

      const timer = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 });
        scale.value = withTiming(0, { duration: 300 }, () => {
          runOnJS(onFinished)();
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [status]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glow.value }],
    opacity: interpolate(glow.value, [1, 1.2], [0.5, 0]),
  }));

  if (status === 'idle') return null;

  const isSuccess = status === 'success';

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.container, containerStyle]}>
        <View style={styles.iconContainer}>
          <Animated.View style={[
            styles.glow, 
            glowStyle, 
            { backgroundColor: isSuccess ? '#00FF88' : '#FF4D4D' }
          ]} />
          <View style={[
            styles.iconCircle, 
            { backgroundColor: isSuccess ? '#00FF88' : '#FF4D4D' }
          ]}>
            {isSuccess ? (
              <Check color="#000" size={48} strokeWidth={4} />
            ) : (
              <X color="#000" size={48} strokeWidth={4} />
            )}
          </View>
        </View>
        
        <Text style={styles.statusText}>
          {isSuccess ? 'Payment Received' : 'Payment Failed'}
        </Text>
        
        {isSuccess && amount !== undefined && (
          <Text style={styles.amountText}>KES {amount}</Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  container: {
    alignItems: 'center',
    gap: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  glow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    zIndex: 1,
  },
  statusText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  amountText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 20,
    fontWeight: '600',
  },
});
