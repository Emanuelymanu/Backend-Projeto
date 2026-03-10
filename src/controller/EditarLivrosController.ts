import { Request, Response } from 'express';
import { livros } from '../models-auto/livros';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';


export class EditarLivrosController {
    async atualizarLivro(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const dadosAtualizados = req.body;
            const file = req.file;

            const livro = await livros.findByPk(id);

            if (!livro) {
                if (file) fs.unlinkSync(file.path);
                return res.status(404).json({ message: 'Livro não encontrado' });
            }

            if (file) {
                if (livro.capa) {
                    const caminhoCapaAntiga = livro.capa.split('/').pop();
                    if (caminhoCapaAntiga) {
                        const caminhoAntigo = path.join(__dirname, '..', 'uploads', caminhoCapaAntiga);
                        if (fs.existsSync(caminhoAntigo)) {
                            fs.unlinkSync(caminhoAntigo);
                        }
                    }
                }
                dadosAtualizados.capa = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
            }

            await livro.update(dadosAtualizados);
            return res.json({
                mensagem: 'Livro atualizado com sucesso',
                livro
            });
        } catch (error) {
            if (req.file) fs.unlinkSync(req.file.path);
            console.error('Erro ao atualizar livro:', error);
            return res.status(500).json({ message: 'Erro ao atualizar livro' });
        }
    }

    async deletarLivro(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const livro = await livros.findByPk(id);

            if (!livro) {
                return res.status(404).json({ message: 'Livro não encontrado' });
            }

            if (livro.capa) {
                const caminhoCapa = livro.capa.split('/').pop();
                if (caminhoCapa) {
                    const caminhoCompleto = path.join(__dirname, '..', 'uploads', caminhoCapa);
                    if (fs.existsSync(caminhoCompleto)) {
                        fs.unlinkSync(caminhoCompleto);
                    }
                }

            }
            await livro.destroy();
            return res.json({ message: 'Livro deletado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar livro:', error);
            return res.status(500).json({ message: 'Erro ao deletar livro' });
        }
    }
}
