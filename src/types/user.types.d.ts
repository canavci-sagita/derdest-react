export interface CurrentUser {
  id: number;
  tenantId?: number;
  email: string;
  fullName: string;
  ipAddress?: string;
  imageUrl?: string;
  mobilePhone?: string;
  role: string;
  company?: string;
}
