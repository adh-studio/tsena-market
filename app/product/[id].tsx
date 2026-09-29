import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useProduct } from '@/api/queries';
import { QuantityStepper } from '@/components/QuantityStepper';
import { formatAriary } from '@/lib/format';
import { clampQty } from '@/lib/cart';
import { useCart } from '@/store/useCart';
import { useFavorites } from '@/store/useFavorites';
import { radius, spacing, useTheme } from '@/theme';

export default function ProductScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, isLoading, isError, refetch } = useProduct(id);

  const [qty, setQty] = useState(1);
  const addItem = useCart((s) => s.addItem);
  const favorite = useFavorites((s) => (product ? s.items.some((p) => p.id === product.id) : false));
  const toggleFavorite = useFavorites((s) => s.toggle);

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator color={theme.brand} />
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <Text style={[styles.errorText, { color: theme.danger }]}>Produit introuvable.</Text>
        <Pressable onPress={() => refetch()} style={[styles.retry, { backgroundColor: theme.brand }]}>
          <Text style={styles.retryText}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  const outOfStock = product.stock === 0;

  const onAddToCart = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addItem(product, clampQty(qty, product.stock));
  };

  const onToggleFavorite = () => {
    Haptics.selectionAsync();
    toggleFavorite(product);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['bottom']}>
      <Stack.Screen options={{ title: product.category }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={product.image}
          contentFit="cover"
          transition={200}
          style={styles.image}
        />

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={[styles.name, { color: theme.text }]}>{product.name}</Text>
            <Pressable onPress={onToggleFavorite} hitSlop={8} style={styles.favBtn}>
              <Text style={styles.favIcon}>{favorite ? '❤️' : '🤍'}</Text>
            </Pressable>
          </View>

          <Text style={[styles.seller, { color: theme.muted }]}>
            {product.seller} · ⭐ {product.rating.toFixed(1)}
          </Text>

          <Text style={[styles.price, { color: theme.brand }]}>{formatAriary(product.price)}</Text>

          <Text style={[styles.stock, { color: outOfStock ? theme.danger : theme.success }]}>
            {outOfStock ? 'Rupture de stock' : `En stock · ${product.stock} disponibles`}
          </Text>

          <Text style={[styles.sectionLabel, { color: theme.muted }]}>Description</Text>
          <Text style={[styles.description, { color: theme.text }]}>{product.description}</Text>

          {!outOfStock && (
            <View style={styles.qtyRow}>
              <Text style={[styles.sectionLabel, { color: theme.muted, marginTop: 0 }]}>Quantité</Text>
              <QuantityStepper value={qty} max={product.stock} onChange={setQty} />
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.bar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <Pressable
          disabled={outOfStock}
          onPress={onAddToCart}
          style={[styles.addBtn, { backgroundColor: outOfStock ? theme.muted : theme.brand }]}
        >
          <Text style={styles.addText}>
            {outOfStock ? 'Indisponible' : `Ajouter au panier · ${formatAriary(product.price * qty)}`}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing(4) },
  errorText: { fontSize: 15, fontWeight: '600' },
  retry: { paddingHorizontal: spacing(5), paddingVertical: spacing(3), borderRadius: radius.md },
  retryText: { color: '#fff', fontWeight: '700' },
  content: { paddingBottom: spacing(6) },
  image: { width: '100%', aspectRatio: 1 },
  body: { padding: spacing(5) },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing(3) },
  name: { flex: 1, fontSize: 22, fontWeight: '800' },
  favBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favIcon: { fontSize: 22 },
  seller: { fontSize: 14, marginTop: spacing(1) },
  price: { fontSize: 26, fontWeight: '800', marginTop: spacing(3) },
  stock: { fontSize: 13, fontWeight: '600', marginTop: spacing(1) },
  sectionLabel: { fontSize: 13, fontWeight: '700', marginTop: spacing(5), marginBottom: spacing(2) },
  description: { fontSize: 15, lineHeight: 22 },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing(5),
  },
  bar: {
    padding: spacing(4),
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  addBtn: { padding: spacing(4), borderRadius: radius.md, alignItems: 'center' },
  addText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
