import { CurrentUser } from "@/types/user.types";

export class AuthError extends Error {
  constructor(message = "User is not authenticated.") {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * The raw shape of the decoded JWT payload from your .NET API.
 */
export interface DecodedToken {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  full_name: string;
  tenant_id: string;
  ip_address: string;
  company: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone": string;
  [key: string]: unknown;
}

/**
 * Maps the verbose claims from a decoded JWT to a clean CurrentUser object.
 */
export function mapJwtToCurrentUser(decodedToken: DecodedToken): CurrentUser {
  return {
    id: Number(
      decodedToken[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ]
    ),
    tenantId: decodedToken.tenant_id
      ? Number(decodedToken.tenant_id)
      : undefined,
    email:
      decodedToken[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ],
    fullName: decodedToken.full_name,
    role: decodedToken[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ],
    ipAddress: decodedToken.ip_address,
    company: decodedToken.company,
    mobilePhone:
      decodedToken[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone"
      ],
  };
}
