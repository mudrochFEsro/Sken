import React from 'react';
import { View, Pressable, FlatList, StyleSheet } from 'react-native';
import { Body, Caption } from './ui/Typography';
import { useTheme } from '@/hooks/useColorScheme';
import { colors } from '@/theme/colors';
import { CURRENCIES } from '@/utils/currency';
import { spacing } from '@/theme/tokens';

type CurrencyPickerProps = {
  selected: string;
  onSelect: (code: string) => void;
};

export function CurrencyPicker({ selected, onSelect }: CurrencyPickerProps) {
  const { colorScheme } = useTheme();
  const palette = colors[colorScheme];

  return (
    <View style={styles.container}>
      {CURRENCIES.map((c) => {
        const isSelected = c.code === selected;
        return (
          <Pressable
            key={c.code}
            onPress={() => onSelect(c.code)}
            style={[
              styles.item,
              {
                borderColor: isSelected ? palette.accent : palette.border,
                backgroundColor: isSelected ? palette.accent : 'transparent',
              },
            ]}
          >
            <Body
              style={[
                styles.code,
                isSelected && { color: colorScheme === 'dark' ? '#0A0A0A' : '#FAFAFA' },
              ]}
            >
              {c.symbol} {c.code}
            </Body>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  item: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm + 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  code: {
    fontSize: 13,
    fontWeight: '500',
  },
});
