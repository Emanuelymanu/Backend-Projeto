import { Request, Response } from 'express';
import { anotacoes } from '../models-auto/anotacoes';
import { leituras } from '../models-auto/leituras';
import { Op } from 'sequelize';

export class AnotacoesController{
    async criarAnotacao(req: Request, res: Response): Promise<Response>{
        try{
            const usuarioId = req.usuario.id;
            if(!usuarioId){
                return res.status(401).json({
                    erro: 'Usuário não autenticado'
                })
            }

            const {id_leitura, pagina, titulo, conteudo} = req.body;

            if(!id_leitura){
                return res.status(400).json({
                    erro: 'ID da leitura é obrigatório'
                })
            }

            if(!conteudo){
                return res.status(400).json({
                    erro: 'Conteúdo da anotação é obrigatório'
                })
            }

            const leitura = await leituras.findOne({
                where:{
                    id_leitura,
                    id_usuario: usuarioId
                }
            })

            if(!leitura){
                return res.status(404).json({
                    erro: 'Leitura não encontrada'
                })
            }

            const anotacao = await anotacoes.create({
                id_leitura,
                pagina: pagina,
                titulo: titulo,
                conteudo
            });

            const anotacaoCompleta = await anotacoes.findByPk(anotacao.id_anotacao,{
                include:[{
                    model: leituras,
                    as: 'id_leitura_leitura'
                }]
            });

            return res.status(201).json({
                mensagem: 'Anotação criada com sucesso',
                anotacao: anotacaoCompleta
            })
        }catch(error){
            console.error('Erro ao criar anotação:', error);
            return res.status(500).json({
                erro: 'Erro interno ao criar anotação'
            })
        }
    }

    async deletarAnotacao(req: Request, res: Response): Promise<Response>{
        try{
            const usuarioId = req.usuario.id;
            const id = Number(req.params.id);

            if(isNaN(id)){
                return res.status(400).json({
                    erro: 'ID inválido'
                })
            }

            const anotacao = await anotacoes.findOne({
                where:{id_anotacao: id},
                include: [{
                    model: leituras,
                    as: 'id_leitura_leitura',
                    where:{id_usuario: usuarioId}
                }]
            });

            if(!anotacao){
                return res.status(404).json({
                    erro: 'Anotação não encontrada'
                })
            }

            await anotacao.destroy();

            return res.json({
                mensagem: 'Anotação deletada com sucesso'
            })
        }catch(error){
            console.error('Erro ao deletar anotação', error);
            return res.status(500).json({
                erro: 'Erro interno ao deletar anotação'
            })
        }
    }

    
    async buscarPorPagina(req: Request, res: Response): Promise <Response>{
        try{
            const usuarioId = req.usuario.id;
            const id_leitura = Number(req.params.id_leitura);
            const pagina = Number(req.params.pagina);

            if(isNaN(id_leitura) || isNaN(pagina)){
                return res.status(400).json({
                    erro: 'Parâmetros inválidos'
                })
            }

            const leitura = await leituras.findOne({
                where:{
                    id_leitura,
                    id_usuario: usuarioId
                }
            });

            if(!leitura){
                return res.status(404).json({
                    erro: 'Leitura não encontrada'
                })
            }

            const anotacoesLista = await anotacoes.findAll({
                where: {
                    id_leitura,
                    pagina
                },
                order: [['pagina', 'ASC']]
            });

            return res.json({
                pagina,
                total: anotacoesLista.length,
                anotacoes: anotacoesLista
            });


        }catch (error){
            console.error('Erro ao buscar anotações por páginas:', error);
            return res.status(500).json({
                erro: 'Erro interno'
            })
        }
    }
}