import { Request, Response } from 'express';
import { leituras } from '../models-auto/leituras';
import { livros } from '../models-auto/livros';
import { StatusLeitura, CriarLeituraDTO, LeituraResponse, ListarLeiturasQuery } from '../types/leituraTypes';
import { Op } from 'sequelize';

export class LeiturasController {
   async iniciarLeitura(req: Request<{}, {}, CriarLeituraDTO>, res: Response): Promise<Response> {
      try {
         if (!req.usuario) {
            return res.status(401).json({ erro: 'Usuário não autenticado' });
         }
         const { id_livro, status, pagina_atual } = req.body;
         const usuarioId = req.usuario.id;
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

         const statusValidos: StatusLeitura[] = ['nao_lido', 'quero_ler', 'lendo', 'lido', 'abandonado', 'relendo'];
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

         const resposta: LeituraResponse = {
            id_leitura: leituraCompleta!.id_leitura,
            id_usuario: leituraCompleta!.id_usuario,
            id_livro: leituraCompleta!.id_livro,
            status: leituraCompleta!.status,
            data_inicio: leituraCompleta!.data_inicio,
            data_conclusao: leituraCompleta!.data_conclusao,
            avaliacao: leituraCompleta!.avaliacao,
            resenha: leituraCompleta!.resenha,
            pagina_atual: leituraCompleta!.pagina_atual,
            vezes_lido: leituraCompleta!.vezes_lido,
            livro: leituraCompleta!.id_livro_livro ? {
               id_livro: leituraCompleta!.id_livro_livro.id_livro,
               titulo: leituraCompleta!.id_livro_livro.titulo,
               autor: leituraCompleta!.id_livro_livro.autor,
               num_paginas: leituraCompleta!.id_livro_livro.num_paginas,
               capa: leituraCompleta!.id_livro_livro.capa
            } : undefined
         };

         return res.status(201).json({
            mensagem: 'Leitura iniciada com sucesso!',
            leitura: resposta

         })




      } catch (error) {
         console.error('Erro ao iniciar leitura:', error);
         return res.status(500).json({
            erro: 'Erro interno ao iniciar leitura'
         })
      }


   }

   async listarLeituras(req: Request<{}, {}, {}, ListarLeiturasQuery>, res: Response): Promise<Response> {
      try {
         if (!req.usuario) {
            return res.status(401).json({ erro: 'Usuário não autenticado' });
         }

         const usuarioId = req.usuario.id;
         const { status, page = 1, limit = 10 } = req.query;

         const pagina = Number(page)
         const limite = Number(limit)

         if (isNaN(pagina) || pagina < 1) {
            return res.status(400).json({ erro: 'Página inválida' });
         }
         if (isNaN(limite) || limite < 1 || limite > 100) {
            return res.status(400).json({ erro: 'Limite inválido (máximo 100)' });
         }

         const offset = (Number(page) - 1) * Number(limit);
         const where: any = { id_usuario: usuarioId }

         if (status) {
            where.status = status;
         }

         const { count, rows } = await leituras.findAndCountAll({
            where,
            limit: limite,
            offset,
            order: ['DESC'],
            include: [{
               model: livros,
               as: 'id_livro_livro'
            }]
         });

         const leiturasResponse: LeituraResponse[] = rows.map(leitura => ({
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
            livro: leitura.id_livro_livro ? {
               id_livro: leitura.id_livro_livro.id_livro,
               titulo: leitura.id_livro_livro.titulo,
               autor: leitura.id_livro_livro.autor,
               num_paginas: leitura.id_livro_livro.num_paginas,
               capa: leitura.id_livro_livro.capa
            } : undefined
         }));

         return res.json({
            total: count,
            pagina: Number(page),
            totalPaginas: Math.ceil(count / limite),
            leituras: leiturasResponse
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
         if (!req.usuario) {
            return res.status(401).json({ erro: 'Usuário não autenticado' });
         }
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

         if (!leitura) {
            return res.status(404).json({
               erro: 'Leitura não encontrada'
            })
         }

         await leitura.destroy();

         return res.json({
            mensagem: 'Leitura deletada com sucesso'
         })
      } catch (error) {
         console.error('Erro ao deletar leitura:', error);
         return res.status(500).json({
            erro: 'Erro interno ao deletar leitura'
         })
      }
   }
}


