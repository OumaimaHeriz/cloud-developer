import { createLogger } from '../utils/logger';
import { v4 as uuid}  from 'uuid';
import { TodoUpdate } from '../models/TodoUpdate';
import { getUploadUrl } from './fileManagement';
import {getDocumentClient} from "@shelf/aws-ddb-with-xray";

const bucketName = process.env.ATTACHMENT_S3_BUCKET;
const region = process.env.REGION;
const tableName = process.env.TODOS_TABLE
const logger = createLogger('TodosAccess');
const DB = getDocumentClient({
  ddbParams: {region: region, convertEmptyValues: true},
  ddbClientParams: {region: region},
});

// TODO: Implement the dataLayer logic

export function getTodos(userId: string): Promise<any>{
    return new Promise(async(resolve, reject) => {
		try {
			const result = await DB.query({
				TableName: tableName,
				KeyConditionExpression: "userId = :userId",
				ExpressionAttributeValues: {":userId": `${userId}`}
			}).promise();
			console.log(result)
			resolve(result);
		} catch (error) {
			reject(error)
		}
        
    })
}

export async function createTodo(todo: {}, userId: string) {
	try {
		const todoId = uuid();
				
		const new_todo = {
			todoId,
			userId,
			
			done: false,
			attachmentUrl: "",
			...todo
		}

		await DB.put({
			TableName: tableName,
			Item: new_todo
		}).promise();
		
		return new_todo;
	} 
	catch (error) {
		logger.log('error', error);
		return error;
	}	
}

export async function deleteTodo(todoId: string, userId: string) {
	try {
		await DB.delete({
			TableName: tableName,
			Key: {
				todoId,
				userId
			}
		}).promise();
		
		return true;
	} 
	catch (error) {
		logger.log('error', error);
		return error;
	}
	
}

export async function updateTodo(todo: TodoUpdate, todoId: string, userId: string) {
	try {
		await DB.update({
			TableName: tableName,
			UpdateExpression: "set #name = :val, done = :done",
			ExpressionAttributeValues: {":val": `${todo.name}`, ":done": `${todo.done}`},
			ExpressionAttributeNames: {
				"#name": "name"
			},
			Key: {
				todoId,
				userId
			}
		}).promise();
		
		return true;
	} 
	catch (error) {
		logger.log('error', error);
		return error;
	}	
}

export async function generateUrl(todoId: string, userId: string) {
	try {
		const uploadUrl = getUploadUrl(todoId);
		const imageUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`;

		await DB.update({
			TableName: tableName,
			UpdateExpression: "set attachmentUrl = :url",
			ExpressionAttributeValues: {":url": `${imageUrl}`},
			Key: {
				todoId,
				userId
			}
		}).promise();
		
		return uploadUrl;
	} 
	catch (error) {
		logger.log('error', error);
		return error;
	}
}