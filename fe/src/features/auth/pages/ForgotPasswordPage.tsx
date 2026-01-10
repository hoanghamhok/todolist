import { useState } from "react";
import type { ForgotPasswordRequest, ForgotPasswordResponse } from "../type";
import { authApi } from "../auth.api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forgotPassword = async (payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    setLoading(true);
    setError(null);
    try {
        const res = await authApi.forgotPassword(payload);
        return res.data;
    } catch (err) {
        setError("Gửi email thất bại");
        throw err;
    } finally {
        setLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await forgotPassword({ email });
        alert(res.message);
    } catch {
    }
  } ;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Quên mật khẩu
        </h1>

        <p className="text-sm text-gray-500 text-center mt-2">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu
        </p>

        {success ? (
          <div className="mt-6 text-green-600 text-center text-sm">
            ✅ Nếu email tồn tại, chúng tôi đã gửi liên kết đặt lại mật khẩu.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-2 text-white font-semibold
                         hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <a
            href="/auth"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Quay lại đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
}
