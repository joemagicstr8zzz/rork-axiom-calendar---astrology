import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { parseCardInput, cardToWeekRange, weekNumberToRange } from '@/utils/mapping';
import { ZODIAC_SIGNS } from '@/constants/zodiac';

export default function SearchScreen() {
  const router = useRouter();
  const { currentStack, settings } = useApp();
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);

  const handleSearch = () => {
    if (!query.trim()) {
      setResult('Enter a search term');
      return;
    }

    const trimmed = query.trim().toUpperCase();
    
    const signMatch = ZODIAC_SIGNS.find(
      s => s.name.toUpperCase() === trimmed
    );
    if (signMatch) {
      setResult(`Found: ${signMatch.name} (${signMatch.dateRange})`);
      router.push(`/sign?signName=${signMatch.name}` as any);
      return;
    }

    const parsed = parseCardInput(trimmed);
    if (parsed && currentStack.length > 0) {
      if (parsed.suit === '' && parsed.value) {
        const weekNumber = parseInt(parsed.value, 10);
        const range = weekNumberToRange(new Date().getFullYear(), weekNumber, settings.weekStandard, settings.weekStartDay);
        setResult(`Week ${weekNumber}: ${range.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${range.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
        router.push(`/day?year=${range.start.getFullYear()}&month=${range.start.getMonth()}&day=${range.start.getDate()}` as any);
        return;
      }
      const matchedCard = currentStack.find(
        c => c.label === parsed.label || (c.value === parsed.value && c.suit === parsed.suit)
      );

      if (matchedCard) {
        const { week, start, end } = cardToWeekRange(
          matchedCard,
          new Date().getFullYear(),
          settings.weekStandard,
          settings.weekStartDay
        );
        setResult(
          `${matchedCard.label} → Week ${week}: ${start.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })} – ${end.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}`
        );
        router.push(
          `/day?year=${start.getFullYear()}&month=${start.getMonth()}&day=${start.getDate()}` as any
        );
        return;
      }
    }

    const multiCardMatch = trimmed.match(/^([2-9]|10|J|Q|K|A)([CDHS])\s+([2-9]|10|J|Q|K|A)([CDHS])(\s+([2-9]|10|J|Q|K|A)([CDHS]))?$/);
    if (multiCardMatch) {
      const cards: any[] = [];
      const card1 = parseCardInput(multiCardMatch[1] + multiCardMatch[2]);
      const card2 = parseCardInput(multiCardMatch[3] + multiCardMatch[4]);
      if (card1) cards.push(card1);
      if (card2) cards.push(card2);
      if (multiCardMatch[6] && multiCardMatch[7]) {
        const card3 = parseCardInput(multiCardMatch[6] + multiCardMatch[7]);
        if (card3) cards.push(card3);
      }

      if (cards.length >= 2) {
        const matched = cards.map(c =>
          currentStack.find(sc => sc.label === c.label || (sc.value === c.value && sc.suit === c.suit))
        ).filter(Boolean) as any[];

        if (matched.length >= 2) {
          const weekPositions = matched.map(c => Math.min(c.position, 52));
          const midWeek = weekPositions[Math.floor(weekPositions.length / 2)];
          const range = weekNumberToRange(new Date().getFullYear(), midWeek, settings.weekStandard, settings.weekStartDay);
          setResult(
            `Cards lead to Week ${midWeek}: ${range.start.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })} – ${range.end.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}`
          );
          router.push(
            `/day?year=${range.start.getFullYear()}&month=${range.start.getMonth()}&day=${range.start.getDate()}` as any
          );
          return;
        }
      }
    }

    setResult('No results found. Try a sign, a card (e.g., "4H"), or a week (e.g., "#41")');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Search',
          headerStyle: { backgroundColor: '#FAFAFA' },
          headerShadowVisible: false,
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <SearchIcon size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Search dates, signs, or cards..."
              placeholderTextColor="#999"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoCapitalize="characters"
              autoCorrect={false}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
                <X size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        )}

        <View style={styles.hintCard}>
          <Text style={styles.hintTitle}>Search Examples</Text>
          <Text style={styles.hintText}>• Zodiac signs: &ldquo;Aries&rdquo;, &ldquo;Gemini&rdquo;</Text>
          <Text style={styles.hintText}>• Single card: &ldquo;4H&rdquo;, &ldquo;JS&rdquo;, &ldquo;QD&rdquo;</Text>
          <Text style={styles.hintText}>• Weeks: &ldquo;#41&rdquo; to jump to Week 41</Text>
          <Text style={styles.hintText}>• Multiple cards: &ldquo;4H JS&rdquo; or &ldquo;4H JS QD&rdquo;</Text>
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
  searchContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    letterSpacing: 0.3,
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  resultCard: {
    marginHorizontal: 24,
    padding: 20,
    backgroundColor: '#E8F5FF',
    borderRadius: 16,
    marginBottom: 16,
  },
  resultText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  hintCard: {
    marginHorizontal: 24,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  hintTitle: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  hintText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
});
