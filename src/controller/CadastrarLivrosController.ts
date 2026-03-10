import { Request, Response } from 'express';
import { livros } from '../models-auto/livros';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';

export class CadastrarLivrosController {
    async cadastrarLivro(req: Request, res: Response) {
        try {
            console.log('dados recebidos:', req.body);
            console.log('arquivo recebido:', req.file);

            const {
                titulo,
                subtitulo,
                autor,
                tipo_obra,
                nome_serie,
                ano_publicacao,
                num_paginas,
                editora,
                genero
            } = req.body;

            const file = req.file;

            if (!titulo || !autor || !tipo_obra || !num_paginas) {
                if (file) {
                    fs.unlinkSync(file.path);
                }
                return res.status(400).json({ message: 'Campos obrigatórios ausentes: titulo, autor, tipo_obra e num_paginas' });
            }

            const tipoObraValido = ['unico', 'trilogia', 'serie', 'colecao'];
            if (tipo_obra && !tipoObraValido.includes(tipo_obra)) {
                if (file) fs.unlinkSync(file.path);
                return res.status(400).json({ message: 'Valor inválido para tipo_obra. Valores permitidos: unico, trilogia, serie, colecao' });

            }

            if (tipo_obra && tipo_obra !== 'unico') {
                if (!nome_serie) {
                    if (file) fs.unlinkSync(file.path);
                    return res.status(400).json({ message: 'nome de serie é obrigatório para obras do tipo trilogia, serie ou colecao' });
                }
            }

            const livroExistente = await livros.findOne({
                where: {
                    titulo: titulo,
                    autor: autor
                }
            });

            if (livroExistente) {
                if (file) fs.unlinkSync(file.path);
                return res.status(409).json({ message: 'Livro com mesmo título e autor já existe' });
            }

            if (ano_publicacao) {
                const anoAtual = new Date().getFullYear();
                const ano = parseInt(ano_publicacao);
                if (ano < 1400 || ano > anoAtual) {
                    if (file) fs.unlinkSync(file.path);
                    return res.status(400).json({ message: `Ano de publicação deve ser entre 1400 e ${anoAtual + 1}` });
                }
            }

            const paginas = parseInt(num_paginas);
            if (paginas < 1) {
                if (file) fs.unlinkSync(file.path);
                return res.status(400).json({ message: 'Número de páginas deve ser um inteiro positivo' });

            }

            let capaUrl = null;
            if (file) {
                capaUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
            }

            const novoLivro = await livros.create({
                titulo,
                subtitulo,
                autor,
                tipo_obra: tipo_obra || 'unico',
                nome_serie,
                ano_publicacao: ano_publicacao ? parseInt(ano_publicacao) : null,
                num_paginas: paginas,
                editora,
                genero,
                capa: capaUrl
            });
            console.log('Livro criado com ID:', novoLivro.id_livro);
            return res.status(201).json({ message: 'Livro cadastrado com sucesso', livro: novoLivro });
        } catch (error: any) {
            console.error('Erro ao cadastrar livro:', error);
        }
    }


   
}

