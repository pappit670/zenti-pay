import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Dimensions } from 'react-native';
import Animated, { FadeIn, SlideInDown, SlideOutDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface AddCashModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddCashModal({ visible, onClose }: AddCashModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const presets = [10, 25, 50, 100, 200, null];

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <Animated.View entering={FadeIn} style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <Animated.View entering={SlideInDown.springify().damping(20)} exiting={SlideOutDown} style={styles.sheet}>
          <View style={styles.dragPill} />
          <Text style={styles.title}>Add Cash</Text>
          
          <View style={styles.grid}>
            {presets.map((amount, idx) => (
              <Pressable
                key={idx}
                onPress={() => amount && setSelectedAmount(amount)}
                style={[
                  styles.presetBtn,
                  selectedAmount === amount && amount !== null && styles.presetBtnActive
                ]}
              >
                <Text style={[
                  styles.presetText,
                  selectedAmount === amount && amount !== null && styles.presetTextActive
                ]}>
                  {amount === null ? '...' : `$${amount}`}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable 
            style={[styles.addButton, !selectedAmount && styles.addButtonDisabled]} 
            onPress={() => {
              if (selectedAmount) {
                // Execute Add Cash logic via zenti context or supabase
                onClose();
              }
            }}
          >
            <Text style={styles.addText}>Add</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  dragPill: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },
  presetBtn: {
    width: (width - 48 - 16) / 3, // 3 columns, 24px padding sides, 8px gap
    aspectRatio: 2,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  presetBtnActive: {
    backgroundColor: '#000',
  },
  presetText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  presetTextActive: {
    color: '#fff',
  },
  addButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#22C55E',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  }
});
