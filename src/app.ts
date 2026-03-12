import express from 'express';
import cors from 'cors';
import path from 'path';
import { sequelize } from './models-auto';
import './models-auto/livros';
import authRoutes from './routes/authRoutes';
import livrosRoutes from './routes/livrosRoutes';
import { Sequelize } from 'sequelize';
//import das routes aqui


const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));



app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/upload/capas', express.static(path.join(__dirname, '../upload/capas'))); // Rota para servir imagens de capas
app.use('/api/livros', livrosRoutes);
app.use('/api/livros/editar/:id', livrosRoutes);
app.use('/api/livros/deletar/:id', livrosRoutes);



//app.use('/api', nomedasrotas);









sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

export default app;