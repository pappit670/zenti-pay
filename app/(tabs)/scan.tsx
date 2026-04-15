import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ScrollView } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Scan, User, Clock, QrCode } from 'lucide-react-native';
import { useZenti } from '@/contexts/ZentiContext';

const { width } = Dimensions.get('window');

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { showIsland } = useZenti();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    // Show success island and navigate
    showIsland({ type: 'success', amount: 0 }); // simulate a scan success
    // In a real flow, you'd navigate to confirmation
    router.push({
      pathname: '/send-recipient',
      params: { amount: '200' } // mock scan result
    });
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text style={styles.text}>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text style={styles.text}>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan to Pay</Text>
      </View>

      <View style={styles.scannerWrapper}>
        <CameraView
          style={styles.scanner}
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        >
          <View style={styles.overlay}>
             <View style={styles.scanFrame} />
          </View>
        </CameraView>
      </View>

      <View style={styles.content}>
        <Text style={styles.helperText}>Position QR code inside the frame</Text>
        
        <Text style={styles.sectionTitle}>Recent Contacts</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentList}>
          {[1,2,3,4].map(i => (
            <View key={i} style={styles.recentContact}>
               <View style={styles.avatar}>
                  <User color="#fff" size={24} />
               </View>
               <Text style={styles.contactName}>Contact {i}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footerActions}>
           <View style={styles.actionItem}>
              <View style={styles.actionIcon}>
                 <QrCode color="#fff" size={20} />
              </View>
              <Text style={styles.actionLabel}>Show My Code</Text>
           </View>
           <View style={styles.actionItem}>
              <View style={styles.actionIcon}>
                 <Clock color="#fff" size={20} />
              </View>
              <Text style={styles.actionLabel}>History</Text>
           </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  scannerWrapper: {
    alignSelf: 'center',
    width: width * 0.9,
    height: width * 0.45,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  scanner: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  scanFrame: {
    width: '80%',
    height: '80%',
    borderWidth: 2,
    borderColor: '#00FF88',
    borderRadius: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  helperText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  recentList: {
    gap: 16,
    marginBottom: 40,
  },
  recentContact: {
    alignItems: 'center',
    width: 64,
    gap: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactName: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    textAlign: 'center',
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 'auto',
    marginBottom: 40,
  },
  actionItem: {
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  }
});
