import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Linking, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLicense } from '@/contexts/LicenseContext';

export default function LicenseGate() {
  const insets = useSafeAreaInsets();
  const { submitLicense } = useLicense();
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<boolean>(false);

  const handleSubmit = async () => {
    setBusy(true); setError(null);
    const res = await submitLicense(email, code);
    if (!res.ok) setError(res.message ?? 'Invalid license');
    setBusy(false);
  };

  const handleContact = () => {
    const mailto = `mailto:licensing@axiom-app.example?subject=AXIOM%20License%20Request&body=Please%20send%20me%20a%20license.%20My%20email:%20${encodeURIComponent(email)}`;
    Linking.openURL(mailto).catch(() => {});
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 40, paddingBottom: Math.max(24, insets.bottom + 12) }]}
      testID="license-gate">
      <Text style={styles.title}>Enter License</Text>
      <Text style={styles.subtitle}>Settings are locked until you enter a valid license.</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        placeholderTextColor="#9CA3AF"
        autoCapitalize="none"
        keyboardType="email-address"
        testID="license-email"
      />

      <Text style={[styles.label, { marginTop: 12 }]}>License Code</Text>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={(t) => setCode(t.toUpperCase())}
        placeholder="AXIOM-XXXXXX-XXXXXX"
        placeholderTextColor="#9CA3AF"
        autoCapitalize="characters"
        autoCorrect={false}
        testID="license-code"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        disabled={busy}
        style={[styles.button, styles.primaryBtn, busy && { opacity: 0.6 }]}
        onPress={handleSubmit}
        testID="license-submit"
      >
        <Text style={styles.buttonText}>{busy ? 'Checking…' : 'Unlock Settings'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryBtn]} onPress={handleContact} testID="license-contact">
        <Text style={[styles.buttonText, { color: '#111' }]}>Request a License</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>Tip: Use AXIOM-ADMIN-2025 for admin override while testing.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', paddingHorizontal: 24 },
  title: { fontSize: 22, fontWeight: '800', color: '#111' },
  subtitle: { marginTop: 6, color: '#6B7280', fontSize: 14 },
  label: { marginTop: 16, fontSize: 12, color: '#6B7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  input: { marginTop: 8, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, color: '#111' },
  button: { marginTop: 16, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  primaryBtn: { backgroundColor: '#007AFF' },
  secondaryBtn: { backgroundColor: '#EDEDED' },
  buttonText: { color: '#fff', fontWeight: '700' },
  error: { marginTop: 8, color: '#EF4444', fontWeight: '600' },
  hint: { marginTop: 18, color: '#9CA3AF', fontSize: 12 },
});