"use client";
import { useState } from "react"; // Import useEffect
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const router = useRouter();

  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conf_password, setconfPassword] = useState("");

  const registerHandler = async (e) => {
    e.preventDefault();
    console.log("Hello");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, conf_password }), // Send values directly
      }).then(() => {
        console.log("Successfully registered");
        router.push("/signin");
      });

      const data = await res.json();
      if (data.success) redirect("/signin");
      if (!data.success) {
        // Handle registration error here and update the errors state
        setErrors(data.errors); // Assuming the server returns error details in the "errors" field
        return;
      }
    } catch (error) {
      console.log("Error");
      // Handle fetch error and display it using toast
      console.log(error.message);
    }
  };

  return (
    <form
      onSubmit={registerHandler}
      className={`${
        loading ? "loading" : ""
      } w-96 grid gap-6 text-center border border-black p-8 rounded-3xl`}
    >
      <h3 className="text-3xl font-semibold text-[#22668D]">Sign Up</h3>
      <Input
        type="text"
        placeholder="Username"
        name="username" // Match the key in values
        value={username}
        className="border-black"
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        type="email"
        placeholder="Email"
        name="email" // Match the key in values
        value={email}
        className="border-black"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        name="password" // Match the key in values
        value={password}
        className="border-black"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Confirm Password"
        name="confirm_password" // Match the key in values
        value={conf_password}
        className="border-black"
        onChange={(e) => setconfPassword(e.target.value)}
      />
      <Button type="submit" className="bg-[#8ECDDD] hover:bg-[#8ECDDD]/70">
        Sign Up
      </Button>
      <small>
        Already Registered?{" "}
        <Link href="/signin" className="text-[#22668D]">
          Sign in
        </Link>
      </small>
    </form>
  );
}
