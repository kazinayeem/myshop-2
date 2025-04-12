
import Image from "next/image";
import Link from "next/link";

export default async function ServerNavbarBranding() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/brands`);
  const data = await res.json();
  const brand = data[0];

  return (
    <div className="flex items-center space-x-2">
      <Link href="/">
        <Image
          src={brand?.logo}
          alt="Logo"
          width={50}
          height={50}
          className="rounded-full"
        />
      </Link>
      <Link href="/">
        <span className="text-xl font-bold text-gray-700">{brand?.name}</span>
      </Link>
    </div>
  );
}
