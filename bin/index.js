#!/usr/bin/env node

const Goodreads = require('../lib/Goodreads')

const goodreads = new Goodreads()
goodreads.getBooks().then(() => {
  console.log(goodreads.books)
})
