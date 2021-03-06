const updateUi = data => {
  if (data.state === 'HIDDEN') {
    $('.blue-box').addClass('hidden');
    $('.red-box').addClass('hidden');
    console.log('state is hidden')
  } else {
    const num = parseInt(data.state);

    const championMapping = {
      1: 1,
      2: 6,
      3: 2,
      4: 7,
      5: 3,
      6: 8,
      7: 4,
      8: 9,
      9: 5,
      10: 10
    }

    const champion = data.participants[championMapping[num] - 1].champion
    const splashLink = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`

    // if not dividable by two, it's blue team (start turn 1)
    if (num % 2 !== 0) {
      console.log('state set to blue team')
      $('.red-box').addClass('hidden');
      $('.blue-box').removeClass('hidden');

      $('.blue-box').css('background-image', `url(${splashLink})`);
    } else { // it's red team
      console.log('state set to read team')
      $('.blue-box').addClass('hidden');
      $('.red-box').removeClass('hidden');

      $('.red-box').css('background-image', `url(${splashLink})`);
    }
  }
}

const tick = async () => {
  const data = await this.LPTE.request({
    meta: {
      namespace: 'rcv-rune-gfx',
      type: 'request',
      version: 1
    }
  });
  updateUi(data.state);
}

tick();
setInterval(tick, 500);
