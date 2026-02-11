import * as path from "path";
import { App, Aspects } from "aws-cdk-lib";
import { Annotations, Match, Template } from "aws-cdk-lib/assertions";
import { AwsSolutionsChecks } from "cdk-nag";
import { QuartzSiteStack } from "../lib/quartz-site-stack";

const fixtureSitePath = path.join(__dirname, "fixtures/site");

function buildStack() {
  const app = new App({
    context: {
      siteAssetPath: fixtureSitePath,
    },
  });

  Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
  const stack = new QuartzSiteStack(app, "QuartzSiteStackTest");
  const template = Template.fromStack(stack);

  return { stack, template };
}

describe("QuartzSiteStack", () => {
  test("passes cdk-nag with configured suppressions", () => {
    const { stack } = buildStack();

    const nagErrors = Annotations.fromStack(stack).findError(
      "*",
      Match.stringLikeRegexp("AwsSolutions-.*"),
    );
    const nagWarnings = Annotations.fromStack(stack).findWarning(
      "*",
      Match.stringLikeRegexp("AwsSolutions-.*"),
    );

    expect(nagErrors).toHaveLength(0);
    expect(nagWarnings).toHaveLength(0);
  });

  test("creates intended resources with key properties", () => {
    const { template } = buildStack();

    template.resourceCountIs("AWS::S3::Bucket", 1);
    template.resourceCountIs("AWS::CloudFront::Distribution", 1);
    template.resourceCountIs("AWS::CloudFront::OriginAccessControl", 1);
    template.resourceCountIs("AWS::CloudFront::Function", 1);
    template.resourceCountIs("Custom::CDKBucketDeployment", 1);

    template.hasResourceProperties("AWS::S3::Bucket", {
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [
          {
            ServerSideEncryptionByDefault: {
              SSEAlgorithm: "AES256",
            },
          },
        ],
      },
    });

    template.hasResourceProperties("AWS::CloudFront::Distribution", {
      DistributionConfig: {
        DefaultRootObject: "index.html",
        DefaultCacheBehavior: {
          ViewerProtocolPolicy: "redirect-to-https",
        },
        Origins: Match.arrayWith([
          Match.objectLike({
            OriginPath: "/obsidian",
          }),
        ]),
      },
    });

    template.hasResourceProperties("Custom::CDKBucketDeployment", {
      DestinationBucketKeyPrefix: "obsidian",
      DistributionPaths: ["/*"],
      WaitForDistributionInvalidation: true,
    });

    template.hasResourceProperties("AWS::CloudFront::Function", {
      FunctionCode: Match.stringLikeRegexp("/docs/"),
    });
  });

  test("does not create unintended resource types", () => {
    const { template } = buildStack();
    const json = template.toJSON();
    const resourceTypes = Object.values(json.Resources).map((resource) =>
      (resource as { Type: string }).Type,
    );

    const actual = [...new Set(resourceTypes)].sort();
    const expected = [
      "AWS::CloudFront::Distribution",
      "AWS::CloudFront::Function",
      "AWS::CloudFront::OriginAccessControl",
      "AWS::IAM::Policy",
      "AWS::IAM::Role",
      "AWS::Lambda::Function",
      "AWS::Lambda::LayerVersion",
      "AWS::S3::Bucket",
      "AWS::S3::BucketPolicy",
      "Custom::CDKBucketDeployment",
    ].sort();

    expect(actual).toEqual(expected);
  });

  test("matches CloudFormation snapshot", () => {
    const { template } = buildStack();
    expect(template.toJSON()).toMatchSnapshot();
  });
});
