const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  const json = await res.json();
  if (!res.ok || json.success === false) {
    const errorMsg = json.error?.message || 'An unexpected error occurred';
    throw new Error(errorMsg);
  }

  return json.data;
}

export const api = {
  // Auth
  async getSession() {
    return request<any>('/auth/session');
  },
  async login(credentials: { email: string; password?: string }) {
    return request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  async register(data: { name: string; email: string; phone?: string; password?: string }) {
    return request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async switchDemoRole(role: 'CITIZEN' | 'STAFF' | 'ADMIN') {
    return request<any>('/auth/switch-demo', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
  },
  async logout() {
    return request<any>('/auth/logout', { method: 'POST' });
  },

  // User Profile
  async getProfile() {
    return request<any>('/users/me');
  },
  async updateProfile(data: { name?: string; phone?: string }) {
    return request<any>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Services
  async getServices(params?: { category?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<any[]>(`/services${queryString}`);
  },
  async getCategories() {
    return request<any[]>('/services/categories');
  },
  async getServiceBySlug(slug: string) {
    return request<any>(`/services/${slug}`);
  },

  // Requests (Citizen)
  async getRequests(status?: string) {
    const q = status ? `?status=${status}` : '';
    return request<any[]>(`/requests${q}`);
  },
  async getRequestById(id: string) {
    return request<any>(`/requests/${id}`);
  },
  async createRequest(data: {
    categoryId: string;
    categoryName: string;
    title: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    landmark?: string;
    photos?: string[];
  }) {
    return request<any>('/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async addComment(requestId: string, message: string) {
    return request<any>(`/requests/${requestId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
  async reopenRequest(id: string, reason: string) {
    return request<any>(`/requests/${id}/reopen`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  // Staff Portal API
  async getStaffDashboard() {
    return request<any>('/staff/dashboard');
  },
  async getStaffAssigned(params?: { status?: string; priority?: string; search?: string; date?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.priority) query.append('priority', params.priority);
    if (params?.search) query.append('search', params.search);
    if (params?.date) query.append('date', params.date);
    const q = query.toString() ? `?${query.toString()}` : '';
    return request<any[]>(`/staff/assigned${q}`);
  },
  async getStaffWorkQueue() {
    return request<any[]>('/staff/work-queue');
  },
  async getStaffHistory() {
    return request<any[]>('/staff/history');
  },
  async getStaffRequest(id: string) {
    return request<any>(`/staff/requests/${id}`);
  },
  async acceptStaffRequest(id: string) {
    return request<any>(`/staff/requests/${id}/accept`, { method: 'POST' });
  },
  async startStaffRequest(id: string) {
    return request<any>(`/staff/requests/${id}/start`, { method: 'POST' });
  },
  async addStaffProgress(id: string, note: string) {
    return request<any>(`/staff/requests/${id}/progress`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
  },
  async resolveStaffRequest(id: string, data: { resolutionNote: string; evidenceUrl?: string }) {
    return request<any>(`/staff/requests/${id}/resolve`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async requestStaffReassignment(id: string, reason: string) {
    return request<any>(`/staff/requests/${id}/reassignment-request`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
  async getStaffProfile() {
    return request<any>('/staff/profile');
  },

  // Admin Console API
  async getAdminDashboard() {
    return request<any>('/admin/dashboard');
  },
  async getAdminComplaints(params?: {
    status?: string;
    departmentId?: string;
    priority?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.departmentId) query.append('departmentId', params.departmentId);
    if (params?.priority) query.append('priority', params.priority);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    const q = query.toString() ? `?${query.toString()}` : '';
    return request<{ complaints: any[]; pagination: any }>(`/admin/complaints${q}`);
  },
  async getAdminComplaint(id: string) {
    return request<any>(`/admin/complaints/${id}`);
  },
  async assignAdminComplaint(id: string, data: { departmentId?: string; assignedStaffId?: string | null; note?: string }) {
    return request<any>(`/admin/complaints/${id}/assignment`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  async updateAdminPriority(id: string, priority: string) {
    return request<any>(`/admin/complaints/${id}/priority`, {
      method: 'PATCH',
      body: JSON.stringify({ priority }),
    });
  },
  async reopenAdminComplaint(id: string, reason: string) {
    return request<any>(`/admin/complaints/${id}/reopen`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
  async rejectAdminComplaint(id: string, reason: string) {
    return request<any>(`/admin/complaints/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
  async getAdminDepartments() {
    return request<any[]>('/admin/departments');
  },
  async createAdminDepartment(data: { name: string; code: string; contactDetails?: string }) {
    return request<any>('/admin/departments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async updateAdminDepartment(id: string, data: any) {
    return request<any>(`/admin/departments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  async getAdminStaff() {
    return request<any[]>('/admin/staff');
  },
  async createAdminStaff(data: { name: string; email: string; phone?: string; departmentId: string; assignedArea?: string }) {
    return request<any>('/admin/staff', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async updateAdminStaff(id: string, data: any) {
    return request<any>(`/admin/staff/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  async getAdminUsers(search?: string) {
    const q = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<any[]>(`/admin/users${q}`);
  },
  async getAdminServices() {
    return request<any[]>('/admin/services');
  },
  async updateAdminService(id: string, data: any) {
    return request<any>(`/admin/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  async getAdminAnalytics() {
    return request<any>('/admin/analytics');
  },
  async getAdminAuditLogs() {
    return request<any[]>('/admin/audit-logs');
  },

  // Payments
  async getProviders() {
    return request<any[]>('/payments/providers');
  },
  async lookupBill(providerCode: string, accountReference: string) {
    return request<any>('/payments/bill-lookup', {
      method: 'POST',
      body: JSON.stringify({ providerCode, accountReference }),
    });
  },
  async payBill(data: {
    billId?: string;
    providerCode: string;
    accountReference: string;
    paymentMethod: string;
    amountMinor: number;
    idempotencyKey?: string;
  }) {
    return request<any>('/payments/pay', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async getPaymentHistory() {
    return request<any[]>('/payments/history');
  },
  async getPaymentById(id: string) {
    return request<any>(`/payments/${id}`);
  },

  // Locations
  async getNearbyLocations(category = 'all', lat?: number, lng?: number) {
    const q = new URLSearchParams({ category });
    if (lat) q.append('lat', lat.toString());
    if (lng) q.append('lng', lng.toString());
    return request<any[]>(`/locations/nearby?${q.toString()}`);
  },
  async searchLocations(q: string) {
    return request<any[]>(`/locations/search?q=${encodeURIComponent(q)}`);
  },
  async reverseGeocode(lat: number, lng: number) {
    return request<any>(`/locations/reverse?lat=${lat}&lng=${lng}`);
  },

  // Notifications
  async getNotifications() {
    return request<{ notifications: any[]; unreadCount: number }>('/notifications');
  },
  async markNotificationRead(id: string) {
    return request<any>(`/notifications/${id}/read`, { method: 'PATCH' });
  },
  async markAllNotificationsRead() {
    return request<any>('/notifications/read-all', { method: 'PATCH' });
  },

  // Certificates
  async getCertificateServices() {
    return request<any[]>('/certificates/services');
  },
  async getUserCertificates() {
    return request<any[]>('/certificates/requests');
  },
  async applyCertificate(data: { certificateType: string; applicantName: string }) {
    return request<any>('/certificates/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Transport
  async getTransitRoutes(query?: string) {
    const q = query ? `?q=${encodeURIComponent(query)}` : '';
    return request<any[]>(`/transport/routes${q}`);
  },
};
