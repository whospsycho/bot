const axios = require('axios');
const config = require('../config.json');


async function uploadPaste(content) {
    const req = await axios.post('https://api.hyper.pics/upload/paste', {
        token: config.hyperToken,
        content: content,
        title: 'Radiant.cool Tickets',
        anonymous: true,
        exploding: false,
        language: 'plaintext',
    })

    return req.data.url;


}

module.exports = uploadPaste;