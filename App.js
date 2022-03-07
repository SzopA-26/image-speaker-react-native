import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './components/pages/Home'
import List from './components/pages/List'

const Tab = createBottomTabNavigator();

export default App = () => {
  return (
    <>
      <NavigationContainer>
        <Tab.Navigator 
          screenOptions={{
            headerShown: false, 
            tabBarStyle: { display: 'none' }
          }}
        >
          <Tab.Screen name='Home' component={Home} initialParams={{ document: 0 }}/>
          <Tab.Screen name='List' component={List} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
};