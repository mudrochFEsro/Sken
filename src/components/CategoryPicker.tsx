import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Caption } from './ui/Typography';
import { useTheme } from '@/hooks/useColorScheme';
import { colors } from '@/theme/colors';
import { CATEGORIES, CATEGORY_ICONS, type Category } from '@/utils/categories';
import { spacing, borderRadius } from '@/theme/tokens';

type CategoryPickerProps = {
  selected: string;
  onSelect: (category: Category) => void;
};

export function CategoryPicker({ selected, onSelect }: CategoryPickerProps) {
  const { t } = useTranslation();
  const { colorScheme } = useTheme();
  const palette = colors[colorScheme];

  return (
    <View style={styles.grid}>
      {CATEGORIES.map((cat) => {
        const isSelected = cat === selected;
        return (
          <Pressable
            key={cat}
            onPress={() => onSelect(cat)}
            style={[
              styles.item,
              {
                borderColor: isSelected ? palette.accent : palette.border,
                backgroundColor: isSelected ? palette.accent : 'transparent',
              },
            ]}
          >
            <Ionicons
              name={CATEGORY_ICONS[cat] as any}
              size={20}
              color={isSelected ? (colorScheme === 'dark' ? '#0A0A0A' : '#FAFAFA') : palette.foreground}
            />
            <Caption
              style={[
                styles.label,
                isSelected && { color: colorScheme === 'dark' ? '#0A0A0A' : '#FAFAFA' },
              ]}
            >
              {t(`categories.${cat}`)}
            </Caption>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm + 4,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
  },
});
