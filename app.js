const tracer = require('dd-trace').init({
    service: 'nodejs-app',
    env: 'production',
    version: '1.0.0',
});

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello, Datadog APM Hey');
});

app.listen(3001, () => {
    console.log('App is running on port 3001');
});
