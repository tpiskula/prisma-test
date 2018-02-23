import * as jwt from 'jsonwebtoken'
import { User, Role, ID_Output } from './generated/prisma'
import { ContextParameters } from "graphql-yoga/dist/src/types";


export interface AuthUser {
    id: ID_Output
    email: string
    name: string
    roles?: Role[]
    scopes?: Scope[]
}
  
export type Scope = string
  

export class AuthError extends Error {
    constructor() {
      super('Not authorized')
    }
};

export class Auth {

    context: ContextParameters
    secret: String

    constructor(ctx: ContextParameters, jwtSecret: string) {
        this.context = ctx;
        this.secret = jwtSecret;
    }

    getUser() : AuthUser {
        const Authorization = this.context.request.get('Authorization')
        if (Authorization) {
          const token = Authorization.replace('Bearer ', '')
          try {
            const user = jwt.verify(token, this.secret) as User
            return user
          }
          catch {
            throw new AuthError()
          }
        }
        throw new AuthError()
    }

    getUserId() {
        return this.getUser().id
    }
      
      
    checkRole(role: Role) : ID_Output {
        const user = this.getUser()
        if(!user.roles.includes(role))
        {
            throw new AuthError()
        }
        return user.id;
    }
      
    checkScope(scope: Scope) : ID_Output {
        const user = this.getUser()
        if(!user.scopes.includes(scope))
        {
            throw new AuthError()
        }
        return user.id;
    }

    checkScopes(scopes: [Scope]) : ID_Output {
        const user = this.getUser()
        if(!scopes.some(sc => user.scopes.includes(sc)))
        {
            throw new AuthError()
        }
        return user.id;
    }

    static getToken(user: User, scopes?: Scope[]) : string {
        return jwt.sign({ 
            id: user.id,
            name: user.name,
            email: user.email,
            scopes: scopes 
        }, 
        process.env.APP_SECRET,{
            expiresIn: 60 * 60,
        })
    }
};