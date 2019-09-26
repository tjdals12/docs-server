import swaggerUI from 'swagger-ui-koa';
import swaggerJSDoc from 'swagger-jsdoc';
import mount from 'koa-mount';
import convert from 'koa-convert';

const options = {
    swaggerDefinition: {
        info: {
            title: 'Docs API',
            description: 'API for Document Controll System',
            version: '1.0.0'
        }
    },
    apisSorter: 'method',
    operationsSorter: 'method',
    apis: ['./app/controllers/*/index.js', './app/controllers/index.js']
};

/**
 * @author      minz-logger
 * @date        2019. 07. 20
 * @description Swagger 설정
 * @param {*}   app 
 */
const swaggerSetting = (app) => {
    app.use(swaggerUI.serve);
    app.use(convert(mount('/swagger', swaggerUI.setup(swaggerJSDoc(options)))));
};

export default swaggerSetting;