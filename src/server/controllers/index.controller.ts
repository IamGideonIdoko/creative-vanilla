import type { Controller } from '@/s/interfaces';
import { Router, type Request, type Response, type NextFunction } from 'express';

export class IndexController implements Controller {
  // The base URL path for this controller
  public path = '/';
  // Express router for this controller
  public router = Router();

  /**
   * The constructor is used to initialize the
   * routes for this controller
   */
  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    // Index route for the home page of the app
    this.router.get(this.path, this.indexPage.bind(this));
  }

  private indexPage(req: Request, res: Response, next: NextFunction) {
    try {
      return res.render('base');
    } catch (err) {
      next(err);
    }
  }
}
