import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, AlertTriangle, ShieldAlert, FileText, CheckCircle } from 'lucide-react-native';

export default function ReportFraud() {
  const router = useRouter();
  const { user } = useAuth();
  const { businessId } = useLocalSearchParams();
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reportTypes = [
    { value: 'fake_business', label: 'Fake Business', icon: ShieldAlert },
    { value: 'no_delivery', label: 'No Delivery', icon: AlertTriangle },
    { value: 'wrong_product', label: 'Wrong Product', icon: FileText },
    { value: 'scam', label: 'Suspected Scam', icon: AlertTriangle },
    { value: 'unauthorized_charge', label: 'Unauthorized Charge', icon: ShieldAlert },
    { value: 'other', label: 'Other', icon: FileText },
  ];

  const submitReport = async () => {
    if (!user || !businessId || !reportType || !description) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('fraud_reports').insert({
        reported_business_id: businessId as string,
        reporter_id: user.id,
        report_type: reportType,
        description,
        status: 'pending',
      });

      if (error) throw error;

      setSubmitted(true);
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error) {
      console.error('Error submitting fraud report:', error);
      alert('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0a0a0a', '#1a1a2e', '#16213e']}
          style={styles.backgroundGradient}
        />

        <View style={styles.successContainer}>
          <BlurView intensity={30} tint="dark" style={styles.successCircleBlur}>
            <LinearGradient
              colors={['rgba(0, 255, 136, 0.3)', 'rgba(0, 255, 136, 0.1)']}
              style={styles.successCircle}
            >
              <CheckCircle color="#00ff88" size={64} strokeWidth={2.5} />
            </LinearGradient>
          </BlurView>

          <Text style={styles.successTitle}>Report Submitted</Text>
          <Text style={styles.successText}>
            Thank you for helping keep Zenti safe. We'll investigate this matter.
          </Text>
        </View>
      </View>
    );
  }

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
        <Text style={styles.title}>Report Fraud</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <BlurView intensity={25} tint="dark" style={styles.warningCardBlur}>
          <LinearGradient
            colors={['rgba(255, 68, 68, 0.2)', 'rgba(255, 68, 68, 0.05)']}
            style={styles.warningCard}
          >
            <View style={styles.warningIcon}>
              <ShieldAlert color="#ff4444" size={28} />
            </View>
            <Text style={styles.warningText}>
              False reports may result in account suspension. Please provide accurate information.
            </Text>
          </LinearGradient>
        </BlurView>

        <Text style={styles.sectionTitle}>What happened?</Text>

        <View style={styles.typesGrid}>
          {reportTypes.map(({ value, label, icon: Icon }) => (
            <Pressable key={value} onPress={() => setReportType(value)}>
              <BlurView
                intensity={reportType === value ? 25 : 15}
                tint="dark"
                style={[
                  styles.typeCardBlur,
                  reportType === value && styles.typeCardBlurActive
                ]}
              >
                <LinearGradient
                  colors={
                    reportType === value
                      ? ['rgba(255, 68, 68, 0.3)', 'rgba(255, 68, 68, 0.1)']
                      : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']
                  }
                  style={styles.typeCard}
                >
                  <View style={[
                    styles.typeIcon,
                    reportType === value && styles.typeIconActive
                  ]}>
                    <Icon color={reportType === value ? '#ff4444' : 'rgba(255, 255, 255, 0.5)'} size={24} />
                  </View>
                  <Text style={[
                    styles.typeLabel,
                    reportType === value && styles.typeLabelActive
                  ]}>
                    {label}
                  </Text>
                </LinearGradient>
              </BlurView>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Description</Text>

        <BlurView intensity={20} tint="dark" style={styles.textAreaBlur}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
            style={styles.textArea}
          >
            <TextInput
              style={styles.textInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Please describe what happened in detail..."
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
          </LinearGradient>
        </BlurView>

        <BlurView intensity={20} tint="dark" style={styles.infoCardBlur}>
          <LinearGradient
            colors={['rgba(163, 245, 66, 0.15)', 'rgba(163, 245, 66, 0.05)']}
            style={styles.infoCard}
          >
            <Text style={styles.infoTitle}>What happens next?</Text>
            <Text style={styles.infoText}>
              • Our team will review your report{'\n'}
              • We'll investigate the business{'\n'}
              • You'll receive updates on the case{'\n'}
              • Fraudulent businesses will be banned
            </Text>
          </LinearGradient>
        </BlurView>

        <BlurView intensity={25} tint="dark" style={styles.submitButtonBlur}>
          <Pressable
            onPress={submitReport}
            disabled={!reportType || !description || submitting}
          >
            <LinearGradient
              colors={
                !reportType || !description || submitting
                  ? ['rgba(100, 100, 100, 0.3)', 'rgba(100, 100, 100, 0.1)']
                  : ['rgba(255, 68, 68, 0.3)', 'rgba(255, 68, 68, 0.15)']
              }
              style={styles.submitButton}
            >
              <ShieldAlert
                color={!reportType || !description || submitting ? '#666666' : '#ff4444'}
                size={20}
              />
              <Text style={[
                styles.submitButtonText,
                (!reportType || !description || submitting) && styles.submitButtonTextDisabled
              ]}>
                {submitting ? 'Submitting...' : 'Submit Report'}
              </Text>
            </LinearGradient>
          </Pressable>
        </BlurView>
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
  warningCardBlur: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.3)',
  },
  warningCard: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  warningIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  typeCardBlur: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  typeCardBlurActive: {
    borderColor: 'rgba(255, 68, 68, 0.4)',
  },
  typeCard: {
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIconActive: {
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
  },
  typeLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontWeight: '500',
  },
  typeLabelActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  textAreaBlur: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  textArea: {
    padding: 20,
  },
  textInput: {
    fontSize: 15,
    color: '#ffffff',
    minHeight: 140,
    textAlignVertical: 'top',
  },
  infoCardBlur: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(163, 245, 66, 0.2)',
  },
  infoCard: {
    padding: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 22,
  },
  submitButtonBlur: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.3)',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4444',
  },
  submitButtonTextDisabled: {
    color: '#666666',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successCircleBlur: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 136, 0.5)',
  },
  successCircle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
  },
});
