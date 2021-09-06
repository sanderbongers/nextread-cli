#!/usr/bin/env node

const { program } = require('commander')
const Goodreads = require('../lib/Goodreads')
const Bolcom = require('../lib/Bol')

const goodreadsInstance = new Goodreads()
const bolInstance = new Bolcom()

program
  .option('-s, --sort <property> <order>', 'The property and order to sort by. E.g. --sort price asc', 'rating desc')
  .parse()

const sortOption = program.opts().sort.split(' ')
const sortProperty = sortOption[0]
const orderValue1 = sortOption[1] === 'desc' ? -1 : 1
const orderValue2 = sortOption[1] === 'desc' ? 1 : -1

goodreadsInstance.getBooks().then(() => {
  bolInstance.books = goodreadsInstance.books
  bolInstance.searchBooks().then(() => {
    console.log(bolInstance.books.sort((a, b) => a[sortProperty] > b[sortProperty] ? orderValue1 : orderValue2))
  })
})
