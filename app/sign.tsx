import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { zodiacToCard } from '@/utils/mapping';
import { ZODIAC_SIGNS } from '@/constants/zodiac';

export default function SignDetailScreen() {
  const { signName } = useLocalSearchParams<{ signName: string }>();
  const { currentStack, settings, showPeek, peekOverlay } = useApp();

  const sign = ZODIAC_SIGNS.find(s => s.name === signName);
  if (!sign) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Sign Not Found' }} />
        <Text style={styles.errorText}>Sign not found</Text>
      </View>
    );
  }

  const card = zodiacToCard(sign.name, currentStack, settings.seed);

  const handleTwoFingerTap = () => {
    if (card) {
      showPeek(card);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: sign.name,
          headerStyle: { backgroundColor: '#FAFAFA' },
          headerShadowVisible: false,
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleTwoFingerTap}
        >
          <View style={styles.header}>
            <Text style={styles.symbol}>{sign.symbol}</Text>
            <Text style={styles.signName}>{sign.name}</Text>
            <Text style={styles.dateRange}>{sign.dateRange}</Text>
            <View style={styles.elementBadge}>
              <Text style={styles.elementText}>{sign.element}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.traitsCard}>
          <Text style={styles.cardTitle}>Traits</Text>
          <Text style={styles.cardText}>{sign.traits}</Text>
        </View>

        <View style={styles.readingCard}>
          <Text style={styles.cardTitle}>Current Reading</Text>
          <Text style={styles.cardText}>{sign.reading}</Text>
        </View>

        <View style={styles.focusCard}>
          <Text style={styles.focusLabel}>Focus Word</Text>
          <Text style={styles.focusWord}>{sign.focusWord}</Text>
        </View>

        {settings.rehearsalMode && card && (
          <View style={styles.rehearsalCard}>
            <Text style={styles.rehearsalLabel}>Rehearsal Mode</Text>
            <Text style={styles.rehearsalValue}>
              Position #{card.position} → {card.label}
            </Text>
          </View>
        )}
      </ScrollView>

      {peekOverlay.visible && peekOverlay.card && (
        <View style={styles.peekOverlay}>
          <View style={styles.peekCard}>
            <Text style={styles.peekText}>
              #{peekOverlay.card.position} → {peekOverlay.card.label}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  symbol: {
    fontSize: 80,
    marginBottom: 16,
  },
  signName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  dateRange: {
    fontSize: 16,
    color: '#666',
    letterSpacing: 0.3,
    marginBottom: 16,
  },
  elementBadge: {
    backgroundColor: '#E8F5FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  elementText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  traitsCard: {
    marginHorizontal: 24,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  readingCard: {
    marginHorizontal: 24,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  focusCard: {
    marginHorizontal: 24,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  focusLabel: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  focusWord: {
    fontSize: 20,
    color: '#111',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  rehearsalCard: {
    marginHorizontal: 24,
    padding: 20,
    backgroundColor: '#FFF3CD',
    borderRadius: 16,
    marginBottom: 32,
  },
  rehearsalLabel: {
    fontSize: 12,
    color: '#856404',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rehearsalValue: {
    fontSize: 16,
    color: '#856404',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  peekOverlay: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  peekCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  peekText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
