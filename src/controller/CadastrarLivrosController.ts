import { Request, Response } from 'express';
import { livros } from '../models-auto/livros';
import { leituras } from '../models-auto/leituras';
import { fetchFromGoogle } from '../services/googleBooksService';
export class CadastrarLivrosController {
    logRecebidos(req: Request) {
        console.log('Dados recebidos no cadastro:', req.body);
    }

    async cadastrarLivro(req: Request, res: Response) {
        try {
            this.logRecebidos(req);

            let { id_google, titulo, autor } = req.body;

            if (!id_google) {
                // Buscar pelo título e autor na Google Books API
                if (!titulo || !autor) {
                    return res.status(400).json({ message: 'Informe id_google ou título e autor para buscar na Google Books' });
                }
                const query = `${titulo} ${autor}`;
                const items = await fetchFromGoogle(query);
                if (!items || items.length === 0) {
                    return res.status(404).json({ message: 'Livro não encontrado na Google Books API' });
                }
                // Pega o primeiro resultado
                const book = items[0];
                id_google = book.id;
                titulo = book.volumeInfo.title;
                autor = (book.volumeInfo.authors && book.volumeInfo.authors.join(', ')) || '';
            }

            if (!id_google || !titulo || !autor) {
                return res.status(400).json({ message: 'Campos obrigatórios ausentes: id_google, titulo e autor' });
            }
            const idUsuario = req.usuario?.id_usuario || req.usuario?.id;
            if (!idUsuario) {
                return res.status(401).json({
                    message: 'Usuário não autenticado'
                })
            }

            const [livroLocal] = await livros.findOrCreate({
                where: { id_google },
                defaults: {
                    id_google,
                    titulo,
                    autor
                }
            });

            const [leitura, criada] = await leituras.findOrCreate({
                where: {
                    id_usuario: idUsuario,
                    id_livro: livroLocal.id_livro
                },
                defaults: {
                    id_usuario: idUsuario,
                    id_livro: livroLocal.id_livro,
                    status: 'nao_lido',
                    data_inicio: new Date().toISOString().split('T')[0],
                    pagina_atual: 0,
                    vezes_lido: 0
                }
            });

            if (!criada) {
                return res.status(409).json({ message: 'Este livro já está na sua estante!' });
            }

            console.log('Livro vinculado com sucesso. ID Local:', livroLocal.id_livro);

            return res.status(201).json({
                mensagem: 'Livro adicionado à sua estante com sucesso!',
                livro: {
                    id_livro: livroLocal.id_livro,
                    id_google: livroLocal.id_google,
                    titulo: livroLocal.titulo,
                    autor: livroLocal.autor
                }
            });

        } catch (error: any) {
            console.error('Erro ao cadastrar livro:', error);
            return res.status(500).json({ message: 'Erro interno ao cadastrar livro' });
        }
    }
}
