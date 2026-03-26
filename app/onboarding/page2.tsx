import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated';
import { Zap, ArrowRight, ArrowLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const features = [
  { icon: 'Zap', title: 'Instant Transfers', desc: 'Money moves at lightning speed' },
  { icon: 'Zap', title: 'No Hidden Fees', desc: 'What you see is what you pay' },
  { icon: 'Zap', title: 'Always Safe', desc: 'Bank-grade security, always on' },
];

export default function OnboardingPage2() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f5f5f5', '#ffffff']}
        style={styles.gradient}
      />

      <Animated.View
        entering={FadeIn.duration(800)}
        style={styles.content}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft color="#000000" size={24} />
          </Pressable>
          <View style={styles.progress}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        <Animated.Text
          style={styles.title}
          entering={SlideInDown.delay(200).duration(800)}
        >
          Built For Everyone
        </Animated.Text>

        <Animated.Text
          style={styles.subtitle}
          entering={SlideInDown.delay(300).duration(800)}
        >
          Fast transfers, clean experience, no stress.
        </Animated.Text>

        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Animated.View
              key={index}
              style={styles.featureCard}
              entering={SlideInDown.delay(400 + index * 100).duration(800)}
            >
              <View style={styles.featureIcon}>
                <Zap color="#000000" size={24} />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </Animated.View>
          ))}
        </View>

        <Animated.View
          style={styles.buttons}
          entering={FadeIn.delay(800).duration(800)}
        >
          <Pressable
            style={styles.button}
            onPress={() => router.push('/onboarding/page3')}
          >
            <Text style={styles.buttonText}>Continue</Text>
            <ArrowRight color="#ffffff" size={20} strokeWidth={2} />
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
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  activeDot: {
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 40,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 48,
    fontWeight: '400',
  },
  featuresGrid: {
    gap: 16,
    flex: 1,
  },
  featureCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: '#999999',
    fontWeight: '400',
  },
  buttons: {
    gap: 12,
    marginBottom: 20,
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
});
