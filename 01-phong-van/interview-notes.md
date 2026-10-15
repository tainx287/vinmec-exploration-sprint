# Nhật Ký Phỏng Vấn & Ghi Chép Hiện Trường (Interview Notes)

> **Ghi chú bảo mật:** Toàn bộ dữ liệu trong tài liệu này đã được ẩn danh theo quy định đạo đức nghiên cứu của VinUni VRIC – Vinmec. Mọi định danh cá nhân được thay thế bằng mã số `P1`, `P2`, `P3`. Không lưu trữ bệnh án, hình ảnh hay chẩn đoán lâm sàng.

---

## 1. Bảng Tổng Hợp Đối Tượng Khảo Sát

| Mã đối tượng | Phân loại người dùng | Kênh / Địa điểm | Ngày thực hiện | Thời lượng | Trạng thái đồng thuận |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`P1`** | Bệnh nhân trẻ (26t, Nhân viên văn phòng, Khám tổng quát định kỳ) | Trực tiếp tại quán cafe gần viện | 15/10/2026 | 35 phút | Đã đồng thuận (Bằng văn bản) |
| **`P2`** | Người chăm sóc (42t, Quản lý tài chính, Đưa mẹ 68t đi khám nội tiết) | Google Meet | 16/10/2026 | 42 phút | Đã đồng thuận (Bằng âm thanh) |
| **`P3`** | Bệnh nhân ngoại trú (34t, Kỹ sư IT, Tái khám tiêu hóa sau 1 tháng) | Điện thoại trực tiếp | 16/10/2026 | 32 phút | Đã đồng thuận (Bằng âm thanh) |

---

## 2. Ghi Chép Dùng Thử Ứng Dụng MyVinmec Của Ứng Viên (Self-Heuristic Audit)

*Trước khi phỏng vấn người dùng, ứng viên Nguyễn Xuân Tài (K2) trực tiếp tải, đăng ký tài khoản và thực hiện bài kiểm tra khả năng sử dụng (Heuristic Walkthrough) trên ứng dụng MyVinmec thực tế (phiên bản cập nhật tháng 10/2026 trên iOS/Android). Ghi nhận các điểm nghẽn trải nghiệm thực tế như sau:*

### 2.1. Kiểm thử luồng Đặt lịch khám & Tương tác Trợ lý AI (Booking & Conversational Flow)

| Thao tác kiểm thử (Task) | Kỳ vọng của người dùng | Thực tế quan sát được trên app | Phân tích điểm nghẽn kỹ thuật & UX (Friction / Heuristic Violation) |
| :--- | :--- | :--- | :--- |
| **Chọn Chuyên khoa & Bác sĩ** | Chọn chuyên khoa trước, hệ thống tự động lọc ra danh sách bác sĩ có lịch trống phù hợp với ngày mong muốn. | Khi chỉ chọn chuyên khoa mà chưa chọn bác sĩ, hệ thống báo lỗi nhưng **không chỉ rõ nguyên nhân hoặc highlight trường thông tin bắt buộc**. Chỉ khi ấn vào từng bác sĩ cụ thể mới biết bác sĩ đó có trống lịch vào ngày đã chọn hay không (ví dụ: hai bác sĩ nam đầu danh sách đều kín lịch vào Thứ Hai, chuyển sang bác sĩ nữ mới thấy hiển thị bảng khung giờ). | ⚠️ **Vi phạm Heuristic #9 (Help users recognize and recover from errors):** Thông báo lỗi mơ hồ, thiếu chỉ dẫn phục hồi lỗi; người dùng phải thao tác thử-sai (trial and error) để tìm bác sĩ còn lịch. |
| **Chuyển đổi tiêu chí phân loại (Tab Switching)** | Tab "Chuyên khoa", "Bác sĩ" và "Triệu chứng" đóng vai trò là các bộ lọc bổ trợ (Faceted filters) giúp thu hẹp phạm vi tìm kiếm. | Sau khi đã chọn xong Chuyên khoa và Bác sĩ, người dùng chuyển sang tab "Triệu chứng" để bổ sung thông tin thì hệ thống **tự động xóa sạch (State Reset)** toàn bộ các lựa chọn đã thiết lập trước đó. | ⚠️ **Lỗi quản lý trạng thái giao diện (State Loss):** Mental model của người dùng bị phá vỡ; gây mất công sức thao tác và gia tăng cảm giác ức chế khi bị buộc phải chọn lại từ đầu. |
| **Xác nhận Khung giờ khám (Time Slot Selection)** | Chọn khung giờ còn trống (sáng/chiều) và bấm "Đặt lịch" để chuyển sang bước thanh toán/xác nhận thông tin. | Dù đã chọn mốc thời gian hiển thị sẵn trên màn hình (đã chọn dot sáng/chiều), khi bấm "Đặt lịch", hệ thống liên tục xuất thông báo lỗi dạng Toast: *"Thông báo: có lỗi xảy ra. Mời bạn thử lại sau"*. Thao tác thử trên nhiều mốc thời gian khác nhau vẫn gặp lỗi tương tự, dẫn đến không thể hoàn tất giao dịch đặt khám. | ⚠️ **Lỗi ngoại lệ hệ thống không tường minh (Unhandled System Error):** Lỗi kết nối hoặc đồng bộ lịch khám giữa client và backend/HIS không được thông báo rõ nguyên nhân (do mạng, do hết slot, hay lỗi tài khoản), khiến giao dịch bị tắc nghẽn hoàn toàn. |
| **Tương tác với Trợ lý AI tư vấn triệu chứng** | Người dùng mô tả triệu chứng ban đầu để AI gợi ý định hướng chuyên khoa phù hợp nhằm đặt lịch nhanh. | AI liên tục đặt nhiều câu hỏi mở đào sâu vào các triệu chứng phụ khác một cách vòng vo; đặc biệt **giao diện không cung cấp nút "Bỏ qua" (Skip / Escape Hatch)** để người dùng chủ động ngắt đoạn hội thoại và quay lại đặt lịch thủ công. | ⚠️ **Vi phạm Heuristic #3 (User control and freedom):** Bẫy hội thoại không lối thoát (Conversational Lock-in); làm kéo dài thời gian tác vụ không cần thiết khi người dùng đang có nhu cầu đặt khám khẩn trương. |

