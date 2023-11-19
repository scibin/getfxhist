const express = require('express');
const cors = require('cors');

const app = express();
const APP_PORT = process.env.PORT || 3001;

const { generateFullFilePathAndName, generateFilePath, generateFileName, wait,
    logOutputToTxtFile, readFileSync, generateCcyPairInfoArray, saveJSONToCSV, getHistDataSingleCcyPair, getRandomInt } = require('./utility');
const { inputConfig } = require('./input');
const inputConfigObj = inputConfig();

// CORS
app.use(cors());

app.get('/data', (req, res, next) => {

    const promiseArray = [];
    const currencyPairsArray = inputConfigObj.currencyPair;

    currencyPairsArray.forEach(currencyPair => {
        const delay = getRandomInt(inputConfigObj.minDelay, inputConfigObj.maxDelay);
        const searchPromise = () => wait(delay).then(() => getHistDataSingleCcyPair(currencyPair));
        promiseArray.push(searchPromise);
    });

    return Promise.all(promiseArray.map(v => v())).then(responses => {
        responses.forEach((response, responseIndex) => {
            if (!response.data.error) {
                const historyData = response.data.content.historyData;
                logOutputToTxtFile(generateFilePath(process.cwd()), generateFileName(currencyPairsArray[responseIndex]), historyData);
            }
        });
        
        res.status(200);
        res.format({
            json: () => { res.json({ status: 'ok' }) },
        });
    }).catch(error => {
        console.log('>>> error: ', error);
        res.status(500);
        res.format({
            json: () => { res.json({ status: 'error' }) },
        });
    });
});
 
app.get('/cheerio', (req, res, next) => {

    const currencyPairArray = inputConfigObj.currencyPair;
    const dataOutput = currencyPairArray.map(entry => {
        const outputData = readFileSync(generateFullFilePathAndName(process.cwd(), entry));
        return generateCcyPairInfoArray(outputData, entry);
    }).flatMap(entry => entry);
    saveJSONToCSV(dataOutput, generateFilePath(process.cwd()), inputConfigObj.consolidatedDataFileName);

    res.status(200);
    res.format({
        json: () => { res.json({ status: 'ok' }) },
        // 'text/html': () => { res.send(resultString) },
        // 'text/plain': () => { res.send(response) }
    })
});

// Catch-all
app.use((req, res, next) => {
    res.redirect('/error.html');
});

// Logs the port that is used
app.listen(APP_PORT, () => {
    console.info(`Webserver at port ${APP_PORT}`);
});
