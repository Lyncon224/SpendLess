import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';


const TelaCadastro = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');

  

  return (
    <ImageBackground source={require('../assets/fundo-azul.jpg')} style={styles.fundo}>
    
    <View style={styles.container}>
    
    <TouchableOpacity onPress={() => navigation.navigate('Inicio')} style={styles.seta}>
        <Icon name="arrowleft" size={30} color="white" />
      </TouchableOpacity>

    <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain"/>

    <View style={styles.conteudo}>
        <Text style={styles.titulo}> Cadastro </Text>

        <TextInput style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}/>

        <TextInput style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"/>

        <TextInput style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry />
        
        <TextInput style={styles.input}
          placeholder="Confirme a senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry />

        <TouchableOpacity style={styles.botao} onPress={()=> navigation.navigate('App')}>
          <Text style={styles.textoBotao} >Entrar</Text>
        </TouchableOpacity>

      <Text style={styles.textoBotao}>Ou</Text>

      <TouchableOpacity style={styles.botao2}>
          <Text style={styles.textoBotao2}>Continue com o Google</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.link2} onPress={() => navigation.navigate('Entrar')}>Já tem uma conta? Faça o login</Text>
        </TouchableOpacity>
      
    </View>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    
    },
    conteudo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    bottom: -50
  },
     titulo: {
      fontSize: 28,
      marginBottom: 20,
      textAlign: 'center',
      color: '#fff',
      fontWeight: 'bold',
    },
    input: {
      height: 50,
      borderColor: '#fff',
      borderWidth: 1,
      borderRadius: 50,
      marginBottom: 15,
      paddingHorizontal: 15,
      backgroundColor: '#fff',
      color: '#000',
      width: 270
    },
    seta: {
    position: 'absolute',
    top: 10,
    left: -5,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    },
   botao: {
     backgroundColor: 'transparent',
      padding: 15,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
      width: 250,
      borderWidth: 2,
      borderColor: 'white'
    },
    botao2: {
      backgroundColor: '#CAEAE9',
      padding: 15,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
      width: 250,
      height: 55,
      marginTop: 10
    },
    textoBotao: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    textoBotao2: {
      color: '#000',
      fontSize: 17,
      fontWeight: 'bold',

    },
    link: {
      textAlign: 'center',
      color: '#fff',
      marginBottom: 15,
      top: -5
    },
    link2: {
      textAlign: 'center',
      color: '#fff',
      marginBottom: 15,
     marginTop: 40, 
     fontSize: 14
    },
    fundo:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: "100%",
    width: "100%",
  },
  logo:{
    width: 80,
    height:80,
    paddingHorizontal: 60,
    left: 110,
    position: 'absolute',
    top: 30,
    alignSelf: 'center'
  }
  });

  export default TelaCadastro;