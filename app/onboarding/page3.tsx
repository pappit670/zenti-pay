import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  SlideInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Sparkles, ArrowLeft } from 'lucide-react-native';
import { useEffect } from 'react';

const { width } = Dimensions.get('window');

export default function OnboardingPage3() {
  const router = useRouter();
  const glowOpacity = useSharedValue(0.5);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0.5, { duration: 2000 })
      ),
      -1
    );
  }, []);

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ffffff', '#fafafa']}
        style={styles.gradient}
      />

      <Animated.View
        entering={FadeIn.duration(800)}
        style={styles.content}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft color="#000000" size={24} />
        </Pressable>

        <View style={styles.centerSection}>
          <Animated.View
            style={styles.logoWrapper}
            entering={SlideInUp.delay(200).duration(1000)}
          >
            <Animated.View
              style={[styles.glow, glowAnimatedStyle]}
            />
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>Z</Text>
            </View>
          </Animated.View>

          <Animated.Text
            style={styles.brandName}
            entering={SlideInUp.delay(400).duration(1000)}
          >
            Zenti
          </Animated.Text>

          <Animated.Text
            style={styles.tagline}
            entering={SlideInUp.delay(600).duration(1000)}
          >
            Join the future of payments
          </Animated.Text>

          <Animated.View
            style={styles.features}
            entering={SlideInUp.delay(800).duration(1000)}
          >
            <View style={styles.featureItem}>
              <Sparkles color="#000000" size={16} />
              <Text style={styles.featureText}>Seamless P2P transfers</Text>
            </View>
            <View style={styles.featureItem}>
              <Sparkles color="#000000" size={16} />
              <Text style={styles.featureText}>Business tools coming soon</Text>
            </View>
            <View style={styles.featureItem}>
              <Sparkles color="#000000" size={16} />
              <Text style={styles.featureText}>Trusted by thousands</Text>
            </View>
          </Animated.View>
        </View>

        <Animated.View
          style={styles.bottomSection}
          entering={SlideInUp.delay(1000).duration(1000)}
        >
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push('/auth/signup')}
          >
            <Text style={styles.primaryButtonText}>Create Account</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push('/auth/signin')}
          >
            <Text style={styles.secondaryButtonText}>Log In</Text>
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
    paddingVertical: 40,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 24,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: 40,
  },
  glow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    left: -30,
    top: -30,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  logo: {
    fontSize: 64,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 2,
  },
  brandName: {
    fontSize: 48,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 40,
    fontWeight: '400',
  },
  features: {
    gap: 16,
    alignItems: 'flex-start',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
  },
  bottomSection: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});
