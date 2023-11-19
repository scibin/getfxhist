// commonJS syntax
const fs = require('fs');
const cheerio = require('cheerio');
const jsonToCSVConverter = require('json-2-csv');
const axios = require('axios');


const { inputConfig, requestHeaders } = require('./input');
const { getRequestKeys} = require('./requestkey');

// Initialize values
const getRequestKeysObj = getRequestKeys();
const requestCookie = getRequestKeysObj.requestCookie;
const request_csrf = getRequestKeysObj.request_csrf;
const request_z = getRequestKeysObj.request_z;

const inputConfigObj = inputConfig();
const startDate = inputConfigObj.startDate;
const endDate = inputConfigObj.endDate;
const timeScale = inputConfigObj.timeScale;
const folderName = inputConfigObj.folderName;
const outputFileExtension = inputConfigObj.outputFileExtension;

const headers = {
    ...requestHeaders(),
    cookie: requestCookie,
};

const requestParamsObj = {
    "start": startDate,
    "end": endDate,
    "timeScale": timeScale,
    "userTimeFormat": '0',
    "_csrf": request_csrf,
    "z": request_z
};

const getMonthAndYear = (date) => {
    // new Date(), getMonth, getFullYear
    const dateObj = new Date(date);
    return {
        month: dateObj.getMonth(),
        year: dateObj.getFullYear(),
    }
}

exports.getHistDataSingleCcyPair = (currencyPair) => {
    const params = { ...requestParamsObj, symbol: currencyPair };
    return axios.get(inputConfigObj.baseURL, { params, headers })
};

exports.saveJSONToCSV = (jsonArray, directory, outputFileName) => {
    const outputCSV = jsonToCSVConverter.json2csv(jsonArray);
    fs.writeFileSync(directory + outputFileName + '.csv', outputCSV);
};

exports.generateCcyPairInfoArray = (htmlString, currencyPair) => {
    // Display the file content 
    const $ = cheerio.load(htmlString);
    // '[name=mode]'
    const $timestamps = $('[name=time' + currencyPair + ']');
    const $spotAtClose = $('[name=close' + currencyPair + ']');
    const outputArray = [];

    for (let i = 0; i < $timestamps.length; i++) {
        const timestampEntry = $timestamps[i];
        const timestampText = timestampEntry?.children?.[0]?.data?.trim();
        const spotAtCloseEntry = $spotAtClose[i];
        const spotAtCloseText = spotAtCloseEntry?.children?.[0]?.data?.trim();

        const { month, year } = getMonthAndYear(timestampText);

        outputArray.push({
            currencyPair,
            foreCurrency: currencyPair?.substring(0,3),
            counterCurrency: currencyPair?.substring(3,6),
            time: timestampText,
            spot: spotAtCloseText,
            month,
            year,
        });
    }
    return outputArray;
}

exports.readFileSync = (pathToFile) => {
    const encoding = 'utf8';
    return fs.readFileSync(pathToFile, encoding);
};

exports.logOutputToTxtFile = (directory, filename, content) => {
    fs.writeFile(directory + filename, content, err => {
        if (err) {
            console.error(err)
            return;
        }
        //file written successfully
        console.log('>>> ' + filename + ' written successfully!');
    })
};

// cwd: process.cwd()
exports.generateFullFilePathAndName = (cwd, currencyPair) => {
    return cwd + folderName + currencyPair + outputFileExtension;
}

exports.generateFilePath = (cwd) => {
    return cwd + folderName;
}

exports.generateFileName = (currencyPair) => {
    return currencyPair + outputFileExtension;
}

// Set request params of 1 ccypair
exports.getRequestParams = (currencyPair) => {
    return { ...requestParamsObj, symbol: currencyPair }
};

exports.getRequestHeaders = () => headers;

// Random integer generator
// The maximum is exclusive and the minimum is inclusive
exports.getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

// Promisified wait
exports.wait = delayInMS => new Promise(resolve => setTimeout(resolve, delayInMS));
