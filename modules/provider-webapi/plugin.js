module.exports = async (ctx) => {
  // Emit event that we're ready to operate
  ctx.LPTE.emit({
    meta: {
      type: 'plugin-status-change',
      namespace: 'lpt',
      version: 1
    },
    status: 'RUNNING'
  });

  // Wait for all plugins to load
  await ctx.LPTE.await('lpt', 'ready');

  const { config } = await ctx.LPTE.request({
    meta: {
      type: 'request',
      namespace: 'config',
      version: 1
    }
  });

  ctx.LPTE.on('provider-webapi', 'fetch-livegame', e => {
    ctx.LPTE.log.info('Fetching livegame data');
    console.log(e);
  });
  console.log(config);
};
