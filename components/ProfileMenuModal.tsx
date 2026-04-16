import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import { X, User, Shield, Bell, FileText, HelpCircle, ChevronRight, Camera } from 'lucide-react-native';
import Animated, { FadeIn, SlideInUp, SlideOutDown } from 'react-native-reanimated';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileMenuModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ProfileMenuModal({ visible, onClose }: ProfileMenuModalProps) {
  const { user } = useAuth();
  
  if (!visible) return null;

  const MENU_ITEMS = [
    { id: '1', title: 'Personal', icon: User },
    { id: '2', title: 'Privacy & Security', icon: Shield },
    { id: '3', title: 'Notifications', icon: Bell },
    { id: '4', title: 'Documents', icon: FileText },
    { id: '5', title: 'Support', icon: HelpCircle },
  ];

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <Animated.View entering={FadeIn} style={styles.overlay}>
        <Animated.View entering={SlideInUp.springify().damping(20)} exiting={SlideOutDown} style={styles.sheet}>
          
          <View style={styles.header}>
             <View style={{ flex: 1 }} />
             <Pressable style={styles.closeButton} onPress={onClose}>
                <X color="#000" size={24} />
             </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
             <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                   <View style={styles.cameraIcon}>
                     <Camera color="#22C55E" size={24} />
                   </View>
                </View>
                <Text style={styles.userName}>Michael Muchmore</Text>
                <Text style={styles.cashtag}>$mikemuch</Text>
             </View>

             <Pressable style={styles.inviteButton}>
                <Text style={styles.inviteText}>Invite Friends, Get $5</Text>
             </Pressable>

             <View style={styles.menuList}>
               {MENU_ITEMS.map((item) => {
                 const Icon = item.icon;
                 return (
                   <Pressable key={item.id} style={styles.menuItem}>
                      <Icon color="#000" size={20} style={styles.menuIcon} />
                      <Text style={styles.menuText}>{item.title}</Text>
                      <ChevronRight color="#CCC" size={20} />
                   </Pressable>
                 );
               })}
             </View>
          </ScrollView>

        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,180,255,0.8)', // Assuming a beautiful gradient background behind modal
  },
  sheet: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 40,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#22C55E',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cameraIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
    marginBottom: 4,
  },
  cashtag: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
  inviteButton: {
    backgroundColor: '#22C55E',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  inviteText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  menuList: {
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  }
});
