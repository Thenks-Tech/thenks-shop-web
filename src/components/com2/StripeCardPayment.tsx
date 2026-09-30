import { useEffect, useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { runtime } from "@/lib/runtime";

let stripePromise: Promise<Stripe | null> | null = null;

function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(runtime.stripePublishableKey);
  }
  return stripePromise;
}

interface StripeCardPaymentProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}

function PaymentForm({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (message: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) {
      return;
    }
    setSubmitting(true);
    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    setSubmitting(false);
    if (result.error) {
      onError(result.error.message ?? "Card payment failed.");
      return;
    }
    onSuccess();
  };

  return (
    <div className="space-y-4">
      <PaymentElement />
      <button
        type="button"
        onClick={handlePay}
        disabled={!stripe || submitting}
        className={submitting ? "btn-disabled w-full" : "btn-primary w-full"}
      >
        {submitting ? "Processing…" : "Pay now"}
      </button>
    </div>
  );
}

export function StripeCardPayment({
  clientSecret,
  onSuccess,
  onError,
}: StripeCardPaymentProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void getStripe().then(() => setReady(true));
  }, []);

  if (!ready) {
    return <p className="text-sm text-gray-500">Loading payment form…</p>;
  }

  return (
    <Elements stripe={getStripe()} options={{ clientSecret }}>
      <PaymentForm onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}
