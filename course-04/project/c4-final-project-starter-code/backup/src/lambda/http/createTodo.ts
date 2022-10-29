import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

//import { getUerId } from '../utils';
import { todoBuilder } from '../../helpers/todos'
import { createTodo } from '../../helpers/todosAcess';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    
    // TODO: Implement creating a new TODO item
      
    const todo= todoBuilder(newTodo,event)
      
    const createTodo =await createTodo(newTodo)
       return
       {
        statusCode: 201
       
        body: JSON.stringify({
          createTodo
        })
      }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
