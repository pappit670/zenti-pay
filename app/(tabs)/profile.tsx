import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useMode } from '@/contexts/ModeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/database';
import { ChevronRight, User as UserIcon, Briefcase, UserCog, Bell, Shield, LogOut, Moon, Sun, Star, DollarSign, Link2, Users, Smartphone, Clock } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { currentMode, setMode, isAdmin, isBusinessVerified } = useMode();
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (data) setProfile(data);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const memberSince = profile?.member_since
    ? new Date(profile.member_since).getFullYear()
    : new Date().getFullYear();

  return (
    <ScrollView
      style={styles.container}
      scrollEventThrottle={16}
      bounces={true}
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <UserIcon color="#ffffff" size={40} />
        </View>
        <Text style={styles.profileName}>{profile?.full_name || 'User'}</Text>
        <Text style={styles.profileEmail}>{profile?.email || ''}</Text>
        {profile?.is_premium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>PREMIUM</Text>
          </View>
        )}
        <Text style={styles.memberSince}>Member since {memberSince}</Text>

        <Pressable style={styles.logoutButtonTop} onPress={handleSignOut}>
          <LogOut color="#ffffff" size={20} />
          <Text style={styles.logoutButtonTopText}>Log Out</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mode</Text>

        <Pressable
          style={[styles.menuItem, currentMode === 'personal' && styles.menuItemActive]}
          onPress={() => setMode('personal')}
        >
          <View style={[styles.menuIcon, currentMode === 'personal' && styles.menuIconActive]}>
            <UserIcon color={currentMode === 'personal' ? '#000000' : '#ffffff'} size={20} />
          </View>
          <Text style={styles.menuText}>Personal Mode</Text>
          {currentMode === 'personal' && (
            <View style={styles.activeDot} />
          )}
        </Pressable>

        {isBusinessVerified && (
          <Pressable
            style={[styles.menuItem, currentMode === 'business' && styles.menuItemActive]}
            onPress={() => setMode('business')}
          >
            <View style={[styles.menuIcon, currentMode === 'business' && styles.menuIconActive]}>
              <Briefcase color={currentMode === 'business' ? '#000000' : '#ffffff'} size={20} />
            </View>
            <Text style={styles.menuText}>Business Mode</Text>
            {currentMode === 'business' && (
              <View style={styles.activeDot} />
            )}
          </Pressable>
        )}

        {isAdmin && (
          <Pressable
            style={[styles.menuItem, currentMode === 'admin' && styles.menuItemActive]}
            onPress={() => setMode('admin')}
          >
            <View style={[styles.menuIcon, currentMode === 'admin' && styles.menuIconActive]}>
              <UserCog color={currentMode === 'admin' ? '#000000' : '#ffffff'} size={20} />
            </View>
            <Text style={styles.menuText}>Admin Mode</Text>
            {currentMode === 'admin' && (
              <View style={styles.activeDot} />
            )}
          </Pressable>
        )}
      </View>

      {currentMode === 'business' && isBusinessVerified && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business</Text>

          <Pressable style={styles.menuItem} onPress={() => router.push('/business/dashboard-glass')}>
            <View style={styles.menuIcon}>
              <Briefcase color="#ffffff" size={20} />
            </View>
            <Text style={styles.menuText}>Business Dashboard</Text>
            <ChevronRight color="#666666" size={20} />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => router.push('/business/reputation')}>
            <View style={styles.menuIcon}>
              <Star color="#ffd700" size={20} />
            </View>
            <Text style={styles.menuText}>Reputation & Reviews</Text>
            <ChevronRight color="#666666" size={20} />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => router.push('/business/tip-glass')}>
            <View style={styles.menuIcon}>
              <DollarSign color="#00ff88" size={20} />
            </View>
            <Text style={styles.menuText}>Tipping System</Text>
            <ChevronRight color="#666666" size={20} />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => router.push('/smart-link/create-glass')}>
            <View style={styles.menuIcon}>
              <Link2 color="#a3f542" size={20} />
            </View>
            <Text style={styles.menuText}>Smart Payment Links</Text>
            <ChevronRight color="#666666" size={20} />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => router.push('/add-cash-nfc-glass')}>
            <View style={styles.menuIcon}>
              <Smartphone color="#a3f542" size={20} />
            </View>
            <Text style={styles.menuText}>Accept NFC Payments</Text>
            <ChevronRight color="#666666" size={20} />
          </Pressable>

          {profile?.business_category === 'restaurant' && (
            <Pressable style={styles.menuItem} onPress={() => router.push('/split-bill')}>
              <View style={styles.menuIcon}>
                <Users color="#a3f542" size={20} />
              </View>
              <Text style={styles.menuText}>Split Bill (Customers)</Text>
              <ChevronRight color="#666666" size={20} />
            </Pressable>
          )}
        </View>
      )}

      {currentMode === 'personal' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>

          <Pressable style={styles.menuItem} onPress={() => router.push('/smart-link/create-glass')}>
            <View style={styles.menuIcon}>
              <Link2 color="#a3f542" size={20} />
            </View>
            <Text style={styles.menuText}>Smart Links</Text>
            <ChevronRight color="#666666" size={20} />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => router.push('/split-bill')}>
            <View style={styles.menuIcon}>
              <Users color="#a3f542" size={20} />
            </View>
            <Text style={styles.menuText}>Split Bill</Text>
            <ChevronRight color="#666666" size={20} />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => router.push('/payment-reminders')}>
            <View style={styles.menuIcon}>
              <Clock color="#a3f542" size={20} />
            </View>
            <Text style={styles.menuText}>Payment Reminders</Text>
            <ChevronRight color="#666666" size={20} />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => router.push('/add-cash-nfc-glass')}>
            <View style={styles.menuIcon}>
              <Smartphone color="#a3f542" size={20} />
            </View>
            <Text style={styles.menuText}>NFC Tap to Pay</Text>
            <ChevronRight color="#666666" size={20} />
          </Pressable>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <Pressable style={styles.menuItem} onPress={toggleTheme}>
          <View style={styles.menuIcon}>
            {theme === 'dark' ? (
              <Moon color="#ffffff" size={20} />
            ) : (
              <Sun color="#ffffff" size={20} />
            )}
          </View>
          <Text style={styles.menuText}>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</Text>
          <ChevronRight color="#666666" size={20} />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Bell color="#ffffff" size={20} />
          </View>
          <Text style={styles.menuText}>Notifications</Text>
          <ChevronRight color="#666666" size={20} />
        </Pressable>

        <Pressable style={styles.menuItem} onPress={() => router.push('/security-settings')}>
          <View style={styles.menuIcon}>
            <Shield color="#ffffff" size={20} />
          </View>
          <Text style={styles.menuText}>Security</Text>
          <ChevronRight color="#666666" size={20} />
        </Pressable>
      </View>

      <Pressable style={styles.signOutButton} onPress={handleSignOut}>
        <LogOut color="#ff4444" size={20} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    minHeight: '100%',
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileCard: {
    backgroundColor: '#2a2a2a',
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3a3a3a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 12,
  },
  premiumBadge: {
    backgroundColor: '#a3f542',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  memberSince: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 20,
  },
  logoutButtonTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4444',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
  },
  logoutButtonTopText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemActive: {
    backgroundColor: '#ffffff',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3a3a3a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIconActive: {
    backgroundColor: '#000000',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00cc66',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a2a2a',
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    color: '#ff4444',
    fontWeight: '600',
  },
});
