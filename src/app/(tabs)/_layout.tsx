import { Ionicons } from '@expo/vector-icons';
import { Tabs, type BottomTabBarProps } from 'expo-router/js-tabs';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Bounce, Text } from '@/components/ui';
import { colors, radius, shadow } from '@/lib/theme';
import { useStore } from '@/store/useStore';

type Icon = keyof typeof Ionicons.glyphMap;
const TABS: Record<string, { label: string; icon: Icon; active: Icon }> = {
  index: { label: 'الرئيسية', icon: 'home-outline', active: 'home' },
  orders: { label: 'طلباتي', icon: 'receipt-outline', active: 'receipt' },
  messages: { label: 'الرسائل', icon: 'chatbubble-ellipses-outline', active: 'chatbubble-ellipses' },
  impact: { label: 'أثرنا', icon: 'heart-outline', active: 'heart' },
  account: { label: 'حسابي', icon: 'person-outline', active: 'person' },
};

function TabItem({
  name,
  focused,
  onPress,
  badge,
}: {
  name: string;
  focused: boolean;
  onPress: () => void;
  badge?: number;
}) {
  const meta = TABS[name];
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: withSpring(focused ? -2 : 0, { damping: 14 }) },
      { scale: withSpring(focused ? 1.08 : 1, { damping: 14 }) },
    ],
  }));
  return (
    <Bounce onPress={onPress} style={styles.item} scaleTo={0.9} haptic={false}>
      <Animated.View style={[styles.iconWrap, focused && styles.iconWrapActive, style]}>
        <Ionicons name={focused ? meta.active : meta.icon} size={22} color={focused ? colors.white : colors.muted} />
        {!!badge && (
          <View style={styles.badge}>
            <Text weight="bold" size={10} color={colors.white} lineHeight={14}>
              {badge}
            </Text>
          </View>
        )}
      </Animated.View>
      <Text
        weight={focused ? 'bold' : 'medium'}
        size={11}
        color={focused ? colors.primary : colors.muted}
        lineHeight={16}>
        {meta.label}
      </Text>
    </Bounce>
  );
}

function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const activeOrders = useStore((s) => s.orders.filter((o) => !['picked', 'cancelled'].includes(o.status)).length);
  return (
    <View style={[styles.bar, shadow.float, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route, idx) => (
        <TabItem
          key={route.key}
          name={route.name}
          focused={state.index === idx}
          badge={route.name === 'orders' ? activeOrders : undefined}
          onPress={() => navigateToTab(route.key)}
        />
      ))}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}
      tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="messages" />
      <Tabs.Screen name="impact" />
      <Tabs.Screen name="account" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopStartRadius: radius.xl,
    borderTopEndRadius: radius.xl,
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  item: { flex: 1, alignItems: 'center', gap: 2 },
  iconWrap: { width: 44, height: 34, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  iconWrapActive: { backgroundColor: colors.primary },
  badge: {
    position: 'absolute',
    top: -4,
    end: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
});
