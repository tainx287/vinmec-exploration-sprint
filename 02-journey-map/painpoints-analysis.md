# Phân Tích & Ưu Tiên Điểm Đau Cốt Lõi (Pain Points Analysis)

> **Mục tiêu:** Sàng lọc và định lượng các điểm đau phát hiện trong hành trình đi khám để chọn ra đúng **MỘT điểm đau có tác động lớn nhất và khả thi nhất** để giải quyết trong khuôn khổ Exploration Sprint.

---

## 1. Ma Trận Đánh Giá & Ưu Tiên Điểm Đau (Prioritization Matrix)

| Mã | Điểm đau được nhận diện | Tần suất xuất hiện (Frequency) | Mức độ nghiêm trọng tâm lý (Severity) | Khả năng giải quyết bằng AI (Feasibility) | Mức độ ưu tiên tổng thể (Priority) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **P-01** | **Bảng kết quả cận lâm sàng trên MyVinmec chứa nhiều thuật ngữ viết tắt và ký hiệu kỹ thuật khô khan, khiến người bệnh tự tra cứu Google và rơi vào hoảng loạn tâm lý trước giờ gặp bác sĩ.** | **Rất cao (3/3 người phỏng vấn đều gặp)** | **Rất nghiêm trọng (Gây lo âu tột độ, mất niềm tin vào kết quả)** | **Rất cao (LLM xuất sắc trong việc chuyển đổi thuật ngữ chuyên môn sang ngôn ngữ bình dân có kiểm chứng)** | ⭐⭐⭐⭐⭐ **ƯU TIÊN SỐ 1 (Chọn giải quyết)** |
| **P-02** | Người bệnh không nắm được thời gian dự kiến trả kết quả (ước tính còn bao nhiêu phút), gây cảm giác sốt ruột và không dám rời sảnh chờ để nghỉ ngơi. | Cao (2/3 người) | Trung bình (Khó chịu về mặt vận hành, tốn thời gian) | Trung bình (Cần tích hợp sâu vào hệ thống LIS/HIS nội bộ để lấy dữ liệu hàng đợi máy xét nghiệm) | ⭐⭐⭐ (Xếp hàng sau) |
| **P-03** | Thiếu chỉ dẫn hành vi không gian: Sau khi có kết quả, người bệnh không rõ đã đủ hết mẫu chưa và phải di chuyển tiếp về phòng nào để gặp bác sĩ. | Trung bình (1/3 người) | Trung bình (Làm chậm luồng di chuyển của bệnh nhân tại hành lang) | Thấp (Vấn đề này giải quyết bằng Wayfinding UI / SMS định hướng quy trình, không nhất thiết dùng AI) | ⭐⭐ (Không ưu tiên) |
| **P-04** | Người bệnh quên lời dặn dò của bác sĩ sau khi rời viện; không theo dõi được xu hướng biến thiên của các chỉ số qua các lần khám định kỳ. | Cao (2/3 người) | Đáng kể (Ảnh hưởng đến tuân thủ phác đồ dài hạn) | Cao (Personalized Health Agent), nhưng phạm vi quá rộng cho sprint 6 tuần ban đầu. | ⭐⭐⭐⭐ (Định hướng giai đoạn 2) |

---

## 2. Phân Tích Nguyên Nhân Gốc Rễ (5 Whys Analysis) cho Điểm Đau P-01

Áp dụng phương pháp 5 Whys (Năm câu hỏi Tại sao) để đào sâu nguyên nhân căn cốt của Điểm đau P-01:

* **Vấn đề bề mặt:** *Người bệnh cảm thấy cực kỳ hoang mang, sợ hãi khi mở file kết quả xét nghiệm trên ứng dụng MyVinmec.*
  * **Tại sao 1?** Vì trên app hiển thị các bảng chỉ số với nhiều thuật ngữ viết tắt tiếng Anh và các ký hiệu `H` (High), `L` (Low) bôi đỏ mà không có giải thích ý nghĩa.
  * **Tại sao 2?** Vì hệ thống phần mềm bệnh viện hiện tại xuất kết quả trực tiếp từ hệ thống xét nghiệm phòng lab (LIS) dưới dạng biểu mẫu kỹ thuật chuẩn y khoa vốn chỉ thiết kế cho nhân viên y tế đọc.
  * **Tại sao 3?** Vì trước đây bệnh viện xem kết quả là tài liệu bàn giao sau cùng của bác sĩ, chưa tính đến kịch bản bệnh nhân tự cầm điện thoại đọc kết quả trước khi gặp bác sĩ 30–60 phút.
  * **Tại sao 4?** Vì chưa có một "lớp phiên dịch thông tin" (Information Translation Layer) tự động đứng giữa hồ sơ y tế thô và giao diện người dùng để diễn giải ngôn ngữ đời thường an toàn.
  * **Tại sao 5 (Root Cause)?** Bệnh viện chuyển đổi số khâu trả kết quả từ giấy sang app (Digitalization), nhưng **chưa chuyển đổi số trải nghiệm nhận thức của người bệnh (Human-centered Experience)**. Người bệnh được trao dữ liệu nhưng bị bỏ rơi trong sự cô độc nhận thức (Cognitive Isolation).

---

## 3. Quyết Định Lựa Chọn & Phạm Vi Giải Pháp (Scoping Decision)

* **Điểm đau được chọn chính thức:** **P-01 — Khoảng trống lo âu và rào cản thuật ngữ khi người bệnh đọc kết quả xét nghiệm trên MyVinmec.**
* **Ranh giới giải quyết (Boundary & Constraints):**
  * **Giải quyết cái gì:** Cung cấp bản tóm tắt giải thích ý nghĩa thông thường của các chỉ số xét nghiệm phổ biến, so sánh với khoảng chuẩn, giải tỏa tâm lý hoang mang và gợi ý sẵn 2–3 câu hỏi người bệnh nên hỏi bác sĩ.
  * **TUYỆT ĐỐI KHÔNG LÀM GÌ:** Không đưa ra chẩn đoán ("Anh bị bệnh X rồi"), không kê đơn, không khẳng định vô hại nếu chỉ số bất thường nguy cấp.
* **Đầu vào chuyển tiếp:** Điểm đau P-01 sẽ được chuẩn hóa thành **Need Statement theo chuẩn Stanford Biodesign** tại thư mục `03-need-statement/`.
