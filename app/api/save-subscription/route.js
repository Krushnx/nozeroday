import { setSubscription } from "@/lib/scheduler";

export async function POST(req) {
  try {
    const { subscription } = await req.json();

    setSubscription(subscription);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}