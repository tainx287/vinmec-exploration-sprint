# Kế Hoạch 1 Trang: Dẫn Dắt & Huấn Luyện Nhóm K4 (K4 Coaching Framework)

> **Người thực hiện:** Nguyễn Xuân Tài — Cựu học viên K2 (Lab Coach / Technical Lead)  
> **Vai trò:** K2 Lab Coach / Technical Lead & Forward Deployed Engineer  
> **Quy mô phụ trách:** 1 nhóm từ 5–10 bạn sinh viên Khóa 4 (chia làm 2–3 sub-teams nhỏ)  
> **Mục tiêu tối thượng:** Đảm bảo 100% học viên an toàn đạo đức, đúng tiến độ 6 tuần, vượt qua các Cổng thẩm định của Hội đồng Vinmec và tự tin tỏa sáng tại Demo Day.

---

## 1. Lộ Trình 6 Tuần & Các Mốc Kiểm Soát Then Chốt (Milestones & Gates)

```mermaid
timeline
    title Lộ trình Huấn luyện 6 Tuần Exploration Sprint Vinmec x K4
    Tuần 0 : Đào tạo An toàn & NDA : Kiểm tra đầu vào >= 80% (Bắt buộc 100% mới vào viện)
    Tuần 1 : Nhúng hiện trường & Phỏng vấn : Checkpoint Thứ Sáu 1 : Khảo sát quy trình khoa
    Tuần 2 : Hội tụ bài toán : Cổng 1 (Thứ Sáu) : Need Statement chuẩn Biodesign
    Tuần 3 : Build Prototype nhanh (Mock) : Checkpoint Thứ Sáu 3 : Bác sĩ chọn 1 hướng
    Tuần 4 : Thử nghiệm User Vòng 1 : Rà soát Giữa kỳ (Thứ Sáu) : Report 4 phần
    Tuần 5 : Thử nghiệm User Vòng 2 : Cổng 2 (Thứ Sáu) : Chọn nhóm vào Demo Day
    Tuần 6 : Đóng gói Proposal & Demo : Demo Day / Cổng 3 : Ban Chỉ đạo xét đầu tư
```

| Tuần | Trọng tâm học viên K4 | Vai trò của Coach (K1–K3) | Sản phẩm nghiệm thu (Deliverables) |
| :--- | :--- | :--- | :--- |
| **Tuần 0** | Hoàn thành đào tạo Vinmec, ký NDA, hiểu quy tắc dữ liệu bệnh viện. | Ôn tập, giải đáp thắc mắc, kiểm tra chéo kiến thức bảo mật; chuẩn bị tâm thế vào viện. | 100% học viên đỗ bài test đầu vào ≥ 80%. |
| **Tuần 1** | Đi thực địa cùng bác sĩ/điều dưỡng; ghi chép quan sát hiện trường. | Đi cùng nhóm trong 2 buổi đầu; chuyển giao [Tài liệu phát tay K4 & Ngân hàng câu hỏi](./fieldwork-stakeholder-questions.md), hướng dẫn ghi chú The Mom Test không làm phiền y bác sĩ. | Nhật ký quan sát khoa phòng + Danh sách điểm nghẽn. |
| **Tuần 2** | Hội tụ bài toán, viết Need Statement theo Stanford Biodesign. | **Thử thách gắt gao:** Loại bỏ 100% từ khóa giải pháp công nghệ khỏi Need Statement; chuẩn bị bảo vệ Cổng 1. | **⚑ Cổng 1:** Need Statement được Trưởng khoa phê duyệt. |
| **Tuần 3** | Làm prototype nhanh trên mock data (Streamlit / Figma clickable). | Định hướng kiến trúc tối giản; ngăn nhóm over-engineer; kết nối với bác sĩ lâm sàng để lấy phản hồi sơ bộ. | Prototype chạy được kịch bản cốt lõi trên mock data. |
| **Tuần 4** | Thử nghiệm người dùng vòng 1 (3–5 người Vinmec) + Viết báo cáo. | Giám sát buổi test đầu tiên; hướng dẫn phân tích insight khách quan, không tự bào chữa lỗi thiết kế. | **⚑ Rà soát giữa kỳ:** Báo cáo thử nghiệm 4 phần chuẩn mực. |
| **Tuần 5** | Thử nghiệm vòng 2; hoàn thiện đề xuất giải pháp khả thi. | Huấn luyện kỹ năng thuyết trình, chuẩn bị slide tóm tắt 10 trang; rà soát an toàn AI trước Cổng 2. | **⚑ Cổng 2:** Được chọn vào vòng chung kết Demo Day. |
| **Tuần 6** | Đóng gói mã nguồn, diễn tập Demo Day 10 phút thuyết trình. | Tổ chức 3 buổi Mock Pitching gắt gao; đóng vai Ban Giám khảo phản biện câu hỏi hóc búa. | **⚑ Demo Day / Cổng 3:** Proposal hoàn chỉnh + Live Demo. |

---

