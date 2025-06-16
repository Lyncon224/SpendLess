import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet
} from 'react-native';
import { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';


export default function TelaPerfil({ navigation }) {
  const [dataPhoto, setDataPhoto] = useState('');
  const [dataName, setDataName] = useState('Claudia');
  const [dataEmail, setDataEmail] = useState('claudia@gmail.com');
  const [dataPassword, setDataPassword] = useState('senha');
  const [newName, setNewName] = useState('');
  const [modalRenomearVisible, setModalRenomearVisible] = useState(false);

  function abrirModalRenomear() {
    setNewName(dataName);
    setModalRenomearVisible(true);
  }

  function ConfirmacaoRenomear() {
    if (newName.trim() !== '') {
      setDataName(newName);
    }
    setModalRenomearVisible(false);
  }

  return (
    <>
      <View style={styles.topCircle} />
      <View style={styles.containerPerfil}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.returnButton}>
          <AntDesign name="arrowleft" size={30} color="white" />
        </TouchableOpacity>

        <View style={styles.user}>
          <Image style={styles.userPhoto} source={require('../assets/perfil-foto.png')} />
          <View style={styles.userNameRow}>
            <Text style={styles.userName}>{dataName}</Text>
            <TouchableOpacity onPress={abrirModalRenomear}>
              <Feather name="edit" size={25} color="#14393D" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.userInformations}>
          <View style={styles.informationsLine}>
            <Feather name="mail" size={30} color="black" />
            <Text style={styles.informationText}>{dataEmail}</Text>
          </View>
          <View style={styles.informationsLine}>
            <Feather name="lock" size={30} color="black" />
            <Text style={styles.informationText}>{dataPassword}</Text>
          </View>
          <View style={styles.informationsLine}>
            <AntDesign name="questioncircleo" size={30} color="black" />
            <TouchableOpacity onPress={() => navigation.navigate('Ajuda')} style={styles.helpButton}>
              <Text style={styles.informationText}>Ajuda?</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Inicio')} style={styles.exitButton}>
          <Text style={styles.textExitButton}>SAIR DA CONTA</Text>
        </TouchableOpacity>

        
     <Modal animationType="none" transparent={true} visible={modalRenomearVisible}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.modalContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.tituloModal}>Alterar nome</Text>
            <AntDesign
              name="close"
              color="black"
              size={20}
              onPress={() => setModalRenomearVisible(false)}
              style={styles.botaoFecharModal}
            />
          </View>

          <Text style={styles.modalText}>Novo nome:</Text>
          <TextInput
            style={styles.input}
            value={newName}
            onChangeText={setNewName}
            placeholder="Digite o novo nome"
          />

          <TouchableOpacity style={styles.addButton} onPress={ConfirmacaoRenomear}>
            <Text style={styles.textoAddButton}>Confirmar alteração</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  </TouchableWithoutFeedback>
</Modal>
      </View>


    </>
  );
}

const styles = StyleSheet.create({
  containerPerfil: {
    flex: 1,
    padding: 16,
  },
  topCircle: {
    position: 'absolute',
    height: 400,
    width: '100%',
    top: -200,
    alignSelf: 'center',
    backgroundColor: '#2F848F',
    zIndex: -1,
  },
  returnButton: {
    marginTop: 20,
    marginLeft: 10,
  },
  user: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userPhoto: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginTop: 12
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#14393D',
  },
  userInformations: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  informationsLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  informationText: {
    marginLeft: 15,
    fontSize: 16,
  },
  helpButton: {
    marginTop: 3,
  },
  exitButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginTop: 40,
    backgroundColor: '#2F848F',
  },
  textExitButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)',
},

modalContent: {
  width: '90%', // Garante que não passe da tela
  maxWidth: 350,
  padding: 20,
  backgroundColor: 'white',
  borderRadius: 10,
  elevation: 5, // Android
  shadowColor: '#000', // iOS
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
},

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tituloModal: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  botaoFecharModal: {
    padding: 4,
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    marginBottom: 15,
  },
  addButton: {
    alignSelf: 'center',
    borderRadius: 50,
    backgroundColor: '#2F848F',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  textoAddButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  keyboardView: {
  flex: 1,
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
},

});
