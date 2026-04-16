import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Platform, TextInput, ScrollView, KeyboardAvoidingView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Delete, Divide, Minus, Plus, X, Search } from 'lucide-react-native';
import { useZenti } from '@/contexts/ZentiContext';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence,
  withTiming,
  FadeInUp,
  FadeInRight,
  SlideInRight,
  SlideOutLeft
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SUGGESTED_CONTACTS = [
  { id: '1', name: 'Diego Martinez', tag: '$dmartinez215', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  { id: '2', name: 'Katherine Hall', tag: '$kathall80', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { id: '3', name: 'Aaron Burton', tag: '$aburton', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop' },
];

export default function PayScreen() {
  const router = useRouter();
  const { mode: modeParam } = useLocalSearchParams();
  const [mode, setMode] = useState<'send' | 'request'>((modeParam as any) || 'send');
  
  // States
  const [step, setStep] = useState<'amount' | 'details' | 'success'>('amount');
  const [amount, setAmount] = useState('0');
  const [to, setTo] = useState('');
  const [note, setNote] = useState('');
  const [sendAs, setSendAs] = useState<'cash' | 'stock' | 'bitcoin'>('cash');
  const [recipient, setRecipient] = useState<any>(null);

  const { completeSession } = useZenti();
  const inputRef = useRef<TextInput>(null);

  // Animations
  const amountScale = useSharedValue(1);

  useEffect(() => {
    if (step === 'details') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [step]);

  const handleNumberPress = (num: string) => {
    amountScale.value = withSequence(withTiming(1.1, { duration: 50 }), withSpring(1));
    if (amount === '0' && num !== '.') setAmount(num);
    else if (amount.length < 10) setAmount(amount + num);
  };

  const handleDecimalPress = () => {
    amountScale.value = withSequence(withTiming(1.1, { duration: 50 }), withSpring(1));
    if (!amount.includes('.')) setAmount(amount + '.');
  };

  const handleDelete = () => {
    amountScale.value = withSequence(withTiming(0.9, { duration: 50 }), withSpring(1));
    if (amount.length === 1) setAmount('0');
    else setAmount(amount.slice(0, -1));
  };

  const animatedAmountStyle = useAnimatedStyle(() => ({
    transform: [{ scale: amountScale.value }],
  }));

  const executeTransaction = () => {
    setStep('success');
    completeSession();
  };

  if (step === 'success') {
    return (
      <View style={styles.successContainer}>
        <Animated.View entering={FadeInUp} style={styles.successContent}>
          <View style={styles.successBadge}>
             <Text style={styles.successBadgeText}>✓</Text>
          </View>
          <Text style={styles.successActionType}>
            {mode === 'request' ? 'Requested' : 'Sent'}
          </Text>
          <Text style={styles.successRecipient}>
            {mode === 'request' ? `From ${recipient?.name || to}` : `To ${recipient?.name || to}`}
          </Text>
          <Text style={styles.successAmount}>${parseFloat(amount).toLocaleString()}</Text>
          <Text style={styles.successTime}>Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </Animated.View>

        <Pressable 
          style={styles.doneButton} 
          onPress={() => router.replace('/')}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </Pressable>
      </View>
    );
  }

  if (step === 'details') {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.containerWhite}>
        {/* Header matching Image 3 */}
        <View style={styles.detailsHeader}>
           <Pressable style={styles.iconButton} onPress={() => setStep('amount')}>
              <X color="#000" size={28} />
           </Pressable>
           <View style={styles.headerTitles}>
              <Text style={styles.headerAmount}>${amount}</Text>
              <Text style={styles.headerSubtitle}>From Cash Balance ~</Text>
           </View>
           <Pressable 
             style={[styles.payButtonTop, (!to && !recipient) && styles.payButtonDisabled]} 
             onPress={executeTransaction}
             disabled={!to && !recipient}
           >
              <Text style={styles.payButtonTextTop}>{mode === 'send' ? 'Pay' : 'Request'}</Text>
           </Pressable>
        </View>

        {/* Input Fields */}
        <View style={styles.inputGroup}>
           <Text style={styles.inputLabel}>To:</Text>
           <TextInput 
             ref={inputRef}
             style={styles.textInput}
             placeholder="Name, $Cashtag, Phone, Email"
             placeholderTextColor="#999"
             value={recipient ? recipient.name : to}
             onChangeText={(txt) => {
               setTo(txt);
               if (recipient) setRecipient(null);
             }}
             autoCorrect={false}
           />
        </View>

        <View style={styles.inputGroup}>
           <Text style={styles.inputLabel}>For:</Text>
           <TextInput 
             style={styles.textInput}
             placeholder="Add a note"
             placeholderTextColor="#999"
             value={note}
             onChangeText={setNote}
           />
        </View>

        {/* Send As Selector */}
        {mode === 'send' && (
          <View style={styles.sendAsContainer}>
            <Text style={styles.sendAsLabel}>Send as:</Text>
            <View style={styles.toggleGroup}>
               <Pressable onPress={() => setSendAs('cash')} style={[styles.toggleBtn, sendAs === 'cash' && styles.toggleBtnActiveGreen]}>
                 <Text style={[styles.toggleText, sendAs === 'cash' && styles.toggleTextActive]}>Cash</Text>
               </Pressable>
               <Pressable onPress={() => setSendAs('stock')} style={[styles.toggleBtn, sendAs === 'stock' && styles.toggleBtnActive]}>
                 <Text style={[styles.toggleText, sendAs === 'stock' && styles.toggleTextActiveDark]}>Stock ⌄</Text>
               </Pressable>
               <Pressable onPress={() => setSendAs('bitcoin')} style={[styles.toggleBtn, sendAs === 'bitcoin' && styles.toggleBtnActive]}>
                 <Text style={[styles.toggleText, sendAs === 'bitcoin' && styles.toggleTextActiveDark]}>Bitcoin</Text>
               </Pressable>
            </View>
          </View>
        )}

        {/* Suggested Contacts */}
        <View style={styles.suggestedContainer}>
          <Text style={styles.suggestedTitle}>SUGGESTED</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {SUGGESTED_CONTACTS.map((contact) => (
              <Pressable 
                key={contact.id} 
                style={styles.contactRow}
                onPress={() => {
                  setRecipient(contact);
                  setTo(contact.name);
                }}
              >
                <Image source={{ uri: contact.avatar }} style={styles.avatar} />
                <View>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactTag}>{contact.tag}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.containerBlack}>
      <View style={styles.headerLeftRight}>
         <Pressable style={styles.iconButton} onPress={() => router.back()}>
            <Search color="#fff" size={28} />
         </Pressable>
         <View style={styles.tabContainer}>
            <Pressable style={[styles.tab, mode === 'request' && styles.activeTab]} onPress={() => setMode('request')}>
               <Text style={[styles.tabText, mode === 'request' && styles.activeTabText]}>Request</Text>
            </Pressable>
            <Pressable style={[styles.tab, mode === 'send' && styles.activeTab]} onPress={() => setMode('send')}>
               <Text style={[styles.tabText, mode === 'send' && styles.activeTabText]}>Pay</Text>
            </Pressable>
         </View>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>$</Text>
        <Animated.View style={animatedAmountStyle}>
          <Text style={styles.amountText}>{amount}</Text>
        </Animated.View>
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.bottomButtonsRow}>
           <Pressable 
             style={[styles.bigButton, parseFloat(amount) <= 0 && styles.bigButtonDisabled]}
             onPress={() => { if (parseFloat(amount) > 0) { setMode('request'); setStep('details'); } }}
           >
              <Text style={styles.bigButtonText}>Request</Text>
           </Pressable>
           <Pressable 
             style={[styles.bigButton, parseFloat(amount) <= 0 && styles.bigButtonDisabled]}
             onPress={() => { if (parseFloat(amount) > 0) { setMode('send'); setStep('details'); } }}
           >
              <Text style={styles.bigButtonText}>Pay</Text>
           </Pressable>
        </View>

        <View style={styles.keyboardContainer}>
          {[
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['.', '0', 'delete']
          ].map((row, i) => (
            <View key={i} style={styles.keyboardRow}>
              {row.map((key) => (
                <Key 
                   key={key} 
                   label={key} 
                   onPress={() => {
                     if (key === 'delete') handleDelete();
                     else if (key === '.') handleDecimalPress();
                     else handleNumberPress(key);
                   }} 
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function Key({ label, onPress }: { label: string, onPress: () => void }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.06);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: `rgba(255,255,255,${opacity.value})`,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92);
    opacity.value = withTiming(0.12, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withTiming(0.06, { duration: 100 });
  };

  return (
    <AnimatedPressable 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.key, animatedStyle]}
    >
      {label === 'delete' ? <Delete color="#fff" size={24} /> : <Text style={styles.keyText}>{label}</Text>}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  containerBlack: { flex: 1, backgroundColor: '#000', paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  containerWhite: { flex: 1, backgroundColor: '#fff', paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  headerLeftRight: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20, position: 'relative' },
  iconButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center', position: 'absolute', left: 20, zIndex: 10 },
  tabContainer: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', padding: 4, borderRadius: 24 },
  tab: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  activeTab: { backgroundColor: '#fff' },
  tabText: { color: '#888', fontWeight: '600', fontSize: 16 },
  activeTabText: { color: '#000', fontWeight: '700' },
  amountContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 160, marginTop: 40 },
  currencySymbol: { fontSize: 40, fontWeight: '700', color: '#fff', marginRight: 8, opacity: 0.8 },
  amountText: { fontSize: 90, fontWeight: '800', color: '#fff', letterSpacing: -2 },
  controlsContainer: { flex: 1, justifyContent: 'flex-end', paddingBottom: 40 },
  bottomButtonsRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 40, paddingHorizontal: 24 },
  bigButton: { flex: 1, backgroundColor: '#22C55E', paddingVertical: 16, borderRadius: 32, alignItems: 'center' },
  bigButtonDisabled: { backgroundColor: '#333', opacity: 0.5 },
  bigButtonText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
  keyboardContainer: { paddingHorizontal: 24, gap: 12 },
  keyboardRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  key: { flex: 1, height: 72, justifyContent: 'center', alignItems: 'center', borderRadius: 36 },
  keyText: { fontSize: 28, fontWeight: '700', color: '#fff' },
  
  // Details Screen Styles
  detailsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 24, borderBottomWidth: 1, borderColor: '#eee' },
  headerTitles: { alignItems: 'center' },
  headerAmount: { fontSize: 24, fontWeight: '800', color: '#000' },
  headerSubtitle: { fontSize: 13, color: '#888', marginTop: 2, fontWeight: '600' },
  payButtonTop: { backgroundColor: '#22C55E', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  payButtonDisabled: { backgroundColor: '#E0E0E0' },
  payButtonTextTop: { color: '#fff', fontWeight: '800', fontSize: 16 },
  inputGroup: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderColor: '#eee' },
  inputLabel: { fontSize: 18, fontWeight: '700', color: '#000', width: 40 },
  textInput: { flex: 1, fontSize: 18, fontWeight: '500', color: '#000', padding: 0 },
  sendAsContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderColor: '#eee', backgroundColor: '#FAFAFA' },
  sendAsLabel: { fontSize: 16, fontWeight: '700', color: '#000', marginRight: 16 },
  toggleGroup: { flexDirection: 'row', gap: 8 },
  toggleBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#eee' },
  toggleBtnActive: { backgroundColor: '#e5e5e5' },
  toggleBtnActiveGreen: { backgroundColor: '#22C55E' },
  toggleText: { fontSize: 14, fontWeight: '700', color: '#666' },
  toggleTextActive: { color: '#fff' },
  toggleTextActiveDark: { color: '#000' },
  suggestedContainer: { flex: 1, backgroundColor: '#FAFAFA' },
  suggestedTitle: { paddingHorizontal: 24, paddingVertical: 16, fontSize: 12, fontWeight: '800', color: '#999', letterSpacing: 1 },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 16 },
  contactName: { fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 2 },
  contactTag: { fontSize: 14, color: '#888', fontWeight: '500' },

  // Success Screen
  successContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 24 },
  successContent: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  successBadge: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#22C55E', justifyContent: 'center', alignItems: 'center', marginBottom: 32 },
  successBadgeText: { color: '#fff', fontSize: 40, fontWeight: '800' },
  successActionType: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 4 },
  successRecipient: { color: 'rgba(255,255,255,0.4)', fontSize: 16, fontWeight: '600', marginBottom: 40 },
  successAmount: { color: '#fff', fontSize: 64, fontWeight: '800', letterSpacing: -2, marginBottom: 12 },
  successTime: { color: 'rgba(255,255,255,0.4)', fontSize: 16, fontWeight: '600' },
  doneButton: { width: '100%', height: 60, backgroundColor: '#22C55E', borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: Platform.OS === 'ios' ? 20 : 0 },
  doneButtonText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});
