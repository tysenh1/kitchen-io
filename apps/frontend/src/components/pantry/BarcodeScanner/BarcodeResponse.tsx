import { type ItemInfo } from "../../../../../shared/types"
import { useState } from "react"

export function RenderBarcodeResult({ lastResult }: { lastResult: ItemInfo | null }) {
  const [newItem, setNewItem] = useState<Partial<ItemInfo>>({})
  const handleTextChange = (e) => {
    console.log(e.target.value)

  }
  if (lastResult) {
    return (
      <form className="[&>label>input]:border [&>label>input]:border-white">
        <label>Generic Name:
          <input value={lastResult.genericName} name="genericName" onChange={(e) => handleTextChange(e)}></input>
        </label>
        <label>Barcode:
          <input value={lastResult.code}></input>
        </label>
        <img src={lastResult.imageUrl || ''} />
        <label>Allergens:
          <input value={lastResult.allergens} />
        </label>
        <label>Product Name:
          <input value={lastResult.productName} />
        </label>
        <label>Quantity:
          <input value={lastResult.quantity} />
        </label>
        <label>Unit:
          <input value={lastResult.unit} />
        </label>
      </form>
    )
  } else {
    return <></>
  }
  // return <div>{Object.entries(lastResult as ItemInfo).map((item) => {
  //   return <p>{item}</p>
  // })}</div>
}
