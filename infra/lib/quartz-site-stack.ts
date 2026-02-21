import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as path from "path";
import { NagSuppressions } from "cdk-nag";

export class QuartzSiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const allowedEnvironments = [
      "Production",
      "Staging",
      "Development",
      "Test",
    ] as const;

    const environmentTag =
      (this.node.tryGetContext("tagEnvironment") as string | undefined) ??
      "Development";

    const governanceTags = {
      CostCenter:
        (this.node.tryGetContext("tagCostCenter") as string | undefined) ??
        "CC0000",
      Description:
        (this.node.tryGetContext("tagDescription") as string | undefined) ??
        "diopside-docs-delivery-stack",
      Environment: environmentTag,
      Owner:
        (this.node.tryGetContext("tagOwner") as string | undefined) ??
        "platform-team",
      Project:
        (this.node.tryGetContext("tagProject") as string | undefined) ??
        "diopside",
      ManagedBy: "CDK",
    } as const;

    if (!(allowedEnvironments as readonly string[]).includes(environmentTag)) {
      throw new Error(
        `Invalid tagEnvironment '${environmentTag}'. Allowed values: ${allowedEnvironments.join(", ")}`,
      );
    }

    for (const [key, value] of Object.entries(governanceTags)) {
      cdk.Tags.of(this).add(key, value);
    }

    const keyPrefix = "obsidian";
    const originPath = `/${keyPrefix}`;
    const siteAssetPath =
      (this.node.tryGetContext("siteAssetPath") as string | undefined) ??
      path.join(__dirname, "../../quartz/public");
    const githubOwner =
      (this.node.tryGetContext("githubOwner") as string | undefined) ??
      "tsuji-tomonori";
    const githubRepo =
      (this.node.tryGetContext("githubRepo") as string | undefined) ??
      "diopside-v3";
    const githubEnvironment =
      (this.node.tryGetContext("githubEnvironment") as string | undefined) ??
      "prod";
    const githubSub = `repo:${githubOwner}/${githubRepo}:environment:${githubEnvironment}`;

    const githubOidcProvider = new iam.OpenIdConnectProvider(
      this,
      "GithubOidcProvider",
      {
        url: "https://token.actions.githubusercontent.com",
        clientIds: ["sts.amazonaws.com"],
      },
    );

    const githubActionsDeployRole = new iam.Role(this, "GithubActionsDeployRole", {
      description: "Assumed by GitHub Actions (OIDC) to run docs deploy via CDK",
      maxSessionDuration: cdk.Duration.hours(1),
      assumedBy: new iam.OpenIdConnectPrincipal(githubOidcProvider).withConditions(
        {
          StringEquals: {
            "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
            "token.actions.githubusercontent.com:sub": githubSub,
          },
        },
      ),
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
              ],
              resources: ["*"],
            }),
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
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

    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    });

    const origin = origins.S3BucketOrigin.withOriginAccessControl(siteBucket, {
      originPath,
    });

    const rewriteFn = new cloudfront.Function(this, "PrettyUrlRewriteFn", {
      comment: "Rewrite extensionless docs paths to static HTML",
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      code: cloudfront.FunctionCode.fromFile({
        filePath: path.join(__dirname, "../functions/pretty-url-rewrite.js"),
      }),
    });

    const distribution = new cloudfront.Distribution(this, "Distro", {
      comment: "CloudFront distribution for diopside docs delivery",
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        functionAssociations: [
          {
            function: rewriteFn,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
      },
    });

    new s3deploy.BucketDeployment(this, "DeployQuartzPublic", {
      sources: [s3deploy.Source.asset(siteAssetPath)],
      destinationBucket: siteBucket,
      destinationKeyPrefix: keyPrefix,
      memoryLimit: 1024,
      distribution,
      distributionPaths: ["/*"],
    });

    new cdk.CfnOutput(this, "CloudFrontDomainName", {
      description: "CloudFront domain name for public docs endpoint",
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

    NagSuppressions.addResourceSuppressions(siteBucket, [
      {
        id: "AwsSolutions-S1",
        reason: "Docs distribution uses CloudFront caching; S3 access logging is not enabled to minimize ops cost.",
      },
    ]);

    NagSuppressions.addResourceSuppressions(distribution, [
      {
        id: "AwsSolutions-CFR1",
        reason: "Geo restriction is intentionally not configured for globally accessible public docs.",
      },
      {
        id: "AwsSolutions-CFR2",
        reason: "WAF is deferred for Phase 1 docs-only distribution; monitored at CloudFront and origin levels.",
      },
      {
        id: "AwsSolutions-CFR3",
        reason: "CloudFront access logs are deferred in Phase 1 to keep delivery pipeline lightweight.",
      },
      {
        id: "AwsSolutions-CFR4",
        reason: "Default CloudFront certificate is acceptable for initial docs-only rollout.",
      },
    ]);

    NagSuppressions.addStackSuppressions(this, [
      {
        id: "AwsSolutions-IAM4",
        reason: "CDK BucketDeployment custom resource role uses AWS managed policy by framework design.",
      },
      {
        id: "AwsSolutions-IAM5",
        reason: "CDK BucketDeployment requires scoped wildcard actions/resources for sync and invalidation.",
      },
      {
        id: "AwsSolutions-L1",
        reason: "CDK BucketDeployment uses framework-managed provider Lambda runtime outside direct stack control.",
      },
      {
        id: "AwsSolutions-IAM5",
        reason: "GitHub deploy role policy starts broad for bootstrap and will be narrowed with CloudTrail evidence in follow-up hardening.",
      },
    ], true);

    NagSuppressions.addResourceSuppressions(githubActionsDeployRole, [
      {
        id: "AwsSolutions-IAM5",
        reason: "Docs deploy role currently requires wildcard resources to run CDK stack operations and bootstrap role assumption.",
      },
    ], true);

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
