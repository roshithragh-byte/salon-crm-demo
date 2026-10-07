-- CreateEnum
CREATE TYPE "AgentMode" AS ENUM ('COPILOT', 'AUTOPILOT');

-- CreateEnum
CREATE TYPE "AgentRunStatus" AS ENUM ('RUNNING', 'WAITING_APPROVAL', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AgentPermissionState" AS ENUM ('READ_ONLY', 'APPROVAL_REQUIRED', 'AUTOPILOT_SAFE', 'FORBIDDEN', 'SYSTEM_ONLY');

-- CreateEnum
CREATE TYPE "AgentToolStatus" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'EXECUTING', 'SUCCEEDED', 'FAILED');

-- CreateEnum
CREATE TYPE "AgentApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AgentIdempotencyStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "agent_runs" (
  "id" TEXT NOT NULL,
  "salonId" TEXT NOT NULL,
  "userId" TEXT,
  "mode" "AgentMode" NOT NULL,
  "status" "AgentRunStatus" NOT NULL,
  "intent" TEXT NOT NULL,
  "modelProvider" TEXT NOT NULL,
  "modelName" TEXT NOT NULL,
  "correlationId" TEXT NOT NULL,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  "tokenInput" INTEGER,
  "tokenOutput" INTEGER,
  "finalOutcome" TEXT,
  "errorCode" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "agent_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_tool_events" (
  "id" TEXT NOT NULL,
  "agentRunId" TEXT NOT NULL,
  "salonId" TEXT NOT NULL,
  "toolName" TEXT NOT NULL,
  "sequence" INTEGER NOT NULL,
  "request" JSONB NOT NULL,
  "policyState" "AgentPermissionState" NOT NULL,
  "policyReason" TEXT,
  "status" "AgentToolStatus" NOT NULL,
  "resultMetadata" JSONB,
  "errorCode" TEXT,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "agent_tool_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_approvals" (
  "id" TEXT NOT NULL,
  "agentRunId" TEXT NOT NULL,
  "agentToolEventId" TEXT NOT NULL,
  "salonId" TEXT NOT NULL,
  "requestedByUserId" TEXT,
  "reviewedByUserId" TEXT,
  "action" TEXT NOT NULL,
  "status" "AgentApprovalStatus" NOT NULL,
  "reason" TEXT,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" TIMESTAMP(3),
  CONSTRAINT "agent_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_idempotency_keys" (
  "id" TEXT NOT NULL,
  "salonId" TEXT NOT NULL,
  "scope" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "requestHash" TEXT NOT NULL,
  "resultReference" TEXT,
  "status" "AgentIdempotencyStatus" NOT NULL,
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "agent_idempotency_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agent_runs_correlationId_key" ON "agent_runs"("correlationId");
CREATE INDEX "agent_runs_salonId_createdAt_idx" ON "agent_runs"("salonId", "createdAt");
CREATE INDEX "agent_runs_salonId_status_idx" ON "agent_runs"("salonId", "status");

CREATE UNIQUE INDEX "agent_tool_events_agentRunId_sequence_key" ON "agent_tool_events"("agentRunId", "sequence");
CREATE INDEX "agent_tool_events_salonId_createdAt_idx" ON "agent_tool_events"("salonId", "createdAt");
CREATE INDEX "agent_tool_events_agentRunId_idx" ON "agent_tool_events"("agentRunId");

CREATE INDEX "agent_approvals_salonId_status_expiresAt_idx" ON "agent_approvals"("salonId", "status", "expiresAt");
CREATE INDEX "agent_approvals_agentRunId_idx" ON "agent_approvals"("agentRunId");

CREATE UNIQUE INDEX "agent_idempotency_keys_salonId_scope_idempotencyKey_key" ON "agent_idempotency_keys"("salonId", "scope", "idempotencyKey");
CREATE INDEX "agent_idempotency_keys_expiresAt_idx" ON "agent_idempotency_keys"("expiresAt");

-- AddForeignKey
ALTER TABLE "agent_tool_events" ADD CONSTRAINT "agent_tool_events_agentRunId_fkey"
  FOREIGN KEY ("agentRunId") REFERENCES "agent_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "agent_approvals" ADD CONSTRAINT "agent_approvals_agentRunId_fkey"
  FOREIGN KEY ("agentRunId") REFERENCES "agent_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "agent_approvals" ADD CONSTRAINT "agent_approvals_agentToolEventId_fkey"
  FOREIGN KEY ("agentToolEventId") REFERENCES "agent_tool_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
