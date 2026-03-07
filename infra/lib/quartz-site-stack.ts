import * as cdk from "aws-cdk-lib";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as apigwAuthorizers from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import * as apigwIntegrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as config from "aws-cdk-lib/aws-config";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import { NagSuppressions } from "cdk-nag";
import * as path from "path";

export class QuartzSiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const deploymentStage =
      (this.node.tryGetContext("deploymentStage") as string | undefined) ?? "dev";
    if (deploymentStage !== "dev" && deploymentStage !== "prod") {
      throw new Error(
        `Invalid deploymentStage '${deploymentStage}'. Allowed values: dev, prod`,
      );
    }

    const environmentTag =
      (this.node.tryGetContext("tagEnvironment") as string | undefined) ??
      (deploymentStage === "prod" ? "Production" : "Development");
    const allowedEnvironments = [
      "Production",
      "Staging",
      "Development",
      "Test",
    ] as const;

    if (!(allowedEnvironments as readonly string[]).includes(environmentTag)) {
      throw new Error(
        `Invalid tagEnvironment '${environmentTag}'. Allowed values: ${allowedEnvironments.join(", ")}`,
      );
    }

    const governanceTags = {
      CostCenter:
        (this.node.tryGetContext("tagCostCenter") as string | undefined) ?? "CC0000",
      Description:
        (this.node.tryGetContext("tagDescription") as string | undefined) ??
        "diopside-infrastructure-stack",
      Environment: environmentTag,
      Owner: (this.node.tryGetContext("tagOwner") as string | undefined) ?? "platform-team",
      Project: (this.node.tryGetContext("tagProject") as string | undefined) ?? "diopside",
      ManagedBy: "CDK",
    } as const;

    for (const [key, value] of Object.entries(governanceTags)) {
      cdk.Tags.of(this).add(key, value);
    }

    const keyPrefix = "obsidian";
    const siteAssetPath =
      (this.node.tryGetContext("siteAssetPath") as string | undefined) ??
      path.join(__dirname, "../../quartz/public");
    const githubOwner =
      (this.node.tryGetContext("githubOwner") as string | undefined) ?? "tsuji-tomonori";
    const githubRepo =
      (this.node.tryGetContext("githubRepo") as string | undefined) ?? "diopside-v3";
    const githubEnvironment =
      (this.node.tryGetContext("githubEnvironment") as string | undefined) ?? "prod";
    const githubSub = `repo:${githubOwner}/${githubRepo}:environment:${githubEnvironment}`;
    const adminIngressCidr =
      (this.node.tryGetContext("adminIngressCidr") as string | undefined) ?? "10.0.0.0/8";
    const apiOriginVerifySecret =
      (this.node.tryGetContext("apiOriginVerifySecret") as string | undefined) ??
      `${cdk.Aws.ACCOUNT_ID}-${cdk.Aws.STACK_NAME}-origin-verify`;

    const vpcCidr = deploymentStage === "prod" ? "10.22.0.0/16" : "10.20.0.0/16";
    const publicSubnetCidr = deploymentStage === "prod" ? "10.22.0.0/24" : "10.20.0.0/24";
    const privateAppSubnetCidr =
      deploymentStage === "prod" ? "10.22.10.0/24" : "10.20.10.0/24";
    const privateDataSubnetCidr =
      deploymentStage === "prod" ? "10.22.20.0/24" : "10.20.20.0/24";

    const vpc = new ec2.CfnVPC(this, "MainVpc", {
      cidrBlock: vpcCidr,
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });

    const publicSubnet = new ec2.CfnSubnet(this, "PublicSubnet", {
      vpcId: vpc.ref,
      cidrBlock: publicSubnetCidr,
      mapPublicIpOnLaunch: true,
      availabilityZone: cdk.Fn.select(0, cdk.Fn.getAzs()),
    });
    const privateAppSubnet = new ec2.CfnSubnet(this, "PrivateAppSubnet", {
      vpcId: vpc.ref,
      cidrBlock: privateAppSubnetCidr,
      mapPublicIpOnLaunch: false,
      availabilityZone: cdk.Fn.select(0, cdk.Fn.getAzs()),
    });
    const privateDataSubnet = new ec2.CfnSubnet(this, "PrivateDataSubnet", {
      vpcId: vpc.ref,
      cidrBlock: privateDataSubnetCidr,
      mapPublicIpOnLaunch: false,
      availabilityZone: cdk.Fn.select(0, cdk.Fn.getAzs()),
    });

    const internetGateway = new ec2.CfnInternetGateway(this, "InternetGateway");
    const igwAttachment = new ec2.CfnVPCGatewayAttachment(this, "IgwAttachment", {
      vpcId: vpc.ref,
      internetGatewayId: internetGateway.ref,
    });

    const publicRouteTable = new ec2.CfnRouteTable(this, "PublicRouteTable", {
      vpcId: vpc.ref,
    });
    const privateAppRouteTable = new ec2.CfnRouteTable(this, "PrivateAppRouteTable", {
      vpcId: vpc.ref,
    });
    const privateDataRouteTable = new ec2.CfnRouteTable(this, "PrivateDataRouteTable", {
      vpcId: vpc.ref,
    });

    const publicRoute = new ec2.CfnRoute(this, "PublicDefaultRoute", {
      routeTableId: publicRouteTable.ref,
      destinationCidrBlock: "0.0.0.0/0",
      gatewayId: internetGateway.ref,
    });
    publicRoute.addDependency(igwAttachment);

    // Private app subnet is intentionally isolated from direct internet egress
    // to avoid always-on NAT costs and enforce endpoint-based outbound control.

    new ec2.CfnSubnetRouteTableAssociation(this, "PublicRouteAssociation", {
      subnetId: publicSubnet.ref,
      routeTableId: publicRouteTable.ref,
    });
    new ec2.CfnSubnetRouteTableAssociation(this, "PrivateAppRouteAssociation", {
      subnetId: privateAppSubnet.ref,
      routeTableId: privateAppRouteTable.ref,
    });
    new ec2.CfnSubnetRouteTableAssociation(this, "PrivateDataRouteAssociation", {
      subnetId: privateDataSubnet.ref,
      routeTableId: privateDataRouteTable.ref,
    });

    const publicNacl = new ec2.CfnNetworkAcl(this, "PublicNetworkAcl", {
      vpcId: vpc.ref,
    });
    const privateNacl = new ec2.CfnNetworkAcl(this, "PrivateNetworkAcl", {
      vpcId: vpc.ref,
    });
    new ec2.CfnSubnetNetworkAclAssociation(this, "PublicNaclAssociation", {
      subnetId: publicSubnet.ref,
      networkAclId: publicNacl.ref,
    });
    new ec2.CfnSubnetNetworkAclAssociation(this, "PrivateAppNaclAssociation", {
      subnetId: privateAppSubnet.ref,
      networkAclId: privateNacl.ref,
    });
    new ec2.CfnSubnetNetworkAclAssociation(this, "PrivateDataNaclAssociation", {
      subnetId: privateDataSubnet.ref,
      networkAclId: privateNacl.ref,
    });

    new ec2.CfnNetworkAclEntry(this, "PublicNaclDenyIngress", {
      networkAclId: publicNacl.ref,
      egress: false,
      protocol: -1,
      ruleAction: "deny",
      ruleNumber: 32766,
      cidrBlock: "0.0.0.0/0",
    });
    new ec2.CfnNetworkAclEntry(this, "PublicNaclDenyEgress", {
      networkAclId: publicNacl.ref,
      egress: true,
      protocol: -1,
      ruleAction: "deny",
      ruleNumber: 32766,
      cidrBlock: "0.0.0.0/0",
    });
    new ec2.CfnNetworkAclEntry(this, "PrivateNaclDenyIngress", {
      networkAclId: privateNacl.ref,
      egress: false,
      protocol: -1,
      ruleAction: "deny",
      ruleNumber: 32766,
      cidrBlock: "0.0.0.0/0",
    });
    new ec2.CfnNetworkAclEntry(this, "PrivateNaclDenyEgress", {
      networkAclId: privateNacl.ref,
      egress: true,
      protocol: -1,
      ruleAction: "deny",
      ruleNumber: 32766,
      cidrBlock: "0.0.0.0/0",
    });

    new ec2.CfnVPCEndpoint(this, "S3GatewayEndpoint", {
      serviceName: `com.amazonaws.${cdk.Aws.REGION}.s3`,
      vpcId: vpc.ref,
      routeTableIds: [privateAppRouteTable.ref, privateDataRouteTable.ref],
      vpcEndpointType: "Gateway",
    });

    const publicSg = new ec2.CfnSecurityGroup(this, "PublicSecurityGroup", {
      vpcId: vpc.ref,
      groupDescription: "Public ingress for HTTPS and HTTP redirect",
      groupName: `public-sg-${deploymentStage}`,
      securityGroupIngress: [
        {
          ipProtocol: "tcp",
          fromPort: 80,
          toPort: 80,
          cidrIp: "0.0.0.0/0",
          description: "Allow HTTP for HTTPS redirect",
        },
        {
          ipProtocol: "tcp",
          fromPort: 443,
          toPort: 443,
          cidrIp: "0.0.0.0/0",
          description: "Allow HTTPS",
        },
      ],
      securityGroupEgress: [
        {
          ipProtocol: "-1",
          cidrIp: "0.0.0.0/0",
          description: "Allow all egress",
        },
      ],
    });

    const adminSg = new ec2.CfnSecurityGroup(this, "AdminSecurityGroup", {
      vpcId: vpc.ref,
      groupDescription: "Administrative ingress boundary",
      groupName: `admin-sg-${deploymentStage}`,
      securityGroupIngress: [
        {
          ipProtocol: "tcp",
          fromPort: 443,
          toPort: 443,
          cidrIp: adminIngressCidr,
          description: "Allow controlled admin ingress",
        },
      ],
      securityGroupEgress: [
        {
          ipProtocol: "-1",
          cidrIp: "0.0.0.0/0",
          description: "Allow all egress",
        },
      ],
    });

    const appSg = new ec2.CfnSecurityGroup(this, "AppSecurityGroup", {
      vpcId: vpc.ref,
      groupDescription: "Application egress boundary",
      groupName: `app-sg-${deploymentStage}`,
      securityGroupIngress: [],
      securityGroupEgress: [
        {
          ipProtocol: "tcp",
          fromPort: 443,
          toPort: 443,
          cidrIp: "0.0.0.0/0",
          description: "Allow TLS egress only",
        },
      ],
    });

    const permissionBoundary = new iam.ManagedPolicy(this, "RolePermissionBoundary", {
      description: "Permission boundary for infrastructure roles",
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.DENY,
          actions: ["iam:*", "kms:ScheduleKeyDeletion", "s3:DeleteBucket"],
          resources: ["*"],
        }),
      ],
    });

    const githubOidcProvider = new iam.OpenIdConnectProvider(this, "GithubOidcProvider", {
      url: "https://token.actions.githubusercontent.com",
      clientIds: ["sts.amazonaws.com"],
    });

    const githubActionsDeployRole = new iam.Role(this, "GithubActionsDeployRole", {
      description: "Assumed by GitHub Actions (OIDC) to run docs deploy via CDK",
      maxSessionDuration: cdk.Duration.hours(1),
      permissionsBoundary: permissionBoundary,
      assumedBy: new iam.OpenIdConnectPrincipal(githubOidcProvider).withConditions({
        StringEquals: {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": githubSub,
        },
      }),
      inlinePolicies: {
        DocsDeployPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                "cloudformation:CreateChangeSet",
                "cloudformation:DeleteChangeSet",
                "cloudformation:DescribeChangeSet",
                "cloudformation:DescribeStacks",
                "cloudformation:ExecuteChangeSet",
                "cloudformation:GetTemplate",
                "cloudformation:UpdateStack",
                "cloudfront:CreateInvalidation",
                "cloudfront:GetDistribution",
                "cloudfront:GetDistributionConfig",
                "cloudfront:ListDistributions",
                "cloudfront:TagResource",
                "cloudfront:UntagResource",
                "cloudfront:UpdateDistribution",
                "iam:CreateRole",
                "iam:DeleteRole",
                "iam:GetRole",
                "iam:PassRole",
                "iam:PutRolePolicy",
                "iam:DeleteRolePolicy",
                "iam:TagRole",
                "iam:UntagRole",
                "iam:UpdateAssumeRolePolicy",
                "lambda:AddPermission",
                "lambda:CreateFunction",
                "lambda:DeleteFunction",
                "lambda:GetFunction",
                "lambda:GetLayerVersion",
                "lambda:ListVersionsByFunction",
                "lambda:PublishLayerVersion",
                "lambda:RemovePermission",
                "lambda:TagResource",
                "lambda:UntagResource",
                "lambda:UpdateFunctionCode",
                "lambda:UpdateFunctionConfiguration",
                "s3:CreateBucket",
                "s3:DeleteBucket",
                "s3:DeleteObject",
                "s3:GetBucketLocation",
                "s3:GetBucketPolicy",
                "s3:GetBucketTagging",
                "s3:GetObject",
                "s3:ListBucket",
                "s3:PutBucketPolicy",
                "s3:PutBucketPublicAccessBlock",
                "s3:PutBucketTagging",
                "s3:PutEncryptionConfiguration",
                "s3:PutObject",
                "s3:PutBucketVersioning",
                "s3:PutLifecycleConfiguration",
                "s3:PutBucketOwnershipControls",
                "ssm:GetParameter",
              ],
              resources: ["*"],
            }),
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ["sts:AssumeRole"],
              resources: [
                cdk.Stack.of(this).formatArn({
                  service: "iam",
                  account: cdk.Aws.ACCOUNT_ID,
                  resource: "role",
                  resourceName: "cdk-*",
                  region: "",
                }),
              ],
            }),
          ],
        }),
      },
    });

    const opsReadonlyRole = new iam.Role(this, "InfraReadonlyRole", {
      roleName: `infra-readonly-role-${deploymentStage}`,
      description: "Readonly role for operations dashboards and diagnostics",
      maxSessionDuration: cdk.Duration.hours(1),
      permissionsBoundary: permissionBoundary,
      assumedBy: new iam.AccountPrincipal(cdk.Aws.ACCOUNT_ID),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchReadOnlyAccess"),
        iam.ManagedPolicy.fromAwsManagedPolicyName("AWSConfigUserAccess"),
      ],
    });

    const auditReadonlyRole = new iam.Role(this, "InfraAuditRole", {
      roleName: `infra-audit-role-${deploymentStage}`,
      description: "Readonly role for audit access to trail and config evidence",
      maxSessionDuration: cdk.Duration.hours(1),
      permissionsBoundary: permissionBoundary,
      assumedBy: new iam.AccountPrincipal(cdk.Aws.ACCOUNT_ID),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName("SecurityAudit")],
    });

    const breakglassRole = new iam.Role(this, "BreakglassAdminRole", {
      roleName: `breakglass-admin-role-${deploymentStage}`,
      description: "Emergency breakglass role with short session duration",
      maxSessionDuration: cdk.Duration.hours(1),
      permissionsBoundary: permissionBoundary,
      assumedBy: new iam.AccountRootPrincipal().withConditions({
        Bool: {
          "aws:MultiFactorAuthPresent": "true",
        },
        StringLike: {
          "aws:PrincipalArn": `arn:aws:iam::${cdk.Aws.ACCOUNT_ID}:role/breakglass-operator-*`,
        },
      }),
    });
    breakglassRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"),
    );

    const userPool = new cognito.UserPool(this, "OpsUserPool", {
      userPoolName: `diopside-ops-${deploymentStage}`,
      signInAliases: { email: true },
      selfSignUpEnabled: false,
      passwordPolicy: {
        minLength: 12,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      removalPolicy:
        deploymentStage === "prod" ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    const userPoolClient = new cognito.UserPoolClient(this, "OpsUserPoolClient", {
      userPool,
      generateSecret: false,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      accessTokenValidity: cdk.Duration.hours(1),
      idTokenValidity: cdk.Duration.hours(1),
      refreshTokenValidity: cdk.Duration.days(7),
    });

    const apiHandler = new lambda.Function(this, "ApiHandler", {
      description: "Unified handler for diagnostics and OpenAPI endpoints",
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      timeout: cdk.Duration.seconds(15),
      memorySize: 512,
      code: lambda.Code.fromInline(`
exports.handler = async (event) => {
  const path = event.rawPath || "";
  const now = new Date().toISOString();
  const originVerifyHeader =
    (event.headers && (event.headers["x-origin-verify"] || event.headers["X-Origin-Verify"])) || "";

  if (!originVerifyHeader || originVerifyHeader !== process.env.ORIGIN_VERIFY_SECRET) {
    return {
      statusCode: 403,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "forbidden" })
    };
  }

  if (path === "/api/v1/ops/diagnostics/health") {
    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "ok", degraded: false, timestamp: now })
    };
  }

  if (path === "/openapi/v1/openapi.json") {
    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        openapi: "3.0.3",
        info: { title: "diopside API", version: "v1" },
        paths: {
          "/api/v1/ops/diagnostics/health": {
            get: {
              summary: "Diagnostics health",
              responses: {
                "200": { description: "OK" }
              }
            }
          }
        }
      })
    };
  }

  if (path.startsWith("/openapi")) {
    return {
      statusCode: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
      body: "<!doctype html><html><body><h1>OpenAPI</h1><p>Use /openapi/v1/openapi.json</p></body></html>"
    };
  }

  return {
    statusCode: 404,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ error: "not_found", path })
  };
};
`),
      environment: {
        DEPLOYMENT_STAGE: deploymentStage,
        ORIGIN_VERIFY_SECRET: apiOriginVerifySecret,
      },
    });

    new logs.LogGroup(this, "ApiHandlerLogGroup", {
      logGroupName: `/aws/lambda/${apiHandler.functionName}`,
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy:
        deploymentStage === "prod" ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    const httpApi = new apigwv2.HttpApi(this, "PublicHttpApi", {
      apiName: `diopside-public-api-${deploymentStage}`,
      description: "Public API and OpenAPI endpoint behind CloudFront",
      createDefaultStage: true,
    });

    const apiAccessLogGroup =
      deploymentStage === "prod"
        ? new logs.LogGroup(this, "HttpApiAccessLogGroup", {
            logGroupName: `/aws/apigateway/diopside-public-api-${deploymentStage}`,
            retention: logs.RetentionDays.ONE_MONTH,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
          })
        : undefined;

    if (httpApi.defaultStage) {
      const cfnDefaultStage = httpApi.defaultStage.node.defaultChild as apigwv2.CfnStage;
      cfnDefaultStage.defaultRouteSettings = {
        throttlingBurstLimit: 50,
        throttlingRateLimit: 25,
      };
      if (apiAccessLogGroup) {
        cfnDefaultStage.accessLogSettings = {
          destinationArn: apiAccessLogGroup.logGroupArn,
          format: JSON.stringify({
            requestId: "$context.requestId",
            ip: "$context.identity.sourceIp",
            requestTime: "$context.requestTime",
            routeKey: "$context.routeKey",
            status: "$context.status",
            responseLength: "$context.responseLength",
            authorizerError: "$context.authorizer.error",
          }),
        };
      }
    }

    const lambdaIntegration = new apigwIntegrations.HttpLambdaIntegration(
      "ApiLambdaIntegration",
      apiHandler,
    );
    const jwtAuthorizer = new apigwAuthorizers.HttpJwtAuthorizer(
      "OpsJwtAuthorizer",
      userPool.userPoolProviderUrl,
      {
        jwtAudience: [userPoolClient.userPoolClientId],
      },
    );

    httpApi.addRoutes({
      path: "/api/{proxy+}",
      methods: [apigwv2.HttpMethod.ANY],
      integration: lambdaIntegration,
      authorizer: jwtAuthorizer,
    });
    httpApi.addRoutes({
      path: "/openapi/{proxy+}",
      methods: [apigwv2.HttpMethod.ANY],
      integration: lambdaIntegration,
      authorizer: jwtAuthorizer,
    });
    httpApi.addRoutes({
      path: "/openapi",
      methods: [apigwv2.HttpMethod.GET],
      integration: lambdaIntegration,
      authorizer: jwtAuthorizer,
    });

    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      lifecycleRules: [
        {
          noncurrentVersionExpiration: cdk.Duration.days(30),
        },
      ],
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    });

    const siteOrigin = origins.S3BucketOrigin.withOriginAccessControl(siteBucket, {
      originPath: `/${keyPrefix}`,
    });
    const apiDomainName = cdk.Fn.select(2, cdk.Fn.split("/", httpApi.apiEndpoint));
    const apiOrigin = new origins.HttpOrigin(apiDomainName, {
      customHeaders: {
        "x-origin-verify": apiOriginVerifySecret,
      },
    });

    const cloudFrontAccessLogBucket =
      deploymentStage === "prod"
        ? new s3.Bucket(this, "CloudFrontAccessLogBucket", {
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            enforceSSL: true,
            encryption: s3.BucketEncryption.S3_MANAGED,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
            autoDeleteObjects: false,
          })
        : undefined;

    const originRequestWithAuth =
      cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER;

    const rewriteFn = new cloudfront.Function(this, "PrettyUrlRewriteFn", {
      comment: "Rewrite extensionless docs paths to static HTML",
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      code: cloudfront.FunctionCode.fromFile({
        filePath: path.join(__dirname, "../functions/pretty-url-rewrite.js"),
      }),
    });

    const redirectFn = new cloudfront.Function(this, "DefaultRouteRedirectFn", {
      comment: "Redirect unmatched root paths to /web/",
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      code: cloudfront.FunctionCode.fromFile({
        filePath: path.join(__dirname, "../functions/default-route-redirect.js"),
      }),
    });

    const responseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(
      this,
      "SecurityResponseHeadersPolicy",
      {
        comment: "Security response headers for static and API responses",
        securityHeadersBehavior: {
          contentTypeOptions: { override: true },
          frameOptions: {
            frameOption: cloudfront.HeadersFrameOption.DENY,
            override: true,
          },
          referrerPolicy: {
            referrerPolicy: cloudfront.HeadersReferrerPolicy.SAME_ORIGIN,
            override: true,
          },
          strictTransportSecurity: {
            accessControlMaxAge: cdk.Duration.days(365),
            includeSubdomains: true,
            preload: true,
            override: true,
          },
        },
      },
    );

    const distribution = new cloudfront.Distribution(this, "Distro", {
      comment: "CloudFront distribution for diopside web/docs/api delivery",
      defaultRootObject: "index.html",
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      ...(cloudFrontAccessLogBucket
        ? {
            enableLogging: true,
            logBucket: cloudFrontAccessLogBucket,
            logFilePrefix: "cloudfront-access/",
          }
        : {}),
      defaultBehavior: {
        origin: siteOrigin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        functionAssociations: [
          {
            function: redirectFn,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
        responseHeadersPolicy,
      },
      additionalBehaviors: {
        "/api/*": {
          origin: apiOrigin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: originRequestWithAuth,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          responseHeadersPolicy,
        },
        "/openapi/*": {
          origin: apiOrigin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: originRequestWithAuth,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          responseHeadersPolicy,
        },
        "/docs/*": {
          origin: siteOrigin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          functionAssociations: [
            {
              function: rewriteFn,
              eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
            },
          ],
          responseHeadersPolicy,
        },
        "/web/*": {
          origin: siteOrigin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          responseHeadersPolicy,
        },
      },
    });

    new s3deploy.BucketDeployment(this, "DeployQuartzDocs", {
      sources: [s3deploy.Source.asset(siteAssetPath)],
      destinationBucket: siteBucket,
      destinationKeyPrefix: `${keyPrefix}/docs`,
      memoryLimit: 1024,
      distribution,
      distributionPaths: ["/docs/*"],
    });
    new s3deploy.BucketDeployment(this, "DeployWebPlaceholder", {
      sources: [
        s3deploy.Source.data(
          "web/index.html",
          "<!doctype html><html><body><h1>diopside web</h1><p>placeholder</p></body></html>",
        ),
      ],
      destinationBucket: siteBucket,
      destinationKeyPrefix: keyPrefix,
      memoryLimit: 512,
      distribution,
      distributionPaths: ["/web/*"],
    });

    let configBucket: s3.Bucket | undefined;
    let configRole: iam.Role | undefined;
    if (deploymentStage === "prod") {
      configBucket = new s3.Bucket(this, "ConfigBucket", {
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        enforceSSL: true,
        encryption: s3.BucketEncryption.S3_MANAGED,
        removalPolicy: cdk.RemovalPolicy.RETAIN,
        autoDeleteObjects: false,
      });

      configRole = new iam.Role(this, "ConfigRecorderRole", {
        roleName: `config-recorder-role-${deploymentStage}`,
        description: "Role for AWS Config recorder and delivery",
        assumedBy: new iam.ServicePrincipal("config.amazonaws.com"),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWS_ConfigRole"),
        ],
        permissionsBoundary: permissionBoundary,
      });

      const recorder = new config.CfnConfigurationRecorder(this, "ConfigRecorder", {
        roleArn: configRole.roleArn,
        recordingGroup: {
          allSupported: false,
          includeGlobalResourceTypes: false,
          resourceTypes: [
            "AWS::S3::Bucket",
            "AWS::CloudFront::Distribution",
            "AWS::IAM::Role",
            "AWS::ApiGatewayV2::Api",
            "AWS::Lambda::Function",
            "AWS::Cognito::UserPool",
            "AWS::EC2::VPC",
            "AWS::EC2::SecurityGroup",
            "AWS::CloudWatch::Alarm",
          ],
        },
      });

      const deliveryChannel = new config.CfnDeliveryChannel(this, "ConfigDeliveryChannel", {
        s3BucketName: configBucket.bucketName,
      });
      deliveryChannel.addDependency(recorder);

      const requiredTagsRule = new config.CfnConfigRule(this, "RequiredTagsRule", {
        configRuleName: `required-tags-${deploymentStage}`,
        source: {
          owner: "AWS",
          sourceIdentifier: "REQUIRED_TAGS",
        },
        inputParameters: {
          tag1Key: "Project",
          tag2Key: "Environment",
          tag3Key: "Owner",
          tag4Key: "CostCenter",
          tag5Key: "ManagedBy",
          tag6Key: "Description",
        },
      });
      requiredTagsRule.addDependency(deliveryChannel);
    }

    const cloudFront5xxAlarm = new cloudwatch.Alarm(this, "CloudFront5xxCriticalAlarm", {
      alarmDescription: "CloudFront 5xx error rate critical threshold",
      metric: distribution.metric5xxErrorRate({
        period: cdk.Duration.minutes(5),
        statistic: "Average",
      }),
      threshold: 5,
      evaluationPeriods: 2,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      comparisonOperator:
        cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    });

    const billingMetricRegion = "us-east-1";
    const deploymentRegion = props?.env?.region ?? process.env.CDK_DEFAULT_REGION;
    // EstimatedCharges is published in us-east-1 only, so regional stacks must skip
    // direct alarm creation outside that region to keep synth/deploy valid.
    const supportsEstimatedChargeAlarms =
      !deploymentRegion || deploymentRegion === billingMetricRegion;

    let monthlyCostWarnAlarm: cloudwatch.Alarm | undefined;
    let monthlyCostCriticalAlarm: cloudwatch.Alarm | undefined;

    if (supportsEstimatedChargeAlarms) {
      const estimatedChargesMetric = new cloudwatch.Metric({
        namespace: "AWS/Billing",
        metricName: "EstimatedCharges",
        dimensionsMap: {
          Currency: "USD",
        },
        statistic: "Maximum",
        period: cdk.Duration.hours(6),
        region: billingMetricRegion,
      });

      monthlyCostWarnAlarm = new cloudwatch.Alarm(this, "MonthlyCostWarnAlarm", {
        alarmDescription: "Estimated monthly AWS spend crossed warning threshold",
        metric: estimatedChargesMetric,
        threshold: 18,
        evaluationPeriods: 1,
        treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
        comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      });

      monthlyCostCriticalAlarm = new cloudwatch.Alarm(this, "MonthlyCostCriticalAlarm", {
        alarmDescription: "Estimated monthly AWS spend crossed critical threshold",
        metric: estimatedChargesMetric,
        threshold: 20,
        evaluationPeriods: 1,
        treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
        comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      });
    }


    new cdk.CfnOutput(this, "CloudFrontDomainName", {
      description: "CloudFront domain name for public endpoint",
      value: distribution.domainName,
    });
    new cdk.CfnOutput(this, "GithubActionsDeployRoleArn", {
      value: githubActionsDeployRole.roleArn,
      description: "Assume role ARN for GitHub Actions docs deploy workflow",
    });
    new cdk.CfnOutput(this, "GithubOidcProviderArn", {
      value: githubOidcProvider.openIdConnectProviderArn,
      description: "OIDC provider ARN for token.actions.githubusercontent.com",
    });
    new cdk.CfnOutput(this, "OpsUserPoolId", {
      value: userPool.userPoolId,
      description: "Cognito user pool id for protected routes",
    });
    new cdk.CfnOutput(this, "OpsUserPoolClientId", {
      value: userPoolClient.userPoolClientId,
      description: "Cognito user pool client id",
    });
    new cdk.CfnOutput(this, "HttpApiEndpoint", {
      value: httpApi.apiEndpoint,
      description: "HTTP API endpoint for /api/* and /openapi/*",
    });
    new cdk.CfnOutput(this, "VpcId", {
      value: vpc.ref,
      description: "VPC id",
    });
    new cdk.CfnOutput(this, "PublicSecurityGroupId", {
      value: publicSg.attrGroupId,
      description: "Public security group id",
    });
    new cdk.CfnOutput(this, "AdminSecurityGroupId", {
      value: adminSg.attrGroupId,
      description: "Admin security group id",
    });
    new cdk.CfnOutput(this, "AppSecurityGroupId", {
      value: appSg.attrGroupId,
      description: "Application security group id",
    });
    new cdk.CfnOutput(this, "CloudFront5xxCriticalAlarmName", {
      value: cloudFront5xxAlarm.alarmName,
      description: "CloudFront 5xx critical alarm name",
    });
    if (monthlyCostWarnAlarm && monthlyCostCriticalAlarm) {
      new cdk.CfnOutput(this, "MonthlyCostWarnAlarmName", {
        value: monthlyCostWarnAlarm.alarmName,
        description: "Monthly estimated charge warning alarm name",
      });
      new cdk.CfnOutput(this, "MonthlyCostCriticalAlarmName", {
        value: monthlyCostCriticalAlarm.alarmName,
        description: "Monthly estimated charge critical alarm name",
      });
    }
    new cdk.CfnOutput(this, "InfraReadonlyRoleArn", {
      value: opsReadonlyRole.roleArn,
      description: "Readonly operations role ARN",
    });
    new cdk.CfnOutput(this, "InfraAuditRoleArn", {
      value: auditReadonlyRole.roleArn,
      description: "Readonly audit role ARN",
    });
    new cdk.CfnOutput(this, "BreakglassAdminRoleArn", {
      value: breakglassRole.roleArn,
      description: "Breakglass admin role ARN",
    });

    NagSuppressions.addResourceSuppressions(siteBucket, [
      {
        id: "AwsSolutions-S1",
        reason: "S3 access logs are deferred to a centralized logging rollout phase.",
      },
    ]);
    if (configBucket) {
      NagSuppressions.addResourceSuppressions(configBucket, [
        {
          id: "AwsSolutions-S1",
          reason: "Config bucket access logging is deferred in bootstrap phase.",
        },
      ]);
    }
    if (cloudFrontAccessLogBucket) {
      NagSuppressions.addResourceSuppressions(cloudFrontAccessLogBucket, [
        {
          id: "AwsSolutions-S1",
          reason: "CloudFront log bucket receives access logs and does not need recursive logging.",
        },
      ]);
    }
    NagSuppressions.addResourceSuppressions(distribution, [
      {
        id: "AwsSolutions-CFR1",
        reason: "Geo restriction is intentionally disabled for public service scope.",
      },
      {
        id: "AwsSolutions-CFR2",
        reason: "WAF is deferred to a dedicated hardening phase.",
      },
      {
        id: "AwsSolutions-CFR3",
        reason: "CloudFront access logs are deferred to centralized observability phase.",
      },
      {
        id: "AwsSolutions-CFR4",
        reason: "Default CloudFront certificate is allowed until custom domain rollout.",
      },
    ]);

    NagSuppressions.addResourceSuppressions(apiHandler, [
      {
        id: "AwsSolutions-L1",
        reason: "Runtime version follows repository baseline and is upgraded with dependency cycle.",
      },
    ]);
    NagSuppressions.addResourceSuppressions(
      [opsReadonlyRole, auditReadonlyRole, breakglassRole],
      [
        {
          id: "AwsSolutions-IAM4",
          reason: "AWS managed policies are used for readonly and emergency roles.",
        },
        {
          id: "AwsSolutions-IAM5",
          reason: "Wildcard permissions are limited by permission boundary and planned hardening.",
        },
      ],
      true,
    );
    NagSuppressions.addResourceSuppressions(githubActionsDeployRole, [
      {
        id: "AwsSolutions-IAM5",
        reason: "Deploy role requires wildcard resources for CDK bootstrap lifecycle operations.",
      },
    ], true);
    if (configRole) {
      NagSuppressions.addResourceSuppressions(configRole, [
        {
          id: "AwsSolutions-IAM4",
          reason: "AWS Config recorder requires managed service-role policy.",
        },
      ]);
    }

    NagSuppressions.addResourceSuppressions(vpc, [
      {
        id: "AwsSolutions-VPC7",
        reason: "VPC flow logs are deferred to centralized organization-level logging stack.",
      },
    ]);

    NagSuppressions.addResourceSuppressions(publicSg, [
      {
        id: "AwsSolutions-EC23",
        reason: "Public HTTPS ingress is required for edge-facing delivery boundary.",
      },
    ]);

    NagSuppressions.addResourceSuppressions(userPool, [
      {
        id: "AwsSolutions-COG2",
        reason: "MFA rollout is staged to align with account lifecycle and user migration readiness.",
      },
      {
        id: "AwsSolutions-COG3",
        reason: "Advanced security mode enablement is deferred until managed user onboarding is complete.",
      },
      {
        id: "AwsSolutions-COG4",
        reason: "Advanced security mode hardening is tracked for next security milestone.",
      },
    ]);

    if (httpApi.defaultStage && deploymentStage !== "prod") {
      NagSuppressions.addResourceSuppressions(httpApi.defaultStage.node.defaultChild as Construct, [
        {
          id: "AwsSolutions-APIG1",
          reason: "API access logging is deferred pending centralized log aggregation design.",
        },
      ]);
    }

    NagSuppressions.addStackSuppressions(
      this,
      [
        {
          id: "AwsSolutions-IAM4",
          reason: "CDK custom resource roles use framework managed policies.",
        },
        {
          id: "AwsSolutions-IAM5",
          reason: "CDK custom resources require scoped wildcard actions/resources.",
        },
        {
          id: "AwsSolutions-L1",
          reason: "Framework custom resources may use managed Lambda runtime.",
        },
      ],
      true,
    );

    this.addNameTag(this);
  }

  private addNameTag(scope: Construct): void {
    for (const child of scope.node.children) {
      if (cdk.Resource.isResource(child)) {
        const tagValue = child.node.path.replace(/\//g, "-").replace(/_/g, "-");
        cdk.Tags.of(child).add("Name", tagValue);
      }

      this.addNameTag(child);
    }
  }
}
