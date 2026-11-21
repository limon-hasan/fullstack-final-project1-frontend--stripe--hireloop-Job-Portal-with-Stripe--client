import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URI as string);
const db = client.db("hireloopdb");

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: ["seeker", "recruiter", "admin"],          // ✅ অ্যারে নয়, "string" হবে
                required: false,
                defaultValue: "seeker",
                input: true,             // ✅ ফ্রন্টএন্ড থেকে ইনপুট নিতে এটি true হতে হবে (বা input লাইনটি বাদ দেওয়া যায়)
            },
        },

    },

    socialProviders: {
        github: {
            clientId: process.env.GOOGLE as string,
            clientSecret: process.env.GOOGLE as string,
        },
    },
});