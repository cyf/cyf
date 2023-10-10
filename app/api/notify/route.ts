import { Knock } from "@knocklabs/node";

const knockClient = new Knock(process.env.NEXT_PUBLIC_KNOCK_SECRET_API_KEY);

const KNOCK_WORKFLOW = "in-app";

export async function POST(request: Request) {
  const res = await request.json();
  const message = res.message;
  const userId = res.userId;
  const showToast = res.showToast;
  try {
    await knockClient.workflows.trigger(KNOCK_WORKFLOW, {
      recipients: [userId],
      actor: userId,
      data: {
        message,
        showToast,
      },
    });
    return Response.json({}, { status: 200 });
  } catch (error: any) {
    return Response.json(
      { error: error.message || error.toString() },
      { status: 500 },
    );
  }
}
