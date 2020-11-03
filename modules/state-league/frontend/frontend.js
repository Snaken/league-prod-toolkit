const updateUi = (state) => {
  $('#status').text(state.state);

  if (state.state === 'SET' && state.webLive.gameId) {
    $('#gameinfo-container').css('display', 'block');
    $('#setgame-container').css('display', 'none');
  } else {
    $('#gameinfo-container').css('display', 'none');
    $('#setgame-container').css('display', 'block')
  }

  oneWayBinding('gameinfo-container', state.webLive);

  /* $('.data--game_id').text(state.webLive.gameId);
  $('.data--game_start').text(new Date(state.webLive.gameStartTime).toLocaleString());
  $('.data--game_platform').text(state.webLive.platformId); */
};

const formLoadByName = async () => {
  const name = $('#name').val();

  await LPTE.request({
    meta: {
      namespace: 'state-league',
      type: 'set-game',
      version: 1
    },
    by: 'summonerName',
    summonerName: name
  });

  await updateState();
}

const formUnsetGame = async () => {
  await LPTE.request({
    meta: {
      namespace: 'state-league',
      type: 'unset-game',
      version: 1
    }
  });

  await updateState();
}

const updateState = async () => {
  const response = await LPTE.request({
    meta: {
      namespace: 'state-league',
      type: 'request',
      version: 1
    }
  });

  console.log(response);
  updateUi(response.state);
}

const start = async () => {
  await updateState();
};

start();