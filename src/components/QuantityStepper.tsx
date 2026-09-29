import { Pressable, Text, View, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { radius, useTheme } from '@/theme';

interface Props {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({ value, onChange, min = 1, max }: Props) {
  const { theme } = useTheme();

  const canDecrease = value > min;
  const canIncrease = max === undefined || value < max;

  const step = (delta: number) => {
    const next = value + delta;
    if (next < min) return;
    if (max !== undefined && next > max) return;
    Haptics.selectionAsync();
    onChange(next);
  };

  return (
    <View style={[styles.wrap, { borderColor: theme.border, backgroundColor: theme.card }]}>
      <Pressable
        accessibilityLabel="Diminuer la quantité"
        disabled={!canDecrease}
        onPress={() => step(-1)}
        style={styles.btn}
      >
        <Text style={[styles.sign, { color: canDecrease ? theme.text : theme.muted }]}>−</Text>
      </Pressable>
      <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
      <Pressable
        accessibilityLabel="Augmenter la quantité"
        disabled={!canIncrease}
        onPress={() => step(1)}
        style={styles.btn}
      >
        <Text style={[styles.sign, { color: canIncrease ? theme.text : theme.muted }]}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  btn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sign: { fontSize: 22, fontWeight: '700' },
  value: { minWidth: 32, textAlign: 'center', fontSize: 16, fontWeight: '700' },
});
