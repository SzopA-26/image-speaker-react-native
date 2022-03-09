import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './components/pages/Home'
import List from './components/pages/List'
import { Provider } from 'react-redux';
import { store } from './services/redux/store';

const Tab = createBottomTabNavigator();

export default App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator 
          screenOptions={{
            headerShown: false, 
            tabBarStyle: { display: 'none' }
          }}
        >
          <Tab.Screen name='Home' component={Home} />
          <Tab.Screen name='List' component={List} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
};