import {Router} from 'express';
import { LoginController } from '../controller/LoginController';
import {CadastroController} from '../controller/CadastroController';
import { authMiddleware } from '../middleware/authMiddleware';



const router = Router();

const loginController = new LoginController();
const cadastroController = new CadastroController();

router.post('/login', (req, res) => loginController.login(req, res));
router.post('/cadastro', (req, res) => cadastroController.cadastro(req, res));
router.get('/perfil', authMiddleware, authMiddleware, LoginController.prototype.perfil);

export default router;