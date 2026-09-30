interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
}: QuantityStepperProps) {
  const canDecrease = value > min;
  const canIncrease = max === undefined || value < max;

  return (
    <div className="inline-flex items-center rounded-full border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={!canDecrease}
        className="h-11 w-11 rounded-full text-lg text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="min-w-12 text-center text-sm font-semibold text-gray-900">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(max !== undefined ? Math.min(max, value + 1) : value + 1)}
        disabled={!canIncrease}
        className="h-11 w-11 rounded-full text-lg text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
