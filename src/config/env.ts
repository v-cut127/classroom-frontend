import { z } from "zod";

const envSchema = z.object({
    VITE_CLOUDINARY_UPLOAD_URL: z.string().url().optional().default("https://api.cloudinary.com/v1_1"),
    VITE_CLOUDINARY_CLOUD_NAME: z.string().min(1, "Cloud name is required"),
    VITE_BACKEND_BASE_URL: z.string().url("Backend base URL must be a valid URL"),
    VITE_API_URL: z.string().url("API URL must be a valid URL"),
    VITE_ACCESS_TOKEN_KEY: z.string().min(1, "Access token key is required").default("access_token"),
    VITE_REFRESH_TOKEN_KEY: z.string().min(1, "Refresh token key is required").default("refresh_token"),
    VITE_CLOUDINARY_UPLOAD_PRESET: z.string().min(1, "Cloudinary upload preset is required"),
});

const _env = envSchema.safeParse(import.meta.env);

if (!_env.success) {
    console.error("❌ Invalid environment variables:", _env.error.format());
    throw new Error("Invalid environment variables");
}

export const env = _env.data;
