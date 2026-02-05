import { useState, useEffect, useRef } from 'react'
import io, { Socket } from 'socket.io-client';
import type { ChatMessage, ServerToClientEvents, ClientToServerEvents, BarcodeResponse } from './types';
import { marked } from 'marked';
import 'github-markdown-css/github-markdown-dark.css';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import type { ItemInfo } from '../../shared/types.ts';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3001');

function barcodeResponseHandler(item: ItemInfo, setItem: React.Dispatch<React.SetStateAction<ItemInfo>>) {
  for (const [key, value] of Object.entries(item)) {
    if (value) {
      setItem(prev => ({
        ...prev,
        [key]: value
      }))
    }
  }
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const chatEnd = useRef<HTMLDivElement | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [barcodeResult, setBarcodeResult] = useState<ItemInfo | null>(null);
  const [isScannerActive, setIsScannerActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [item, setItem] = useState<ItemInfo>({
    code: '',
    allergens: [],
    genericName: '',
    imageUrl: 'placeholder-item.jpg',
    productName: '',
    quantity: '',
    unit: ''
  })

  useEffect(() => {
    socket.on('ai_stream', (text) => {
      console.log(text)
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'ai') {
          return [...prev.slice(0, -1), { ...last, content: last.content + text }];
        }
        return [...prev, { role: 'ai', content: text }];
      })
    })

    socket.on('barcode_stream', (content: ItemInfo) => {
      console.log(content)
      barcodeResponseHandler(content, setItem)
      setBarcodeResult(content)
      setIsLoading(false)
    })

    return () => {
      socket.off('ai_stream');
      socket.off('agent_status');
      socket.off("barcode_stream")
    };
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
          setIsScanning(false)
          setIsLoading(true)
          return
        },
        //@ts-ignore ignore
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


  const renderScannerLogic = () => {
    if (isLoading) {
      return <div>LOAAADING</div>
    } else {
      return <ScannerResponse content={barcodeResult} />
    }
  }

  const send = () => {
    if (!input) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    socket.emit('user_msg', input);
    setInput('');
  }

  useEffect(() => chatEnd.current?.scrollIntoView({ behavior: "smooth" }), [messages])

  return (
    <div className="h-screen bg-black text-green-500 font-mono p-4 flex flex-col">
      {/* Header */}
      <div className="border-b border-green-800 pb-2 mb-4 flex justify-between items-center">
        <h1 className="text-xl tracking-widest">KITCHEN_OS</h1>
        {!isScanning && (

          <button onClick={() => { setBarcodeResult(null); setIsScanning(true); setIsScannerActive(true) }} className='bg-white cursor-pointer'>{barcodeResult ? "Scan another barcode" : "Start barcode scanner"}</button>
        )}
      </div>

      {/* Chat Log 
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${m.role === 'user' ? 'bg-green-900 text-white' : 'bg-gray-900 border border-green-800'
              }`}>
              <div
                dangerouslySetInnerHTML={{
                  __html: marked.parse(m.content, {
                    gfm: true,
                    breaks: true,
                    async: false
                  })
                }}
              />
            </div>
          </div>
        ))}
        <div ref={chatEnd} />
      </div>*/}

      <div className='absolute w-125 h-auto bg-white'>
        <h2>Scanning</h2>
        <div id='reader'></div>
        {renderScannerLogic()}
      </div>
      {/* Input Area */}
      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 bg-gray-900 border border-green-800 p-3 text-white focus:outline-none focus:border-green-500 transition-colors"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Enter command..."
        />
        <button
          onClick={send}
          className="bg-green-700 hover:bg-green-600 text-black font-bold px-6 py-3"
        >
          EXECUTE
        </button>
      </div>
    </div>
  )
}

function ScannerResponse({ content }: { content: ItemInfo | null }) {
  if (content) {
    return (
      <div>
        <p>Generic Name: {content.genericName}</p>
        <p>Barcode: {content.code}</p>
        <img src={content.imageUrl} />
        <p>Allergens: {content.allergens}</p>
        <p>Product Name: {content.productName}</p>
        <p>Quantity: {content.quantity}</p>
        <p>Unit: {content.unit}</p>
      </div>
    )
  } else {
    return <></>
  }


}

export default App
