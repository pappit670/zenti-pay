import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { useZenti } from '@/contexts/ZentiContext';

const { width } = Dimensions.get('window');

const CARD_COLORS = [
  { id: '1', name: 'Zenti Classic', colors: ['#1A1A1A', '#333333'], textColor: '#fff' },
  { id: '2', name: 'Ocean Breeze', colors: ['#00B4DB', '#0083B0'], textColor: '#fff' },
  { id: '3', name: 'Sunset Glow', colors: ['#F09819', '#EDDE5D'], textColor: '#fff' },
  { id: '4', name: 'Royal Purple', colors: ['#8E2DE2', '#4A00E0'], textColor: '#fff' },
  { id: '5', name: 'Ember Revival', colors: ['#FF512F', '#DD2476'], textColor: '#fff' },
  { id: '6', name: 'Forest Mint', colors: ['#11998e', '#38ef7d'], textColor: '#fff' },
];

export default function CardSetupPage() {
  const router = useRouter();
  const { updateCardState } = useZenti();
  const [selectedColor, setSelectedColor] = useState(CARD_COLORS[4]); // Default to Ember Revival

  const handleGetCard = () => {
    updateCardState({ color: selectedColor.colors[0] });
    router.push('/onboarding/recovery-phrase');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color="#000" size={28} />
        </Pressable>
        <Text style={styles.headerTitle}>Choose card style</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Animated.View 
          key={selectedColor.id}
          entering={SlideInRight.duration(400)}
          style={styles.cardPreview}
        >
          <LinearGradient
            colors={selectedColor.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
                 <Text style={[styles.cardBrand, { color: selectedColor.textColor }]}>zenti</Text>
            </View>
            <View style={styles.cardBottom}>
                <Text style={[styles.cardType, { color: selectedColor.textColor }]}>VIRTUAL</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.details}>
          <Text style={styles.cardName}>{selectedColor.name}</Text>
          <Text style={styles.cardInfo}>
            Elegant tones inspired by the {selectedColor.name.toLowerCase()}, symbolizing the perfect balance of tech and finance.
          </Text>
        </View>

        <View style={styles.colorPicker}>
          {CARD_COLORS.map((color) => (
            <Pressable
              key={color.id}
              onPress={() => setSelectedColor(color)}
              style={[
                styles.colorOption,
                selectedColor.id === color.id && styles.colorOptionSelected
              ]}
            >
              <LinearGradient
                colors={color.colors}
                style={styles.colorCircle}
              />
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.button} onPress={handleGetCard}>
          <Text style={styles.buttonText}>Get card</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  cardPreview: {
    width: '100%',
    aspectRatio: 1.6,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cardBrand: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -1,
    opacity: 0.9,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cardType: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    opacity: 0.7,
  },
  details: {
    alignItems: 'center',
    marginBottom: 40,
  },
  cardName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  cardInfo: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  colorPicker: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 60,
  },
  colorOption: {
    padding: 3,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#000',
  },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  button: {
    backgroundColor: '#000',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
