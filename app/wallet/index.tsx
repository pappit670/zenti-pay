import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Plus, X } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useZenti } from '@/contexts/ZentiContext';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = 220;
const SPACING = 100; // Overlap spacing

const CARDS = [
  { id: '1', name: 'Zenti Black', color: '#000000', type: 'zenti', last4: '8842' },
  { id: '2', name: 'Zenti White', color: '#FFFFFF', type: 'zenti', last4: '1234' },
  { id: '3', name: 'BofA Mastercard', color: '#1A1A1A', type: 'bank', last4: '5566' },
];

export default function WalletScreen() {
  const router = useRouter();
  const { balance } = useZenti();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <X color="#fff" size={28} />
        </Pressable>
        <Text style={styles.headerTitle}>Cards</Text>
        <View style={styles.headerRight}>
           <Pressable style={styles.headerIcon}><Plus color="#fff" size={24} /></Pressable>
        </View>
      </View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CARDS.map((card, index) => {
          const animatedStyle = useAnimatedStyle(() => {
            // Smooth rise effect when scrolled or just stagnant as requested
            // We'll keep it simple and clean
            return {
              zIndex: index,
            };
          });

          return (
            <Animated.View key={card.id} style={[styles.cardWrapper, animatedStyle]}>
              <Pressable 
                style={styles.cardContainer}
                onPress={() => router.push({ pathname: '/wallet/detail', params: { id: card.id } })}
              >
                <View style={[styles.card, { backgroundColor: card.color, borderWidth: card.color === '#FFFFFF' ? 0 : 1, borderColor: 'rgba(255,255,255,0.1)' }]}>
                  <View style={styles.cardTop}>
                    <Text style={[styles.cardBrand, { color: card.color === '#FFFFFF' ? '#000' : '#fff' }]}>zenti</Text>
                    <Text style={[styles.cardLast4, { color: card.color === '#FFFFFF' ? '#000' : '#fff' }]}>KES {balance.toLocaleString()}</Text>
                  </View>
                  <View style={styles.cardBottom}>
                     <View>
                        <Text style={[styles.cardName, { color: card.color === '#FFFFFF' ? '#000' : '#fff' }]}>{card.name}</Text>
                        <Text style={[styles.cardInfo, { color: card.color === '#FFFFFF' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)' }]}>
                          {card.type === 'bank' ? `•••• ${card.last4}` : 'WALLET'}
                        </Text>
                     </View>
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 15,
  },
  headerIcon: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 200,
  },
  cardWrapper: {
    height: 80, // Tight overlap
    paddingHorizontal: 20,
  },
  cardContainer: {
    height: CARD_HEIGHT,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'space-between',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBrand: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1.5,
  },
  cardLast4: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardInfo: {
    fontSize: 14,
    fontWeight: '600',
  },
});
