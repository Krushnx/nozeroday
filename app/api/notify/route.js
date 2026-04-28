import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:test@test.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function POST(req) {
  try {
    const { subscription } = await req.json();

    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "🔥 Habit Reminder",
        body: "Your notification system is working!",
      })
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}