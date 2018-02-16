import * as jwt from 'jsonwebtoken'
import { Prisma, User, Role } from './generated/prisma'

export interface Context {
  db: Prisma
  request: any
}

export function getUserId(ctx: Context) {
  return getUser(ctx).id
}

export function getUser(ctx: Context) : User {
  const Authorization = ctx.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const user = jwt.verify(token, process.env.APP_SECRET) as User
    return user
  }
  throw new AuthError()
}

export function checkRole(ctx: Context, role: Role) : boolean {
  const user = getUser(ctx)
  if(!user.roles.includes(role))
  {
    throw new AuthError()
  }
  return true;
}

export class AuthError extends Error {
  constructor() {
    super('Not authorized')
  }
}
