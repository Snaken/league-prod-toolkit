const { RiotAPI, RiotAPITypes, PlatformId } = require('@fightmegg/riot-api');

module.exports = async (ctx) => {
  let config = {};
  let rAPI;

  // Emit event that we're ready to operate
  ctx.LPTE.emit({
    meta: {
      type: 'plugin-status-change',
      namespace: 'lpt',
      version: 1
    },
    status: 'RUNNING'
  });

  ctx.LPTE.on('provider-webapi', 'fetch-livegame', async e => {
    ctx.log.info('Fetching livegame data for summoner=' + e.summonerName);

    const summonerInfo = await rAPI.summoner.getBySummonerName({
      region: PlatformId.EUW1,
      summonerName: e.summonerName
    });

    const gameInfo = await rAPI.spectator.getBySummonerId({
      region: PlatformId.EUW1,
      summonerId: summonerInfo.id
    });

    ctx.LPTE.emit({
      meta: {
        type: e.meta.reply,
        namespace: 'reply',
        version: 1
      },
      game: gameInfo
    });
  });

  // Wait for all plugins to load
  await ctx.LPTE.await('lpt', 'ready');

  const response = await ctx.LPTE.request({
    meta: {
      type: 'request',
      namespace: 'config',
      version: 1
    }
  });
  config = response.config;

  rAPI = new RiotAPI(config.apiKey);
};
