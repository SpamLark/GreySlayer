// Insert dummy check-in data
const insertCheckInData = async (db) => {
    db.transaction(tx => {
        tx.executeSql(`INSERT OR IGNORE INTO check_ins (check_in_date) VALUES ('2023-08-23');`);
        tx.executeSql(`INSERT OR IGNORE INTO check_ins (check_in_date) VALUES ('2023-08-22');`);
        tx.executeSql(`INSERT OR IGNORE INTO check_ins (check_in_date) VALUES ('2023-08-21');`);
        tx.executeSql(`INSERT OR IGNORE INTO check_ins (check_in_date) VALUES ('2023-08-12');`);
        tx.executeSql(`INSERT OR IGNORE INTO check_ins (check_in_date) VALUES ('2023-08-24');`);
    }, error => {
        console.log('error inserting check_in data:', error);
    }, () => {
        console.log('check-in data inserted successfully.')
    });
}

// Insert dummy status_lookup data
const insertStatusLookupData = async (db) => {
    db.transaction(tx => {
        tx.executeSql(`INSERT OR IGNORE INTO status_lookup (status_id, status_description) VALUES (1, 'Pile of Shame');`);
        tx.executeSql(`INSERT OR IGNORE INTO status_lookup (status_id, status_description) VALUES (2, 'Completed');`);
        tx.executeSql(`INSERT OR IGNORE INTO status_lookup (status_id, status_description) VALUES (3, 'Sold');`);
    }, error => {
        console.log('error inserting status_lookup data:', error);
    }, () => {
        console.log('status_lookup data inserted successfully.')
    });
}

// Insert dummy model_kits data
const insertModelKitData = async (db) => {
    db.transaction(tx => {
        tx.executeSql(`INSERT INTO model_kits (kit_name, kit_number, num_models, kit_value, status_id) VALUES ('Blood Knights', 1, 5, 50, 1);`);
        tx.executeSql(`INSERT INTO model_kits (kit_name, kit_number, num_models, kit_value, status_id) VALUES ('Vampire Lord', 2, 1, 25, 1);`);
        tx.executeSql(`INSERT INTO model_kits (kit_name, kit_number, num_models, kit_value, status_id) VALUES ('Genestealer Goliath Truck', 3, 1, 35, 3);`);
        tx.executeSql(`INSERT INTO model_kits (kit_name, kit_number, num_models, kit_value, status_id) VALUES ('Delaque Gang', 4, 10, 30, 2);`);
        tx.executeSql(`INSERT INTO model_kits (kit_name, kit_number, num_models, kit_value, status_id) VALUES ('Zombies', 5, 20, 25, 1);`);
        tx.executeSql(`INSERT INTO model_kits (kit_name, kit_number, num_models, kit_value, status_id) VALUES ('Cadian Command Squad', 6, 5, 30, 1);`);
        tx.executeSql(`INSERT INTO model_kits (kit_name, kit_number, num_models, kit_value, status_id) VALUES ('Sentinel', 7, 1, 25, 1);`);
        tx.executeSql(`INSERT INTO model_kits (kit_name, kit_number, num_models, kit_value, status_id) VALUES ('Alariel', 8, 1, 75, 2);`);
        tx.executeSql(`INSERT INTO model_kits (kit_name, kit_number, num_models, kit_value, status_id) VALUES ('Land Raider', 9, 1, 50, 1);`);
    }, error => {
        console.log('error inserting model_kit data:', error);
    }, () => {
        console.log('model_kit data inserted successfully.')
    });
}

// Insert dummy projects data
const insertProjectData = async (db) => {
    db.transaction(tx => {
        tx.executeSql(`INSERT INTO projects (project_id, project_number, project_name) VALUES (1, 1, 'Soulblight Gravelords');`);
        tx.executeSql(`INSERT INTO projects (project_id, project_number, project_name) VALUES (2, 2, 'Astra Militarum');`);
        tx.executeSql(`INSERT INTO projects (project_id, project_number, project_name) VALUES (3, 3, 'Delaque Gang');`);
    }, error => {
        console.log('error inserting projects data:', error);
    }, () => {
        console.log('projects data inserted successfully.')
    });
}

