import { AgentToolRegistry } from './tool.registry';

describe('AgentToolRegistry', () => {
  it('returns the canonical tool set without allowing unknown tools', () => {
    const registry = new AgentToolRegistry();
    expect(registry.list()).toHaveLength(13);
    expect(registry.get('get_customer').name).toBe('get_customer');
    expect(() => registry.get('execute_sql')).toThrow('Unknown agent tool');
  });

  it('returns a defensive list so callers cannot mutate the registry', () => {
    const registry = new AgentToolRegistry();
    const tools = registry.list();
    tools.pop();
    expect(registry.list()).toHaveLength(13);
  });
});
