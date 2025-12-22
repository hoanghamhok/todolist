---TO DO LIST---

-Công nghệ sử dụng
  Frontend:React.js
  Backend:Nest.js
  Database:PostgreSQL

-Cách cài đặt:

+Chạy backend
  docker compose up -d
  cd backend
  tạo file .env gồm DATABASE_URL
  npm install
  npx prisma migrate dev
  npx prisma generate
  npm run start:dev

+Chạy frontend
  cd frontend
  npm install
  npm run dev
