# Bộ Dữ Liệu Nghiên Cứu Hiện Trường & Bằng Chứng UI Audit (MyVinmec Real App)

> **Mục đích:** Lưu trữ 27 ảnh chụp màn hình thực tế thu thập từ ứng dụng MyVinmec phiên bản sản xuất (v3.0.4.0) trong quá trình nghiên cứu thực địa (Fieldwork Audit).
> **Ý nghĩa:** Cung cấp cơ sở thực nghiệm (Empirical Ground Truth) để trích xuất Design DNA, bảng màu, kiểu chữ, cấu trúc 5 tabs và linh vật Trợ lý sức khỏe AI MIA.

---

## 1. Phân Loại Dữ Liệu Hiện Trường

1. **Giao diện Trang chủ & Menu Dịch vụ (Screenshots 1-3, 12):**
   - Header Teal lượn sóng (`#20A69A`), slogan: *"Chăm sóc bằng tài năng, y đức và sự thấu cảm"*.
   - Khung lưới 12 tiện ích y tế nổi (`border-radius: 20px`), mục *Cổng dịch vụ khách hàng* và *Sàng lọc sức khỏe*.
2. **Giao diện Trợ lý sức khỏe AI MIA (Screenshots 4-6, 13, 14, 25):**
   - Linh vật 3D phi hành gia nhí vẫy tay chào, huy hiệu trái tim và khiên nhịp tim ECG.
   - Luồng đối thoại: Khung suy nghĩ (*Quá trình suy nghĩ ∨*), trích nguồn (*Vinmec.com*), câu hỏi gợi ý và modal Bottom Sheet khảo sát triệu chứng.
3. **Giao diện Thông báo & Nhắc lịch khám (Screenshots 2, 3, 9, 10):**
   - Định dạng tin nhắn chuẩn Vinmec: Mã y tế PID, giờ khám, chuyên khoa và dặn dò nhịn ăn xét nghiệm.
4. **Giao diện Hồ sơ & Tài khoản cá nhân (Screenshots 7, 8, 11, 27):**
   - Kết nối hồ sơ y tế, thông tin sức khỏe (dị ứng, thói quen sinh hoạt), chính sách bảo vệ dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP.

---

## 2. Quy Chuẩn Đóng Gói Kỹ Thuật

- **Thư mục này (`Asset/`):** Lưu trữ tài nguyên gốc (Raw Audit Evidence) phục vụ nghiệm thu dự án. Đã được đưa vào `.vercelignore` để tránh làm nặng bản build Cloud.
- **Thư mục Web Runtime (`assets/`):** Chứa các tài nguyên đồ họa đã qua xử lý (tách nền trong suốt 100%, nén tối ưu WebP/PNG 12KB) được app web trực tiếp nhúng và hiển thị.
