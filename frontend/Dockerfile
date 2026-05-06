# Sử dụng node image chính thức
FROM node:20-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file package để cài dependencies trước (tối ưu cache)
COPY package*.json ./

# Cài đặt thư viện
RUN npm install

# Copy toàn bộ code frontend
COPY . .

# Mở port 5173 (port mặc định của Vite)
EXPOSE 5173

# Chạy lệnh dev
CMD ["npm", "run", "dev", "--", "--host"]