const LeagueJS = require('leagueJs')

module.exports = async (ctx) => {
  let config = {}

  ctx.LPTE.on('provider-webapi', 'fetch-livegame', async e => {
    ctx.log.info(`Fetching livegame data for summoner=${e.summonerName}`)

    const replyMeta = {
      type: e.meta.reply,
      namespace: 'reply',
      version: 1
    }

    let summonerInfo
    try {
      summonerInfo = await riotApi.Summoner.gettingByName(e.summonerName)
    } catch (error) {
      ctx.log.error(`Failed to get information for summoner=${e.summonerName}. Maybe this summoner does not exist? error=${error}`)
      ctx.LPTE.emit({
        meta: replyMeta,
        failed: true
      })
      return
    }

    let gameInfo
    try {
      gameInfo = await riotApi.Spectator.gettingActiveGame(summonerInfo.id)
    } catch (error) {
      ctx.log.error(`Failed to get spectator game information for summoner=${e.summonerName}, encryptedId=${summonerInfo.id}. Maybe this summoner is not ingame currently? error=${error}`)
      ctx.LPTE.emit({
        meta: replyMeta,
        failed: true
      })
      return
    }

    ctx.log.info(`Fetched livegame for summoner=${e.summonerName}, gameId=${gameInfo.gameId}`)
    ctx.LPTE.emit({
      meta: replyMeta,
      game: gameInfo,
      failed: false
    })
  })

  // Wait for all plugins to load
  await ctx.LPTE.await('lpt-core', 'ready')

  const response = await ctx.LPTE.request({
    meta: {
      type: 'request',
      namespace: 'config',
      version: 1
    }
  })
  config = response.config

  const riotApi = new LeagueJS(config.apiKey, {
    PLATFORM_ID: 'euw1'
  })

  // Emit event that we're ready to operate
  ctx.LPTE.emit({
    meta: {
      type: 'plugin-status-change',
      namespace: 'lpt-provider',
      version: 1
    },
    status: 'RUNNING'
  })
}
