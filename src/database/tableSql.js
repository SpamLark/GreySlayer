export const CREATE_CHECK_INS_SQL = `CREATE TABLE check_ins (
    check_in_id INTEGER PRIMARY KEY,
    check_in_date TEXT NOT NULL UNIQUE
)`;
  
export const CREATE_STATUS_LOOKUP_SQL = `CREATE TABLE status_lookup (
status_id INTEGER PRIMARY KEY,
status_description TEXT NOT NULL
);`
  
export const CREATE_MODEL_KITS_SQL = `CREATE TABLE model_kits (
    kit_id INTEGER PRIMARY KEY,
    kit_name TEXT NOT NULL,
    num_models INTEGER NOT NULL,
    kit_value NUMERIC NOT NULL,
    status_id INTEGER NOT NULL,
    FOREIGN KEY (status_id) REFERENCES status_lookup (status_id)
);`

export const CREATE_PROJECTS_SQL = `CREATE TABLE projects (
    project_id INTEGER PRIMARY KEY,
    project_name TEXT NOT NULL
);`

export const CREATE_MODELS_SQL = `CREATE TABLE models (
    model_id INTEGER PRIMARY KEY,
    model_name TEXT NOT NULL,
    project_id INTEGER NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects (project_id)
);`

export const CREATE_RECIPES_SQL = `CREATE TABLE recipes (
    recipe_id INTEGER PRIMARY KEY,
    recipe_name TEXT NOT NULL,
    model_id INTEGER NOT NULL,
    FOREIGN KEY (model_id) REFERENCES models (model_id)
);`

export const CREATE_STEPS_SQL = `CREATE TABLE steps (
    step_id INTEGER PRIMARY KEY,
    step_number INTEGER NOT NULL,
    step_description TEXT NOT NULL,
    paint_name TEXT,
    paint_brand TEXT,
    recipe_id INTEGER NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes (recipe_id)
);`