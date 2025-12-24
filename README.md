# 🎬 Cine App - Catálogo de Filmes

Aplicativo mobile desenvolvido em **React Native + TypeScript** com **Expo** que consome a API do TMDB (The Movie Database) para exibir um catálogo completo de filmes com busca, listagem infinita e detalhes.

## 📱 Funcionalidades

- ✅ **Listagem de filmes** com imagem, título e descrição
- ✅ **Scroll infinito** (paginação automática)
- ✅ **Tela de detalhes** ao clicar em um filme
- ✅ **Busca em tempo real** via API
- ✅ **Tratamento de erros** e estados de carregamento
- ✅ **Interface moderna** com tema escuro estilo cinema
- ✅ **Testes automatizados** (Jest + React Native Testing Library)
- ✅ **CI/CD** configurado com GitHub Actions

## 🚀 Como executar o projeto

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Expo CLI (instalado globalmente ou via npx)
- Conta no TMDB para obter API Key ([criar conta](https://www.themoviedb.org/signup))

### Passos para rodar

1. **Clone o repositório** (ou baixe o projeto)

   ```bash
   git clone <url-do-repositorio>
   cd cine_app
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure a API Key do TMDB**

   Crie um arquivo `.env` na raiz do projeto:

   ```bash
   EXPO_PUBLIC_TMDB_API_KEY=5509a4c4ef5ebd078aec8a342ea6ef59
   ```
   
4. **Inicie o servidor de desenvolvimento**

   ```bash
   npx expo start
   ```

5. **Execute no dispositivo/emulador**

   - **iOS Simulator**: Pressione `i` no terminal ou escaneie o QR code com a câmera
   - **Android Emulator**: Pressione `a` no terminal ou escaneie o QR code
   - **Expo Go**: Instale o app Expo Go no seu celular e escaneie o QR code
   - **Web**: Pressione `w` no terminal

## 📚 Bibliotecas utilizadas e justificativas

### Core

- **expo** (~54.0.30): Framework React Native que simplifica o desenvolvimento mobile, oferecendo ferramentas prontas e build simplificado
- **expo-router** (~6.0.21): Sistema de roteamento baseado em arquivos (file-based routing), similar ao Next.js, facilitando navegação e organização
- **react** (19.1.0) + **react-native** (0.81.5): Base do React Native para desenvolvimento mobile multiplataforma
- **typescript** (~5.9.2): Tipagem estática para maior segurança e produtividade no desenvolvimento

### UI/UX

- **expo-image** (~3.0.11): Componente de imagem otimizado do Expo com cache automático e lazy loading, melhorando performance
- **@react-navigation/native** + **@react-navigation/bottom-tabs**: Sistema de navegação robusto e performático
- **react-native-safe-area-context** (~5.6.0): Garante que o conteúdo não fique sobreposto por áreas do sistema (notch, status bar)

### Desenvolvimento

- **eslint** + **eslint-config-expo**: Linter para manter qualidade e consistência do código
- **jest**: Framework de testes para garantir qualidade e evitar regressões
- **@testing-library/react-native**: Biblioteca de testes focada em comportamento do usuário

## 🧪 Testes

O projeto inclui testes automatizados usando **Jest** e **React Native Testing Library**.

### Executar testes

```bash
npm test
```

### Executar testes em modo watch

```bash
npm test -- --watch
```

### Cobertura de testes

```bash
npm test -- --coverage
```

## 🔄 CI/CD

O projeto possui pipeline de CI/CD configurado com **GitHub Actions** que:

- Executa linting do código
- Roda testes automatizados
- Verifica build do projeto
- Gera relatório de cobertura

O workflow está configurado em `.github/workflows/ci.yml` e é executado automaticamente em cada push e pull request.

## 🏗️ Estrutura do projeto

```
cine_app/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Tela principal (listagem de filmes)
│   │   └── explore.tsx        # Tela de exploração
│   ├── movie/
│   │   └── [id].tsx           # Tela de detalhes do filme
│   └── _layout.tsx            # Layout raiz
├── components/                # Componentes reutilizáveis
├── constants/                 # Constantes e temas
├── hooks/                     # Custom hooks
├── services/                  # Serviços (APIs)
├── __tests__/                 # Testes automatizados
├── .github/
│   └── workflows/
│       └── ci.yml             # Pipeline CI/CD
├── .env                       # Variáveis de ambiente (não commitado)
└── package.json
```

## 🎨 Design e UX

O aplicativo foi desenvolvido com foco em:

- **Tema escuro** inspirado em apps de streaming (Netflix, Disney+)
- **Navegação intuitiva** com feedback visual
- **Estados de loading** claros e informativos
- **Tratamento de erros** com mensagens amigáveis e opção de retry
- **Performance otimizada** com lazy loading de imagens e paginação eficiente

## 🔮 Possíveis melhorias futuras

### Funcionalidades

- [ ] **Favoritos**: Salvar filmes favoritos localmente ou em backend próprio
- [ ] **Filtros avançados**: Filtrar por gênero, ano, nota, etc.
- [ ] **Trailers**: Integração com YouTube para exibir trailers
- [ ] **Avaliações**: Permitir que usuários avaliem filmes
- [ ] **Compartilhamento**: Compartilhar filmes via redes sociais
- [ ] **Modo offline**: Cache de filmes para visualização sem internet
- [ ] **Notificações**: Alertas sobre novos lançamentos

### Técnicas

- [ ] **Otimização de imagens**: Implementar diferentes tamanhos de imagem baseado na conexão
- [ ] **Animações**: Adicionar transições suaves entre telas
- [ ] **Acessibilidade**: Melhorar suporte a leitores de tela e navegação por teclado
- [ ] **Internacionalização**: Suporte a múltiplos idiomas
- [ ] **Testes E2E**: Adicionar testes end-to-end com Detox ou Maestro
- [ ] **Performance monitoring**: Integrar Sentry ou similar para monitoramento de erros
- [ ] **Deep linking**: Permitir compartilhamento de links diretos para filmes

### Arquitetura

- [ ] **State management**: Implementar Redux ou Zustand para estado global
- [ ] **API layer**: Criar camada de abstração para facilitar troca de APIs
- [ ] **Error boundary**: Implementar error boundaries para melhor tratamento de erros
- [ ] **Code splitting**: Otimizar bundle size com lazy loading de rotas

## 📝 Notas importantes

- A API do TMDB tem **rate limiting**. Em produção, considere implementar cache ou usar um backend próprio como proxy
- O arquivo `.env` não deve ser commitado no repositório (já está no `.gitignore`)
- Para builds de produção, configure as variáveis de ambiente no serviço de CI/CD ou no Expo
- **Firebase não incluído neste app**: o SDK web de Analytics não funciona em React Native/Expo Go. Para usar Firebase Analytics seria necessário usar o SDK nativo (`@react-native-firebase/analytics`) e builds customizadas (EAS ou nativas) com `google-services.json`/`GoogleService-Info.plist`. Mantive o app sem Firebase para rodar 100% no Expo Go.

## 👨‍💻 Desenvolvido por

Desenvolvido como parte de teste técnico para vaga de Desenvolvedor(a) Mobile React Native.

## 📄 Licença

Este projeto é privado e desenvolvido exclusivamente para fins de avaliação técnica.
