import * as path from "path";
import { App, Aspects } from "aws-cdk-lib";
import { Annotations, Match, Template } from "aws-cdk-lib/assertions";
import { AwsSolutionsChecks } from "cdk-nag";
import { QuartzSiteStack } from "../lib/quartz-site-stack";

const fixtureSitePath = path.join(__dirname, "fixtures/site");

const REQUIRED_TAG_KEYS = [
  "CostCenter",
  "Environment",
  "Owner",
  "Project",
  "ManagedBy",
] as const;

const ALLOWED_ENVIRONMENTS = [
  "Production",
  "Staging",
  "Development",
  "Test",
] as const;

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

function assertGovernanceTagsOnAllResources(
  template: Template,
  resourceType: string,
) {
  const resources = template.findResources(resourceType) as Record<string, unknown>;
  const entries = Object.entries(resources);

  expect(entries.length).toBeGreaterThan(0);

  for (const [logicalId, resource] of entries) {
    const tags =
      (
        resource as {
          Properties?: {
            Tags?: Array<{ Key: string; Value: string }>;
          };
        }
      ).Properties?.Tags ?? [];

    const tagMap = new Map(tags.map((tag) => [tag.Key, tag.Value]));

    for (const key of REQUIRED_TAG_KEYS) {
      expect(tagMap.has(key)).toBe(true);
    }

    expect(tagMap.get("ManagedBy")).toBe("CDK");
    expect(ALLOWED_ENVIRONMENTS).toContain(tagMap.get("Environment"));

    expect(tagMap.size).toBeGreaterThanOrEqual(REQUIRED_TAG_KEYS.length);
    expect(tagMap.has("Environment")).toBe(true);
    expect(tagMap.has("ManagedBy")).toBe(true);

    if (!tagMap.has("Environment") || !tagMap.has("ManagedBy")) {
      throw new Error(`Missing governance tags on resource ${logicalId}`);
    }
  }
}

function assertTagExistsOnAllResources(
  template: Template,
  resourceType: string,
  tagKey: string,
) {
  const resources = template.findResources(resourceType) as Record<string, unknown>;
  const entries = Object.entries(resources);

  expect(entries.length).toBeGreaterThan(0);

  for (const [logicalId, resource] of entries) {
    const tags =
      (
        resource as {
          Properties?: {
            Tags?: Array<{ Key: string; Value: string }>;
          };
        }
      ).Properties?.Tags ?? [];

    const targetTag = tags.find((tag) => tag.Key === tagKey);
    expect(targetTag).toBeDefined();
    expect(targetTag?.Value).toMatch(/^[A-Za-z0-9:-]+$/);

    if (!targetTag) {
      throw new Error(`Missing ${tagKey} tag on resource ${logicalId}`);
    }
  }
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
      "Custom::AWSCDKOpenIdConnectProvider",
      "Custom::CDKBucketDeployment",
    ].sort();

    expect(actual).toEqual(expected);
  });

  test("matches CloudFormation snapshot", () => {
    const { template } = buildStack();
    expect(template.toJSON()).toMatchSnapshot();
  });

  test("applies required governance tags to all S3 buckets", () => {
    const { template } = buildStack();
    assertGovernanceTagsOnAllResources(template, "AWS::S3::Bucket");
  });

  test("applies required governance tags to all CloudFront distributions", () => {
    const { template } = buildStack();
    assertGovernanceTagsOnAllResources(template, "AWS::CloudFront::Distribution");
  });

  test("applies Name tag to all S3 buckets", () => {
    const { template } = buildStack();
    assertTagExistsOnAllResources(template, "AWS::S3::Bucket", "Name");
  });

  test("applies Name tag to all CloudFront distributions", () => {
    const { template } = buildStack();
    assertTagExistsOnAllResources(template, "AWS::CloudFront::Distribution", "Name");
  });
});
