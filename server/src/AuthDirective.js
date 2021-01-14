
const { AuthenticationError, } = require('apollo-server')
const { SchemaDirectiveVisitor } = require('graphql-tools');
const { defaultFieldResolver } = require('graphql');

class AuthDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.ensureFieldsWrapped(type);
  }

  ensureFieldsWrapped(objectType) {
    if (objectType._authFieldsWrapped) return;
    objectType._authFieldsWrapped = true;
    const fields = objectType.getFields();

    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName];
      if (field.name === 'login') return
      const { resolve = defaultFieldResolver } = field;

      field.resolve = async function (...args) {
        const context = args[2];
        const { user } = context;

        if (!user) {
          throw new AuthenticationError('Not authorized');
        }

        return resolve.apply(this, args);
      };
    });
  }
}

module.exports = AuthDirective