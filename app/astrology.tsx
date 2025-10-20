import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ZODIAC_SIGNS } from '@/constants/zodiac';

export default function AstrologyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Astrology',
          headerStyle: { backgroundColor: '#FAFAFA' },
          headerShadowVisible: false,
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Zodiac Signs</Text>
          <Text style={styles.subtitle}>
            Explore the twelve signs and their cosmic influence
          </Text>
        </View>

        <View style={styles.grid}>
          {ZODIAC_SIGNS.map((sign) => (
            <TouchableOpacity
              key={sign.name}
              style={styles.signCard}
              onPress={() =>
                router.push(`/sign?signName=${sign.name}` as any)
              }
            >
              <Text style={styles.signSymbol}>{sign.symbol}</Text>
              <Text style={styles.signName}>{sign.name}</Text>
              <Text style={styles.signDates}>{sign.dateRange}</Text>
              <Text style={styles.signElement}>{sign.element}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    letterSpacing: 0.3,
  },
  grid: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  signCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  signSymbol: {
    fontSize: 36,
    marginBottom: 8,
  },
  signName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  signDates: {
    fontSize: 14,
    color: '#666',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  signElement: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
