import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
};

const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!TMDB_API_KEY) {
        setError(
          'Chave da API TMDB não configurada. Defina EXPO_PUBLIC_TMDB_API_KEY para continuar.',
        );
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${TMDB_BASE_URL}/movie/${id}?language=pt-BR&api_key=${TMDB_API_KEY}`,
        );

        if (!response.ok) {
          throw new Error('Erro ao carregar detalhes do filme.');
        }

        const data = (await response.json()) as MovieDetails;
        setMovie(data);
      } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : 'Erro inesperado. Tente novamente.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  const posterUri =
    movie?.poster_path != null ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : undefined;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
      options={{ 
        title: movie?.title ?? 'Detalhes do filme',
        headerBackTitle: 'Voltar',
       }} 
       />

      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.loadingText}>Carregando detalhes...</ThemedText>
        </View>
      ) : error ? (
        <View style={styles.centerContent}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      ) : !movie ? (
        <View style={styles.centerContent}>
          <ThemedText style={styles.errorText}>Filme não encontrado.</ThemedText>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {posterUri && (
            <Image source={{ uri: posterUri }} style={styles.poster} contentFit="cover" />
          )}

          <View style={styles.infoContainer}>
            <ThemedText type="title" style={styles.title}>
              {movie.title}
            </ThemedText>

            <View style={styles.metaRow}>
              <ThemedText type="defaultSemiBold" style={{ color: '#FFFFFF', fontSize: 16 }}>
                Lançamento:{' '}
                <ThemedText style={{ color: '#CCCCCC', fontWeight: 'normal' }}>
                  {movie.release_date
                    ? new Date(movie.release_date).toLocaleDateString('pt-BR')
                    : 'Indisponível'}
                </ThemedText>
              </ThemedText>
            </View>

            <View style={styles.metaRow}>
              <ThemedText type="defaultSemiBold" style={{ color: '#FFFFFF', fontSize: 16 }}>
                Nota média:{' '}
                <ThemedText style={{ color: '#FFD700', fontWeight: 'bold' }}>
                  {movie.vote_average.toFixed(1)}/10
                </ThemedText>
              </ThemedText>
            </View>

            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Sinopse
            </ThemedText>
            <ThemedText style={styles.overview}>
              {movie.overview || 'Nenhuma sinopse disponível para este filme.'}
            </ThemedText>
          </View>
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
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
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  poster: {
    width: '100%',
    aspectRatio: 2 / 3,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 12,
    backgroundColor: '#0A0A0A',
  },
  title: {
    marginBottom: 12,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  metaRow: {
    marginBottom: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    color: '#CCCCCC',
  },
});


