export function Logo({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display font-extrabold tracking-tight ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 text-sm text-gold-400">
        DW
      </span>
      <span className={dark ? "text-white" : "text-navy-900"}>
        DONE WELL<span className="align-super text-[0.5em]">®</span>
      </span>
    </span>
  );
}
