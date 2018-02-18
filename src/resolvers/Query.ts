import { getUserId, Context, getUser, AuthError, checkRole, checkScope } from '../utils'

export const Query = {
  feed(parent, args, ctx: Context, info) {
    checkScope(ctx,"feed")
    
    return ctx.db.query.posts({ where: { isPublished: true } }, info)
  },

  drafts(parent, args, ctx: Context, info) {
    const id = checkScope(ctx,"drafts")

    const where = {
      isPublished: false,
      author: {
        id
      }
    }

    return ctx.db.query.posts({ where }, info)
  },

  post(parent, { id }, ctx: Context, info) {
    checkScope(ctx,"post")
    return ctx.db.query.post({ where: { id: id } }, info)
  },

  me(parent, args, ctx: Context, info) {
    const id = checkScope(ctx,"user")
    return ctx.db.query.user({ where: { id } }, info)
  },

  async users(parent, args, ctx: Context, info) {
    checkScope(ctx,"users")
    
    return ctx.db.query.users(args, info)
  },
}
