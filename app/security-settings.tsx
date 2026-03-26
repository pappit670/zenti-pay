import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Fingerprint,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react-native';

interface SecuritySettings {
  biometric_enabled: boolean;
  require_biometric_on_open: boolean;
  require_biometric_on_send: boolean;
  auto_lock_timeout: number;
  stealth_mode: boolean;
  screenshot_protection: boolean;
  suspicious_activity_alerts: boolean;
}

export default function SecuritySettings() {
  const router = useRouter();
  const { user } = useAuth();
  const [settings, setSettings] = useState<SecuritySettings>({
    biometric_enabled: true,
    require_biometric_on_open: true,
    require_biometric_on_send: true,
    auto_lock_timeout: 30,
    stealth_mode: false,
    screenshot_protection: false,
    suspicious_activity_alerts: true,
  });
  const [saving, setSaving] = useState(false);

  const lockTimeouts = [
    { value: 0, label: 'Immediately' },
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 300, label: '5 minutes' },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_security_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setSettings(data as SecuritySettings);
    }
  };

  const updateSetting = async (key: keyof SecuritySettings, value: any) => {
    if (!user) return;

    setSaving(true);
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    await supabase
      .from('user_security_settings')
      .upsert({
        user_id: user.id,
        ...newSettings,
      });

    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#16213e']}
        style={styles.backgroundGradient}
      />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <BlurView intensity={20} tint="dark" style={styles.backButton}>
            <ArrowLeft color="#ffffff" size={20} />
          </BlurView>
        </Pressable>
        <Text style={styles.title}>Security Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <BlurView intensity={25} tint="dark" style={styles.statusCardBlur}>
          <LinearGradient
            colors={['rgba(0, 255, 136, 0.2)', 'rgba(0, 255, 136, 0.05)']}
            style={styles.statusCard}
          >
            <View style={styles.statusIcon}>
              <Shield color="#00ff88" size={32} />
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>Account Protected</Text>
              <Text style={styles.statusSubtitle}>
                {settings.biometric_enabled ? '3-layer security active' : 'Enhanced security available'}
              </Text>
            </View>
            <CheckCircle color="#00ff88" size={24} />
          </LinearGradient>
        </BlurView>

        <Text style={styles.sectionTitle}>Biometric Security</Text>

        <BlurView intensity={20} tint="dark" style={styles.settingCardBlur}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
            style={styles.settingCard}
          >
            <View style={styles.settingIcon}>
              <Fingerprint color="#a3f542" size={24} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Biometric Authentication</Text>
              <Text style={styles.settingSubtitle}>
                Use {Platform.OS === 'ios' ? 'Face ID or Touch ID' : 'fingerprint'} to unlock
              </Text>
            </View>
            <Switch
              value={settings.biometric_enabled}
              onValueChange={(value) => updateSetting('biometric_enabled', value)}
              trackColor={{ false: '#3a3a3a', true: 'rgba(163, 245, 66, 0.5)' }}
              thumbColor={settings.biometric_enabled ? '#a3f542' : '#666666'}
            />
          </LinearGradient>
        </BlurView>

        {settings.biometric_enabled && (
          <>
            <BlurView intensity={20} tint="dark" style={styles.settingCardBlur}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
                style={styles.settingCard}
              >
                <View style={styles.settingIcon}>
                  <Lock color="#a3f542" size={24} />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Require on App Open</Text>
                  <Text style={styles.settingSubtitle}>
                    Verify identity when opening Zenti
                  </Text>
                </View>
                <Switch
                  value={settings.require_biometric_on_open}
                  onValueChange={(value) => updateSetting('require_biometric_on_open', value)}
                  trackColor={{ false: '#3a3a3a', true: 'rgba(163, 245, 66, 0.5)' }}
                  thumbColor={settings.require_biometric_on_open ? '#a3f542' : '#666666'}
                />
              </LinearGradient>
            </BlurView>

            <BlurView intensity={20} tint="dark" style={styles.settingCardBlur}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
                style={styles.settingCard}
              >
                <View style={styles.settingIcon}>
                  <Shield color="#a3f542" size={24} />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Require on Send Money</Text>
                  <Text style={styles.settingSubtitle}>
                    Verify identity before sending payments
                  </Text>
                </View>
                <Switch
                  value={settings.require_biometric_on_send}
                  onValueChange={(value) => updateSetting('require_biometric_on_send', value)}
                  trackColor={{ false: '#3a3a3a', true: 'rgba(163, 245, 66, 0.5)' }}
                  thumbColor={settings.require_biometric_on_send ? '#a3f542' : '#666666'}
                />
              </LinearGradient>
            </BlurView>
          </>
        )}

        <Text style={styles.sectionTitle}>Auto-Lock</Text>

        <View style={styles.timeoutGrid}>
          {lockTimeouts.map(({ value, label }) => (
            <Pressable key={value} onPress={() => updateSetting('auto_lock_timeout', value)}>
              <BlurView
                intensity={settings.auto_lock_timeout === value ? 25 : 15}
                tint="dark"
                style={[
                  styles.timeoutCardBlur,
                  settings.auto_lock_timeout === value && styles.timeoutCardBlurActive
                ]}
              >
                <LinearGradient
                  colors={
                    settings.auto_lock_timeout === value
                      ? ['rgba(163, 245, 66, 0.3)', 'rgba(163, 245, 66, 0.1)']
                      : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']
                  }
                  style={styles.timeoutCard}
                >
                  <Clock
                    color={settings.auto_lock_timeout === value ? '#a3f542' : 'rgba(255, 255, 255, 0.5)'}
                    size={20}
                  />
                  <Text style={[
                    styles.timeoutLabel,
                    settings.auto_lock_timeout === value && styles.timeoutLabelActive
                  ]}>
                    {label}
                  </Text>
                </LinearGradient>
              </BlurView>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Privacy</Text>

        <BlurView intensity={20} tint="dark" style={styles.settingCardBlur}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
            style={styles.settingCard}
          >
            <View style={styles.settingIcon}>
              <EyeOff color="#a3f542" size={24} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Stealth Mode</Text>
              <Text style={styles.settingSubtitle}>
                Hide balance until verified with biometric
              </Text>
            </View>
            <Switch
              value={settings.stealth_mode}
              onValueChange={(value) => updateSetting('stealth_mode', value)}
              trackColor={{ false: '#3a3a3a', true: 'rgba(163, 245, 66, 0.5)' }}
              thumbColor={settings.stealth_mode ? '#a3f542' : '#666666'}
            />
          </LinearGradient>
        </BlurView>

        {Platform.OS !== 'web' && (
          <BlurView intensity={20} tint="dark" style={styles.settingCardBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
              style={styles.settingCard}
            >
              <View style={styles.settingIcon}>
                <Smartphone color="#a3f542" size={24} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Screenshot Protection</Text>
                <Text style={styles.settingSubtitle}>
                  Block screenshots and screen recording
                </Text>
              </View>
              <Switch
                value={settings.screenshot_protection}
                onValueChange={(value) => updateSetting('screenshot_protection', value)}
                trackColor={{ false: '#3a3a3a', true: 'rgba(163, 245, 66, 0.5)' }}
                thumbColor={settings.screenshot_protection ? '#a3f542' : '#666666'}
              />
            </LinearGradient>
          </BlurView>
        )}

        <Text style={styles.sectionTitle}>Threat Detection</Text>

        <BlurView intensity={20} tint="dark" style={styles.settingCardBlur}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
            style={styles.settingCard}
          >
            <View style={styles.settingIcon}>
              <AlertTriangle color="#ff9500" size={24} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Suspicious Activity Alerts</Text>
              <Text style={styles.settingSubtitle}>
                Get notified of unusual account activity
              </Text>
            </View>
            <Switch
              value={settings.suspicious_activity_alerts}
              onValueChange={(value) => updateSetting('suspicious_activity_alerts', value)}
              trackColor={{ false: '#3a3a3a', true: 'rgba(163, 245, 66, 0.5)' }}
              thumbColor={settings.suspicious_activity_alerts ? '#a3f542' : '#666666'}
            />
          </LinearGradient>
        </BlurView>

        <BlurView intensity={20} tint="dark" style={styles.infoCardBlur}>
          <LinearGradient
            colors={['rgba(163, 245, 66, 0.15)', 'rgba(163, 245, 66, 0.05)']}
            style={styles.infoCard}
          >
            <Shield color="#a3f542" size={24} />
            <Text style={styles.infoText}>
              Your security settings are encrypted and stored safely. Even if your phone is stolen,
              your money remains protected.
            </Text>
          </LinearGradient>
        </BlurView>

        <Pressable onPress={() => router.push('/remote-lock')}>
          <BlurView intensity={25} tint="dark" style={styles.remoteLockBlur}>
            <LinearGradient
              colors={['rgba(255, 68, 68, 0.2)', 'rgba(255, 68, 68, 0.05)']}
              style={styles.remoteLock}
            >
              <AlertTriangle color="#ff4444" size={24} />
              <Text style={styles.remoteLockText}>Remote Lock & Wipe</Text>
            </LinearGradient>
          </BlurView>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  statusCardBlur: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
  },
  statusCard: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingHorizontal: 24,
    marginBottom: 16,
    marginTop: 8,
  },
  settingCardBlur: {
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  settingCard: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(163, 245, 66, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 3,
  },
  settingSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  timeoutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  timeoutCardBlur: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  timeoutCardBlurActive: {
    borderColor: 'rgba(163, 245, 66, 0.3)',
  },
  timeoutCard: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeoutLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  timeoutLabelActive: {
    color: '#a3f542',
    fontWeight: '600',
  },
  infoCardBlur: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(163, 245, 66, 0.2)',
  },
  infoCard: {
    padding: 20,
    flexDirection: 'row',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 19,
  },
  remoteLockBlur: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.3)',
  },
  remoteLock: {
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  remoteLockText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4444',
  },
});
