const config = require('../config')
const axios = require('axios').default
const Spinner = require('cli-spinner').Spinner

class Bol {
  get books () {
    return this._books
  }

  set books (books) {
    this._books = books
  }

  async searchBooks () {
    const promises = []

    const spinner = new Spinner('Searching books on Bol.com... %s')
    spinner.start()

    for (const book of this.books) {
      if (book.isbn === null) {
        continue
      }

      promises.push(
        await axios.get('https://api.bol.com/catalog/v4/search', {
          params: {
            apikey: config.bol.api_key,
            q: book.isbn,
            limit: 1
          }
        })
          .then(response => {
            if (response.data.totalResultSize === 0) {
              return
            }

            this.complementBook(book.isbn, response.data.products[0])
          })
          .catch(error => {
            console.log(error.response.data)
            throw new Error(error.response.data)
          })
      )
    }

    await Promise.all(promises)
      .finally(() => {
        spinner.stop()
      })
  }

  complementBook (isbn, product) {
    const book = this.books.find(book => book.isbn === isbn)

    book.title = product.title
    book.subtitle = product.subtitle ?? ''
    book.author = product.specsTag
    book.summary = product.summary
    book.url = product.urls.find(url => url.key === 'DESKTOP').value
    book.price = product.offerData.offers ? product.offerData.offers[0].price : 'Niet leverbaar'
  }
}

module.exports = Bol
