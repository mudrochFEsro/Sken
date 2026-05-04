import React from 'react';
import { Pressable, type PressableProps, StyleSheet } from 'react-native';
import { Body } from './Typography';
import { useTheme } from '@/hooks/useColorScheme';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/tokens';
import * as Haptics from 'expo-haptics';

type ButtonProps = PressableProps & {
  title: string;
  variant?: 'primary' | 'ghost' | 'destructive';
};

export function Button({ title, variant = 'primary', onPress, style, ...props }: ButtonProps) {
  const { colorScheme } = useTheme();
  const palette = colors[colorScheme];

  const handlePress = (e: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(e);
  };

  const isPrimary = variant === 'primary';
  const isDestructive = variant === 'destructive';

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.base,
        isPrimary && { backgroundColor: palette.accent },
        isDestructive && { backgroundColor: palette.destructive },
        !isPrimary && !isDestructive && { backgroundColor: 'transparent' },
        pressed && { opacity: 0.7 },
        style as any,
      ]}
      {...props}
    >
      <Body
        color={isPrimary ? undefined : isDestructive ? undefined : 'foreground'}
        style={[
          styles.text,
          (isPrimary || isDestructive) && { color: colorScheme === 'dark' ? '#0A0A0A' : '#FAFAFA' },
        ]}
      >
        {title}
      </Body>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
});
