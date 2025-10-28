import { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import BarcodeScanner from './BarcodeScanner'; // Make sure this is a default export
import * as Haptics from 'expo-haptics';


const AddProduct = ({ onAddProduct, existingProduct, onUpdateProduct, showAddForm }) => {
  const isEdit = !!existingProduct;
  const [name, setName] = useState(existingProduct?.name || '');
  const [price, setPrice] = useState(existingProduct?.price?.toString() || '');
  const [quantity, setQuantity] = useState(existingProduct?.quantity?.toString() || '');
  const [showScanner, setShowScanner] = useState(false);

  const handleSubmit = () => {
    if (!name || !price || !quantity) {
      Alert.alert('All fields are required!');
      return;
    }

    const product = {
      id: isEdit ? existingProduct.id : Date.now(),
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
    };

    isEdit ? onUpdateProduct(product) : onAddProduct(product);

    // Clear fields
    setName('');
    setPrice('');
    setQuantity('');
  };

  const BacktoHome = () => {
    showAddForm(false);
  };

  // If barcode scanner is open, render only that
  if (showScanner) {
    return (
      <BarcodeScanner
        onBarcodeScanned={(data) => {
             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          if (data) setName(data);
          setShowScanner(false);
        }}
        onClose={() => setShowScanner(false)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isEdit ? 'Edit' : 'Add'} Product</Text>

   <View style={styles.row}>
  <TextInput
    placeholder="Name"
    value={name}
    onChangeText={setName}
    style={styles.nameInput}
  />
  <View style={styles.cameraButton}>
    <Button title="📷" onPress={() => setShowScanner(true)} />
  </View>
</View>


      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        style={styles.input}
        keyboardType="numeric"
      />

      <Button title={isEdit ? 'Update Product' : 'Add Product'} onPress={handleSubmit} />

      <View style={styles.backButton}>
        <Button title="Cancel" onPress={BacktoHome} color="#DC2525" />
      </View>
    </View>
  );
};

export default AddProduct;

const styles = StyleSheet.create({
    row: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
},
nameInput: {
  flex: 1,
  borderWidth: 1,
  borderColor: '#ccc',
  paddingHorizontal: 10,
  paddingVertical: 8,
  borderRadius: 4,
  marginRight: 10, // adds space between input and button
},
cameraButton: {
  flexShrink: 0, // prevents the button from stretching
},

  container: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
  backButton: {
    marginTop: 12,
  },
});
