// Insert dummy check-in data
const insertCheckInData = async (db) => {
    db.transaction(tx => {
        tx.executeSql(`INSERT INTO check_ins (check_in_date) VALUES ('2023-08-17');`);
        tx.executeSql(`INSERT INTO check_ins (check_in_date) VALUES ('2023-08-18');`);
        tx.executeSql(`INSERT INTO check_ins (check_in_date) VALUES ('2023-08-01');`);
        tx.executeSql(`INSERT INTO check_ins (check_in_date) VALUES ('2023-08-12');`);
        tx.executeSql(`INSERT INTO check_ins (check_in_date) VALUES ('2023-08-31');`);
        tx.executeSql(`INSERT INTO check_ins (check_in_date) VALUES ('2023-09-01');`);
        tx.executeSql(`INSERT INTO check_ins (check_in_date) VALUES ('2023-09-05');`);
        tx.executeSql(`INSERT INTO check_ins (check_in_date) VALUES ('2023-09-12');`);
        tx.executeSql(`INSERT INTO check_ins (check_in_date) VALUES ('2023-09-30');`);
    }, error => {
        console.log('error inserting check_in data:', error);
    }, () => {
        console.log('check-in data inserted successfully.')
    });
}

// Insert dummy status_lookup data
const insertStatusLookupData = async (db) => {
    db.transaction(tx => {
        tx.executeSql(`INSERT INTO status_lookup (status_id, status_description) VALUES (1, 'Pile of Shame');`);
        tx.executeSql(`INSERT INTO status_lookup (status_id, status_description) VALUES (2, 'Completed');`);
        tx.executeSql(`INSERT INTO status_lookup (status_id, status_description) VALUES (3, 'Sold');`);
    }, error => {
        console.log('error inserting status_lookup data:', error);
    }, () => {
        console.log('status_lookup data inserted successfully.')
    });
}

// Insert dummy model_kits data
const insertModelKitData = async (db) => {
    db.transaction(tx => {
        tx.executeSql(`INSERT INTO model_kits (kit_name, num_models, kit_value, status_id) VALUES ('Blood Knights', 5, 50, 1);`);
        tx.executeSql(`INSERT INTO model_kits (kit_name, num_models, kit_value, status_id) VALUES ('Vampire Lord', 1, 25, 1);`);
        tx.executeSql(`INSERT INTO model_kits (kit_name, num_models, kit_value, status_id) VALUES ('Genestealer Goliath Truck', 1, 35, 3);`);
        tx.executeSql(`INSERT INTO model_kits (kit_name, num_models, kit_value, status_id) VALUES ('Delaque Gang', 10, 30, 2);`);
        tx.executeSql(`INSERT INTO model_kits (kit_name, num_models, kit_value, status_id) VALUES ('Zombies', 20, 25, 1);`);
        tx.executeSql(`INSERT INTO model_kits (kit_name, num_models, kit_value, status_id) VALUES ('Cadian Command Squad', 5, 30, 1);`);
        tx.executeSql(`INSERT INTO model_kits (kit_name, num_models, kit_value, status_id) VALUES ('Sentinel', 1, 25, 1);`);
        tx.executeSql(`INSERT INTO model_kits (kit_name, num_models, kit_value, status_id) VALUES ('Alariel', 1, 75, 2);`);
        tx.executeSql(`INSERT INTO model_kits (kit_name, num_models, kit_value, status_id) VALUES ('Land Raider', 1, 50, 1);`);
    }, error => {
        console.log('error inserting model_kit data:', error);
    }, () => {
        console.log('model_kit data inserted successfully.')
    });
}



const insertData = async (db) => {
    await insertCheckInData(db);
    await insertStatusLookupData(db);
    await insertModelKitData(db);
}

export default insertData;