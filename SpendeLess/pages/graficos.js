import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Platform, Pressable } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { Feather } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useFonts, LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';
import DateTimePickerModal from 'react-native-modal-datetime-picker';


const data = [
  { label: 'Alimentação', value: 50, color: '#F44336' },
  { label: 'escola', value: 30, color: '#2196F3' },
  { label: 'Transporte', value: 40, color: '#4CAF50' },
  { label: 'Trabalho e educação', value: 20, color: '#FFEB3B' },
  { label: 'Lazer', value: 10, color: '#E91E63' },
  { label: 'Saúde', value: 5, color: '#8BC34A' },
  { label: 'Imprevistos', value: 5, color: '#673AB7',  },
];

export default function MeuGrafico() {
  const [fontsLoaded] = useFonts({
    LilitaOne_400Regular,
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [webErrorModal, setWebErrorModal] = useState(false);

  const showDatePicker = () => {
setDatePickerVisibility(true)
  };
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  
  };


  const widthAndHeight = 200;
  const series = data.map(item => item.value);
  const sliceColor = data.map(item => item.color);
  const total = series.reduce((a, b) => a + b, 0);
  const screenWidth = 300; 
  const screenHeight = 460; 

  const barData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        data: [500, 400, 200, 300, 100, 180], 
      },
    ],
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
>
      <Text
        style={{
          fontSize: 24,
          margin: 16,
          color: '#14393D',
          alignSelf: 'center',
          fontFamily: 'LilitaOne_400Regular',
        }}>
        Gráficos de Gastos
      </Text>
      <View style={styles.container}>
        <View style={[styles.card, { marginBottom: 24 }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Gastos por categoria</Text>

            {Platform.OS === 'web' ? (
              <input
                type="date"
                value={selectedDate || ''}
                onChange={e => setSelectedDate(e.target.value)}
                style={{ fontSize: 16, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
              />
            ) : (
              <TouchableOpacity onPress={showDatePicker}>
                <Feather name="filter" size={20} color="#14393D" />
              </TouchableOpacity>
            )}
          </View>
       
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            {series.length === sliceColor.length && (
              <PieChart
                widthAndHeight={widthAndHeight}
                series={data}
                coverRadius={0.6}
                coverFill="#fff"
              />
            )}
          </View>

          {data.map((item) => (
            <View key={item.label} style={styles.legendItem}>
              <View style={[styles.colorDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>
                {item.label} – {((item.value / total) * 100).toFixed(1)}%
              </Text>
            </View>
          ))}
        
        </View>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Gastos por mês</Text>

            {Platform.OS === 'web' ? (
              <input
                type="date"
                value={selectedDate || ''}
                onChange={e => setSelectedDate(e.target.value)}
                style={{ fontSize: 16, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
              />
            ) : (
              <TouchableOpacity onPress={showDatePicker}>
                <Feather name="filter" size={20} color="#000" />
              </TouchableOpacity>
            )}
          </View>

          <LineChart
            data={barData}
            width={screenWidth * 0.8}
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 1) => `rgba(47, 132, 143, ${opacity})`, 
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#2F848F',
              },
            }}
            bezier
            style={{ borderRadius: 12 }}
          />
        
        </View>
      </View>

      {Platform.OS !== 'web' && (
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: 320,
    boxShadow: '0px 3px 6px rgba(0,0,0,0.2)', 
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#14393D',
    fontFamily: 'LilitaOne_400Regular',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    minWidth: 240,
  },
  modalButton: {
    backgroundColor: '#14393D',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});
