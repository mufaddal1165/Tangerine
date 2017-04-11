const cheerio = require('cheerio');
const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');
const moment = require('moment');
const { writeFile, truncateSync } = require('fs');

const TWITTER_DATE_FORMAT = 'YYYY-MM-DD';
const SAVE_FOLDER = '.C:\\Users\\Mufaddal\\Desktop\\FYP\\Tangerine\\src\\server\\fyp\\fyp\\services\\node-scraper\\tweets';

function fetchTweets({ query, since, until, filename, truncate, limit = Infinity }) {
    if (truncate == true) {
        truncateSync(filename);
    }
    const current = moment(since);
    const total = until.diff(since, 'd');
    console.log(since, until);
    let processed = 0;
    while (current.isBefore(until)) {
        startDayTask(query, current, filename, limit, () => {
            processed++;
            if (processed == total) {
                process.exit();
            }
        });
        current.add(1, 'd');
    }
}

async function startDayTask(query, day, filename, limit, cb) {
    async function saveTweets(tweets) {
        const jsonLine = JSON.stringify(tweets) + '\n';
        writeFile(SAVE_FOLDER + '/' + filename, jsonLine, { flag: 'a' }, noop);
    }

    let tweetsFetched = 0;
    const end = moment(day).add(1, 'd');
    const queryString = buildQuery(query, day, end);
    const initURL = `https://twitter.com/search?q=${queryString}&src=typd`;
    let minID = null;
    let returnedID = null;

    console.log('Sending request to:', initURL);
    let res = await fetch(initURL /*, { agent: new HttpsProxyAgent('http://192.168.100.13:8080')}*/);
    if (res.status == 200) {
        console.log('Success!');
        let $ = cheerio.load(await res.text());
        let tweets = parseTweets($);
        saveTweets(tweets);
        tweetsFetched += tweets.length;
        process.send({ type: 'notifyTweets', tweetsFetched: tweets.length });
        minID = $('[data-min-position]').attr('data-min-position');

        while (minID != returnedID) {
            if (returnedID != null)
                minID = returnedID;
            try {
                const loopURL = `https://twitter.com/i/search/timeline?vertical=default&q=${queryString}&src=typd&include_available_features=1&include_entities=1&reset_error_state=false&max_position=${minID}`
                res = await fetch(loopURL/*, { agent: new HttpsProxyAgent('http://192.168.100.13:8080')}*/);

                if (res.status != 200) throw new Error(`Status: ${res.status}`);
                const responseData = await res.json();
                returnedID = responseData.min_position;
                if (minID != returnedID) {
                    $ = cheerio.load(responseData.items_html)
                    tweets = parseTweets($);
                    saveTweets(tweets);
                    tweetsFetched += tweets.length;
                    process.send({ type: 'notifyTweets', tweetsFetched: tweets.length });
                    if (tweetsFetched > limit) break;
                }
            } catch (e) {
                console.log('Error', e, 'Retrying');
            }
        }
        cb();
    } else {
        console.log(initURL, 'failed!');
    }
}

function parseTweets($) {
    const $tweets = $('div.tweet');
    const tweets = Array.prototype.map.call($tweets, element => {
        const $el = $(element);

        const text = parseText($el);
        const id = $el.attr('data-tweet-id');
        const link = 'https://www.twitter.com' + $el.attr('data-permalink-path');
        const author = $el.attr('data-screen-name');

        const $timestamp = $el.find('._timestamp').eq(0);

        const date = $timestamp.text();
        const timestamp = $timestamp.attr('data-time');

        if (text != null) {
            return {
                id,
                text,
                author,
                date,
                timestamp,
                link
            }
        } else {
            return null;
        }
    });
    return tweets.filter(el => el != null);
}

function parseText($tweet) {
    const textContainer = $tweet.find('p.js-tweet-text')
    if (textContainer.length > 0) {
        return textContainer.eq(0).text();
    } else
        return null;
}

function buildQuery(query, since, until) {
    return `${query} since:${since.format(TWITTER_DATE_FORMAT)} until:${until.format(TWITTER_DATE_FORMAT)}`;
}

function noop() { }

module.exports = { fetchTweets };
