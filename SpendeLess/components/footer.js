import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function Footer() {
  return (
    <>
    <View style={styles.footerContainer}>
    <Text style={styles.textoFooter}>Mais alguma dúvida?</Text>
    
    <Text  style={styles.textoFooter}>Fale conosco:</Text>

    <Text  style={styles.emailFooter}>spendless@gmail.com</Text>
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  footerContainer: {
    flex: 1,
    maxHeight: '25%',
    justifyContent: 'space-evenly',
    padding: '0.5rem',
    bottom: 0,
    backgroundImage: 'linear-gradient(to bottom,#14393D, #2F848F)'
  },

  textoFooter: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: 'white'
  },

  emailFooter: {
    fontSize: '1rem',
    color: 'white'
  }
})