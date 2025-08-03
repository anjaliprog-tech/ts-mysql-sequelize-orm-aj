import sequelize  from "./db.ts";
import User from "./user.ts";
import UserImage from "./userImage.ts";

// User.hasMany(UserImage, { foreignKey: 'user_id' });
// UserImage.belongsTo(User, { foreignKey: 'user_id' });


User.associate();

export {
  sequelize,
  User,
  UserImage
}