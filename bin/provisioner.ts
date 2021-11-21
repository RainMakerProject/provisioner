#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { CommonStack } from "../lib/common-stack";
import { TickerCollectorStack } from "../lib/ticker-collector-stack";
import { ChartTableStack } from "../lib/chart-table-stack";

const app = new cdk.App();

const common = new CommonStack(app, "RainMakerCommon");
new ChartTableStack(app, "ChartTable", {});
new TickerCollectorStack(app, "TickerCollector", { ecsCluster: common.ecsCluster });
