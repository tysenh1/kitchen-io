import { useEffect, useState } from 'react';
import { type Socket } from 'socket.io-client';
import { type ItemInfo } from '../../../shared/types';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';

export function useScanner(socket: Socket) {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<ItemInfo | null>(null)
  const [isScannerVisible, setIsScannerVisible] = useState<boolean>(false)

  useEffect(() => {
    socket.on('barcode_stream', (content: ItemInfo) => {
      barcodeResponseHandler(content, setLastResult)
      console.log(content)
      setIsLoading(false)
      setIsScannerVisible(true)
    })



    return () => {
      socket.off('barcode_stream')
    }
  }, [])

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    if (isScanning) {
      scanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 20,
          qrbox: { width: 300, height: 250 },
          aspectRatio: 1.777778,
          formatsToSupport: [
            // Html5QrcodeSupportedFormats.CODE_128,
            // Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.UPC_A
          ]
        },
        false
      );

      scanner.render(
        (text) => {
          socket.emit('barcode', text)
          setIsScanning(false);
          setIsLoading(true);
          setLastResult(null)
        },
        //@ts-expect-error ignore
        (err) => {
          // console.error("Error scanning barcode:", err)
        }
      )
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(e => console.error("Cleanup error", e))
      }
    }
  }, [isScanning])

  return { isScanning, setIsScanning, lastResult, isLoading, isScannerVisible, setIsScannerVisible };
}

function barcodeResponseHandler(item: ItemInfo, setItem: React.Dispatch<React.SetStateAction<ItemInfo | null>>) {
  const newItem: ItemInfo = {
    code: '',
    allergens: [],
    genericName: '',
    imageUrl: '',
    productName: '',
    quantity: '',
    unit: ''
  }
  for (const [key, value] of Object.entries(item)) {
    if (value) {
      // setItem(prev => ({
      //   ...prev,
      //   [key]: value
      // }))
      newItem[key] = value
    }
  }
  setItem(newItem)
}
