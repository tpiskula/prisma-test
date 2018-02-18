import * as jwt from 'jsonwebtoken'
import { Prisma, User, Role, ID_Output } from './generated/prisma'

export interface Context {
  db: Prisma
  request: any
}

export interface AuthUser {
  id: ID_Output
  email: String
  name: String
  roles?: Role[]
  scopes?: Scope[]
}

export type Scope = 
  'user' |
  'feed' |
  'drafts' |
  'post' |
  'users'

export function getUserId(ctx: Context) {
  return getUser(ctx).id
}

export function getUser(ctx: Context) : AuthUser {
  const Authorization = ctx.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const user = jwt.verify(token, process.env.APP_SECRET) as User
    return user
  }
  throw new AuthError()
}

export function checkRole(ctx: Context, role: Role) : ID_Output {
  const user = getUser(ctx)
  if(!user.roles.includes(role))
  {
    throw new AuthError()
  }
  return user.id;
}

export function checkScope(ctx: Context, scope: Scope) : ID_Output {
  const user = getUser(ctx)
  if(!user.scopes.includes(scope))
  {
    throw new AuthError()
  }
  return user.id;
}

export class AuthError extends Error {
  constructor() {
    super('Not authorized')
  }
}
