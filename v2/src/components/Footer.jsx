import { ArrowUp } from "lucide-react";
import { PROFILE } from "../data/site";

/** Minimal footer with smooth back-to-top. */
export default function Footer({ onTop }) {
  return (
    <footer>
      <div className="wrap foot">
        <span>{PROFILE.name} — {PROFILE.location}</span>
        <span>© 2026 {PROFILE.name}</span>
        <button type="button" onClick={onTop}>Back to top <ArrowUp size={15} /></button>
      </div>
    </footer>
  );
}
