import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, RefreshControl, Dimensions, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useMode } from '@/contexts/ModeContext';
import { supabase } from '@/lib/supabase';
import { Profile, Account } from '@/types/database';
import { 
  User, 
  Search, 
  CreditCard, 
  Menu, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Scan,
  LayoutGrid
} from 'lucide-react-native';
import { useZenti } from '@/contexts/ZentiContext';

const { width } = Dimensions.get('window');

interface Transaction {
  id: string;
  amount: number;
  type: 'send' | 'receive';
  recipient?: string;
  sender?: string;
  created_at: string;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { currentMode } = useMode();
  const { showIsland } = useZenti();
  const router = useRouter();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
    const { data: a } = await supabase.from('accounts').select('*').eq('user_id', user.id).eq('is_primary', true).maybeSingle();
    const { data: tx } = await supabase.from('transactions').select('*').limit(10).order('created_at', { ascending: false });

    if (p) setProfile(p);
    if (a) setAccount(a);
    if (tx) {
      setTransactions(tx.map((t: any) => ({
        id: t.id,
        amount: t.amount,
        type: t.type as 'send' | 'receive',
        recipient: t.recipient_name,
        sender: t.sender_name,
        created_at: t.created_at
      })));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Pressable style={styles.iconButton} onPress={() => router.push('/profile')}>
          <User color="#fff" size={24} />
        </Pressable>
        <View style={styles.searchBar}>
          <Search color="rgba(255,255,255,0.4)" size={18} />
          <Text style={styles.searchText}>Search</Text>
        </View>
        <View style={styles.rightIcons}>
          <Pressable style={styles.iconButton} onPress={() => router.push('/wallet/detail')}>
            <CreditCard color="#fff" size={24} />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={() => router.push('/onboarding/recovery-phrase')}>
            <LayoutGrid color="#fff" size={24} />
          </Pressable>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
      >
        {/* Card Section - Center of Attention */}
        <View style={styles.cardSection}>
          <Pressable style={styles.cardContainer} onPress={() => router.push('/wallet/detail')}>
             <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1621416848440-2369c44dd761?q=80&w=2000&auto=format&fit=crop' }} 
                style={styles.cardGraphic}
                blurRadius={1}
             />
             <View style={styles.cardOverlay}>
                <Text style={styles.cardBrand}>Zenti Black</Text>
                <View style={styles.cardNumber}>
                   <Text style={[styles.cardDot, { marginRight: 2 }]}>••••</Text>
                   <Text style={[styles.cardDot, { marginRight: 2 }]}>••••</Text>
                   <Text style={[styles.cardDot, { marginRight: 2 }]}>••••</Text>
                   <Text style={styles.cardLastFour}>8842</Text>
                </View>
             </View>
          </Pressable>
        </View>

        {/* Greeting & Quick Actions */}
        <View style={styles.mainContent}>
          <View style={styles.greetingRow}>
            <View>
              <Text style={styles.greetingText}>{getGreeting()},</Text>
              <Text style={styles.nameText}>{profile?.full_name?.split(' ')[0] || 'Dina'}</Text>
            </View>
            <Pressable 
              style={styles.sendRequestButton} 
              onPress={() => router.push('/pay')}
            >
              <Text style={styles.sendRequestText}>Send or Request</Text>
            </Pressable>
          </View>

          {/* Balance info */}
          <View style={styles.balanceInfo}>
             <Text style={styles.balanceLabel}>Balance</Text>
             <Text style={styles.balanceAmount}>KES {account?.balance?.toLocaleString() || '7,854.43'}</Text>
             <Text style={styles.autoReload}>Auto Reload On</Text>
          </View>

          {/* Transaction List */}
          <View style={styles.transactionsHeader}>
             <Text style={styles.sectionTitle}>Latest Transactions</Text>
             <Pressable>
                <LayoutGrid color="rgba(255,255,255,0.4)" size={20} />
             </Pressable>
          </View>

          {transactions.map((tx) => (
            <Pressable key={tx.id} style={styles.transactionItem}>
               <View style={styles.txIcon}>
                  {tx.type === 'send' ? <ArrowUpRight color="#FF4D4D" size={20} /> : <ArrowDownLeft color="#00FF88" size={20} />}
               </View>
               <View style={styles.txDetails}>
                  <Text style={styles.txName}>{tx.type === 'send' ? tx.recipient : tx.sender}</Text>
                  <Text style={styles.txMeta}>{tx.type === 'send' ? 'Sent - Allowance' : 'Received - Payment'}</Text>
               </View>
               <Text style={[styles.txAmount, { color: tx.type === 'send' ? '#fff' : '#00FF88' }]}>
                  {tx.type === 'send' ? '-' : '+'}KES {tx.amount.toLocaleString()}
               </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button for Scan (since no nav bar) */}
      <Pressable style={styles.fab} onPress={() => router.push('/pay')}>
          <Scan color="#000" size={28} strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  searchText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 15,
    fontWeight: '500',
  },
  rightIcons: {
    flexDirection: 'row',
    gap: 4,
  },
  cardSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  cardContainer: {
    width: width - 40,
    height: (width - 40) * 0.62,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardGraphic: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.6,
  },
  cardOverlay: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  cardBrand: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  cardNumber: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDot: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 24,
    letterSpacing: -2,
    marginTop: 4,
  },
  cardLastFour: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  greetingText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 16,
    fontWeight: '500',
  },
  nameText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    marginTop: 4,
  },
  sendRequestButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  sendRequestText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 15,
  },
  balanceInfo: {
    marginBottom: 40,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1,
  },
  autoReload: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 13,
    marginTop: 4,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  txIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  txDetails: {
    flex: 1,
  },
  txName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  txMeta: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
  },
  txAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  }
});
