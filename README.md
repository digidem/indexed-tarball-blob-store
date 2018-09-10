# indexed-tarball-blob-store

> [blob store](https://github.com/maxogden/abstract-blob-store) that stores blobs in an [indexed tarball](https://github.com/noffle/indexed-tarball).

[![blob-store-compatible](https://raw.githubusercontent.com/maxogden/abstract-blob-store/master/badge.png)](https://github.com/maxogden/abstract-blob-store)

## Usage

``` js
var itar = require('indexed-tarball-blob-store')
var blobs = itar('blobs.tar')

var ws = blobs.createWriteStream({
  key: 'some/path/file.txt'
})

ws.write('hello world\n')
ws.end(function() {
  var rs = blobs.createReadStream({
    key: 'some/path/file.txt'
  })

  rs.pipe(process.stdout)
})
```

outputs

```
hello world
```

## API

This blob store implements the [abstract-blob-store API](https://github.com/maxogden/abstract-blob-store#api).

```js
var itar = require('indexed-tarball-blob-store')
```

### store.createWriteStream(opts, cb)

This method returns a writable stream, and call `cb` with `err, metadata` when
it finishes writing the data to the underlying blob store.

If `opts` is a string it is interpreted as a `key`. Otherwise `opts` is an
object with any blob metadata you would like to store, e.g. `name`

The `metadata` passed to `cb` has a `key` property that you can pass to other
methods to get the blob back again.

### store.createReadStream(opts)

This method returns a readable stream that emits blob data from the underlying
blob store or emits an error if the blob does not exist or if there was some
other error during the read.

If `opts` is a string it is interpreted as a `key`.
Otherwise `opts` is an object with a `key` property. The `key` is used
to find and read the blob.

### store.exists(opts, cb)

This checks if a blob exists in the store.

If `opts` is a string it is interpreted as a `key`.
Otherwise `opts` is an object with a `key` property (the same key that you got
back from createReadStream). The `cb` is called with `err, exists`, where `err`
is an error if something went wrong during the exists check, and `exists` is a
boolean.

### store.remove(opts, cb)

This method removes a blob from the store, but only if it is the last file in
the tarball, since indexed-tarball only supports popping entries from the end.
If the given key is not the last file in the tarball, an error is returned.

If `opts` is a string it is interpreted as a `key`.

Otherwise `opts` is an object with a `key` property. If the `cb` is called
without an error subsequent calls to `.exists` with the same opts will return
`false`.

### store.list(cb)

*Bonus function; not found in vanilla `abstract-blob-store`.*

Asynchronously returns a list of all filenames in the indexed tarball. Works
well with
[blob-store-replication-stream](https://github.com/noffle/blob-store-replication-stream).

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install indexed-tarball-blob-store
```

## License

ISC

