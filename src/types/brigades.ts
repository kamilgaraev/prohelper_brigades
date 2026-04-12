export type BrigadeProfileStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'suspended';
export type BrigadeAvailabilityStatus = 'available' | 'partially_available' | 'busy';
export type BrigadeInvitationStatus = 'pending' | 'accepted' | 'declined' | 'cancelled' | 'expired';
export type BrigadeRequestStatus = 'open' | 'in_review' | 'closed' | 'cancelled';
export type BrigadeAssignmentStatus = 'planned' | 'active' | 'paused' | 'completed' | 'cancelled';

export type BrigadeProfile = {
  id: number;
  organization_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  team_size: number | null;
  contact_person: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  availability_status: BrigadeAvailabilityStatus;
  verification_status: BrigadeProfileStatus;
  rating: number;
  completed_projects_count: number;
  regions: string[];
  specializations: string[];
  members?: BrigadeMember[];
  documents?: BrigadeDocument[];
  created_at?: string;
};

export type BrigadeMember = {
  id: number;
  full_name: string;
  role: string;
  phone: string | null;
  is_manager: boolean;
  is_active: boolean;
};

export type BrigadeDocument = {
  id: number;
  title: string;
  document_type: string;
  file_name: string | null;
  file_path: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  verification_notes?: string | null;
  verified_at?: string | null;
  created_at?: string;
};

export type BrigadeInvitation = {
  id: number;
  project_name?: string | null;
  contractor_organization_name?: string | null;
  message: string | null;
  status: BrigadeInvitationStatus;
  starts_at: string | null;
  expires_at?: string | null;
  created_at?: string | null;
};

export type BrigadeRequest = {
  id: number;
  title: string;
  description?: string | null;
  specialization_name: string | null;
  city: string | null;
  team_size_min: number | null;
  team_size_max: number | null;
  status: BrigadeRequestStatus;
  project_name: string | null;
  contractor_organization_name?: string | null;
  published_at: string | null;
  responses_count?: number;
};

export type BrigadeResponse = {
  id: number;
  request_id: number;
  cover_message: string | null;
  status: 'pending' | 'approved' | 'rejected';
  request?: BrigadeRequest;
  created_at?: string | null;
};

export type BrigadeProjectAssignment = {
  id: number;
  project_name: string;
  contractor_organization_name?: string | null;
  status: BrigadeAssignmentStatus;
  starts_at: string | null;
  ends_at: string | null;
  notes?: string | null;
  source_type?: string | null;
};
