import { Request, Response } from 'express';
import CadastroUsuarios from '../models/CadastroUsuariosModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const JWT_SECRET = process.env.JWT_SECRET_KEY || 'sua_chave';

export class CadastroController {

    async cadastro(req: Request, res: Response) {
        try {
            const { nome, email, senha, cpf } = req.body;

            if (!nome || !email || !senha || !cpf) {
                return res.status(400).json({
                    erro: 'Todos os campos são obrigatórios'
                })
            }

            const emailExiste = await CadastroUsuarios.findOne({ where: { email } });
            if (emailExiste) {
                return res.status(400).json({
                    erro: 'Este email já está cadastrado'
                });
            }

            const cpfExiste = await CadastroUsuarios.findOne({ where: { cpf } });
            if (cpfExiste) {
                return res.status(400).json({
                    erro: 'Este CPF já está cadastrado'
                })
            }

            const usuario = await CadastroUsuarios.create({
                nome,
                email,
                senha,
                cpf: cpf.replace(/\D/g, '')
            });

            const usuarioSemSenha = usuario.toJSON();
            delete usuarioSemSenha.senha;

            res.status(201).json({
                message: 'Usuário cadastrado com sucesso',
                usuario: usuarioSemSenha
            });

        } catch (error: any) {
            if (error.name === 'SequelizeValidationError') {
                ;
                return res.status(400).json({ erro: error.errors.map((e: any) => e.message) });
            }
            console.error('Erro no cadastro:', error);
            return res.status(500).json({
                erro: 'Erro interno do servidor'
            });
        }
    }
}


