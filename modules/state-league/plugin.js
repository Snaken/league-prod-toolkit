const extendLiveGameWithStatic = require('./extendLiveGameWithStatic');

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

  // Set game
  ctx.LPTE.on(namespace, 'set-game', async e => {
    const replyMeta = {
      namespace: 'reply',
      type: e.meta.reply,
      version: 1
    };

    // Load game using provider-webapi
    ctx.log.debug(`Loading livegame for summoner=${e.summonerName}`);
    const gameResponse = await ctx.LPTE.request({
      meta: {
        namespace: 'provider-webapi',
        type: 'fetch-livegame',
        version: 1
      },
      summonerName: e.summonerName
    });

    if (!gameResponse || gameResponse.failed) {
      ctx.log.info(`Loading livegame failed for summoner=${e.summonerName}`);
      ctx.LPTE.emit({
        meta: replyMeta
      });
      return;
    }

    const staticData = await ctx.LPTE.request({
      meta: {
        namespace: 'static-league',
        type: 'request-constants',
        version: 1
      }
    });

    gameState.webLive = extendLiveGameWithStatic(gameResponse.game, staticData.constants);
    gameState.state = 'SET';
    ctx.LPTE.emit({
      meta: replyMeta,
      webLive: gameResponse.game
    });
  });

  ctx.LPTE.on(namespace, 'unset-game', e => {
    gameState.state = 'UNSET';

    ctx.LPTE.emit({
      meta: {
        namespace: 'reply',
        type: e.meta.reply,
        version: 1
      }
    });
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
