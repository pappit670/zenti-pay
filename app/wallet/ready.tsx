import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle2, Copy, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { useZenti } from '@/contexts/ZentiContext';

const { width } = Dimensions.get('window');

export default function WalletReadyPage() {
  const router = useRouter();
  const { cardState } = useZenti();

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(800)} style={styles.content}>
        <Text style={styles.title}>
          Your wallet is <Text style={styles.titleHighlight}>ready.</Text>
        </Text>

        <View style={styles.cardContainer}>
          <View style={[styles.card, { backgroundColor: '#1A1A1A' }]}>
            <View style={styles.cardTop}>
              <CheckCircle2 color="#fff" size={24} />
              <View style={styles.addressContainer}>
                <Text style={styles.address}>0x3e7b....054f</Text>
                <Copy color="rgba(255,255,255,0.5)" size={16} />
              </View>
            </View>

            <View style={styles.cardBottom}>
              <View>
                <Text style={styles.userName}>Dmitry</Text>
                <Text style={styles.balance}>{cardState.balance} ETH</Text>
              </View>
              <Pressable style={styles.backupButton}>
                <Text style={styles.backupText}>Back Up Now</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Shield color="rgba(0,0,0,0.2)" size={20} />
          <Text style={styles.infoText}>
            Since you manually imported your wallet, you're already backed up and can continue safely.
          </Text>
        </View>

        <Pressable 
          style={styles.viewWalletButton} 
          onPress={() => router.push('/wallet/detail')}
        >
          <Text style={styles.viewWalletText}>View Wallet</Text>
        </Pressable>
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
    paddingHorizontal: 30,
    paddingTop: 100,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 60,
  },
  titleHighlight: {
    color: '#D83AD0',
    textDecorationLine: 'underline',
  },
  cardContainer: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 15,
    marginBottom: 100,
  },
  card: {
    width: '100%',
    aspectRatio: 1.6,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'space-between',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  address: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  balance: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontWeight: '600',
  },
  backupButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backupText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderStyle: 'dashed',
    borderRadius: 20,
    padding: 20,
    marginBottom: 40,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#999',
    lineHeight: 18,
    textAlign: 'center',
  },
  viewWalletButton: {
    backgroundColor: '#1A1A1A',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  viewWalletText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
