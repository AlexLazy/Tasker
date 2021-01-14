require('dotenv').config();
const jwt = require('jsonwebtoken')
const models = require('./src/models')

const { ApolloServer } = require('apollo-server')
const { typeDefs } = require('./src/schema')
const { resolvers } = require('./src/resolvers')
const AuthDirective = require('./src/AuthDirective')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    auth: AuthDirective
  },
  context: ({ req }) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return { models, user: null };
      }

      const user = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      return { models, user }
    } catch (err) {
      return { models, user: null };
    }
  }
})

models.sequelize.sync({ alter: true }).then(() => server.listen().then(({ url }) => {
  console.log(`Start at ${url}`);
}))

