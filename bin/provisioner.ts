#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { TickerQueueStack } from '../lib/ticker-queue-stack';

const app = new cdk.App();
new TickerQueueStack(app, 'TickerQueueStack');
