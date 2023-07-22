import { config } from 'dotenv';
import express from 'express';
import { join, dirname } from 'path';
import methodOverride from 'method-override';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import { access } from 'fs';

config();

const filename = fileURLToPath(import.meta.url);
const publicDir = join(dirname(filename), '../client/public');
const viewsDir = join(dirname(filename), '../client/views');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride());

access(publicDir, (err) => {
  if (err) throw new Error('No public directory!');
  app.use(express.static(publicDir));
});
access(viewsDir, (err) => {
  if (err) throw new Error('No views directory!');
  app.set('views', viewsDir);
  app.set('view engine', 'pug');
});

app.get('/', async (_, res) => res.render('base'));

app.get('/about', async (_, res) => res.render('base'));

app.listen(PORT, () => {
  console.log(`🚀 Server ready on port ${PORT}`);
});
