// import { useState } from 'react';
// import { useAuth } from '../hooks/useAuth';

// const ForgotPasswordPage = () => {
//   const { loading } = useAuth();
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async () => {
//     setError('');
//     setMessage('');

//     try {
//       await forgotPassword(email);
//       setMessage('Đã gửi email khôi phục mật khẩu');
//     } catch (err: any) {
//       setError(err?.message || 'Có lỗi xảy ra');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">
//           Quên mật khẩu
//         </h2>

//         {error && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
//             {error}
//           </div>
//         )}

//         {message && (
//           <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
//             {message}
//           </div>
//         )}

//         <input
//           type="email"
//           placeholder="Nhập email của bạn"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full px-4 py-3 rounded-lg border focus:border-purple-500 outline-none mb-4"
//         />

//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
//         >
//           {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ForgotPasswordPage;
