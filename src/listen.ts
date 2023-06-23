import app from './app';

let PORT = process.env.PORT ?? 9090;
if (typeof PORT === 'string') PORT = parseInt(PORT);


const server = app.listen(PORT);

server.on('listening', () => {
  console.log(`Listening on port: ${PORT}`);
});

server.on('error', (err: Error) => {
  console.error(`Error occurred: ${err}`);
});
