import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './components/Home';
import List from './components/List';
import Menu from './components/Menu';

const Tab = createBottomTabNavigator();

export default App = () => {
  return (
    <>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{headerShown: false, tabBarStyle: { display: 'none' }}}>
          <Tab.Screen name='Home' component={Home} />
          <Tab.Screen name='List' component={List} />
        </Tab.Navigator>
      </NavigationContainer>
      {/* <Menu></Menu> */}
    </>
  );
};