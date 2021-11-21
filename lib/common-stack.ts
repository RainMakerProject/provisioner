import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";

export class CommonStack extends cdk.Stack {
  public vpc: ec2.Vpc;
  public ecsCluster: ecs.Cluster;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, "Vpc", {
      maxAzs: 2,
      cidr: "10.0.0.0/16",
      subnetConfiguration: [
        {
          name: "Public",
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 18,
        },
      ],
    });
    this.ecsCluster = new ecs.Cluster(this, "Cluster", {
      vpc: this.vpc,
      containerInsights: true,
    });
  }
}
