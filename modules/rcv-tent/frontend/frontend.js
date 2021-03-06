const updateUi = (state) => {
  $('#gold-embed').val(`${location.href}/gfx/gold.html`);
  $('#damage-embed').val(`${location.href}/gfx/end-of-game.html?damage`);
  $('#items-embed').val(`${location.href}/gfx/end-of-game.html`);
}

const updateState = async () => {
  updateUi();
}

updateState();
setInterval(updateState, 1000);