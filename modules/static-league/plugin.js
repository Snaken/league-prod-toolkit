const namespace = 'static-league'

module.exports = (ctx) => {
  const gameStatic = {
    constants: {
      seasons: require('./constants/seasons.json'),
      queues: require('./constants/queues.json'),
      maps: require('./constants/maps.json'),
      gameModes: require('./constants/gameModes.json'),
      gameTypes: require('./constants/gameTypes.json')
    }
  }

  // Answer requests to get state
  ctx.LPTE.on(namespace, 'request-constants', e => {
    ctx.LPTE.emit({
      meta: {
        type: e.meta.reply,
        namespace: 'reply',
        version: 1
      },
      constants: gameStatic.constants
    })
  })

  // Emit event that we're ready to operate
  ctx.LPTE.emit({
    meta: {
      type: 'plugin-status-change',
      namespace: 'lpt-core',
      version: 1
    },
    status: 'RUNNING'
  })
}
