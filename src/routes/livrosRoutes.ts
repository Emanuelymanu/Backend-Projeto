import {Router} from 'express';
import { CadastrarLivrosController } from '../controller/CadastrarLivrosController';
import { authMiddleware } from '../middleware/authMiddleware';
import { EditarLivrosController } from '../controller/EditarLivrosController';
import { upload } from '../config/multer';


const router = Router();
const cadastrarLivrosController = new CadastrarLivrosController();
const editarLivrosController = new EditarLivrosController();

router.post('/cadastrar', authMiddleware, upload.single('capas'), (req, res)=> cadastrarLivrosController.cadastrarLivro(req, res));
router.put('/:id', authMiddleware, upload.single('capas'), (req, res) => editarLivrosController.atualizarLivro(req, res));
router.delete('/:id', authMiddleware, (req, res) => editarLivrosController.deletarLivro(req, res));


export default router;