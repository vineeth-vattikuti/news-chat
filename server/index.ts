import path from 'path';
import express from 'express';
import cors from 'cors';
import router from './routes';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.use(express.static(path.join(__dirname, '..', 'dist')));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
