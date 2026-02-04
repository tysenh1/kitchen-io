import { db } from '../config/db.ts';
import { OFFResponse } from '../types.ts';

const CONVERSION_RATES: Record<string, number> = {
  "lb": 453.59,
  "oz": 28.35,
  "kg": 1000,
  "l": 1000,
  "ml": 1,
  "g": 1
};

function normalizeToGrams(amount: number, unit: string): number {
  const rate = CONVERSION_RATES[unit.toLowerCase()];
  return rate ? amount * rate : amount;
}

export const handleBarcodeLookup = async (barcode: string) => {


  try {
    const localItem: any = await new Promise((resolve) => {
      db.get('SELECT common_name FROM item WHERE id = ?', [barcode], (_, row) => resolve(row));
    });

    if (localItem) return localItem.common_name;

    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data: OFFResponse = await response.json();

    if (data.status === 1) {
      const item = db
      // const name = data.product.product_name || "Unknown Item";
      // Upsert into SQLite here
      return name;
    }
  } catch (error) {
    console.error("OFF API Error", error);
  }
  return "Unknown Item";
};
