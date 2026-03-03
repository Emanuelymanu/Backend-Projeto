import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { leituras, leiturasId } from './leituras';

export interface anotacoesAttributes {
  id_anotacao: number;
  id_leitura: number;
  pagina?: number;
  titulo?: string;
  conteudo: string;
  created_at: Date;
}

export type anotacoesPk = "id_anotacao";
export type anotacoesId = anotacoes[anotacoesPk];
export type anotacoesOptionalAttributes = "id_anotacao" | "pagina" | "titulo" | "created_at";
export type anotacoesCreationAttributes = Optional<anotacoesAttributes, anotacoesOptionalAttributes>;

export class anotacoes extends Model<anotacoesAttributes, anotacoesCreationAttributes> implements anotacoesAttributes {
  id_anotacao!: number;
  id_leitura!: number;
  pagina?: number;
  titulo?: string;
  conteudo!: string;
  created_at!: Date;

  // anotacoes belongsTo leituras via id_leitura
  id_leitura_leitura!: leituras;
  getId_leitura_leitura!: Sequelize.BelongsToGetAssociationMixin<leituras>;
  setId_leitura_leitura!: Sequelize.BelongsToSetAssociationMixin<leituras, leiturasId>;
  createId_leitura_leitura!: Sequelize.BelongsToCreateAssociationMixin<leituras>;

  static initModel(sequelize: Sequelize.Sequelize): typeof anotacoes {
    return anotacoes.init({
    id_anotacao: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_leitura: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'leituras',
        key: 'id_leitura'
      }
    },
    pagina: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    conteudo: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'anotacoes',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_anotacao" },
        ]
      },
      {
        name: "id_leitura",
        using: "BTREE",
        fields: [
          { name: "id_leitura" },
        ]
      },
      {
        name: "idx_pagina",
        using: "BTREE",
        fields: [
          { name: "pagina" },
        ]
      },
    ]
  });
  }
}
