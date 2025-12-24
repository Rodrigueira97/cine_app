import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import MoviesScreen from '../app/(tabs)';

jest.mock('expo-router', () => ({
  Link: ({ children, href, ...props }: any) => {
    const MockLink = require('react-native').TouchableOpacity;
    return <MockLink {...props}>{children}</MockLink>;
  },
}));

jest.mock('expo-image', () => ({
  Image: ({ source, ...props }: any) => {
    const MockImage = require('react-native').Image;
    return <MockImage source={source} {...props} />;
  },
}));

global.fetch = jest.fn();

describe('MoviesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_TMDB_API_KEY = 'test-api-key';
  });

  it('deve exibir mensagem de erro quando API key não está configurada', async () => {
    delete process.env.EXPO_PUBLIC_TMDB_API_KEY;
    
    render(<MoviesScreen />);

    await waitFor(() => {
      expect(screen.getByText(/Chave da API TMDB não configurada/i)).toBeTruthy();
    });
  });

  it('deve exibir loading inicial', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {}) 
    );

    render(<MoviesScreen />);

    expect(screen.getByText(/Carregando filmes/i)).toBeTruthy();
  });

  it('deve exibir lista de filmes após carregar', async () => {
    const mockMovies = {
      page: 1,
      total_pages: 1,
      results: [
        {
          id: 1,
          title: 'Filme Teste',
          overview: 'Descrição do filme teste',
          poster_path: '/poster.jpg',
        },
        {
          id: 2,
          title: 'Outro Filme',
          overview: 'Outra descrição',
          poster_path: null,
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovies,
    });

    render(<MoviesScreen />);

    await waitFor(() => {
      expect(screen.getByText('Filme Teste')).toBeTruthy();
      expect(screen.getByText('Outro Filme')).toBeTruthy();
    });
  });

  it('deve exibir mensagem de erro quando API falha', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<MoviesScreen />);

    await waitFor(() => {
      expect(screen.getByText(/Erro ao buscar filmes/i)).toBeTruthy();
    });
  });

  it('deve permitir buscar filmes', async () => {
    const mockSearchResults = {
      page: 1,
      total_pages: 1,
      results: [
        {
          id: 3,
          title: 'Filme Buscado',
          overview: 'Descrição',
          poster_path: '/poster.jpg',
        },
      ],
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ page: 1, total_pages: 1, results: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSearchResults,
      });

    render(<MoviesScreen />);

    const searchInput = screen.getByPlaceholderText(/Buscar filmes/i);
    const searchButton = screen.getByText(/Buscar/i);

    fireEvent.changeText(searchInput, 'teste');
    fireEvent.press(searchButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/search/movie'),
      );
    });
  });

  it('deve exibir mensagem quando nenhum filme é encontrado', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        page: 1,
        total_pages: 1,
        results: [],
      }),
    });

    render(<MoviesScreen />);

    await waitFor(() => {
      expect(screen.getByText(/Nenhum filme encontrado/i)).toBeTruthy();
    });
  });
});

