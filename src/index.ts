import { GraphQLServer } from 'graphql-yoga'
import { Prisma } from './generated/prisma'
import resolvers from './resolvers'
import { Auth } from './Auth';
import { Context } from './utils'

const directiveResolvers = {
  auth(next, src, args, context: Context) {
    const expectedScopes = args.scopes || [];
    if (
      context.auth.checkScopes(expectedScopes)
    ) {
      // Call next to continues process resolver.
      return next()
    }
  }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  directiveResolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      endpoint: process.env.PRISMA_ENDPOINT, // the endpoint of the Prisma DB service (value is set in .env)
      secret: process.env.PRISMA_SECRET, // taken from database/prisma.yml (value is set in .env)
      debug: false, // log all GraphQL queries & mutations
    }),
    auth: new Auth(
      req,
      process.env.APP_SECRET
    )
  }),
})

server.start(() => console.log(`Server is running on http://localhost:4000`))
