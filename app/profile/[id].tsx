import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X, Star, ChevronLeft, ShieldCheck, Info } from 'lucide-react-native';
import Animated, { FadeInUp, SlideInRight } from 'react-native-reanimated';

export default function UserProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Mock data for the specific user
  const user = {
    name: 'Steph Locc',
    tag: '$locccsteph',
    initial: 'S',
    joined: 'Oct 2018',
    totalReceived: 30.00,
    totalSent: 0.00,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft color="#fff" size={28} />
        </Pressable>
        <Pressable style={styles.menuButton}>
          <View style={styles.dot} /><View style={styles.dot} /><View style={styles.dot} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHero}>
           <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>{user.initial}</Text>
           </View>
           <View style={styles.nameRow}>
              <Text style={styles.name}>{user.name}</Text>
              <View style={styles.verifiedBadge}>
                 <ShieldCheck color="#22C55E" size={16} fill="#22C55E" />
              </View>
           </View>
           <Text style={styles.tag}>{user.tag}</Text>

           <View style={styles.mainActions}>
              <Pressable style={styles.requestButton}>
                 <Text style={styles.requestButtonText}>Request</Text>
              </Pressable>
              <Pressable style={styles.payButton} onPress={() => router.push({ pathname: '/pay', params: { id } })}>
                 <Text style={styles.payButtonText}>Pay</Text>
              </Pressable>
           </View>

           <Pressable style={styles.favoriteButton}>
              <Star color="rgba(255,255,255,0.4)" size={20} />
              <Text style={styles.favoriteText}>Favorite</Text>
           </Pressable>
        </View>

        <View style={styles.statsRow}>
           <View style={styles.statItem}>
              <View style={styles.statIcon}><Info color="rgba(255,255,255,0.4)" size={16}/></View>
              <Text style={styles.statText}>Joined {user.joined}</Text>
           </View>
           <View style={styles.statItem}>
              <View style={styles.statIcon}><Info color="rgba(255,255,255,0.4)" size={16}/></View>
              <Text style={styles.statText}>Paid by people you know</Text>
           </View>
        </View>

        <View style={styles.historySection}>
           <Text style={styles.sectionTitle}>Your history</Text>
           <View style={styles.historyCard}>
              <Text style={styles.txCount}>2 Total Transactions</Text>
              <View style={styles.barHeader}>
                 <Text style={styles.barAmount}>${user.totalReceived.toFixed(2)}</Text>
                 <Text style={styles.barAmountSecondary}>${user.totalSent.toFixed(2)}</Text>
              </View>
              <View style={styles.progressBar}>
                 <View style={[styles.progressFill, { width: '100%' }]} />
              </View>
              <View style={styles.barFooter}>
                 <Text style={styles.barLabel}>Total Received</Text>
                 <Text style={styles.barLabel}>Total Sent</Text>
              </View>
           </View>
        </View>

        <View style={styles.transactionList}>
           <View style={styles.txItem}>
              <View style={styles.txIcon} />
              <View style={styles.txDetails}>
                 <Text style={styles.txTitle}>Payment</Text>
                 <Text style={styles.txDate}>Today</Text>
              </View>
              <Text style={styles.txAmount}>+ $10</Text>
           </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
  menuButton: {
    flexDirection: 'row',
    gap: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  profileHero: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2D5AFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarInitial: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '700',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  verifiedBadge: {
    marginTop: 4,
  },
  tag: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 32,
  },
  mainActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    width: '100%',
  },
  requestButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestButtonText: {
    color: '#22C55E',
    fontSize: 18,
    fontWeight: '700',
  },
  payButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  favoriteButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  favoriteText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 18,
    fontWeight: '700',
  },
  statsRow: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    marginBottom: 40,
    justifyContent: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    fontWeight: '600',
  },
  historySection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  historyCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
  },
  txCount: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  barAmount: {
    color: '#22C55E',
    fontSize: 18,
    fontWeight: '800',
  },
  barAmountSecondary: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 16,
    fontWeight: '600',
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22C55E',
  },
  barFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barLabel: {
    color: '#22C55E',
    fontSize: 12,
    fontWeight: '700',
  },
  transactionList: {
    paddingHorizontal: 16,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2D5AFE',
    marginRight: 16,
  },
  txDetails: {
    flex: 1,
  },
  txTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  txDate: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
  },
  txAmount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  }
});
