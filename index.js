const GphApiClient = require('giphy-js-sdk-core')
const argv = require('yargs').argv
const express = require('express')
const opn = require('opn');
const path = require('path');
const replace = require('replace-in-file');
const copy = require('copy');
const fs = require('fs');

const searchParam = argv.s;
const apiKey = argv.api;

client = GphApiClient(apiKey)

fs.copyFileSync('template.html', 'index.html')

var app = express()

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
})

app.listen(12345)

console.log('Loading GIFs... 🙏🏻');

client.search('gifs', {'q': searchParam})
  .then((response) => {
      console.log('GIFs loaded 😎');
      let gifList = response.data;
      let imageHtml = '';

      gifList.forEach(gif => {
          const url = gif.images.original.gif_url;
          const previewUrl = gif.images.fixed_width_downsampled.gif_url;
            imageHtml += `<button class="btn" data-clipboard-text="${url}"><img class="gifimg" src="${previewUrl}"></button>`;
      });

      const options = {
        files: path.join(__dirname + '/index.html'),
        from: /##content##/g,
        to: imageHtml,
      };

      replace.sync(options);

      opn('http://localhost:12345');

      setTimeout(() => {
        process.exit();
      }, 2000);

  })
  .catch((err) => {

  })