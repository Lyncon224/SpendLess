import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Footer() {
  return (
    <LinearGradient
      colors={['#14393D', '#2F848F']}
      style={styles.footerContainer}
    >
      <Text style={styles.textoFooter}>Mais alguma dúvida?</Text>
      <Text style={styles.textoFooter}>Fale conosco:</Text>
      <Text style={styles.emailFooter}>spendless@gmail.com</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    flex: 1,
    maxHeight: '25%',
    justifyContent: 'space-evenly',
    padding: 8,
  },

  textoFooter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },

  emailFooter: {
    fontSize: 16,
    color: 'white',
  },
});
