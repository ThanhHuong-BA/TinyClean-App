import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomePlaceholder } from './src/screens/HomePlaceholder';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import type { OnboardingResult } from './src/onboarding';

export default function App() {
  const [result, setResult] = useState<OnboardingResult | null>(null);

  return (
    <SafeAreaProvider>
      {result ? (
        <HomePlaceholder result={result} onBack={() => setResult(null)} />
      ) : (
        <WelcomeScreen onStart={setResult} />
      )}
    </SafeAreaProvider>
  );
}
