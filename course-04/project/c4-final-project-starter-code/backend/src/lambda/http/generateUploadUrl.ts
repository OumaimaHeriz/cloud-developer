import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../helpers/businessLogic'
import { getUserId } from '../utils'

export const handler = middy(
	async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		const todoId = event.pathParameters.todoId
		// TODO: Return a presigned URL to upload a file for a TODO item with the provided id
		try {
			const userId = getUserId(event);
			const data = await createAttachmentPresignedUrl(todoId, userId)
	
			return{
				statusCode: 200,
				body: JSON.stringify({
					uploadUrl: data
				})
			}
		}
		catch (error) {
			return{
                statusCode: 500,
                body: "Request failed"
            }
		}
	}
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
