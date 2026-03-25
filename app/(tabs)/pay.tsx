import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Delete } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function PayScreen() {
  const [amount, setAmount] = useState('0');
  const router = useRouter();
  const { theme, colors } = useTheme();

  const handleNumberPress = (num: string) => {
    if (amount === '0') {
      setAmount(num);
    } else if (amount.length < 10) {
      setAmount(amount + num);
    }
  };

  const handleDecimalPress = () => {
    if (!amount.includes('.')) {
      setAmount(amount + '.');
    }
  };

  const handleDelete = () => {
    if (amount.length === 1) {
      setAmount('0');
    } else {
      setAmount(amount.slice(0, -1));
    }
  };

  const handlePay = () => {
    if (parseFloat(amount) > 0) {
      router.push({
        pathname: '/send-recipient',
        params: { amount }
      });
    }
  };

  const handleRequest = () => {
    router.push({
      pathname: '/request',
      params: { amount }
    });
  };

  const gradientColors = (theme === 'light'
    ? ['#f5f5f5', '#ffffff', '#f5f5f5']
    : ['#0a0a0a', '#000000', '#0a0a0a']) as [string, string, ...string[]];

  const keyGradientColors = (theme === 'light'
    ? ['rgba(0, 0, 0, 0.08)', 'rgba(0, 0, 0, 0.03)']
    : ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']) as [string, string, ...string[]];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Smart Pay</Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.currencySymbol, { color: colors.textSecondary }]}>$</Text>
        <Text style={[styles.amount, { color: colors.text }]}>{amount}</Text>
      </View>

      <View style={styles.keyboardContainer}>
        <View style={styles.keyboardRow}>
          {['1', '2', '3'].map((num) => (
            <Pressable key={num} style={styles.key} onPress={() => handleNumberPress(num)}>
              <BlurView intensity={30} tint={theme} style={styles.keyBlur}>
                <LinearGradient colors={keyGradientColors} style={styles.keyGradient}>
                  <Text style={[styles.keyText, { color: colors.text }]}>{num}</Text>
                </LinearGradient>
              </BlurView>
            </Pressable>
          ))}
        </View>

        <View style={styles.keyboardRow}>
          {['4', '5', '6'].map((num) => (
            <Pressable key={num} style={styles.key} onPress={() => handleNumberPress(num)}>
              <BlurView intensity={30} tint={theme} style={styles.keyBlur}>
                <LinearGradient colors={keyGradientColors} style={styles.keyGradient}>
                  <Text style={[styles.keyText, { color: colors.text }]}>{num}</Text>
                </LinearGradient>
              </BlurView>
            </Pressable>
          ))}
        </View>

        <View style={styles.keyboardRow}>
          {['7', '8', '9'].map((num) => (
            <Pressable key={num} style={styles.key} onPress={() => handleNumberPress(num)}>
              <BlurView intensity={30} tint={theme} style={styles.keyBlur}>
                <LinearGradient colors={keyGradientColors} style={styles.keyGradient}>
                  <Text style={[styles.keyText, { color: colors.text }]}>{num}</Text>
                </LinearGradient>
              </BlurView>
            </Pressable>
          ))}
        </View>

        <View style={styles.keyboardRow}>
          <Pressable style={styles.key} onPress={handleDecimalPress}>
            <BlurView intensity={30} tint={theme} style={styles.keyBlur}>
              <LinearGradient colors={keyGradientColors} style={styles.keyGradient}>
                <Text style={[styles.keyText, { color: colors.text }]}>.</Text>
              </LinearGradient>
            </BlurView>
          </Pressable>
          <Pressable style={styles.key} onPress={() => handleNumberPress('0')}>
            <BlurView intensity={30} tint={theme} style={styles.keyBlur}>
              <LinearGradient colors={keyGradientColors} style={styles.keyGradient}>
                <Text style={[styles.keyText, { color: colors.text }]}>0</Text>
              </LinearGradient>
            </BlurView>
          </Pressable>
          <Pressable style={styles.key} onPress={handleDelete}>
            <BlurView intensity={30} tint={theme} style={styles.keyBlur}>
              <LinearGradient colors={keyGradientColors} style={styles.keyGradient}>
                <Delete color={colors.text} size={28} strokeWidth={2.5} />
              </LinearGradient>
            </BlurView>
          </Pressable>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <Pressable style={styles.actionButton} onPress={handleRequest}>
          <BlurView intensity={30} tint={theme} style={styles.actionBlur}>
            <LinearGradient colors={keyGradientColors} style={styles.actionGradient}>
              <Text style={[styles.actionButtonText, { color: colors.text }]}>Request</Text>
            </LinearGradient>
          </BlurView>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={handlePay}
          disabled={parseFloat(amount) === 0}
        >
          <LinearGradient
            colors={
              parseFloat(amount) === 0
                ? ['rgba(100, 100, 100, 0.3)', 'rgba(100, 100, 100, 0.2)']
                : theme === 'light'
                ? ['#000000', '#1a1a1a']
                : ['#ffffff', '#f0f0f0']
            }
            style={styles.payGradient}
          >
            <Text
              style={[
                styles.actionButtonText,
                theme === 'light' ? styles.payButtonTextLight : styles.payButtonTextDark,
                parseFloat(amount) === 0 && styles.payButtonTextDisabled
              ]}
            >
              Send
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  currencySymbol: {
    fontSize: 40,
    fontWeight: 'bold',
    marginRight: 8,
  },
  amount: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  keyboardContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  keyboardRow: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  key: {
    width: 80,
    height: 80,
  },
  keyBlur: {
    flex: 1,
    borderRadius: 40,
    overflow: 'hidden',
  },
  keyGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.2)',
    borderRadius: 40,
  },
  keyText: {
    fontSize: 32,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 40,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    height: 60,
  },
  actionBlur: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.2)',
    borderRadius: 16,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  payGradient: {
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
  payButtonTextLight: {
    color: '#ffffff',
  },
  payButtonTextDark: {
    color: '#000000',
  },
  payButtonTextDisabled: {
    color: 'rgba(128, 128, 128, 0.5)',
  },
});
