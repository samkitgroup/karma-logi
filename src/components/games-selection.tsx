import { GameCard } from "@/components/game-card";
import { SiteHeader } from "@/components/site-header";
import { karmaGames } from "@/lib/games";

const challengeGames = karmaGames.filter((game) => game.category === "challenge");
const growthGames = karmaGames.filter((game) => game.category === "growth");

export function GamesSelection() {
  return (
    <div className="cosmic-vignette relative min-h-[100dvh] overflow-x-hidden cosmic-bg">
      <SiteHeader active="games" />

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-10 pt-4 sm:px-6 sm:pb-14 md:px-10">
        <section>
          <div className="mb-5 flex items-center gap-3">
            <div className="section-rule flex-1" />
            <h2 className="shrink-0 font-serif text-[11px] uppercase tracking-[0.18em] text-gold-bright sm:text-xs">
              Challenge · Ghāti
            </h2>
            <div className="section-rule flex-1" />
          </div>

          <ul className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4">
            {challengeGames.map((game) => (
              <li key={game.id}>
                <GameCard game={game} />
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-9 sm:mt-11">
          <div className="mb-5 flex items-center gap-3">
            <div className="section-rule flex-1" />
            <h2 className="shrink-0 font-serif text-[11px] uppercase tracking-[0.18em] text-aghati sm:text-xs">
              Growth · Aghāti
            </h2>
            <div className="section-rule flex-1" />
          </div>

          <ul className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4">
            {growthGames.map((game) => (
              <li key={game.id}>
                <GameCard game={game} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
