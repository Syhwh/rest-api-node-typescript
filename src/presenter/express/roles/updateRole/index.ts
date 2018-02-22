import Config from '../../Config';
import catchErrors from '../../utils/catchErrors';
import {Request, Response} from 'express';
import {OK_200_HTTP_CODE} from '../../utils/constants';
import getAuthUser from '../../../../utils/jwt/getAuthUser';
import hasPermission from '../../../../utils/jwt/hasPermission';
import {CAN_UPDATE_ROLE,VARCHAR_FIELD_LENGTH,TEXT_FIELD_LENGTH} from '../../../../utils/constants';
import {minLength,maxLength, isEmail, validateMatchingPasswords} from '../../../../utils/validate';
import {maybe, optional, checkType,composeRules, restrictToSchema}from 'rulr';
import * as R from 'ramda';

const validateUpdatePost = maybe(composeRules([
  restrictToSchema({
    name: optional(maxLength(VARCHAR_FIELD_LENGTH)),
    description: optional(maxLength(TEXT_FIELD_LENGTH)),
  })
]));

export default (config: Config) => {
  return catchErrors(config, async (req: Request, res: Response): Promise<void> => {
  
    const user = await getAuthUser({req, service: config.service});

    hasPermission({user, permissionName: CAN_UPDATE_ROLE});
 
    validateUpdatePost(req.body, ['role']);
    
    const {role_id} = req.params;

    const updateRole = await config.service.updateRole({id: role_id, data: req.body});

    res.status(OK_200_HTTP_CODE).json(updateRole);
  });

};