import 'server-only';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from './types';
import { getOperationConfig } from './operations';

export interface AuthContext {
  userId: string;
  userEmail: string;
  userRole: UserRole;
  salonId?: string;
}

export type AuthorizationResult =
  | { authorized: true; context: AuthContext }
  | { authorized: false; status: 401 | 403; code: 'UNAUTHORIZED' | 'FORBIDDEN'; message: string };

/**
 * Validates NextAuth session and ensures the user has administrative privileges (ADMIN or OWNER).
 */
export async function authorizeSandboxAccess(
  operationId?: string
): Promise<AuthorizationResult> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return {
      authorized: false,
      status: 401,
      code: 'UNAUTHORIZED',
      message: 'Authentication required. Please log in with an administrative account.',
    };
  }

  const rawRole = (session.user.role || 'CUSTOMER').toString().toUpperCase() as UserRole;
  const userRole: UserRole = ['OWNER', 'ADMIN', 'STYLIST', 'STAFF', 'CUSTOMER'].includes(rawRole)
    ? rawRole
    : 'CUSTOMER';

  // Base role verification: Only ADMIN and OWNER can execute internal sandbox operations
  if (userRole !== 'ADMIN' && userRole !== 'OWNER') {
    return {
      authorized: false,
      status: 403,
      code: 'FORBIDDEN',
      message: `Access denied. Role "${userRole}" is not authorized for internal sandbox diagnostics.`,
    };
  }

  // Operation-specific role check if operation is provided
  if (operationId) {
    const config = getOperationConfig(operationId);
    if (config && !config.allowedRoles.includes(userRole)) {
      return {
        authorized: false,
        status: 403,
        code: 'FORBIDDEN',
        message: `Role "${userRole}" is not permitted to execute operation "${operationId}".`,
      };
    }
  }

  return {
    authorized: true,
    context: {
      userId: session.user.id || 'unknown',
      userEmail: session.user.email || 'unknown',
      userRole,
      salonId: session.user.salonId,
    },
  };
}
