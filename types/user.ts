import { loginSchema } from "@/lib/validations/user.validations";
import { z } from "zod";

export type User = z.infer<typeof loginSchema> & {
  id: string;
};


