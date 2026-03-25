import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Transaction } from '@/types/database';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowDownLeft } from 'lucide-react-native';

export default function StatisticsScreen() {
  const { user } = useAuth();
  const { theme, colors } = useTheme();
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [income, setIncome] = useState(0);
  const [spending, setSpending] = useState(0);
  const [monthlyData, setMonthlyData] = useState<{ month: string; amount: number }[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, [user, period]);

  const fetchTransactions = async () => {
    if (!user) return;

    const now = new Date();
    let startDate = new Date();

    if (period === 'weekly') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'monthly') {
      startDate.setMonth(now.getMonth() - 1);
    } else {
      startDate.setFullYear(now.getFullYear() - 1);
    }

    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (data) {
      setTransactions(data);
      calculateStats(data);
      generateChartData(data);
    }
  };

  const calculateStats = (txns: Transaction[]) => {
    const totalIncome = txns
      .filter((t) => t.type === 'receive')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalSpending = txns
      .filter((t) => t.type === 'send')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    setIncome(totalIncome);
    setSpending(totalSpending);
  };

  const generateChartData = (txns: Transaction[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const data = months.map((month, index) => {
      const monthTransactions = txns.filter((t) => {
        const txnDate = new Date(t.created_at);
        return txnDate.getMonth() === index && t.type === 'receive';
      });

      const amount = monthTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
      return { month, amount };
    });

    setMonthlyData(data);
  };

  const maxAmount = Math.max(...monthlyData.map((d) => d.amount), 1);

  const gradientColors = (theme === 'light'
    ? ['#f5f5f5', '#ffffff', '#f5f5f5']
    : ['#0a0a0a', '#1a1a2e', '#16213e']) as [string, string, ...string[]];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <ScrollView
        style={styles.container}
        scrollEventThrottle={16}
        bounces={true}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Statistics</Text>
        </View>

        <View style={styles.periodSelector}>
          <Pressable
            style={[styles.periodButton, { backgroundColor: colors.card }, period === 'weekly' && styles.periodButtonActive]}
            onPress={() => setPeriod('weekly')}
          >
            <Text style={[styles.periodText, { color: colors.textSecondary }, period === 'weekly' && styles.periodTextActive]}>
              Weekly
            </Text>
          </Pressable>
          <Pressable
            style={[styles.periodButton, { backgroundColor: colors.card }, period === 'monthly' && styles.periodButtonActive]}
            onPress={() => setPeriod('monthly')}
          >
            <Text style={[styles.periodText, { color: colors.textSecondary }, period === 'monthly' && styles.periodTextActive]}>
              Monthly
            </Text>
          </Pressable>
          <Pressable
            style={[styles.periodButton, { backgroundColor: colors.card }, period === 'yearly' && styles.periodButtonActive]}
            onPress={() => setPeriod('yearly')}
          >
            <Text style={[styles.periodText, { color: colors.textSecondary }, period === 'yearly' && styles.periodTextActive]}>
              Yearly
            </Text>
          </Pressable>
        </View>

        <View style={[styles.chartCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.chartAmount, { color: colors.text }]}>${income.toFixed(2)}</Text>
          <Text style={[styles.chartDate, { color: colors.textSecondary }]}>May 2024</Text>

          <View style={styles.chart}>
            {monthlyData.map((data, index) => (
              <View key={index} style={styles.chartBar}>
                <View style={[styles.chartBarContainer, { backgroundColor: colors.cardOpacity }]}>
                  <View
                    style={[
                      styles.chartBarFill,
                      { height: `${(data.amount / maxAmount) * 100}%`, backgroundColor: theme === 'light' ? '#3b82f6' : '#a3f542' },
                    ]}
                  />
                </View>
                <Text style={[styles.chartLabel, { color: colors.textSecondary }]}>{data.month}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.statsCards}>
          <View style={[styles.statsCard, { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }]}>
            <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Income</Text>
            <Text style={[styles.statsAmount, { color: colors.text }]}>${income.toFixed(2)}</Text>
            <Text style={[styles.statsChange, { color: colors.success }]}>+2.48%</Text>
          </View>
          <View style={[styles.statsCard, { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }]}>
            <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Spending</Text>
            <Text style={[styles.statsAmount, { color: colors.text }]}>${spending.toFixed(2)}</Text>
            <Text style={[styles.statsChange, { color: colors.error }]}>+1.52%</Text>
          </View>
        </View>

        <View style={[styles.incomeSection, { backgroundColor: colors.card }]}>
          <View style={styles.incomeSectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Income</Text>
            <Pressable>
              <Text style={[styles.seeAll, { color: theme === 'light' ? '#3b82f6' : '#a3f542' }]}>See all</Text>
            </Pressable>
          </View>

          {transactions
            .filter((t) => t.type === 'receive')
            .slice(0, 5)
            .map((transaction) => (
              <View key={transaction.id} style={[styles.incomeItem, { borderBottomColor: colors.border }]}>
                <View style={[styles.incomeIcon, { backgroundColor: colors.cardOpacity }]}>
                  <ArrowDownLeft color={colors.success} size={20} />
                </View>
                <View style={styles.incomeDetails}>
                  <Text style={[styles.incomeName, { color: colors.text }]}>{transaction.sender_name}</Text>
                  <Text style={[styles.incomeDate, { color: colors.textSecondary }]}>Today</Text>
                </View>
                <Text style={[styles.incomeAmount, { color: colors.text }]}>${transaction.amount.toFixed(2)}</Text>
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  periodButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  periodButtonActive: {
    backgroundColor: '#3b82f6',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
  },
  periodTextActive: {
    color: '#ffffff',
  },
  chartCard: {
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
  },
  chartAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  chartDate: {
    fontSize: 14,
    marginBottom: 24,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 150,
    alignItems: 'flex-end',
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  chartBarContainer: {
    width: 30,
    height: 120,
    borderRadius: 15,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 15,
  },
  chartLabel: {
    fontSize: 12,
  },
  statsCards: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
  },
  statsLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  statsAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statsChange: {
    fontSize: 12,
  },
  incomeSection: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
  },
  incomeSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
  },
  incomeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  incomeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  incomeDetails: {
    flex: 1,
  },
  incomeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  incomeDate: {
    fontSize: 12,
  },
  incomeAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});
