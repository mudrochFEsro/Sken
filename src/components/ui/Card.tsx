import React from 'react';
import { View, type ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useColorScheme';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/tokens';

export function Card({ style, children, ...props }: ViewProps) {
  const { colorScheme } = useTheme();
  const palette = colors[colorScheme];

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: palette.card, borderColor: palette.border },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
});
