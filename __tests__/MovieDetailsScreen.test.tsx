import { render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import MovieDetailsScreen from '../app/movie/[id]';

jest.mock('expo-router', () => ({
  Stack: {
    Screen: () => null,
  },
  useLocalSearchParams: () => ({ id: '123' }),
}));

jest.mock('expo-image', () => ({
  Image: ({ source, ...props }: any) => {
    const MockImage = require('react-native').Image;
    return <MockImage source={source} {...props} />;
  },
}));

global.fetch = jest.fn();

describe('MovieDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_TMDB_API_KEY = 'test-api-key';
  });

  it('deve exibir loading inicial', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {})
    );

    render(<MovieDetailsScreen />);

    expect(screen.getByText(/Carregando detalhes/i)).toBeTruthy();
  });

  it('deve exibir detalhes do filme após carregar', async () => {
    const mockMovie = {
      id: 123,
      title: 'Filme Teste',
      overview: 'Sinopse do filme teste',
      poster_path: '/poster.jpg',
      release_date: '2024-01-01',
      vote_average: 8.5,
      backdrop_path: '/backdrop.jpg',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovie,
    });

    render(<MovieDetailsScreen />);

    await waitFor(() => {
      expect(screen.getByText('Filme Teste')).toBeTruthy();
      expect(screen.getByText(/Sinopse do filme teste/i)).toBeTruthy();
      expect(screen.getByText(/8\.5/)).toBeTruthy();
    });
  });

  it('deve exibir mensagem de erro quando API falha', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(<MovieDetailsScreen />);

    await waitFor(() => {
      expect(screen.getByText(/Erro ao carregar detalhes/i)).toBeTruthy();
    });
  });

  it('deve exibir mensagem quando API key não está configurada', async () => {
    delete process.env.EXPO_PUBLIC_TMDB_API_KEY;

    render(<MovieDetailsScreen />);

    await waitFor(() => {
      expect(screen.getByText(/Chave da API TMDB não configurada/i)).toBeTruthy();
    });
  });

  it('deve formatar data de lançamento corretamente', async () => {
    const mockMovie = {
      id: 123,
      title: 'Filme Teste',
      overview: 'Sinopse',
      poster_path: '/poster.jpg',
      release_date: '2024-01-15',
      vote_average: 7.5,
      backdrop_path: null,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovie,
    });

    render(<MovieDetailsScreen />);

    await waitFor(() => {
      expect(screen.getByText(/15\/01\/2024/)).toBeTruthy();
    });
  });
});

