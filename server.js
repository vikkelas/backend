const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const {
   uuid
} = require('uuidv4');
const app = new Koa();
const port = process.env.PORT || 8080;

const tickets = [{
   id: 1,
   name: 'Поменять краску в принтере',
   description: 'Принтер на складе секция 8',
   status: true,
   created: '22.01.22 18:04'
}];

app.use(koaBody({
   text: true,
   multipart: true,
   urlencoded: true,
   json: true,
}));

app.use(async (ctx, next) => {
   const origin = ctx.request.get('Origin');
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
   if (ctx.request.method === 'GET' && method === 'allTickets') {
      ctx.response.body = tickets;
   }
   if (ctx.request.method === 'POST') {

      if (method === 'createTicket') {
         const ticket = {};
         ticket.name = ctx.request.body.name;
         ticket.discription = ctx.request.body.discription;
         ticket.status = ctx.request.body.status;
         ticket.created = ctx.request.body.created;
         ticket.id = uuid();
         tickets.push(ticket);
         ctx.response.body = tickets;
      }
      if (method === 'editTicket') {
         const id = ctx.request.body.id;
         const index = tickets.findIndex(item => item.id == id);
         tickets[index].name = ctx.request.body.name;
         tickets[index].description = ctx.request.body.description;
         ctx.response.body = tickets;
      }
   }
});

const server = http.createServer(app.callback()).listen(port);