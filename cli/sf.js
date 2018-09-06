/**
 * @file mip2 sf 主命令
 * @author wangyisheng@baidu.com (wangyisheng)
 */

const SFServer = require('../lib/SFServer')

module.exports = {
  cli: {
    config: {
      description: '启动线下 SF 调试环境',
      name: 'mip2 sf',
      options: [
        ['-p, --port <n>', '启动端口号', parseInt],
        ['-o, --autoopen', '自动打开页面']
      ],
      help: [
        '',
        '  Examples:',
        '',
        '    # 启动线下 SF 环境',
        '    $ mip2 sf',
        '',
        '    # 指定端口号（默认 8210）',
        '    $ mip2 sf -p 8080',
        '',
        '    # 自动打开页面',
        '    $ mip2 sf -o'
      ].join('\n')
    },
    main (args, opts) {
      let port = options.port || 8210
      let autoopen = options.autoopen || false

      let server = new SFServer({port, autoopen})
      server.run()
    }
  }
}
