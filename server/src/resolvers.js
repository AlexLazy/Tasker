const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { AuthenticationError, } = require('apollo-server')

const createToken = user => jwt.sign(
  {
    sub: user.id,
    email: user.email,
    iss: process.env.API_URL,
    aud: process.env.API_URL
  },
  process.env.JWT_SECRET,
  { algorithm: 'HS256', expiresIn: '1d' }
);

const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10);
      }
      return null;
    },
  }),
  Query: {
    users: async (parent, args, { models }) => {
      try {
        return await models.User.findAll()
      } catch (err) {
        return err;
      }
    },
    projects: async (parent, args, { models, user }) => {
      try {
        const { projects } = await models.User.findByPk(user.sub, {
          include: [
            {
              model: models.Project,
              include: ['users', 'tasks']
            }
          ]
        })
        return projects
      } catch (err) {
        return err;
      }
    },
    project: async (parent, { id }, { models, user }) => {
      try {
        const project = await models.Project.findByPk(id, { include: ['tasks', 'users'] })
        if (project.users.every(({ id }) => id !== user.sub)) throw new AuthenticationError('Forbidden');
        return project
      } catch (err) {
        return err;
      }
    },
    tasks: async (parent, args, { models, user }) => {
      try {
        const { projects } = await models.User.findByPk(user.sub, {
          include: [
            {
              model: models.Project,
              include: ['tasks']
            }
          ]
        })

        return projects.reduce((prev, { tasks }) => prev.length > 0 ? [...prev, ...tasks] : tasks, [])
      } catch (err) {
        return err;
      }
    },
  },
  Mutation: {
    login: async (parent, args, { models }) => {
      try {
        const { id_token: idToken } = args
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
        const ticket = await client.verifyIdToken({
          idToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, picture: avatar } = ticket.getPayload();

        const [user, created] = await models.User.findOrCreate({
          where: { email },
          defaults: {
            name,
            avatar
          }
        })

        const token = createToken(user)
        const userInfo = { id: user.id, name: user.name, email: user.email, avatar: user.avatar }

        return {
          message: created ? 'User created' : 'Login successful',
          token,
          userInfo
        };
      } catch (err) {
        return err;
      }
    },
    addProject: async (parent, { title }, { models, user }) => {
      try {
        const project = await models.Project.create({ title, authorId: user.sub })
        await project.addUser(user.sub)

        return {
          message: 'Project was created',
          project: {
            id: project.id,
            title: project.title
          }
        };
      } catch (err) {
        return err;
      }
    },
    removeProject: async (parent, { id }, { models, user }) => {
      try {
        const project = await models.Project.destroy({ where: { authorId: user.sub, id } })

        return {
          message: 'Project was removed',
          project: {
            id: project.id,
            title: project.title
          }
        };
      } catch (err) {
        return err;
      }
    },
    addUserToProject: async (parent, { projectId, userId }, { models, user }) => {
      const transaction = await models.sequelize.transaction()
      try {
        const project = await models.Project.findOne({ where: { authorId: user.sub, id: projectId } }, { transaction })
        await project.addUser(userId, { transaction })
        await transaction.commit()

        return {
          message: 'User was added',
          project: {
            id: project.id,
            title: project.title
          }
        };
      } catch (err) {
        await transaction.rollback()
        return err;
      }
    },
    removeUserFromProject: async (parent, { projectId, userId }, { models, user }) => {
      const transaction = await models.sequelize.transaction()
      try {
        const project = await models.Project.findOne({ where: { authorId: user.sub, id: projectId } }, { transaction })
        await project.removeUser(userId, { transaction })
        await transaction.commit()

        return {
          message: 'User was removed',
          project: {
            id: project.id,
            title: project.title
          }
        };
      } catch (err) {
        await transaction.rollback()
        return err;
      }
    },
    addTask: async (parent, { projectId, content, price, priceTotal }, { models, user }) => {
      try {
        const project = await models.Project.findByPk(projectId)
        if (project.authorId !== user.sub) throw new AuthenticationError('Forbidden');
        const task = await project.createTask({ projectId, authorId: project.authorId, content, price, priceTotal })

        return {
          message: 'Task was created',
          task
        };
      } catch (err) {
        return err;
      }
    },
    updateTask: async (parent, { id, content, price, priceTotal, status }, { models, user }) => {
      try {
        const task = await models.Task.findByPk(id)
        const { users } = await models.Project.findByPk(task.projectId, { include: ['users'] })
        if (!users.some(({ id }) => id === user.sub)) throw new AuthenticationError('Forbidden');
        await task.update({ content, price, priceTotal, status })

        return {
          message: 'Task was updated',
          task
        };
      } catch (err) {
        return err;
      }
    },
    removeTask: async (parent, { id }, { models, user }) => {
      try {
        const task = await models.Task.findByPk(id)
        if (task.authorId !== user.sub) throw new AuthenticationError('Forbidden');
        await task.destroy()

        return {
          message: 'Task was removed',
          task
        };
      } catch (err) {
        return err;
      }
    },
  }
}

module.exports = {
  resolvers
}