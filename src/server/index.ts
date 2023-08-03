import { config } from 'dotenv';
// Load env vars
config();
import express, { type Application } from 'express';
import { join } from 'path';
import methodOverride from 'method-override';
import morgan from 'morgan';
import { UA, limiter, reqError } from './middlewares';
import type { Server as HttpServer } from 'http';
import helmet from 'helmet';
import type { Controller } from './interfaces';
import serverConfig from './config';
import { IndexController, DefaultController } from './controllers';

/**
 * Creates a new server instance
 * @param {Controller[]} controllers Array of controllers used by different routes
 * @param {Number} port Port for the app to listen to.
 */
class Server {
  public app: Application;
  private server: HttpServer;

  constructor(controllers: Controller[], port: number) {
    // Initialize express app
    this.app = express();
    // Set up client
    this.setUpClient();
    // Set up dev server
    this.setUpDevServer();
    // Initialize global middlewares
    this.initGlobalMiddlewares();
    // Initialize routes
    this.initRoutes(controllers);
    // Initialize global error handler
    this.initErrorHandler();
    // Start server
    this.server = this.listen(port);
    this.server.on('listening', () => console.log(`🚀 Server ready on %j}`, this.server.address()));
  }

  /**
   *
   * @param {Number} port Port to start server on
   * @returns Created express server
   */
  private listen(port: number) {
    return this.app.listen(port);
  }

  /**
   * Required global middleware for express server
   */
  private initGlobalMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(methodOverride());
    this.app.use(UA);
    // development logging
    if (serverConfig.env.isDev) {
      this.app.use(morgan('common'));
    } else {
      this.app.use(morgan('dev'));
    }
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            'script-src': ["'self'", "'unsafe-inline'"], // Required for onclick inline handlers
            'script-src-attr': ["'self'", "'unsafe-inline'"], // Required for onclick inline handlers
          },
        },
      }),
    );
    this.app.use(limiter());
  }

  private setUpClient() {
    this.app.use(express.static(join(__dirname, '../client/public')));
    this.app.set('views', join(__dirname, '../client/views'));
    this.app.set('view engine', 'pug');
  }

  /**
   * Initialize all the routes and the controllers
   * @param {Controller[]} controllers
   */
  private initRoutes(controllers: Controller[]) {
    controllers.forEach((controller: Controller) => {
      this.app.use('/', controller.router);
    });
  }

  /**
   * Call last before server listens on any port
   */
  private initErrorHandler() {
    this.app.use(reqError());
  }

  private setUpDevServer() {
    if (serverConfig.env.isDev) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const webpack = require('webpack'),
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        webpackConfig = require('../../webpack.config.dev'),
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        webpackDevMiddleware = require('webpack-dev-middleware'),
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        webpackHotMiddleware = require('webpack-hot-middleware');

      // Path for live updates
      webpackConfig.default.entry.unshift('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000');

      const compiler = webpack(webpackConfig.default);

      // Attach the dev middleware to the compiler & the server
      this.app.use(
        webpackDevMiddleware(compiler, {
          publicPath: webpackConfig.default.output.publicPath,
          writeToDisk: true,
        }),
      );

      // Attach the hot middleware to the compiler & the server
      this.app.use(
        webpackHotMiddleware(compiler, {
          log: console.log,
          path: '/__webpack_hmr',
          heartbeat: 10 * 1000,
        }),
      );
    }
  }
}

/**
 * Creates a new server instance
 */
new Server([new IndexController(), new DefaultController()], serverConfig.env.port);
