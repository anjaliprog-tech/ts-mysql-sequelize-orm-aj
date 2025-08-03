import { DataTypes } from "sequelize";
import sequelize from "./db.ts";

const UserImage = sequelize.define('userImages', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER
  },
  path: {
    type: DataTypes.TEXT
  },
  filename: {
    type: DataTypes.TEXT
  },
  }, {
  timestamps: true
})

export default UserImage