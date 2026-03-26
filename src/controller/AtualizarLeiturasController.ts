import { Request, Response } from 'express';
import { leituras } from '../models-auto/leituras';
import { livros } from '../models-auto/livros';
import { AtualizarLeituraDTO, LeituraResponse, StatusLeitura } from '../types/leituraTypes';
import { Op } from 'sequelize';

export class AtualizarLeituraController {
    async atualizarProgresso(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.usuario) {
                return res.status(401).json({ erro: 'Usuário não autenticado' });
            }
            const usuarioId = req.usuario.id;

            const { id } = req.params as { id: string };
            const idNumero = Number(id);


            const { pagina_atual, status } = req.body as AtualizarLeituraDTO;

            if (isNaN(idNumero)) {
                return res.status(400).json({
                    erro: 'ID inválido'
                })
            }

            const leitura = await leituras.findOne({
                where: {
                    id_leitura: id,
                    id_usuario: usuarioId
                },
                include: [{
                    model: livros,
                    as: 'id_livro_livro'
                }]
            })

            if (!leitura) {
                return res.status(404).json({
                    erro: 'Leitura não encontrada'
                })
            }

            const livro = leitura.id_livro_livro;

            if (pagina_atual !== undefined) {
                if (pagina_atual < 0 || pagina_atual > livro.num_paginas) {
                    return res.status(400).json({
                        erro: `Página atual deve estar entre 0 e ${livro.num_paginas}`
                    })
                }
            }

            const statusValidos: StatusLeitura[] = ['nao_lido', 'quero_ler', 'lendo', 'lido', 'abandonado', 'relendo'];
            if (status && !statusValidos.includes(status)) {
                return res.status(400).json({ erro: 'Status inválido' });
            }


            if (status === 'lendo' && !leitura.data_inicio) {
                leitura.data_inicio = new Date().toISOString().split('T')[0];
            }


            if (status === 'lido' && leitura.status !== 'lido') {
                leitura.data_conclusao = new Date().toISOString().split('T')[0];
                leitura.vezes_lido = (leitura.vezes_lido || 0) + 1;
                leitura.pagina_atual = livro.num_paginas;
            }

            if (pagina_atual !== undefined) leitura.pagina_atual = pagina_atual;
            if (status) leitura.status = status;

            await leitura.save();

            const resposta: LeituraResponse = {
                id_leitura: leitura.id_leitura,
                id_usuario: leitura.id_usuario,
                id_livro: leitura.id_livro,
                status: leitura.status,
                data_inicio: leitura.data_inicio,
                data_conclusao: leitura.data_conclusao,
                avaliacao: leitura.avaliacao,
                resenha: leitura.resenha,
                pagina_atual: leitura.pagina_atual,
                vezes_lido: leitura.vezes_lido,
                livro: livro ? {
                    id_livro: livro.id_livro,
                    titulo: livro.titulo,
                    autor: livro.autor,
                    num_paginas: livro.num_paginas,
                    capa: livro.capa
                } : undefined
            };

            return res.json({
                mensagem: 'Progresso atualizado com sucesso',
                leitura: resposta
            })
        } catch (error) {
            console.error('Erro ao atualizar progresso', error);
            return res.status(500).json({
                erro: 'Erro interno ao atualizar progresso'
            })
        }
    }

    async avaliarLeitura(req: Request<{ id: string }, {}, { avaliacao: number; resenha?: string }>, res: Response): Promise<Response> {
        try {
            if (!req.usuario) {
                return res.status(401).json({ erro: 'Usuário não autenticado' });
            }

            const usuarioId = req.usuario.id;
            const id = Number(req.params.id);
            const { avaliacao, resenha } = req.body;

            if (isNaN(id)) {
                return res.status(400).json({ erro: 'ID inválido' });
            }

            if (avaliacao !== undefined && (avaliacao < 0 || avaliacao > 5)) {
                return res.status(400).json({ erro: 'Avaliação deve estar entre 0 e 5' });
            }

            const leitura = await leituras.findOne({
                where: {
                    id_leitura: id,
                    id_usuario: usuarioId
                }
            });

            if (!leitura) {
                return res.status(404).json({ erro: 'Leitura não encontrada' });
            }

            if (leitura.status !== 'lido') {
                return res.status(400).json({
                    erro: 'Apenas livros com status "lido" podem ser avaliados'
                });
            }

            if (avaliacao !== undefined) leitura.avaliacao = avaliacao;
            if (resenha !== undefined) leitura.resenha = resenha;

            await leitura.save();

            return res.json({
                mensagem: 'Avaliação registrada com sucesso',
                leitura: {
                    id_leitura: leitura.id_leitura,
                    avaliacao: leitura.avaliacao,
                    resenha: leitura.resenha
                }
            });

        } catch (error) {
            console.error('Erro ao avaliar leitura:', error);
            return res.status(500).json({ erro: 'Erro interno ao avaliar leitura' });
        }
    }
}