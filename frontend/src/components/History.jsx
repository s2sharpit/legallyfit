'use client'
import { useState } from 'react';
import { LuMenu, LuX } from 'react-icons/lu';

export default function History({ history }) {
    const [isMenu, setIsMenu] = useState(false);
  return (
    <div className="">
      <button
        onClick={() => setIsMenu(true)}
        className="text-[#22668D] text-3xl"
      >
        <LuMenu />
      </button>
      <div
        className={`${
          isMenu ? "translate-x-0" : "translate-x-60"
        } absolute flex flex-col w-56 rounded-lg bg-[#FFFADD] p-3 right-3 top-5 bottom-5 transition-all`}
      >
        <button
          onClick={() => setIsMenu(false)}
          className="text-[#22668D] text-3xl self-end"
        >
          <LuX />
        </button>
        <h3 className="text-[#22668D] font-semibold pb-2">History</h3>
        <div className="overflow-y-scroll space-y-3">
          {history?.map((his, i) => (
            <div key={i} className="bg-[#8ECDDD] p-2 rounded-lg space-y-2">
              <h3 className="text-sm font-semibold">{his.summary}</h3>
              <p className="text-xs">{his.prompt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
