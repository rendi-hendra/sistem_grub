import { z, ZodType } from 'zod';

export class GrubValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(100),
  });
  static readonly JOIN: ZodType = z.object({
    grub_id: z.string().min(1),
  });
  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(100),
  });
  static readonly ROLE: ZodType = z.object({
    user_id: z.number().min(1),
    role_id: z.number().min(1),
  });
}
