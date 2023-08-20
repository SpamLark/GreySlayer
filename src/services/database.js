// Return all check_in entries
const getAllCheckIns = async (db) => {
    return new Promise((resolve, reject) => {
        db.transaction(async (tx) => {
            tx.executeSql(
                'SELECT check_in_id, check_in_date FROM check_ins;',
                [],
                (_, { rows }) => {
                const items = rows._array;
                //console.log(items);
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


export { getAllCheckIns };