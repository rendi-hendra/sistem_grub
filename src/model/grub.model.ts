export class GrubResponse {
  id: number;
  grub_id: string;
  name: string;
  total_users: number;
}

export class GrubMemberResponse {
  id: number;
  grub_id: string;
  user_id: number;
  name: string;
  total_users: number;
}

export class CreateGrubRequest {
  name: string;
}

export class JoinGrubRequest {
  grub_id: string;
}

export class UpdateGrubRequest {
  name?: string;
}
