import { Context } from '../utils'

export const Query = {
  feed(parent, args, ctx: Context, info) {
    return ctx.db.query.posts({ where: { isPublished: true } }, info)
  },

  drafts(parent, args, ctx: Context, info) {
    const id = ctx.auth.getUserId()

    const where = {
      isPublished: false,
      author: {
        id
      }
    }

    return ctx.db.query.posts({ where }, info)
  },

  post(parent, { id }, ctx: Context, info) {
    return ctx.db.query.post({ where: { id: id } }, info)
  },

  me(parent, args, ctx: Context, info) {
    const id = ctx.auth.getUserId()
    return ctx.db.query.user({ where: { id } }, info)
  },

  async users(parent, args, ctx: Context, info) {
    return ctx.db.query.users(args, info)
  },
}