// Insert dummy models data
const insertModelsData = async (db) => {
    db.transaction(tx => {
        tx.executeSql(`INSERT INTO models (model_id, model_number, model_name, project_id) VALUES (1, 1, 'Skeletons', 1);`);
        tx.executeSql(`INSERT INTO models (model_id, model_number, model_name, project_id) VALUES (2, 2, 'Zombies', 1);`);
        tx.executeSql(`INSERT INTO models (model_id, model_number, model_name, project_id) VALUES (3, 3, 'Dire Wolves', 1);`);
        tx.executeSql(`INSERT INTO models (model_id, model_number, model_name, project_id) VALUES (4, 4, 'Zombie Dragon', 1);`);
        tx.executeSql(`INSERT INTO models (model_id, model_number, model_name, project_id) VALUES (5, 1, 'Infantry', 2);`);
        tx.executeSql(`INSERT INTO models (model_id, model_number, model_name, project_id) VALUES (6, 2, 'Tanks', 2);`);
        tx.executeSql(`INSERT INTO models (model_id, model_number, model_name, project_id) VALUES (7, 1, 'Ganger', 3);`);
    }, error => {
        console.log('error inserting models data:', error);
    }, () => {
        console.log('models data inserted successfully.')
    });
}

// Insert dummy recipes data
const insertRecipesData = async (db) => {
    db.transaction(tx => {
        tx.executeSql(`INSERT INTO recipes (recipe_id, recipe_number, recipe_name, model_id) VALUES (1, 1, 'Bone', 1);`);
        tx.executeSql(`INSERT INTO recipes (recipe_id, recipe_number, recipe_name, model_id) VALUES (2, 2, 'Cloth', 1);`);
        tx.executeSql(`INSERT INTO recipes (recipe_id, recipe_number, recipe_name, model_id) VALUES (3, 3, 'Metals', 1);`);
        tx.executeSql(`INSERT INTO recipes (recipe_id, recipe_number, recipe_name, model_id) VALUES (4, 4, 'Base', 1);`);
    }, error => {
        console.log('error inserting recipes data:', error);
    }, () => {
        console.log('recipes data inserted successfully.')
    });
}

// Insert dummy steps data
const insertStepsData = async (db) => {
    db.transaction(tx => {
        tx.executeSql(`INSERT INTO steps (step_id, step_number, step_description, paint_name, paint_brand, recipe_id) VALUES (1, 1, 'Basecoat', 'Zhandri Dust', 'Citadel', 1);`);
        tx.executeSql(`INSERT INTO steps (step_id, step_number, step_description, paint_name, paint_brand, recipe_id) VALUES (2, 2, 'Wash', 'Agrax Earthshade', 'Citadel', 1);`);
        tx.executeSql(`INSERT INTO steps (step_id, step_number, step_description, paint_name, paint_brand, recipe_id) VALUES (3, 3, 'Layer', 'Zhandri Dust', 'Citadel', 1);`);
        tx.executeSql(`INSERT INTO steps (step_id, step_number, step_description, paint_name, paint_brand, recipe_id) VALUES (4, 4, 'Highlight', 'Screaming Skull', 'Citadel', 1);`);
        tx.executeSql(`INSERT INTO steps (step_id, step_number, step_description, paint_name, paint_brand, recipe_id) VALUES (5, 5, 'Highlight', 'Bright White', 'Vallejo', 1);`);
    }, error => {
        console.log('error inserting steps data:', error);
    }, () => {
        console.log('steps data inserted successfully.')
    });
}


const insertData = async (db) => {
    await insertCheckInData(db);
    await insertStatusLookupData(db);
    await insertModelKitData(db);
    await insertProjectData(db);
    await insertModelsData(db);
    await insertRecipesData(db);
    await insertStepsData(db);
}

export default insertData;