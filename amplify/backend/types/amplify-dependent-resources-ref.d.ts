export type AmplifyDependentResourcesAttributes = {
    "auth": {
        "screenalbum71f13e23": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        },
        "userPoolGroups": {
            "adminGroupRole": "string",
            "usersGroupRole": "string"
        }
    },
    "storage": {
        "screenshot": {
            "BucketName": "string",
            "Region": "string"
        }
    },
    "function": {
        "AdminQueries599e86cd": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    },
    "api": {
        "AdminQueries": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        }
    },
    "analytics": {
        "screenalbum": {
            "Region": "string",
            "Id": "string",
            "appName": "string"
        }
    }
}