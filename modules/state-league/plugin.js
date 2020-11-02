const namespace = 'state-league';

module.exports = (ctx) => {
  const gameState = {
    state: 'UNSET',
    webLive: {},
    webPost: {},
    lcu: {},
    ingameSpectator: {}
  };

  // Register new UI page
  ctx.LPTE.emit({
    meta: {
      type: 'add-pages',
      namespace: 'ui',
      version: 1
    },
    pages: [{
      name: 'LoL Game: Operator',
      frontend: 'frontend',
      id: 'op-lol-game'
    }]
  });

  // Answer requests to get state
  ctx.LPTE.on(namespace, 'request', e => {
    ctx.LPTE.emit({
      meta: {
        type: e.meta.reply,
        namespace: 'reply',
        version: 1
      },
      state: gameState
    });
  });

  // Register new namespace (this will make it show up in the web ui filtering)
  /* ctx.LPTE.emit({
    meta: {
      type: 'register-namespace',
      namespace: 'lpt',
      version: 1
    },
    namespace
  }); */

  // Set game
  ctx.LPTE.on(namespace, 'setgame', async e => {
    // Load game using provider-webapi
    ctx.log.debug('Loading livegame for summoner=' + e.summonerName);
    const { game } = await ctx.LPTE.request({
      meta: {
        namespace: 'provider-webapi',
        type: 'fetch-livegame',
        version: 1
      },
      summonerName: e.summonerName
    });

    gameState.webLive = game;
    gameState.state = 'SET';
  });

  // Emit event that we're ready to operate
  ctx.LPTE.emit({
    meta: {
      type: 'plugin-status-change',
      namespace: 'lpt',
      version: 1
    },
    status: 'RUNNING'
  });
};
