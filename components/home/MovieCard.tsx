import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import type { Movie } from '@/components/home/types';
import { ThemedText } from '@/components/themed-text';
import { styles } from './MovieCard.styles';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  const posterUri =
    movie.poster_path != null ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : undefined;

  return (
    <Link href={{ pathname: '/movie/[id]', params: { id: String(movie.id) } }} asChild>
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        {posterUri ? (
          <Image source={{ uri: posterUri }} style={styles.poster} contentFit="cover" />
        ) : (
          <View style={[styles.poster, styles.posterPlaceholder]}>
            <ThemedText style={styles.posterPlaceholderText}>Sem imagem</ThemedText>
          </View>
        )}

        <View style={styles.cardInfo}>
          <ThemedText type="subtitle" numberOfLines={2} style={styles.cardTitle}>
            {movie.title}
          </ThemedText>
          <ThemedText numberOfLines={3} style={styles.cardOverview}>
            {movie.overview || 'Sem descrição disponível.'}
          </ThemedText>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

export default MovieCard;


