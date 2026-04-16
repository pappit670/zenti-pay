import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, FlatList, ScrollView, Image, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X, Search, Plus, User, Scan, QrCode } from 'lucide-react-native';
import { useZenti, Recipient } from '@/contexts/ZentiContext';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';

const QUICK_CONTACTS = [
  { id: 'add', name: 'Get $20', isAction: true },
  { id: '1', name: 'Rose Lee', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { id: '2', name: 'Kallon L...', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  { id: '3', name: 'Ham-Bu...', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop' },
  { id: '4', name: 'Aniesha...', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
];

const TRANSACTIONS = [
  { id: 't1', name: 'Rose Lee', type: 'Transfers', time: '7:56 PM', amount: 6300, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { id: 't2', name: 'Kallon LaRue', type: 'Transfers', time: '7:56 PM', amount: 6300, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  { id: 't3', name: 'Ham-Burgular', type: 'Transfers', time: '7:56 PM', amount: 6300, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop' },
  { id: 't4', name: 'Aniesha Dixon', type: 'Transfers', time: '7:56 PM', amount: 6300, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
  { id: 't5', name: 'Add money', type: 'Bank Account', time: '7:53 PM', amount: 36000, isCashIn: true },
];

export default function ContactsScreen() {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const { mode } = useLocalSearchParams();
  const { setRecipient } = useZenti();

  const handleSelect = (recipient: any) => {
    router.push(`/profile/${recipient.id}` as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Search color="rgba(255,255,255,0.4)" size={20} />
          <TextInput
            style={styles.input}
            placeholder="Search transactions"
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <X color="#fff" size={24} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.quickScroll}
        >
          {QUICK_CONTACTS.map((contact) => (
            <Pressable key={contact.id} style={styles.quickItem} onPress={() => !contact.isAction && handleSelect(contact)}>
              <View style={[styles.avatarContainer, contact.isAction && styles.actionAvatar]}>
                {contact.isAction ? (
                  <Plus color="#fff" size={24} />
                ) : (
                  <Image source={{ uri: contact.avatar }} style={styles.avatar} />
                )}
              </View>
              <Text style={styles.avatarName} numberOfLines={1}>{contact.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today</Text>
          {TRANSACTIONS.map((tx, index) => (
            <Animated.View key={tx.id} entering={FadeInUp.delay(index * 50)}>
              <Pressable style={styles.txRow} onPress={() => handleSelect(tx)}>
                <View style={[styles.txAvatarContainer, tx.isCashIn && styles.cashInAvatar]}>
                  {tx.isCashIn ? (
                    <Text style={styles.cashInSymbol}>$</Text>
                  ) : (
                    <Image source={{ uri: tx.avatar }} style={styles.txAvatar} />
                  )}
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txName}>{tx.name}</Text>
                  <Text style={styles.txMeta}>{tx.type} • {tx.time}</Text>
                </View>
                <Text style={[styles.txAmount, tx.isCashIn && styles.positiveAmount]}>
                  {tx.isCashIn ? '+' : ''}KES {tx.amount.toLocaleString()}
                </Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Month</Text>
          <Pressable style={styles.txRow}>
              <View style={[styles.txAvatarContainer, { backgroundColor: '#00FF88' }]}>
                 <Text style={styles.cashInSymbol}>O</Text>
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txName}>Olivia Ryana</Text>
                <Text style={styles.txMeta}>Session • This Month</Text>
              </View>
              <Text style={styles.txAmount}>KES 4,415</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
    gap: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickScroll: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 20,
  },
  quickItem: {
    alignItems: 'center',
    width: 70,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#1C1C1E',
    marginBottom: 8,
  },
  actionAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
    marginTop: 8,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  txAvatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 16,
  },
  cashInAvatar: {
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashInSymbol: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  txAvatar: {
    width: '100%',
    height: '100%',
  },
  txInfo: {
    flex: 1,
  },
  txName: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  txMeta: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    fontWeight: '500',
  },
  txAmount: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
  positiveAmount: {
    color: '#00FF88',
  }
});
