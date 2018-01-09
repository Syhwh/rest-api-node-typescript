import Config from '../../Config';
import catchErrors from '../../utils/catchErrors';
import {Request, Response} from 'express';
import {OK_200_HTTP_CODE} from '../../utils/constants';
import requireAuth from '../../../../utils/jwt/requireAuth';
import hasPermission from '../../../../utils/jwt/hasPermission';
import {PERMISSION_GET_USERS} from '../../../../utils/constants';
import {maybe, optional,checkType,composeRules, first, restrictToSchema}from 'rulr';
import {ModelNotFoundError} from '../../../../utils/errors';

const validateGetUsers = maybe(
  restrictToSchema({
    limit: optional(checkType(Number)),
    offset: optional(checkType(Number)),
    order: optional(checkType(String))
  }),
);

export default (config: Config) => {
  return catchErrors(config, async (req: Request, res: Response): Promise<void> => {
    
    const authenticatedUser = await requireAuth({req, service: config.service});

    hasPermission({user: authenticatedUser, permissionName: PERMISSION_GET_USERS});

    validateGetUsers(req.params,['users']);

    const {limit, offset, order} = req.query;
    
    const users = await config.service.getUsers({limit, offset, order});
    
    res.status(OK_200_HTTP_CODE).json(users);
  });
}
  
  