# Đề Cương Bài Thuyết Trình 10 Slide (Slides Outline Deck)

> **Mục đích:** Bản tóm tắt chiến lược cho buổi trình bày 10 phút trước Hội đồng Tuyển chọn VinUni VRIC – Vinmec (kèm 20 phút phỏng vấn có cấu trúc).  
> **Quy chuẩn:** Đúng 10 slide tối đa theo quy định tại Mục 6.0 & 6.3 của đề bài. Mạch kể chuyện (Storytelling) mạch lạc từ Vấn đề → Nghiên cứu → Need Statement → Prototype → An toàn → Năng lực Dẫn dắt K4.

---

## Slide 1: Trang Bìa & Tuyên Bố Sứ Mệnh (Title & Mission Statement)
* **Tiêu đề:** Tái Thiết Kế Trải Nghiệm Đọc Hiểu Kết Quả Xét Nghiệm Với AI Trên MyVinmec
* **Người trình bày:** Nguyễn Xuân Tài — Cựu học viên K2 (Lab Coach / Technical Lead & K4 Coach)
* **Thông điệp cốt lõi (One-liner):** Chuyển đổi "vùng trũng lo âu" 45 phút chờ đợi thành khoảng thời gian người bệnh được trao quyền hiểu biết và chuẩn bị sẵn sàng cho cuộc gặp bác sĩ.
* **Thời lượng trình bày:** 0:45 phút.

---

## Slide 2: Bối Cảnh & Điểm Nghẽn Trên MyVinmec (Context & Heuristic Audit)
* **Tiêu đề:** Khoảnh Khắc Của Sự Thật: "Information Void" & Nỗi Lo Khi Đọc Kết Quả Xét Nghiệm
* **Nội dung trọng tâm:**
  * Khảo sát ứng dụng MyVinmec: Chuyển đổi số rất tốt khâu đặt lịch và trả trực tiếp kết quả về điện thoại.
  * Nghịch lý số hóa: Trả kết quả sớm nhưng vô tình đẩy người bệnh vào **"Khoảng trống thông tin" (Information Void)** trong 45 phút chờ đến lượt Bác sĩ gọi tên.
  * Kích hoạt hội chứng y khoa **"Scanxiety"** *(Scan + Anxiety)*: Người bệnh lo âu suy diễn (**Catastrophizing**) và hơn 80% rơi vào cơn hoảng loạn **"Cyberchondria"** (lo âu sức khỏe do tự chẩn đoán sai trên Google) khi thấy các chỉ số bôi đỏ `H`/`L` hoặc chữ viết tắt y khoa.
* **Hình ảnh/Trực quan:** Ảnh chụp màn hình ứng dụng MyVinmec thật với các chỉ số viết tắt bôi đỏ `AST`, `ALT`, `HbA1c` đối lập với ảnh người bệnh chờ đợi.
* **Thời lượng trình bày:** 1:00 phút.

---

## Slide 3: Lắng Nghe Tiếng Nói Người Bệnh (3 In-depth Interviews)
* **Tiêu đề:** Phỏng Vấn Sâu 3 Người Quen Từng Đi Khám Bệnh Thực Tế (The Mom Test)
* **Nội dung trọng tâm:**
  * **P1 (Anh M.N. - 32t, Cựu quân nhân, khám gối & Chụp MRI):** *"Cầm kết quả và phim chụp trên tay mà nhiều từ chuyên môn quá không hiểu gì, ngồi chờ lâu càng sốt ruột. Mình phải liên tục mở điện thoại tra Google và hỏi AI để đỡ hoang mang."* → Điểm nghẽn: Khoảng trống thông tin khi chờ đợi & Rất cần được giải thích kết quả dễ hiểu.
  * **P2 (Anh T.H. - 28t, Sĩ quan Hậu cần Hải quân, khám định kỳ theo đơn vị):** *"Phòng khám rất đông, người khám sau đứng ngay cửa thúc ép. Bác sĩ bận rộn nên mình ngại hỏi thêm về mấy chỉ số tăng nhẹ, thôi cầm giấy đi ra luôn."* → Điểm nghẽn: Thời gian gặp Bác sĩ ngắn & Ngại hỏi nếu chưa chuẩn bị sẵn câu hỏi.
  * **P3 (Anh V.D. - 29t, Kỹ sư FDI Hàn Quốc, khám sức khỏe công ty):** *"Sau khi lấy máu xong không biết phòng tiếp theo ở đâu, cứ nghĩ phải đi đúng theo thứ tự trên phiếu nên đi lòng vòng tìm kiếm mất thời gian."* → Điểm nghẽn: Bẫy tuần tự & Lúng túng di chuyển giữa các phòng cận lâm sàng.
