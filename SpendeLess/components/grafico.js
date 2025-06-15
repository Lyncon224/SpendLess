import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PieChart from 'react-native-pie-chart';

const Grafico = () => {
  const widthAndHeight = 150;
  const series = [
    { value: 25, color: '#FF3131' },
    { value: 35, color: '#0097B2' },
    { value: 25, color: '#00BF63' },
    { value: 15, color: '#FF914D' }
  ];
  
  const labels = [
    '',
    '', 
    '',
    '',
  ];

  const total = series.reduce((sum, item) => sum + item.value, 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.chartAndLegendContainer}>
        <View style={styles.grafico}>
          <View style={styles.pizzaGrafico}>
            <PieChart
              widthAndHeight={widthAndHeight}
              series={series}
              coverRadius={0.45}
              coverFill={'#FFF'}
            />
            
          </View>
        </View>

        <View style={styles.legenda}>
          {labels.map((label, index) => {
            return (
              <View key={index} style={styles.legendaItem}>
                <View 
                  style={[
                    styles.legendaCor, 
                    { backgroundColor: series[index].color }
                  ]} 
                />
              </View>
            );
          })}
        </View>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: '2rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartAndLegendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grafico: {
    alignItems: 'center',
    marginRight: 30,
  },
  pizzaGrafico: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  legenda: {
    maxWidth: 180,
    justifyContent: 'center',
  },
  legendaItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  legendaCor: {
    width: 16,
    height: 16,
    marginBottom: '1rem',
  },
});

export default Grafico;