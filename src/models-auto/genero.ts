import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface generoAttributes {
  id_genero: number;
  romance: string;
  ficcao: string;
  fantasia: string;
  politica: string;
  suspense: string;
  terror: string;
  triller: string;
}

export type generoPk = "id_genero";
export type generoId = genero[generoPk];
export type generoOptionalAttributes = "romance" | "ficcao" | "fantasia" | "politica" | "suspense" | "terror" | "triller";
export type generoCreationAttributes = Optional<generoAttributes, generoOptionalAttributes>;

export class genero extends Model<generoAttributes, generoCreationAttributes> implements generoAttributes {
  id_genero!: number;
  romance!: string;
  ficcao!: string;
  fantasia!: string;
  politica!: string;
  suspense!: string;
  terror!: string;
  triller!: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof genero {
    return genero.init({
    id_genero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    romance: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    ficcao: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    fantasia: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    politica: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    suspense: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    terror: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    triller: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'genero',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_genero" },
        ]
      },
    ]
  });
  }
}
