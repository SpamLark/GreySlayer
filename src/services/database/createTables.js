import * as SQL from './tableSql';
import insertData from './insertData';

// Table exists helper function, returns true if table exists
const tableCheck = async (db, tableName) => {
  return new Promise((resolve, reject) => {
    // Check whether a table with specified name is in the database
    db.transaction(tx => {
      tx.executeSql(
        `SELECT 1 tableExists FROM sqlite_master WHERE type = 'table' AND name = ?`,
        [tableName],
        (_, { rows }) => {
          const items = rows._array;
          // Set tableExists to true/false based on query results
          tableExists = items.length > 0;
          // Resolve the promise
          resolve(tableExists);
        },
        (_, error) => {
          console.log('Error:', error);
          // Reject promise
          reject(error);
        }
      );
    });
  });
};

// Create database table
const createTable = async (db, tableName, sql) => {
  try {
    // Check whether table exists
    const tableExists = await tableCheck(db, tableName);
    // If table exists, print to console and exit function
    if (tableExists) {
      console.log(tableName, 'table already exists.');
      return;
    }
    // Otherwise, create table in the database
    db.transaction(tx => {
      console.log('creating ' + tableName + ' table');
      tx.executeSql(
        sql, 
        [],
        () => {
          console.log(tableName, 'table created successfully');
        },
        (_, error) => {
          console.log('Error:', error);
        }
      );
    });
  } catch (error) {
    console.log('Error:', error);
  }
};

// Drop tables
const dropTables = async (db) => {
  db.transaction(tx => {
    console.log('dropping tables');
    tx.executeSql('DROP TABLE IF EXISTS check_ins;');
    tx.executeSql('DROP TABLE IF EXISTS model_kits;');
    tx.executeSql('DROP TABLE IF EXISTS status_lookup;');
    tx.executeSql('DROP TABLE IF EXISTS steps;');
    tx.executeSql('DROP TABLE IF EXISTS recipes;');
    tx.executeSql('DROP TABLE IF EXISTS models;');
    tx.executeSql('DROP TABLE IF EXISTS projects;');
  })
}

const createTables = async (db) => {
  //await dropTables(db);
  await createTable(db, 'check_ins', SQL.CREATE_CHECK_INS_SQL);
  await createTable(db, 'status_lookup', SQL.CREATE_STATUS_LOOKUP_SQL);
  await createTable(db, 'model_kits', SQL.CREATE_MODEL_KITS_SQL);
  await createTable(db, 'projects', SQL.CREATE_PROJECTS_SQL);
  await createTable(db, 'models', SQL.CREATE_MODELS_SQL);
  await createTable(db, 'recipes', SQL.CREATE_RECIPES_SQL);
  await createTable(db, 'steps', SQL.CREATE_STEPS_SQL);
  await insertData(db);
};

export default createTables;