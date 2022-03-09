import {openDatabase} from 'react-native-sqlite-storage';

const tableName = 'documents'

enablePromise(true);

export const getDBConnection = async () => {
   return openDatabase({name: 'image-speaker.db', location: 'default'});
};

export const createTable = async (db) => {
   // create table if not exists
   const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
         value TEXT NOT NULL
     );`;
 
   await db.executeSql(query);
};

