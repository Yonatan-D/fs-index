import { Logger } from "../src/lib/core/logger.js";
import { test } from 'node:test';
import assert from 'node:assert';

test('Logger', () => {
  const logger = new Logger();
  logger.log('this is message');
  assert.ok(logger instanceof Logger);
});

test.run();
