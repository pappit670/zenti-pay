import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Users, Plus, Trash2, Send, Calculator } from 'lucide-react-native';

interface Participant {
  id: string;
  name: string;
  amount: number;
}

export default function SplitBill() {
  const router = useRouter();
  const { user } = useAuth();
  const [totalAmount, setTotalAmount] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: '', amount: 0 }
  ]);
  const [splitMethod, setSplitMethod] = useState<'equal' | 'custom'>('equal');
  const [sending, setSending] = useState(false);

  const addParticipant = () => {
    const newId = (participants.length + 1).toString();
    setParticipants([...participants, { id: newId, name: '', amount: 0 }]);
  };

  const removeParticipant = (id: string) => {
    if (participants.length > 1) {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  const updateParticipantName = (id: string, name: string) => {
    setParticipants(participants.map(p =>
      p.id === id ? { ...p, name } : p
    ));
  };

  const updateParticipantAmount = (id: string, amount: string) => {
    setParticipants(participants.map(p =>
      p.id === id ? { ...p, amount: parseFloat(amount) || 0 } : p
    ));
  };

  const calculateSplitAmounts = () => {
    const total = parseFloat(totalAmount) || 0;
    if (splitMethod === 'equal') {
      const perPerson = total / participants.length;
      return participants.map(p => ({ ...p, amount: perPerson }));
    }
    return participants;
  };

  const sendRequests = async () => {
    if (!user || !totalAmount) return;

    setSending(true);
    try {
      const splits = calculateSplitAmounts();

      for (const participant of splits) {
        if (!participant.name || participant.amount <= 0) continue;

        const { data: participantUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('full_name', participant.name)
          .maybeSingle();

        if (participantUser) {
          await supabase.from('payment_requests').insert({
            from_user_id: user.id,
            to_user_id: participantUser.id,
            amount: participant.amount,
            description: `Bill split - KSh ${totalAmount}`,
            status: 'pending',
          });
        }
      }

      router.back();
    } catch (error) {
      console.error('Error sending split requests:', error);
      alert('Failed to send requests');
    } finally {
      setSending(false);
    }
  };

  const splits = calculateSplitAmounts();
  const totalSplit = splits.reduce((sum, p) => sum + p.amount, 0);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#16213e']}
        style={styles.backgroundGradient}
      />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <BlurView intensity={20} tint="dark" style={styles.backButton}>
            <ArrowLeft color="#ffffff" size={20} />
          </BlurView>
        </Pressable>
        <Text style={styles.title}>Split Bill</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <BlurView intensity={30} tint="dark" style={styles.totalCardBlur}>
          <LinearGradient
            colors={['rgba(163, 245, 66, 0.2)', 'rgba(163, 245, 66, 0.05)']}
            style={styles.totalCard}
          >
            <View style={styles.totalIcon}>
              <Calculator color="#a3f542" size={32} />
            </View>
            <View style={styles.totalInputContainer}>
              <Text style={styles.currencySymbol}>KSh</Text>
              <TextInput
                style={styles.totalInput}
                value={totalAmount}
                onChangeText={setTotalAmount}
                placeholder="0.00"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                keyboardType="decimal-pad"
              />
            </View>
          </LinearGradient>
        </BlurView>

        <Text style={styles.sectionTitle}>Split Method</Text>

        <View style={styles.methodRow}>
          <Pressable onPress={() => setSplitMethod('equal')} style={{ flex: 1 }}>
            <BlurView
              intensity={splitMethod === 'equal' ? 25 : 15}
              tint="dark"
              style={[
                styles.methodCardBlur,
                splitMethod === 'equal' && styles.methodCardBlurActive
              ]}
            >
              <LinearGradient
                colors={
                  splitMethod === 'equal'
                    ? ['rgba(163, 245, 66, 0.3)', 'rgba(163, 245, 66, 0.1)']
                    : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']
                }
                style={styles.methodCard}
              >
                <Users
                  color={splitMethod === 'equal' ? '#a3f542' : 'rgba(255, 255, 255, 0.5)'}
                  size={24}
                />
                <Text style={[
                  styles.methodText,
                  splitMethod === 'equal' && styles.methodTextActive
                ]}>
                  Split Equally
                </Text>
              </LinearGradient>
            </BlurView>
          </Pressable>

          <Pressable onPress={() => setSplitMethod('custom')} style={{ flex: 1 }}>
            <BlurView
              intensity={splitMethod === 'custom' ? 25 : 15}
              tint="dark"
              style={[
                styles.methodCardBlur,
                splitMethod === 'custom' && styles.methodCardBlurActive
              ]}
            >
              <LinearGradient
                colors={
                  splitMethod === 'custom'
                    ? ['rgba(163, 245, 66, 0.3)', 'rgba(163, 245, 66, 0.1)']
                    : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']
                }
                style={styles.methodCard}
              >
                <Calculator
                  color={splitMethod === 'custom' ? '#a3f542' : 'rgba(255, 255, 255, 0.5)'}
                  size={24}
                />
                <Text style={[
                  styles.methodText,
                  splitMethod === 'custom' && styles.methodTextActive
                ]}>
                  Custom Amounts
                </Text>
              </LinearGradient>
            </BlurView>
          </Pressable>
        </View>

        <View style={styles.participantsHeader}>
          <Text style={styles.sectionTitle}>Participants ({participants.length})</Text>
          <Pressable onPress={addParticipant}>
            <BlurView intensity={20} tint="dark" style={styles.addButton}>
              <Plus color="#a3f542" size={20} />
            </BlurView>
          </Pressable>
        </View>

        {participants.map((participant, index) => (
          <BlurView key={participant.id} intensity={20} tint="dark" style={styles.participantBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
              style={styles.participantCard}
            >
              <View style={styles.participantNumber}>
                <Text style={styles.participantNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.participantInputs}>
                <TextInput
                  style={styles.nameInput}
                  value={participant.name}
                  onChangeText={(text) => updateParticipantName(participant.id, text)}
                  placeholder="Name"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                />
                {splitMethod === 'custom' ? (
                  <View style={styles.amountInputContainer}>
                    <Text style={styles.amountCurrency}>KSh</Text>
                    <TextInput
                      style={styles.amountInput}
                      value={participant.amount > 0 ? participant.amount.toString() : ''}
                      onChangeText={(text) => updateParticipantAmount(participant.id, text)}
                      placeholder="0.00"
                      placeholderTextColor="rgba(255, 255, 255, 0.3)"
                      keyboardType="decimal-pad"
                    />
                  </View>
                ) : (
                  <View style={styles.amountDisplay}>
                    <Text style={styles.amountText}>
                      KSh {splits[index]?.amount.toFixed(2) || '0.00'}
                    </Text>
                  </View>
                )}
              </View>
              {participants.length > 1 && (
                <Pressable onPress={() => removeParticipant(participant.id)}>
                  <Trash2 color="#ff4444" size={20} />
                </Pressable>
              )}
            </LinearGradient>
          </BlurView>
        ))}

        <BlurView intensity={25} tint="dark" style={styles.summaryCardBlur}>
          <LinearGradient
            colors={['rgba(163, 245, 66, 0.15)', 'rgba(163, 245, 66, 0.05)']}
            style={styles.summaryCard}
          >
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Bill</Text>
              <Text style={styles.summaryValue}>KSh {totalAmount || '0.00'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Split Total</Text>
              <Text style={styles.summaryValue}>KSh {totalSplit.toFixed(2)}</Text>
            </View>
            {splitMethod === 'custom' && (
              <View style={styles.summaryRow}>
                <Text style={[
                  styles.summaryLabel,
                  Math.abs(parseFloat(totalAmount || '0') - totalSplit) > 0.01 && styles.summaryLabelError
                ]}>
                  Difference
                </Text>
                <Text style={[
                  styles.summaryValue,
                  Math.abs(parseFloat(totalAmount || '0') - totalSplit) > 0.01 && styles.summaryValueError
                ]}>
                  KSh {Math.abs(parseFloat(totalAmount || '0') - totalSplit).toFixed(2)}
                </Text>
              </View>
            )}
          </LinearGradient>
        </BlurView>

        <BlurView intensity={25} tint="dark" style={styles.sendButtonBlur}>
          <Pressable
            onPress={sendRequests}
            disabled={!totalAmount || sending || participants.some(p => !p.name)}
          >
            <LinearGradient
              colors={
                !totalAmount || sending || participants.some(p => !p.name)
                  ? ['rgba(100, 100, 100, 0.3)', 'rgba(100, 100, 100, 0.1)']
                  : ['rgba(163, 245, 66, 0.3)', 'rgba(163, 245, 66, 0.15)']
              }
              style={styles.sendButton}
            >
              <Send
                color={!totalAmount || sending || participants.some(p => !p.name) ? '#666666' : '#a3f542'}
                size={20}
              />
              <Text style={[
                styles.sendButtonText,
                (!totalAmount || sending || participants.some(p => !p.name)) && styles.sendButtonTextDisabled
              ]}>
                {sending ? 'Sending...' : 'Send Requests'}
              </Text>
            </LinearGradient>
          </Pressable>
        </BlurView>
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
  scrollView: {
    flex: 1,
  },
  totalCardBlur: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(163, 245, 66, 0.3)',
  },
  totalCard: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(163, 245, 66, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  totalInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.5)',
    marginRight: 8,
  },
  totalInput: {
    flex: 1,
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  methodRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  methodCardBlur: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  methodCardBlurActive: {
    borderColor: 'rgba(163, 245, 66, 0.3)',
  },
  methodCard: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  methodText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  methodTextActive: {
    color: '#a3f542',
    fontWeight: '600',
  },
  participantsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(163, 245, 66, 0.3)',
  },
  participantBlur: {
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  participantCard: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  participantNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(163, 245, 66, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  participantNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#a3f542',
  },
  participantInputs: {
    flex: 1,
  },
  nameInput: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountCurrency: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 15,
    color: '#a3f542',
    fontWeight: '600',
  },
  amountDisplay: {
    paddingVertical: 2,
  },
  amountText: {
    fontSize: 15,
    color: '#a3f542',
    fontWeight: '600',
  },
  summaryCardBlur: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(163, 245, 66, 0.2)',
  },
  summaryCard: {
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  summaryLabelError: {
    color: '#ff4444',
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  summaryValueError: {
    color: '#ff4444',
  },
  sendButtonBlur: {
    marginHorizontal: 24,
    marginBottom: 32,
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
