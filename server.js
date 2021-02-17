const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const querystring = require('query-string')
const base64url = require('base64url');

const express = require('express');
const { cli } = require('webpack');
const app = express();
const PORT = 3000;

const client_id = ''//enter id
const client_secret = ''//enter secret
const app_scopes = 'streaming playlist-modify-public'
const proxyurl = "https://cors-anywhere.herokuapp.com/";

let dbLocation = path.resolve(__dirname, '../solo-p/db/session.json');
let TOKEN = '';

var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));


app.get('/anime/:animeID', (req, res, next) => {

    const id = req.params.animeID;
    console.log('finding anime: ', id)
    fetch(`https://api.jikan.moe/v3/anime/${id}`)
        .then(res => res.json())
        .then((anime) => {
            return res.status(200).send(anime);
        })
        .catch((err) => next(err));


})

app.get('/anime', (req, res) => {
    console.log('in server', req.query.search);
    const search = req.query.search;

    fetch(`https://api.jikan.moe/v3/search/anime?q=${search}&limit=9&genre_exclude=12`)
        .then(res => res.json())
        .then((anime) => {
            return res.status(200).send(anime.results);
        })
        .catch((err) => next(err));

})

app.get('/getUser', (req, res) => {
    fetch('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': `Bearer ${TOKEN}` }
    })
        .then(res => res.json())
        .then(user => {
            console.log(user);

            inSession = { inSession: { userName: user.display_name, Token: TOKEN } };
            fs.writeFileSync(dbLocation, JSON.stringify(inSession, null, 2))
            return res.send(user);
        })
})

app.get('/getSong/:title', (req, res) => {
    const qTitle = req.params.title;
    console.log('spotifying: ', qTitle)

    fetch(`https://api.spotify.com/v1/search?q=${qTitle}&type=track&limit=1`, {
        headers: { 'Authorization': `Bearer ${TOKEN}` }
    })
        .then(res => res.json())
        .then(item => {

            const url = item.tracks.items[0].external_urls.spotify;
            console.log("SONG: ", item.tracks.items[0].external_urls.spotify)
            return res.json(url);
        })
        .catch(err => res.status(400).send('error in getSong'))
})

app.get('/login', (req, res) => {

    res.redirect(`https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&${querystring.stringify({ redirect_uri: 'http://localhost:8080/callback' })}&${querystring.stringify({ scope: app_scopes })}`);
})

app.get('/callback', (req, res) => {
    const code = req.query.code;
    console.log('code: ', code)

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', 'http://localhost:8080/callback');

    const buf = base64url(client_id + ":" + client_secret);
    console.log("BUF: ", buf)

    //console.log('param body: ', params);

    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: params,
        headers: {
            'Authorization': `Basic ${buf}`
        }
    })
        .then(res => res.json())
        .then(access => {
            console.log('spotify response: ', access.access_token)
            TOKEN = access.access_token

            res.status(200).redirect('/spotify');
        })
        .catch(err => res.status(400).send(JSON.stringify(err)));
})



app.get('/spotify', (req, res) => {
    let db = JSON.parse(fs.readFileSync(dbLocation));
    if (!db.hasOwnProperty('inSession')) {
        return res.status(200).redirect('/');
    }
    return res.status(200).sendFile(path.resolve(__dirname, 'index.html'));

})

app.get('/*', (req, res) => {
    let db = JSON.parse(fs.readFileSync(dbLocation));

    if (db.hasOwnProperty('inSession')) {
        return res.status(200).redirect('/spotify');
    }

    return res.status(200).sendFile(path.resolve(__dirname, 'index.html'));
})



app.use((err, req, res, next) => {
    return res.status(400).send('Somethings wrong');
})


app.listen(PORT, () => {
    console.log(`Server listening at Port ${PORT}`)
})