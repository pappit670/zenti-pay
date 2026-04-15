import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, MoreHorizontal, AlertCircle, Plus, Settings2, CreditCard, Lock, Unlock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useZenti } from '@/contexts/ZentiContext';
import ZentiIsland from '@/components/ZentiIsland';

const { width } = Dimensions.get('window');

export default function CardDetailPage() {
  const router = useRouter();
  const { cardState, updateCardState, showIsland, hideIsland } = useZenti();
  const [isOnboarding, setIsOnboarding] = useState(!cardState.isSetup);
  const [onboardingStep, setOnboardingStep] = useState(0);

  const onboardingSteps = [
    { title: "Secure your card", description: "Set up a 6-digit PIN to authorize any transaction." },
    { title: "Enable NFC Pay", description: "Tap your phone on any merchant terminal to pay instantly." },
    { title: "Add to Wallet", description: "Sync your Zenti card with Apple Wallet or Google Pay." }
  ];

  const handleNextOnboarding = () => {
    if (onboardingStep < onboardingSteps.length - 1) {
      setOnboardingStep(prev => prev + 1);
    } else {
      updateCardState({ isSetup: true });
      setIsOnboarding(false);
    }
  };

  const toggleBlock = () => {
    const newState = !cardState.isBlocked;
    updateCardState({ isBlocked: newState });
    if (newState) {
      showIsland({ type: 'blocked' });
    } else {
      hideIsland();
    }
  };

  const triggerInsufficient = () => {
    showIsland({ type: 'insufficient_balance' });
  };

  return (
    <View style={styles.container}>
      <ZentiIsland />
      
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/(tabs)')} style={styles.backButton}>
          <ChevronLeft color="#fff" size={28} />
        </Pressable>
        <Text style={styles.headerTitle}>Zenti Card</Text>
        <Pressable style={styles.moreButton}>
          <MoreHorizontal color="#fff" size={24} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardSection}>
          <LinearGradient
            colors={[cardState.color, '#1A1A1A']}
            style={styles.mainCard}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardBrand}>zenti</Text>
              <Text style={styles.cardCurrency}>KES</Text>
            </View>
            
            <View style={styles.cardStatusContainer}>
                {cardState.isBlocked && (
                    <View style={styles.blockedBadge}>
                        <Lock color="#fff" size={14} />
                        <Text style={styles.blockedText}>BLOCKED</Text>
                    </View>
                )}
            </View>

            <View style={styles.cardBottom}>
              <Text style={styles.cardNumber}>•••• •••• •••• 4242</Text>
              <Text style={styles.cardExpiry}>12/28</Text>
            </View>
          </LinearGradient>
          
          <Pressable 
             style={[styles.statusBanner, cardState.isBlocked && styles.statusBannerBlocked]}
             onPress={triggerInsufficient}
          >
            <View style={styles.statusInfo}>
                <AlertCircle color={cardState.isBlocked ? "#FFB800" : "#FF4D4D"} size={24} />
                <View>
                    <Text style={styles.statusTitle}>
                        {cardState.isBlocked ? "Card is Blocked" : "Insufficient Balance"}
                    </Text>
                    <Text style={styles.statusSubtitle}>
                        {cardState.isBlocked ? "Unblock in settings to use" : "Add money to make payments"}
                    </Text>
                </View>
            </View>
            <Pressable style={styles.addMoneyBtn}>
                <Text style={styles.addMoneyText}>{cardState.isBlocked ? "Unblock" : "Add Money"}</Text>
            </Pressable>
          </Pressable>
        </View>

        {isOnboarding ? (
          <Animated.View entering={FadeIn.duration(500)} style={styles.onboardingCard}>
             <View style={styles.stepIndicator}>
                {onboardingSteps.map((_, i) => (
                    <View key={i} style={[styles.stepDot, i === onboardingStep && styles.stepDotActive]} />
                ))}
             </View>
             <Text style={styles.onboardingTitle}>{onboardingSteps[onboardingStep].title}</Text>
             <Text style={styles.onboardingDesc}>{onboardingSteps[onboardingStep].description}</Text>
             <Pressable style={styles.onboardingBtn} onPress={handleNextOnboarding}>
                <Text style={styles.onboardingBtnText}>
                    {onboardingStep === onboardingSteps.length - 1 ? "Complete Setup" : "Continue"}
                </Text>
             </Pressable>
          </Animated.View>
        ) : (
          <View style={styles.actionsGrid}>
            <Pressable style={styles.actionTile} onPress={toggleBlock}>
                <View style={[styles.actionIcon, { backgroundColor: cardState.isBlocked ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 184, 0, 0.1)' }]}>
                    {cardState.isBlocked ? <Unlock color="#00FF88" size={24} /> : <Lock color="#FFB800" size={24} />}
                </View>
                <Text style={styles.actionLabel}>{cardState.isBlocked ? "Unblock" : "Block Card"}</Text>
            </Pressable>
            
            <Pressable style={styles.actionTile}>
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
                    <Plus color="#fff" size={24} />
                </View>
                <Text style={styles.actionLabel}>Add Money</Text>
            </Pressable>

            <Pressable style={styles.actionTile}>
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
                    <Settings2 color="#fff" size={24} />
                </View>
                <Text style={styles.actionLabel}>Limits</Text>
            </Pressable>

            <Pressable style={styles.actionTile}>
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
                    <CreditCard color="#fff" size={24} />
                </View>
                <Text style={styles.actionLabel}>Details</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.transactionsSection}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No recent activity</Text>
            </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  moreButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  cardSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  mainCard: {
    width: '100%',
    aspectRatio: 1.58,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBrand: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -1.5,
  },
  cardCurrency: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
  },
  cardStatusContainer: {
    height: 30,
    justifyContent: 'center',
  },
  blockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  blockedText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 2,
  },
  cardExpiry: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '600',
  },
  statusBanner: {
    width: '100%',
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 77, 77, 0.2)',
  },
  statusBannerBlocked: {
    borderColor: 'rgba(255, 184, 0, 0.2)',
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  statusSubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  addMoneyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  addMoneyText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  onboardingCard: {
    marginHorizontal: 20,
    marginTop: 30,
    backgroundColor: '#111',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  stepDot: {
    width: 20,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  stepDotActive: {
    backgroundColor: '#fff',
  },
  onboardingTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  onboardingDesc: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  onboardingBtn: {
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  onboardingBtnText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '700',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    marginTop: 20,
  },
  actionTile: {
    width: '25%',
    alignItems: 'center',
    padding: 10,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '600',
  },
  transactionsSection: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  emptyState: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 14,
  }
});
