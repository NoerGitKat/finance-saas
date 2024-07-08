import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <p>This is an auth route</p>
      <SignOutButton redirectUrl="/login">
        <Button variant="destructive">Sign out</Button>
      </SignOutButton>
    </>
  );
}
