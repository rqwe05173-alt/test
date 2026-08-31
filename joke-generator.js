/**
 * Random Joke Generator using JokeAPI
 * Fetches random jokes from an external API
 */

const https = require('https');

/**
 * Fetch a random joke from JokeAPI
 * @param {string} type - Type of joke ('single' or 'twopart')
 * @returns {Promise<Object>} Joke object
 */
function getRandomJoke(type = 'any') {
  return new Promise((resolve, reject) => {
    const url = `https://v2.jokeapi.dev/joke/Any?type=${type}`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const joke = JSON.parse(data);
          if (joke.error) {
            reject(new Error(joke.message));
          } else {
            resolve(joke);
          }
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Display a joke in a readable format
 * @param {Object} joke - Joke object from API
 */
function displayJoke(joke) {
  console.log('\n' + '='.repeat(60));
  console.log('🎭 RANDOM JOKE GENERATOR 🎭');
  console.log('='.repeat(60) + '\n');

  if (joke.type === 'single') {
    console.log(joke.joke);
  } else if (joke.type === 'twopart') {
    console.log('Setup: ' + joke.setup);
    console.log('\nDelivery: ' + joke.delivery);
  }

  console.log('\n' + '-'.repeat(60));
  console.log(`Category: ${joke.category} | Type: ${joke.type}`);
  console.log('='.repeat(60) + '\n');
}

/**
 * Main function to run the joke generator
 */
async function main() {
  try {
    console.log('Fetching a random joke...\n');
    const joke = await getRandomJoke();
    displayJoke(joke);
  } catch (err) {
    console.error('Error fetching joke:', err.message);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { getRandomJoke, displayJoke };
