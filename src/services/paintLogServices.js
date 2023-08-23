// Get all projects
const getAllProjects = async (db) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT *
                FROM projects
                ORDER BY project_number;`,
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
                WHERE project_id = ?
                ORDER BY model_number;`,
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
                WHERE model_id = ?
                ORDER BY recipe_number;`,
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
                ORDER BY step_number;`,
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
                    VALUES (?, ?);`,
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
                `INSERT INTO models (model_name, project_id, model_number)
                    VALUES (?, ?, (SELECT MAX(m2.model_number) + 1 FROM models m2 WHERE project_id = m2.project_id));`,
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

// Update model numbers for an array of models
const updateModelNumbers = async (db, modelArray) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            modelArray.forEach((item, index) => {
                const newModelNumber = index + 1;
                console.log('Updating', item.model_id);
                tx.executeSql(
                    `UPDATE models SET model_number = ? WHERE model_id = ?;`,
                    [newModelNumber, item.model_id],
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
    },
    (error) => {
        console.log('Transaction error:', error);
        reject(error);
    },
    () => {
        console.log('Transaction successfully committed.');
    });
};

// Delete model
const deleteModel = async (db, modelId) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            // Remove grandchild steps first
            tx.executeSql(
                `DELETE FROM steps 
                WHERE recipe_id IN (SELECT r2.recipe_id FROM recipes r2 WHERE model_id = ?);`, 
                [modelId]
            )
            // Then remove child recipes
            tx.executeSql(
                `DELETE FROM recipes WHERE model_id = ?`,
                [modelId]
            )
            // Finally, remove model
            tx.executeSql(
                `DELETE FROM models WHERE model_id = ?;`, 
                [modelId]
            )
        }, error => {
            console.log('error executing model delete:', error);
            reject(error);
        }, () => {
            console.log('model and all child records deleted successfully.');
            resolve();
        });
    });
};

// Insert new recipe
const insertNewRecipe = async (db, recipeName, modelId) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO recipes (recipe_name, model_id, recipe_number)
                    VALUES (?, ?, (SELECT MAX(r2.recipe_number) + 1 FROM recipes r2 WHERE model_id = r2.model_id));`,
                [recipeName, modelId],
                (_, result) => {
                    console.log('Row inserted to recipes successfully.');
                    resolve(result);
                },
                (_, error) => {
                    console.log('Error inserting row into recipes:', error);
                    reject(error);
                }
            );
        });
    });
};

// Update recipe numbers for an array of recipes
const updateRecipeNumbers = async (db, recipeArray) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            recipeArray.forEach((item, index) => {
                const newRecipeNumber = index + 1;
                tx.executeSql(
                    `UPDATE recipes SET recipe_number = ? WHERE recipe_id = ?;`,
                    [newRecipeNumber, item.recipe_id],
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

// Delete recipe
const deleteRecipe = async (db, recipeId) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            // Remove any child steps first
            tx.executeSql(`DELETE FROM steps WHERE recipe_id = ?;`, [recipeId])
            tx.executeSql(`DELETE FROM recipes WHERE recipe_id = ?;`, [recipeId])
        }, error => {
            console.log('error executing recipe delete:', error);
            reject(error);
        }, () => {
            console.log('recipe and associated steps deleted successfully.');
            resolve();
        });
    });
};

// Insert new step
const insertNewStep = async (db, stepDescription, paintName, paintBrand, recipeId) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO steps (step_description, paint_name, paint_brand, recipe_id, step_number)
                VALUES (?, ?, ?, ?, (SELECT MAX(s2.step_number) + 1 FROM steps s2 WHERE recipe_id = s2.recipe_id));`,
                [stepDescription, paintName, paintBrand, recipeId],
                (_, result) => {
                    console.log('Row inserted to steps successfully.');
                    resolve(result);
                },
                (_, error) => {
                    console.log('Error inserting row into steps:', error);
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
                    `UPDATE steps SET step_number = ? WHERE step_id = ?;`,
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

// Delete step
const deleteStep = async (db, stepId) => {
    console.log(stepId);
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `DELETE FROM steps WHERE step_id = ?;`,
                [stepId],
                (_, result) => {
                    console.log('Row deleted from steps successfully.');
                    console.log(result);
                    resolve(result);
                },
                (_, error) => {
                    console.log('Error deleting row from steps:', error);
                    reject(error);
                }
            );
        });
    });
};

export { 
    getAllProjects, getAllProjectModels, getAllModelRecipes, 
    getAllRecipeSteps, updateStepNumbers, insertNewProject, 
    insertNewModel, insertNewRecipe, insertNewStep, deleteStep,
    updateRecipeNumbers, deleteRecipe, updateModelNumbers, 
    deleteModel
}