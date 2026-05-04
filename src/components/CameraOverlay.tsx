import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FRAME_SIZE = SCREEN_WIDTH * 0.85;
const CORNER_SIZE = 24;
const CORNER_WIDTH = 3;

function Corner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const isTop = position.startsWith('t');
  const isLeft = position.endsWith('l');

  return (
    <View
      style={[
        styles.corner,
        isTop ? { top: 0 } : { bottom: 0 },
        isLeft ? { left: 0 } : { right: 0 },
        {
          borderTopWidth: isTop ? CORNER_WIDTH : 0,
          borderBottomWidth: !isTop ? CORNER_WIDTH : 0,
          borderLeftWidth: isLeft ? CORNER_WIDTH : 0,
          borderRightWidth: !isLeft ? CORNER_WIDTH : 0,
        },
      ]}
    />
  );
}

export function CameraOverlay() {
  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <Corner position="tl" />
        <Corner position="tr" />
        <Corner position="bl" />
        <Corner position="br" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE * 1.4,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: 'rgba(255,255,255,0.8)',
  },
});
