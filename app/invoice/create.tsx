import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Plus, X } from 'lucide-react-native';

interface InvoiceItem {
  id: string;
  item_name: string;
  description: string;
  quantity: number;
  unit_price: number;
}

export default function CreateInvoiceScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [recipientName, setRecipientName] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', item_name: '', description: '', quantity: 1, unit_price: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        item_name: '',
        description: '',
        quantity: 1,
        unit_price: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  };

  const handleCreateInvoice = async () => {
    if (!recipientName || !recipientAddress) {
      Alert.alert('Error', 'Please fill in recipient details');
      return;
    }

    const hasInvalidItems = items.some(
      (item) => !item.item_name || item.quantity <= 0 || item.unit_price <= 0
    );

    if (hasInvalidItems) {
      Alert.alert('Error', 'Please fill in all item details correctly');
      return;
    }

    setLoading(true);

    const totalAmount = calculateTotal();

    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        user_id: user!.id,
        recipient_name: recipientName,
        recipient_address: recipientAddress,
        total_amount: totalAmount,
        currency: 'KSH',
        status: 'draft',
      })
      .select()
      .single();

    if (invoiceError) {
      Alert.alert('Error', 'Failed to create invoice');
      setLoading(false);
      return;
    }

    const invoiceItems = items.map((item) => ({
      invoice_id: invoiceData.id,
      item_name: item.item_name,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price,
    }));

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(invoiceItems);

    setLoading(false);

    if (itemsError) {
      Alert.alert('Error', 'Failed to add invoice items');
    } else {
      Alert.alert('Success', 'Invoice created successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ArrowLeft color="#000" size={24} />
        </Pressable>
        <Text style={styles.title}>Create new invoice</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send to</Text>
          <View style={styles.recipientCard}>
            <TextInput
              style={styles.recipientName}
              value={recipientName}
              onChangeText={setRecipientName}
              placeholder="Recipient Name"
              placeholderTextColor="#999999"
            />
            <TextInput
              style={styles.recipientAddress}
              value={recipientAddress}
              onChangeText={setRecipientAddress}
              placeholder="Address"
              placeholderTextColor="#999999"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Invoice details</Text>
            <Pressable onPress={addItem}>
              <Text style={styles.addItemText}>Add item</Text>
            </Pressable>
          </View>

          {items.map((item, index) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <TextInput
                  style={styles.itemName}
                  value={item.item_name}
                  onChangeText={(text) => updateItem(item.id, 'item_name', text)}
                  placeholder="Item name"
                  placeholderTextColor="#999999"
                />
                {items.length > 1 && (
                  <Pressable onPress={() => removeItem(item.id)}>
                    <X color="#ff4444" size={20} />
                  </Pressable>
                )}
              </View>
              <TextInput
                style={styles.itemDescription}
                value={item.description}
                onChangeText={(text) => updateItem(item.id, 'description', text)}
                placeholder="Description"
                placeholderTextColor="#999999"
              />
              <View style={styles.itemDetails}>
                <View style={styles.itemField}>
                  <Text style={styles.fieldLabel}>Qty</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={item.quantity.toString()}
                    onChangeText={(text) =>
                      updateItem(item.id, 'quantity', parseInt(text) || 0)
                    }
                    keyboardType="number-pad"
                  />
                </View>
                <View style={styles.itemField}>
                  <Text style={styles.fieldLabel}>Price</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={item.unit_price.toString()}
                    onChangeText={(text) =>
                      updateItem(item.id, 'unit_price', parseFloat(text) || 0)
                    }
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={styles.itemTotal}>
                  <Text style={styles.fieldLabel}>Total</Text>
                  <Text style={styles.totalAmount}>
                    KSh {(item.quantity * item.unit_price).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total amount</Text>
          <Text style={styles.totalValue}>KSh {calculateTotal().toFixed(2)}</Text>
        </View>

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCreateInvoice}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating...' : 'Send Invoice'}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  addItemText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  recipientCard: {
    backgroundColor: '#000000',
    padding: 20,
    borderRadius: 16,
  },
  recipientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  recipientAddress: {
    fontSize: 14,
    color: '#999999',
  },
  itemCard: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  itemDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  itemField: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  fieldInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    color: '#000000',
  },
  itemTotal: {
    flex: 1,
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginTop: 4,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  button: {
    backgroundColor: '#000000',
    marginHorizontal: 24,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
