import { memo } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Product } from '@/api/products';
import { formatAriary } from '@/lib/format';
import { useFavorites } from '@/store/useFavorites';
import { radius, spacing, useTheme } from '@/theme';

interface Props {
  product: Product;
}

const BLUR_HASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

function ProductCardBase({ product }: Props) {
  const { theme } = useTheme();
  const favorite = useFavorites((s) => s.items.some((p) => p.id === product.id));
  const toggle = useFavorites((s) => s.toggle);

  const onToggleFavorite = () => {
    Haptics.selectionAsync();
    toggle(product);
  };

  return (
    <Link href={`/product/${product.id}`} asChild>
      <Pressable
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
      >
        <View style={styles.imageWrap}>
          <Image
            source={product.image}
            placeholder={BLUR_HASH}
            contentFit="cover"
            transition={200}
            style={styles.image}
          />
          <Pressable
            hitSlop={8}
            onPress={onToggleFavorite}
            style={[styles.favBtn, { backgroundColor: theme.card + 'e6' }]}
          >
            <Text style={styles.favIcon}>{favorite ? '❤️' : '🤍'}</Text>
          </Pressable>
          {product.stock === 0 && (
            <View style={[styles.badge, { backgroundColor: theme.danger }]}>
              <Text style={styles.badgeText}>Épuisé</Text>
            </View>
          )}
        </View>
        <View style={styles.body}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={[styles.seller, { color: theme.muted }]} numberOfLines={1}>
            {product.seller}
          </Text>
          <View style={styles.footer}>
            <Text style={[styles.price, { color: theme.brand }]}>
              {formatAriary(product.price)}
            </Text>
            <Text style={[styles.rating, { color: theme.muted }]}>
              ⭐ {product.rating.toFixed(1)}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

export const ProductCard = memo(ProductCardBase);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  imageWrap: { position: 'relative', aspectRatio: 1, width: '100%' },
  image: { width: '100%', height: '100%' },
  favBtn: {
    position: 'absolute',
    top: spacing(2),
    right: spacing(2),
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favIcon: { fontSize: 16 },
  badge: {
    position: 'absolute',
    bottom: spacing(2),
    left: spacing(2),
    paddingHorizontal: spacing(2),
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  body: { padding: spacing(3), gap: 2 },
  name: { fontSize: 14, fontWeight: '700', minHeight: 36 },
  seller: { fontSize: 12 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing(1),
  },
  price: { fontSize: 15, fontWeight: '800' },
  rating: { fontSize: 12, fontWeight: '600' },
});
