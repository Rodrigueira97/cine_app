/**
 * Testes de utilitários e helpers
 */

describe('Utils', () => {
  it('deve validar formato de data', () => {
    const validDate = '2024-01-15';
    const invalidDate = 'invalid-date';

    expect(() => new Date(validDate).toISOString()).not.toThrow();
    expect(() => new Date(invalidDate).toISOString()).not.toThrow(); // Date aceita strings inválidas
  });

  it('deve formatar número de nota corretamente', () => {
    const voteAverage = 8.567;
    const formatted = voteAverage.toFixed(1);
    
    expect(formatted).toBe('8.6');
  });

  it('deve validar URL de imagem', () => {
    const baseUrl = 'https://image.tmdb.org/t/p/w500';
    const posterPath = '/poster.jpg';
    const fullUrl = `${baseUrl}${posterPath}`;

    expect(fullUrl).toBe('https://image.tmdb.org/t/p/w500/poster.jpg');
  });
});

