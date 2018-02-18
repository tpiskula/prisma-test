import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { Context, Scope } from '../../utils'
import { User } from '../../generated/prisma';

const userQuery = `
  query ($email: String!) {
    user(where: {email: $email}) {
      id
      name
      email
      password
      roles
    }
  }
`

function getToken(user: User) {
  let scopes : Scope[] = ['user','feed'];
  if(user.roles.includes('ADMIN')) {
    scopes.push('users')
  }
  return jwt.sign({ id: user.id, name: user.name,email: user.email,roles:user.roles, scopes: scopes }, process.env.APP_SECRET)
}

async function queryUserByMail(ctx: Context,email: String) : Promise<User> {
  const variables = { email: email }
  return ctx.db.request(userQuery, variables)
}

export const auth = {
  async signup(parent, args, ctx: Context, info) {
    const password = await bcrypt.hash(args.password, 10)
    let user = await ctx.db.mutation.createUser({
      data: { ...args,roles:{set:"USER"}, password },
    })
    user = await queryUserByMail(ctx,user.email)
    return {
      token: getToken(user),
      user,
    }
  },

  async login(parent, { email, password }, ctx: Context, info) {
    const user = await queryUserByMail(ctx,email)
    if (!user) {
      throw new Error(`No such user found for email: ${email}`)
    }
    console.log("User:",user.roles)
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new Error('Invalid password')
    }

    return {
      token: getToken(user),
      user,
    }
  },
}
