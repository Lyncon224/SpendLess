import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {NavigationContainer} from "@react-navigation/native";
import 'react-native-gesture-handler';
import {createDrawerNavigator} from "@react-navigation/drawer";
import { LinearGradient } from 'expo-linear-gradient';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import ListaMetas from "../pages/metas"
import TelaCategorias from "../pages/categorias" 
import Pressionar from "../pages/home" 
import MeuGrafico from "../pages/graficos"
import TelaHistorico from "../pages/historico"

const Drawer = createDrawerNavigator();


export default function DrawerRoutes() {
  return (


    <Drawer.Navigator initialRouteName="Home" screenOptions={({ navigation }) => ({
  headerBackground: () => (
      <LinearGradient
        colors={['#1D515C', '#30848F']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
    ),
    headerTitle: '',
    headerTintColor: '#fff',
    drawerActiveTintColor: '#2EBDD0',
    drawerInactiveTintColor: '#fff',
    drawerStyle: { background: "linear-gradient(to right, #1D515C, #30848F)",},

    headerRight: () => (
      <View style={{ flexDirection: 'row', marginRight: 10 }}>

      <TouchableOpacity
    style={{
      padding: 2,
      marginRight: 15,
    }}
  >
      <Ionicons name="notifications" size={22} color="#FFF" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Perfil')}
        style={styles.perfil}
      >
        <Feather name="user" size={24} color="#BEBEBE" />
      </TouchableOpacity>

        </View>
    ),
  })}
>
          
  
    <Drawer.Screen name="Home" component={Pressionar} options={{drawerIcon: ({color, size}) => (
            <FontAwesome5 name ="home" size={size} color={color}/> ), }}/>
    
    <Drawer.Screen name="Categorias" component={TelaCategorias} options={{drawerIcon: ({color, size}) => (
            <Entypo name ="list" size={size} color={color}/> ), }}
    />
    <Drawer.Screen name="Metas" component={ListaMetas}  options={{drawerIcon: ({color, size}) => (
            <Feather name ="target" size={size} color={color}/> ), }}/>
    
<Drawer.Screen name="Gráficos" component={MeuGrafico}  options={{drawerIcon: ({color, size}) => (
            <FontAwesome name ="bar-chart" size={size} color={color}/> ), }}/>

<Drawer.Screen name="Histórico" component={TelaHistorico}  options={{drawerIcon: ({color, size}) => (
            <MaterialIcons name ="history" size={size} color={color}/> ), }}/>

    </Drawer.Navigator>


  );
}

const styles = StyleSheet.create({
  perfil: {
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 33,
    height: 33,
    justifyContent: 'center',
    alignItems: 'center',
  }
})