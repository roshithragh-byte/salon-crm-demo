export type AgentToolDefinition = {
  name: string;
  description: string;
  permission: 'READ_ONLY' | 'APPROVAL_REQUIRED' | 'AUTOPILOT_SAFE' | 'SYSTEM_ONLY';
  approvalRequiredInCopilot: boolean;
  systemOnly: boolean;
  idempotent: boolean;
  inputSchema: Record<string, unknown>;
};

const objectSchema = (properties: Record<string, unknown>, required: string[] = []) => ({
  type: 'object',
  properties,
  required,
  additionalProperties: false,
});

const id = { type: 'string', minLength: 1 };
const optionalString = { type: 'string' };
const optionalInteger = { type: 'integer', minimum: 1, maximum: 100 };

export const AGENT_TOOL_DEFINITIONS: AgentToolDefinition[] = [
  { name: 'get_customer', description: 'Read one customer in the authenticated salon.', permission: 'READ_ONLY', approvalRequiredInCopilot: false, systemOnly: false, idempotent: true, inputSchema: objectSchema({ customerId: id }, ['customerId']) },
  { name: 'search_customers', description: 'Search bounded customer records in the authenticated salon.', permission: 'READ_ONLY', approvalRequiredInCopilot: false, systemOnly: false, idempotent: true, inputSchema: objectSchema({ query: optionalString, segment: optionalString, inactiveDays: { type: 'integer', minimum: 0, maximum: 3650 }, limit: optionalInteger, cursor: optionalString }) },
  { name: 'get_customer_history', description: 'Read bounded history for a customer in the authenticated salon.', permission: 'READ_ONLY', approvalRequiredInCopilot: false, systemOnly: false, idempotent: true, inputSchema: objectSchema({ customerId: id, limit: optionalInteger, cursor: optionalString }, ['customerId']) },
  { name: 'get_appointments', description: 'Read appointments in a bounded date range.', permission: 'READ_ONLY', approvalRequiredInCopilot: false, systemOnly: false, idempotent: true, inputSchema: objectSchema({ from: id, to: id, staffId: optionalString, status: optionalString, limit: optionalInteger, cursor: optionalString }, ['from', 'to']) },
  { name: 'get_available_slots', description: 'Read live availability from the CRM.', permission: 'READ_ONLY', approvalRequiredInCopilot: false, systemOnly: false, idempotent: true, inputSchema: objectSchema({ serviceId: id, date: id, staffId: optionalString }, ['serviceId', 'date']) },
  { name: 'get_services', description: 'Read service metadata for the authenticated salon.', permission: 'READ_ONLY', approvalRequiredInCopilot: false, systemOnly: false, idempotent: true, inputSchema: objectSchema({ category: optionalString, activeOnly: { type: 'boolean' }, limit: optionalInteger }) },
  { name: 'get_staff', description: 'Read staff metadata for the authenticated salon.', permission: 'READ_ONLY', approvalRequiredInCopilot: false, systemOnly: false, idempotent: true, inputSchema: objectSchema({ staffId: optionalString, activeOnly: { type: 'boolean' }, limit: optionalInteger }) },
  { name: 'get_reviews', description: 'Read bounded review data for the authenticated salon.', permission: 'READ_ONLY', approvalRequiredInCopilot: false, systemOnly: false, idempotent: true, inputSchema: objectSchema({ rating: { type: 'integer', minimum: 1, maximum: 5 }, status: optionalString, limit: optionalInteger, cursor: optionalString }) },
  { name: 'create_booking', description: 'Create a booking after policy and availability checks.', permission: 'APPROVAL_REQUIRED', approvalRequiredInCopilot: true, systemOnly: false, idempotent: true, inputSchema: objectSchema({ customerId: id, serviceId: id, staffId: optionalString, startTime: id, idempotencyKey: id }, ['customerId', 'serviceId', 'startTime', 'idempotencyKey']) },
  { name: 'cancel_booking', description: 'Cancel a booking after policy checks.', permission: 'APPROVAL_REQUIRED', approvalRequiredInCopilot: true, systemOnly: false, idempotent: true, inputSchema: objectSchema({ bookingId: id, reason: id }, ['bookingId', 'reason']) },
  { name: 'prepare_customer_message', description: 'Prepare a bounded customer message draft.', permission: 'READ_ONLY', approvalRequiredInCopilot: false, systemOnly: false, idempotent: true, inputSchema: objectSchema({ customerId: id, purpose: id, context: { type: 'object', additionalProperties: false } }, ['customerId', 'purpose', 'context']) },
  { name: 'send_customer_message', description: 'Send an existing approved customer message.', permission: 'APPROVAL_REQUIRED', approvalRequiredInCopilot: true, systemOnly: false, idempotent: true, inputSchema: objectSchema({ messageId: id }, ['messageId']) },
  { name: 'record_agent_decision', description: 'Server-generated audit record for an Agent run.', permission: 'SYSTEM_ONLY', approvalRequiredInCopilot: false, systemOnly: true, idempotent: true, inputSchema: objectSchema({}) },
];
