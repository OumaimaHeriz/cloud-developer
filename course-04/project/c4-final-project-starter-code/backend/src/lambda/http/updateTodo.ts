import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateUserTodo } from '../../helpers/businessLogic';
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
	try {
		const userId = getUserId(event);
		const data = await updateUserTodo(updatedTodo, todoId, userId)

		return{
			statusCode: 200,
			body: JSON.stringify({
				data
			})
		}
	}
	catch (error) {
		return{
			statusCode: 500,
			body: "Request failed"
		}
	}
})

handler
	.use(httpErrorHandler())
	.use(
		cors({
		credentials: true
		})
  )
