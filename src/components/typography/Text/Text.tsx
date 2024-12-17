export interface TextProps {
  className?: string;
  children: React.ReactNode;
}

export const Text = ({ children, className }: TextProps) => (
  <div className={className}>{children}</div>
);
