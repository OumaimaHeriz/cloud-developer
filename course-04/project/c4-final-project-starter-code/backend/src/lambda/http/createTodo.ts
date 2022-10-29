import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createUserTodo } from '../../helpers/businessLogic';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
	const userId = getUserId(event)
	try {
		const todo = await createUserTodo(newTodo, userId)
		return{
			statusCode: 200,
			body: JSON.stringify({
				item: todo
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

handler.use(
  cors({
    credentials: true
  })
)
