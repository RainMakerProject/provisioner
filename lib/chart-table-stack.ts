import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export class ChartTableStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    new dynamodb.Table(this, "ChartTable", {
      partitionKey: {
        name: "chart_type",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "period_from",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });
  }
}
