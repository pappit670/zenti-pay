import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  withDelay,
  withSequence,
  Easing,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Check, X, Loader2, Lock, AlertCircle } from 'lucide-react-native';
import { useZenti } from '@/contexts/ZentiContext';

const { width } = Dimensions.get('window');

export default function ZentiIsland() {
  const { islandState, showIsland, hideIsland } = useZenti();
  const translateY = useSharedValue(-120);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (islandState.type !== 'idle') {
      translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 300 });
      
      // Bounce effect
      scale.value = withSequence(
        withTiming(1.05, { duration: 150 }),
        withSpring(1)
      );

      // Auto-dismiss for certain states
      if (['success', 'error', 'pending'].includes(islandState.type)) {
        if (islandState.type !== 'pending') {
          const timeout = setTimeout(() => {
            translateY.value = withSpring(-120);
            opacity.value = withTiming(0, { duration: 300 });
            setTimeout(hideIsland, 350);
          }, 3000);
          return () => clearTimeout(timeout);
        }
      }
    } else {
      translateY.value = withSpring(-120);
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [islandState]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
    opacity: opacity.value
  }));

  if (islandState.type === 'idle') return null;

  const renderContent = () => {
    switch (islandState.type) {
      case 'success':
        return (
          <View style={styles.contentRow}>
            <Check color="#00FF88" size={20} strokeWidth={3} />
            <Text style={[styles.text, { color: '#00FF88' }]}>
               KES {islandState.amount} Sent
            </Text>
          </View>
        );
      case 'error':
        return (
          <View style={styles.contentRow}>
            <X color="#FF4D4D" size={20} strokeWidth={3} />
            <Text style={[styles.text, { color: '#FF4D4D' }]}>
               {islandState.message}
            </Text>
          </View>
        );
      case 'pending':
        return (
          <View style={styles.contentRow}>
             <Loader2 color="#ccc" size={20} strokeWidth={3} style={{ transform: [{ rotate: '45deg' }] }} />
            <Text style={[styles.text, { color: '#ccc' }]}>
               Sending KES {islandState.amount}...
            </Text>
          </View>
        );
      case 'blocked':
        return (
          <View style={styles.contentRow}>
            <Lock color="#FFB800" size={20} strokeWidth={3} />
            <Text style={[styles.text, { color: '#FFB800' }]}>
               Card Blocked
            </Text>
          </View>
        );
      case 'insufficient_balance':
        return (
          <View style={styles.contentRow}>
            <AlertCircle color="#FF4D4D" size={20} strokeWidth={3} />
            <Text style={[styles.text, { color: '#FF4D4D' }]}>
               Insufficient Balance
            </Text>
          </View>
        );
      case 'request':
        return (
          <View style={styles.requestContainer}>
            <Text style={styles.requestText}>
              {islandState.from} requests KES {islandState.amount}
            </Text>
            <View style={styles.requestActions}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => {
                  hideIsland();
                  // Simulate biometric and then success
                  showIsland({ type: 'success', amount: islandState.amount });
                }}
              >
                <Text style={[styles.actionText, { color: '#00FF88' }]}>Accept</Text>
              </TouchableOpacity>
              <View style={styles.separator} />
              <TouchableOpacity style={styles.actionButton} onPress={hideIsland}>
                <Text style={[styles.actionText, { color: '#FF4D4D' }]}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const getGlowStyle = () => {
    if (islandState.type === 'success') return styles.successGlow;
    if (islandState.type === 'error') return styles.errorGlow;
    return {};
  };

  return (
    <Animated.View style={[styles.container, animatedStyle, getGlowStyle()]}>
      {renderContent()}
    </Animated.View>
  );
}

// Custom definition removed. Using built-in withSequence from react-native-reanimated.

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: '#111',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    minWidth: 240,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
  },
  successGlow: {
    shadowColor: '#00FF88',
    shadowOpacity: 0.3,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
  },
  errorGlow: {
    shadowColor: '#FF4D4D',
    shadowOpacity: 0.3,
    borderWidth: 1,
    borderColor: 'rgba(255, 77, 77, 0.3)',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  requestContainer: {
    alignItems: 'center',
  },
  requestText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  requestActions: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    width: '100%',
    paddingTop: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '700',
  },
  separator: {
    width: 1,
    height: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
  }
});
