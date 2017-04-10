const yargs = require('yargs');
const cluster = require('cluster');
const os = require('os');
const moment = require('moment');
const { fetchTweets } = require('./scraper');


if (cluster.isMaster) {
    const argv = yargs.options({
        q: {
            alias: 'query',
            demandOption: true,
            type: 'string'
        },
        s: {
            alias: 'since',
            demandOption: true,
            type: 'string',
            description: 'YYYY-MM-DD',
            coerce: str => moment(str, 'YYYY-MM-DD')
        },
        u: {
            alias: 'until',
            demandOption: true,
            description: 'YYYY-MM-DD',
            type: 'string',
            coerce: str => moment(str, 'YYYY-MM-DD')
        },
        f: {
            alias: 'filename',
            demandOption: true,
            type: 'string'
        },
        l: {
            alias: 'limit',
            type: 'number'
        },
        truncate: {
            type: 'boolean'
        }
    }).argv;
    const numCPUs = os.cpus().length;

    // Keep track of the number of tweets fetched
    let tweets = 0;
    setInterval(function () {
        console.log('Tweets Fetched so far:', tweets);
    }, 5000);

    const daysPerWorker = ~~(argv.until.diff(argv.since, 'd') / numCPUs);
    let finishedWorkers = 0;
    for (let i = 0; i < numCPUs; i++) {
        const env = {};
        const start = moment(argv.since).add(daysPerWorker * i, 'd');
        const end = moment(argv.since).add(daysPerWorker * (i + 1), 'd');
        cluster.fork({
            SCRAPER_QUERY: argv.query,
            SCRAPER_SINCE: start.format('YYYY-MM-DD'),
            SCRAPER_UNTIL: end.format('YYYY-MM-DD'),
            SCRAPER_FILENAME: argv.filename + '-' + i,
            SCRAPER_LIMIT: argv.limit,
            SCRAPER_TRUNCATE: argv.truncate
        });
    }

    cluster.on('exit', (worker, code, signal) => {
        finishedWorkers++;
        console.log(`worker ${worker.process.pid} died`);
        if (finishedWorkers == numCPUs) {
            finish(tweets, argv.filename, numCPUs);
        }
    });

    cluster.on('message', (worker, msg) => {
        if (msg.type && msg.type == 'notifyTweets') {
            tweets += msg.tweetsFetched;
            if (tweets >= argv.limit) {
                finish(tweets, argv.filename, numCPUs);
            }
        }
    });
} else {
    const args = {
        since: moment(process.env.SCRAPER_SINCE),
        until: moment(process.env.SCRAPER_UNTIL),
        query: process.env.SCRAPER_QUERY,
        filename: process.env.SCRAPER_FILENAME,
        limit: process.env.SCRAPER_LIMIT,
        truncate: process.env.SCRAPER_TRUNCATE
    };
    fetchTweets(args);
}

function finish(tweets, filename, numCPUs) {
    console.log(`All processes finished. Total tweets fetched: ${tweets}. files:`);
    for (let i = 0; i < numCPUs; i++) {
        console.log(`${__dirname}/tweets/${filename}-${i}`);
    }
    process.exit();
}