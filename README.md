This repository contains the official [Hydra API](https://siftrics.com/) Node.js client. The Hydra API is a text recognition service.

# Quickstart

1. Install the node module.

```
npm install hydra-api
```


1. Create a new data source on [siftrics.com](https://siftrics.com/).
2. Grab an API key from the page of your newly created data source.
3. Create a client, passing your API key into the constructor.
4. Use the client to processes documents, passing in the id of a data source and the filepaths of the documents.

```
const hydra = require('hydra-api');

const h = new hydra.Client('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

h.recognize('my-data-source-id', ['invoice_1.pdf', 'my_receipt.png'])
    .then(rows => {
        console.log(rows);
    })
    .catch(error => {
        console.error(error);
    });
```

`rows` looks like this:

```
[
  {
    "Error": "",
    "FileIndex": 0,
    "RecognizedText": { ... }
  },
  ...
]
```

`FileIndex` is the index of this file in the original request's "files" array.

`RecognizedText` is an object mapping labels to values. Labels are the titles of the bounding boxes drawn during the creation of the data source. Values are the recognized text inside those bounding boxes.

## Faster Results

`client.recognize('my-data-source-id', [ ... ], doFaster=False)` has a default parameter, `doFaster`, which defaults to `false`, but if it's set to `true` then Siftrics processes the documents faster at the risk of lower text recognition accuracy. Experimentally, doFaster=true seems not to affect accuracy when all the documents to be processed have been rotated no more than 45 degrees.


## Official API Documentation

Here is the [official documentation for the Hydra API](https://siftrics.com/docs/hydra.html).

# Apache V2 License

This code is licensed under Apache V2.0. The full text of the license can be found in the "LICENSE" file.
