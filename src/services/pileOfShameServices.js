// Return all pile of shame entries that are still in the pile
const getAllCurrentPileOfShameEntries = async (db) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT kit_id, kit_name, num_models, kit_value, status_id, kit_number
                FROM model_kits
                WHERE status_id = 1
                ORDER BY kit_number;`,
                [],
                (_, { rows }) => {
                const items = rows._array;
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

// Return total pile of shame value
const getTotalPileValue = async (db) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT SUM(kit_value) pile_value FROM model_kits GROUP BY status_id HAVING status_id = 1;`,
                [],
                (_, { rows }) => {
                const items = rows._array;
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

// Return total number of models in the pile of shame
const getTotalPileModels = async (db) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT SUM(num_models) total_models FROM model_kits GROUP BY status_id HAVING status_id = 1;`,
                [],
                (_, { rows }) => {
                const items = rows._array;
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

// Return total value of sold items from the pile of shame
const getTotalPileSoldValue = async (db) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT SUM(kit_value) sold_value FROM model_kits GROUP BY status_id HAVING status_id = 3;`,
                [],
                (_, { rows }) => {
                const items = rows._array;
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

// Return total number of models completed from the pile of shame
const getTotalCompletedPileModels = async (db) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT SUM(num_models) complete_models FROM model_kits GROUP BY status_id HAVING status_id = 2;`,
                [],
                (_, { rows }) => {
                const items = rows._array;
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


// Validate modelKit data before database insertion
const validateKitValue = (kitValue) => {
    //Check kitValue is in expected format
    const valuePattern = /^[1-9]\d*(\.\d{1,2})?$/;
    if (!valuePattern.test(kitValue)) {
        return false;
      }
    // Check kitValue is semantically valid
    if (isNaN(parseFloat(kitValue))) {
        return false;
    }
    return true;
};

// Insert new pile of shame entry
const insertNewPileOfShameEntry = async (db, kitName, numModels, kitValue) => {
    if (!validateKitValue(kitValue)) {
        throw new Error('Invalid kit value.');
    }
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO model_kits (kit_name, num_models, kit_value, status_id, kit_number)
                    VALUES (?, ?, ?, 1, (SELECT COALESCE(MAX(kit_number), 0) + 1 FROM model_kits));`,
                [kitName, numModels, kitValue],
                (_, result) => {
                    console.log('Row inserted to model_kits successfully.');
                    resolve(result);
                },
                (_, error) => {
                    console.log('Error inserting row into model_kits:', error);
                    reject(error);
                }
            )
        })
    })
};

/* 
Update the status for pile of shame entry 
n.b. no helper functions here as parameters are passed directly from the UI based on data pulled from the database
Expectation is that kitId and statusId are valid at the point the function is called.
*/
const updatePileOfShameEntryStatus = async (db, kitId, statusId) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `UPDATE model_kits SET status_id = ? WHERE kit_id = ?;`,
                [statusId, kitId],
                (_, result) => {
                    console.log('kit_id', kitId, 'updated successfully with status id', statusId);
                    resolve(result);
                },
                (_, error) => {
                    console.log('Error updating modelkit', kitId, ';', error);
                    reject(error);
                }
            )
        })
    })
}

// Update kit numbers for an array of model kits
const updateKitNumbers = async (db, kitArray) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            kitArray.forEach((item, index) => {
                const newKitNumber = index + 1;
                tx.executeSql(
                    `UPDATE model_kits SET kit_number = ? WHERE kit_id = ?;`,
                    [newKitNumber, item.kit_id],
                    (_, { rows }) => {
                    const items = rows._array;
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
    },
    (error) => {
        console.log('Transaction error:', error);
        reject(error);
    },
    () => {
        console.log('Transaction successfully committed.');
    });
};

// Delete model kit
const deleteKit = async (db, kitId) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `DELETE FROM model_kits WHERE kit_id = ?;`,
                [kitId],
                (_, result) => {
                    console.log('Row deleted from model kits successfully.');
                    console.log(result);
                    resolve(result);
                },
                (_, error) => {
                    console.log('Error deleting row from model kits:', error);
                    reject(error);
                }
            );
        });
    });
};

export { 
        getAllCurrentPileOfShameEntries, insertNewPileOfShameEntry, updatePileOfShameEntryStatus,
        getTotalPileValue, updateKitNumbers, deleteKit, getTotalPileSoldValue, getTotalCompletedPileModels,
        getTotalPileModels
}