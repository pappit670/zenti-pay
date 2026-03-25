import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Star, Heart, ThumbsUp, Sparkles } from 'lucide-react-native';

export default function TipScreenGlass() {
  const router = useRouter();
  const { user } = useAuth();
  const { businessId, employeeId, transactionId } = useLocalSearchParams();
  const [business, setBusiness] = useState<any>(null);
  const [employee, setEmployee] = useState<any>(null);
  const [selectedPercentage, setSelectedPercentage] = useState(15);
  const [customAmount, setCustomAmount] = useState('');
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  const tipPresets = [10, 15, 20, 25];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: businessData } = await supabase
      .from('profiles')
      .select('full_name, business_name, business_category')
      .eq('id', businessId)
      .maybeSingle();

    if (businessData) setBusiness(businessData);

    if (employeeId) {
      const { data: employeeData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', employeeId)
        .maybeSingle();

      if (employeeData) setEmployee(employeeData);
    }

    if (transactionId) {
      const { data: txn } = await supabase
        .from('transactions')
        .select('amount')
        .eq('id', transactionId)
        .maybeSingle();

      if (txn) setTransactionAmount(Number(txn.amount));
    }
  };

  const calculateTipAmount = () => {
    if (customAmount) return parseFloat(customAmount);
    if (transactionAmount > 0) {
      return (transactionAmount * selectedPercentage) / 100;
    }
    return 0;
  };

  const sendTip = async () => {
    if (!user || !businessId) return;

    const tipAmount = calculateTipAmount();
    if (tipAmount <= 0) return;

    setProcessing(true);
    try {
      const { data: senderAccount } = await supabase
        .from('accounts')
        .select('id, balance')
        .eq('user_id', user.id)
        .eq('is_primary', true)
        .maybeSingle();

      if (!senderAccount || Number(senderAccount.balance) < tipAmount) {
        alert('Insufficient balance');
        setProcessing(false);
        return;
      }

      const recipientId = employeeId || businessId;

      const { data: receiverAccount } = await supabase
        .from('accounts')
        .select('id')
        .eq('user_id', recipientId)
        .eq('is_primary', true)
        .maybeSingle();

      if (!receiverAccount) {
        alert('Recipient account not found');
        setProcessing(false);
        return;
      }

      const { data: tipTransaction } = await supabase
        .from('transactions')
        .insert({
          account_id: senderAccount.id,
          user_id: user.id,
          type: 'send',
          amount: tipAmount,
          currency: 'KSH',
          recipient_name: employee?.full_name || business?.business_name,
          description: 'Tip',
          status: 'completed',
        })
        .select()
        .single();

      await supabase.from('transactions').insert({
        account_id: receiverAccount.id,
        user_id: recipientId as string,
        type: 'receive',
        amount: tipAmount,
        currency: 'KSH',
        sender_name: user.email,
        description: 'Tip received',
        status: 'completed',
      });

      await supabase.from('business_tips').insert({
        business_id: businessId as string,
        employee_id: employeeId as string,
        customer_id: user.id,
        transaction_id: tipTransaction.id,
        amount: tipAmount,
        tip_percentage: customAmount ? null : selectedPercentage,
      });

      await supabase
        .from('accounts')
        .update({ balance: Number(senderAccount.balance) - tipAmount })
        .eq('id', senderAccount.id);

      router.back();
    } catch (error) {
      console.error('Error sending tip:', error);
      alert('Failed to send tip');
    } finally {
      setProcessing(false);
    }
  };

  const tipAmount = calculateTipAmount();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#16213e', '#1a1a2e']}
        style={styles.backgroundGradient}
      />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <BlurView intensity={20} tint="dark" style={styles.backButton}>
            <ArrowLeft color="#ffffff" size={20} />
          </BlurView>
        </Pressable>
        <Text style={styles.title}>Leave a Tip</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <BlurView intensity={30} tint="dark" style={styles.businessCardBlur}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.02)']}
            style={styles.businessCard}
          >
            <View style={styles.businessIconContainer}>
              <Star color="#ffd700" size={32} strokeWidth={2.5} />
            </View>
            <Text style={styles.businessName}>
              {employee?.full_name || business?.business_name || 'Business'}
            </Text>
            <Text style={styles.businessCategory}>{business?.business_category || 'Service'}</Text>
          </LinearGradient>
        </BlurView>

        {transactionAmount > 0 && (
          <BlurView intensity={25} tint="dark" style={styles.billCardBlur}>
            <LinearGradient
              colors={['rgba(163, 245, 66, 0.15)', 'rgba(163, 245, 66, 0.05)']}
              style={styles.billCard}
            >
              <Text style={styles.billLabel}>Bill Amount</Text>
              <Text style={styles.billAmount}>KSh {transactionAmount.toFixed(2)}</Text>
            </LinearGradient>
          </BlurView>
        )}

        <Text style={styles.sectionTitle}>Select Tip Percentage</Text>
        <View style={styles.presetGrid}>
          {tipPresets.map((percent) => (
            <Pressable
              key={percent}
              onPress={() => {
                setSelectedPercentage(percent);
                setCustomAmount('');
              }}
            >
              <BlurView
                intensity={selectedPercentage === percent && !customAmount ? 25 : 15}
                tint="dark"
                style={[
                  styles.presetBlur,
                  selectedPercentage === percent && !customAmount && styles.presetBlurActive
                ]}
              >
                <LinearGradient
                  colors={
                    selectedPercentage === percent && !customAmount
                      ? ['rgba(163, 245, 66, 0.3)', 'rgba(163, 245, 66, 0.15)']
                      : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']
                  }
                  style={styles.presetButton}
                >
                  <Text
                    style={[
                      styles.presetText,
                      selectedPercentage === percent && !customAmount && styles.presetTextActive
                    ]}
                  >
                    {percent}%
                  </Text>
                  {transactionAmount > 0 && (
                    <Text style={styles.presetAmount}>
                      KSh {((transactionAmount * percent) / 100).toFixed(0)}
                    </Text>
                  )}
                </LinearGradient>
              </BlurView>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Or Enter Custom Amount</Text>
        <BlurView intensity={20} tint="dark" style={styles.customInputBlur}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
            style={styles.customInput}
          >
            <Text style={styles.currencyLabel}>KSh</Text>
            <TextInput
              style={styles.input}
              value={customAmount}
              onChangeText={(text) => {
                setCustomAmount(text);
                setSelectedPercentage(0);
              }}
              placeholder="0.00"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              keyboardType="decimal-pad"
            />
          </LinearGradient>
        </BlurView>

        <BlurView intensity={25} tint="dark" style={styles.totalCardBlur}>
          <LinearGradient
            colors={['rgba(163, 245, 66, 0.2)', 'rgba(163, 245, 66, 0.05)']}
            style={styles.totalCard}
          >
            <Text style={styles.totalLabel}>Total Tip</Text>
            <Text style={styles.totalAmount}>KSh {tipAmount.toFixed(2)}</Text>
          </LinearGradient>
        </BlurView>

        <View style={styles.appreciationRow}>
          {[
            { icon: Heart, color: '#ff4444', key: 'love' },
            { icon: Star, color: '#ffd700', key: 'star' },
            { icon: ThumbsUp, color: '#2196f3', key: 'like' }
          ].map(({ icon: Icon, color, key }) => (
            <Pressable key={key} onPress={() => setSelectedReaction(key)}>
              <BlurView intensity={20} tint="dark" style={[
                styles.reactionBlur,
                selectedReaction === key && styles.reactionBlurActive
              ]}>
                <View style={styles.reactionButton}>
                  <Icon color={color} size={24} />
                </View>
              </BlurView>
            </Pressable>
          ))}
        </View>

        <BlurView intensity={25} tint="dark" style={styles.sendButtonBlur}>
          <Pressable
            onPress={sendTip}
            disabled={tipAmount <= 0 || processing}
          >
            <LinearGradient
              colors={
                tipAmount <= 0 || processing
                  ? ['rgba(100, 100, 100, 0.3)', 'rgba(100, 100, 100, 0.1)']
                  : ['rgba(163, 245, 66, 0.3)', 'rgba(163, 245, 66, 0.15)']
              }
              style={styles.sendButton}
            >
              <Sparkles color={tipAmount > 0 && !processing ? '#a3f542' : '#666666'} size={20} />
              <Text style={[
                styles.sendButtonText,
                (tipAmount <= 0 || processing) && styles.sendButtonTextDisabled
              ]}>
                {processing ? 'Sending...' : `Send Tip - KSh ${tipAmount.toFixed(2)}`}
              </Text>
            </LinearGradient>
          </Pressable>
        </BlurView>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  businessCardBlur: {
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  businessCard: {
    padding: 32,
    alignItems: 'center',
  },
  businessIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  businessCategory: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  billCardBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(163, 245, 66, 0.2)',
  },
  billCard: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  billAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  presetGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  presetBlur: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  presetBlurActive: {
    borderColor: 'rgba(163, 245, 66, 0.3)',
  },
  presetButton: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    minWidth: 80,
  },
  presetText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  presetTextActive: {
    color: '#a3f542',
  },
  presetAmount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  customInputBlur: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  customInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  currencyLabel: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.5)',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  totalCardBlur: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(163, 245, 66, 0.3)',
  },
  totalCard: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#a3f542',
  },
  appreciationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  reactionBlur: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  reactionBlurActive: {
    borderColor: 'rgba(163, 245, 66, 0.5)',
  },
  reactionButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(163, 245, 66, 0.3)',
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a3f542',
  },
  sendButtonTextDisabled: {
    color: '#666666',
  },
});