### 2.2. Kiểm thử luồng Xem Hồ sơ & Kết quả Cận lâm sàng (Results & Post-visit Flow)

| Thao tác kiểm thử (Task) | Kỳ vọng của người dùng | Thực tế quan sát được trên app | Phân tích điểm nghẽn kỹ thuật & UX |
| :--- | :--- | :--- | :--- |
| **Xem bảng kết quả xét nghiệm** | Mở xem kết quả nhanh chóng, có chú giải dễ hiểu để nắm bắt tình trạng sức khỏe ban đầu trước giờ gặp bác sĩ. | Kết quả trả về dưới dạng file scan PDF hoặc bảng dữ liệu phòng lab với nhiều ký hiệu viết tắt kỹ thuật (`SGOT`, `Creatinine`, `HbA1c`), kèm chỉ số bôi đỏ `H`/`L` mà không có lớp diễn giải ngôn ngữ đời thường. | ⚠️ **Rào cản thuật ngữ y khoa & Vùng trũng lo âu:** Người bệnh dễ rơi vào tình trạng hoang mang và tự tra cứu trên mạng, đẩy tâm lý lo lắng lên cao trong thời gian chờ đợi (chủ đề trọng tâm của đề án). |
| **Theo dõi đơn thuốc & Dặn dò** | Dễ dàng xem lại phác đồ, nhắc giờ uống thuốc và đặt hẹn tái khám một chạm trực tiếp từ đơn thuốc. | Đơn thuốc hiển thị dạng văn bản tĩnh; thiếu tích hợp lời dặn dò sinh hoạt cụ thể và chưa có tính năng đồng bộ lịch tái khám vào điện thoại. | ⚠️ **Đứt gãy chăm sóc sau thăm khám:** Người bệnh dễ quên dặn dò của bác sĩ sau khi rời viện. |

---

## 3. Biên Bản Chi Tiết Các Cuộc Phỏng Vấn

### 3.1. Cuộc phỏng vấn P1 — Người trẻ khám định kỳ

* **Bối cảnh:** Đi khám sức khỏe tổng quát cá nhân tại cơ sở y tế tư nhân cao cấp cách đây 2 tuần. Tự thao tác app từ đầu đến cuối.
* **Hành vi quan sát được:** Rất quen thuộc với công nghệ số, mong muốn mọi thứ tự động và không phải xếp hàng hỏi nhân viên lễ tân.
* **Trích dẫn tiêu biểu (Verbatim Quotes):**
  > *"Em nhận được thông báo 'Đã có kết quả xét nghiệm' trên điện thoại lúc đang ngồi ở quán cafe tầng 1. Em mở ra xem thì thấy một bảng PDF dài dằng dặc, toàn tên viết tắt tiếng Anh và chỉ số `H` (High) màu đỏ. Em giật mình không biết có bị sao nặng không, vội vàng lên Google gõ chữ viết tắt đó thì ra một đống bài viết về ung thư và suy nội tạng, làm em hoang mang tột độ suốt 45 phút ngồi chờ quay lại phòng bác sĩ."*  
  > *"Ước gì app có một dòng giải thích ngắn gọn: 'Chỉ số này hơi cao nhẹ do chế độ ăn, không phải tình huống khẩn cấp, hãy bình tĩnh trao đổi với bác sĩ ở bước tiếp theo' thì em đã không bị stress đến thế."*
