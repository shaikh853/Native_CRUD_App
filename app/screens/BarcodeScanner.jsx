// BarcodeScanner.js
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BarcodeScanner = ({ onBarcodeScanned, onClose }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const handleBarcodeScanned = ({ data }) => {
    if (!scanned) {
      setScanned(true);
      onBarcodeScanned(data);
    }
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need permission to use the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={handleBarcodeScanned}
        style={styles.camera}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'code128'], // Add more types as needed
        }}
      />
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeText}>✖ Close</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BarcodeScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
  },
  closeText: {
    color: 'white',
    fontSize: 16,
  },
});
