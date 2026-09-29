import { Tabs } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { selectCartCount, useCart } from '@/store/useCart';
import { selectFavoritesCount, useFavorites } from '@/store/useFavorites';
import { radius, useTheme } from '@/theme';

function Icon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>;
}

function BadgeIcon({ emoji, focused, count }: { emoji: string; focused: boolean; count: number }) {
  const { theme } = useTheme();
  return (
    <View>
      <Icon emoji={emoji} focused={focused} />
      {count > 0 && (
        <View style={[styles.badge, { backgroundColor: theme.danger }]}>
          <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabsLayout() {
  const { theme } = useTheme();
  const cartCount = useCart(selectCartCount);
  const favCount = useFavorites(selectFavoritesCount);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.brand,
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Boutique', tabBarIcon: ({ focused }) => <Icon emoji="🛍️" focused={focused} /> }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoris',
          tabBarIcon: ({ focused }) => <BadgeIcon emoji="❤️" focused={focused} count={favCount} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Panier',
          tabBarIcon: ({ focused }) => <BadgeIcon emoji="🛒" focused={focused} count={cartCount} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
});
