import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/constants/env";
import type { Database } from "./types";

export const createSupabaseServerClient = async (): Promise<
  SupabaseClient<Database>
> => {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // In Next.js 15, we can't set cookies from server components
          // This is handled by middleware or route handlers
          cookiesToSet.forEach(({ name, value, options }) => {
            // Log for debugging purposes
            console.log(`Would set cookie: ${name}=${value}`, options);
          });
        },
      },
    }
  );
};
