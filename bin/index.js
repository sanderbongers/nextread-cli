#!/usr/bin/env node

const { program } = require('commander')
const Goodreads = require('../lib/Goodreads')
const Bolcom = require('../lib/Bol')

const goodreads = new Goodreads()
const bol = new Bolcom()

program
  .option('-s, --sort <property> <order>', 'The property and order to sort by. E.g. --sort price asc', 'rating desc')
  .parse()

const sortOption = program.opts().sort.split(' ')
const sortProperty = sortOption[0]
const orderValue1 = sortOption[1] === 'desc' ? -1 : 1
const orderValue2 = sortOption[1] === 'desc' ? 1 : -1

goodreads.getBooks().then(() => {
  bol.books = goodreads.books
  bol.searchBooks().then(() => {
    console.log(bol.books.sort((a, b) => a[sortProperty] > b[sortProperty] ? orderValue1 : orderValue2))
  })
})
