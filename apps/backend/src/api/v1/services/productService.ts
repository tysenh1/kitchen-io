import type { ItemInfo } from '../../../../../shared/types.ts';
import { db } from '../config/db.ts';
import type { OFFResponse } from '../types.ts';

const CONVERSION_RATES: Record<string, number> = {
  "lb": 453.59,
  "oz": 28.35,
  "kg": 1000,
  "l": 1000,
  "ml": 1,
  "g": 1
};

const UNIT_REGEX = /^([0-9.]+)\s*([a-zA-Z]+)/;

function normalizeToGrams(amount: number, unit: string): number {
  const rate = CONVERSION_RATES[unit.toLowerCase()];
  return rate ? amount * rate : amount;
}

function parseListFromString(stringToParse: string): string[] {
  if (!stringToParse) return [];

  return stringToParse.split(',')
}

function parseUnit(item: OFFResponse) {
  const product = item.product;

  if (product.product_quantity_unit) {
    return product.product_quantity_unit
  } else if (product.net_weight_unit) {
    return product.net_weight_unit
  } else if (product.product_quantity_string) {
    const regexArray = product.product_quantity_string.match(UNIT_REGEX)
    if (!regexArray) return '';
    return regexArray[1] ? regexArray[1] : ''
  } else {
    return ''
  }
}

export const handleBarcodeLookup = async (barcode: string) => {


  try {
    const localItem: any = await new Promise((resolve) => {
      db.get('SELECT common_name FROM item WHERE id = ?', [barcode], (_, row) => resolve(row));
    });

    if (localItem) return localItem.common_name;

    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data: OFFResponse = await response.json();

    console.log(data)

    if (data.status === 1) {
      // const item = db
      // const name = data.product.product_name || "Unknown Item";
      // Upsert into SQLite here
      // return name;


      const productInfo: ItemInfo = {
        code: data.code,
        allergens: data.product.allergens_tags ? data.product.allergens_tags : parseListFromString(data?.product.allergens || ''),
        genericName: data.product.generic_name ? data.product.generic_name : data.product.generic_name_en,
        imageUrl: data.product.image_small_url ? data.product.image_small_url : data.product.image_url,
        productName: data.product.product_name ? data.product.product_name : data.product.product_name_en,
        quantity: data.product.quantity ? data.product.quantity : '',
        unit: parseUnit(data)
      }
      return productInfo
    }
  } catch (error) {
    console.error("OFF API Error", error);
  }
  return "Unknown Item";
};
