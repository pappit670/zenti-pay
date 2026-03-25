import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Bell, Clock, CheckCircle, Send } from 'lucide-react-native';

interface PaymentRequest {
  id: string;
  amount: number;
  description: string;
  created_at: string;
  status: string;
  profiles: {
    full_name: string;
  };
}

export default function PaymentReminders() {
  const router = useRouter();
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState<PaymentRequest[]>([]);
  const [sending, setSending] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('payment_requests')
      .select('*, profiles!payment_requests_to_user_id_fkey(full_name)')
      .eq('from_user_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (data) setPendingRequests(data as PaymentRequest[]);
  };

  const sendReminder = async (requestId: string) => {
    setSending(requestId);
    try {
      await supabase
        .from('payment_reminders')
        .insert({
          request_id: requestId,
          sent_by: user?.id,
          sent_at: new Date().toISOString(),
        });

      setTimeout(() => setSending(null), 1000);
    } catch (error) {
      console.error('Error sending reminder:', error);
      setSending(null);
    }
  };

  const cancelRequest = async (requestId: string) => {
    await supabase
      .from('payment_requests')
      .update({ status: 'cancelled' })
      .eq('id', requestId);

    fetchPendingRequests();
  };

  const getDaysAgo = (dateString: string) => {
    const days = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
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
        <Text style={styles.title}>Payment Reminders</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <BlurView intensity={25} tint="dark" style={styles.statsCardBlur}>
          <LinearGradient
            colors={['rgba(163, 245, 66, 0.2)', 'rgba(163, 245, 66, 0.05)']}
            style={styles.statsCard}
          >
            <View style={styles.statIcon}>
              <Clock color="#a3f542" size={28} />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statValue}>{pendingRequests.length}</Text>
              <Text style={styles.statLabel}>Pending Requests</Text>
            </View>
          </LinearGradient>
        </BlurView>

        {pendingRequests.length === 0 ? (
          <BlurView intensity={20} tint="dark" style={styles.emptyStateBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.01)']}
              style={styles.emptyState}
            >
              <CheckCircle color="rgba(255, 255, 255, 0.3)" size={64} />
              <Text style={styles.emptyText}>All caught up!</Text>
              <Text style={styles.emptySubtext}>No pending payment requests</Text>
            </LinearGradient>
          </BlurView>
        ) : (
          pendingRequests.map((request) => (
            <BlurView key={request.id} intensity={20} tint="dark" style={styles.requestCardBlur}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
                style={styles.requestCard}
              >
                <View style={styles.requestHeader}>
                  <View style={styles.requestAvatar}>
                    <Text style={styles.requestAvatarText}>
                      {request.profiles.full_name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.requestInfo}>
                    <Text style={styles.requestName}>{request.profiles.full_name}</Text>
                    <Text style={styles.requestDate}>{getDaysAgo(request.created_at)}</Text>
                  </View>
                  <Text style={styles.requestAmount}>KSh {request.amount.toFixed(2)}</Text>
                </View>

                {request.description && (
                  <Text style={styles.requestDescription}>{request.description}</Text>
                )}

                <View style={styles.requestActions}>
                  <Pressable
                    onPress={() => sendReminder(request.id)}
                    disabled={sending === request.id}
                  >
                    <BlurView intensity={15} tint="dark" style={styles.reminderButtonBlur}>
                      <LinearGradient
                        colors={
                          sending === request.id
                            ? ['rgba(0, 255, 136, 0.3)', 'rgba(0, 255, 136, 0.1)']
                            : ['rgba(163, 245, 66, 0.2)', 'rgba(163, 245, 66, 0.05)']
                        }
                        style={styles.reminderButton}
                      >
                        {sending === request.id ? (
                          <CheckCircle color="#00ff88" size={16} />
                        ) : (
                          <Bell color="#a3f542" size={16} />
                        )}
                        <Text style={[
                          styles.reminderButtonText,
                          sending === request.id && styles.reminderButtonTextSent
                        ]}>
                          {sending === request.id ? 'Sent' : 'Send Reminder'}
                        </Text>
                      </LinearGradient>
                    </BlurView>
                  </Pressable>

                  <Pressable onPress={() => cancelRequest(request.id)}>
                    <BlurView intensity={15} tint="dark" style={styles.cancelButtonBlur}>
                      <LinearGradient
                        colors={['rgba(255, 68, 68, 0.2)', 'rgba(255, 68, 68, 0.05)']}
                        style={styles.cancelButton}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </LinearGradient>
                    </BlurView>
                  </Pressable>
                </View>
              </LinearGradient>
            </BlurView>
          ))
        )}

        <BlurView intensity={20} tint="dark" style={styles.infoCardBlur}>
          <LinearGradient
            colors={['rgba(163, 245, 66, 0.1)', 'rgba(163, 245, 66, 0.02)']}
            style={styles.infoCard}
          >
            <Bell color="#a3f542" size={20} />
            <Text style={styles.infoText}>
              Reminders are sent via push notification and in-app message. Recipients will see
              a friendly nudge to complete the payment.
            </Text>
          </LinearGradient>
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
  statsCardBlur: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(163, 245, 66, 0.2)',
  },
  statsCard: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(163, 245, 66, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  emptyStateBlur: {
    marginHorizontal: 24,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  emptyState: {
    padding: 64,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  requestCardBlur: {
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  requestCard: {
    padding: 20,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(163, 245, 66, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  requestAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#a3f542',
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 3,
  },
  requestDate: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  requestAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a3f542',
  },
  requestDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 16,
    lineHeight: 20,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 12,
  },
  reminderButtonBlur: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(163, 245, 66, 0.2)',
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  reminderButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a3f542',
  },
  reminderButtonTextSent: {
    color: '#00ff88',
  },
  cancelButtonBlur: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.2)',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff4444',
  },
  infoCardBlur: {
    marginHorizontal: 24,
    marginTop: 12,
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(163, 245, 66, 0.15)',
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
});
