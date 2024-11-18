import { z } from 'zod';

export const deviceSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['light', 'thermostat', 'security', 'blinds']),
  roomId: z.string().optional(),
  state: z.boolean().default(false),
  value: z.number().optional()
}); 