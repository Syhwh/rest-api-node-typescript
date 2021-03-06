import initTests from '../../utils/initTests';
import {API_ROUTE_V1} from '../../../../utils/constants';
import {Response} from 'express';
import { OK, FORBIDDEN, UNAUTHORIZED, NOT_FOUND } from 'http-status-codes';
import config from '../../../../config';
import {TEST_INVALID_JWT_TOKEN, TEST_INVALID_EMAIL,TEST_DIFFERENT_VALID_EMAIL, TEST_DIFFERENT_VALID_PASSWORD,TEST_VALID_PASSWORD, TEST_TOO_SHORT_PASSWORD,TEST_VALID_ANOTHER_REGIRSTER_USER, TEST_VALID_REGISTER_USER } from '../../../../utils/testValues';
import expectError from '../../utils/expectError';
import generateJwtToken from '../../../../utils/jwt/generateToken';
import createUserWithPermission from '../../utils/createUserWithPermission';
import {CAN_UPDATE_PERMISSION, DEFAULT_USERS_PAGINATION_LIMIT, DEFAULT_USERS_PAGINATION_OFFSET} from '../../../../utils/constants';
import {fakePermissions} from '../../../../utils/fakesFactory';
import verifyPassword from '../../../../utils/verifyPassword';
import * as moment from 'moment';
import { TEST_VALID_TITLE, TEST_VALID_DESCRIPTION } from '../../../../utils/testValues';

describe(__filename, () => {

  const { service, request } = initTests();

  it('should fail to update permission when unauthenticated', async () => {
    const response = await request.patch(`${API_ROUTE_V1}/permissions/1`);
    expectError(response, UNAUTHORIZED);
  });

  it('should fail to update permission when invalid token provided in authorization header', async () => {
    const response = await request.patch(`${API_ROUTE_V1}/permissions/1`)
                                  .set('Authorization' , TEST_INVALID_JWT_TOKEN);
    expectError(response, UNAUTHORIZED);
  });

  it('should fail to update permission when insufficent permissions', async () => {
    const userWithoutPermissions = await service.createUser(TEST_VALID_REGISTER_USER);
    const validToken = await generateJwtToken({data: {id: userWithoutPermissions.id}});
    const response = await request.patch(`${API_ROUTE_V1}/permissions/${userWithoutPermissions.id}`)
                                  .set('Authorization' , validToken);
    expectError(response, FORBIDDEN);
  });

  it('should fail to update permission which does not exist', async () => {
    const user = await createUserWithPermission(service, CAN_UPDATE_PERMISSION);
    
    const validToken = await generateJwtToken({data: {id: user.id}});
    const response = await request.patch(`${API_ROUTE_V1}/permissions/999`)
                                  .set('Authorization' , validToken)
                                  .send({
                                    name: TEST_VALID_TITLE
                                  });

    expectError(response, NOT_FOUND);
  });

  it('should successfuly update permission with valid data', async () => {
    const user = await createUserWithPermission(service, CAN_UPDATE_PERMISSION);

    const permissionData = fakePermissions({
      count: 1,
      only: ['name','label','description']
    }); 
    const permissionToBeUpdated = await service.createPermission(permissionData);
    
    const validToken = await generateJwtToken({data: {id: user.id}});
    const response = await request.patch(`${API_ROUTE_V1}/permissions/${permissionToBeUpdated.id}`)
                                  .set('Authorization' , validToken)
                                  .send({
                                    name: TEST_VALID_TITLE,
                                    label: TEST_VALID_TITLE,
                                    description: TEST_VALID_DESCRIPTION,
                                  });
    const now = moment();
    const correctUpdateAt = moment.duration(now.diff(response.body.updated_at)).asMilliseconds() < 10000;
    expect(response.body.name).toEqual(TEST_VALID_TITLE);
    expect(response.body.label).toEqual(TEST_VALID_TITLE);   
    expect(response.body.description).toEqual(TEST_VALID_DESCRIPTION);
    expect(response.status).toBe(OK);
  });
});