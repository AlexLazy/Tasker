module.exports = (sequelize, type) => {
  const Project = sequelize.define('project', {
    title: { type: type.STRING, allowNull: false }
  })

  Project.associate = models => {
    Project.belongsTo(models.User, {
      foreignKey: 'authorId'
    })

    Project.belongsToMany(models.User, {
      through: 'project_user'
    })

    Project.hasMany(models.Task)
  }
  return Project
}