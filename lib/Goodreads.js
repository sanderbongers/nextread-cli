const config = require('../config')
const axios = require('axios')
const xml2js = require('xml2js')

class Goodreads {

  get books () {
    return this._books || this.getBooks()
  }

  async getBooks () {
    await this.fetchBooks().then( response => {
      this.parseBooks(response.data).then(response => {
        this._books = response
      })
    })
  }

  fetchBooks () {
    console.info('Fetching books...')

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
  }

  parseBooks (xmlString) {
    console.log('Parsing books...')

    return new Promise(function (resolve, reject) {
      xml2js.parseString(xmlString, (error, result) => {
        if (error) {
          return reject('XML parsing error: ' + error)
        }

        resolve(result['GoodreadsResponse']['reviews'][0]['review'])
      })
    })
  }

}

module.exports = Goodreads