* **Hình ảnh/Trực quan:** Dải ảnh chân dung kèm 3 thẻ trích dẫn nguyên văn bằng chứng thực tế.
* **Thời lượng trình bày:** 1:00 phút.

---

## Slide 4: Bản Đồ Hành Trình & Tam Giác Tác Động (Journey Map & Impact Triangle)
* **Tiêu đề:** Đỉnh Điểm Lo Âu & Tam Giác Tác Động: Bệnh Nhân – Bác Sĩ – Bệnh Viện
* **Nội dung trọng tâm:**
  * Biểu đồ đường cong cảm xúc (Emotion Curve): Trạng thái tinh thần rơi tự do từ lúc app báo "Đã có kết quả" đến trước khi bước vào phòng khám.
  * **Tam giác tác động 3 bên do Information Void gây ra:**
    * **Người bệnh:** Rơi vào trạng thái phòng thủ (*Fight-or-Flight*), tê liệt nhận thức (**Cognitive Overload**), nhiễu loạn sinh hiệu (huyết áp/nhịp tim tăng do stress).
    * **Bác sĩ:** Lãng phí **7–10 phút đầu của ca khám** chỉ để "dọn dẹp hiểu lầm" bệnh nhân tự đọc trên mạng, tăng nguy cơ kiệt sức (**Doctor Burnout**).
    * **Bệnh viện Vinmec:** Giảm tốc độ luân chuyển bệnh nhân (**Patient Throughput**) và đứt gãy cảm giác được chăm sóc (**Care Continuity**).
* **Hình ảnh/Trực quan:** Sơ đồ Journey Map với vùng đánh dấu đỏ rực tại Pha 3 & 4 kèm biểu đồ Tam Giác Tác Động 3 bên.
* **Thời lượng trình bày:** 1:00 phút.

---

## Slide 5: Tuyên Bố Nhu Cầu Chuẩn Stanford Biodesign (Need Statement)
* **Tiêu đề:** Định Nghĩa Đúng Nhu Cầu Cốt Lõi — Không Thiên Kiến Giải Pháp
* **Nội dung trọng tâm:**
  * **Tuyên bố Biodesign:** *"Một cách để hóa giải hội chứng 'Scanxiety', giảm thiểu hoang mang lo âu và nâng cao khả năng chủ động hiểu biết về tình trạng sức khỏe cho người bệnh ngoại trú đang gặp khó khăn trong việc đọc hiểu các chỉ số kỹ thuật trên bảng kết quả cận lâm sàng trong khoảng thời gian chờ tư vấn trực tiếp với bác sĩ tại bệnh viện."*
  * **Định vị cốt lõi:** Thiết lập **"Bước đệm giảm xóc tâm lý" (Psychological Shock-absorber)** và **"Lớp phiên dịch thông tin phi lâm sàng"** dọn dẹp tâm trí người bệnh; 100% không chẩn đoán thay bác sĩ.
  * **Chỉ số đo lường kép:** Giảm 80% lo âu người bệnh + Tiết kiệm 5–8 phút giải thích hiểu lầm cho bác sĩ mỗi ca khám (**Consultation Efficiency**).
* **Hình ảnh/Trực quan:** Bảng phân tách 4 thành tố: Problem – Population – Outcome – Context.
* **Thời lượng trình bày:** 1:00 phút.

---

## Slide 6: Bài Học Từ Mô Hình Y Tế Số Hàng Đầu Thế Giới (International Benchmarks)
* **Tiêu đề:** Học Hỏi Quốc Tế & Điều Chỉnh Cho Hệ Thống Y Tế Vinmec
* **Nội dung trọng tâm:**
  * **Mayo Clinic (Mỹ):** Plain Language Translation giảm 150% tin nhắn quá tải cho bác sĩ.
  * **Cleveland Clinic / Epic MyChart:** Visual Gauge 3 màu giải tỏa lo âu tức thì.
  * **Ada Health / NHS (Anh):** Red-flag Triage Protocol chuyển tuyến khẩn cấp tức thì.
  * **Áp dụng cho Vinmec:** Kết hợp ngôn ngữ bình dân + Gợi ý 2 câu hỏi hỏi Bác sĩ + Rào chắn an toàn tuyệt đối.
