const express = require('express');
const app = express();
const cors = require('cors')
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}))
const request = require('request');
const crypto = require('crypto');
require('dotenv').config()
const http = require('http').createServer(app)
const io = require('socket.io').listen(http)
const WebSocket = require('ws');

const apiKey = process.env.VUE_APP_API_KEY;
const apiSecret = process.env.VUE_APP_API_SECRET;
const ws = new WebSocket(process.env.VUE_APP_WSS_URL);

ws.on('open', () => {
  io.on('connection', (userSocket) => {
      userSocket.on('instrument', () => {
        ws.send(`{"op": "subscribe", "args": "instrument"}`);
        ws.on('message', (data) => {
          userSocket.emit('instrument:response', data)
        });
      })
      userSocket.on('quotes', (data) => {
        console.log(data)
        ws.send(`{"op": "subscribe", "args": "tradeBin1m:${data}"}`);
      })
      userSocket.on('quotes:unsubscribe', (data) => {
        console.log('unsubscribe', data)
        ws.send(`{"op": "unsubscribe", "args": "tradeBin1m:${data}"}`);
      })
    });
});

const createSignature = ({ verb, data, path, expires }) => {
  return crypto.createHmac('sha256', apiSecret).update(verb + path + expires + data).digest('hex');
}

const createRequestOptions = (req) => {
  const verb = req.method;
  const expires = Math.round(new Date().getTime() / 1000) + 60;
  const postBody = JSON.stringify(req.query);
  const signature = createSignature({ verb, path: req.path, data: postBody, expires });
  const headers = {
    'content-type' : 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'api-expires': expires,
    'api-key': apiKey,
    'api-signature': signature
  };
  return {
    headers: headers,
    url: process.env.VUE_APP_API_URL + req.path,
    method: verb,
    body: postBody
  };
}

app.get('/', (req, res) => {
  const requestOptions = createRequestOptions(req);
  request(requestOptions, (error, response, body) => {
    if (error) { console.log(error); }
    res.send(body);
  });
});
app.get('/api/v1/instrument/active', (req, res) => {
  const requestOptions = createRequestOptions(req);
  request(requestOptions, (error, response, body) => {
    if (error) { console.log(error); }
    res.send(body);
  });
});
app.get('/api/v1/trade/bucketed', (req, res) => {
  const requestOptions = createRequestOptions(req);
  request(requestOptions, (error, response, body) => {
    if (error) { console.log(error); }
    res.send(body);
  });
});
app.post('/api/v1/order', (req, res) => {
  const requestOptions = createRequestOptions(req);
  request(requestOptions, (error, response, body) => {
    if (error || JSON.parse(body).error) {
      res.status(500).send({ error: JSON.parse(body).error.message });
    } else {
      res.send(body);
    }
  });
});
app.get('/api/v1/order', (req, res) => {
  const requestOptions = createRequestOptions(req);
  request(requestOptions, (error, response, body) => {
    if (error) { console.log(error); }
    res.send(body);
  });
});
http.listen(80)