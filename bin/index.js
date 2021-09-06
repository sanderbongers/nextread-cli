#!/usr/bin/env node

const Goodreads = require('../lib/Goodreads')
const Bolcom = require('../lib/Bol')

const goodreads = new Goodreads()
const bol = new Bolcom()

goodreads.getBooks().then(() => {
  bol.books = goodreads.books
  bol.searchBooks().then(() => {
    console.log(bol.books.sort((a, b) => a.price > b.price ? 1 : -1))
  })
})
