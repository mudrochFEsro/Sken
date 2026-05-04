import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useScans } from '@/db/hooks';
import { MonthlySummary } from '@/components/MonthlySummary';
import { ScanCard } from '@/components/ScanCard';
import { EmptyState } from '@/components/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { useTheme } from '@/hooks/useColorScheme';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/tokens';
import type { Scan } from '@/db/schema';
import { useFocusEffect } from '@react-navigation/native';

export default function DashboardScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colorScheme } = useTheme();
  const palette = colors[colorScheme];
  const { scans, loading, refresh } = useScans();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleScanPress = useCallback((scan: Scan) => {
    router.push({ pathname: '/editor', params: { scanId: scan.id } });
  }, [router]);

  const renderItem = useCallback(({ item }: { item: Scan }) => (
    <ScanCard scan={item} onPress={handleScanPress} />
  ), [handleScanPress]);

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={styles.header}>
        <View style={styles.headerRight}>
          <IconButton
            name="download-outline"
            onPress={() => router.push('/export')}
          />
          <IconButton
            name="settings-outline"
            onPress={() => router.push('/settings')}
          />
        </View>
      </View>

      {scans.length === 0 && !loading ? (
        <EmptyState />
      ) : (
        <FlatList
          data={scans}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={<MonthlySummary />}
          contentContainerStyle={styles.list}
          onRefresh={refresh}
          refreshing={loading}
          windowSize={10}
          maxToRenderPerBatch={15}
        />
      )}

      <Pressable
        onPress={() => router.push('/scan')}
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: palette.accent },
          pressed && { opacity: 0.8 },
        ]}
      >
        <Ionicons
          name="add"
          size={28}
          color={colorScheme === 'dark' ? '#0A0A0A' : '#FAFAFA'}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 4,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
