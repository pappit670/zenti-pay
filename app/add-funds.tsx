import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Account } from '@/types/database';
import { ArrowLeft } from 'lucide-react-native';

export default function AddFundsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const quickAmounts = [50, 100, 200, 500];

  useEffect(() => {
    fetchAccount();
  }, [user]);

  const fetchAccount = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_primary', true)
      .maybeSingle();

    if (data) setAccount(data);
  };

  const handleAddFunds = async () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!account) {
      Alert.alert('Error', 'Account not found');
      return;
    }

    setLoading(true);

    const referenceNumber = Math.floor(100000 + Math.random() * 900000).toString();

    const { error: txError } = await supabase.from('transactions').insert({
      account_id: account.id,
      user_id: user!.id,
      type: 'add_funds',
      amount: amountNum,
      currency: account.currency,
      reference_number: referenceNumber,
      status: 'completed',
    });

    if (!txError) {
      await supabase
        .from('accounts')
        .update({ balance: account.balance + amountNum })
        .eq('id', account.id);

      Alert.alert('Success', 'Funds added successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Error', 'Failed to add funds');
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ArrowLeft color="#000" size={24} />
        </Pressable>
        <Text style={styles.title}>Add Money</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>You'll Pay</Text>
        <View style={styles.amountInput}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.amountField}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="decimal-pad"
            editable={!loading}
          />
        </View>

        <View style={styles.quickAmounts}>
          {quickAmounts.map((quickAmount) => (
            <Pressable
              key={quickAmount}
              style={[
                styles.quickAmountButton,
                amount === quickAmount.toString() && styles.quickAmountButtonActive,
              ]}
              onPress={() => setAmount(quickAmount.toString())}
            >
              <Text
                style={[
                  styles.quickAmountText,
                  amount === quickAmount.toString() && styles.quickAmountTextActive,
                ]}
              >
                ${quickAmount}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.keypad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, '←'].map((key) => (
            <Pressable
              key={key}
              style={styles.keypadButton}
              onPress={() => {
                if (key === '←') {
                  setAmount(amount.slice(0, -1));
                } else {
                  setAmount(amount + key.toString());
                }
              }}
            >
              <Text style={styles.keypadText}>{key}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAddFunds}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Processing...' : 'Continue'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  currencySymbol: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000000',
    marginRight: 8,
  },
  amountField: {
    flex: 1,
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000000',
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  quickAmountButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  quickAmountButtonActive: {
    backgroundColor: '#fef3c7',
  },
  quickAmountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  quickAmountTextActive: {
    color: '#000000',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  keypadButton: {
    width: '33.33%',
    aspectRatio: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#000000',
  },
  button: {
    backgroundColor: '#fbbf24',
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});
