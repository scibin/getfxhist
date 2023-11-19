const config = {
    currencyPair: ['AUDCAD', 'EURUSD'],
    // YYYY-M-D (number values without 0) e.g. 2021-2-1
    startDate: '2020-1-1',
    endDate: '2023-11-17',
    timeScale: '43200', // 43200 = monthly
    baseURL: 'https://www.myfxbook.com/getHistoricalDataByDate.json',
    folderName: '/output/', // where the hist data will be saved
    outputFileExtension: '.txt', // file extension of hist data
    consolidatedDataFileName: 'alldata',
    minDelay: 10,
    maxDelay: 5000,
};

const headers = {
    'authority': 'www.myfxbook.com', 
    'accept': '*/*', 
    'accept-language': 'en-US,en;q=0.9', 
    'referer': 'https://www.myfxbook.com/', 
    'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"', 
    'sec-ch-ua-mobile': '?0', 
    'sec-ch-ua-platform': '"Windows"', 
    'sec-fetch-dest': 'empty', 
    'sec-fetch-mode': 'cors', 
    'sec-fetch-site': 'same-origin', 
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36', 
    'x-requested-with': 'XMLHttpRequest'
}

exports.inputConfig = () => config;
exports.requestHeaders = () => headers;
