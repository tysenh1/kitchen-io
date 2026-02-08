// import type { Socket } from "socket.io-client";
import { type ItemInfo } from '../../../../../shared/types'
import { RenderBarcodeResult } from './BarcodeResponse.tsx'

export function BarcodeScanner({ lastResult, isScannerVisible, isLoading, setIsScannerVisible, setIsScanning }: {
  lastResult: ItemInfo | null,
  isScannerVisible: boolean,
  isLoading: boolean
  setIsScannerVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setIsScanning: React.Dispatch<React.SetStateAction<boolean>>
  // To be implemented when the barcode scanner is triggered off a websocket with a proximity sensor instead of a button
  // socket: Socket
}) {


  return (

    <div className={`relative z-10 bg-black rounded-2xl border-white border t-50% l-50% ${isScannerVisible ? 'block' : 'hidden'}`} >
      <div>
        <button onClick={() => { setIsScannerVisible(false); setIsScanning(false) }} className='border-black p-4'>Close Scanner</button>
        <button onClick={() => setIsScanning(true)} className='border-black p-4'>Scan Again</button>
      </div>
      <h2>Scanning</h2>
      <div id='reader' className='rounded-bl-2xl rounded-br-2xl'></div>
      {BarcodeResponse({ lastResult, isLoading })}
    </div >

  )
}


export function BarcodeResponse({ lastResult, isLoading }: {
  lastResult: ItemInfo | null,
  isLoading: boolean
}) {
  if (lastResult && !isLoading) {
    return <RenderBarcodeResult lastResult={lastResult} />
  } else if (isLoading) {
    return <div>LOADINGGGGGGG</div>
  } else {
    return <></>
  }
}


