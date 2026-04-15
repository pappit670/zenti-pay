import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldAlert, CheckCircle2, Circle } from 'lucide-react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

export default function RecoveryPhrasePage() {
  const router = useRouter();
  const [checked, setChecked] = useState([false, false, false]);

  const toggleCheck = (index: number) => {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];
    setChecked(newChecked);
  };

  const allChecked = checked.every(c => c);

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(800)} style={styles.content}>
        <View style={styles.header}>
            <Text style={styles.title}>Verify your recovery phrase</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <View style={styles.lockWrapper}>
                 <ShieldAlert color="#00E5FF" size={60} strokeWidth={1} />
            </View>
          </View>

          <Text style={styles.cardTitle}>Keep Your Wallet Secure</Text>

          <View style={styles.list}>
            <Pressable style={styles.listItem} onPress={() => toggleCheck(0)}>
              {checked[0] ? <CheckCircle2 color="#fff" size={24} /> : <Circle color="rgba(255,255,255,0.3)" size={24} />}
              <View style={styles.listTextContainer}>
                <Text style={styles.listTitle}>You're the only one who knows this phrase</Text>
                <Text style={styles.listSubtitle}>It's your personal key never share it with anyone.</Text>
              </View>
            </Pressable>

            <Pressable style={styles.listItem} onPress={() => toggleCheck(1)}>
              {checked[1] ? <CheckCircle2 color="#fff" size={24} /> : <Circle color="rgba(255,255,255,0.3)" size={24} />}
              <View style={styles.listTextContainer}>
                <Text style={styles.listTitle}>No one from our team will ever ask for it</Text>
                <Text style={styles.listSubtitle}>Not support, not partners, no one.</Text>
              </View>
            </Pressable>

            <Pressable style={styles.listItem} onPress={() => toggleCheck(2)}>
              {checked[2] ? <CheckCircle2 color="#fff" size={24} /> : <Circle color="rgba(255,255,255,0.3)" size={24} />}
              <View style={styles.listTextContainer}>
                <Text style={styles.listTitle}>Anyone with access can control your data</Text>
                <Text style={styles.listSubtitle}>If it's been seen or copied, create a new wallet immediately.</Text>
              </View>
            </Pressable>
          </list>

          <Pressable 
            style={[styles.button, !allChecked && styles.buttonDisabled]} 
            onPress={() => allChecked && router.push('/wallet/setup')}
          >
            <Text style={[styles.buttonText, !allChecked && styles.buttonTextDisabled]}>I understand, continue</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  card: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    marginTop: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  lockWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 229, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  list: {
    gap: 24,
    marginBottom: 60,
  },
  listItem: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  listTextContainer: {
    flex: 1,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  listSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  buttonTextDisabled: {
    color: 'rgba(255,255,255,0.3)',
  },
});
