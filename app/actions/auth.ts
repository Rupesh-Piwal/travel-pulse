"use server";

import { signOut } from "@/auth";

/**
 * Handle user logout on the server side.
 */
export async function handleLogout() {
  await signOut({ 
    redirectTo: "/" 
  });
}
