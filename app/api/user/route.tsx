import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json(); // request.json() is asynchronous
  console.log("Received POST request with body:", body);
  const supabase = await createClient();
  const { data: newProfile, error: createError } = await supabase
    .from("profiles")
    .insert([
      {
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        profile_image_url: body.image,
        created_by: body.created_by,
        created_at: body.created_at,
      },
    ]);
  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 500 });
  }
  return NextResponse.json({ newProfile }, { status: 200 });
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Get query params from URL
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const password = searchParams.get("password");
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  if (!password) {
    const { data, error } = await supabase
      .from("profiles") 
      .select("*")
      .eq("email", email)
      .single();

    if (!data) {
      return NextResponse.json({ data: null }, { status: 404 });
    }
    return NextResponse.json({ data }, { status: 200 });
  }
}
