module.exports = (sequelize, type) => {
  const Task = sequelize.define('task', {
    content: { type: type.TEXT, allowNull: false },
    price: { type: type.INTEGER, defaultValue: 0 },
    priceTotal: { type: type.INTEGER, defaultValue: 0 },
    status: { type: type.ENUM('OPENED', 'CHECKING', 'CLOSED'), defaultValue: "OPENED" }
  })

  Task.associate = models => {
    Task.belongsTo(models.Project)
    Task.belongsTo(models.User, {
      foreignKey: 'authorId'
    })
  }
  return Task
}