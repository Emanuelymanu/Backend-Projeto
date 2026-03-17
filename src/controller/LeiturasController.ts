import { Request, Response } from 'express';
import { leituras } from '../models-auto/leituras';
import { livros } from '../models-auto/livros';
import { Op } from 'sequelize';

export class LeiturasController {
   async iniciarLeitura(req: Request, res: Response): Promise<Response> {
      try {
         const usuarioId = (req as any).usuario.id;
         const { id_livro, status, pagina_atual } = req.body;

         if (!id_livro) {
            return res.status(400).json({
               erro: 'ID do livro é obrigatório'
            })
         }

         const livro = await livros.findByPk(id_livro);
         if (!livro) {
            return res.status(404).json({
               erro: 'Livro não encontrado'
            })
         }

         const leituraExiste = await leituras.findOne({
            where: {
               id_usuario: usuarioId,
               id_livro: id_livro
            }
         })

         if (leituraExiste) {
            return res.status(400).json({
               erro: 'Você já possui uma leitura para este livro'
            })
         }

         const statusValidos = ['quero_ler', 'lendo', 'lido', 'abandonado', 'relendo'];
         if (status && !statusValidos.includes(status)) {
            return res.status(400).json({
               erro: 'status inválido'
            });
         }

         if (pagina_atual && (pagina_atual < 0 || pagina_atual > livro.num_paginas)) {
            return res.status(400).json({
               erro: `Página atual deve estar entre 0 e ${livro.num_paginas}`
            })
         }

         const leitura = await leituras.create({
            id_usuario: usuarioId,
            id_livro,
            status: status || 'quero_ler',
            pagina_atual: pagina_atual || 0,
            vezes_lido: status === 'lido' ? 1 : 0,
            data_inicio: new Date().toISOString().split('T')[0]
         });

         const leituraCompleta = await leituras.findByPk(leitura.id_leitura, {
            include: [{
               model: livros,
               as: 'id_livro_livro'
            }]
         })
         return res.status(201).json({
            mensagem: 'Leitura iniciada com sucesso!',
            leitura: leituraCompleta

         })




      } catch (error) {
         console.error('Erro ao iniciar leitura:', error);
         return res.status(500).json({
            erro: 'Erro interno ao iniciar leitura'
         })
      }


   }

   async listarLeituras(req: Request, res: Response): Promise<Response> {
      try {
         const usuarioId = (req as any).usuario.id;
         const { status, page = 1, limit = 10 } = req.query;

         const offset = (Number(page) - 1) * Number(limit);
         const where: any = { id_usuario: usuarioId }

         if (status) {
            where.status = status;
         }

         const { count, rows } = await leituras.findAndCountAll({
            where,
            limit: Number(limit),
            offset,
            order: ['DESC'],
            include: [{
               model: livros,
               as: 'id_livro_livro'
            }]
         });

         return res.json({
            total: count,
            pagina: Number(page),
            totalPaginas: Math.ceil(count / Number(limit)),
            leituras: rows
         })

      } catch (error) {
         console.error('Erro ao listar leituras:', error);
         return res.status(500).json({
            erro: 'Erro interno ao listar leituras'
         })
      }
   }

   async deletarLeitura(req: Request, res: Response): Promise<Response> {
      try {
         const usuarioId = req.usuario.id;
         const id = Number(req.params.id);

         if (isNaN(id)) {
            return res.status(400).json({
               erro: 'Id inválido'
            })
         }

         const leitura = await leituras.findOne({
            where: {
               id_leitura: id,
               id_usuario: usuarioId
            }
         })

         if(!leitura){
            return res.status(404).json({
               erro: 'Leitura não encontrada'
            })
         }

         await leitura.destroy();
         return res.json({
            mensagem: 'Leitura deletada com sucesso'
         })
      }catch(error){
         console.error('Erro ao deletar leitura:', error);
         return res.status(500).json({
            erro: 'Erro interno ao deletar leitura'
         })
      }
   }
}


