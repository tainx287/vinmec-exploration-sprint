# Nhật Ký Dùng Thử Ứng Dụng MyVinmec (Heuristic Walkthrough & Usability Audit)

> **Mục tiêu:** Tự mình trải nghiệm thực tế với tư cách một người bệnh thông thường trên ứng dụng MyVinmec (phiên bản cập nhật tháng 10/2026 trên nền tảng iOS / Android) để bóc tách các điểm nghẽn (Frictions), lỗi trải nghiệm (UX Heuristic Violations) và xác định chính xác "Khoảnh khắc của sự thật" (Moment of Truth) đáng giá nhất để can thiệp bằng AI.  
> **Người thực hiện:** Nguyễn Xuân Tài — Cựu học viên K2 (Ứng viên K1–K3 Exploration Sprint)  
> **Thời gian thực hiện:** Tháng 10/2026  
> **Môi trường thử nghiệm:** iPhone 13 Pro (iOS 17.5) & Samsung Galaxy S22 (Android 14)  
> **Tài khoản kiểm thử:** Đăng ký bằng số điện thoại cá nhân thật, định danh người dùng độc lập.

---

## 1. Bảng Tổng Hợp Theo Chuẩn Đề Bài Mục 6.3: "Bạn làm gì – Thấy gì – Vướng ở đâu"

| Nhiệm vụ / Thao tác (Bạn làm gì) | Ghi nhận thực tế trên màn hình (Bạn thấy gì) | Điểm nghẽn & Lỗi trải nghiệm (Bạn vướng ở đâu) | Vi phạm tiêu chuẩn (Heuristic / Cognitive Law) |
| :--- | :--- | :--- | :--- |
| **1. Chọn Chuyên khoa & Tìm Bác sĩ khám** | Mở mục Đặt lịch khám → Chọn chuyên khoa (Ngoại Cơ xương khớp) → Màn hình hiện danh sách bác sĩ nhưng không có chỉ dẫn ngày nào bác sĩ có lịch trống. | Khi bấm tiếp tục mà chưa chọn bác sĩ, hệ thống báo lỗi đỏ nhưng **không chỉ rõ nguyên nhân**. Phải bấm thủ công vào từng bác sĩ để dò xem ai còn slot (bác sĩ 1, 2 kín lịch, đến bác sĩ thứ 3 mới thấy có giờ). | ⚠️ **Vi phạm Heuristic #9 (Help users recognize and recover from errors):** Phải thử-sai (trial and error) mất thời gian. |
| **2. Chuyển đổi bộ lọc (Tab Switching)** | Đã chọn xong Chuyên khoa và Bác sĩ, bấm sang tab "Triệu chứng" để mô tả thêm cơn đau đầu gối. | Toàn bộ lựa chọn Chuyên khoa và Bác sĩ vừa chọn ở tab trước **bị xóa sạch (State Reset)**. Màn hình quay về trạng thái ban đầu. | ⚠️ **Lỗi quản trị trạng thái (State Loss):** Phá vỡ mô hình tư duy (Mental model); gây ức chế vì mất công thao tác lại. |
| **3. Chọn Khung giờ & Xác nhận đặt khám** | Chọn ngày khám và chọn khung giờ hiển thị sẵn (chấm tròn buổi sáng/chiều) → Bấm nút "Đặt lịch". | Màn hình hiện thông báo Toast đỏ: *"Thông báo: có lỗi xảy ra. Mời bạn thử lại sau"*. Thử lại 3 lần trên các khung giờ khác nhau vẫn gặp lỗi tương tự. | ⚠️ **Lỗi ngoại lệ hệ thống không tường minh (Unhandled System Error):** Bế tắc giao dịch, người dùng phải bỏ app để gọi tổng đài. |
| **4. Trò chuyện với Trợ lý AI gợi ý triệu chứng** | Bấm vào icon Chatbot trên app, gõ: *"Tôi bị đau khớp gối sau khi đá bóng, cần khám gì?"*. | AI liên tục hỏi dồn dập các câu hỏi mở về các triệu chứng phụ vòng vo. Màn hình **không có nút "Bỏ qua" (Skip / Escape Hatch)** để thoát ra đặt lịch ngay. | ⚠️ **Vi phạm Heuristic #3 (User control and freedom):** Bẫy hội thoại không lối thoát (Conversational Lock-in); làm chậm nhu cầu khẩn cấp. |
| **5. Nhận thông báo & Mở xem kết quả cận lâm sàng** *(Khoảnh khắc trọng tâm)* | Điện thoại rung có push notification: *"Bạn có kết quả xét nghiệm mới"*. Bấm vào thông báo để mở xem. | App tải về một file PDF bảng xét nghiệm thô: toàn chữ viết tắt kỹ thuật (`SGOT`, `Creatinine`, `HbA1c`), kèm các ký hiệu cảnh báo đỏ `H` (High) / `L` (Low) mà **không có một dòng chú giải ngôn ngữ đời thường**. | ⚠️ **Information Void & Cyberchondria Trigger:** Người bệnh rơi vào trạng thái hoang mang, sợ hãi tột độ khi thấy chỉ số đỏ, vội vã lên Google tra cứu và tự suy diễn bệnh hiểm nghèo trong lúc ngồi chờ bác sĩ. |
| **6. Xem lại đơn thuốc & dặn dò sau khám** | Vào mục "Hồ sơ sức khỏe" → "Đơn thuốc" sau khi đã khám xong. | Đơn thuốc hiển thị dạng văn bản tĩnh liệt kê tên thuốc hóa dược phức tạp. Thiếu hoàn toàn lời dặn sinh hoạt kiêng cữ và **không có nút đồng bộ lịch tái khám vào Google/Apple Calendar**. | ⚠️ **Đứt gãy chăm sóc sau thăm khám (Post-visit Continuity Breakdown):** Người bệnh dễ quên dặn dò của bác sĩ sau khi rời viện. |