* **Cảm xúc xuyên suốt:** Tự tin lúc đặt lịch → Bối rối và lo lắng tột độ khi đọc bảng kết quả → Thở phào nhẹ nhõm sau khi nghe bác sĩ giải thích chỉ là thiếu nước nhẹ.
* **Điểm đau cốt lõi:** Hiện tượng "Google Anxiety" do app ném ra dữ liệu thô (raw data) mà không có lớp đệm thông tin thân thiện cho người dùng phổ thông.

---

### 3.2. Cuộc phỏng vấn P2 — Người chăm sóc đưa người thân đi khám

* **Bối cảnh:** Đưa mẹ lớn tuổi đi kiểm tra sức khỏe và làm xét nghiệm máu liên hoàn. P2 là người cầm điện thoại cài app và quản lý hồ sơ cho mẹ.
* **Hành vi quan sát được:** Vừa phải di chuyển dìu mẹ, vừa phải nhìn màn hình điện thoại, tay xách túi hồ sơ giấy; chịu áp lực thời gian lớn.
* **Trích dẫn tiêu biểu (Verbatim Quotes):**
  > *"Mẹ mình lớn tuổi nên đi lại chậm, mình thì mắt nhìn điện thoại xem có kết quả chưa, tai thì căng ra nghe loa gọi tên. Khi app báo có kết quả, mình bấm vào xem thì không biết là đã đủ hết các xét nghiệm chưa hay mới chỉ có 1 trong 3 cái. Mình không biết nên đưa mẹ lên lại tầng 3 gặp bác sĩ ngay hay phải ngồi chờ tiếp ở tầng 2."*  
  > *"Nhiều khi muốn hỏi điều dưỡng ở sảnh nhưng thấy các bạn ấy bận rộn quá, mình ngại hỏi nhiều. Nếu app có trạng thái tiến độ rõ ràng kiểu như đặt xe Grab: 'Đã xong 2/3 xét nghiệm - Dự kiến còn 15 phút - Hãy tiếp tục ngồi chờ tại sảnh B' thì người nhà đỡ khổ biết bao nhiêu."*
* **Cảm xúc xuyên suốt:** Căng thẳng, sốt ruột, cảm giác bất lực vì thiếu thông tin định hướng không gian và thời gian.
* **Điểm đau cốt lõi:** Thiếu sự minh bạch về tiến trình xét nghiệm liên hoàn và khoảng trống chỉ dẫn di chuyển (Navigation & Progress Blindness).

---

### 3.3. Cuộc phỏng vấn P3 — Bệnh nhân tái khám ngoại trú

* **Bối cảnh:** Tái khám định kỳ sau đợt điều trị ngoại trú. Đã dùng app nhiều lần để theo dõi lịch hẹn và thanh toán viện phí.
* **Hành vi quan sát được:** Tương đối am hiểu quy trình, nhưng gặp khó khăn trong việc ghi nhớ lời dặn của bác sĩ và kết nối giữa kết quả cũ với kết quả mới.
* **Trích dẫn tiêu biểu (Verbatim Quotes):**
  > *"Lúc vào phòng khám, bác sĩ nói rất nhanh vì đông bệnh nhân. Bác bảo kết quả này tốt hơn tháng trước rồi, cứ duy trì đơn thuốc. Nhưng lúc về nhà mở app ra, mình muốn xem lại xem chỉ số của mình tháng này so với tháng trước tăng giảm cụ thể thế nào thì app lại để ở hai file PDF tách rời, không có biểu đồ so sánh xu hướng."*  
  > *"Về nhà mình cũng quên mất là loại thuốc nào uống trước ăn, loại nào sau ăn, gọi lên tổng đài thì máy bận. Mình nghĩ app y tế thông minh là phải giúp người bệnh nhớ được dặn dò và theo dõi được tiến trình sức khỏe của mình sau khi bước chân ra khỏi viện."*
* **Cảm xúc xuyên suốt:** Hài lòng ở khâu thanh toán/đặt hẹn → Hụt hẫng sau khi khám xong vì thông tin dặn dò bị trôi mất.
* **Điểm đau cốt lõi:** Trải nghiệm "đứt gãy sau xuất viện" (Post-visit Abandonment); thiếu công cụ trực quan hóa xu hướng tiến triển và nhắc việc chăm sóc tại nhà.

---

## 4. Tổng Kết Bằng Chứng & Bước Tiếp Theo

Toàn bộ phát hiện từ 3 cuộc phỏng vấn và buổi Heuristic Audit của ứng viên cho thấy:
1. **Dữ liệu thô gây hoang mang:** Người bệnh không thiếu kết quả, họ thiếu **sự diễn giải mang tính trấn an và định hướng**.
2. **Khoảng trống thời gian chờ:** Thời gian từ lúc nhận kết quả trên app đến lúc được bác sĩ giải thích là vùng trũng tâm lý nguy hiểm nhất.
3. **Cơ hội rõ ràng cho AI:** Cần một lớp trợ lý thông tin ngôn ngữ dễ hiểu (Plain Language Layer) giúp người bệnh chuẩn bị sẵn câu hỏi trọng tâm trước khi bước vào phòng bác sĩ.

