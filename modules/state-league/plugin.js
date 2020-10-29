const namespace = 'state-league';

module.exports = (ctx) => {
  const gameState = {
    state: 'UNSET',
    webLive: {},
    webPost: {},
    lcu: {},
    ingameSpectator: {}
  };

  // Answer requests to get state
  ctx.LPTE.on(namespace, 'request', e => {
    ctx.LPTE.emit({
      meta: {
        type: 'state',
        namespace,
        version: 1
      },
      state: gameState
    });
  });

  // Register new namespace (this will make it show up in the web ui filtering)
  ctx.LPTE.emit({
    meta: {
      type: 'register-namespace',
      namespace: 'lpt',
      version: 1
    },
    namespace
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
