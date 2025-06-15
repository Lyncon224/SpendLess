//importações
import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Modal, TextInput} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

import { collection, getDocs, doc, runTransaction, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../firebase'; 

const Dropdown = ({ items, onSelect, selectedValue, placeholder }) => {
  const [visivel, setVisivel] = useState(false);
  const itemSelecionado = items.find(item => item.nome === selectedValue);

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdownGatilho} onPress={() => setVisivel(!visivel)}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {itemSelecionado && (
            <View style={[styles.corPonto, { backgroundColor: itemSelecionado.cor || '#ccc' }]} />
          )}
          <Text style={itemSelecionado ? styles.dropdownGatilhoTexto : styles.dropdownPlaceholder}>
            {itemSelecionado ? itemSelecionado.nome : placeholder}
          </Text>
        </View>
        <Feather name={visivel ? "chevron-up" : "chevron-down"} size={20} color="#888" />
      </TouchableOpacity>

      {visivel && (
        <View style={styles.dropdownMenu}>
          <ScrollView nestedScrollEnabled={true}>
            {items.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.dropdownItem}
                onPress={() => {
                  onSelect(item.nome);
                  setVisivel(false);
                }}
              >
                <View style={[styles.corPonto, { backgroundColor: item.cor || '#ccc' }]} />
                <Text style={styles.dropdownItemTexto}>{item.nome}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};


export default function Inicial() {
  const [saldoAtual, setSaldoAtual] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [pressionado, setPressionado] = useState(false);
  const [modalReceitaVisivel, setModalReceitaVisivel] = useState(false);
  const [modalDespesaVisivel, setModalDespesaVisivel] = useState(false);

  const [valorReceita, setValorReceita] = useState('');
  const [categoriaReceita, setCategoriaReceita] = useState('');
  
  const [valorDespesa, setValorDespesa] = useState('');
  const [categoriaDespesa, setCategoriaDespesa] = useState('');

  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const saldoRef = doc(db, "saldo", "principal");
    const desinscreverSaldo = onSnapshot(saldoRef, (doc) => {
        if (doc.exists() && typeof doc.data().valor === 'number') {
            setSaldoAtual(doc.data().valor);
        } else {
            setSaldoAtual(0);
        }
    }, (error) => {
        console.error("Erro ao ouvir o saldo: ", error);
        setSaldoAtual(0);
    });

    const colecaoCategorias = collection(db, 'categorias');
    const desinscreverCategorias = onSnapshot(colecaoCategorias, (querySnapshot) => {
        const listaCategorias = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setCategorias(listaCategorias);
        setCarregando(false); 
    }, (error) => {
        console.error("Erro ao buscar categorias em tempo real: ", error);
        setCarregando(false);
    });
    
    return () => {
        desinscreverSaldo();
        desinscreverCategorias();
    };
  }, []);

  const aplicarMascara = (valor) => {
    if (!valor) return '';
    let valorNumerico = valor.replace(/\D/g, '');
    if (!valorNumerico) return '';
    valorNumerico = (parseInt(valorNumerico, 10) / 100).toFixed(2);
    return 'R$ ' + valorNumerico.replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  };

  const removerMascara = (valorMascarado) => {
    if (!valorMascarado) return 0;
    const valorNumerico = valorMascarado.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    return parseFloat(valorNumerico);
  };


  const adicionarTransacao = async (tipo, valor, nomeCategoria) => {
    const valorNumerico = removerMascara(valor);
    if (valorNumerico <= 0 || !nomeCategoria) {
      alert("Por favor, preencha o valor e a categoria corretamente.");
      return;
    }

    const saldoRef = doc(db, "saldo", "principal");

    try {
      await runTransaction(db, async (transaction) => {
        const saldoDoc = await transaction.get(saldoRef);
        let saldoAnterior = 0;
        if (saldoDoc.exists() && typeof saldoDoc.data().valor === 'number') {
          saldoAnterior = saldoDoc.data().valor;
        }

        const novoSaldo = tipo === 'receita' 
            ? saldoAnterior + valorNumerico 
            : saldoAnterior - valorNumerico;

        transaction.set(saldoRef, { valor: novoSaldo }, { merge: true });
        
        const transacoesRef = collection(db, "transacoes");
        transaction.set(doc(transacoesRef), {
            tipo: tipo,
            valor: valorNumerico,
            categoria: nomeCategoria,
            data: Timestamp.now()
        });
      });

      console.log("Transação e saldo atualizados com sucesso!");

      if (tipo === 'receita') {
        setValorReceita('');
        setCategoriaReceita('');
        setModalReceitaVisivel(false);
      } else {
        setValorDespesa('');
        setCategoriaDespesa('');
        setModalDespesaVisivel(false);
      }
    } catch (e) {
      console.error("Erro na transação: ", e);
      alert("Ocorreu um erro ao salvar a transação.");
    }
  };

  function Pressionar() {
    setPressionado(!pressionado);
  }

  const dados = [{ title: 'Em andamento', data: [{ id: '1', nome: 'Computador', valorAtual: 5000, valorMeta: 5000 }] }];
  const valores = dados[0].data.reduce((total, item) => total + Math.min(item.valorAtual, item.valorMeta), 0);
  const metas = dados[0].data.reduce((total, item) => total + item.valorMeta, 0);

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ecf0f1' }}>
        <ActivityIndicator size="large" color="#2F848F" />
        <Text style={{marginTop: 10}}>A carregar dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={styles.card}>
          <Text style={styles.tituloCard}>Saldo atual</Text>
          <Text style={styles.valorSaldo}>R$ {saldoAtual.toFixed(2).replace('.', ',')}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.tituloCard}>Gráficos</Text>
          <View style={styles.graficoPlaceholder}><Text style={styles.graficoPlaceholderText}>Gráfico virá aqui</Text></View>
        </View>

        <View style={styles.card}>
          <Text style={styles.tituloCard}>Metas</Text>
          <View style={styles.barraContainer}>
            <View style={[styles.barra, { width: `${(valores / metas) * 100}%`, backgroundColor: valores >= metas ? '#00C851' : '#2E7F86' }]}>
              <Text style={styles.valorTexto}>R$ {valores.toFixed(2)}</Text>
            </View>
          </View>
          <Text style={styles.metaTexto}>R$ {metas.toFixed(2)}</Text>
        </View>
      </ScrollView>

      <View style={styles.botaoContainer}>
        {pressionado && (
          <TouchableOpacity style={styles.botaoAcao} onPress={() => setModalReceitaVisivel(true)}>
            <Text style={styles.textoBotao}>Receita</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.botaoPrincipal} onPress={Pressionar}>
          <Entypo name={pressionado ? "minus" : "plus"} color="white" size={40}/>
        </TouchableOpacity>
        {pressionado && (
          <TouchableOpacity style={styles.botaoAcao} onPress={() => setModalDespesaVisivel(true)}>
            <Text style={styles.textoBotao}>Despesa</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal de Receita */}
      <Modal animationType="fade" transparent={true} visible={modalReceitaVisivel} onRequestClose={() => setModalReceitaVisivel(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.tituloModal}>Adicionar Receita</Text>
              <AntDesign name="close" color="black" size={24} onPress={() => setModalReceitaVisivel(false)} style={styles.botaoFecharModal}/>
            </View>
            <Text style={styles.modalText}>Valor:</Text>
            <TextInput style={styles.input} keyboardType="numeric" placeholder="R$ 0,00" value={valorReceita} onChangeText={(text) => setValorReceita(aplicarMascara(text))}/>
            <Text style={styles.modalText}>Categoria:</Text>
            <Dropdown
              items={categorias.filter(c => c.tipo === 'receita' || !c.tipo)}
              onSelect={setCategoriaReceita}
              selectedValue={categoriaReceita}
              placeholder="Selecione uma categoria..."
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.addButton} onPress={() => adicionarTransacao('receita', valorReceita, categoriaReceita)}>
                <Text style={styles.textoAddButton}>ADICIONAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Despesa */}
      <Modal animationType="fade" transparent={true} visible={modalDespesaVisivel} onRequestClose={() => setModalDespesaVisivel(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.tituloModal}>Adicionar Despesa</Text>
              <AntDesign name="close" color="black" size={24} onPress={() => setModalDespesaVisivel(false)} style={styles.botaoFecharModal}/>
            </View>
            <Text style={styles.modalText}>Valor:</Text>
            <TextInput style={styles.input} keyboardType="numeric" placeholder="R$ 0,00" value={valorDespesa} onChangeText={(text) => setValorDespesa(aplicarMascara(text))}/>
            <Text style={styles.modalText}>Categoria:</Text>
            <Dropdown
              items={categorias.filter(c => c.tipo === 'despesa' || !c.tipo)}
              onSelect={setCategoriaDespesa}
              selectedValue={categoriaDespesa}
              placeholder="Selecione uma categoria..."
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.addButton} onPress={() => adicionarTransacao('despesa', valorDespesa, categoriaDespesa)}>
                <Text style={styles.textoAddButton}>ADICIONAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  scrollViewContentContainer: {
    padding: 8,
    paddingBottom: 100,
    alignItems: 'center',
  },
  card: {
    borderRadius: 10,
    marginVertical: 8,
    width: '95%',
    padding: 16,
    backgroundColor: "#fff",
    elevation: 5,
  },
  barraContainer: {
    height: 24,
    backgroundColor: '#ECEEF5',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    width: '100%',
  },
  barra: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  valorTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  metaTexto: {
    textAlign: 'right',
    marginTop: 4,
    fontWeight: '500',
    fontSize: 14,
  },
  tituloCard: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  valorSaldo: {
    fontSize: 48,
    alignSelf: 'center',
    color: '#2F848F',
    fontWeight: 'bold',
  },
  graficoPlaceholder: {
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 10,
  },
  graficoPlaceholderText: {
    color: '#888',
    fontSize: 16,
  },
  botaoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoPrincipal: {
    height: 64,
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    backgroundColor: '#2F848F',
    zIndex: 1,
    marginHorizontal: 15,
    elevation: 8,
  },
  botaoAcao: {
    borderRadius: 40,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#CAE9EB',
    elevation: 5,
  },
  textoBotao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2F848F',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    gap: 15,
    padding: 25,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tituloModal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    marginBottom: -10,
  },
  botaoFecharModal: {
    padding: 5,
  },
  input: {
    height: 50,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  modalActions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  addButton: {
    borderRadius: 50,
    backgroundColor: '#2F848F',
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  textoAddButton: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: 'white',
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 10,
  },
  dropdownGatilho: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  dropdownPlaceholder: {
    color: '#999',
    fontSize: 16,
  },
  dropdownGatilhoTexto: {
    color: '#333',
    fontSize: 16,
    marginLeft: 10,
  },
  corPonto: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 52, 
    left: 0,
    right: 0,
    maxHeight: 150, 
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 5, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemTexto: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  }
});
