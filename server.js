const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const {
   uuid
} = require('uuidv4');
const app = new Koa();
const port = process.env.PORT || 7070;

const tikets = [{
   id: 1,
   name: 'Поменять краску в принтере',
   description: 'Принтер на складе секция 8',
   status: false,
   created: '22.01.22 18:04'
}];

app.use(koaBody({
   urlencoded: true,
}));

app.use(async (ctx, next) => {
   const origin = ctx.request.get('http://localhost:8080');
   if (!origin) {
      return await next();
   }
   const headers = {
      'Access-Control-Allow-Origin': '*',
   };

   if (ctx.request.method !== 'OPTIONS') {
      ctx.response.set({
         ...headers
      });
      try {
         return await next();
      } catch (e) {
         e.headers = {
            ...e.headers,
            ...headers
         };
         throw e;
      }
   }

   if (ctx.request.get('Access-Control-Request-Method')) {
      ctx.response.set({
         ...headers,
         'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
      });
      if (ctx.request.get('Access-Control-Request-Headers')) {
         ctx.response.set('Access-Control-Request-Headers', ctx.request.get('Access-Control-Allow-Request-Headers'));
      }
      ctx.response.status = 204;
   }
});

app.use(async (ctx) => {
   const {
      method
   } = ctx.request.query;
   if (ctx.request.method === 'GET' && method === 'allTikets') {
      ctx.response.body = tikets;
   }
});

const server = http.createServer(app.callback()).listen(port);