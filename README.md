This repository contains the official [Hydra API](https://siftrics.com/) Node.js client. The Hydra API is a text recognition service.

# Quickstart

1. Install the node module.

```
npm install siftrics-hydra-api
```


1. Create a new data source on [siftrics.com](https://siftrics.com/).
2. Grab an API key from the page of your newly created data source.
3. Create a client, passing your API key into the constructor.
4. Use the client to processes documents, passing in the id of a data source and the filepaths of the documents.

```
const hydra = require('siftrics-hydra-api');

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

The `recognize` function has a default parameter, `config`, which allows users to set various flags:

```
recognize(dataSourceId, files, config = {
    doFaster: false,
    returnTransformedImages: false,
    returnJpgs: false,
    jpgQuality: 85
})
```

If `doFaster` is set to `true`, then Siftrics processes the documents in half the time at the risk of lower text recognition accuracy. Experimentally, setting `doFaster` to `true` seems not to affect accuracy when all the documents to be processed have been rotated no more than 45 degrees.

## Return Transformed / Pre-Processed Images

Hydra can transform input documents so they are cropped and aligned with the original image used to create the data source.

To enable this feature, set `returnTransformedImages` to `true` in `config` (see the "Faster Results" section above for an example of using `config`).

Returned images will be available in the "TransformedImages" field of each element of "Rows" in the response:

```
{
  "Rows": [
    {
      "Error": "",
      "FileIndex": 0,
      "RecognizedText": {
        "My Field 1": "text from your document...",
        "My Field 2": "text from your document...",
        ...
      },
      "TransformedImages": [
        {
          "Base64Image": ...,
          "PageNumber": 1
        },
        ...
      ]
    },
    ...
  ]
}
```

## Export JPEGs instead of PNGs

If your data source returns cropped images, they are returned as PNGs encoded as base-64 strings. It is possible to return these images as JPEGs instead of PNGs, by setting `returnJpgs` to `true` in `config` (see the "Faster Results" section above for an example of using `config`). Additionally, there is a flag `jpgQuality` which is a number between `1` and `100` inclusive, which determines the quality of the encoded JPEGs. The default is `85`. The higher the number, the higher the quality.

Returning JPEGs instead of PNGs with `jpgQuality=85` typically exhibits a 7-10x reduction in image size, with minimal reduction in quality.

## Official API Documentation

Here is the [official documentation for the Hydra API](https://siftrics.com/docs/hydra.html).

# Apache V2 License

This code is licensed under Apache V2.0. The full text of the license can be found in the "LICENSE" file.
