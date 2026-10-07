import { Module } from '@nestjs/common';
import { AgentPolicyEngine } from './policy/policy.engine';
import { AgentToolRegistry } from './tools/tool.registry';

@Module({
  providers: [AgentPolicyEngine, AgentToolRegistry],
  exports: [AgentPolicyEngine, AgentToolRegistry],
})
export class AgentModule {}
