# Nhật Ký Dùng Thử Ứng Dụng MyVinmec (Heuristic Walkthrough & Usability Audit)

> **Mục tiêu:** Trực tiếp trải nghiệm với tư cách một người dùng thực tế trên ứng dụng MyVinmec để bóc tách các điểm nghẽn (Frictions), lỗi trải nghiệm (UX Heuristic Violations) và xác lập căn cứ thực tiễn cho bài toán thiết kế lại trải nghiệm với AI.  
> **Người thực hiện:** Nguyễn Xuân Tài — Cựu học viên K2 (Ứng viên Forward Deployed Engineer / K4 Coach)  
> **Thời gian thực hiện:** Tháng 10/2026  
> **Thiết bị thử nghiệm:** Tecno Spark 20 (Mã model: KJ5 — Hệ điều hành Android 13)  
> **Tài khoản kiểm thử:** Đăng ký bằng số điện thoại cá nhân chính chủ, định danh độc lập.

---

## 1. Bảng Tổng Hợp Kiểm Thử Trực Tiếp Theo Chuẩn Mục 6.3: "Bạn làm gì – Thấy gì – Vướng ở đâu"

*Dưới đây là các tác vụ thực tế mà ứng viên trực tiếp thao tác trên ứng dụng MyVinmec phiên bản mới nhất cài đặt trên thiết bị Android 13:*

| Tác vụ thực hiện (Bạn làm gì) | Thực tế hiển thị trên màn hình (Bạn thấy gì) | Điểm nghẽn trải nghiệm (Bạn vướng ở đâu) | Vi phạm tiêu chuẩn (Heuristic / Cognitive Law) |
| :--- | :--- | :--- | :--- |
| **1. Tìm Bác sĩ & Chọn Chuyên khoa** | Mở mục "Đặt lịch khám" → Chọn chuyên khoa "Nội tiết" → Màn hình hiện danh sách các bác sĩ nhưng không có ký hiệu ngày nào bác sĩ có lịch trống. | Khi bấm "Tiếp tục" mà chưa chọn bác sĩ, hệ thống báo lỗi đỏ nhưng **không chỉ rõ nguyên nhân**. Phải bấm thủ công vào từng bác sĩ để dò xem ai còn slot trống (bác sĩ 1, 2 kín lịch, đến bác sĩ thứ 3 mới thấy có giờ). | ⚠️ **Vi phạm Heuristic #9 (Help users recognize and recover from errors):** Thiếu chỉ dẫn phục hồi lỗi; buộc người dùng phải thử-sai (trial and error) tốn thời gian. |
| **2. Chuyển đổi tiêu chí lọc (Tab Switching)** | Đã chọn xong Chuyên khoa và Bác sĩ, bấm sang tab "Triệu chứng" để bổ sung mô tả bệnh trạng. | Toàn bộ lựa chọn Chuyên khoa và Bác sĩ vừa thiết lập ở tab trước **bị xóa sạch (State Reset)**. Màn hình tự động quay về trạng thái ban đầu. | ⚠️ **Lỗi quản trị trạng thái (State Loss):** Phá vỡ mô hình tư duy (Mental model); gây ức chế vì mất toàn bộ công sức thao tác trước đó. |
| **3. Trò chuyện với Trợ lý AI tư vấn triệu chứng** | Bấm vào icon Chatbot AI trên app, gõ: *"Tôi bị đau tức vùng ngực và váng đầu, cần khám chuyên khoa nào?"*. | AI liên tục hỏi dồn dập các câu hỏi mở về các triệu chứng phụ. **Giao diện hoàn toàn không có nút "Bỏ qua" (Skip / Escape Hatch)** để người dùng thoát ra đặt lịch thủ công. Khi thử tắt app rồi mở lại, bot vẫn lưu trạng thái kẹt, tiếp tục hiển thị biểu tượng "Thinking" và hỏi lại câu cũ. | ⚠️ **Vi phạm Heuristic #3 (User control and freedom):** Bẫy hội thoại không lối thoát (Conversational Lock-in). |
| **4. Ép buộc luồng chọn (Forced Selection Flow)** | Cố gắng vượt qua bẫy hội thoại để vào màn hình đặt khám. | Người dùng **bắt buộc phải bấm chọn một trong các triệu chứng có sẵn do AI đưa ra** thì hệ thống mới chịu dẫn sang chế độ đặt lịch theo chuyên khoa định sẵn. Người dùng không thể chọn bừa vì sợ đặt sai chuyên khoa và phát sinh chi phí khám không đúng mục đích → Buộc phải thoát hẳn ứng dụng. | ⚠️ **Vi phạm quyền kiểm soát của người dùng:** Ép buộc hành vi (Forced Flow), tước đoạt sự chủ động của người bệnh. |
| **5. Xác nhận khung giờ đặt khám** | Chọn ngày khám và mốc thời gian hiển thị sẵn (chấm tròn sáng/chiều) → Bấm nút "Đặt lịch". | Màn hình xuất hiện thông báo lỗi dạng Toast đỏ: *"Thông báo: có lỗi xảy ra. Mời bạn thử lại sau"*. Thử lại trên các khung giờ khác vẫn gặp lỗi tương tự mà không rõ lý do (do mạng, do hết chỗ hay lỗi tài khoản). | ⚠️ **Lỗi ngoại lệ hệ thống không tường minh (Unhandled System Error):** Tắc nghẽn giao dịch, người dùng phải bỏ app để gọi tổng đài. |

