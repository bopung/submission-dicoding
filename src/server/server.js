require('dotenv').config();


const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');



(async () => {
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0',
        routes: {
            cors: {
              origin: ['*'],
            },
        },
    })

    const model = await loadModel();
    server.app.model = model;

    server.route(routes);  // Akan dibahas lebih lanjut setelah pembahasan extension.
    server.ext('onPreResponse', function (request, h) {
        const response = request.response;
        if (response instanceof InputError) {
          console.log("InputError:", response.message);
          const newResponse = h.response({
            status: 'fail',
            message: `${response.message}`
          });
          newResponse.code(response.statusCode);
          return newResponse;
        }
        if (response.isBoom) {
          console.log("Boom error:", response.message); // Log the full Boom error
          const newResponse = h.response({
            status: 'fail',
            message: response.message
          });
          newResponse.code(response.output.statusCode);
          return newResponse;
        }
        return h.continue;
      });
      
 
    await server.start();
    console.log(`Server start at: ${server.info.uri}`);
})();