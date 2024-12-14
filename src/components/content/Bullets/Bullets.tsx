export interface ListProps {
  list: string[];
  row: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const Bullets = ({ list, row, className, icon }: ListProps) => {
  const renderList = () => (
    <div className={`${className} ${row ? "space-y-2" : "flex space-x-4"}`}>
      {list.map((text, index) => (
        <div className="flex space-x-2" key={index}>
          {icon && <div>{icon}</div>}
          <div>{text}</div>
        </div>
      ))}
    </div>
  );

  return renderList();
};
