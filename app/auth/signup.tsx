import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView, Modal, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ChevronDown, Check, ArrowLeft } from 'lucide-react-native';

const businessTypes = [
  'Retail',
  'Restaurant',
  'Agency',
  'Technology',
  'Healthcare',
  'Education',
  'Finance',
  'Real Estate',
  'Manufacturing',
  'Other',
];

export default function SignUpScreen() {
  const [mode, setMode] = useState<'personal' | 'business'>('personal');
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBusinessTypeModal, setShowBusinessTypeModal] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    if (mode === 'personal') {
      if (!fullName || !nationalId || !phone || !email || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
    } else {
      if (!businessName || !businessType || !businessId || !email || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await signUp({
      email,
      password,
      mode,
      fullName,
      nationalId,
      phone,
      businessName,
      businessType,
      businessId,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#000000', '#1a1a1a']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft color="#ffffff" size={24} />
      </Pressable>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <BlurView intensity={20} tint="dark" style={styles.glassCard}>
          <View style={styles.cardContent}>
            <View style={styles.modeToggle}>
              <Pressable
                style={[styles.modeButton, mode === 'personal' && styles.modeButtonActive]}
                onPress={() => setMode('personal')}
              >
                <Text style={[styles.modeText, mode === 'personal' && styles.modeTextActive]}>
                  Personal
                </Text>
              </Pressable>
              <Pressable
                style={[styles.modeButton, mode === 'business' && styles.modeButtonActive]}
                onPress={() => setMode('business')}
              >
                <Text style={[styles.modeText, mode === 'business' && styles.modeTextActive]}>
                  Business
                </Text>
              </Pressable>
            </View>

            <Text style={styles.title}>Create your account</Text>

            <View style={styles.form}>
              {mode === 'personal' ? (
                <>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="Full Name"
                      placeholderTextColor="#666666"
                      editable={!loading}
                    />
                  </View>

                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={nationalId}
                      onChangeText={setNationalId}
                      placeholder="National ID Number"
                      placeholderTextColor="#666666"
                      editable={!loading}
                    />
                  </View>

                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="Phone Number"
                      placeholderTextColor="#666666"
                      keyboardType="phone-pad"
                      editable={!loading}
                    />
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={businessName}
                      onChangeText={setBusinessName}
                      placeholder="Business Name"
                      placeholderTextColor="#666666"
                      editable={!loading}
                    />
                  </View>

                  <Pressable
                    style={styles.inputWrapper}
                    onPress={() => setShowBusinessTypeModal(true)}
                    disabled={loading}
                  >
                    <View style={styles.dropdownInput}>
                      <Text style={[styles.dropdownText, !businessType && styles.placeholderText]}>
                        {businessType || 'Business Type (e.g., Retail, Restaurant)'}
                      </Text>
                      <ChevronDown color="#666666" size={20} />
                    </View>
                  </Pressable>

                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={businessId}
                      onChangeText={setBusinessId}
                      placeholder="Business ID / Registration Number"
                      placeholderTextColor="#666666"
                      editable={!loading}
                    />
                  </View>
                </>
              )}

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  placeholderTextColor="#666666"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor="#666666"
                  secureTextEntry
                  editable={!loading}
                />
              </View>

              <Pressable
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={handleSignUp}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? 'Creating account...' : 'Sign up'}
                </Text>
              </Pressable>

              <Pressable style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Sign up with Facebook</Text>
              </Pressable>

              <Pressable
                style={styles.linkButton}
                onPress={() => router.push('/auth/signin')}
              >
                <Text style={styles.linkText}>
                  Already have an account? <Text style={styles.linkTextBold}>Log in</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </BlurView>
      </ScrollView>

      <Modal
        visible={showBusinessTypeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowBusinessTypeModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowBusinessTypeModal(false)}
        >
          <View style={styles.modalContent}>
            <BlurView intensity={40} tint="dark" style={styles.modalBlur}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Business Type</Text>
              </View>
              <ScrollView style={styles.modalList}>
                {businessTypes.map((type) => (
                  <Pressable
                    key={type}
                    style={styles.modalItem}
                    onPress={() => {
                      setBusinessType(type);
                      setShowBusinessTypeModal(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{type}</Text>
                    {businessType === type && (
                      <Check color="#a3f542" size={20} />
                    )}
                  </Pressable>
                ))}
              </ScrollView>
            </BlurView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingVertical: 60,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardContent: {
    padding: 32,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 32,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#ffffff',
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999999',
  },
  modeTextActive: {
    color: '#000000',
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: -0.5,
  },
  form: {
    gap: 16,
  },
  inputWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '300',
  },
  primaryButton: {
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '300',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#999999',
    fontWeight: '300',
  },
  linkTextBold: {
    color: '#ffffff',
    fontWeight: '500',
  },
  dropdownInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '300',
    flex: 1,
  },
  placeholderText: {
    color: '#666666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '70%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  modalItemText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '300',
  },
});