---

## 2. Nghiên Cứu Tính Năng Số Hóa Kết Quả Cận Lâm Sàng Trên MyVinmec (Desk Research & Feature Audit)

> 💡 **Tính minh bạch thực tế:** Vì đây là tài khoản cá nhân mới tạo nhằm mục đích kiểm thử Heuristic luồng ứng dụng và ứng viên chưa từng điều trị bệnh lý tại Vinmec, tài khoản kiểm thử **chưa có lịch sử kết quả xét nghiệm hay đơn thuốc cá nhân thật**. Cơ sở để xác lập khoảnh khắc đào sâu được phân tích dựa trên 3 bằng chứng khách quan:

### 2.1. Bằng chứng số hóa kết quả cận lâm sàng của Vinmec
* **Hạ tầng EMR & JCI của Vinmec:** Vinmec là hệ thống y tế tư nhân tiên phong tại Việt Nam đạt chuẩn JCI và triển khai Bệnh án điện tử (EMR) tích hợp hệ thống quản lý phòng xét nghiệm (LIS) và hệ thống lưu trữ chẩn đoán hình ảnh (PACS). Mọi kết quả cận lâm sàng (xét nghiệm máu, sinh hóa, X-quang, MRI) sau khi được bác sĩ phê duyệt đều được tự động đồng bộ (Sync) lên ứng dụng MyVinmec dưới dạng bản điện tử (PDF có chữ ký số hoặc bảng dữ liệu).
* **Kiểm tra giao diện mục "Hồ sơ sức khỏe" trên app:** Ứng dụng MyVinmec đã xây dựng sẵn các module riêng biệt: *"Kết quả cận lâm sàng"*, *"Lịch sử khám"*, *"Đơn thuốc điện tử"*, chứng minh đây là tính năng cốt lõi đang phục vụ người bệnh.
* **Định hướng từ đề bài tuyển chọn:** Mục 6.1 của Đề bài Exploration Sprint do VinUni VRIC & Vinmec ban hành đã nêu rõ danh mục các khoảnh khắc trọng tâm: *"Chọn MỘT khoảnh khắc trong hành trình đi khám để đào sâu: đặt lịch, check-in, chờ, nhận kết quả, hoặc tái khám"*.

### 2.2. Nghịch lý của việc số hóa kết quả cận lâm sàng (The Digital Result Paradox)
* **Quy trình tại các bệnh viện truyền thống (Khảo sát từ P1, P2, P3):** Người bệnh sau khi lấy mẫu phải ngồi chờ 30–60 phút để nhận tờ giấy in A4 kết quả, cầm tờ giấy đọc không hiểu và ngồi chờ bác sĩ gọi tên trong tâm trạng bất an.
* **Khi Vinmec đưa kết quả lên ứng dụng MyVinmec:**
  - *Điểm ưu việt:* Người bệnh không phải đứng xếp hàng chờ lấy giấy A4, kết quả gửi thẳng về máy ngay khi phòng xét nghiệm hoàn tất.
  - *Điểm đau mới xuất hiện (The New Pain Point):* Việc trả kết quả sớm **trước khi bác sĩ gọi vào phòng tư vấn** tạo ra một **"Khoảng trống thông tin" (Information Void)** kéo dài từ 30 đến 45 phút.
  - Người bệnh mở app ra thấy các dòng chữ viết tắt chuyên môn y khoa phức tạp (`SGOT`, `Creatinine`, `HbA1c`), kèm các chỉ số bôi đỏ `H` (High) hoặc `L` (Low) mà không hề có ngữ cảnh giải thích đời thường.
  - **Hành vi bộc phát nguy hiểm:** Ngay trên chính chiếc điện thoại đang mở app, người bệnh lập tức mở Google hoặc các hội nhóm trên mạng để tự tra cứu → Kích hoạt hội chứng **Cyberchondria** (tự chẩn đoán thảm họa) và lo âu cực độ (**Scanxiety**) trước khi bước vào phòng gặp bác sĩ.

---

## 3. Kết Luận: Lý Do Lựa Chọn Khoảnh Khắc "Đọc Hiểu Kết Quả Cận Lâm Sàng & Chờ Bác Sĩ"

1. **Khắc phục điểm yếu của Trợ lý AI hiện tại:** Trợ lý MyVinmec hiện tại chỉ tập trung vào khâu hỏi bệnh vòng vo trước khám (vốn dễ gây bực mình và tắc nghẽn). 
2. **Khai phá khoảng trống giá trị cao nhất:** Chưa có tính năng AI nào trên app hỗ trợ người bệnh tại thời điểm nhạy cảm nhất: **Sau khi có kết quả cận lâm sàng và trong lúc chờ bác sĩ gọi tên**.
3. **Giá trị kép cho Bệnh viện:** Một trợ lý AI giải thích ngôn ngữ dễ hiểu kèm gợi ý câu hỏi cho bác sĩ (MyVinmec Care Navigator) sẽ giúp hóa giải lo âu cho người bệnh, đồng thời tiết kiệm 5–7 phút giải thích hiểu lầm cho bác sĩ mỗi ca khám, nâng cao chất lượng dịch vụ chuẩn quốc tế của Vinmec.
