import { Request, Response } from 'express';
import { leituras } from '../models-auto/leituras';
import { livros } from '../models-auto/livros';
import { Op } from 'sequelize';

export class AtualizarLeituraController{
    async atualizarProgresso(req: Request, res: Response): Promise<Response>{
        try{
            const usuarioId = (req as any).usuario.id;
            const id = Number(req.params.id);
            const {pagina_atual, status} = req.body;

            if(isNaN(id)){
                return res.status(400).json({
                    erro: 'ID inválido'
                })
            }

            const leitura = await leituras.findOne({
                where:{
                    id_leitura: id,
                    id_usuario: usuarioId
                },
                include:[{
                    model: livros,
                    as: 'id_livro_livro'
                }]
            })

            if(!leitura){
                return res.status(404).json({
                    erro: 'Leitura não encontrada'
                })
            }

            const livro = leitura.id_livro_livro;

            if(pagina_atual !== undefined){
                if(pagina_atual < 0 || pagina_atual > livro.num_paginas){
                    return res.status(400).json({
                        erro: `Página atual deve estar entre 0 e ${livro.num_paginas}`
                    })
                }
            }

            if(status === 'lendo' && !leitura.data_inicio){
                leitura.data_inicio = new Date().toISOString().split('T')[0];
            }


            if (status === 'lido' && leitura.status !== 'lido'){
                leitura.data_conclusao = new Date().toISOString().split('T')[0];
                leitura.vezes_lido = (leitura.vezes_lido || 0) +1;
                leitura.pagina_atual + livro.num_paginas;
            }

            if(pagina_atual !== undefined)leitura.pagina_atual = pagina_atual;
            if(status) leitura.status = status;

            await leitura.save();

            return res.json({
                mensagem: 'Progresso atualizado com sucesso',
                leitura
            })
        }catch(error){
            console.error('Erro ao atualizar progresso', error);
            return res.status(500).json({
                erro: 'Erro interno ao atualizar progresso'
            })
        }
    }
}