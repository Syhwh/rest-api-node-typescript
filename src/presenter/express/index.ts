import { Router, Request, Response} from 'express';
import Config from './Config';
import enhancedRouter from './enhancedRouter';
import {register, login, forgetPassword,resetPassword} from './auth';


export default (config: Config): Router => {
  const router: Router = enhancedRouter(config);

  router.get('/', (req: Request, res: Response) => {
    res.status(200)
       .json({message: "This is where the awesomeness happen..."});
  });

  router.post('/auth/register', register(config));
  router.post('/auth/login', login(config));
  router.post('/auth/forget-password', forgetPassword(config));
  router.post('/auth/reset-password', resetPassword(config));
  
  return router;
}