import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as s3 from "aws-cdk-lib/aws-s3";
import path = require("path");

export class AwsLtCliApiStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create S3 bucket
    const bucket = new s3.Bucket(this, "CliPhotoCache", {
      bucketName: 'lt-cli-photo-cache',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Create Lambda function
    const lambdaFn = new lambda.Function(this, "LtCliLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../lambda"),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
      timeout: cdk.Duration.seconds(30),
    });

    // Grant Lambda access to S3
    bucket.grantReadWrite(lambdaFn);

    // Create API Gateway
    const api = new apigateway.LambdaRestApi(this, "CliApi", {
      handler: lambdaFn,
      proxy: true,
    });

    new cdk.CfnOutput(this, "ApiUrl", { value: api.url });
  }
}
