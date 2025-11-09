import express from 'express';
import { pinoHttp } from 'pino-http';

const app = express();
const PORT = 3000;

app.use(pinoHttp());

app.get('/', function (req, res) {
  req.log.info('test logger')
  res.send('hello world')
})

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);