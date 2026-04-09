interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
}: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="h-11 w-11 rounded-full text-lg text-gray-700 transition-colors hover:bg-gray-50"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="min-w-12 text-center text-sm font-semibold text-gray-900">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="h-11 w-11 rounded-full text-lg text-gray-700 transition-colors hover:bg-gray-50"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
