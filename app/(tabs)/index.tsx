import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Category, CATEGORIES } from '@/api/products';
import { useProducts } from '@/api/queries';
import { ProductCard } from '@/components/ProductCard';
import { radius, spacing, useTheme } from '@/theme';

export default function ShopScreen() {
  const { theme } = useTheme();
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [query, setQuery] = useState('');

  const { data, isLoading, isError, refetch, isRefetching } = useProducts(category);

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = data ?? [];
    if (!q) return list;
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.seller.toLowerCase().includes(q)
    );
  }, [data, query]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <FlatList
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.column}
        numColumns={2}
        data={products}
        keyExtractor={(p) => p.id}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={theme.brand} />
        }
        ListHeaderComponent={
          <View>
            <Text style={[styles.title, { color: theme.text }]}>Tsena</Text>
            <Text style={[styles.subtitle, { color: theme.muted }]}>
              Le marché malgache, dans votre poche
            </Text>

            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Rechercher un produit, un vendeur…"
              placeholderTextColor={theme.muted}
              style={[
                styles.search,
                { color: theme.text, backgroundColor: theme.card, borderColor: theme.border },
              ]}
            />

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
              data={[undefined, ...CATEGORIES]}
              keyExtractor={(c) => c ?? 'all'}
              renderItem={({ item }) => {
                const active = category === item;
                return (
                  <Pressable
                    onPress={() => setCategory(item)}
                    style={[
                      styles.chip,
                      {
                        borderColor: active ? theme.brand : theme.border,
                        backgroundColor: active ? theme.brand + '18' : theme.card,
                      },
                    ]}
                  >
                    <Text style={{ color: active ? theme.brand : theme.text, fontWeight: '600' }}>
                      {item ?? 'Tout'}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <ProductCard product={item} />
          </View>
        )}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator color={theme.brand} />
              <Text style={[styles.hint, { color: theme.muted }]}>Chargement du catalogue…</Text>
            </View>
          ) : isError ? (
            <View style={styles.center}>
              <Text style={[styles.hint, { color: theme.danger }]}>
                Impossible de charger les produits.
              </Text>
              <Pressable onPress={() => refetch()} style={[styles.retry, { backgroundColor: theme.brand }]}>
                <Text style={styles.retryText}>Réessayer</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={[styles.hint, { color: theme.muted }]}>Aucun produit trouvé.</Text>
          )
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
  subtitle: { fontSize: 14, marginTop: 2, marginBottom: spacing(3) },
  search: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(3),
    fontSize: 15,
  },
  filters: { gap: spacing(2), paddingVertical: spacing(3) },
  chip: {
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(2),
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  center: { alignItems: 'center', marginTop: spacing(16), gap: spacing(3) },
  hint: { textAlign: 'center', marginTop: spacing(10), fontSize: 14 },
  retry: { paddingHorizontal: spacing(5), paddingVertical: spacing(3), borderRadius: radius.md },
  retryText: { color: '#fff', fontWeight: '700' },
});
