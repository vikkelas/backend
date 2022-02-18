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

app.use(async (ctx) => {
   const {
      method
   } = ctx.request.query;
   if (ctx.request.method === 'GET' && method === 'allTikets') {
      console.log(ctx.request.headers);
      ctx.response.body = tikets;
   }
});

const server = http.createServer(app.callback()).listen(port);