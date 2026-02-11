import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
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
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      code: cloudfront.FunctionCode.fromFile({
        filePath: path.join(__dirname, "../functions/pretty-url-rewrite.js"),
      }),
    });

    const distribution = new cloudfront.Distribution(this, "Distro", {
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
      value: distribution.domainName,
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
