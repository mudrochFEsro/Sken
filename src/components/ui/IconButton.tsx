import React from 'react';
import { Pressable, type PressableProps, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useColorScheme';
import { colors } from '@/theme/colors';
import * as Haptics from 'expo-haptics';

type IconButtonProps = PressableProps & {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
};

export function IconButton({ name, size = 24, color, onPress, style, ...props }: IconButtonProps) {
  const { colorScheme } = useTheme();
  const palette = colors[colorScheme];

  const handlePress = (e: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(e);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.button, pressed && { opacity: 0.6 }, style as any]}
      hitSlop={8}
      {...props}
    >
      <Ionicons name={name} size={size} color={color ?? palette.foreground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
