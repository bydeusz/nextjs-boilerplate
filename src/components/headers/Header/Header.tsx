interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

export const Header = ({ title, children }: HeaderProps) => (
  <header className="flex">
    <h1>{title}</h1>
    <div className="ml-auto space-x-2">{children}</div>
  </header>
);
