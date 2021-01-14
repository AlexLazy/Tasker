const Sequelize = require('sequelize')

const sequelize = new Sequelize('tasker', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql'
});

const models = {
  User: require('./User')(sequelize, Sequelize),
  Project: require('./Project')(sequelize, Sequelize),
  Task: require('./Task')(sequelize, Sequelize)
}

Object.keys(models).forEach(modelName => {
  if ('associate' in models[modelName]) models[modelName].associate(models)
})

models.sequelize = sequelize
models.Sequelize = Sequelize

module.exports = models