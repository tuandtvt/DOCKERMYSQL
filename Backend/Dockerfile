FROM node:14

# Cài đặt các gói phụ thuộc cần thiết để build canvas
RUN apt-get update && apt-get install -y \
  build-essential \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  librsvg2-dev

# Tạo thư mục làm việc
WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json (nếu có) vào thư mục làm việc
COPY package*.json ./

# Xóa thư mục node_modules và file package-lock.json nếu có
RUN rm -rf node_modules package-lock.json

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép phần còn lại của mã nguồn vào thư mục làm việc
COPY . .

# Build lại module canvas
RUN npm rebuild canvas

# Mở cổng 8080
EXPOSE 8080

# Chạy ứng dụng
CMD ["npm", "start"]
