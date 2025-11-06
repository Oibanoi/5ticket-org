import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ message: "Email là bắt buộc" })
    .min(1, { message: "Email là bắt buộc" }),
  password: z
    .string({ message: "Mật khẩu là bắt buộc" })
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
  savePassword: z.boolean().optional().default(false),
  isDevelopment: z.boolean().optional().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;

