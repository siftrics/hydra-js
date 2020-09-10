// Copyright © 2020 Siftrics
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

const fs = require('fs');
const https = require('https');

class Client {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    recognizePayload(dataSourceId, payload) {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(payload)
            const options = {
                hostname: 'siftrics.com',
                port: 443,
                path: '/api/hydra/' + dataSourceId + '/',
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + this.apiKey,
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            }
            const req = https.request(options, res => {
                let chunks = [];
                res.on('data', chunk => {
                    chunks.push(chunk);
                }).on('end', () => {
                    const buf = Buffer.concat(chunks);
                    if (res.statusCode != 200) {
                        reject(new Error('non-200 response; ' +
                                         'status code: ' + res.statusCode +
                                         ' body: ' + buf));
                        return;
                    }
                    let json;
                    try {
                        json = JSON.parse(buf);
                    } catch (error) {
                        reject(error);
                        return;
                    }
                    resolve(json.Rows);
                });
            })
            req.on('error', error => {
                reject(error);
            })
            req.write(data);
            req.end();
        });
    }

    recognize(dataSourceId, files, doFaster=false) {
        return new Promise((resolve, reject) => {
            let payload = { files: [], doFaster }
            for (let k in files) {
                const file = files[k];
                let mimeType = '';
                if (file.endsWith('.pdf')) {
                    mimeType = 'application/pdf'
                } else if (file.endsWith('.bmp')) {
                    mimeType = 'image/bmp'
                } else if (file.endsWith('.gif')) {
                    mimeType = 'image/gif'
                } else if (file.endsWith('.jpeg')) {
                    mimeType = 'image/jpeg'
                } else if (file.endsWith('.jpg')) {
                    mimeType = 'image/jpg'
                } else if (file.endsWith('.png')) {
                    mimeType = 'image/png'
                } else {
                    reject(new Error('unrecognized file extension. must be pdf, bmp, gif, jpeg, jpg, or png'));
                    return;
                }
                payload.files.push({
                    mimeType: mimeType,
                    base64File: fs.readFileSync(file).toString('base64')
                })
            }
            this.recognizePayload(dataSourceId, payload)
                .then(pages => { resolve(pages) })
                .catch(error => { reject(error) });
        });
    }
}

exports.Client = Client;
