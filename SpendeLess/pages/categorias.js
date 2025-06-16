//importações
import 'react-native-gesture-handler'; 
import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ColorPicker, { Panel1, Preview, HueSlider } from 'reanimated-color-picker';
import { db } from '../firebase'; 
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';


const TelaCategorias = () => {

//Defini estados

   
  const [modalVisibleAdd, setModalVisibleAdd] = useState(false);
  const [modalVisibleEdit, setModalVisibleEdit] = useState(false);
  const [modalVisibleDel, setModalVisibleDel] = useState(false);
  const [modalVisibleCor, setModalVisibleCor] = useState(false);
  
  const [categorias, setCategorias] = useState([]); 

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categorias"), (snapshot) => {
      const categoriasDados = snapshot.docs.map(doc => ({
        id: doc.id, 
        ...doc.data() 
        }));
      setCategorias(categoriasDados); 
    
    });
        return () => unsubscribe();
    }, []); 


  const [nomeCategoria, setNomeCategoria] = useState('');
  const [corCategoria, setCorCategoria] = useState('#2F848F'); 

  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

  //Função escolher cor
  const onSelectCor = ({ hex }) => {
    setCorCategoria(hex);
  };

   // Função de adicionar Categoria
const handleAdicionarCategoria = async () => { 
  if (nomeCategoria.trim() === '') {
    return; 
  }
    
  try {
    await addDoc(collection(db, "categorias"), {
      nome: nomeCategoria,
      cor: corCategoria
      
    });
    } catch (error) {
        console.error("Erro ao adicionar categoria: ", error);
    }
    
    setModalVisibleAdd(false);
    setNomeCategoria('');
    setCorCategoria('#2F848F');
};

  //abre para editar com os dados da categoria selecionada
  const abrirModalEdicao = (categoria) => {
    setCategoriaSelecionada(categoria); 
    setNomeCategoria(categoria.nome); 
    setCorCategoria(categoria.cor);   
    setModalVisibleEdit(true);         
  };

  const handleEditarCategoria = async () => { 
    if (nomeCategoria.trim() === '' || !categoriaSelecionada) {
      return;
    }

    const categoriaDocRef = doc(db, 'categorias', categoriaSelecionada.id);

    try {
      await updateDoc(categoriaDocRef, {
        nome: nomeCategoria,
        cor: corCategoria
       
      });
    } catch (error) {
        console.error("Erro ao editar categoria: ", error);
    }

    setModalVisibleEdit(false);
    setNomeCategoria('');
    setCorCategoria('#2F848F');
    setCategoriaSelecionada(null);
};

  const abrirModalDeletar = (categoria) => {
    setCategoriaSelecionada(categoria);
    setModalVisibleDel(true);
  };

  const handleDeletarCategoria = async () => { 
    if (!categoriaSelecionada) return;

    try {
      await deleteDoc(doc(db, 'categorias', categoriaSelecionada.id));
    } catch (error) {
        console.error("Erro ao deletar categoria: ", error);
    }
    
    setModalVisibleDel(false);
    setCategoriaSelecionada(null);
};

  return (

  <View style={styles.container}>
    
     {/* Botão de adiconar categoria*/}
    <TouchableOpacity style={styles.novaCategoria} onPress={() => { setModalVisibleAdd(true); }}>
      <Ionicons name="add" size={20} color="#14393D" />
      <Text style={styles.textoNovaCategoria}>Nova categoria</Text>
    </TouchableOpacity>
      
    {/* lista categorias */}
    <View style={styles.card}>
      <Text style={styles.tituloCard}>Categorias</Text>
      <ScrollView> 
        {categorias.map((categoria) => (
          <View key={categoria.id}>
          <View style={styles.itemCategoria}>
          <View style={[styles.pontoCor, { backgroundColor: categoria.cor }]} />
          <Text style={styles.nomeCategoria}>{categoria.nome}</Text>
                
          {/* lbotões editar e excluir */}
          <TouchableOpacity style={styles.botaoIcone} onPress={() => abrirModalEdicao(categoria)}>
            <Feather name="edit" size={20} color="#2F848F" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoIcone} onPress={() => abrirModalDeletar(categoria)}>
            <Feather name="trash-2" size={20} color="#2F848F" />
          </TouchableOpacity>

          </View>
          <View style={styles.separador} />
          </View>

          ))}
      </ScrollView>
    </View>

    {/* Modal adicionar Categoria*/}
    <Modal
       animationType="none" 
       transparent={true}
       visible={modalVisibleAdd}
       onRequestClose={() => setModalVisibleAdd(false)}>

        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <View style={styles.modalCabecalho}>
            <Text style={styles.tituloModal}>Nova Categoria</Text>
            <TouchableOpacity onPress={() => setModalVisibleAdd(false)}>
              <Feather name="x" size={24} color="#14393D" />
            </TouchableOpacity>
          </View>

            <Text style={styles.textoModal}>Nome da Categoria:</Text>
            <TextInput 
              style={styles.input}
              value={nomeCategoria}
              onChangeText={setNomeCategoria}
            />

            <Text style={styles.textoModal}>Cor:</Text>
            <TouchableOpacity style={styles.inputCor} onPress={() => setModalVisibleCor(true)}>
               <View style={[styles.pontoCor, { backgroundColor: corCategoria }]} />
               <Text style={{color: '#14393D'}}>{corCategoria.toUpperCase()}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleAdicionarCategoria} style={styles.botaoContainer}>
                <Text style={styles.textoBotaoModal}>ADICIONAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal editar Categoria */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisibleEdit}
        onRequestClose={() => setModalVisibleEdit(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <View style={styles.modalCabecalho}>
            <Text style={styles.tituloModal}>Editar Categoria</Text>
              <TouchableOpacity onPress={() => setModalVisibleEdit(false)}>
                <Feather name="x" size={24} color="#14393D" />
              </TouchableOpacity>

              </View>
                <Text style={styles.textoModal}>Nome da Categoria:</Text>
                <TextInput
                    style={styles.input}
                    value={nomeCategoria}
                    onChangeText={setNomeCategoria}
                />
                <Text style={styles.textoModal}>Cor:</Text>
                <TouchableOpacity style={styles.inputCor} onPress={() => setModalVisibleCor(true)}>
                  <View style={[styles.pontoCor, { backgroundColor: corCategoria }]} />
                  <Text style={{ color: '#14393D' }}>{corCategoria.toUpperCase()}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleEditarCategoria} style={styles.botaoContainer}>
                    <Text style={styles.textoBotaoModal}>SALVAR</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

      {/* Modal deletar Categoria */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisibleDel}
        onRequestClose={() => setModalVisibleDel(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <Text style={styles.tituloModal}>Excluir Categoria</Text>
            <Text style={styles.textoConfirmacao}>
              Tem a certeza de que deseja excluir a categoria "{categoriaSelecionada?.nome}"?
            </Text>
            
          <View style={styles.botoesConfirmacaoContainer}>
            <TouchableOpacity 
             style={styles.botaoCancelar} 
             onPress={() => setModalVisibleDel(false)}>
             <Text style={styles.textoBotaoCancelar}>CANCELAR</Text>
            </TouchableOpacity>

            <TouchableOpacity 
             style={styles.botaoConfirmar} 
             onPress={handleDeletarCategoria}>
             <Text style={styles.textoBotaoConfirmar}>CONFIRMAR</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

         {/* Modal para selecionar cores */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisibleCor}
        onRequestClose={() => setModalVisibleCor(false)}>
          
        <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ColorPicker 
            style={{ width: '100%', gap: 10 }} 
            value={corCategoria} 
            onComplete={onSelectCor}>
            <Preview hideInitialColor />
            <Panel1 />
            <HueSlider />
          </ColorPicker>
            
          <TouchableOpacity onPress={() => setModalVisibleCor(false)} style={styles.botaoConfirmarCor}>
            <Text style={{color: '#2F848F', fontWeight: 'bold'}}>Confirmar</Text>
          </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },

  novaCategoria: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  textoNovaCategoria: {
    fontWeight: 'bold',
    marginLeft: 5, 
    color: '#14393D',
  },

  card: {
    width: '100%',
    flex: 1, 
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  tituloCard: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14393D',
    textAlign: 'center',
    marginBottom: 20,

  },

  itemCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },

  pontoCor: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 15,
  },

  nomeCategoria: {
    flex: 1,
    fontSize: 16,
    color: '#14393D',
  },

  botaoIcone: {
    padding: 5,
    marginLeft: 10,
  },

  separador: {
    height: 1,
    backgroundColor: '#ECECEC',
    width: '100%',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContent: {
    margin: 20,
    padding: 25,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

  input: {
    width: '100%',
    height: 45,
    borderColor: '#D0D0D0',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#14393D',
    backgroundColor: '#F8F8F8'
  },

  inputCor: {
    width: '100%',
    height: 45,
    borderColor: '#D0D0D0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8'
  },

  modalCabecalho: {
    flexDirection: 'row',       
    justifyContent: 'space-between',
    alignItems: 'center',       
    width: '100%',             
    marginBottom: 20,          
  },

  tituloModal: {
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#14393D',
  },

  textoModal:{
    alignSelf: 'flex-start', 
    marginBottom: 8,
    marginTop: 10,
    fontSize: 14, 
    color: '#14393D',
    fontWeight: '500',
  },

  textoBotaoModal: {
    fontWeight: 'bold',
    color: '#ffffff',

  },

  botaoContainer: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25, 
    alignItems: 'center',
    backgroundColor: '#2F848F',
    alignSelf: 'flex-end',
    marginTop: 13,
   
  },

  botaoConfirmarCor: {
    alignSelf: 'flex-end',
    marginTop: 20,
    padding: 10
  },

  textoConfirmacao: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    marginVertical: 20,
  },

 botoesConfirmacaoContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
},

botaoCancelar: {
    flex: 1, 
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginRight: 10, 
},

textoBotaoCancelar: {
    fontWeight: 'bold',
    color: '#14393D',

},

botaoConfirmar: {
    flex: 1, 
    backgroundColor: '#2F848F', 
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
},

textoBotaoConfirmar: {
    fontWeight: 'bold',
    color: '#FFFFFF',
},

  
});

export default TelaCategorias;