import { ClerkLoaded, ClerkLoading, SignOutButton } from "@clerk/nextjs";
import { HeaderLogo } from "./header-logo";
import { Navbar } from "./navbar";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { WelcomeMsg } from "./welcome-msg";
import { Filters } from "./filters";

export const Header = () => {
  return (
    <header className="bg-gradient-to-b from-red-700 to-red-500 px-4 py-8 pb-36 lg:px-14">
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-14 flex w-full items-center justify-between">
          <div className="flex items-center lg:gap-x-16">
            <HeaderLogo />
            <Navbar />
          </div>
          <ClerkLoaded>
            <SignOutButton redirectUrl="/login">
              <Button variant="destructive">Sign out</Button>
            </SignOutButton>
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="size-8 animate-spin text-slate-400" />
          </ClerkLoading>
        </div>
        <WelcomeMsg />
        <Filters />
      </div>
    </header>
  );
};
