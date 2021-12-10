import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecr from "@aws-cdk/aws-ecr";

export interface TraderStackProps extends cdk.StackProps {
  ecsCluster: ecs.ICluster;
}

export class TraderStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: TraderStackProps) {
    super(scope, id, props);

    const repository = new ecr.Repository(this, "Repository", {});

    const taskExecutionRole = new iam.Role(this, "TaskExecutionRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AmazonECSTaskExecutionRolePolicy")],
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, "TaskDefinition", {
      cpu: 256,
      memoryLimitMiB: 512,
      executionRole: taskExecutionRole,
    });

    taskExecutionRole.attachInlinePolicy(
      new iam.Policy(this, "TaskExecutionRolePolicy", {
        statements: [
          new iam.PolicyStatement({
            actions: ["s3:GetObject", "s3:GetBucketLocation"],
            effect: iam.Effect.ALLOW,
            resources: ["*"],
          }),
        ],
      })
    );

    taskDefinition.taskRole.attachInlinePolicy(
      new iam.Policy(this, "TaskRolePolicy", {
        statements: [
          new iam.PolicyStatement({
            actions: [
              "dynamodb:DescribeTable",
              "dynamodb:Scan",
              "dynamodb:GetItem",
              "dynamodb:Query",
              "dynamodb:BatchGetItem",
              "dynamodb:ConditionCheckItem",
            ],
            effect: iam.Effect.ALLOW,
            resources: ["*"],
          }),
        ],
      })
    );

    taskDefinition.addContainer("Container", {
      image: ecs.ContainerImage.fromEcrRepository(repository, "latest"),
      logging: new ecs.AwsLogDriver({
        streamPrefix: "trader",
      }),
    });

    new ecs.FargateService(this, "Service", {
      cluster: props.ecsCluster,
      taskDefinition,
      desiredCount: 1,
    });
  }
}
