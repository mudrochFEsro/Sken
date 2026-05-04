import React from 'react';
import { View, TextInput, type TextInputProps, StyleSheet } from 'react-native';
import { Label } from './Typography';
import { useTheme } from '@/hooks/useColorScheme';
import { colors } from '@/theme/colors';
import { spacing, borderRadius, fontSize } from '@/theme/tokens';

type InputProps = TextInputProps & {
  label?: string;
};

export function Input({ label, style, ...props }: InputProps) {
  const { colorScheme } = useTheme();
  const palette = colors[colorScheme];

  return (
    <View style={styles.container}>
      {label && <Label style={styles.label}>{label}</Label>}
      <TextInput
        placeholderTextColor={palette.muted}
        style={[
          styles.input,
          {
            backgroundColor: palette.background,
            borderColor: palette.border,
            color: palette.foreground,
          },
          style,
        ]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    marginLeft: spacing.xs,
  },
  input: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    fontSize: fontSize.base,
  },
});
