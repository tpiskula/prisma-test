import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import * as R from 'ramda'
import { Context } from '../../utils'
import { Scope, Auth } from '../../Auth'
import { User } from '../../generated/prisma'
const userQuery = `
  query ($email: String!) {
    user(where: {email: $email}) {
      id
      name
      email
      password
      roles {
        name
        scopes
      }
    }
  }
`


async function queryUserByMail(ctx: Context,email: String) : Promise<User> {
  const variables = { email: email }
  return ctx.db.request(userQuery, variables)
}

export const auth = {
  async signup(parent, args, ctx: Context, info) {
    const password = await bcrypt.hash(args.password, 10)
    let user = await ctx.db.mutation.createUser({
      data: { ...args,roles:{connect:{name:"USER"}}, password },
    })
    user = await queryUserByMail(ctx,user.email)
    const scopes = [].concat.apply([],user.roles.map(r => r.scopes));
    return {
      token: Auth.getToken(user,scopes),
      user,
    }
  },

  async login(parent, { email, password, scopes }, ctx: Context, info) {
    const user = await queryUserByMail(ctx,email)
    if (!user) {
      throw new Error(`No such user found for email: ${email}`)
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new Error('Invalid password')
    }

    const allowedScopes = R.uniq(R.flatten(user.roles.map(r => r.scopes)));
    console.log(allowedScopes);
    // TODO get allowed scopes from db user/roles
    let requestedScopes : Scope[] = scopes || allowedScopes;
    const validScopes = requestedScopes.map((scope) => {
        if(!allowedScopes.includes(scope)){
          throw new Error('Invalid scope requested')
        }
        return scope;
    }).filter(s => s)

    return {
      token: Auth.getToken(user,validScopes),
      user,
    }
  },
}
