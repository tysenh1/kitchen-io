import { useEffect, useState, useRef } from 'react';
import { type Socket } from 'socket.io-client';
import { type ItemInfo } from '../../../shared/types';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

export function useScanner(socket: Socket) {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<ItemInfo | null>(null)
  const [isScannerVisible, setIsScannerVisible] = useState<boolean>(false)
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    socket.on('barcode_stream', (content: ItemInfo) => {
      barcodeResponseHandler(content, setLastResult)
      console.log(content)
      setIsLoading(false)
      setIsScannerVisible(true)
    })

    // scannerRef.current = new Html5Qrcode('reader')

    return () => {
      socket.off('barcode_stream')
      // if (scannerRef.current?.isScanning) {
      //   scannerRef.current
      //     .stop()
      //     .then(() => scannerRef.current?.clear())
      //     .catch((err) => console.error("Failed to stop scanner", err))
      // }
    }
  }, [])

  useEffect(() => {
    let scanner: Html5Qrcode | null = null;

    const startCamera = async () => {
      if (isScanning && document.getElementById("reader")) {
        scanner = new Html5Qrcode("reader", {
          verbose: false,
          formatsToSupport: [
            // Html5QrcodeSupportedFormats.CODE_128,
            // Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.UPC_A
          ]
        })
        try {
          await scanner.start(
            { facingMode: "environment" },
            // { fps: 20, qrbox: { width: 300, height: 250 } },
            {
              fps: 20,
              aspectRatio: 1.7777778,

            },
            (text) => {
              socket.emit('barcode', text)
              setIsScanning(false);
              setIsLoading(false);
              setLastResult(null);
            },
            // (err) => { console.error(err) }
            () => { }
          )
        } catch (err) {
          console.error("Scanner failed to start", err)
        }
      }
    }

    startCamera();

    return () => {
      if (scanner?.isScanning) {
        scanner.stop().then(() => scanner?.clear())
      }
    }
  }, [isScanning])

  // useEffect(() => {
  //   let scanner: Html5Qrcode | null = null;
  //   if (isScanning) {
  //     scanner = new Html5Qrcode(
  //       "reader",
  //       {
  //         fps: 20,
  //         qrbox: { width: 300, height: 250 },
  //         aspectRatio: 1.777778,
  //         formatsToSupport: [
  //           // Html5QrcodeSupportedFormats.CODE_128,
  //           // Html5QrcodeSupportedFormats.EAN_13,
  //           Html5QrcodeSupportedFormats.UPC_A
  //         ]
  //       },
  //       false
  //     );
  //
  //     scanner.render(
  //       (text) => {
  //         socket.emit('barcode', text)
  //         setIsScanning(false);
  //         setIsLoading(true);
  //         setLastResult(null)
  //       },
  //       //@ts-expect-error ignore
  //       (err) => {
  //         // console.error("Error scanning barcode:", err)
  //       }
  //     )
  //   }
  //
  //   return () => {
  //     if (scanner) {
  //       scanner.clear().catch(e => console.error("Cleanup error", e))
  //     }
  //   }
  // }, [isScanning])
  useEffect(() => {
    scannerRef.current = new Html5Qrcode("reader");

  })

  return { isScanning, setIsScanning, lastResult, setLastResult, isLoading, isScannerVisible, setIsScannerVisible };
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
