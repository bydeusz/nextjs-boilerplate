export interface SubtitleProps {
  children: React.ReactNode;
  className?: string;
}

export const Subtitle = ({
  children,
  className = "text-slate-400",
}: SubtitleProps) => (
  <div className={`text-sm uppercase font-medium tracking-[4px] ${className}`}>
    {children}
  </div>
);
