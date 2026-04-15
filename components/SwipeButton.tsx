import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedGestureHandler, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  runOnJS,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';

const BUTTON_WIDTH = Dimensions.get('window').width - 48;
const BUTTON_HEIGHT = 64;
const SWIPE_RANGE = BUTTON_WIDTH - BUTTON_HEIGHT;

interface SwipeButtonProps {
  onComplete: () => void;
  title?: string;
}

export default function SwipeButton({ onComplete, title = "Swipe right to confirm" }: SwipeButtonProps) {
  const translateX = useSharedValue(0);
  const isCompleted = useSharedValue(false);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { startX: number }>({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      if (isCompleted.value) return;
      const newValue = ctx.startX + event.translationX;
      translateX.value = Math.min(Math.max(newValue, 0), SWIPE_RANGE);
    },
    onEnd: () => {
      if (translateX.value > SWIPE_RANGE * 0.8) {
        translateX.value = withSpring(SWIPE_RANGE);
        isCompleted.value = true;
        runOnJS(onComplete)();
      } else {
        translateX.value = withSpring(0);
      }
    },
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
      
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.thumb, animatedThumbStyle]}>
          <ChevronRight color="#000" size={32} strokeWidth={3} />
        </Animated.View>
      </PanGestureHandler>
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
