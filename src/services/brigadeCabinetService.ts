import api from '@/services/api';
import type { ApiEnvelope } from '@/types/api';
import type {
  BrigadeDocument,
  BrigadeInvitation,
  BrigadeMember,
  BrigadeProfile,
  BrigadeProjectAssignment,
  BrigadeRequest,
  BrigadeResponse,
} from '@/types/brigades';

type UpdateBrigadeProfilePayload = Partial<
  Pick<
    BrigadeProfile,
    | 'name'
    | 'description'
    | 'team_size'
    | 'contact_person'
    | 'contact_phone'
    | 'contact_email'
    | 'availability_status'
    | 'regions'
    | 'specializations'
  >
> & {
  submit_for_review?: boolean;
};

export const brigadeCabinetService = {
  async getProfile(): Promise<BrigadeProfile> {
    const response = await api.get<ApiEnvelope<BrigadeProfile>>('/profile');
    return response.data.data;
  },
  async updateProfile(payload: UpdateBrigadeProfilePayload): Promise<BrigadeProfile> {
    const response = await api.put<ApiEnvelope<BrigadeProfile>>('/profile', payload);
    return response.data.data;
  },
  async getMembers(): Promise<BrigadeMember[]> {
    const response = await api.get<ApiEnvelope<BrigadeMember[]>>('/members');
    return response.data.data;
  },
  async getDocuments(): Promise<BrigadeDocument[]> {
    const response = await api.get<ApiEnvelope<BrigadeDocument[]>>('/documents');
    return response.data.data;
  },
  async uploadDocument(payload: { title: string; document_type: string; document: File }): Promise<void> {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('document_type', payload.document_type);
    formData.append('document', payload.document);

    await api.post('/documents', formData);
  },
  async deleteDocument(documentId: number): Promise<void> {
    await api.delete(`/documents/${documentId}`);
  },
  async getInvitations(): Promise<BrigadeInvitation[]> {
    const response = await api.get<ApiEnvelope<BrigadeInvitation[]>>('/invitations');
    return response.data.data;
  },
  async acceptInvitation(invitationId: number): Promise<void> {
    await api.post(`/invitations/${invitationId}/accept`);
  },
  async declineInvitation(invitationId: number): Promise<void> {
    await api.post(`/invitations/${invitationId}/decline`);
  },
  async getRequests(): Promise<BrigadeRequest[]> {
    const response = await api.get<ApiEnvelope<BrigadeRequest[]>>('/requests');
    return response.data.data;
  },
  async getResponses(): Promise<BrigadeResponse[]> {
    const response = await api.get<ApiEnvelope<BrigadeResponse[]>>('/responses');
    return response.data.data;
  },
  async createResponse(payload: { request_id: number; cover_message?: string }): Promise<void> {
    await api.post('/responses', payload);
  },
  async getAssignments(): Promise<BrigadeProjectAssignment[]> {
    const response = await api.get<ApiEnvelope<BrigadeProjectAssignment[]>>('/assignments');
    return response.data.data;
  },
  async createMember(payload: { full_name: string; role: string; phone?: string; is_manager?: boolean }): Promise<void> {
    await api.post('/members', payload);
  },
  async updateMember(memberId: number, payload: { full_name: string; role: string; phone?: string; is_manager?: boolean; is_active?: boolean }): Promise<void> {
    await api.put(`/members/${memberId}`, payload);
  },
  async deleteMember(memberId: number): Promise<void> {
    await api.delete(`/members/${memberId}`);
  },
};
