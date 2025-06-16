import React from "react";
import { View, TextInput, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from "react-native";

function Inicio({navigation}) {
  return (
    <View style={styles.container}>
    <ImageBackground source={require('../assets/fundo-azul.jpg')} style={styles.fundo}>

  <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain"/>

    <Text style={styles.texto}> Bem-vindo ao SpendLess </Text>
    
          <Text>  </Text>
    <TouchableOpacity style={styles.botao}  onPress={()=> navigation.navigate('Entrar')}>
          <Text style={styles.textoBotao}>Já tenho uma conta</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.botao2}  onPress={()=> navigation.navigate('Cadastro')}>
          <Text style={styles.textoBotao2}>Criar uma conta</Text>
        </TouchableOpacity>

</ImageBackground>
  </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#F5F5F5',
  },
  texto: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
    textAlign: 'center',
    bottom: -80
  },
  botao: { 
  backgroundColor: 'transparent',
  padding: 15,
  borderRadius: 50,
  alignItems: 'center',
  marginBottom: 10,
  width: 250,
  bottom: -170,
  borderWidth: 2,
  borderColor: 'white'
},
 botao2: {
      backgroundColor: '#CAEAE9',
      padding: 15,
      borderRadius: 50,
      alignItems: 'center',
      marginBottom: 10,
      bottom: -200,
      width: 250,
    },
textoBotao: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
    },
  textoBotao2: {
      color: '#000',
      fontSize: 18,
      fontWeight: 'bold'
    },
  fundo:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: "100%",
    width: "100%",
  },
  logo:{
    width: 250,
    height:250,
    left:50,
    position: 'absolute',
    top: 20,
    alignSelf: 'center',

  }
})

export default Inicio;