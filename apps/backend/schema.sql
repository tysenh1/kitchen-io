CREATE TABLE IF NOT EXISTS pantry(
    id TEXT PRIMARY KEY,
    item_name TEXT NOT NULL UNIQUE,
    quantity REAL,
    unit TEXT,
    is_staple BOOLEAN DEFAULT 0
);
CREATE TABLE IF NOT EXISTS recipes(
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    instructions TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    tags TEXT
);
CREATE TABLE IF NOT EXISTS recipe_ingredients(
    recipe_id TEXT,
    generic_ingredient_name TEXT,
    quantity_needed REAL,
    unit TEXT,
    FOREIGN KEY(recipe_id) REFERENCES recipes(id)
);
