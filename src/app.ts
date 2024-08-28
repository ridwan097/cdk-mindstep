// @ts-nocheck
require('dotenv').config();
import { Duration, StackProps } from 'aws-cdk-lib';
import {
  LambdaIntegration,
  MethodLoggingLevel,
  RestApi,
} from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import {
  NodejsFunction,
  NodejsFunctionProps,
} from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
const routes = require('./routes.json');

interface LambdaApiStackProps extends StackProps {
  functionName: string;
}

function Lambda(scope: any, id: string, props: LambdaApiStackProps) {
  let restApi = new RestApi(scope, scope.stackName + 'RestApi', {
    deployOptions: {
      stageName: process.env.STAGE_NAME || 'dev',
      metricsEnabled: true,
      loggingLevel: MethodLoggingLevel.INFO,
      dataTraceEnabled: true,
    },
  });

  const nodeJsFunctionProps: NodejsFunctionProps = {
    bundling: {
      externalModules: [
        '@aws-sdk/*', // Use the 'aws-sdk' available in the Lambda
        'superagent-proxy',
      ],
    },
    depsLockFilePath: path.join(__dirname, 'package-lock.json'),
    environment: {
      MONGO_URI: process.env.MONGO_URI || '',
    },
    runtime: Runtime.NODEJS_20_X,
  };

  for (const key in routes) {
    const route = routes[key];

    let lambdaNodeFun = new NodejsFunction(scope, props.functionName + key, {
      entry: path.join(__dirname, 'handlers', route.path),
      handler: 'default',
      timeout: Duration.seconds(10),
      bundling: {
        minify: true,
      },
      ...nodeJsFunctionProps,
    });

    let lambdaIntegration = new LambdaIntegration(lambdaNodeFun);
    let endPoint = restApi.root.resourceForPath(route.endPoint);

    if (route.params) {
      endPoint = endPoint.resourceForPath(`{${route.params}}`);
    }

    console.log(`Adding method ${route.method} to endpoint ${route.endPoint}`);
    endPoint.addMethod(route.method, lambdaIntegration);
  }

  console.dir(restApi.methods);
}

export default Lambda;
