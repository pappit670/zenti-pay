import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MoreHorizontal, X, PlusCircle, LayoutGrid, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useZenti } from '@/contexts/ZentiContext';

const CARDS_DATA: Record<string, { name: string; color: string; last4: string }> = {
  '1': { name: 'Zenti Black', color: '#000000', last4: '8842' },
  '2': { name: 'Zenti White', color: '#FFFFFF', last4: '1234' },
  '3': { name: 'BofA Mastercard', color: '#1A1A1A', last4: '5566' },
};

export default function CardDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { balance } = useZenti();
  const cardId = Array.isArray(id) ? id[0] : id || '1';
  const card = CARDS_DATA[cardId] || CARDS_DATA['1'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <X color="#fff" size={28} />
        </Pressable>
        <Pressable style={styles.moreButton}>
            <MoreHorizontal color="#fff" size={28} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInUp.duration(600)} style={styles.cardSection}>
           <View style={[styles.card, { backgroundColor: card.color, borderWidth: card.color === '#FFFFFF' ? 0 : 1, borderColor: 'rgba(255,255,255,0.1)' }]}>
              <Text style={[styles.cardBrand, { color: card.color === '#FFFFFF' ? '#000' : '#fff' }]}>zenti</Text>
              <View style={styles.cardBottom}>
                 <Text style={[styles.cardNumber, { color: card.color === '#FFFFFF' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)' }]}>•••• {card.last4}</Text>
              </View>
           </View>
        </Animated.View>

        <View style={styles.balanceInfo}>
           <Text style={styles.balanceLabel}>Balance</Text>
           <View style={styles.balanceRow}>
              <Text style={styles.balanceAmount}>KES {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
              <Pressable style={styles.sendButton} onPress={() => router.push('/contacts')}>
                 <Text style={styles.sendButtonText}>Send or Request</Text>
              </Pressable>
           </View>
           <Text style={styles.autoReload}>Auto Reload On</Text>
        </View>

        <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.setupSection}>
           <Pressable style={styles.setupCard}>
              <View style={styles.setupIconContainer}>
                 <PlusCircle color="#fff" size={24} />
              </View>
              <View style={styles.setupInfo}>
                 <Text style={styles.setupTitle}>Set Up Now</Text>
              </View>
              <ChevronRight color="rgba(255,255,255,0.2)" size={20} />
           </Pressable>
        </Animated.View>

        <View style={styles.transactionsSection}>
           <Text style={styles.sectionTitle}>Latest Transactions</Text>
           <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No recent transactions</Text>
           </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  cardSection: {
    width: '100%',
    aspectRatio: 1.58,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
  card: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  cardBrand: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1.5,
  },
  cardBottom: {
    alignItems: 'flex-start',
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  balanceInfo: {
    marginBottom: 40,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  sendButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '700',
  },
  autoReload: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 14,
    fontWeight: '500',
  },
  setupSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  setupCard: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  setupIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setupInfo: {
    flex: 1,
  },
  setupTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  transactionsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 20,
  },
  emptyState: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 16,
    fontWeight: '600',
  }
});
