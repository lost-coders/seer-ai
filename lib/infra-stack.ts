import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const githubPatSecret = new Secret(this, 'gihubPATSecret', {
      secretName: 'github-pat-secret',
    });

    const indexFunction = new NodejsFunction(this, 'index-function', {
      entry: './src/handlers/index.ts',
      environment: {
        PAT_SECRET_ARN: githubPatSecret.secretArn,
      },
    });

    const seerAiApi = new RestApi(this, 'seerAiApi', {
      restApiName: 'Seer AI API',
    });

    const rootGetEndpointIntegration = new LambdaIntegration(indexFunction);

    seerAiApi.root.addMethod('get', rootGetEndpointIntegration);

    githubPatSecret.grantRead(indexFunction);
  }
}
