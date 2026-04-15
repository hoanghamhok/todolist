import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const changePassword = useAuth((s) => s.changePassword);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validation
    if (!currentPassword.trim()) {
      setError('Vui lòng nhập mật khẩu hiện tại');
      return;
    }

    if (!newPassword.trim()) {
      setError('Vui lòng nhập mật khẩu mới');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Xác nhận mật khẩu không khớp');
      return;
    }

    if (currentPassword === newPassword) {
      setError('Mật khẩu mới phải khác mật khẩu hiện tại');
      return;
    }

    setLoading(true);

    try {
      await changePassword(currentPassword, newPassword);
      setSuccessMessage('Mật khẩu đã được thay đổi thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 1500);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Có lỗi xảy ra. Vui lòng thử lại.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError(null);
      setSuccessMessage(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 400px;
          width: 90%;
          padding: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-header {
          margin-bottom: 20px;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .modal-body {
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #333;
          margin-bottom: 6px;
        }

        .form-group input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .form-group input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .error-message {
          color: #ef4444;
          font-size: 13px;
          margin-top: 6px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .success-message {
          background-color: #d1fae5;
          border: 1px solid #86efac;
          color: #15803d;
          padding: 12px;
          border-radius: 6px;
          font-size: 13px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .btn {
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .btn-cancel {
          background-color: #f3f4f6;
          color: #333;
          border: 1px solid #e5e7eb;
        }

        .btn-cancel:hover:not(:disabled) {
          background-color: #e5e7eb;
        }

        .btn-primary {
          background-color: #6366f1;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #4f46e5;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading-spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid #f3f4f6;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Đổi mật khẩu</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {successMessage && (
                <div className="success-message">
                  <span>✓</span>
                  <span>{successMessage}</span>
                </div>
              )}

              {error && (
                <div className="error-message">
                  <span>✕</span>
                  <span>{error}</span>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="current-password">Mật khẩu hiện tại</label>
                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={loading}
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-password">Mật khẩu mới</label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  placeholder="Nhập mật khẩu mới"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  placeholder="Xác nhận mật khẩu mới"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-cancel"
                onClick={handleClose}
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner" />
                    {' Đang xử lý...'}
                  </>
                ) : (
                  'Xác nhận'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
