"use client";

import { usePathname } from "next/navigation";
import { NavButton } from "./nav-button";

const routes = [
  { href: "/", label: "Overview" },
  { href: "/transactions", label: "Transactions" },
  { href: "/accounts", label: "Accounts" },
  { href: "/categories", label: "Categories" },
  { href: "/settings", label: "Settings" },
];

export const Navbar = () => {
  const pathname = usePathname();
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
