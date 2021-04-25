module.exports = (state, constants) => ({
  ...state,
  gameQueueConstants: constants.queues.filter(q => q.queueId === state.gameQueueConfigId)[0],
  gameModeConstants: constants.gameModes.filter(gm => gm.gameMode === state.gameMode)[0],
  gameTypeConstants: constants.gameTypes.filter(gt => gt.gametype === state.gameType)[0],
  mapConstants: constants.maps.filter(m => m.mapId === state.mapId)[0]
})
