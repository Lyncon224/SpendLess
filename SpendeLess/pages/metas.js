import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, SectionList, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox';
import { useFonts, LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';
import { Picker } from '@react-native-picker/picker';
import { collection, onSnapshot, query, orderBy, addDoc, doc, updateDoc, runTransaction, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { deleteDoc } from 'firebase/firestore';

export default function ListaMetas() {
  const [frequenciaSelecionada, setFrequenciaSelecionada] = useState('mensal');
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
  const [isSelecionado, setIsSelecionado] = useState(false);
  const [dados, setDados] = useState([]);
  const [novoNome, setNovoNome] = useState('');
  const [novoValor, setNovoValor] = useState('');
  const [novaData, setNovaData] = useState('');
  const [metaSelecionada, setMetaSelecionada] = useState(null);
  const [valorAdicionar, setValorAdicionar] = useState('');
  const [carregando, setCarregando] = useState(true);

  const [fontsLoaded] = useFonts({
    LilitaOne_400Regular,
  });

  useEffect(() => {
    setCarregando(true);
    const metasCol = collection(db, "metas");
    const q = query(metasCol, orderBy("status", "asc"));

    const desinscrever = onSnapshot(q, (metasSnapshot) => {
      const metasList = metasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const andamento = metasList.filter(meta => meta.status === 'andamento');
      const concluidas = metasList.filter(meta => meta.status === 'concluida');

      setDados([
        { title: 'Em andamento', data: andamento },
        { title: 'Concluídas', data: concluidas }
      ]);
      setCarregando(false);
    }, (error) => {
      console.error("Erro ao buscar metas: ", error);
      setCarregando(false);
    });

    return () => desinscrever();
  }, []);

  if (!fontsLoaded || carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
        <ActivityIndicator size="large" color="#14393D" />
      </View>
    );
  }

  const aplicarMascaraValor = (valor) => {
    if (!valor) return '';
    let valorNumerico = valor.replace(/\D/g, '');
    if (!valorNumerico) return '';
    valorNumerico = (parseInt(valorNumerico, 10) / 100).toFixed(2);
    return 'R$ ' + valorNumerico.replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  };

  const removerMascaraValor = (valorMascarado) => {
    if (!valorMascarado) return 0;
    const valorNumerico = valorMascarado.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    return parseFloat(valorNumerico);
  };

  const aplicarMascaraData = (text) => {
    let valor = text.replace(/\D/g, '').slice(0, 8);
    if (valor.length > 4) {
      valor = `${valor.slice(0, 2)}/${valor.slice(2, 4)}/${valor.slice(4)}`;
    } else if (valor.length > 2) {
      valor = `${valor.slice(0, 2)}/${valor.slice(2)}`;
    }
    return valor;
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.nomeContainer}>
        <Text style={styles.nome}>{item.nome}</Text>
        <View style={styles.iconesContainer}>
          {item.status === 'concluida' ? (
            <Feather name="trash" color="black" size={20} onPress={() => {
              setMetaSelecionada(item);
              setModalVisible3(true);
            }} />
          ) : (
            <>
              <Feather name="plus-circle" color="black" size={20} onPress={() => {
                setMetaSelecionada(item);
                setValorAdicionar('');
                setModalVisible4(true);
              }} />
              <Feather name="edit" color="black" size={20} onPress={() => {
                setMetaSelecionada(item);
                setNovoNome(item.nome);
                setNovoValor(aplicarMascaraValor(item.valorMeta.toFixed(2).replace('.', '')));
                setNovaData(item.dataPrevista);
                setFrequenciaSelecionada(item.frequencia || 'mensal');
                setModalVisible2(true);
              }} />
              <Feather name="trash" color="black" size={20} onPress={() => {
                setMetaSelecionada(item);
                setModalVisible3(true);
              }} />
            </>
          )}
        </View>
      </View>
      <Text>Data: {item.dataPrevista}</Text>
      {item.status === 'concluida' && item.dataConclusao && (
        <Text>Data de conclusão: {item.dataConclusao}</Text>
      )}
      <View style={styles.barraContainer}>
        <View
          style={[styles.barra, {
            width: `${Math.min((item.valorAtual / item.valorMeta) * 100, 100)}%`,
            backgroundColor: item.status === 'concluida' ? '#00C851' : '#2E7F86',
          },
          ]}>
          <Text style={styles.valorTexto}>R$ {(item.valorAtual || 0).toFixed(2).replace('.', ',')}</Text>
        </View>
      </View>
      <Text style={styles.metaTexto}>R$ {(item.valorMeta || 0).toFixed(2).replace('.', ',')}</Text>
    </View>
  );

  async function adicionarMeta() {
    const valorMetaNumerico = removerMascaraValor(novoValor);
    if (!novoNome || valorMetaNumerico <= 0 || !novaData) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos corretamente.");
      return;
    }
    await addDoc(collection(db, "metas"), {
      nome: novoNome,
      valorAtual: 0,
      valorMeta: valorMetaNumerico,
      dataPrevista: novaData,
      frequencia: frequenciaSelecionada,
      status: 'andamento'
    });
    setModalVisible1(false);
    setNovoNome('');
    setNovoValor('');
    setNovaData('');
  }

  async function adicionarValorMeta() {
    const valorAdicionarNumerico = removerMascaraValor(valorAdicionar);
    if (!metaSelecionada || valorAdicionarNumerico <= 0) {
      Alert.alert("Atenção", "Por favor, insira um valor válido para adicionar.");
      return;
    }

    const metaRef = doc(db, "metas", metaSelecionada.id);
    const saldoRef = doc(db, "saldo", "principal");

    try {
      await runTransaction(db, async (transaction) => {
        const metaDoc = await transaction.get(metaRef);
        if (!metaDoc.exists()) throw "Meta não encontrada!";

        const valorAtualMeta = metaDoc.data().valorAtual || 0;
        const novoValorAtualizado = valorAtualMeta + valorAdicionarNumerico;
        const statusFinal = novoValorAtualizado >= metaDoc.data().valorMeta ? 'concluida' : 'andamento';
        const dataConclusao = statusFinal === 'concluida' ? new Date().toLocaleDateString('pt-BR') : null;

        if (isSelecionado) {
          const saldoDoc = await transaction.get(saldoRef);
          const saldoAtual = (saldoDoc.exists() && typeof saldoDoc.data().valor === 'number') ? saldoDoc.data().valor : 0;

          if (saldoAtual < valorAdicionarNumerico) throw "Saldo insuficiente para realizar a operação.";

          transaction.update(saldoRef, { valor: saldoAtual - valorAdicionarNumerico });

          const transacoesRef = collection(db, "transacoes");
          transaction.set(doc(transacoesRef), {
            tipo: 'despesa',
            categoria: 'Metas',
            valor: valorAdicionarNumerico,
            descricao: `Contribuição para a meta: ${metaDoc.data().nome}`,
            data: Timestamp.now()
          });
        }

        transaction.update(metaRef, {
          valorAtual: novoValorAtualizado,
          status: statusFinal,
          ...(dataConclusao && { dataConclusao })
        });
      });

      setModalVisible4(false);
      setValorAdicionar('');
      setIsSelecionado(false);
      setMetaSelecionada(null);

    } catch (error) {
      Alert.alert("Erro", error.toString());
    }
  }

  async function editarMeta() {
    const valorMetaNumerico = removerMascaraValor(novoValor);
    if (!metaSelecionada || !novoNome || valorMetaNumerico <= 0 || !novaData) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos corretamente.");
      return;
    }
    await updateDoc(doc(db, "metas", metaSelecionada.id), {
      nome: novoNome,
      valorMeta: valorMetaNumerico,
      dataPrevista: novaData,
      frequencia: frequenciaSelecionada,
    });
    setModalVisible2(false);
    setNovoNome('');
    setNovoValor('');
    setNovaData('');
    setMetaSelecionada(null);
  }

  async function excluirMeta() {
    if (!metaSelecionada) return;
    await deleteDoc(doc(db, "metas", metaSelecionada.id));
    setModalVisible3(false);
    setMetaSelecionada(null);
  }

  return (
    <ScrollView 
    style={{ flex: 1, backgroundColor: '#F5F5F5' }} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.tituloPagina}>MINHAS METAS</Text>

      <View style={styles.ViewBotaoAddMeta}>
        <TouchableOpacity 
        style={styles.botaoAddMeta} 
        onPress={() => setModalVisible1(true)}>
          <Text style={styles.botaoAddMetaTexto}>+ Nova meta</Text>
        </TouchableOpacity>
      </View>

      <Modal 
      animationType="none" 
      transparent={true} 
      visible={modalVisible1} 
      onRequestClose={() => setModalVisible1(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Feather name="x-circle" color="black" size={20} onPress={() => setModalVisible1(false)} style={styles.botaoFecharModal} />
            <Text style={styles.tituloModal}>Adicionar Meta</Text>
            <Text>Nome:</Text>
            <TextInput 
            style={styles.input} 
            value={novoNome} 
            onChangeText={setNovoNome} />
            <Text>Valor em R$:</Text>
            <TextInput 
            style={styles.input} 
            value={novoValor} 
            onChangeText={(text) => setNovoValor(aplicarMascaraValor(text))} keyboardType="numeric" />
            <Text>Data de previsão:</Text>
            <TextInput 
            style={styles.input} 
            value={novaData} onChangeText={(text) => setNovaData(aplicarMascaraData(text))} keyboardType="numeric" maxLength={10} />
            <Text>Frequência:</Text>
            <View style={styles.pickerGrupo}>
              <Picker 
              selectedValue={frequenciaSelecionada} 
              onValueChange={(itemValue) => setFrequenciaSelecionada(itemValue)} 
              style={styles.picker}>
                <Picker.Item label="Mensal" value="mensal" />
                <Picker.Item label="Semanal" value="semanal" />
              </Picker>
            </View>
            <Text style={styles.dica}>Dica: adicione x valor mensalmente para chegar na meta até a data prevista.</Text>
            <View style={styles.ViewBotaoDelMeta}>
              <TouchableOpacity style={styles.botaoDelMeta} onPress={adicionarMeta}>
                <Text style={styles.botaoDelMetaTexto}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal 
      animationType="none" 
      transparent={true} 
      visible={modalVisible2} 
      onRequestClose={() => setModalVisible2(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Feather name="x-circle" color="black" size={20} onPress={() => setModalVisible2(false)} style={styles.botaoFecharModal} />
            <Text style={styles.tituloModal}>Editar Meta</Text>
            <Text>Nome:</Text>
            <TextInput 
            style={styles.input} 
            value={novoNome} 
            onChangeText={setNovoNome} />
            <Text>Valor:</Text>
            <TextInput 
            style={styles.input} 
            value={novoValor} 
            onChangeText={(text) => setNovoValor(aplicarMascaraValor(text))} keyboardType="numeric" />
            <Text>Data de previsão:</Text>
            <TextInput 
            style={styles.input} 
            value={novaData} 
            onChangeText={(text) => setNovaData(aplicarMascaraData(text))} keyboardType="numeric" maxLength={10} />
            <Text>Frequência:</Text>
            <View style={styles.pickerGrupo}>
              <Picker 
              selectedValue={frequenciaSelecionada} 
              onValueChange={(itemValue) => setFrequenciaSelecionada(itemValue)} style={styles.picker}>
                <Picker.Item label="Mensal" value="mensal" />
                <Picker.Item label="Semanal" value="semanal" />
              </Picker>
            </View>
            <View style={styles.ViewBotaoDelMeta}>
              <TouchableOpacity style={styles.botaoDelMeta} onPress={editarMeta}>
                <Text style={styles.botaoDelMetaTexto}>Editar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal 
      animationType="none" 
      transparent={true} 
      visible={modalVisible3} 
      onRequestClose={() => setModalVisible3(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Feather name="x-circle" color="black" size={20} onPress={() => setModalVisible3(false)} style={styles.botaoFecharModal} />
            <Text style={styles.tituloModal}>Excluir Meta</Text>
            <Text style={{ fontSize: 15, marginBottom: 10 }}>Tem certeza que deseja excluir esta meta?</Text>
            <View style={styles.ViewBotaoDelMeta}>
              <TouchableOpacity 
              style={styles.botaoDelMetaN} 
              onPress={() => setModalVisible3(false)}>
                <Text style={styles.botaoDelMetaTextoN}>Não</Text>
              </TouchableOpacity>
              <TouchableOpacity 
              style={styles.botaoDelMeta} 
              onPress={excluirMeta}>
                <Text style={styles.botaoDelMetaTexto}>Sim</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal 
      animationType="none" 
      transparent={true} 
      visible={modalVisible4} 
      onRequestClose={() => setModalVisible4(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Feather name="x-circle" color="black" size={20} onPress={() => setModalVisible4(false)} style={styles.botaoFecharModal} />
            <Text style={styles.tituloModal}>Adicionar Valor à Meta</Text>
            <Text>Valor:</Text>
            <TextInput 
            style={styles.input} 
            value={valorAdicionar} 
            onChangeText={(text) => setValorAdicionar(aplicarMascaraValor(text))} keyboardType="numeric" />
            <View style={styles.checkboxContainer}>
              <Checkbox 
              value={isSelecionado} 
              onValueChange={setIsSelecionado} 
              color={isSelecionado ? '#2E7F86' : undefined} />
              <Text style={styles.checkboxTexto}>Retirar valor do saldo atual</Text>
            </View>
            <View style={styles.ViewBotaoDelMeta}>
              <TouchableOpacity 
              style={styles.botaoDelMeta} 
              onPress={adicionarValorMeta}>
                <Text style={styles.botaoDelMetaTexto}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <SectionList
        sections={dados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.tituloSecao}>{title}</Text>
        )}
        contentContainerStyle={styles.container}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  tituloPagina: {
    fontSize: 24,
    margin: 16,
    color: '#14393D',
    alignSelf: 'center',
    fontFamily: 'LilitaOne_400Regular',
  },
  tituloSecao: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    marginTop: 16,
    color: '#14393D',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  nome: {
    fontSize: 16,
    marginRight: 8,
    fontFamily: 'LilitaOne_400Regular',
    color: '#14393D',
  },
  nomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    justifyContent: 'space-between',
  },
  iconesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  barraContainer: {
    height: 24,
    backgroundColor: '#ECEEF5',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
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
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  pickerGrupo: {
    borderWidth: 1,
    borderColor: '#2E7F86',
    borderRadius: 100,
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#2E7F86',
  },
  dica: {
    fontSize: 12,
    color: 'black',
    marginBottom: 10,
    fontFamily: 'LilitaOne_400Regular',
  },
  input: {
    height: 40,
    borderColor: '#2E7F86',
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  botaoAddMeta: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
    alignSelf: 'flex-start',
    marginLeft: 22,
    marginBottom: -5,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  botaoAddMetaTexto: {
    color: '#14393D',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ViewBotaoAddMeta: {
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  checkboxTexto: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  tituloComIcone: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tituloModal: {
    fontSize: 18,
    color: '#14393D',
    fontFamily: 'LilitaOne_400Regular',
    textAlign: 'center',
    marginBottom: 10
  },
  botaoFecharModal: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    color: '#2E7F86',

  },
  botaoDelMeta: {
    backgroundColor: '#2E7F86',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
    alignSelf: 'flex-end',
    marginRight: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  botaoDelMetaN: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
    alignSelf: 'flex-end',
    marginRight: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  botaoDelMetaTexto: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'LilitaOne_400Regular',
  },
  botaoDelMetaTextoN: {
    color: '#2E7F86',
    fontSize: 15,
    fontFamily: 'LilitaOne_400Regular',
  },
  ViewBotaoDelMeta: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 1,
    alignSelf: 'flex-end',
  },
});
