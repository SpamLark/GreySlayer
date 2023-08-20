import React, { createContext, useContext } from 'react';
import * as SQLite from 'expo-sqlite';

// Create new context object DatabaseContext to provide database connection
const DatabaseContext = createContext();

// Export custom hook that uses useContext to access the values in DatabaseContext
export const useDatabase = () => useContext(DatabaseContext);

// Export component DatabaseProvide that provides context to all its children
export const DatabaseProvider = ({ children }) => {
    // Open database
    const db = SQLite.openDatabase('greyslayer.db');
    // Ensure foreign keys are enabled
    db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
        console.log('Foreign keys turned on')
    );
    // Return the context component that provides access to the database connection
    return (
        <DatabaseContext.Provider value={db}>{children}</DatabaseContext.Provider>
    );
};