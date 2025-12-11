import { redirect } from "next/navigation";
import { verifySessionToken } from "@/lib/firebase";
import { logoutAction } from "@/app/actions/auth";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSessionCookie } from "@/lib/cookies";

export default async function DashboardPage() {
  const sessionToken = await getSessionCookie();

  if (!sessionToken) {
    redirect(ROUTES.LOGIN);
  }

  const decodedToken = await verifySessionToken(sessionToken);

  if (!decodedToken) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>
              Welcome! You are successfully authenticated.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>Email:</strong> {decodedToken.email}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>User ID:</strong> {decodedToken.uid}
              </p>
            </div>
            <form action={logoutAction}>
              <Button type="submit" variant="outline">
                Logout
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

