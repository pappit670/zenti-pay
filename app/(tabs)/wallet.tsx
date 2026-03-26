import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Account } from '@/types/database';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard, Plus } from 'lucide-react-native';

export default function WalletScreen() {
  const { user } = useAuth();
  const { theme, colors } = useTheme();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showAddCard, setShowAddCard] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, [user]);

  const fetchAccounts = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id);

    if (data) setAccounts(data);
  };

  const gradientColors = (theme === 'light'
    ? ['#f5f5f5', '#ffffff', '#f5f5f5']
    : ['#0a0a0a', '#1a1a2e', '#16213e']) as [string, string, ...string[]];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Wallet</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Cards</Text>

          {accounts.map((account) => (
            <View key={account.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardType, { color: colors.textSecondary }]}>
                    {account.account_type === 'wallet' ? 'Main Wallet' : 'Smart Card'}
                  </Text>
                  <CreditCard color={colors.text} size={24} strokeWidth={2.5} />
                </View>
                <Text style={[styles.cardBalance, { color: colors.text }]}>
                  ${account.balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </Text>
                <Text style={[styles.cardNumber, { color: colors.textSecondary }]}>
                  {account.card_last_four
                    ? `•••• ${account.card_last_four}`
                    : account.account_number}
                </Text>
              </View>
            </View>
          ))}

          <Pressable
            style={[styles.addCardButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setShowAddCard(true)}
          >
            <View style={[styles.addCardIcon, { backgroundColor: colors.cardOpacity }]}>
              <Plus color={colors.text} size={32} strokeWidth={2.5} />
            </View>
            <Text style={[styles.addCardText, { color: colors.text }]}>Add Smart Card</Text>
            <Text style={[styles.addCardSubtext, { color: colors.textSecondary }]}>Optional - Link your physical card</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardContent: {
    minHeight: 160,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  cardType: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardBalance: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardNumber: {
    fontSize: 16,
    letterSpacing: 2,
  },
  addCardButton: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  addCardIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  addCardText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addCardSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