* **Hình ảnh/Trực quan:** Bảng so sánh 3 cột mô hình quốc tế.
* **Thời lượng trình bày:** 1:00 phút.

---

## Slide 7: Giải Pháp Prototype: MyVinmec Care Navigator (AI Solution Architecture)
* **Tiêu đề:** Trợ Lý Đồng Hành Ngôn Ngữ Dễ Hiểu Với 5 Lớp Rào Chắn An Toàn
* **Nội dung trọng tâm:**
  * Định vị: Công cụ giao tiếp phi lâm sàng, không chẩn đoán, không kê đơn.
  * Cấu trúc đầu ra 3 phần: Ý nghĩa đời thường → 2 câu hỏi hỏi Bác sĩ → Khuyến cáo giữ bình tĩnh.
  * Cơ chế ngắt khẩn cấp (Hard-Stop) bảo vệ sinh mạng người bệnh trong < 1.0 giây.
* **Hình ảnh/Trực quan:** Kiến trúc Privacy-by-design & Demo giao diện chat trên điện thoại.
* **Thời lượng trình bày:** 1:15 phút.

---

## Slide 8: Kết Quả Thử Nghiệm Người Thật & Chu Kỳ Lặp (User Testing & Iterations)
* **Tiêu đề:** Thử Nghiệm Thực Tế Với 3 Người Dùng — Tối Ưu Hóa Dựa Trên Bằng Chứng
* **Nội dung trọng tâm:**
  * **T1 (Văn bản dài → 3 Bullet points):** Giảm thời gian đọc hiểu từ 95s xuống 28s (giảm 70%).
  * **T2 (Ngăn tự mua thuốc):** Rào chắn từ chối kiên quyết mọi ý định tự điều trị.
  * **T3 (Thử thách khẩn cấp):** Bật màn hình đỏ cấp cứu 115 / Hotline Vinmec chuẩn xác 100%.
  * Đo lường tác động: 100% người dùng tự tin chuẩn bị được câu hỏi cho bác sĩ.
* **Hình ảnh/Trực quan:** Bảng so sánh chỉ số Trước vs Sau (Before & After Matrix).
* **Thời lượng trình bày:** 1:15 phút.

---

## Slide 9: Đạo Đức Y Tế, Nghị Định 13 & An Toàn Người Bệnh (Ethics & Safety)
* **Tiêu đề:** Tuân Thủ Pháp Lý & An Toàn Sinh Mạng Là Giới Hạn Tối Thượng
* **Nội dung trọng tâm:**
  * **Bảo mật dữ liệu:** Tuân thủ Nghị định 13/2023/NĐ-CP; chỉ dùng mock data / sandbox khử định danh 100%; không lưu trữ PII trên cloud công cộng.
  * **Giảm thiểu ảo giác:** Grounding chặt chẽ trên từ điển xét nghiệm chuẩn; Temperature = 0.1.
  * **Chuyển tuyến lâm sàng:** Quy trình kích hoạt Hotline Cấp cứu Vinmec 1900 23 23 89 khi phát hiện dấu hiệu nguy kịch.
* **Hình ảnh/Trực quan:** Sơ đồ quy trình Clinical Escalation Protocol.
* **Thời lượng trình bày:** 0:45 phút.

---

## Slide 10: Năng Lực Dẫn Dắt Nhóm K4 & Cam Kết Đồng Hành (K4 Coaching & Commitment)
* **Tiêu đề:** Sẵn Sàng Đồng Hành Cùng 5–10 Kỹ Sư K4 Đến Tận Demo Day
* **Nội dung trọng tâm:**
  * **Quản trị mốc Sprint:** Đảm bảo Checkpoint Thứ Sáu, Cổng 1, Rà soát Giữa kỳ, Cổng 2 và Demo Day diễn ra đúng chuẩn.
  * **Văn hóa Coach:** Lắng nghe, đặt câu hỏi gợi mở, can thiệp kịp thời khi nhóm over-engineer hoặc bế tắc tìm kiếm người dùng.
  * **Cam kết cá nhân:** Ký NDA, hoàn thành 100% khóa đào tạo Vinmec, giữ trọn vẹn tinh thần chính trực của kỹ sư AI Thực Chiến.
* **Thời lượng trình bày:** 0:45 phút.

