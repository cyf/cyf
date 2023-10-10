import { Knock } from "@knocklabs/node";
import { v4 as uuid_v4 } from "uuid";
import { faker } from "@faker-js/faker";

const knockClient = new Knock(process.env.NEXT_PUBLIC_KNOCK_SECRET_API_KEY);

export async function POST(request: Request) {
  const res = await request.json();
  const id = res.id;
  const name = res.name;
  const userId = id || uuid_v4();
  try {
    const knockUser = await knockClient.users.identify(userId, {
      name: name || faker.person.fullName(),
    });
    return Response.json({ user: knockUser }, { status: 200 });
  } catch (error: any) {
    return Response.json(
      { error: error.message || error.toString() },
      { status: 500 },
    );
  }
}
