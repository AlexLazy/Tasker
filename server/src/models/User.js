module.exports = (sequelize, type) => {
  const User = sequelize.define('user', {
    name: { type: type.STRING, allowNull: false },
    email: { type: type.STRING, allowNull: false, unique: 'email', validate: { isEmail: { args: true, msg: 'Invalie email' } } },
    avatar: { type: type.STRING, allowNull: false }
  })

  User.associate = models => {
    User.hasMany(models.Project, {
      foreignKey: 'authorId',
      onDelete: 'cascade'
    })

    User.belongsToMany(models.Project, {
      through: 'project_user'
    })

    User.hasMany(models.Task, {
      foreignKey: 'authorId',
      onDelete: 'cascade'
    })
  }
  return User
}