import * as cdk from 'aws-cdk-lib';
import { StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import lambdas from '../src/app';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface LambdaApiStackProps extends StackProps {
  functionName: string;
}
export class CdkMindstepStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: LambdaApiStackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkMindstepQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    lambdas(this, id, props);
  }
}