## 2. Chiến Lược Khởi Động Đột Phá: Cơ Chế "Red Team vs Blue Team" (48h Kickoff Hackathon Cuối Tuần 0)

Để tránh bẫy "thực thi thụ động" và chống hiện tượng "ăn sẵn" khi nhận bàn giao repo mẫu, Coach áp dụng cơ chế phân vai đối kháng trong 48 giờ cuối tuần đầu tiên (ngay sau khi nhận team và ký NDA vào Thứ Sáu):

```mermaid
flowchart TD
    Repo["Repo Gốc K2 (Baseline Anchor)"] --> Divide["Chia Nhóm Đối Kháng (Tuần 0 - T7/CN)"]
    Divide --> Blue["BLUE TEAM (Builders / Proponents)<br>• Nghiên cứu bảo vệ & mở rộng tính năng<br>• Tối ưu prompt & UX"]
    Divide --> Red["RED TEAM (Challengers / Devil's Advocate)<br>• Phản biện rủi ro đạo đức, bẻ gãy giả định<br>• Tìm kiếm các bài toán thực địa cấp bách hơn"]
    Divide --> Observer["NEUTRAL OBSERVER (Khi nhóm lẻ)<br>• Đóng vai Người bệnh khó tính / Scribe<br>• Lập ma trận đối chiếu lập luận"]
    
    Blue --> Sync["Cập nhật repo mỗi 6 tiếng"]
    Red --> Sync
    Observer --> Sync
    
    Sync --> MonDebate["SÁNG THỨ HAI: Phiên Đối Thoại Nảy Lửa (Preview 90p)<br>Ban Cố Vấn: Coach K2 + Bác sĩ + Quản lý chương trình"]
    MonDebate --> Converge{"Quyết Định Hội Tụ (Convergence)"}
    Converge --> Opt1["Phương án A: Vá lỗ hổng & Hoàn thiện Care Navigator"]
    Converge --> Opt2["Phương án B: Chuyển hướng sang Bài toán mới do Red Team phát hiện"]
    Converge --> Opt3["Phương án C: Tách 2 Sub-teams làm song song để Cổng 1 chọn"]
```

