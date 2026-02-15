import express from 'express';
import itemRoutes from './api/v1/routes/itemRoutes.ts';
import cors from 'cors';

const app = express();

app.use(cors())

app.use(express.json());


app.get('/', (req, res) => {
  res.json('yooo')
})

app.use("/api/v1/items", itemRoutes);

export default app;


