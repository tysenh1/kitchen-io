import { useState, useEffect, useRef } from 'react'
import type { ChatMessage, ServerToClientEvents, ClientToServerEvents, BarcodeResponse } from './types';
import { marked } from 'marked';
import 'github-markdown-css/github-markdown-dark.css';
import type { ItemInfo } from '../../shared/types.ts';
import { socket } from './lib/socket.ts';
import { useScanner } from './hooks/useScanner.ts';




function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const chatEnd = useRef<HTMLDivElement | null>(null);
  const { isScanning, setIsScanning, lastResult, isLoading } = useScanner(socket)

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



    return () => {
      socket.off('ai_stream');
      socket.off('agent_status');
    };
  }, [])




  const renderScannerLogic = () => {
    if (isLoading) {
      return <div>LOAAADING</div>
    } else {
      return <ScannerResponse content={lastResult} />
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
        <button onClick={() => { setIsScanning(true); }} className='bg-white cursor-pointer'>{isScanning ? "Scan another barcode" : "Start barcode scanner"}</button>
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
      <form>
        <input>Generic Name: {content.genericName}</input>
        <input>Barcode: {content.code}</input>
        <img src={content.imageUrl} />
        <input>Allergens: {content.allergens}</input>
        <input>Product Name: {content.productName}</input>
        <input>Quantity: {content.quantity}</input>
        <input>Unit: {content.unit}</input>
      </form>
    )
  } else {
    return <></>
  }


}

export default App