---

## 2. Phân Tích Chi Tiết 3 Điểm Nghẽn Trọng Tử (Critical Friction Deep Dive)

### Điểm nghẽn 1: Bẫy Hội Thoại AI & Thiếu Lối Thoát Khẩn Cấp (Conversational Trap)
* **Thực trạng trên app:** Trợ lý AI hiện tại của MyVinmec cố gắng đóng vai trò như một "bác sĩ hỏi bệnh trực tuyến" bằng cách đặt chuỗi 4–5 câu hỏi phân loại. 
* **Tâm lý người bệnh:** Khi người dùng đang đau đớn hoặc sốt ruột đặt lịch, họ cần **tốc độ và sự định hướng tức thì**, không phải một bài khảo sát trắc nghiệm kéo dài.
* **Hậu quả:** Tỷ lệ bỏ dở luồng đặt lịch (Drop-off rate) cao, người bệnh mất kiên nhẫn.

### Điểm nghẽn 2: Lỗi Quản Trị Trạng Thái (State Persistence Failure)
* **Thực trạng trên app:** App phân chia việc tìm kiếm thành các tab độc lập nhưng không đồng bộ bộ nhớ tạm (Temporary Cache). Việc chuyển tab làm mất dữ liệu đã nhập trước đó.
* **Hậu quả:** Tạo ra cảm giác ứng dụng "thiếu mượt mà", làm giảm niềm tin vào chất lượng dịch vụ công nghệ cao của Vinmec.

### Điểm nghẽn 3: "Khoảng Trống Thông Tin" (Information Void) Tại Màn Hình Kết Quả — *KHOẢNH KHẮC VÀNG CẦN CAN THIỆP*
* **Thực trạng trên app:** MyVinmec làm rất tốt việc số hóa trả kết quả nhanh chóng qua mạng (thay vì phải đứng chờ in giấy). Nhưng chính việc **trả kết quả quá nhanh khi bác sĩ chưa kịp gọi tên** đã tạo ra một khoảng trống chết người:
  1. Người bệnh cầm điện thoại đọc thấy dòng chữ bôi đỏ `Men gan AST: 65 U/L (Cao)`.
  2. Bác sĩ ở phòng khám vẫn đang tiếp bệnh nhân trước, chưa thể gọi vào.
  3. Trong 30–45 phút cô đơn đó, người bệnh mở Google tra cứu → Đọc phải các bài viết giật gân về xơ gan, ung thư gan → Huyết áp và nhịp tim tăng vọt vì hoảng loạn.
* **Kết luận chọn bài toán:** Đây chính là **Khoảnh khắc của sự thật (Moment of Truth)** có biên độ tác động tâm lý lớn nhất và hoàn toàn khả thi để giải quyết triệt để bằng AI Generative có Guardrails an toàn.
