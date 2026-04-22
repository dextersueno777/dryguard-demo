import { users } from "@/lib/users";

export async function POST(req) {
  const { username, password } = await req.json();

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return Response.json({ success: false });
  }

  return Response.json({
    success: true,
    user: {
      username: user.username,
      role: user.role,
    },
  });
}
