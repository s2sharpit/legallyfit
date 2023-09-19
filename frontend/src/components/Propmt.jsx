"use client";

import card from "@/data/card";
import { useState } from "react";
import toast from "react-hot-toast";
import { Svg } from "./Svg";
import { useRouter } from "next/navigation";
import { LuLoader2 } from "react-icons/lu";
import cookie from "js-cookie";

export default function Propmt() {
  const [prompt, setPrompt] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allData, setData] = useState({});

  const router = useRouter();

  const searchHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/generate-prompt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: cookie.get("token"),
          },
          body: JSON.stringify({ prompt }), // Send values directly
        }
      );

      const data = await res.json();

      if (res.status === 401) {
        toast.error(data.error + ", please login first");
        return router.push("/signin");
      }

      setLoading(false);
      if (res.status === 406)
        return toast.error("Please enter correct prompt...");

      if (data.status == "error") return console.log(data.error);
      setIsSearch(true);
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <>
      <div className="rounded-lg shadow-md overflow-hidden w-96 md:w-[40rem] bg-[#FFFADD] py-2">
        <form
          onSubmit={searchHandler}
          className="flex items-center text-[#22668D]"
        >
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your issue here"
            className="w-full h-fit py2 px-4 outline-none bg-transparent resize-none overflow-hidden placeholder:translate-y-3"
          />

          <div className="pr-2 flex">
            <button type="submit" className={`${loading && "hidden"}`}>
              <Svg.Search className="py-1.5" />
            </button>
            <LuLoader2
              className={`${!loading && "hidden"} animate-spin text-3xl`}
            />
          </div>
        </form>
        <div className={`${!isSearch && "hidden"}`}>
          <hr className="h-0.5 bg-[#8ECDDD]" />
          <div className="min-h-0 p-4 text-[#22668D] flex flex-col">
            <div className="">
              {allData?.artices?.map((article) => (
                <div key={article.id} className="mb-4">
                  <h1 className="text-xl font-semibold">
                    {article.article_number}
                  </h1>
                  <p className="text-sm">{article.description}</p>
                </div>
              ))}
            </div>
            <hr className="bg-[#8ECDDD] mb-2" />
            <div className="">
              <h1 className="text-xl font-semibold">Suggestion</h1>
              <p className="text-sm">{allData?.suggestion}</p>
            </div>
            <button className="mt-20 rounded px-4 py-2 bg-[#FFCC70] mx-auto">
              Generate {allData?.tag}
            </button>
          </div>
        </div>
      </div>

      <div className={`${isSearch && "hidden"}`}>
        <p className="text-center text-[#22668D] pb-7 text-lg">
          Sevices we offer&nbsp;&gt;&gt;
        </p>
        <div className="grid grid-cols-3 gap-6">
          {card.map((data) => (
            <div
              key={data.title}
              className="w-64 bg-[#8ECDDD] rounded-lg p-4 text-sm"
            >
              <h1 className="font-semibold">{data.title}</h1>
              <p className="">- {data.subtle}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
