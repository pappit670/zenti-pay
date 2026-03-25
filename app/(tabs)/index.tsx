import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useMode } from '@/contexts/ModeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Profile, Account } from '@/types/database';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { User, Send, Plus, HandCoins, MoveHorizontal as MoreHorizontal, QrCode, DollarSign, ChartBar as BarChart3, Settings, UserPlus, Circle as HelpCircle, List, ArrowUpRight, ArrowDownLeft, Star, Users, Smartphone } from 'lucide-react-native';

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
  const { theme, colors } = useTheme();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    const { data: accountData } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_primary', true)
      .maybeSingle();

    const { data: transactionsData } = await supabase
      .from('transactions')
      .select('*')
      .or(`from_account_id.eq.${accountData?.id},to_account_id.eq.${accountData?.id}`)
      .order('created_at', { ascending: false })
      .limit(5);

    if (profileData) setProfile(profileData);
    if (accountData) setAccount(accountData);
    if (transactionsData) {
      const formattedTransactions = transactionsData.map((t: any) => ({
        id: t.id,
        amount: t.amount,
        type: (t.type === 'send' ? 'send' : 'receive') as 'send' | 'receive',
        recipient: t.recipient_name,
        sender: t.sender_name,
        created_at: t.created_at
      }));
      setTransactions(formattedTransactions);
    }
  };

  const formatBalance = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(2)}M`;
    }
    if (amount >= 50000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toFixed(2);
  };

  const formatCurrency = (amount: number) => {
    return formatBalance(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getFirstName = () => {
    if (currentMode === 'business' && profile?.business_name) {
      return profile.business_name;
    }
    if (profile?.full_name) {
      return profile.full_name.split(' ')[0];
    }
    return 'User';
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderPersonalActions = () => (
    <View style={styles.actionsRow}>
      <Pressable style={styles.actionButton} onPress={() => router.push('/send')}>
        <View style={styles.actionIconContainer}>
          <Send color="#000000" size={24} strokeWidth={2} />
        </View>
        <Text style={styles.actionText}>Send</Text>
      </Pressable>

      <Pressable style={styles.actionButton} onPress={() => router.push('/request')}>
        <View style={styles.actionIconContainer}>
          <HandCoins color="#000000" size={24} strokeWidth={2} />
        </View>
        <Text style={styles.actionText}>Request</Text>
      </Pressable>

      <Pressable style={styles.actionButton} onPress={() => router.push('/add-funds')}>
        <View style={styles.actionIconContainer}>
          <Plus color="#000000" size={24} strokeWidth={2} />
        </View>
        <Text style={styles.actionText}>Add Funds</Text>
      </Pressable>

      <Pressable style={styles.actionButton} onPress={() => setShowMoreModal(true)}>
        <View style={styles.actionIconContainer}>
          <MoreHorizontal color="#000000" size={24} strokeWidth={2} />
        </View>
        <Text style={styles.actionText}>More</Text>
      </Pressable>
    </View>
  );

  const renderBusinessActions = () => (
    <View style={styles.actionsRow}>
      <Pressable style={styles.actionButton} onPress={() => router.push('/business/dashboard-glass')}>
        <View style={styles.actionIconContainer}>
          <BarChart3 color="#000000" size={24} strokeWidth={2} />
        </View>
        <Text style={styles.actionText}>Dashboard</Text>
      </Pressable>

      <Pressable style={styles.actionButton} onPress={() => router.push('/smart-link/create-glass')}>
        <View style={styles.actionIconContainer}>
          <QrCode color="#000000" size={24} strokeWidth={2} />
        </View>
        <Text style={styles.actionText}>Smart Link</Text>
      </Pressable>

      <Pressable style={styles.actionButton} onPress={() => router.push('/business/tip-glass')}>
        <View style={styles.actionIconContainer}>
          <DollarSign color="#000000" size={24} strokeWidth={2} />
        </View>
        <Text style={styles.actionText}>Tips</Text>
      </Pressable>

      <Pressable style={styles.actionButton} onPress={() => setShowMoreModal(true)}>
        <View style={styles.actionIconContainer}>
          <MoreHorizontal color="#000000" size={24} strokeWidth={2} />
        </View>
        <Text style={styles.actionText}>More</Text>
      </Pressable>
    </View>
  );

  const gradientColors = (theme === 'light'
    ? ['#f5f5f5', '#ffffff', '#f5f5f5']
    : ['#0a0a0a', '#000000', '#0a0a0a']) as [string, string, ...string[]];

  const cardGradientColors = (theme === 'light'
    ? ['rgba(0, 0, 0, 0.05)', 'rgba(0, 0, 0, 0.02)']
    : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']) as [string, string, ...string[]];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.text}
            colors={[colors.text]}
          />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.welcomeText, { color: colors.text }]}>Welcome back, {getFirstName()} 👋</Text>
          <Pressable style={[styles.profileButton, { backgroundColor: colors.cardOpacity }]} onPress={() => router.push('/(tabs)/profile')}>
            <LinearGradient
              colors={cardGradientColors}
              style={styles.profileGradient}
            >
              <User color={colors.text} size={20} strokeWidth={2.5} />
            </LinearGradient>
          </Pressable>
        </View>

        <BlurView intensity={30} tint={theme} style={styles.balanceCard}>
          <LinearGradient
            colors={cardGradientColors}
            style={styles.cardGradient}
          >
            <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Available Balance</Text>
            <Text style={[styles.balance, { color: colors.text }]}>{formatCurrency(account?.balance || 0)}</Text>
            {currentMode === 'business' && (
              <Text style={[styles.pendingText, { color: colors.textSecondary }]}>0 pending</Text>
            )}
          </LinearGradient>
        </BlurView>

        <View style={styles.quickActionsContainer}>
          {currentMode === 'business' ? renderBusinessActions() : renderPersonalActions()}
        </View>

        <View style={styles.transactionsContainer}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>Recent Transactions</Text>
            <Pressable onPress={() => router.push('/(tabs)/wallet')}>
              <Text style={styles.seeAllText}>See all</Text>
            </Pressable>
          </View>

          {transactions.length === 0 ? (
            <BlurView intensity={20} tint="dark" style={styles.emptyCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.03)']}
                style={styles.emptyGradient}
              >
                <Text style={styles.emptyText}>No transactions yet</Text>
              </LinearGradient>
            </BlurView>
          ) : (
            transactions.map((transaction) => (
              <BlurView key={transaction.id} intensity={20} tint="dark" style={styles.transactionCard}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.03)'] as [string, string, ...string[]]}
                  style={styles.transactionGradient}
                >
                  <View style={styles.transactionIcon}>
                    {transaction.type === 'send' ? (
                      <ArrowUpRight color="#ff4444" size={20} strokeWidth={2.5} />
                    ) : (
                      <ArrowDownLeft color="#44ff88" size={20} strokeWidth={2.5} />
                    )}
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionName}>
                      {transaction.type === 'send'
                        ? transaction.recipient || 'Unknown'
                        : transaction.sender || 'Unknown'}
                    </Text>
                    <Text style={styles.transactionDate}>{formatDate(transaction.created_at)}</Text>
                  </View>
                  <Text style={[
                    styles.transactionAmount,
                    transaction.type === 'send' ? styles.sentAmount : styles.receivedAmount
                  ]}>
                    {transaction.type === 'send' ? '-' : '+'}
                    {formatCurrency(transaction.amount)}
                  </Text>
                </LinearGradient>
              </BlurView>
            ))
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showMoreModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMoreModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowMoreModal(false)}
        >
          <View style={styles.modalContent}>
            <BlurView intensity={40} tint="dark" style={styles.modalBlur}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                style={styles.modalGradient}
              >
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle}>More Options</Text>

                <Pressable
                  style={styles.modalItem}
                  onPress={() => {
                    setShowMoreModal(false);
                    router.push('/(tabs)/wallet');
                  }}
                >
                  <List color="#ffffff" size={20} strokeWidth={2} />
                  <Text style={styles.modalItemText}>View Transactions</Text>
                </Pressable>

                {currentMode === 'business' && (
                  <>
                    <Pressable
                      style={styles.modalItem}
                      onPress={() => {
                        setShowMoreModal(false);
                        router.push('/business/reputation');
                      }}
                    >
                      <Star color="#ffd700" size={20} strokeWidth={2} />
                      <Text style={styles.modalItemText}>Reputation & Reviews</Text>
                    </Pressable>

                    <Pressable
                      style={styles.modalItem}
                      onPress={() => {
                        setShowMoreModal(false);
                        router.push('/pos-payment');
                      }}
                    >
                      <Smartphone color="#a3f542" size={20} strokeWidth={2} />
                      <Text style={styles.modalItemText}>POS Payment</Text>
                    </Pressable>

                    <Pressable
                      style={styles.modalItem}
                      onPress={() => {
                        setShowMoreModal(false);
                        router.push('/(tabs)/statistics');
                      }}
                    >
                      <BarChart3 color="#ffffff" size={20} strokeWidth={2} />
                      <Text style={styles.modalItemText}>Analytics</Text>
                    </Pressable>
                  </>
                )}

                <Pressable
                  style={styles.modalItem}
                  onPress={() => {
                    setShowMoreModal(false);
                    router.push('/(tabs)/profile');
                  }}
                >
                  <Settings color="#ffffff" size={20} strokeWidth={2} />
                  <Text style={styles.modalItemText}>Settings</Text>
                </Pressable>

                <Pressable style={styles.modalItem}>
                  <HelpCircle color="#ffffff" size={20} strokeWidth={2} />
                  <Text style={styles.modalItemText}>Help & Support</Text>
                </Pressable>

                {currentMode === 'personal' && (
                  <>
                    <Pressable
                      style={styles.modalItem}
                      onPress={() => {
                        setShowMoreModal(false);
                        router.push('/split-bill');
                      }}
                    >
                      <Users color="#a3f542" size={20} strokeWidth={2} />
                      <Text style={styles.modalItemText}>Split Bill</Text>
                    </Pressable>

                    <Pressable
                      style={styles.modalItem}
                      onPress={() => {
                        setShowMoreModal(false);
                        router.push('/payment-reminders');
                      }}
                    >
                      <List color="#ffffff" size={20} strokeWidth={2} />
                      <Text style={styles.modalItemText}>Payment Reminders</Text>
                    </Pressable>
                  </>
                )}

                <Pressable style={styles.modalItem}>
                  <UserPlus color="#ffffff" size={20} strokeWidth={2} />
                  <Text style={styles.modalItemText}>Invite Friends</Text>
                </Pressable>
              </LinearGradient>
            </BlurView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  profileGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
  },
  balanceCard: {
    marginHorizontal: 24,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    marginBottom: 32,
  },
  cardGradient: {
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    fontWeight: '500',
  },
  balance: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: -1,
  },
  pendingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 8,
    fontWeight: '400',
  },
  quickActionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  transactionsContainer: {
    paddingHorizontal: 24,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  transactionCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  transactionGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '400',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  sentAmount: {
    color: '#ff4444',
  },
  receivedAmount: {
    color: '#44ff88',
  },
  emptyCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  emptyGradient: {
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '400',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  modalBlur: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  modalGradient: {
    paddingTop: 12,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  modalItemText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
});
