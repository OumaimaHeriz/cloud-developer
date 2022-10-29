import * as AWS from 'aws-sdk';
import * as AWS_XRAY from "aws-xray-sdk";
import { createLogger } from '../utils/logger';

const XAWS = AWS_XRAY.captureAWS(AWS)
const urlExp = process.env.SIGNED_URL_EXPIRATION;
const bucketName = process.env.ATTACHMENT_S3_BUCKET;
const logger = createLogger('TodosAccess');
const S3 = new XAWS.S3({
	signatureVersion: "v4"
  })


// TODO: Implement the fileStogare logic
export function deleteBucket(todoId: string){
	S3.deleteObject({
		Bucket: bucketName,
		Key: todoId
	}, function(err) {
		if (err) logger.log("error", err.stack);
	});
}

export function getUploadUrl(todoId: string){
	return S3.getSignedUrl('putObject',{
		Bucket: bucketName,
		Key: todoId,
		Expires: parseInt(urlExp)
	})
}
