require('dotenv').config()

const config = {
  goodreads: {
    api_key: process.env.GOODREADS_API_KEY,
    api_secret: process.env.GOODREADS_API_SECRET,
    user_id: process.env.GOODREADS_USER_ID,
    shelf: process.env.GOODREADS_SHELF || 'to-read'
  }
}

module.exports = config
