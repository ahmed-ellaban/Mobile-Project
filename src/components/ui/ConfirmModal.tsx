import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { colors, radius, shadow } from '@/lib/theme';

import { Button } from './Button';
import { Text } from './Text';

type Props = {
  visible: boolean;
  emoji?: string;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/** نافذة تأكيد صغيرة تعمل على الموبايل والويب. */
export function ConfirmModal({
  visible,
  emoji = '🤔',
  title,
  body,
  confirmLabel,
  cancelLabel = 'لا، خليني',
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onCancel}>
      <Animated.View entering={FadeIn.duration(150)} style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
        <Animated.View entering={ZoomIn.springify().damping(16)} style={[styles.sheet, shadow.float]}>
          <Text size={40} lineHeight={52} center>
            {emoji}
          </Text>
          <Text weight="black" size={18} center>
            {title}
          </Text>
          <Text size={14} color={colors.muted} center>
            {body}
          </Text>
          <View style={styles.actions}>
            <Button title={cancelLabel} variant="secondary" onPress={onCancel} style={{ flex: 1 }} />
            <Button title={confirmLabel} onPress={onConfirm} style={{ flex: 1 }} />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: 24 },
  sheet: { width: '100%', maxWidth: 380, backgroundColor: colors.card, borderRadius: radius.xl, padding: 22, gap: 8 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 10 },
});
