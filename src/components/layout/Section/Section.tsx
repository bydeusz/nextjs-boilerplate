export interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export const Section = ({
  children,
  className = "py-8 bg-slate-100",
}: SectionProps) => <section className={className}>{children}</section>;
