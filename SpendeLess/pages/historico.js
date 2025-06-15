//importações
import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const TelaHistorico = () => {

  const [transacoes, setTransacoes] = useState([]);
  const [filtro, setFiltro] = useState('Todos'); 
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setCarregando(true);
    const transacoesRef = collection(db, 'transacoes');
    const q = query(transacoesRef, orderBy('data', 'desc'));

    const desinscrever = onSnapshot(q, (querySnapshot) => {
      const listaTransacoes = [];
      querySnapshot.forEach((doc) => {
        const dados = doc.data();
        const dataJS = dados.data.toDate();
        
        listaTransacoes.push({
          id: doc.id,
          ...dados,
          data: dataJS.toLocaleDateString('pt-BR'),
          hora: dataJS.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        });
      });
      setTransacoes(listaTransacoes);
      setCarregando(false);
    }, (error) => {
        console.error("Erro ao buscar transações: ", error);
        setCarregando(false);
    });
    return () => desinscrever();
  }, []);


  const transacoesFiltradas = transacoes.filter(item => 
    filtro === 'Todos' || item.tipo === filtro
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>HISTÓRICO</Text>

      <View style={styles.filtrosContainer}>

        <TouchableOpacity 
          style={[styles.botaoFiltro, filtro === 'Todos' && styles.botaoFiltroAtivo]} 
          onPress={() => setFiltro('Todos')}>
          <Text style={[styles.textoBotaoFiltro, filtro === 'Todos' && styles.textoBotaoFiltroAtivo]}>Todos</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.botaoFiltro, filtro === 'despesa' && styles.botaoFiltroAtivo]} 
          onPress={() => setFiltro('despesa')}>
          <Text style={[styles.textoBotaoFiltro, filtro === 'despesa' && styles.textoBotaoFiltroAtivo]}>Despesa</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.botaoFiltro, filtro === 'receita' && styles.botaoFiltroAtivo]} 
          onPress={() => setFiltro('receita')}>
          <Text style={[styles.textoBotaoFiltro, filtro === 'receita' && styles.textoBotaoFiltroAtivo]}>Receita</Text>
        </TouchableOpacity>

      </View>

      {carregando ? (
        <ActivityIndicator size="large" color="#14393D" style={{flex: 1}}/>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {transacoesFiltradas.length > 0 ? (
            transacoesFiltradas.map((item) => (
              <View key={item.id} style={styles.cardHistorico}>
                <Text style={styles.cardTipo}>{item.tipo}:</Text>
                <View style={styles.cardLinha}>
                  <Text style={styles.cardLabel}>Data: {item.data} </Text>
                  <Text style={styles.cardLabel}>Horário: {item.hora}</Text>
                </View>
                <View style={styles.cardLinha}>
                  <Text style={[
                    styles.cardValor, 
                    item.tipo === 'receita' ? styles.valorReceita : styles.valorDespesa
                  ]}>
                    R$ {item.valor.toFixed(2).replace('.', ',')}
                  </Text>
                  <Text style={styles.cardCategoria}>Categoria: {item.categoria}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.textoVazio}>Nenhuma transação encontrada.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 30,
  },

  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#14393D',
    marginBottom: 20,
    textAlign: 'center', 
  },

  filtrosContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },

  botaoFiltro: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 3,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },

  botaoFiltroAtivo: {
    backgroundColor: '#E0E0E0',
  },

  textoBotaoFiltro: {
    fontWeight: 'bold',
    color: '#14393D',
    fontSize: 14,
  },

  textoBotaoFiltroAtivo: {
    color: '#14393D',
  },

  botaoCalendario: {
    padding: 8,
    marginLeft: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },

  scrollContainer: {
    paddingBottom: 10,
    width: '100%', 
  },

  cardHistorico: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    marginHorizontal: 20, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },

  cardTipo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14393D',
    marginBottom: 10,
    textTransform: 'capitalize',
  },

  cardLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },

  cardLabel: {
    fontSize: 14,
    color: '#555555',
  },

  cardValor: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  valorDespesa: {
    color: '#C70000',
  },

  valorReceita: {
    color: '#008000',
  },

  cardCategoria: {
    fontSize: 14,
    color: '#555555',
  },
  textoVazio: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});

export default TelaHistorico;
