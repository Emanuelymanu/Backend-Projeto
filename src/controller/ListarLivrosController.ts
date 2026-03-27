import { Request, Response } from 'express';
import { livros } from '../models-auto/livros';
import { leituras } from '../models-auto/leituras';
import { Op, Sequelize } from 'sequelize';
import { ListarLivrosQuery, LivroResponse } from '../types/livroTypes';

export class ListarLivrosController {
    async listarLivros(req: Request<{}, {}, {}, ListarLivrosQuery>, res: Response): Promise<Response> {
        try {
            const {
                page = 1,
                limit = 10,
                busca,
                genero,
                editora,
                tipo_obra,
                nome_serie,
                avaliacao_min,
                avaliacao_max,
                ordenar_por = 'titulo',
                ordem = 'ASC'
            } = req.query;


            const pagina = Number(page);
            const limite = Number(limit);

            if (isNaN(pagina) || pagina < 1) {
                return res.status(400).json({
                    erro: 'Página inválida. Deve ser um número maior que 0.'
                });
            }

            if (isNaN(limite) || limite < 1 || limite > 100) {
                return res.status(400).json({
                    erro: 'Limite inválido. Deve ser entre 1 e 100.'
                });
            }

            const offset = (pagina - 1) * limite;


            const camposOrdenacao: string[] = ['titulo', 'autor', 'ano_publicacao', 'num_paginas', 'created_at'];
            if (!camposOrdenacao.includes(ordenar_por)) {
                return res.status(400).json({
                    erro: `Campo de ordenação inválido. Use: ${camposOrdenacao.join(', ')}`
                });
            }

            const direcao = ordem === 'DESC' ? 'DESC' : 'ASC';


            const where: any = {};


            if (busca) {
                where[Op.or] = [
                    { titulo: { [Op.like]: `%${busca}%` } },
                    { autor: { [Op.like]: `%${busca}%` } },
                    { nome_serie: { [Op.like]: `%${busca}%` } },
                    { subtitulo: { [Op.like]: `%${busca}%` } }
                ];
            }


            if (genero) {
                where.genero = { [Op.like]: `%${genero}%` };
            }


            if (editora) {
                where.editora = { [Op.like]: `%${editora}%` };
            }


            if (tipo_obra) {
                const tiposValidos = ['unico', 'trilogia', 'serie', 'colecao'];
                if (!tiposValidos.includes(tipo_obra as string)) {
                    return res.status(400).json({
                        erro: 'Tipo de obra inválido. Valores: unico, trilogia, serie, colecao'
                    });
                }
                where.tipo_obra = tipo_obra;
            }


            if (nome_serie) {
                where.nome_serie = { [Op.like]: `%${nome_serie}%` };
            }


            let avaliacaoWhere = {};
            if (avaliacao_min || avaliacao_max) {
                const min = avaliacao_min ? Number(avaliacao_min) : 0;
                const max = avaliacao_max ? Number(avaliacao_max) : 5;

                if (min < 0 || min > 5 || max < 0 || max > 5 || min > max) {
                    return res.status(400).json({
                        erro: 'Avaliação deve estar entre 0 e 5, e min não pode ser maior que max'
                    });
                }

                avaliacaoWhere = {
                    avaliacao: {
                        [Op.between]: [min, max]
                    }
                };
            }


            const { count, rows } = await livros.findAndCountAll({
                where,
                limit: limite,
                offset,
                order: [[ordenar_por, direcao]],
                attributes: { exclude: ['created_at', 'updated_at'] },
                include: avaliacao_min || avaliacao_max ? [{
                    model: leituras,
                    as: 'leituras',
                    where: avaliacaoWhere,
                    required: true,
                    attributes: ['avaliacao']
                }] : []
            });


            const livrosResponse = await Promise.all(rows.map(async (livro) => {

                const avaliacoes = await leituras.findAll({
                    where: {
                        id_livro: livro.id_livro,
                        avaliacao: { [Op.not]: null }
                    },
                    attributes: [[Sequelize.fn('AVG', Sequelize.col('avaliacao')), 'media']]
                });

                const mediaAvaliacao = avaliacoes[0]?.dataValues?.media
                    ? Number(avaliacoes[0].dataValues.media).toFixed(1)
                    : null;

                return {
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
                    capa: livro.capa,
                    avaliacao_media: mediaAvaliacao
                };
            }));

            return res.json({
                total: count,
                pagina,
                limite,
                totalPaginas: Math.ceil(count / limite),
                filtros_aplicados: {
                    busca: busca || null,
                    genero: genero || null,
                    editora: editora || null,
                    tipo_obra: tipo_obra || null,
                    avaliacao: avaliacao_min || avaliacao_max ? `${avaliacao_min || 0} - ${avaliacao_max || 5}` : null
                },
                ordenacao: {
                    campo: ordenar_por,
                    direcao
                },
                livros: livrosResponse
            });

        } catch (error) {
            console.error('Erro ao listar livros:', error);
            return res.status(500).json({
                erro: 'Erro interno ao listar livros'
            });
        }
    }


   
}