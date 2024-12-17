export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container = ({
  children,
  className = "px-4 sm:px-6 lg:px-8",
}: ContainerProps) => (
  <div className={`mx-auto max-w-7xl ${className}`}>{children}</div>
);
