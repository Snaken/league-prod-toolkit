window.LPTE = {};

const postJson = (url, request) => {
  var headers = new Headers();
  headers.append('Content-Type', 'application/json');

  var body = JSON.stringify(request);

  var requestOptions = {
    method: 'POST',
    headers,
    body,
    redirect: 'follow'
  };

  return fetch(url, requestOptions)
    .then(response => response.json());
}

window.LPTE.request = async request => {
  return await postJson('/api/events/request', request);
}

window.LPTE.emit = async request => {
  return await postJson('/api/events/ingest', request);
}

const oneWayBinding = (container, data) => {
  const containerDom = $(`#${container}`);

  containerDom.find('*').each((index, child) => {
    const childDom = $(child);
    const dataName = childDom.attr('data-jspath');
    if (dataName) {
      let value = JSPath.apply(dataName, data);
      if (value.length > 0) {
        value = value[0]
      } else {
        value = '';
      }
      console.log(value);

      if (childDom.attr('data-isdate') !== undefined) {
        value = new Date(value).toString();
      }

      if (childDom.attr('data-isteam') !== undefined) {
        value = value === 100 ? 'blue' : 'red';
      }

      childDom.text(value);
    }
  });
}