export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="rule-gold h-px w-16 opacity-70 sm:w-24" />
      <span className="text-gold text-xs">&#10040;</span>
      <span className="rule-gold h-px w-16 opacity-70 sm:w-24" />
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground tracking-widest-xs text-[0.68rem] uppercase">{children}</p>
  );
}
