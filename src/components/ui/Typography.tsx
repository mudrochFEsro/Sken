import React from 'react';
import { Text, type TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useColorScheme';
import { colors } from '@/theme/colors';
import { fontSize, fontWeight } from '@/theme/tokens';

type TypographyProps = TextProps & {
  color?: 'foreground' | 'muted' | 'destructive' | 'accent';
};

function createTypography(
  size: number,
  weight: string,
  defaultColor: 'foreground' | 'muted' = 'foreground'
) {
  return function TypographyComponent({ style, color, ...props }: TypographyProps) {
    const { colorScheme } = useTheme();
    const palette = colors[colorScheme];
    const textColor = palette[color ?? defaultColor];

    return (
      <Text
        style={[{ fontSize: size, fontWeight: weight as any, color: textColor }, style]}
        {...props}
      />
    );
  };
}

export const H1 = createTypography(fontSize['3xl'], fontWeight.bold);
export const H2 = createTypography(fontSize['2xl'], fontWeight.semibold);
export const H3 = createTypography(fontSize.xl, fontWeight.semibold);
export const Body = createTypography(fontSize.base, fontWeight.normal);
export const Caption = createTypography(fontSize.sm, fontWeight.normal, 'muted');
export const Label = createTypography(fontSize.sm, fontWeight.medium);
