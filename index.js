var IndexedTarball = require('indexed-tarball')

var noop = function() {}

function BlobStore (opts) {
  if (!(this instanceof BlobStore)) return new BlobStore(opts)
  if (typeof opts === 'string') opts = {path:opts}

  this.tarball = new IndexedTarball(opts.path, opts)
}

BlobStore.prototype.createWriteStream = function (opts, cb) {
  if (typeof opts === 'string') opts = {key:opts}
  if (opts.name && !opts.key) opts.key = opts.name
  return this.tarball.append(opts.key, opts.size || undefined, function (err) {
    if (cb) cb(err, {key:opts.key})
  })
}

BlobStore.prototype.createReadStream = function (key, opts) {
  if (key && typeof key === 'object') return this.createReadStream(key.key, key)
  return this.tarball.read(key, opts)
}

BlobStore.prototype.exists = function (opts, cb) {
  if (typeof opts === 'string') opts = {key:opts}
  this.tarball.list(function (err, files) {
    if (err) return cb(err)
    cb(null, files.indexOf(opts.key) !== -1)
  })
}

BlobStore.prototype.remove = function (opts, cb) {
  if (typeof opts === 'string') opts = {key:opts}
  if (!opts) opts = noop
  this.tarball.pop(cb)
}

BlobStore.prototype.list = function (cb) {
  this.tarball.list(cb)
}

module.exports = BlobStore
