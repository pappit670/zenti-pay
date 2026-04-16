import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useMode } from '@/contexts/ModeContext';
import { supabase } from '@/lib/supabase';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
  TrendingUp,
  Users,
  Receipt,
  DollarSign,
  ArrowUpRight,
  QrCode,
  FileText,
  ChevronRight,
  Sparkles
} from 'lucide-react-native';

interface DashboardStats {
  todaySales: number;
  todayTransactions: number;
  monthlyRevenue: number;
  totalCustomers: number;
  pendingInvoices: number;
  activeQRCodes: number;
}

export default function BusinessDashboardGlass() {
  const router = useRouter();
  const { user } = useAuth();
  const { currentMode, isBusinessVerified } = useMode();
  const [stats, setStats] = useState<DashboardStats>({
    todaySales: 0,
    todayTransactions: 0,
    monthlyRevenue: 0,
    totalCustomers: 0,
    pendingInvoices: 0,
    activeQRCodes: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (currentMode !== 'business' || !isBusinessVerified) {
      router.replace('/(tabs)');
      return;
    }
    fetchDashboardData();
  }, [currentMode, isBusinessVerified]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const { data: todayTxns } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'receive')
        .gte('created_at', today.toISOString());

      const { data: monthlyTxns } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'receive')
        .gte('created_at', firstDayOfMonth.toISOString());

      const { data: recentTxns } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: invoices } = await supabase
        .from('invoices')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'draft');

      const { data: qrCodes } = await supabase
        .from('qr_codes')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true);

      const todaySales = todayTxns?.reduce((sum: number, t: any) => sum + Number(t.amount), 0) || 0;
      const monthlyRevenue = monthlyTxns?.reduce((sum: number, t: any) => sum + Number(t.amount), 0) || 0;
      const uniqueCustomers = new Set(
        monthlyTxns?.map((t: any) => t.sender_name).filter(Boolean)
      ).size;

      setStats({
        todaySales,
        todayTransactions: todayTxns?.length || 0,
        monthlyRevenue,
        totalCustomers: uniqueCustomers,
        pendingInvoices: invoices?.length || 0,
        activeQRCodes: qrCodes?.length || 0,
      });

      setRecentTransactions(recentTxns || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#16213e']}
        style={styles.backgroundGradient}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Business Dashboard</Text>
            <Text style={styles.subtitle}>Track your performance in real-time</Text>
          </View>
          <BlurView intensity={20} tint="dark" style={styles.sparkleButton}>
            <Sparkles color="#a3f542" size={24} />
          </BlurView>
        </View>

        <View style={styles.statsGrid}>
          <BlurView intensity={30} tint="dark" style={styles.statCardBlur}>
            <LinearGradient
              colors={['rgba(163, 245, 66, 0.2)', 'rgba(163, 245, 66, 0.05)']}
              style={styles.statCard}
            >
              <View style={styles.statIconContainer}>
                <DollarSign color="#a3f542" size={28} strokeWidth={2.5} />
              </View>
              <Text style={styles.statValue}>KSh {stats.todaySales.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Today's Sales</Text>
              <View style={styles.statChangeRow}>
                <ArrowUpRight color="#00ff88" size={16} strokeWidth={3} />
                <Text style={styles.statChange}>+12.5%</Text>
              </View>
            </LinearGradient>
          </BlurView>

          <BlurView intensity={30} tint="dark" style={styles.statCardBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.02)']}
              style={styles.statCard}
            >
              <View style={styles.statIconContainer}>
                <TrendingUp color="#a3f542" size={28} strokeWidth={2.5} />
              </View>
              <Text style={styles.statValue}>KSh {stats.monthlyRevenue.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Monthly Revenue</Text>
              <View style={styles.statChangeRow}>
                <ArrowUpRight color="#00ff88" size={16} strokeWidth={3} />
                <Text style={styles.statChange}>+8.2%</Text>
              </View>
            </LinearGradient>
          </BlurView>
        </View>

        <View style={styles.quickStatsRow}>
          <BlurView intensity={25} tint="dark" style={styles.quickStatBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
              style={styles.quickStat}
            >
              <View style={styles.quickStatIcon}>
                <Receipt color="#a3f542" size={20} />
              </View>
              <Text style={styles.quickStatValue}>{stats.todayTransactions}</Text>
              <Text style={styles.quickStatLabel}>Transactions</Text>
            </LinearGradient>
          </BlurView>

          <BlurView intensity={25} tint="dark" style={styles.quickStatBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
              style={styles.quickStat}
            >
              <View style={styles.quickStatIcon}>
                <Users color="#a3f542" size={20} />
              </View>
              <Text style={styles.quickStatValue}>{stats.totalCustomers}</Text>
              <Text style={styles.quickStatLabel}>Customers</Text>
            </LinearGradient>
          </BlurView>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <Pressable onPress={() => router.push('/business/invoices' as any)}>
          <BlurView intensity={20} tint="dark" style={styles.actionCardBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.02)']}
              style={styles.actionCard}
            >
              <View style={styles.actionIconCircle}>
                <FileText color="#a3f542" size={24} />
              </View>
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Invoices</Text>
                <Text style={styles.actionSubtitle}>{stats.pendingInvoices} pending</Text>
              </View>
              <ChevronRight color="rgba(255, 255, 255, 0.4)" size={24} />
            </LinearGradient>
          </BlurView>
        </Pressable>

        <Pressable onPress={() => router.push('/business/qr-codes' as any)}>
          <BlurView intensity={20} tint="dark" style={styles.actionCardBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.02)']}
              style={styles.actionCard}
            >
              <View style={styles.actionIconCircle}>
                <QrCode color="#a3f542" size={24} />
              </View>
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>QR Codes</Text>
                <Text style={styles.actionSubtitle}>{stats.activeQRCodes} active</Text>
              </View>
              <ChevronRight color="rgba(255, 255, 255, 0.4)" size={24} />
            </LinearGradient>
          </BlurView>
        </Pressable>

        <Pressable onPress={() => router.push('/business/customers' as any)}>
          <BlurView intensity={20} tint="dark" style={styles.actionCardBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.02)']}
              style={styles.actionCard}
            >
              <View style={styles.actionIconCircle}>
                <Users color="#a3f542" size={24} />
              </View>
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Customers</Text>
                <Text style={styles.actionSubtitle}>Manage customer data</Text>
              </View>
              <ChevronRight color="rgba(255, 255, 255, 0.4)" size={24} />
            </LinearGradient>
          </BlurView>
        </Pressable>

        <View style={styles.transactionsHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Pressable onPress={() => router.push('/business/analytics' as any)}>
            <Text style={styles.seeAllText}>See all</Text>
          </Pressable>
        </View>

        {recentTransactions.map((transaction) => (
          <BlurView key={transaction.id} intensity={15} tint="dark" style={styles.txnBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.01)']}
              style={styles.txnCard}
            >
              <View style={styles.txnIcon}>
                <Receipt color="#a3f542" size={18} />
              </View>
              <View style={styles.txnInfo}>
                <Text style={styles.txnName}>
                  {transaction.sender_name || transaction.recipient_name}
                </Text>
                <Text style={styles.txnDate}>
                  {new Date(transaction.created_at).toLocaleDateString()}
                </Text>
              </View>
              <Text style={[
                styles.txnAmount,
                transaction.type === 'receive' ? styles.amountPositive : styles.amountNegative
              ]}>
                {transaction.type === 'receive' ? '+' : '-'}KSh {transaction.amount.toFixed(2)}
              </Text>
            </LinearGradient>
          </BlurView>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  sparkleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(163, 245, 66, 0.3)',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 16,
  },
  statCardBlur: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statCard: {
    padding: 20,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(163, 245, 66, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(163, 245, 66, 0.3)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
  },
  statChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statChange: {
    fontSize: 14,
    color: '#00ff88',
    fontWeight: '600',
  },
  quickStatsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 32,
  },
  quickStatBlur: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  quickStat: {
    padding: 16,
    alignItems: 'center',
  },
  quickStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(163, 245, 66, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  quickStatLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  actionCardBlur: {
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  actionIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(163, 245, 66, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(163, 245, 66, 0.3)',
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#a3f542',
    fontWeight: '600',
  },
  txnBlur: {
    marginHorizontal: 24,
    marginBottom: 8,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  txnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  txnIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(163, 245, 66, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  txnInfo: {
    flex: 1,
  },
  txnName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  txnDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  txnAmount: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  amountPositive: {
    color: '#00ff88',
  },
  amountNegative: {
    color: '#ff4444',
  },
});
