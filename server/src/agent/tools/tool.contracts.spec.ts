import { AGENT_TOOL_DEFINITIONS } from './tool.contracts';

describe('Agent tool contracts', () => {
  it('exposes exactly the 13 approved tools', () => {
    expect(AGENT_TOOL_DEFINITIONS).toHaveLength(13);
    expect(AGENT_TOOL_DEFINITIONS.map((tool) => tool.name)).toEqual([
      'get_customer',
      'search_customers',
      'get_customer_history',
      'get_appointments',
      'get_available_slots',
      'get_services',
      'get_staff',
      'get_reviews',
      'create_booking',
      'cancel_booking',
      'prepare_customer_message',
      'send_customer_message',
      'record_agent_decision',
    ]);
  });

  it('does not expose arbitrary execution capabilities', () => {
    const names = AGENT_TOOL_DEFINITIONS.map((tool) => tool.name);
    expect(names).not.toContain('execute_sql');
    expect(names).not.toContain('execute_prisma');
    expect(names).not.toContain('execute_http');
    expect(names).not.toContain('delete_customer');
  });

  it('marks booking and communication mutations as approval-gated in Copilot', () => {
    const gated = AGENT_TOOL_DEFINITIONS.filter((tool) =>
      ['create_booking', 'cancel_booking', 'send_customer_message'].includes(tool.name),
    );
    expect(gated.every((tool) => tool.approvalRequiredInCopilot)).toBe(true);
  });

  it('requires record_agent_decision to be system-generated', () => {
    const audit = AGENT_TOOL_DEFINITIONS.find((tool) => tool.name === 'record_agent_decision');
    expect(audit?.systemOnly).toBe(true);
  });
});
