import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./db.ts";

// const User = sequelize.define('users', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   email: {
//     type: DataTypes.STRING
//   },
//   password: {
//     type: DataTypes.STRING
//   },
//   name: {
//     type: DataTypes.STRING
//   },
//   }, {
//   timestamps: true
// })

// export default User


interface UserAttributes {
  id: number;
  name: string;
  email: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;


  static associate(models: any) {
    User.hasMany(models.UserImage, { foreignKey: 'user_id' });
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'users',
    sequelize,
    timestamps: false,
  }
);

export default User;
