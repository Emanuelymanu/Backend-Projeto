import { Request, Response } from 'express';
import { usuarios } from '../models-auto/usuarios';
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

            const emailExiste = await usuarios.findOne({ where: { email } });
            if (emailExiste) {
                return res.status(400).json({
                    erro: 'Este email já está cadastrado'
                });
            }

            const cpfExiste = await usuarios.findOne({ where: { cpf } });
            if (cpfExiste) {
                return res.status(400).json({
                    erro: 'Este CPF já está cadastrado'
                })
            }

            const usuario = await usuarios.create({
                nome,
                email,
                senha,
                cpf: cpf.replace(/\D/g, '')
            });

            const UsuarioemSenha = usuario.toJSON();
            delete UsuarioemSenha.senha;

            res.status(201).json({
                message: 'Usuário cadastrado com sucesso',
                usuario: UsuarioemSenha
            });

        } catch (error: any) {
            if (error.name === 'SequelizeValidationError') {
                ;
                return res.status(400).json({ erro: error.errors.map((e: any) => e.message) });
            }
            console.error('Erro no cadastro:', error);
            return res.status(500).json({
                erro: error.message
            });
        }
    }
}


