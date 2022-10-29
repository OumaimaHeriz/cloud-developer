import 'source-map-support/register'
import { createLogger } from '../../utils/logger';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosForUser } from '../../helpers/businessLogic'
import { getUserId } from '../utils';

const logger = createLogger('TodosAccess')

// TODO: Get all TODO items for a current user
export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        // Write your code here
        try {
            const userId = getUserId(event);

            const todos = await getTodosForUser(userId)

            return {
                statusCode: 200,
                body: JSON.stringify(todos)
            }
        } catch (error) {
            console.log(error)
            logger.error(error);
            return{
                statusCode: 500,
                body: "Request failed"
            }
        }
        
    }
)

handler.use(
  cors({
    credentials: true
  })
)
