const config = require('../config')
const axios = require('axios').default
const parseString = require('xml2js').parseString
const Spinner = require('cli-spinner').Spinner

class Goodreads {

  get books () {
    return this._books || this.getBooks()
  }

  async getBooks () {
    let parsedBooks = []

    await this.fetchBooks().then(response => {
      parsedBooks = this.parseBooks(response.data)
    })

    this._books = this.denormalizeBooks(parsedBooks)
  }

  fetchBooks () {
    const spinner = new Spinner('Fetching books from Goodreads... %s')
    spinner.start()

    return axios.get('https://www.goodreads.com/review/list', {
      params: {
        v: 2,
        key: config.goodreads.api_key,
        id: config.goodreads.user_id,
        shelf: config.goodreads.shelf,
        sort: 'avg_rating',
        order: 'a',
        per_page: 200
      }
    })
      .catch(error => {
        throw error.response.statusText
      })
      .finally(() => {
        spinner.stop()
      })
  }

  parseBooks (xmlString) {
    let bookObjects = []

    parseString(xmlString, function (error, result) {
      if (error) {
        throw new Error('XML parsing error: ' + error)
      }

      bookObjects = result['GoodreadsResponse']['reviews'][0]['review']
    })

    return bookObjects
  }

  denormalizeBooks (bookObjects) {
    return bookObjects.map(bookObject => {
      const book = bookObject['book'][0]

      return {
        isbn: this.getISBN(book),
        title: String(book.title),
        subtitle: null,
        author: null,
        summary: null,
        url: null,
        price: null,
        average_rating: parseFloat(book.average_rating)
      }
    })
  }

  getISBN (book) {
    let isbn = null;

    if (!isNaN(Number(book.isbn13))) {
      isbn = Number(book.isbn13)
    } else if (!isNaN(Number(book.isbn))) {
      isbn = Number(book.isbn)
    }

    return isbn
  }

}

module.exports = Goodreads
