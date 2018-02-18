import * as jwt from 'jsonwebtoken'
import { Prisma, User, Role, ID_Output } from './generated/prisma'
import { AuthError, AuthUser, Scope, Auth } from './Auth';

export interface Context {
  db: Prisma
  request: any
  auth: Auth
}


