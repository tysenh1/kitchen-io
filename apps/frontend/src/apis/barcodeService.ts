import { type ItemInfo } from "../../../shared/types";

export async function fetchItem(lastResult: ItemInfo) {
  const response = await fetch(`https://${import.meta.env.VITE_IP_ADDR}/api/v1/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(lastResult)
  })

  if (response) {
    return response;
  } else {
    throw new Error('Failed to fetch item.')
  }
}
