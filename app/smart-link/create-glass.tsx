import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Share, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Link2, Copy, Share2, MessageCircle, Mail, CheckCircle } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';

export default function CreateSmartLinkGlass() {
  const router = useRouter();
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [linkCode, setLinkCode] = useState('');
  const [loading, setLoading] = useState(false);

  const generateLinkCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createSmartLink = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const code = generateLinkCode();
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle();

      const username = profile?.full_name?.toLowerCase().replace(/\s+/g, '') || 'user';

      const { error } = await supabase.from('smart_links').insert({
        user_id: user.id,
        link_code: code,
        amount: amount ? parseFloat(amount) : null,
        description,
        is_active: true,
      });

      if (error) throw error;

      const link = `zenti.app/${username}/request/${code}`;
      setGeneratedLink(link);
      setLinkCode(code);
    } catch (error) {
      console.error('Error creating smart link:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(`https://${generatedLink}`);
    }
  };

  const shareLink = async () => {
    try {
      const message = amount
        ? `Pay me KSh ${amount} via Zenti\n${description}\n\nhttps://${generatedLink}`
        : `Send me money via Zenti\n${description}\n\nhttps://${generatedLink}`;

      await Share.share({ message, title: 'Zenti Payment Request' });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (generatedLink) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0a0a0a', '#1a1a2e', '#0f3460']}
          style={styles.backgroundGradient}
        />

        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <BlurView intensity={20} tint="dark" style={styles.backButton}>
              <ArrowLeft color="#ffffff" size={20} />
            </BlurView>
          </Pressable>
          <Text style={styles.title}>Smart Link Created</Text>
          <View style={{ width: 44 }} />
        </View>

        <BlurView intensity={30} tint="dark" style={styles.successCardBlur}>
          <LinearGradient
            colors={['rgba(0, 255, 136, 0.15)', 'rgba(163, 245, 66, 0.05)']}
            style={styles.successCard}
          >
            <View style={styles.qrWrapper}>
              <QRCode
                value={`https://${generatedLink}`}
                size={180}
                backgroundColor="#ffffff"
                color="#000000"
              />
            </View>

            <View style={styles.linkBadge}>
              <CheckCircle color="#00ff88" size={16} />
              <Text style={styles.linkText}>{generatedLink}</Text>
            </View>

            {amount && (
              <Text style={styles.amountText}>KSh {parseFloat(amount).toFixed(2)}</Text>
            )}
            {description && (
              <Text style={styles.descriptionText}>{description}</Text>
            )}
          </LinearGradient>
        </BlurView>

        <Text style={styles.shareTitle}>Share via</Text>

        <Pressable onPress={copyToClipboard}>
          <BlurView intensity={20} tint="dark" style={styles.shareButtonBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.02)']}
              style={styles.shareButton}
            >
              <View style={styles.shareIconCircle}>
                <Copy color="#a3f542" size={20} />
              </View>
              <Text style={styles.shareButtonText}>Copy Link</Text>
            </LinearGradient>
          </BlurView>
        </Pressable>

        <Pressable onPress={shareLink}>
          <BlurView intensity={20} tint="dark" style={styles.shareButtonBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.02)']}
              style={styles.shareButton}
            >
              <View style={styles.shareIconCircle}>
                <Share2 color="#a3f542" size={20} />
              </View>
              <Text style={styles.shareButtonText}>Share</Text>
            </LinearGradient>
          </BlurView>
        </Pressable>

        <BlurView intensity={25} tint="dark" style={styles.doneButtonBlur}>
          <Pressable onPress={() => router.back()}>
            <LinearGradient
              colors={['rgba(163, 245, 66, 0.3)', 'rgba(163, 245, 66, 0.15)']}
              style={styles.doneButton}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </LinearGradient>
          </Pressable>
        </BlurView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#0f3460']}
        style={styles.backgroundGradient}
      />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <BlurView intensity={20} tint="dark" style={styles.backButton}>
            <ArrowLeft color="#ffffff" size={20} />
          </BlurView>
        </Pressable>
        <Text style={styles.title}>Create Smart Link</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <BlurView intensity={30} tint="dark" style={styles.iconCircleBlur}>
          <View style={styles.iconCircle}>
            <Link2 color="#a3f542" size={48} strokeWidth={2} />
          </View>
        </BlurView>

        <Text style={styles.subtitle}>
          Create a payment link you can share anywhere
        </Text>

        <BlurView intensity={20} tint="dark" style={styles.inputCardBlur}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
            style={styles.inputCard}
          >
            <Text style={styles.inputLabel}>Amount (Optional)</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              keyboardType="decimal-pad"
            />
          </LinearGradient>
        </BlurView>

        <BlurView intensity={20} tint="dark" style={styles.inputCardBlur}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
            style={styles.inputCard}
          >
            <Text style={styles.inputLabel}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="What's this for?"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              multiline
              numberOfLines={2}
            />
          </LinearGradient>
        </BlurView>

        <View style={styles.features}>
          {['Works in WhatsApp, iMessage & more', 'Instant notifications', 'No account details needed'].map((feature, i) => (
            <View key={i} style={styles.feature}>
              <View style={styles.checkCircle}>
                <CheckCircle color="#00ff88" size={16} />
              </View>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <BlurView intensity={25} tint="dark" style={styles.createButtonBlur}>
          <Pressable onPress={createSmartLink} disabled={loading}>
            <LinearGradient
              colors={['rgba(163, 245, 66, 0.3)', 'rgba(163, 245, 66, 0.15)']}
              style={styles.createButton}
            >
              <Link2 color="#a3f542" size={20} />
              <Text style={styles.createButtonText}>
                {loading ? 'Creating...' : 'Generate Smart Link'}
              </Text>
            </LinearGradient>
          </Pressable>
        </BlurView>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  iconCircleBlur: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignSelf: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(163, 245, 66, 0.3)',
  },
  iconCircle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputCardBlur: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  inputCard: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
  },
  textArea: {
    minHeight: 60,
  },
  features: {
    marginVertical: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkCircle: {
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  createButtonBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(163, 245, 66, 0.3)',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a3f542',
  },
  successCardBlur: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
  },
  successCard: {
    padding: 32,
    alignItems: 'center',
  },
  qrWrapper: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 20,
  },
  linkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    marginBottom: 12,
  },
  linkText: {
    fontSize: 14,
    color: '#00ff88',
    fontWeight: '600',
  },
  amountText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  shareTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  shareButtonBlur: {
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  shareIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(163, 245, 66, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  doneButtonBlur: {
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(163, 245, 66, 0.3)',
  },
  doneButton: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a3f542',
  },
});
