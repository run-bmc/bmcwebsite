import { GameShell } from "@/components/GameShell";
import { TopNav } from "@/components/TopNav";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050712] text-stone-100">
      <TopNav />
      <GameShell />
    </main>
  );
}
