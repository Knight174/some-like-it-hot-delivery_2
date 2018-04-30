const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;
const VALIDATION_MESSAGE = `You haven't provided `;

exports.handler = (event, context, cb) => {
	console.log('GET deliveries');
	let deliveryRequest = JSON.parse(event.body);
    cb(null, formatReply(null, deliveryRequest));

	docClient.scan({
		TableName: TABLE_NAME
	}).promise().then(response => {
		cb(null, formatReply(null, deliveryRequest));
	}).catch(err => {
		cb(formatReply(err));
	});
};

function formatReply(errorMessage, data) {
	let statusCode = errorMessage ? 400 : 200;
	let bodyData = errorMessage ? {message: errorMessage} : data;
	return {
		statusCode: statusCode,
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(bodyData)
	};
}