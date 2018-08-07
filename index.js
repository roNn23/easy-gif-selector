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
class EasyGifSelector {
  constructor(height, width) {
    this.prepareTemplate();
    this.startServer();
    this.loadGifs();
  }

  prepareTemplate() {
    fs.copyFileSync('template.html', 'index.html')
  }

  startServer() {
    const app = express()

    app.get('/', function (req, res) {
      res.sendFile(path.join(__dirname + '/index.html'));
    })

    app.listen(12345)
  }

  loadGifs() {
    const giphyClient = GphApiClient(apiKey)

    console.log('Loading GIFs... 🙏🏻');

    giphyClient.search('gifs', {'q': searchParam})
      .then((response) => {
          console.log('GIFs loaded 😎');
          let gifList = response.data;
          let imageHtml = '';

          // build images
          gifList.forEach(gif => {
              const url = gif.images.original.gif_url;
              const previewUrl = gif.images.fixed_width_downsampled.gif_url;
                imageHtml += `<button class="btn" data-clipboard-text="${url}"><img class="gifimg" src="${previewUrl}"></button>`;
          });

          // put images into template
          replace.sync({
            files: path.join(__dirname + '/index.html'),
            from: /##content##/g,
            to: imageHtml,
          });

          opn('http://localhost:12345');

          setTimeout(() => {
            process.exit();
          }, 3000);
      })
      .catch((err) => {
        console.log('Somethin went wrong 😩');
      })
  }
}

new EasyGifSelector();