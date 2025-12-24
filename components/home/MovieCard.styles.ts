import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  poster: {
    width: 110,
    height: 165,
  },
  posterPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
  },
  posterPlaceholderText: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    padding: 8,
  },
  cardInfo: {
    flex: 1,
    padding: 14,
    gap: 8,
    justifyContent: 'center',
  },
  cardTitle: {
    marginBottom: 4,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardOverview: {
    fontSize: 13,
    lineHeight: 18,
    color: '#CCCCCC',
  },
});


