import Image from "next/image";
import Header from "@/components/Header";
import Propmt from "@/components/Propmt";
export default function Home() {
  

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justifybetween gap-16 p-4">
        <div className="grid place-items-center text-[#22668D]">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="logo"
              width={52}
              height={52}
              className=""
            />
            <h1 className="text-3xl font-semibold">Welcome to LegallyFit</h1>
          </div>
          <p className="pt-2">
            Your AI-Powered Legal Companion for Simplified Documentation in
            Bharat
          </p>
        </div>
        <Propmt />
        
      </main>
    </>
  );
}
