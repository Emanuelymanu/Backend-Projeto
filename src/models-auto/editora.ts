import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface editoraAttributes {
  id_editora: number;
  nome?: number;
}

export type editoraOptionalAttributes = "nome";
export type editoraCreationAttributes = Optional<editoraAttributes, editoraOptionalAttributes>;

export class editora extends Model<editoraAttributes, editoraCreationAttributes> implements editoraAttributes {
  id_editora!: number;
  nome?: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof editora {
    return editora.init({
    id_editora: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nome: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'editora',
    timestamps: false
  });
  }
}
