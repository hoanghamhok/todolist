import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // State cho form đăng nhập
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  
  // State cho form đăng ký
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // State cho form quên mật khẩu
  const [forgotEmail, setForgotEmail] = useState('');

  // Validate email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Xử lý đăng nhập
  const handleLogin = (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!validateEmail(loginData.email)) {
      setMessage({ text: 'Email không hợp lệ!', type: 'error' });
      return;
    }

    // Lấy danh sách users từ state trong memory
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === loginData.email && u.password === loginData.password);

    if (user) {
      setMessage({ text: `Đăng nhập thành công! Chào mừng ${user.name}`, type: 'success' });
      setTimeout(() => {
        alert('Đăng nhập thành công! (Demo)');
      }, 1000);
    } else {
      setMessage({ text: 'Email hoặc mật khẩu không đúng!', type: 'error' });
    }
  };

  // Xử lý đăng ký
  const handleRegister = (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    // Validation
    if (registerData.name.length < 2) {
      setMessage({ text: 'Tên phải có ít nhất 2 ký tự!', type: 'error' });
      return;
    }

    if (!validateEmail(registerData.email)) {
      setMessage({ text: 'Email không hợp lệ!', type: 'error' });
      return;
    }

    if (registerData.password.length < 6) {
      setMessage({ text: 'Mật khẩu phải có ít nhất 6 ký tự!', type: 'error' });
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setMessage({ text: 'Mật khẩu xác nhận không khớp!', type: 'error' });
      return;
    }

    // Lấy danh sách users
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Kiểm tra email đã tồn tại
    if (users.some(u => u.email === registerData.email)) {
      setMessage({ text: 'Email đã được đăng ký!', type: 'error' });
      return;
    }

    // Thêm user mới
    users.push({
      name: registerData.name,
      email: registerData.email,
      password: registerData.password
    });
    localStorage.setItem('users', JSON.stringify(users));

    setMessage({ text: 'Đăng ký thành công! Vui lòng đăng nhập.', type: 'success' });
    
    // Chuyển sang form đăng nhập sau 2 giây
    setTimeout(() => {
      setActiveTab('login');
      setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
      setMessage({ text: '', type: '' });
    }, 2000);
  };

  // Xử lý quên mật khẩu
  const handleForgotPassword = (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!validateEmail(forgotEmail)) {
      setMessage({ text: 'Email không hợp lệ!', type: 'error' });
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === forgotEmail);

    if (user) {
      setMessage({ text: 'Link đặt lại mật khẩu đã được gửi đến email của bạn!', type: 'success' });
      setTimeout(() => {
        setActiveTab('login');
        setForgotEmail('');
        setMessage({ text: '', type: '' });
      }, 2000);
    } else {
      setMessage({ text: 'Email không tồn tại trong hệ thống!', type: 'error' });
    }
  };

  // Đăng nhập bằng Google (giả lập)
  const handleGoogleLogin = () => {
    setMessage({ text: 'Đang kết nối với Google...', type: 'success' });
    setTimeout(() => {
      alert('Đăng nhập Google thành công! (Demo - cần tích hợp Google OAuth thực tế)');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => { setActiveTab('login'); setMessage({ text: '', type: '' }); }}
            className={`flex-1 py-4 text-center font-semibold transition-all ${
              activeTab === 'login'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            onClick={() => { setActiveTab('register'); setMessage({ text: '', type: '' }); }}
            className={`flex-1 py-4 text-center font-semibold transition-all ${
              activeTab === 'register'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Đăng Ký
          </button>
        </div>

        <div className="p-8">
          {/* Thông báo */}
          {message.text && (
            <div className={`mb-4 p-3 rounded-lg text-sm text-center ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {message.text}
            </div>
          )}

          {/* Form Đăng Nhập */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="Nhập email hoặc username của bạn"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="Nhập mật khẩu"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => { setActiveTab('forgot'); setMessage({ text: '', type: '' }); }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Quên mật khẩu?
                </button>
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Đăng Nhập
              </button>

              {/* Đăng nhập bằng Google */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Hoặc</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Đăng nhập với Google
              </button>
            </div>
          )}

          {/* Form Đăng Ký */}
          {activeTab === 'register' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="Nhập họ và tên"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="Nhập email của bạn"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="Nhập lại mật khẩu"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleRegister}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Đăng Ký
              </button>
            </div>
          )}

          {/* Form Quên Mật Khẩu */}
          {activeTab === 'forgot' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Quên Mật Khẩu?</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Nhập email của bạn và chúng tôi sẽ gửi cho bạn một mã xác nhận
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="Nhập email của bạn"
                  />
                </div>
              </div>

              <button
                onClick={handleForgotPassword}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Gửi mã xác nhận
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('login'); setMessage({ text: '', type: '' }); }}
                className="w-full text-blue-600 hover:text-blue-800 py-2 font-medium"
              >
                ← Quay lại Đăng Nhập
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}