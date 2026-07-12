import Link from "next/link";

/** The brand wordmark — identical treatment in the header and footer. */
export function Wordmark() {
  return (
    <Link
      href="/"
      className="font-display text-[20px] font-medium uppercase tracking-[3px]"
    >
      Tijara
    </Link>
  );
}
