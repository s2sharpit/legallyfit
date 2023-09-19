import { Router } from "next/navigation";
import { LuUserCircle } from "react-icons/lu";
import toast from "react-hot-toast";
import { cookies } from "next/headers";
import Button from "./ui/Button";
import History from "./History";
import Link from "next/link";

const userData = async () => {
  const cookieStore = cookies();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: cookieStore.get("token")?.value,
      },
    });

    const data = await res.json();

    if (res.status === 401) {
      toast.error(data.error + ", please login first");
      return Router.push("/signin");
    }

    if (data.status == "error") return console.log(data.error);

    return data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default async function Header() {
  const user = await userData();

  return (
    <header>
      <div className="flex justify-between">
        <div className="text-[#22668D] text-3xl">
          <LuUserCircle />
        </div>
        <div className=""></div>
        {user.username ? (
          <History history={user.history} />
        ) : (
          <Link href="/signin" className="font-medium text-[#22668D]">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}

