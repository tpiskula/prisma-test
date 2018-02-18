import { Context } from '../utils'

export const Query = {
  feed(parent, args, ctx: Context, info) {
    ctx.auth.checkScope("feed")
    
    return ctx.db.query.posts({ where: { isPublished: true } }, info)
  },

  drafts(parent, args, ctx: Context, info) {
    const id = ctx.auth.checkScope("drafts")

    const where = {
      isPublished: false,
      author: {
        id
      }
    }

    return ctx.db.query.posts({ where }, info)
  },

  post(parent, { id }, ctx: Context, info) {
    ctx.auth.checkScope("post")
    return ctx.db.query.post({ where: { id: id } }, info)
  },

  me(parent, args, ctx: Context, info) {
    const id = ctx.auth.checkScope("user")
    return ctx.db.query.user({ where: { id } }, info)
  },

  async users(parent, args, ctx: Context, info) {
    ctx.auth.checkScope("users")
    
    return ctx.db.query.users(args, info)
  },
}
