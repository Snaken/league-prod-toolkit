const updateUi = (state) => {
  $('#status').text(state.state);
};

const formLoadByName = async () => {
  const name = $('#name').val();

  await LPTE.emit({
    meta: {
      namespace: 'state-league',
      type: 'setgame',
      version: 1
    },
    by: 'summonerName',
    summonerName: name
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