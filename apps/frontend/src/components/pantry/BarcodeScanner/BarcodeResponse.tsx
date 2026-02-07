import { type ItemInfo } from "../../../../../shared/types"

export function RenderBarcodeResult({ lastResult }: { lastResult: ItemInfo | null }) {
  // if (lastResult) {
  //   return (
  //     <form>
  //       <input>Generic Name: {lastResult.genericName}</input>
  //       <input>Barcode: {lastResult.code}</input>
  //       <img src={lastResult.imageUrl} />
  //       <input>Allergens: {lastResult.allergens}</input>
  //       <input>Product Name: {lastResult.productName}</input>
  //       <input>Quantity: {lastResult.quantity}</input>
  //       <input>Unit: {lastResult.unit}</input>
  //     </form>
  //   )
  // } else {
  //   return <></>
  // }
  return <div>{Object.entries(lastResult as ItemInfo).map((item) => {
    return <p>{item}</p>
  })}</div>
}
