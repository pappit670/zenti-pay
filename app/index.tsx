import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/onboarding/recovery-phrase');
  }, []);

  return <View style={{ flex: 1, backgroundColor: '#000' }} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 60,
  },
  mainSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 48,
  },
  logoContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  zIconContainer: {
    width: 50,
    height: 50,
    position: 'relative',
  },
  zLine: {
    position: 'absolute',
    height: 4,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  zDiagonal: {
    position: 'absolute',
    width: 50,
    height: 4,
    backgroundColor: '#ffffff',
    borderRadius: 2,
    transform: [{ rotate: '-25deg' }],
    top: 23,
    left: 0,
  },
  brandName: {
    fontSize: 48,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -1,
  },
  heroSection: {
    alignItems: 'center',
    gap: 12,
    paddingBottom: 20,
  },
  subtitle: {
    fontSize: 15,
    color: '#999999',
    textAlign: 'center',
    fontWeight: '300',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    gap: 16,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '300',
  },
});
