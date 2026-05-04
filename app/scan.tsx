import React, { useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as Crypto from 'expo-crypto';
import { CameraOverlay } from '@/components/CameraOverlay';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Body, H3 } from '@/components/ui/Typography';
import { saveImage } from '@/utils/image';
import { recognizeText } from '@/ocr/recognize';
import { parseReceipt } from '@/ocr/parser';
import { Linking } from 'react-native';
import { spacing } from '@/theme/tokens';

export default function ScanScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState(false);
  const [processing, setProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const handleCapture = async () => {
    if (!cameraRef.current || processing) return;
    setProcessing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (!photo) {
        setProcessing(false);
        return;
      }

      const scanId = Crypto.randomUUID();
      const imageUri = await saveImage(scanId, photo.uri);

      let ocrData = {};
      try {
        const ocrResult = await recognizeText(imageUri);
        ocrData = parseReceipt(ocrResult.text);
      } catch {
        // OCR failed — proceed with empty fields for manual entry
      }

      router.replace({
        pathname: '/editor',
        params: {
          scanId,
          imageUri,
          ...ocrData,
          amount: (ocrData as any).amount?.toString() ?? '0',
          confidence: (ocrData as any).confidence?.toString() ?? '0',
        },
      });
    } catch {
      setProcessing(false);
    }
  };

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <H3 style={styles.permissionTitle}>{t('scan.permission_title')}</H3>
        <Body color="muted" style={styles.permissionMessage}>
          {permission.canAskAgain ? t('scan.permission_message') : t('scan.permission_denied')}
        </Body>
        {permission.canAskAgain ? (
          <Button title={t('scan.grant_access')} onPress={requestPermission} />
        ) : (
          <Button title={t('scan.open_settings')} onPress={() => Linking.openSettings()} />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={flash}
      />
      <CameraOverlay />

      {processing && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Body style={styles.processingText}>{t('scan.analyzing')}</Body>
        </View>
      )}

      <View style={styles.controls}>
        <IconButton
          name={flash ? 'flash' : 'flash-off'}
          color="#fff"
          size={28}
          onPress={() => setFlash((f) => !f)}
        />
        <IconButton
          name="scan-circle-outline"
          color="#fff"
          size={72}
          onPress={handleCapture}
          disabled={processing}
          style={styles.shutter}
        />
        <IconButton
          name="close"
          color="#fff"
          size={28}
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  permissionTitle: {
    textAlign: 'center',
  },
  permissionMessage: {
    textAlign: 'center',
    marginBottom: 8,
  },
  controls: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
  },
  shutter: {
    padding: 0,
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  processingText: {
    color: '#fff',
  },
});
