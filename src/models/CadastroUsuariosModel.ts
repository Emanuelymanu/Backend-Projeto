import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/connection";
import bcrypt from 'bcrypt';

class CadastroUsuarios extends Model {
    public id!: number;
    public nome!: string;
    public email!: string;
    public senha!: string;
    public cpf!: string;
    public readonly createdAt!: Date;
    public readonly updateAt!: Date;

    public async compararSenha(senhaDigitada: string): Promise<boolean> {
        return bcrypt.compare(senhaDigitada, this.senha);
    }
}

CadastroUsuarios.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "O nome é obrigatório." }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: { msg: "O email deve ser válido." },
                notEmpty: { msg: "O email é obrigatório." },
                is: {
                    args: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    msg: "O email deve seguir o formato: usuario@dominio.com"
                }
            }
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "A senha é obrigatória." },
                len: {
                    args: [6, 100],
                    msg: "A senha deve ter no mínimo 6 caracteres."
                }
            }
        },
        cpf: {
            type: DataTypes.STRING(11),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: { msg: "O CPF é obrigatório." },
            }
        },
    },
    {
        sequelize,
        tableName: "usuarios",
        timestamps: false,
        hooks:{
            beforeCreate: async(usuario: CadastroUsuarios) => {
                if (usuario.senha){
                    const salt = await bcrypt.genSalt(10);
                    usuario.senha = await bcrypt.hash(usuario.senha, salt);
                }
            },
            beforeUpdate: async (usuario: CadastroUsuarios) => {
                if (usuario.changed('senha')){
                    const salt = await bcrypt.genSalt(10);
                    usuario.senha = await bcrypt.hash(usuario.senha, salt); 
                }
            }
        }
    }
);

export default CadastroUsuarios;
