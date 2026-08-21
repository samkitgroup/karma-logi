import { KarmaLogiHome } from "@/components/karma-logi-home";

/** Open access route — no on-site location check. */
export default function OpenPlayPage() {
  return <KarmaLogiHome locationRequired={false} />;
}
