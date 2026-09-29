import { useState } from 'react';
import { FlatList, Pressable, Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { CartLine, lineSubtotal } from '@/lib/cart';
import { formatAriary, formatItemCount } from '@/lib/format';
import { QuantityStepper } from '@/components/QuantityStepper';
import { selectCartCount, selectCartTotal, useCart } from '@/store/useCart';
import { radius, spacing, useTheme } from '@/theme';

function CartRow({ line }: { line: CartLine }) {
  const { theme } = useTheme();
  const updateQty = useCart((s) => s.updateQty);
  const removeItem = useCart((s) => s.removeItem);

  return (
    <View style={[styles.row, { borderBottomColor: theme.border }]}>
      <Image source={line.product.image} contentFit="cover" transition={150} style={styles.thumb} />
      <View style={styles.mid}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
          {line.product.name}
        </Text>
        <Text style={[styles.unit, { color: theme.muted }]}>
          {formatAriary(line.product.price)} / unité
        </Text>
        <View style={styles.controls}>
          <QuantityStepper
            value={line.qty}
            max={line.product.stock || undefined}
            onChange={(next) => updateQty(line.product.id, next)}
          />
          <Pressable onPress={() => removeItem(line.product.id)} hitSlop={8}>
            <Text style={[styles.remove, { color: theme.danger }]}>Retirer</Text>
          </Pressable>
        </View>
      </View>
      <Text style={[styles.subtotal, { color: theme.text }]}>{formatAriary(lineSubtotal(line))}</Text>
    </View>
  );
}

export default function CartScreen() {
  const { theme } = useTheme();
  const items = useCart((s) => s.items);
  const total = useCart(selectCartTotal);
  const count = useCart(selectCartCount);
  const clear = useCart((s) => s.clear);
  const [ordered, setOrdered] = useState(false);

  const checkout = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    clear();
    setOrdered(true);
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Panier</Text>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>{ordered ? '✅' : '🛒'}</Text>
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            {ordered
              ? 'Merci ! Votre commande a bien été prise en compte.'
              : 'Votre panier est vide. Parcourez la boutique pour ajouter des produits.'}
          </Text>
          <Link href="/" asChild>
            <Pressable style={[styles.cta, { backgroundColor: theme.brand }]}>
              <Text style={styles.ctaText}>Aller à la boutique</Text>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <FlatList
        contentContainerStyle={styles.list}
        data={items}
        keyExtractor={(l) => l.product.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Panier</Text>
            <Text style={[styles.subtitle, { color: theme.muted }]}>{formatItemCount(count)}</Text>
          </View>
        }
        renderItem={({ item }) => <CartRow line={item} />}
      />
      <View style={[styles.summary, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: theme.muted }]}>Total</Text>
          <Text style={[styles.totalValue, { color: theme.text }]}>{formatAriary(total)}</Text>
        </View>
        <Pressable onPress={checkout} style={[styles.order, { backgroundColor: theme.brand }]}>
          <Text style={styles.orderText}>Commander</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  list: { paddingHorizontal: spacing(5), paddingBottom: spacing(6) },
  header: { paddingTop: spacing(2), paddingBottom: spacing(3) },
  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { fontSize: 14, marginTop: 2 },
  row: {
    flexDirection: 'row',
    gap: spacing(3),
    paddingVertical: spacing(4),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  thumb: { width: 64, height: 64, borderRadius: radius.md },
  mid: { flex: 1, gap: spacing(1) },
  name: { fontSize: 15, fontWeight: '700' },
  unit: { fontSize: 12 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: spacing(4), marginTop: spacing(2) },
  remove: { fontSize: 13, fontWeight: '600' },
  subtotal: { fontSize: 15, fontWeight: '800' },
  summary: {
    padding: spacing(5),
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing(3),
  },
  totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  totalLabel: { fontSize: 15, fontWeight: '600' },
  totalValue: { fontSize: 24, fontWeight: '800' },
  order: { padding: spacing(4), borderRadius: radius.md, alignItems: 'center' },
  orderText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing(4), paddingHorizontal: spacing(8) },
  emptyIcon: { fontSize: 48 },
  emptyText: { textAlign: 'center', fontSize: 14, lineHeight: 20 },
  cta: { paddingHorizontal: spacing(6), paddingVertical: spacing(3), borderRadius: radius.md },
  ctaText: { color: '#fff', fontWeight: '700' },
});
