'use client'

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import cookie from "js-cookie";
export default function SignIn() {

    const [values, setValues] = useState({
      username: "",
      password: "",
    });

    const router = useRouter();
    const onChange = (event) => {
      setValues({ ...values, [event.target.name]: event.target.value });
    };

    const loginHandler = async (e) => {
      e.preventDefault();
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/login`, {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await res.json();
        if (!response) return console.log("error");
        if(response) {
          const {data} = response;
          console.log("success");
          cookie.set("token", data, {expires: 1});
          router.push("/");
        }
        
      } catch (error) {
        return console.log();(error);
      }
    };
  return (
    <form
      onSubmit={loginHandler}
      className={`w-96 grid gap-6 text-center border border-black p-8 rounded-3xl`}
    >
      <h3 className="text-3xl font-semibold text-[#22668D]">Sign In</h3>
      <Input
        type="text"
        placeholder="Username"
        name="username"
        value={values.username}
        className="border-black"
        // error={errors.username ? true : false}
        onChange={onChange}
      />
      <Input
        type="password"
        placeholder="Password"
        name="password"
        value={values.password}
        className="border-black"
        // error={errors.password ? true : false}
        onChange={onChange}
      />
      <Button type="submit" className="bg-[#8ECDDD] hover:bg-[#8ECDDD]/70">Sign In</Button>
      <small>
        New User?{" "}
        <Link href="/signup" className="text-[#22668D]">
          Sign Up
        </Link>
      </small>
    </form>
    // {Object.keys(errors).length > 0 && (
    //   <div className="ui error message">
    //     <ul className="list">
    //       {Object.values(errors).map((value) => (
    //         <li key={value}>{value}</li>
    //       ))}
    //     </ul>
    //   </div>
    // )}
  );
}
