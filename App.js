import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './components/Pages/Home';
import List from './components/Pages/List';

const Tab = createBottomTabNavigator();

export default App = () => {
  return (
    <>
      <NavigationContainer>
        <Tab.Navigator 
          screenOptions={{
            headerShown: false, 
            tabBarStyle: { display: 'none' }}}
        >
          <Tab.Screen name='Home' component={Home} />
          <Tab.Screen name='List' component={List} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
};