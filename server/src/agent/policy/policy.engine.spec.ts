import { AgentPolicyEngine } from './policy.engine';

describe('AgentPolicyEngine', () => {
  const engine = new AgentPolicyEngine();

  it('denies a tool when the requested customer belongs to another salon', async () => {
    const decision = await engine.evaluate({
      toolName: 'get_customer',
      context: { salonId: 'salon-a', userId: 'user-a', role: 'OWNER', mode: 'COPILOT', correlationId: 'corr-1', agentRunId: 'run-1' },
      resource: { salonId: 'salon-b' },
    });

    expect(decision.state).toBe('FORBIDDEN');
    expect(decision.code).toBe('TENANT_ACCESS_DENIED');
  });

  it('requires approval for booking in Copilot mode', async () => {
    const decision = await engine.evaluate({
      toolName: 'create_booking',
      context: { salonId: 'salon-a', userId: 'user-a', role: 'OWNER', mode: 'COPILOT', correlationId: 'corr-2', agentRunId: 'run-2' },
      resource: { salonId: 'salon-a' },
    });

    expect(decision.state).toBe('APPROVAL_REQUIRED');
    expect(decision.code).toBe('APPROVAL_REQUIRED');
  });

  it('allows read-only customer lookup when tenant context matches', async () => {
    const decision = await engine.evaluate({
      toolName: 'get_customer',
      context: { salonId: 'salon-a', userId: 'user-a', role: 'OWNER', mode: 'AUTOPILOT', correlationId: 'corr-3', agentRunId: 'run-3' },
      resource: { salonId: 'salon-a' },
    });

    expect(decision.state).toBe('READ_ONLY');
    expect(decision.allowed).toBe(true);
  });
});
