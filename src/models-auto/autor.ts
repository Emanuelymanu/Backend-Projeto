import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface autorAttributes {
  id_autor?: number;
  nome?: string;
}

export type autorOptionalAttributes = "id_autor" | "nome";
export type autorCreationAttributes = Optional<autorAttributes, autorOptionalAttributes>;

export class autor extends Model<autorAttributes, autorCreationAttributes> implements autorAttributes {
  id_autor?: number;
  nome?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof autor {
    return autor.init({
    id_autor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nome: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'autor',
    timestamps: false
  });
  }
}
