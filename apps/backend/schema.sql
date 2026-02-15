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
    ingredient_id TEXT,
    quantity_needed REAL,
    unit TEXT,
    FOREIGN KEY(ingredient_id) REFERENCES pantry(id),
    FOREIGN KEY(recipe_id) REFERENCES recipes(id)
);
CREATE TABLE IF NOT EXISTS item(
    id TEXT PRIMARY KEY,
    barcode TEXT UNIQUE NOT NULL,
    product_name TEXT,
    generic_name TEXT,
    brand TEXT,
    unit_size REAL,
    unit_type TEXT,
    image_url TEXT
);
CREATE TABLE IF NOT EXISTS allergens(
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS item_allergens(
    item_id TEXT NOT NULL,
    allergen_id TEXT NOT NULL,
    PRIMARY KEY(item_id, allergen_id),
    FOREIGN KEY(item_id) REFERENCES item(id) ON DELETE CASCADE,
    FOREIGN KEY(allergen_id) REFERENCES allergens(id) ON DELETE CASCADE
);
