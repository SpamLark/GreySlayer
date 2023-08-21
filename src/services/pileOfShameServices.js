// Return all pile of shame entries that are still in the pile
const getAllCurrentPileOfShameEntries = async (db) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT 
                    kit_id,
                    kit_name,
                    num_models,
                    kit_value,
                    status_id
                FROM
                    model_kits
                WHERE
                    status_id = 1
                `,
                [],
                (_, { rows }) => {
                const items = rows._array;
                console.log(items);
                resolve(items);
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

export { getAllCurrentPileOfShameEntries }