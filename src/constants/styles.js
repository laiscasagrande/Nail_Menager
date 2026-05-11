import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  brandTitle: {
    fontSize: 44,
    fontWeight: '700',
    color: '#D6336C',
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#9C1F54',
    textAlign: 'center',
    marginBottom: 18,
  },
  description: {
    color: '#6F4A6E',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  inputWrapper: {
    marginBottom: 14,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2B1B2E',
    borderWidth: 1,
    borderColor: '#ECD1E2',
  },
  primaryButton: {
    backgroundColor: '#E6398E',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E0B8CF',
  },
  googleButtonText: {
    color: '#5B2A4F',
    fontSize: 15,
    fontWeight: '600',
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E4C8D8',
  },
  orText: {
    marginHorizontal: 12,
    color: '#83627A',
    fontSize: 14,
  },
  footerLink: {
    color: '#D6336C',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  secondaryLinkText: {
    color: '#9C1F54',
    fontSize: 15,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8D7E7',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F8D7E7',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoIcon: {
    fontSize: 56,
    marginTop: 24,
    marginBottom: 12,
  },
});
