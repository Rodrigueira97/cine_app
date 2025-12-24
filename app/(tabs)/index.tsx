import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { MovieCard } from '@/components/home/MovieCard';
import type { Movie } from '@/components/home/types';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type MoviesResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
};

const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export default function MoviesScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canLoadMore = totalPages == null || page < totalPages;

  const fetchMovies = useCallback(
    async (pageToLoad: number, options?: { replace?: boolean }) => {
      if (!TMDB_API_KEY) {
        setError(
          'Chave da API TMDB não configurada. Defina EXPO_PUBLIC_TMDB_API_KEY para continuar.',
        );
        return;
      }

      const isFirstPage = pageToLoad === 1;
      const isReplace = options?.replace ?? isFirstPage;

      if (isFirstPage && !isRefreshing) setIsLoading(true);
      if (!isFirstPage) setIsLoadingMore(true);
      setError(null);

      try {
        const endpoint =
          appliedQuery.trim().length > 0
            ? `${TMDB_BASE_URL}/search/movie?language=pt-BR&include_adult=false&query=${encodeURIComponent(
                appliedQuery,
              )}&page=${pageToLoad}&api_key=${TMDB_API_KEY}`
            : `${TMDB_BASE_URL}/movie/popular?language=pt-BR&page=${pageToLoad}&api_key=${TMDB_API_KEY}`;

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error('Erro ao buscar filmes. Tente novamente mais tarde.');
        }

        const data = (await response.json()) as MoviesResponse;

        setPage(data.page);
        setTotalPages(data.total_pages);
        setMovies((prev) => (isReplace ? data.results : [...prev, ...data.results]));

      } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : 'Erro inesperado. Tente novamente.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    [appliedQuery, isRefreshing],
  );

  useEffect(() => {
    fetchMovies(1, { replace: true });
  }, [fetchMovies, appliedQuery]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchMovies(1, { replace: true });
  };

  const handleLoadMore = () => {
    if (isLoading || isLoadingMore || !canLoadMore) return;
    fetchMovies(page + 1, { replace: false });
  };

  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (searchQuery.trim() === '') {
      setAppliedQuery('');
      return;
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setAppliedQuery(searchQuery.trim());
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const renderListFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator />
      </View>
    );
  };

  const hasResults = movies.length > 0;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.headerTitle}>
        Catálogo de Filmes
      </ThemedText>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar filmes..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="done"
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          {!error.toLowerCase().includes('tmdb') && (
            <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
              <ThemedText type="defaultSemiBold" style={styles.retryButtonText}>
                Tentar novamente
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      )}

      {isLoading && !hasResults ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.loadingText}>Carregando filmes...</ThemedText>
        </View>
      ) : !hasResults && !isLoading ? (
        <View style={styles.centerContent}>
          <ThemedText style={styles.emptyText}>Nenhum filme encontrado.</ThemedText>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <MovieCard movie={item} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderListFooter}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
    backgroundColor: '#0A0A0A',
  },
  headerTitle: {
    marginBottom: 20,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    width: '100%',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1A1A1A',
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  listContent: {
    paddingBottom: 20,
    gap: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  errorContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#2A1A1A',
    borderWidth: 1,
    borderColor: '#E50914',
  },
  errorText: {
    fontSize: 14,
    marginBottom: 10,
    color: '#FF6B6B',
  },
  retryButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#E50914',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  footerLoading: {
    paddingVertical: 20,
  },
});

