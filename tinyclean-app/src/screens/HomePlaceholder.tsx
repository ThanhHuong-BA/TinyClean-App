import { StyleSheet, Text, View } from 'react-native';
import { GradientButton } from '../components/GradientButton';
import { colors } from '../theme';
import type { OnboardingResult } from '../onboarding';

type Props = { result: OnboardingResult; onBack: () => void };

/** Stand-in for Homepage.html until the real home screen is built. */
export function HomePlaceholder({ result, onBack }: Props) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Trang chủ</Text>
      <Text style={styles.body}>
        {result.mode === 'demo'
          ? 'Đang dùng dữ liệu mẫu (demo=1)'
          : 'Tiệm mới, dữ liệu trống (onboard=1)'}
      </Text>
      <Text style={styles.body}>Giai đoạn tiệm (bước 1): lựa chọn #{result.stage + 1}</Text>
      <View style={styles.btn}>
        <GradientButton label="Quay lại màn chào mừng" onPress={onBack} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  body: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  btn: { alignSelf: 'stretch', marginTop: 24 },
});
