/**
 * @file 启动 SF 服务器
 * @author wangyisheng@baidu.com (wangyisheng)
 */

const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const mime = require('mime')
const chalk = require('chalk')
const fs = require('fs-extra')

let STATIC_CACHE = Object.create(null)
let INDEX_CACHE

function serveStatic (filename) {
  return (ctx, next) => {
    ctx.set('Cache-Control', 'max-age=604800')

    if (STATIC_CACHE[filename]) {
      ctx.type = STATIC_CACHE[filename].type
      ctx.body = STATIC_CACHE[filename].content
    } else {
      let content = fs.readFileSync(path.resolve(__dirname, '../sf/', filename), 'utf8')
      let type = mime.getType(filename)
      STATIC_CACHE[filename] = {content, type}
      ctx.type = type
      ctx.body = content
    }
  }
}

module.exports = class SFServer {
  constructor ({port} = {}) {
    this.port = port || 8210

    this.app = new Koa()
    this.router = new Router()
  }

  run () {
    let record = async (ctx, next) => {
      console.log(chalk.green('INFO') + ` [request]: ${ctx.request.url}`)
      await next()
    }

    this.router
      .get('/sf/index.js', serveStatic('index.js'))
      .get('/sf/index.css', serveStatic('index.css'))
      .get(['/wishwing*', '/sf'], (ctx, next) => {
        if (INDEX_CACHE) {
          ctx.body = INDEX_CACHE
        } else {
          let content = fs.readFileSync(path.resolve(__dirname, '../sf/index.html'), 'utf8')
          ctx.body = INDEX_CACHE = content
          // ctx.body = content
        }
      })

    this.app
      .use(record)
      .use(this.router.routes())
      .listen(this.port)
  }
}
