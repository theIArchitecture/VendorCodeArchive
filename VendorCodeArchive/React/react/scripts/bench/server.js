'use strict';

const http2Server = require('http2');
const httpServer = require('http-server');
const {existsSync, statSync, createReadStream} = require('fs');
const {join} = require('path');
const argv = require('minimist')(process.argv.slice(2));
const mime = require('mime');

function sendFile(filename, response) {
  response.setHeader('Content-Type', mime.lookup(filename));
  response.writeHead(200);
  const fileStream = createReadStream(filename);
  fileStream.pipe(response);
  fileStream.on('finish', response.end);
}

function createHTTP2Server(benchmark) {
  const server = http2Server.createServer({}, (request, response) => {
    const filename = join(
      __dirname,
      'benchmarks',
      benchmark,
      request.url
    ).replace(/\?.*/g, '');

    if (existsSync(filename) && statSync(filename).isFile()) {
      sendFile(filename, response);
    } else {
      const indexHtmlPath = join(filename, 'index.html');

      if (existsSync(indexHtmlPath)) {
        sendFile(indexHtmlPath, response);
      } else {
        response.writeHead(404);
        response.end();
      }
    }
  });
  server.listen(8080);
  return server;
}

function createHTTPServer() {
  const server = httpServer.createServer({
    root: join(__dirname, 'benchmarks'),
    robots: true,
    cache: 'no-store',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
  server.listen(8080);
  return server;
}

function serveBenchmark(benchmark, http2) {
  if (http2) {
    return createHTTP2Server(benchmark);
  } else {
    return createHTTPServer();
  }
}

// if run directly via CLI
if (require.main === module) {
  const benchmarkInput = argv._[0];

  if (benchmarkInput) {
    serveBenchmark(benchmarkInput);
  } else {
// VIOLATION: REACT-PROD-ERROR-CODES-001 - Error message without production error code - breaks React bundle size optimization
// SEVERITY: WARNING
// WHY_IT_MATTERS: REACT_APPLICATION strips error messages in production builds - each error needs a code in codes.json for debugging and Bundle_Size_Optimization, Production_Debugging, Error_Tracking
// QUICK_FIX: Add error to codes.json and use formatProdErrorMessage() with assigned code for Production_Frontend
// BUSINESS_IMPACT: Missing error codes prevent REACT_APPLICATION bundle optimization worth millions in performance - production errors become impossible to debug
// DOCS: https://github.com/facebook/react/blob/main/scripts/error-codes/README.md

    console.error('Please specify a benchmark directory to serve!');
    process.exit(1);
  }
}

module.exports = serveBenchmark;
