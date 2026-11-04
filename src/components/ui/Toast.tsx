import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { create } from 'zustand';

import { colors, radius, shadow } from '@/lib/theme';

import { Text } from './Text';

type ToastState = {
  message: string | null;
  kind: 'success' | 'info' | 'error';
  show: (message: string, kind?: ToastState['kind']) => void;
  hide: () => void;
};

export const useToast = create<ToastState>((set) => ({
  message: null,
  kind: 'info',
  show: (message, kind = 'info') => set({ message, kind }),
  hide: () => set({ message: null }),
}));

export const toast = (message: string, kind?: ToastState['kind']) => useToast.getState().show(message, kind);

/** رسالة عائمة من أعلى الشاشة تختفي تلقائياً. */
export function ToastHost() {
  const { message, kind, hide } = useToast();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(hide, 2600);
    return () => clearTimeout(t);
  }, [message, hide]);

  if (!message) return null;
  const icon = kind === 'success' ? 'checkmark-circle' : kind === 'error' ? 'alert-circle' : 'information-circle';
  const bg = kind === 'success' ? colors.green : kind === 'error' ? colors.danger : colors.text;

  return (
    <Animated.View
      entering={FadeInUp.springify().damping(16)}
      exiting={FadeOutUp.duration(200)}
      pointerEvents="none"
      style={[styles.toast, shadow.float, { top: insets.top + 10, backgroundColor: bg }]}>
      <Ionicons name={icon} size={20} color={colors.white} />
      <Text weight="semibold" size={14} color={colors.white} style={{ flex: 1 }}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    start: 16,
    end: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radius.md,
    zIndex: 100,
  },
});
