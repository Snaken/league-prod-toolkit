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