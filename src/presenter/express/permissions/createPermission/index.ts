import Config from '../../Config';
import catchErrors from '../../utils/catchErrors';
import { CREATED } from 'http-status-codes';
import getAuthUserAndPermissions from '../../../../utils/jwt/getAuthUserAndPermissions';
import hasPermission from '../../../../utils/jwt/hasPermission';
import { CAN_CREATE_PERMISSION, VARCHAR_FIELD_LENGTH, TEXT_FIELD_LENGTH } from '../../../../utils/constants';
import { maxLength } from '../../../../utils/validate';

import { maybe, required, optional, checkType,composeRules, first, restrictToSchema } from 'rulr';
import * as R from 'ramda';

const validateCreatePermission = maybe(composeRules([
  restrictToSchema({
    name: required(maxLength(VARCHAR_FIELD_LENGTH)),
    label: optional(maxLength(VARCHAR_FIELD_LENGTH)),
    description: optional(maxLength(TEXT_FIELD_LENGTH)),
  })
]));

export default (config: Config) => {
  return catchErrors(config, async (req, res) => {
  
    const { permissions } = await getAuthUserAndPermissions({req, service: config.service});

    hasPermission({permissions, permissionName: CAN_CREATE_PERMISSION});
 
    validateCreatePermission(req.body, ['Permission']);
    
    const createdPermission = await config.service.createPermission(req.body);

    res.status(CREATED).json(createdPermission);
  });
};