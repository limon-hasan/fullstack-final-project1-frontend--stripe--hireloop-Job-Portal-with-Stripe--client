import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "./auth"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL, // একই ডোমেইনে চললে এটি না দিলেও স্বয়ংক্রিয়ভাবে কাজ করে
    plugins: [
        inferAdditionalFields<typeof auth>(), // ✅ সার্ভারের 'role' ফিল্ড স্বয়ংক্রিয়ভাবে টাইপস্ক্রিপ্ট চিনে নেবে
    ],
})

// একক ইনস্ট্যান্স থেকে এক্সপোর্ট
export const { signIn, signUp, useSession, signOut } = authClient