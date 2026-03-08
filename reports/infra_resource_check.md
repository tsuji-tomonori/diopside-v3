# Infra Resource Inventory Check

- generated_at: 2026-03-08T05:08:09+00:00
- inventory_doc: docs/2.基本設計(BD)/04.インフラ(INF)/31.コンピュートと配備(CMP_DEP)/BD-INF-DEP-005.md
- synthesized_template: infra/.build/docs-infra-check/run-20674/cdk.out/DiopsideDeliveryStack.template.json
- synth_command: npm run synth -- --output .build/docs-infra-check/run-20674/cdk.out --context siteAssetPath=/home/t-tsuji/project/diopside-v3/infra/test/fixtures/site --context webAssetPath=/home/t-tsuji/project/diopside-v3/infra/test/fixtures/web --context deploymentStage=prod --context tagEnvironment=Production DiopsideDeliveryStack

## Synth Notes
```text
[Warning at /DiopsideDeliveryStack/PublicNetworkAcl] AwsSolutions-VPC3: A Network ACL or Network ACL entry has been implemented. Network ACLs should be used sparingly for the following reasons: they can be complex to manage, they are stateless, every IP address must be explicitly opened in each (inbound/outbound) direction, and they affect a complete subnet. Use security groups when possible as they are stateful and easier to manage.

[Warning at /DiopsideDeliveryStack/PrivateNetworkAcl] AwsSolutions-VPC3: A Network ACL or Network ACL entry has been implemented. Network ACLs should be used sparingly for the following reasons: they can be complex to manage, they are stateless, every IP address must be explicitly opened in each (inbound/outbound) direction, and they affect a complete subnet. Use security groups when possible as they are stateful and easier to manage.

[Warning at /DiopsideDeliveryStack/PublicNaclDenyIngress] AwsSolutions-VPC3: A Network ACL or Network ACL entry has been implemented. Network ACLs should be used sparingly for the following reasons: they can be complex to manage, they are stateless, every IP address must be explicitly opened in each (inbound/outbound) direction, and they affect a complete subnet. Use security groups when possible as they are stateful and easier to manage.

[Warning at /DiopsideDeliveryStack/PublicNaclDenyEgress] AwsSolutions-VPC3: A Network ACL or Network ACL entry has been implemented. Network ACLs should be used sparingly for the following reasons: they can be complex to manage, they are stateless, every IP address must be explicitly opened in each (inbound/outbound) direction, and they affect a complete subnet. Use security groups when possible as they are stateful and easier to manage.

[Warning at /DiopsideDeliveryStack/PrivateNaclDenyIngress] AwsSolutions-VPC3: A Network ACL or Network ACL entry has been implemented. Network ACLs should be used sparingly for the following reasons: they can be complex to manage, they are stateless, every IP address must be explicitly opened in each (inbound/outbound) direction, and they affect a complete subnet. Use security groups when possible as they are stateful and easier to manage.

[Warning at /DiopsideDeliveryStack/PrivateNaclDenyEgress] AwsSolutions-VPC3: A Network ACL or Network ACL entry has been implemented. Network ACLs should be used sparingly for the following reasons: they can be complex to manage, they are stateless, every IP address must be explicitly opened in each (inbound/outbound) direction, and they affect a complete subnet. Use security groups when possible as they are stateful and easier to manage.

75 feature flags are not configured. Run 'cdk flags --unstable=flags' to learn more.
```
- inventory_service_count: 11
- compared_selector_count: 28

## Comparison
| service | selector | expected | actual | status |
|---|---|---:|---:|---|
| Amazon VPC | `AWS::EC2::VPC` | 1 | 1 | PASS |
| Amazon VPC | `AWS::EC2::Subnet` | 3 | 3 | PASS |
| Amazon VPC | `AWS::EC2::InternetGateway` | 1 | 1 | PASS |
| Amazon VPC | `AWS::EC2::RouteTable` | 3 | 3 | PASS |
| Amazon VPC | `AWS::EC2::NetworkAcl` | 2 | 2 | PASS |
| Amazon VPC | `AWS::EC2::VPCEndpoint` | 1 | 1 | PASS |
| Amazon VPC | `AWS::EC2::SecurityGroup` | 3 | 3 | PASS |
| Amazon CloudFront | `AWS::CloudFront::Distribution` | 1 | 1 | PASS |
| Amazon CloudFront | `AWS::CloudFront::Function` | 3 | 3 | PASS |
| Amazon CloudFront | `AWS::CloudFront::OriginAccessControl` | 1 | 1 | PASS |
| Amazon CloudFront | `AWS::CloudFront::ResponseHeadersPolicy` | 1 | 1 | PASS |
| Amazon S3 | `AWS::S3::Bucket` | 3 | 3 | PASS |
| Amazon API Gateway | `AWS::ApiGatewayV2::Api` | 1 | 1 | PASS |
| Amazon API Gateway | `AWS::ApiGatewayV2::Route` | 3 | 3 | PASS |
| Amazon API Gateway | `AWS::ApiGatewayV2::Integration` | 1 | 1 | PASS |
| Amazon API Gateway | `AWS::ApiGatewayV2::Authorizer` | 1 | 1 | PASS |
| Amazon API Gateway | `AWS::ApiGatewayV2::Stage` | 1 | 1 | PASS |
| AWS Lambda | `AWS::Lambda::Function` | 1 | 1 | PASS |
| Amazon CloudWatch Logs | `AWS::Logs::LogGroup` | 2 | 2 | PASS |
| Amazon CloudWatch | `AWS::CloudWatch::Alarm` | 3 | 3 | PASS |
| AWS IAM | `AWS::IAM::Role` | 6 | 6 | PASS |
| AWS IAM | `Custom::AWSCDKOpenIdConnectProvider` | 1 | 1 | PASS |
| AWS Config | `AWS::Config::ConfigurationRecorder` | 1 | 1 | PASS |
| AWS Config | `AWS::Config::DeliveryChannel` | 1 | 1 | PASS |
| AWS Config | `AWS::Config::ConfigRule` | 1 | 1 | PASS |
| Amazon Cognito | `AWS::Cognito::UserPool` | 1 | 1 | PASS |
| Amazon Cognito | `AWS::Cognito::UserPoolClient` | 1 | 1 | PASS |
| AWS WAF | `AWS::WAFv2::*` | 0 | 0 | PASS |

## Mismatches
- none

## Unmatched Synth Resources
- none

## Result
- PASS
