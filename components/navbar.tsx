"use client";

import { usePathname, useRouter } from "next/navigation";
import { NavButton } from "./nav-button";
import { useMedia } from "react-use";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

const routes = [
  { href: "/", label: "Overview" },
  { href: "/transactions", label: "Transactions" },
  { href: "/accounts", label: "Accounts" },
  { href: "/categories", label: "Categories" },
  { href: "/settings", label: "Settings" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { push } = useRouter();
  const pathname = usePathname();
  const isMobile = useMedia("(max-width: 1024px)", false);

  const reroute = (href: string) => {
    push(href);
    setIsOpen(false);
  };

  if (isMobile)
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <div className="rounded-md border-none bg-white/10 p-2 font-normal text-white outline-none transition hover:bg-white/20 hover:text-white focus:bg-white/30 focus-visible:ring-transparent focus-visible:ring-offset-0">
            <Menu className="size-4" />
          </div>
        </SheetTrigger>
        <SheetContent side="left" className="px-2">
          <nav className="flex flex-col gap-y-2 pt-6">
            <ul className="flex flex-col">
              {routes.map(({ href, label }) => (
                <Button
                  key={label}
                  variant={pathname == href ? "secondary" : "ghost"}
                  onClick={() => reroute(href)}
                >
                  {label}
                </Button>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    );

  return (
    <nav>
      <ul className="hidden items-center gap-x-2 overflow-x-auto lg:flex">
        {routes.map(({ href, label }) => (
          <NavButton
            key={label}
            label={label}
            href={href}
            isActive={pathname == href}
          />
        ))}
      </ul>
    </nav>
  );
};
