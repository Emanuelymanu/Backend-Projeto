import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { leituras, leiturasId } from './leituras';
import type { tags, tagsId } from './tags';

export interface usuariosAttributes {
  id_usuario: number;
  nome: string;
  email: string;
  cpf: string;
  senha: string;
}

export type usuariosPk = "id_usuario";
export type usuariosId = usuarios[usuariosPk];
export type usuariosOptionalAttributes = "nome" | "email" | "cpf" | "senha";
export type usuariosCreationAttributes = Optional<usuariosAttributes, usuariosOptionalAttributes>;

export class usuarios extends Model<usuariosAttributes, usuariosCreationAttributes> implements usuariosAttributes {
  id_usuario!: number;
  nome!: string;
  email!: string;
  cpf!: string;
  senha!: string;

  // usuarios hasMany leituras via id_usuario
  leituras!: leituras[];
  getLeituras!: Sequelize.HasManyGetAssociationsMixin<leituras>;
  setLeituras!: Sequelize.HasManySetAssociationsMixin<leituras, leiturasId>;
  addLeitura!: Sequelize.HasManyAddAssociationMixin<leituras, leiturasId>;
  addLeituras!: Sequelize.HasManyAddAssociationsMixin<leituras, leiturasId>;
  createLeitura!: Sequelize.HasManyCreateAssociationMixin<leituras>;
  removeLeitura!: Sequelize.HasManyRemoveAssociationMixin<leituras, leiturasId>;
  removeLeituras!: Sequelize.HasManyRemoveAssociationsMixin<leituras, leiturasId>;
  hasLeitura!: Sequelize.HasManyHasAssociationMixin<leituras, leiturasId>;
  hasLeituras!: Sequelize.HasManyHasAssociationsMixin<leituras, leiturasId>;
  countLeituras!: Sequelize.HasManyCountAssociationsMixin;
  // usuarios hasMany tags via id_usuario
  tags!: tags[];
  getTags!: Sequelize.HasManyGetAssociationsMixin<tags>;
  setTags!: Sequelize.HasManySetAssociationsMixin<tags, tagsId>;
  addTag!: Sequelize.HasManyAddAssociationMixin<tags, tagsId>;
  addTags!: Sequelize.HasManyAddAssociationsMixin<tags, tagsId>;
  createTag!: Sequelize.HasManyCreateAssociationMixin<tags>;
  removeTag!: Sequelize.HasManyRemoveAssociationMixin<tags, tagsId>;
  removeTags!: Sequelize.HasManyRemoveAssociationsMixin<tags, tagsId>;
  hasTag!: Sequelize.HasManyHasAssociationMixin<tags, tagsId>;
  hasTags!: Sequelize.HasManyHasAssociationsMixin<tags, tagsId>;
  countTags!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof usuarios {
    return usuarios.init({
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: ""
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: ""
    },
    cpf: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: ""
    },
    senha: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'usuarios',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_usuario" },
        ]
      },
    ]
  });
  }
}
