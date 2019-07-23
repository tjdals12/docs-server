import config from 'configs';
const { port } = config;

import * as db from 'models';
import app from './app';

db.connect().then(type => {
    console.log(`Connected ${type}`);

    app.listen(port, () => {
        console.log(`Server localhost:${port}`);
    });
});