import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';

import Inicio from "../pages/inicio";
import TelaLogin from "../pages/login";
import TelaCadastro from "../pages/cadastro";
import TelaPerfil from "../pages/perfil"
import Ajuda from "../pages/ajuda"
import DrawerRoutes from "../navegacao/navegarDrawer"


const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <NavigationContainer>

    <Stack.Navigator screenOptions={{
    headerShown: false}}>
    <Stack.Screen name="Inicio" component={Inicio} />
      <Stack.Screen name="Entrar" component={TelaLogin} />
      <Stack.Screen name="Cadastro" component={TelaCadastro} />
      <Stack.Screen name="App" component={DrawerRoutes} />
      <Stack.Screen name="Perfil" component={TelaPerfil} />
      <Stack.Screen name="Ajuda" component={Ajuda} />


    </Stack.Navigator>

    </NavigationContainer>
  );
}