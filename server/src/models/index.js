const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_LOGIN, process.env.DB_PASSWORD, {
  host: process.env.DB_URI,
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