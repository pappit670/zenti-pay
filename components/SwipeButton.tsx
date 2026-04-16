import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  runOnJS,
  interpolate
} from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';

const BUTTON_WIDTH = Dimensions.get('window').width - 48;
const BUTTON_HEIGHT = 64;
const SWIPE_RANGE = BUTTON_WIDTH - BUTTON_HEIGHT;

interface SwipeButtonProps {
  onComplete: () => void;
  title?: string;
  revertOnFinish?: boolean;
}

export default function SwipeButton({ onComplete, title = "Swipe right to confirm", revertOnFinish = false }: SwipeButtonProps) {
  const translateX = useSharedValue(0);
  const isCompleted = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (isCompleted.value && !revertOnFinish) return;
      translateX.value = Math.min(Math.max(event.translationX, 0), SWIPE_RANGE);
    })
    .onEnd(() => {
      if (translateX.value > SWIPE_RANGE * 0.8) {
        if (!revertOnFinish) {
          translateX.value = withSpring(SWIPE_RANGE);
          isCompleted.value = true;
        } else {
          translateX.value = withSpring(0);
        }
        runOnJS(onComplete)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_RANGE * 0.5], [1, 0]),
  }));

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.title, animatedTextStyle]}>{title}</Animated.Text>
      
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.thumb, animatedThumbStyle]}>
          <ChevronRight color="#000" size={32} strokeWidth={3} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    backgroundColor: '#1a1a1a',
    borderRadius: 32,
    justifyContent: 'center',
    padding: 4,
    overflow: 'hidden',
  },
  thumb: {
    width: BUTTON_HEIGHT - 8,
    height: BUTTON_HEIGHT - 8,
    backgroundColor: '#fff',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 4,
  },
  title: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
});
