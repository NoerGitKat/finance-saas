import Image from "next/image";
import Link from "next/link";

export const HeaderLogo = () => {
  return (
    <Link href="/">
      <div className="hidden items-center lg:flex">
        <Image src="/logo.svg" alt="Logo" height="50" width="50" />
        <p className="ml-2.5 text-2xl font-semibold text-white">Finance SAAS</p>
      </div>
    </Link>
  );
};
