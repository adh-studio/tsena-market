import { FlatList, Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductCard } from '@/components/ProductCard';
import { useFavorites } from '@/store/useFavorites';
import { spacing, useTheme } from '@/theme';

export default function FavoritesScreen() {
  const { theme } = useTheme();
  const items = useFavorites((s) => s.items);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <FlatList
        contentContainerStyle={styles.list}
        columnWrapperStyle={items.length > 0 ? styles.column : undefined}
        numColumns={2}
        data={items}
        keyExtractor={(p) => p.id}
        ListHeaderComponent={
          <View>
            <Text style={[styles.title, { color: theme.text }]}>Favoris</Text>
            <Text style={[styles.subtitle, { color: theme.muted }]}>
              {items.length > 0
                ? `${items.length} produit${items.length > 1 ? 's' : ''} enregistré${items.length > 1 ? 's' : ''}`
                : 'Vos coups de cœur'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <ProductCard product={item} />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🤍</Text>
            <Text style={[styles.emptyText, { color: theme.muted }]}>
              Aucun favori pour l&apos;instant. Touchez le cœur sur un produit pour l&apos;ajouter ici.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  list: { paddingHorizontal: spacing(4), paddingBottom: spacing(24) },
  column: { gap: spacing(3) },
  cell: { flex: 1, marginBottom: spacing(3) },
  title: { fontSize: 28, fontWeight: '800', marginTop: spacing(2) },
  subtitle: { fontSize: 14, marginTop: 2, marginBottom: spacing(4) },
  empty: { alignItems: 'center', marginTop: spacing(20), gap: spacing(3), paddingHorizontal: spacing(8) },
  emptyIcon: { fontSize: 40 },
  emptyText: { textAlign: 'center', fontSize: 14, lineHeight: 20 },
});
