import {Router} from 'express';
import { CadastrarLivrosController } from '../controller/CadastrarLivrosController';
import { authMiddleware } from '../middleware/authMiddleware';
import { upload } from '../config/multer';


const router = Router();
const cadastrarLivrosController = new CadastrarLivrosController();

router.post('/cadastrar', authMiddleware, upload.single('capas'), (req, res)=> cadastrarLivrosController.cadastrarLivro(req, res));


export default router;