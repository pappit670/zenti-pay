import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Send, ArrowRight } from 'lucide-react-native';
import { useEffect } from 'react';

const { width } = Dimensions.get('window');

export default function OnboardingPage1() {
  const router = useRouter();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.6, { duration: 1000 })
      ),
      -1
    );
  }, []);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ffffff', '#f5f5f5']}
        style={styles.gradient}
      />

      <Animated.View entering={FadeIn.duration(800)} style={styles.content}>
        <View style={styles.topSection}>
          <Animated.View
            style={[styles.iconWrapper, iconAnimatedStyle]}
            entering={SlideInDown.delay(200).duration(800)}
          >
            <View style={styles.iconContainer}>
              <Send color="#000000" size={48} strokeWidth={1.5} />
            </View>
          </Animated.View>

          <Animated.Text
            style={styles.title}
            entering={SlideInDown.delay(400).duration(800)}
          >
            Money Made Simple
          </Animated.Text>

          <Animated.View
            style={styles.featuresContainer}
            entering={SlideInDown.delay(600).duration(800)}
          >
            <Text style={styles.feature}>Send</Text>
            <Text style={styles.feature}>Receive</Text>
            <Text style={styles.feature}>Pay</Text>
          </Animated.View>
        </View>

        <Animated.View
          style={styles.bottomSection}
          entering={FadeIn.delay(900).duration(800)}
        >
          <Pressable
            style={styles.button}
            onPress={() => router.push('/onboarding/page2')}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <ArrowRight color="#ffffff" size={20} strokeWidth={2} />
          </Pressable>

          <Pressable
            onPress={() => router.push('/auth/signin')}
          >
            <Text style={styles.loginText}>Already have an account?</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  topSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  iconWrapper: {
    marginBottom: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 44,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: -1,
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  feature: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  bottomSection: {
    width: '100%',
    gap: 16,
  },
  button: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginText: {
    color: '#999999',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
