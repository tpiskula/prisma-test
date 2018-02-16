import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { Context } from '../../utils'
import { User } from '../../generated/prisma';

function getToken(user: User) {
  return jwt.sign({ userId: user.id, name: user.name,email: user.email }, process.env.APP_SECRET)
}

export const auth = {
  async signup(parent, args, ctx: Context, info) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await ctx.db.mutation.createUser({
      data: { ...args, password },
    })

    return {
      token: getToken(user),
      user,
    }
  },

  async login(parent, { email, password }, ctx: Context, info) {
    const user = await ctx.db.query.user({ where: { email } })
    if (!user) {
      throw new Error(`No such user found for email: ${email}`)
    }

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
