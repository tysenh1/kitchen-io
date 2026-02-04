import { Socket } from 'socket.io';
import * as ProductService from '../services/productService.ts';

export const registerBarcodeHandlers = (socket: Socket) => {
  socket.on('barcode', async (barcode: string) => {
    try {
      console.log(`Scanning barcode: ${barcode}`)

      const productData = await ProductService.handleBarcodeLookup(barcode);

      socket.emit('barcode_stream', productData)

    } catch (err) {
      console.error('Barcode processing failed:', err)
      socket.emit('error', 'Could not identify that item.')
    }
  })
}
