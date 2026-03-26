import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Account } from '@/types/database';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ArrowLeft, Delete } from 'lucide-react-native';

export default function SendRecipientScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors, theme } = useTheme();
  const params = useLocalSearchParams();
  const [account, setAccount] = useState<Account | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [loading, setLoading] = useState(false);

  const amount = params.amount as string;

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

  const handleLetterPress = (letter: string) => {
    setRecipientName(recipientName + letter);
  };

  const handleSpace = () => {
    if (recipientName.length > 0 && !recipientName.endsWith(' ')) {
      setRecipientName(recipientName + ' ');
    }
  };

  const handleDelete = () => {
    if (recipientName.length > 0) {
      setRecipientName(recipientName.slice(0, -1));
    }
  };

  const handleSend = async () => {
    if (!recipientName.trim() || !amount) {
      Alert.alert('Error', 'Please enter recipient name');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Invalid amount');
      return;
    }

    if (!account || account.balance < amountNum) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    setLoading(true);

    const referenceNumber = Math.floor(100000 + Math.random() * 900000).toString();

    const { error: txError } = await supabase.from('transactions').insert({
      account_id: account.id,
      user_id: user!.id,
      type: 'send',
      amount: amountNum,
      currency: account.currency,
      recipient_name: recipientName.trim(),
      reference_number: referenceNumber,
      status: 'completed',
    });

    if (!txError) {
      await supabase
        .from('accounts')
        .update({ balance: account.balance - amountNum })
        .eq('id', account.id);

      Alert.alert('Success', 'Money sent successfully', [
        { text: 'OK', onPress: () => router.push('/(tabs)') },
      ]);
    } else {
      Alert.alert('Error', 'Failed to send money');
    }

    setLoading(false);
  };

  const gradientColors = (theme === 'light'
    ? ['#f5f5f5', '#ffffff', '#f5f5f5']
    : ['#0a0a0a', '#000000', '#0a0a0a']) as [string, string, ...string[]];

  const keyGradientColors = (theme === 'light'
    ? ['rgba(0, 0, 0, 0.08)', 'rgba(0, 0, 0, 0.03)']
    : ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']) as [string, string, ...string[]];

  const letters = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <Pressable style={[styles.backButton, { backgroundColor: colors.cardOpacity }]} onPress={() => router.back()}>
        <ArrowLeft color={colors.text} size={24} />
      </Pressable>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Send Money</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Enter Recipient</Text>
        </View>

        <View style={styles.amountDisplay}>
          <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>Amount</Text>
          <Text style={[styles.amountText, { color: colors.text }]}>${amount}</Text>
        </View>

        <View style={styles.nameInputDisplay}>
          <Text style={[styles.nameLabel, { color: colors.textSecondary }]}>Recipient Name</Text>
          <Text style={[styles.nameText, { color: colors.text }]}>
            {recipientName || 'Tap letters below'}
          </Text>
        </View>

        <View style={styles.keypadContainer}>
          {letters.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keypadRow}>
              {row.map((letter) => (
                <Pressable
                  key={letter}
                  style={styles.keypadButton}
                  onPress={() => handleLetterPress(letter)}
                >
                  <BlurView intensity={30} tint={theme} style={styles.keyBlur}>
                    <LinearGradient
                      colors={keyGradientColors}
                      style={styles.keyGradient}
                    >
                      <Text style={[styles.keypadText, { color: colors.text }]}>{letter}</Text>
                    </LinearGradient>
                  </BlurView>
                </Pressable>
              ))}
            </View>
          ))}

          <View style={styles.keypadRow}>
            <Pressable style={[styles.keypadButton, styles.spaceButton]} onPress={handleSpace}>
              <BlurView intensity={30} tint={theme} style={styles.keyBlur}>
                <LinearGradient
                  colors={keyGradientColors}
                  style={styles.keyGradient}
                >
                  <Text style={[styles.spaceText, { color: colors.text }]}>SPACE</Text>
                </LinearGradient>
              </BlurView>
            </Pressable>

            <Pressable style={styles.keypadButton} onPress={handleDelete}>
              <BlurView intensity={30} tint={theme} style={styles.keyBlur}>
                <LinearGradient
                  colors={keyGradientColors}
                  style={styles.keyGradient}
                >
                  <Delete color={colors.text} size={20} strokeWidth={2} />
                </LinearGradient>
              </BlurView>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={[
            styles.button,
            loading && styles.buttonDisabled
          ]}
          onPress={handleSend}
          disabled={loading || !recipientName.trim()}
        >
          <LinearGradient
            colors={
              loading || !recipientName.trim()
                ? ['rgba(100, 100, 100, 0.3)', 'rgba(100, 100, 100, 0.2)']
                : theme === 'light'
                ? ['#000000', '#1a1a1a']
                : ['#ffffff', '#f0f0f0']
            }
            style={styles.buttonGradient}
          >
            <Text
              style={[
                styles.buttonText,
                theme === 'light' ? styles.buttonTextLight : styles.buttonTextDark,
                (loading || !recipientName.trim()) && styles.buttonTextDisabled
              ]}
            >
              {loading ? 'Sending...' : 'Send Money'}
            </Text>
          </LinearGradient>
        </Pressable>
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
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 120,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  amountDisplay: {
    alignItems: 'center',
    marginBottom: 32,
  },
  amountLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  amountText: {
    fontSize: 40,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  nameInputDisplay: {
    alignItems: 'center',
    marginBottom: 32,
    minHeight: 60,
  },
  nameLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  keypadContainer: {
    marginBottom: 24,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 6,
  },
  keypadButton: {
    width: 32,
    height: 42,
  },
  spaceButton: {
    width: 200,
  },
  keyBlur: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  keyGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.2)',
    borderRadius: 8,
  },
  keypadText: {
    fontSize: 18,
    fontWeight: '600',
  },
  spaceText: {
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    height: 56,
    marginTop: 8,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  buttonTextLight: {
    color: '#ffffff',
  },
  buttonTextDark: {
    color: '#000000',
  },
  buttonTextDisabled: {
    color: 'rgba(128, 128, 128, 0.5)',
  },
});
