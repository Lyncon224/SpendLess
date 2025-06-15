import {View,Text,TouchableOpacity,StyleSheet} from 'react-native';
import { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Footer from '../components/footer';


export default function Ajuda({navigation}) {
  const [abrirPergunta, setAbrirPergunta] = useState([false, false, false]);

  function mostrarResposta(index) {
    setAbrirPergunta((perguntas) => {
      const mostraResposta = [...perguntas];
      mostraResposta[index] = !mostraResposta[index];
      return mostraResposta;
    });
  }
  
  return (
    <>
      <View style={styles.ajudaContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.returnButton}>
          <AntDesign name="arrowleft" size={30} color="#14393D" />
        </TouchableOpacity>

        <Text style={styles.faqTitulo}>Dúvidas frequentes</Text>

        <View style={[styles.perguntaEResposta, abrirPergunta[0] && styles.perguntaERespostaAberta]}>
        <TouchableOpacity style={[styles.pergunta, abrirPergunta[0] && styles.perguntaAberta]} onPress={() => mostrarResposta(0)}>
          <Text style={[styles.perguntaTexto, abrirPergunta[0] && styles.perguntaTextoAberta]}>Pra quê serve uma View?</Text>
          <MaterialIcons name='keyboard-arrow-down' size={20} color='black' />
        </TouchableOpacity>

        <Text
          style={[styles.respostaTexto, abrirPergunta[0] && styles.respostaTextoAberta]}>
          Uma View possui uma função equivalente a de uma div, mas que é usada
          em aplicativos desenvolvidos em react-native
        </Text>
        </View>

        <View style={[styles.perguntaEResposta, abrirPergunta[1] && styles.perguntaERespostaAberta]}>
          <TouchableOpacity
            style={[styles.pergunta, abrirPergunta[1] && styles.perguntaAberta]}
            onPress={() => mostrarResposta(1)}>
            <Text style={[styles.perguntaTexto, abrirPergunta[1] && styles.perguntaTextoAberta]}>Pra quê serve uma View?</Text>
            <MaterialIcons name='keyboard-arrow-down' size={20} color='black' />
          </TouchableOpacity>
        
        <Text
          style={[styles.respostaTexto, abrirPergunta[1] && styles.respostaTextoAberta]}>
          Uma View possui uma função equivalente a de uma div, mas que é usada
          em aplicativos desenvolvidos em react-native
        </Text>
        </View>

        <View style={[styles.perguntaEResposta, abrirPergunta[2] && styles.perguntaERespostaAberta]}>
          <TouchableOpacity
            style={[styles.pergunta, abrirPergunta[2] && styles.perguntaAberta]}
            onPress={() => mostrarResposta(2)}>
            <Text style={[styles.perguntaTexto, abrirPergunta[2] && styles.perguntaTextoAberta]}>Pra quê serve uma View?</Text>
            <MaterialIcons name='keyboard-arrow-down' size={20} color='black' />
          </TouchableOpacity>
        
        <Text
          style={[styles.respostaTexto, abrirPergunta[2] && styles.respostaTextoAberta]}>
          Uma View possui uma função equivalente a de uma div, mas que é usada
          em aplicativos desenvolvidos em react-native
        </Text>
        </View>
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  ajudaContainer: {
    flex: 1,
    padding: 8,
    backgroundColor: '#fff',
  },

  returnButton: {
    marginTop: 10,
    marginLeft: 10,
  },

  faqTitulo: {
    alignSelf: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 32,
    marginBottom: 32,
    color: '#14393D',
  },

  perguntaEResposta: {
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F4F4F4',
  },

  perguntaERespostaAberta: {
    borderWidth: 2,
    borderColor: '#D5DBDC',
  },

  pergunta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#D5DBDC',
    borderRadius: 8,
  },

  perguntaAberta: {
    marginBottom: 10,
    borderWidth: 0,
  },

  perguntaTexto: {
    fontSize: 16,
    color: '#14393D',
    flex: 1,
  },

  perguntaTextoAberta: {
    borderBottomWidth: 1,
    borderBottomColor: '#D5DBDC',
    paddingBottom: 4,
  },

  respostaTexto: {
    display: 'none',
  },

  respostaTextoAberta: {
    display: 'flex',
    opacity: 1,
    padding: 12,
    color: '#333',
    fontSize: 14,
  },
});





