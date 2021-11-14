import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecr from "@aws-cdk/aws-ecr";

export interface TickerCollectorStackProps extends cdk.StackProps {
  ecsCluster: ecs.ICluster;
}

export class TickerCollectorStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: TickerCollectorStackProps) {
    super(scope, id, props);

    const repository = new ecr.Repository(this, "Repository", {});

    const taskDefinition = new ecs.FargateTaskDefinition(this, "TaskDefinition", {
      cpu: 256,
      memoryLimitMiB: 512,
    });

    taskDefinition.taskRole.attachInlinePolicy(
      new iam.Policy(this, "TaskRolePolicy", {
        statements: [
          new iam.PolicyStatement({
            actions: ["sqs:SendMessage"],
            effect: iam.Effect.ALLOW,
            resources: ["*"],
          }),
        ],
      })
    );

    taskDefinition.addContainer("Container", {
      image: ecs.ContainerImage.fromEcrRepository(repository, "latest"),
      logging: new ecs.AwsLogDriver({
        streamPrefix: "ticker-collector",
      }),
    });

    new ecs.FargateService(this, "Service", {
      cluster: props.ecsCluster,
      taskDefinition,
      desiredCount: 1,
    });
  }
}