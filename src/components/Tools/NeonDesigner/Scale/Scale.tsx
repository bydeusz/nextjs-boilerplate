interface ScaleProps {
  scale: number;
  setScale: (scale: number) => void;
}

export default function Scale({ scale, setScale }: ScaleProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScale(parseFloat(event.target.value));
  };

  return (
    <div className="py-4">
      <div className="mb-2 text-sm font-semibold">Vergroten</div>
      <input
        type="range"
        min="0.1"
        max="1"
        step="0.01"
        value={scale}
        onChange={handleChange}
        className="w-full"
      />
    </div>
  );
}
