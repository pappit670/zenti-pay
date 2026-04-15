import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Delete, Divide, Minus, Plus, X, Scan, Smartphone } from 'lucide-react-native';
import { useZenti } from '@/contexts/ZentiContext';
import SwipeButton from '@/components/SwipeButton';

const { width } = Dimensions.get('window');

export default function PayScreen() {
  const [amount, setAmount] = useState('0');
  const [mode, setMode] = useState<'send' | 'pos'>('send');
  const router = useRouter();
  const { showIsland, createSession } = useZenti();

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

  const handleConfirm = () => {
    const amountNum = parseFloat(amount);
    if (amountNum > 0) {
      if (mode === 'send') {
        showIsland({ type: 'pending', amount: amountNum });
        setTimeout(() => {
          router.push({ pathname: '/send-recipient', params: { amount } });
          showIsland({ type: 'success', amount: amountNum });
        }, 1500);
      } else {
        // POS Mode: navigate to receive screen with session setup
        router.push({ pathname: '/business/receive-payment', params: { amount } });
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tabContainer}>
          <Pressable 
            style={[styles.tab, mode === 'send' && styles.activeTab]} 
            onPress={() => setMode('send')}
          >
            <Text style={[styles.tabText, mode === 'send' && styles.activeTabText]}>Send</Text>
          </Pressable>
          <Pressable 
            style={[styles.tab, mode === 'pos' && styles.activeTab]} 
            onPress={() => setMode('pos')}
          >
            <Text style={[styles.tabText, mode === 'pos' && styles.activeTabText]}>POS System</Text>
          </Pressable>
        </View>
        <Text style={styles.balanceText}>
          {mode === 'send' ? 'Available KES 7,854.43' : 'Machine Status: Ready to receive'}
        </Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>KES</Text>
        <Text style={styles.amountText}>{amount}</Text>
        <Pressable 
          style={styles.scanIcon} 
          onPress={() => router.push('/scan')}
        >
           <Scan color="rgba(255,255,255,0.6)" size={28} />
        </Pressable>
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.operatorRow}>
          <Pressable style={styles.opKey}><Plus color="#fff" size={20} /></Pressable>
          <Pressable style={styles.opKey}><Minus color="#fff" size={20} /></Pressable>
          <Pressable style={styles.opKey}><X color="#fff" size={20} /></Pressable>
          <Pressable style={styles.opKey}><Divide color="#fff" size={20} /></Pressable>
        </View>

        <View style={styles.keyboardContainer}>
          {[
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['.', '0', 'delete']
          ].map((row, i) => (
            <View key={i} style={styles.keyboardRow}>
              {row.map((key) => (
                <Pressable 
                  key={key} 
                  style={styles.key} 
                  onPress={() => {
                    if (key === 'delete') handleDelete();
                    else if (key === '.') handleDecimalPress();
                    else handleNumberPress(key);
                  }}
                >
                  <View style={styles.keyInner}>
                    {key === 'delete' ? <Delete color="#fff" size={24} /> : <Text style={styles.keyText}>{key}</Text>}
                  </View>
                </Pressable>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.swipeContainer}>
          {parseFloat(amount) > 0 ? (
            <SwipeButton 
              onComplete={handleConfirm} 
              title={mode === 'send' ? "Swipe right to send" : "Swipe to generate QR/NFC"} 
            />
          ) : (
            <View style={styles.placeholderButton}>
                <Text style={styles.placeholderText}>
                  {mode === 'send' ? 'Enter amount to send' : 'Enter amount to receive'}
                </Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Back to Home close button */}
      <Pressable style={styles.closeButton} onPress={() => router.push('/')}>
          <X color="#fff" size={28} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 4,
    borderRadius: 24,
    marginBottom: 8,
  },
  tab: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabText: {
    color: '#000',
    fontWeight: '700',
  },
  balanceText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    fontWeight: '500',
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 140,
    marginTop: 20,
    position: 'relative',
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginRight: 6,
    opacity: 0.8,
  },
  amountText: {
    fontSize: 84,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -2,
  },
  scanIcon: {
    position: 'absolute',
    right: width * 0.1,
    top: '40%',
  },
  controlsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  operatorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 24,
  },
  opKey: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  key: {
    flex: 1,
    height: 64,
  },
  keyInner: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
  },
  keyText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  swipeContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
    height: 64,
  },
  placeholderButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  placeholderText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
