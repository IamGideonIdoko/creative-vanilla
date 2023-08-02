import type { Controller } from '@/server/interfaces';
import { Router, type Request, type Response, type NextFunction } from 'express';

/**
 * The DefaultController class for all unhandled requests.
 */
export class DefaultController implements Controller {
  /**
   * Regex to accept all path
   * This should be at the last of the controller list
   * */
  public path = '*';
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
    // Matches all the unmatched routes and display the default not found page
    this.router.get(this.path, this.notFound.bind(this));
  }

  private notFound(req: Request, res: Response, next: NextFunction) {
    try {
      return res.render('pages/notfound');
    } catch (err) {
      next(err);
    }
  }
}
