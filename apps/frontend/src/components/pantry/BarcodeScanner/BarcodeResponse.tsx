import { type ItemInfo } from "../../../../../shared/types"
import { useState, useEffect } from "react"

export function RenderBarcodeResult({ lastResult, setLastResult }: { lastResult: ItemInfo | null, setLastResult: React.Dispatch<React.SetStateAction<ItemInfo | null>> }) {
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setLastResult(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lastResult) {
      const response = await fetch(`http://10.0.0.168:3001/api/v1/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(lastResult)
      })

      if (response) {
        // console.log(response)
        setLastResult(null)
      }
    }


  }

  useEffect(() => {
    console.log(lastResult)
  }, [lastResult])
  if (lastResult) {
    return (
      <form className="[&>label>input]:border [&>label>input]:border-white" onSubmit={handleSubmit}>
        <label>Generic Name:
          <input value={lastResult.genericName} name="genericName" onChange={(e) => handleTextChange(e)}></input>
        </label>
        <label>Barcode:
          <input value={lastResult.code} name="code" onChange={handleTextChange}></input>
        </label>
        <img src={lastResult.imageUrl || ''} />
        <label>Allergens:
          <input value={lastResult.allergens} name="allergens" />
        </label>
        <label>Product Name:
          <input value={lastResult.productName} name="productName" onChange={handleTextChange} />
        </label>
        <label>Quantity:
          <input value={lastResult.quantity} name="quantity" onChange={handleTextChange} />
        </label>
        <label>Unit:
          <input value={lastResult.unit} name="unit" onChange={handleTextChange} />
        </label>
        <button className="bg-white">Submit</button>
      </form>
    )
  } else {
    return <></>
  }
  // return <div>{Object.entries(lastResult as ItemInfo).map((item) => {
  //   return <p>{item}</p>
  // })}</div>
}


