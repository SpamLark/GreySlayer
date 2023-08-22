// Get all projects
const getAllProjects = async (db) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT *
                FROM projects`,
                [],
                (_, { rows }) => {
                const items = rows._array;
                resolve(items);
                },
                (_, error) => {
                console.log('Error retrieving projects:', error);
                // Reject promise
                reject(error);
                }
            );
        });
    });
};

// Get all models for a project
const getAllProjectModels = async (db, projectId) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT *
                FROM models
                WHERE project_id = ?`,
                [projectId],
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

// Get all recipes for a model
const getAllModelRecipes = async (db, modelId) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT *
                FROM recipes
                WHERE model_id = ?`,
                [modelId],
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

// Get all steps for a recipe
const getAllRecipeSteps = async (db, recipeId) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT *
                FROM steps
                WHERE recipe_id = ?
                ORDER BY step_number`,
                [recipeId],
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

// Insert new project
const insertNewProject = async (db, projectName, modelRange) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO projects (project_name, model_range)
                    VALUES (?, ?)`,
                [projectName, modelRange],
                (_, result) => {
                    console.log('Row inserted to projects successfully.');
                    resolve(result);
                },
                (_, error) => {
                    console.log('Error inserting row into projects:', error);
                    reject(error);
                }
            );
        });
    });
};

// Insert new model
const insertNewModel = async (db, modelName, projectId) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO models (model_name, project_id)
                    VALUES (?, ?)`,
                [modelName, projectId],
                (_, result) => {
                    console.log('Row inserted to models successfully.');
                    resolve(result);
                },
                (_, error) => {
                    console.log('Error inserting row into models:', error);
                    reject(error);
                }
            );
        });
    });
};

// Update step numbers for an array of steps
const updateStepNumbers = async (db, stepArray) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            stepArray.forEach((item, index) => {
                const newStepNumber = index + 1;
                tx.executeSql(
                    `UPDATE steps SET step_number = ? WHERE step_id = ?`,
                    [newStepNumber, item.step_id],
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

export { 
    getAllProjects, getAllProjectModels, getAllModelRecipes, 
    getAllRecipeSteps, updateStepNumbers, insertNewProject, 
    insertNewModel
}