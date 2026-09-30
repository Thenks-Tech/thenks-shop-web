import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  CommerceApiError,
  fetchCommerceOrder,
  type CommerceOrder,
} from "@/lib/commerceApi";
import { formatMoneyFromDecimal } from "@/lib/money";
import {
  ORDER_STATUS_STEPS,
  orderStatusLabel,
  orderTimelineIndex,
} from "@/lib/orderStatus";

export function Com2OrderTrackingPage() {
  const { entityThenksId = "", storeSlug = "", orderId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const emailParam = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(emailParam);
  const [order, setOrder] = useState<CommerceOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const basePath = `/${entityThenksId}/${storeSlug}`;

  const loadOrder = async (emailOverride?: string) => {
    setLoading(true);
    setError(null);
    setAuthError(null);
    if (!token) {
      setAuthError("An access link is required to view this order.");
      setLoading(false);
      return;
    }
    try {
      const data = await fetchCommerceOrder(
        orderId,
        token,
        emailOverride ?? email,
      );
      setOrder(data);
    } catch (err) {
      setOrder(null);
      if (err instanceof CommerceApiError) {
        if (err.code === "order_access_denied") {
          setAuthError(
            "Email does not match this order. Enter the email used at checkout.",
          );
        } else if (err.code === "order_not_found") {
          setError("Order not found or link expired.");
        } else if (err.code === "order_token_required") {
          setAuthError("Missing access token.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Could not load order.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrder(emailParam || undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, token]);

  const timelineIdx = order ? orderTimelineIndex(order.status) : -1;

  return (
    <div className="space-y-5">
      <Link to={basePath} className="text-xs font-medium text-primary">
        ← Back to store
      </Link>
      <h1 className="text-xl font-bold">Order tracking</h1>

      {authError && (
        <div className="card space-y-3 border-red-200 bg-red-50">
          <p className="text-sm text-red-700">{authError}</p>
          <label className="block space-y-1">
            <span className="text-xs text-gray-600">Order email</span>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="btn-outline w-full"
            onClick={() => loadOrder(email)}
          >
            Verify email
          </button>
        </div>
      )}

      {loading && <p className="text-sm text-gray-500">Loading order…</p>}
      {error && !authError && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {order && (
        <>
          <div className="card">
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-lg font-semibold text-secondary">
              {orderStatusLabel(order.status)}
            </p>
            <p className="mt-2 text-sm">
              Total:{" "}
              {formatMoneyFromDecimal(
                order.total_amount,
                order.currency_code,
              )}
            </p>
          </div>

          <div className="card space-y-3">
            <p className="section-label">Progress</p>
            <ol className="space-y-2">
              {ORDER_STATUS_STEPS.map((step, idx) => {
                const done = timelineIdx >= idx;
                const active = timelineIdx === idx;
                return (
                  <li
                    key={step}
                    className={`flex items-center gap-2 text-sm ${
                      done ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        active
                          ? "bg-primary"
                          : done
                            ? "bg-green-500"
                            : "bg-gray-300"
                      }`}
                    />
                    {orderStatusLabel(step)}
                  </li>
                );
              })}
            </ol>
            {(order.status === "cancelled" || order.status === "refunded") && (
              <p className="text-sm font-medium text-red-600">
                {orderStatusLabel(order.status)}
              </p>
            )}
          </div>

          {order.items && order.items.length > 0 && (
            <div className="card space-y-2 text-sm">
              <p className="section-label">Items</p>
              {order.items.map((item) => (
                <div
                  key={`${item.product_id}-${item.quantity}`}
                  className="flex justify-between"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>
                    {formatMoneyFromDecimal(
                      item.line_total,
                      order.currency_code,
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
