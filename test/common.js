var tape = require('tape')
var tests = require('abstract-blob-store/tests')
var bs = require('..')
var os = require('os')
var path = require('path')
var rimraf = require('rimraf')

var common = {
  setup: function(t, cb) {
    // make a new blobs instance on every test
    var filepath = path.join(os.tmpdir(), ''+process.pid+'.tar')
    var store = bs(filepath)
    store.__path = filepath
    cb(null, store)
  },
  teardown: function(t, store, blob, cb) {
    rimraf.sync(store.__path)
    cb()
  }
}

tests(tape, common)
