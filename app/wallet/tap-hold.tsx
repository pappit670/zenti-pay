import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle2, ChevronDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn, 
  SlideInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { useZenti } from '@/contexts/ZentiContext';

const { width, height } = Dimensions.get('window');

export default function TapHoldPage() {
  const router = useRouter();
  const { cardState } = useZenti();
  const [isDone, setIsDone] = useState(false);
  const ringScale = useSharedValue(0.8);
  const ringOpacity = useSharedValue(0.5);

  useEffect(() => {
    ringScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1500 }),
        withTiming(0.8, { duration: 1500 })
      ),
      -1
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1500 }),
        withTiming(0.5, { duration: 1500 })
      ),
      -1
    );

    // Simulate completion after 3 seconds
    const timer = setTimeout(() => {
      setIsDone(true);
      setTimeout(() => router.back(), 2000);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const animatedRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(500)} style={styles.content}>
        <View style={styles.topCardContainer}>
          <LinearGradient
            colors={[cardState.color, '#1A1A1A']}
            style={styles.card}
          >
            <View style={styles.cardContent}>
                 <Text style={styles.brand}>zenti</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.feedbackContainer}>
          {isDone ? (
            <Animated.View entering={FadeIn} style={styles.doneContainer}>
              <View style={styles.doneCircle}>
                <CheckCircle2 color="#007AFF" size={48} />
              </View>
              <Text style={styles.doneText}>Done</Text>
            </Animated.View>
          ) : (
            <View style={styles.holdingContainer}>
                <Animated.View style={[styles.pulseRing, animatedRingStyle]} />
                <View style={styles.holdingCircle} />
                <Text style={styles.holdingText}>Hold near Reader</Text>
            </View>
          )}
        </View>

        <View style={styles.stackedCardsContainer}>
            <View style={[styles.stackedCard, { backgroundColor: '#111', bottom: 20, zIndex: 3 }]} />
            <View style={[styles.stackedCard, { backgroundColor: '#222', bottom: 10, zIndex: 2 }]} />
            <View style={[styles.stackedCard, { backgroundColor: '#333', bottom: 0, zIndex: 1 }]}>
               <View style={styles.transitCardContent}>
                  <Text style={styles.transitText}>jetBlue</Text>
                  <View>
                     <Text style={styles.transitSub}>FLIGHT 1106</Text>
                     <Text style={styles.transitSub}>GATE L2</Text>
                  </View>
               </View>
            </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
  },
  topCardContainer: {
    width: '90%',
    aspectRatio: 1.58,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 60,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  brand: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -1,
  },
  feedbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  holdingContainer: {
    alignItems: 'center',
  },
  holdingCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    marginBottom: 16,
  },
  pulseRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  holdingText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  doneContainer: {
    alignItems: 'center',
  },
  doneCircle: {
    marginBottom: 16,
  },
  doneText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  stackedCardsContainer: {
    width: '100%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  stackedCard: {
    position: 'absolute',
    width: '90%',
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  transitCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transitText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  transitSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'right',
  }
});
