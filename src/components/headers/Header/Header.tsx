interface HeaderProps {
  title: string;
  children?: React.ReactNode;
  border?: boolean;
}

export const Header = ({ title, children, border }: HeaderProps) => (
  <header className={`flex ${border ? "border-b border-gray-200 pb-4" : ""}`}>
    <h1>{title}</h1>
    <div className="ml-auto space-x-2">{children}</div>
  </header>
);
