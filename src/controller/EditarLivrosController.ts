import { Request, Response } from 'express';
import { livros } from '../models-auto/livros';
import fs from 'fs';
import path from 'path';
import { AtualizarLivroDTO, LivroResponse } from '../types/livroTypes';

export class EditarLivrosController {


    async atualizarLivro(req: Request, res: Response): Promise<Response> {

        const file = req.file;

        try {

            const idParam = req.params.id;


            const id = Number(idParam);


            if (isNaN(id)) {
                if (file) fs.unlinkSync(file.path);
                return res.status(400).json({
                    message: 'ID inválido. O ID deve ser um número.'
                });
            }

            const livro = await livros.findByPk(id);
            if (!livro) {
                if (file) fs.unlinkSync(file.path);
                return res.status(404).json({
                    message: 'Livro não encontrado'
                });
            }

            const dadosAtualizados: AtualizarLivroDTO ={ ...req.body};


            if (file) {
                if (livro.capa) {
                    try {
                        const nomeArquivoAntigo = livro.capa.split('/').pop();
                        if (nomeArquivoAntigo) {
                            const caminhoAntigo = path.join(
                                __dirname,
                                '..',
                                '..',
                                'upload',
                                'capas',
                                nomeArquivoAntigo
                            );

                            if (fs.existsSync(caminhoAntigo)) {
                                fs.unlinkSync(caminhoAntigo);

                            }
                        }
                    } catch (err) {
                        console.error('Erro ao remover capa antiga:', err);
                    }
                }


                dadosAtualizados.capa = `${req.protocol}://${req.get('host')}/upload/capas/${file.filename}`;

            }

            await livro.update(dadosAtualizados);

            const resposta: LivroResponse = {
                id_livro: livro.id_livro,
                titulo: livro.titulo,
                subtitulo: livro.subtitulo,
                autor: livro.autor,
                tipo_obra: livro.tipo_obra,
                nome_serie: livro.nome_serie,
                ano_publicacao: livro.ano_publicacao,
                num_paginas: livro.num_paginas,
                editora: livro.editora,
                genero: livro.genero,
                capa: livro.capa
            };

            return res.json({
                mensagem: 'Livro atualizado com sucesso',
                resposta
            });

        } catch (error) {
            if (file) {
                try {
                    fs.unlinkSync(file.path);
                } catch (err) {
                    console.error('Erro ao remover arquivo:', err);
                }
            }

            console.error(' Erro ao atualizar livro:', error);
            return res.status(500).json({
                message: 'Erro interno ao atualizar livro'
            });
        }
    }


    async deletarLivro(req: Request, res: Response): Promise<Response> {
        try {

            const idParam = req.params.id;


            const id = Number(idParam);


            if (isNaN(id)) {
                return res.status(400).json({
                    message: 'ID inválido. O ID deve ser um número.'
                });
            }




            const livro = await livros.findByPk(id);

            if (!livro) {
                return res.status(404).json({
                    message: 'Livro não encontrado'
                });
            }


            if (livro.capa) {
                try {
                    const nomeArquivo = livro.capa.split('/').pop();
                    if (nomeArquivo) {

                        const caminhoCompleto = path.join(
                            __dirname,
                            '..',
                            '..',
                            'upload',
                            'capas',
                            nomeArquivo
                        );



                        if (fs.existsSync(caminhoCompleto)) {
                            fs.unlinkSync(caminhoCompleto);

                        }
                    }
                } catch (err) {
                    console.error('Erro ao remover capa:', err);
                }
            }


            await livro.destroy();

            return res.json({
                message: 'Livro deletado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao deletar livro:', error);
            return res.status(500).json({
                message: 'Erro interno ao deletar livro'
            });
        }
    }
}