interface TabsProps {
  children: React.ReactNode;
}

export const Tabs = ({ children }: TabsProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px space-x-10">{children}</nav>
      </div>
    </div>
  );
};
