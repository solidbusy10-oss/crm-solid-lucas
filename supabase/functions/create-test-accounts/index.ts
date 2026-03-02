import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const accounts = [
    { email: "supervisor@solid.com", password: "senha1234", role: "supervisor", name: "Supervisor" },
    { email: "coordenador@solid.com", password: "senhas12345", role: "coordenador", name: "Coordenador" },
    { email: "vendedor@solid.com", password: "senhas12", role: "vendedor", name: "Vendedor" },
  ];

  const results = [];

  for (const account of accounts) {
    // Check if user exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((u) => u.email === account.email);

    let userId: string;

    if (existing) {
      userId = existing.id;
      results.push({ email: account.email, status: "already exists", userId });
    } else {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: { full_name: account.name },
      });

      if (error) {
        results.push({ email: account.email, status: "error", error: error.message });
        continue;
      }
      userId = data.user.id;
      results.push({ email: account.email, status: "created", userId });
    }

    // Upsert role
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: account.role }, { onConflict: "user_id,role" });

    if (roleError) {
      results.push({ email: account.email, roleStatus: "error", error: roleError.message });
    }
  }

  return new Response(JSON.stringify({ results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
