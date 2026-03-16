import { Request, Response } from 'express';
import { anotacoes } from '../models-auto/anotacoes';
import { leituras } from '../models-auto/leituras';
import { Op } from 'sequelize';

export class AnotacoesController{
    async criarAnotacao(req: Request, res: Response): Promise<Response>{
        try{
            const usuarioId = (req as any).usuario?.id;
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

    
}