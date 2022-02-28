const http = require('http');
const Koa = require('koa');
const cors = require('@koa/cors')
const koaBody = require('koa-body');
const {
   uuid
} = require('uuidv4');
const app = new Koa();
app.use(cors());
const port = process.env.PORT || 8080;

const tickets = [{
   id: 123,
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

app.use(async (ctx) => {
   const {
      method,
      id,
      status,
   } = ctx.request.query;
   if (ctx.request.method === 'GET' && method === 'allTickets') {
      ctx.response.body = tickets;
      console.log(id);
   }
   if (ctx.request.method === 'GET' && method === 'deletTicket') {
      const index = tickets.findIndex(item => item.id == id);
      tickets.splice(index, 1);
      ctx.response.body = tickets;
   }
   if (ctx.request.method === 'GET' && method === 'changeCheck') {
      const index = tickets.findIndex(item => item.id == id);
      if (status == 'false') {
         tickets[index].status = 'true';
      } else tickets[index].status = 'false';
      ctx.response.body = tickets;
   }
   if (ctx.request.method === 'POST' && method === 'createTicket') {
      const {
         name,
         description,
         status,
         created
      } = ctx.request.body;
      const ticket = {
         name: name,
         description: description,
         status: status,
         created: created,
      };
      ticket.id = uuid();
      tickets.push(ticket);
      ctx.response.body = tickets;
   }
   if (ctx.request.method === 'POST' && method === 'editTicket') {
      const {
         id,
         name,
         description
      } = ctx.request.body;
      const index = tickets.findIndex(item => item.id == id);
      tickets[index].name = name;
      tickets[index].description = description;
      ctx.response.body = tickets;
   }
});

const server = http.createServer(app.callback()).listen(port);