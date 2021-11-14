#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { TickerQueueStack } from "../lib/ticker-queue-stack";
import { CommonStack } from "../lib/common-stack";
import { TickerCollectorStack } from "../lib/ticker-collector-stack";

const app = new cdk.App();
const common = new CommonStack(app, "RainMakerCommonStack");
new TickerQueueStack(app, "TickerQueueStack");
new TickerCollectorStack(app, "TickerCollectorStack", { ecsCluster: common.ecsCluster });
