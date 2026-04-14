import { Router } from 'express';
import { CadastrarLivrosController } from '../controller/CadastrarLivrosController';
import { authMiddleware } from '../middleware/authMiddleware';
import { EditarLivrosController } from '../controller/EditarLivrosController';
import { ListarLivrosController } from '../controller/ListarLivrosController';
import { upload } from '../config/multer';
import { FiltroLivros } from '../controller/FiltroLivros';


const router = Router();
const cadastrarLivrosController = new CadastrarLivrosController();
const editarLivrosController = new EditarLivrosController();
const listarLivros = new ListarLivrosController();
const filtroLivros = new FiltroLivros();

router.post('/cadastrar', authMiddleware, upload.single('capa'), (req, res) => cadastrarLivrosController.cadastrarLivro(req, res));
router.put('/editar/:id', authMiddleware, upload.single('capa'), (req, res) => editarLivrosController.atualizarLivro(req, res));
router.delete('/deletar/:id', authMiddleware, (req, res) => editarLivrosController.deletarLivro(req, res));

router.get('/listar', (req, res) => listarLivros.listarLivros(req, res));
router.get('/top-avaliados', (req, res) => listarLivros.listarTopAvaliados(req, res));
router.get('/', (req, res) => listarLivros.listarLivros(req, res));
router.get('/filtros/opcoes', (req, res) => filtroLivros.obterOpcoesFiltro(req, res));
router.get('/genero/:genero', (req, res) => filtroLivros.buscarPorGenero(req, res));
router.get('/autor/:autor', (req, res) => filtroLivros.buscarPorAutor(req, res));
router.get('/serie/:nome_serie', (req, res) => filtroLivros.buscarSerie(req, res));

router.get('/status/leitura', authMiddleware, (req, res) => filtroLivros.buscarPorStatusLeitura(req, res));


export default router;