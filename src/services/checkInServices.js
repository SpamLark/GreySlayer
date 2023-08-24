// Return all check_in entries
const getAllCheckIns = async (db) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT check_in_id, check_in_date, photo_path FROM check_ins;',
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

// Get current hobby streak
const getCurrentHobbyStreak = async (db) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql( 
                `WITH RECURSIVE ConsecutiveDates AS (
                    SELECT
                      check_in_date,
                      check_in_date AS ConsecutiveDate,
                      1 AS ConsecutiveCount
                    FROM
                      check_ins
                    WHERE
                      check_in_date = ? -- Starting from today
                  
                    UNION ALL
                  
                    SELECT
                      c.check_in_date,
                      t.check_in_date AS ConsecutiveDate,
                     c.ConsecutiveCount + 1 AS ConsecutiveCount
                    FROM
                      ConsecutiveDates c
                    JOIN
                      check_ins t ON t.check_in_date = DATE(c.ConsecutiveDate, '-1 day')
                  )
                  SELECT
                    COALESCE(MAX(ConsecutiveCount), 0) AS MaxConsecutiveCount
                  FROM
                    ConsecutiveDates;`,
                [todaysDate()],
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

// Grabs today's date and formats it as a string matching ISO 8601
const todaysDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    // Remember months run 0 through 11, and need to add a leading zero
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    // Grab date and add that leading zero
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
};

// Date checker to validate before database insertion
const validateDate = (date) => {
    //Check date is in ISO 8601 format
    const iso8601Pattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!iso8601Pattern.test(date)) {
        return false;
      }
    // Check date is semantically valid
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return false;
    }
    return true;
};

// Insert new check_in
const insertCheckIn = async (db, checkInDate) => {
    // Throw error if date is invalid
    if (!validateDate(checkInDate)) {
        throw new Error('Invalid date');
    }
    // Attempt to insert into database
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO check_ins (check_in_date) VALUES (?);',
                [checkInDate],
                (_, result) => {
                    console.log('Row inserted successfully.');
                    resolve(result);
                },
                (_, error) => {
                    console.log('Error inserting row:', error);
                    reject(error);
                }
            );
        });
    })
}

// Add image URI to check_in
const insertImageUri = async (db, fileUri, photoDate) => {
    console.log('URI: ', fileUri, 'Date: ', photoDate);
    // Attempt to insert into database
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'UPDATE check_ins SET photo_path = ? WHERE check_in_id = (SELECT check_in_id FROM check_ins WHERE check_in_date = ?);',
                [fileUri, photoDate],
                (_, result) => {
                    resolve(result);
                },
                (_, error) => {
                    console.log('Error adding photo path:', error);
                    reject(error);
                }
            );
        });
    })
}

// Delete check_in
const deleteCheckIn = async (db, checkInDate) => {
    // Throw error if date is invalid
    if (!validateDate(checkInDate)) {
        throw new Error('Invalid date');
    }
    // Attempt to delete entry from the database
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM check_ins WHERE check_in_date = ?;',
                [checkInDate],
                (_, result) => {
                    console.log('Row deleted successfully');
                    resolve(result);
                },
                (_, error) => {
                    console.log('Error deleting row:', error);
                    reject(error);
                }
            );
        });
    })
}


export { getAllCheckIns, insertCheckIn, todaysDate, deleteCheckIn, getCurrentHobbyStreak, insertImageUri };