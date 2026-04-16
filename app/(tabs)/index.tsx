import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, RefreshControl, Dimensions, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useMode } from '@/contexts/ModeContext';
import { 
  User, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Scan,
  LayoutGrid,
  Bell,
  Search,
  Wallet as WalletIcon,
  ChevronRight
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useZenti } from '@/contexts/ZentiContext';
import AddCashModal from '@/components/AddCashModal';
import ProfileMenuModal from '@/components/ProfileMenuModal';
import Animated, { 
  FadeInUp, 
  FadeInDown, 
  SlideInRight,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const MOCK_TRANSACTIONS = [
  { id: '1', amount: 450, type: 'receive', sender: 'John Doe', meta: 'Dinner Split', date: 'Today' },
  { id: '2', amount: 1200, type: 'send', recipient: 'Amazon', meta: 'Electronics', date: 'Yesterday' },
  { id: '3', amount: 85, type: 'receive', sender: 'Apple', meta: 'Subscription Refund', date: 'Oct 12' },
  { id: '4', amount: 2500, type: 'send', recipient: 'Rent', meta: 'Monthly Rent', date: 'Oct 01' },
];

export default function HomeScreen() {
  const { showIsland, cardState, balance } = useZenti();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [showAddCash, setShowAddCash] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const scrollY = useSharedValue(0);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const cardTranslateY = useAnimatedStyle(() => ({
    transform: [{ 
      translateY: interpolate(scrollY.value, [0, 100], [0, -40], Extrapolate.CLAMP) 
    }],
  }));

  return (
    <View style={styles.container}>
      {/* Premium Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Money</Text>
        <View style={styles.headerRight}>
          <Pressable style={styles.headerIcon} onPress={() => router.push('/contacts')}>
            <Search color="#fff" size={24} strokeWidth={2.5} />
          </Pressable>
          <Pressable style={styles.headerIcon} onPress={() => router.push('/wallet')}>
            <CreditCard color="#fff" size={24} strokeWidth={2.5} />
          </Pressable>
          <Pressable style={styles.headerIcon} onPress={() => setShowProfile(true)}>
            <View style={styles.profileCircle}>
               <Image 
                 source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' }} 
                 style={styles.profileImage} 
               />
            </View>
          </Pressable>
        </View>
      </View>

      <Animated.ScrollView 
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
      >
        {/* Layered Card Container */}
        <View style={styles.heroSection}>
           {/* Background Card (Zenti Card Peeking) */}
           <Animated.View style={[styles.backgroundCard, cardTranslateY]}>
              <View style={styles.lockedHeader}>
                 <View style={styles.lockedBadge}>
                    <LayoutGrid color="#000" size={14} />
                    <Text style={styles.lockedText}>Locked</Text>
                 </View>
                 <Text style={styles.tagText}>$Irupt</Text>
              </View>
           </Animated.View>

           {/* Foreground Card (Balance) */}
           <View style={styles.balanceCard}>
              <View style={styles.balanceHeader}>
                 <Text style={styles.balanceLabel}>Cash balance</Text>
                 <ChevronRight color="#000" size={20} />
                 <View style={{ flex: 1 }} />
                 <Scan color="#000" size={20} opacity={0.5} />
              </View>
              <Text style={styles.balanceAmount}>KES {balance.toLocaleString()}</Text>
              
              <View style={styles.actionRow}>
                 <Pressable style={styles.actionButton} onPress={() => setShowAddCash(true)}>
                    <Text style={styles.actionButtonText}>Add money</Text>
                 </Pressable>
                 <Pressable style={styles.actionButton} onPress={() => router.push('/withdraw' as any)}>
                    <Text style={styles.actionButtonText}>Withdraw</Text>
                 </Pressable>
              </View>
           </View>
        </View>

        {/* Status Section */}
        <View style={styles.statusSection}>
           <View style={styles.statusRow}>
              <View style={styles.statusBadge}>
                 <View style={styles.statusDot} />
                 <Text style={styles.statusTitle}>Green status</Text>
              </View>
              <Text style={styles.statusSub}>KES 496.85 away</Text>
           </View>
           <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '60%' }]} />
           </View>
        </View>

        {/* More for you Section */}
        <View style={styles.discoverySection}>
           <Text style={styles.discoveryTitle}>More for you</Text>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.discoveryScroll}>
              <Pressable style={styles.discoveryTile}>
                 <Text style={styles.tileLabel}>Zenti Green</Text>
                 <Text style={styles.tileTitle}>Turn spending into status</Text>
                 <View style={styles.tileFooter}>
                    <View style={styles.miniTile} />
                 </View>
              </Pressable>
              <Pressable style={[styles.discoveryTile, { backgroundColor: '#1A1A1A' }]}>
                 <Text style={styles.tileLabel}>Savings</Text>
                 <Text style={styles.tileTitle}>Save while you spend</Text>
              </Pressable>
           </ScrollView>
        </View>
      </Animated.ScrollView>

      <AddCashModal visible={showAddCash} onClose={() => setShowAddCash(false)} />
      <ProfileMenuModal visible={showProfile} onClose={() => setShowProfile(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroSection: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 32,
  },
  backgroundCard: {
    backgroundColor: '#CCFF00', // Lime green
    height: 180,
    borderRadius: 24,
    marginBottom: -140, // Pull foreground card up
    zIndex: 1,
  },
  lockedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  lockedText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '700',
  },
  tagText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.6,
  },
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
    marginRight: 4,
  },
  balanceAmount: {
    fontSize: 64,
    fontWeight: '800',
    color: '#000',
    letterSpacing: -2,
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  statusSection: {
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#00FF88',
  },
  statusTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  statusSub: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00FF88',
    borderRadius: 2,
  },
  discoverySection: {
    paddingLeft: 16,
  },
  discoveryTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  discoveryScroll: {
    paddingRight: 16,
    gap: 12,
  },
  discoveryTile: {
    width: 280,
    height: 200,
    backgroundColor: '#111',
    borderRadius: 24,
    padding: 20,
    justifyContent: 'space-between',
  },
  tileLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    fontWeight: '700',
  },
  tileTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 28,
  },
  tileFooter: {
    alignItems: 'center',
  },
  miniTile: {
    width: 40,
    height: 40,
    backgroundColor: '#00FF88',
    borderRadius: 8,
  }
});
