import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const user = useAuth((s) => s.user);
  const updateProfile = useAuth((s) => s.updateProfile);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateProfile({ fullName, email });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ep-modal-overlay" onClick={onClose}>
      <div className="ep-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ep-modal__header">
          <h2 className="ep-modal__title">Chỉnh sửa hồ sơ</h2>
          <button className="ep-modal__close" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="ep-modal__form">
          {error && <div className="ep-modal__error">{error}</div>}
          
          <div className="ep-modal__field">
            <label htmlFor="fullName">Họ và tên</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ và tên"
              required
            />
          </div>

          <div className="ep-modal__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
              required
            />
          </div>

          <div className="ep-modal__actions">
            <button type="button" className="ep-modal__btn ep-modal__btn--cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="ep-modal__btn ep-modal__btn--submit" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .ep-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: ep-fade-in 0.2s ease-out;
        }

        .ep-modal {
          background: white;
          width: 100%;
          max-width: 400px;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          animation: ep-slide-up 0.3s ease-out;
        }

        .ep-modal__header {
          padding: 1.5rem;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ep-modal__title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .ep-modal__close {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #9ca3af;
          cursor: pointer;
          padding: 0.5rem;
          line-height: 1;
        }

        .ep-modal__form {
          padding: 1.5rem;
        }

        .ep-modal__error {
          background: #fef2f2;
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .ep-modal__field {
          margin-bottom: 1.25rem;
        }

        .ep-modal__field label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .ep-modal__field input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }

        .ep-modal__field input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .ep-modal__actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 2rem;
        }

        .ep-modal__btn {
          padding: 0.625rem 1.25rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .ep-modal__btn--cancel {
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          color: #374151;
        }

        .ep-modal__btn--cancel:hover {
          background: #e5e7eb;
        }

        .ep-modal__btn--submit {
          background: #6366f1;
          border: 1px solid #6366f1;
          color: white;
        }

        .ep-modal__btn--submit:hover {
          background: #4f46e5;
        }

        .ep-modal__btn--submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @keyframes ep-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes ep-slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @media (prefers-color-scheme: dark) {
          .ep-modal {
            background: #1f2937;
          }
          .ep-modal__header {
            border-bottom-color: #374151;
          }
          .ep-modal__title {
            color: #f3f4f6;
          }
          .ep-modal__field label {
            color: #d1d5db;
          }
          .ep-modal__field input {
            background: #374151;
            border-color: #4b5563;
            color: white;
          }
          .ep-modal__btn--cancel {
            background: #374151;
            border-color: #4b5563;
            color: #d1d5db;
          }
          .ep-modal__btn--cancel:hover {
            background: #4b5563;
          }
        }
      `}</style>
    </div>
  );
};