### 2.1. Quy tắc phân chia nhân sự khi gặp số người lẻ (5, 7, 9 người)
* **Nguyên tắc cốt lõi:** **Ưu tiên phe Phản biện (Red Team / Devil's Advocate) đông hơn hoặc bố trí vai trò Trọng tài độc lập.** Con người có xu hướng bám chấp vào giải pháp có sẵn (Confirmation Bias); phản biện một prototype hoàn chỉnh đòi hỏi nhiều công sức bóc tách hơn.
* **Ma trận phân vai linh hoạt:**
  * **Nhóm 5 người:** 2 Blue Team vs 2 Red Team + **1 Neutral User Advocate** (Đóng vai Người bệnh khó tính, chất vấn cả 2 bên và ghi chép ma trận lập luận).
  * **Nhóm 7 người:** 3 Blue Team vs 3 Red Team + **1 Neutral Scribe / Clinical Lead** (Phản chiếu góc nhìn vận hành khoa phòng). *(Hoặc 3 Blue vs 4 Red để tăng sức ép phản biện).*
  * **Nhóm 9 người:** 4 Blue Team vs 5 Red Team.
  * **Nhóm 10 người:** 4 Blue Team vs 4 Red Team + **2 Neutral Evaluators** (1 bạn phụ trách góc nhìn Lâm sàng/Bác sĩ, 1 bạn phụ trách góc nhìn An toàn số/HIS).

### 2.2. Lợi ích sư phạm & Giá trị thực chiến (Chống quan liêu)
* **Tuyệt đối không quan liêu:** Không phải 10 người cùng làm một đầu việc lập trình, mà là **2 trường phái tư duy cùng soi chiếu vào một bài toán y tế thực tế**.
* **Học viên học được gì:**
  1. *Kỹ năng phản biện dựa trên bằng chứng (Evidence-based Thinking):* Bỏ thói quen gật gù theo code có sẵn.
  2. *Mở rộng bài toán (Problem Divergence):* Red Team khi phản biện sẽ phát hiện ra các case study thực tế khác (như bài toán *Live Wayfinding / Điều hướng trạm khám* của P3, hoặc *Giảm tải phòng khám đông* của P2) — tạo thêm phương án dự phòng đắt giá cho Cổng 1.
  3. *Tập dượt trước áp lực chất vấn:* Giúp K4 làm quen với phản biện gắt gao trước khi đối mặt với Bác sĩ Trưởng khoa tại Cổng 1.
* **Hành động sau sáng Thứ Hai:** Hội đồng cùng nhóm đưa ra quyết định hội tụ (Convergence): chốt giữ và tối ưu đề tài, hoặc chuyển hướng sang bài toán mới do Red Team đề xuất, hoặc chia 2 nhánh song song. Chiều Thứ Hai, cả nhóm bước vào bệnh viện với tâm thế thấu suốt và tự tin 100%.

---

## 3. Quy Trình Review Báo Cáo Tuần & Nhịp Làm Việc (Weekly Cadence)

* **Nhịp làm việc cố định hàng tuần:**
  * **Thứ Hai:** Tham gia buổi đào tạo phương pháp của V-RIC cùng nhóm.
  * **Thứ Tư:** Tham gia đào tạo nghiệp vụ bệnh viện của Vinmec; họp nhanh 15 phút giữa tuần giải quyết thắc mắc.
  * **Thứ Sáu 17h00 (Hạn chót thu báo cáo):** Cả nhóm nộp Weekly Report và Báo cáo sau mỗi vòng thử nghiệm người dùng.
  * **Thứ Sáu 19h00 – 20h30 (Checkpoint họp cụm):** Coach chủ trì họp đánh giá tuần, nghiệm thu mốc và giao nhiệm vụ tuần mới.
* **Quy trình phản hồi 3 điểm (P-B-A Feedback Framework):**
  1. **Praise (Khen ngợi nỗ lực cụ thể):** Ghi nhận tiến độ làm việc chăm chỉ và các phát hiện thực tế sắc sảo.
  2. **Bottleneck (Chỉ rõ điểm nghẽn):** Thẳng thắn chỉ ra điểm tài liệu mơ hồ, thiếu bằng chứng hoặc vi phạm ranh giới.
  3. **Action (Hành động sửa đổi):** Giao chính xác 1–2 việc cần vá ngay trong vòng 24 giờ.
* **Chiến lược xử lý trễ hạn (Anti-procrastination Protocol):**
  * Nhắc nhở chủ động trước 4 tiếng (13h00 Thứ Sáu). Nếu sau 17h00 chưa nộp, gọi điện trực tiếp cho Team Lead để nắm lý do và hỗ trợ tháo gỡ khó khăn thay vì chỉ trích.

---

## 4. Chiến Lược Gỡ Rối Khi Nhóm Bế Tắc (Unblocking Strategies)

| Tình huống bế tắc | Dấu hiệu nhận biết | Chiến lược Coach can thiệp ngay lập tức |
| :--- | :--- | :--- |
| **1. Tràn ngập bài toán (Problem Overload)** | Nhóm thấy khoa phòng có hàng chục vấn đề, cãi nhau không biết chọn đề tài nào. | Dùng **Ma trận Impact vs Feasibility**. Buộc nhóm chọn khoảnh khắc hẹp nhất có thể làm xong prototype trong 10 ngày. |
| **2. Bẫy ham công nghệ (Over-engineering Trap)** | Nhóm muốn tự huấn luyện mô hình LLM từ đầu, bàn về kiến trúc microservices phức tạp. | **Kéo về thực tế:** *"Người dùng cần giải quyết điểm đau gì? Hãy làm giao diện Streamlit trong 48 giờ để test trước đã."* |
| **3. Bế tắc tuyển người test (User Recruiting Block)** | Nhóm ngại tiếp cận bác sĩ hoặc người dùng tại sảnh viện. | Coach trực tiếp làm mẫu cuộc phỏng vấn đầu tiên; kết nối với bác sĩ đầu mối Vinmec để sắp xếp khung giờ thuận lợi. |
| **4. Xung đột nội bộ (Team Friction)** | Phân chia công việc không đều, một vài thành viên thụ động hoặc lấn át người khác. | Tổ chức họp 1-on-1 lắng nghe tâm tư; tái cấu trúc vai trò rõ ràng theo năng lực (Product, Tech, Research). |

---

## 5. Bộ Tiêu Chí Kiểm Soát Chất Lượng (Quality Gate Rubric)

Trước khi ký duyệt cho nhóm nộp bài lên Hội đồng Vinmec tại các Cổng, Coach chấm theo thang điểm 4 chuẩn mực:

* [x] **Tiêu chí 1: Tuyệt đối tuân thủ Bảo mật & Đạo đức (Trọng số 30% - Cổng Sinh tử):** 100% không chứa dữ liệu bệnh nhân thật; không chụp ảnh người bệnh; ẩn danh P1–P3; có quy trình chuyển tuyến khẩn cấp.
* [x] **Tiêu chí 2: Chất lượng Need Statement (Trọng số 25%):** Đúng cú pháp Stanford Biodesign; tuyệt đối không đưa công nghệ/giải pháp vào câu tuyên bố; vấn đề được lượng hóa rõ ràng.
* [x] **Tiêu chí 3: Bằng chứng Thực nghiệm Prototype (Trọng số 25%):** Prototype chạy mượt mà, có log kiểm thử với người thật (3–5 người); có số liệu đo lường trước/sau tối ưu hóa.
* [x] **Tiêu chí 4: Kỹ năng Trình bày & Văn hóa Đồng đội (Trọng số 20%):** Slide mạch lạc, súc tích (tối đa 10 slide); tinh thần cầu thị, trung thực và chính trực của người kỹ sư công nghệ vì sức khỏe cộng đồng.

