interface StrokesProps {
  strokes: number;
  setStrokes: (Strokes: number) => void;
}

export default function Strokes({ strokes, setStrokes }: StrokesProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStrokes(parseFloat(event.target.value));
  };

  return (
    <div className="py-4">
      <div className="mb-2 text-sm font-semibold">Dikte</div>
      <input
        type="range"
        min="15"
        max="50"
        step="1"
        value={strokes}
        onChange={handleChange}
        className="w-full"
      />
    </div>
  );
}
