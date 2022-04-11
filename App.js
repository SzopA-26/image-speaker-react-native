import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { store } from './services/redux/store';
import { openDatabase } from 'react-native-sqlite-storage';
import { DATABASE_NAME, TABLE_NAME } from './assets/properties';
import Home from './pages/Home';
import List from './pages/List'

LogBox.ignoreAllLogs(); // Ignore all log notifications

export const db = openDatabase(
  {
    name: DATABASE_NAME,
    location: 'default'
  },
  () => {console.log('db connection success.')},
  error => {console.log(error)}
)

const createTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS '
      + TABLE_NAME
      + ' (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, duration INT, img TEXT, url TEXT);',
      [],
      () => {console.log('create table ' + TABLE_NAME + '.')},
      error => {console.log(error)}
    )
  })
}

const clearTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "DROP TABLE " + TABLE_NAME + ";", 
      [],
      () => {console.log('drop table ' + TABLE_NAME + '.');},
      error => {console.log(error);}
    )
  })
}

export const insertToTable = (item) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO ' + TABLE_NAME
        + ' (name, duration, img, url) '
        + "VALUES ('" + item.name + "', " + item.duration + ", '" + item.img + "', '" + item.url + "');",
        [],
        () => {
          console.log('insert ' + item.name + ' to table.')
          resolve(item)
        },
        error => {
          console.log(error)
          reject(error)
        }
      )
    })
  }) 
}

const Tab = createBottomTabNavigator();

export default App = () => {
  
  useEffect(() => {
    // clearTable() 
    createTable()
  }, [])

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