# Hướng Dẫn Kỹ Thuật & Cài Đặt Prototype (MyVinmec Trợ Lý Sức Khỏe AI MIA)

> **Tên Module:** MyVinmec Trợ Lý Sức Khỏe AI MIA (Bản Mô Phỏng Nghiên Cứu - Interactive AI Mobile Prototype)  
> **Dự Án:** Exploration Sprint 6 Tuần tại Bệnh Viện Đa Khoa Quốc Tế Vinmec  
> **Tác Giả & Lab Coach:** Nguyễn Xuân Tài (K2/K4) — AI Product Management & Technical Coaching  
> **Kiến Trúc:** Modern Web SPA Simulator (Vanilla HTML5/CSS3/ES6 Modular) + Lightweight Python RAG Proxy (Zero-dependency)  
> **Mặc Định Khi Mở:** Màn hình Chi Tiết Kết Quả Xét Nghiệm (`screen-result`), liên thông 2 chiều thông suốt với tất cả các màn hình còn lại.

> 🚀 **TRẢI NGHIỆM TRỰC TIẾP PROTOTYPE (LIVE DEMO TRÊN VERCEL):**  
> 👉 **[https://myvinmec-care-navigator.vercel.app](https://myvinmec-care-navigator.vercel.app)**  
> *(Xem ngay trên trình duyệt máy tính hoặc điện thoại — Tương tác trực tiếp không cần cài đặt hay clone repo!)*

---

## 1. Kiến Trúc Hệ Thống Tinh Gọn & Hiện Đại (Modular Directory Structure)

Thư mục `05-prototype/` được tái cấu trúc theo mô hình phân tầng hệ thống chuẩn mực, dễ bảo trì và sẵn sàng mở rộng lâu dài:

```text
05-prototype/
├── index.html                          # Single Page Application (SPA) mô phỏng điện thoại MyVinmec
├── server.py                           # Local Backend Proxy nhẹ (Python stdlib, tự động đọc .env & phục vụ API /api/chat)
├── start.bat                           # Script 1 chạm tự khởi chạy server & mở trình duyệt trên Windows
├── .env.example                        # File mẫu cấu hình API Key & Base URL (Agnes AI, OpenAI, Gemini)
├── .gitignore                          # Loại trừ .env, __pycache__, venv để bảo mật tuyệt đối
│
├── css/
│   └── style.css                       # Design System chuẩn MyVinmec (Teal, Mint, Gold, Red, Smart FAB, Toast)
│
├── js/
│   ├── app.js                          # SPA Router, History Stack, Smart FAB Scroll/Dock Controller, Preset Triggers
│   ├── guardrails.js                   # Clinical Escalation Interceptor (< 100ms, FAST Stroke, Cardiac, Emergency Hard-stop)
│   └── rag_engine.js                   # Hybrid RAG Engine (Corpus nội bộ + API LLM Call + F12 Console Error Shield)
│
├── data/
│   └── knowledge_base.json             # Cơ sở tri thức y tế chuẩn hóa (Men gan, HbA1c, Creatinine, Acid Uric, Lipid, CBC)
│
├── mock_data/
│   ├── liver_enzymes_elevated.json     # Dữ liệu kiểm thử men gan AST/ALT
│   └── hba1c_prediabetes.json          # Dữ liệu kiểm thử đường huyết ranh giới
│
├── prompts-and-system-instructions.md  # System Prompts, Guardrail Rules & Phân tích ranh giới y tế
├── user-testing-logs.md                # Biên bản thử nghiệm 3 người dùng (P1, P2, P3) & Chu kỳ tối ưu
├── app.py                              # Bản mô phỏng phụ trợ bằng Streamlit (tùy chọn)
└── README.md                           # Tài liệu hướng dẫn kỹ thuật này
```

---

## 2. Các Đặc Điểm Kỹ Thuật Đột Phá

### 🔄 1. Điều Hướng Liên Thông 2 Chiều Thông Suốt (Bidirectional Navigation)
- **Màn hình mặc định khi mở app:** Màn hình **Chi Tiết Kết Quả Xét Nghiệm** (`screen-result`).
- **Thanh App Bar trên cùng:** Nút mũi tên quay lại (`<`) kích hoạt hàm `goBack()` duyệt ngăn xếp lịch sử (`navigationHistory stack`) giúp người dùng đi qua bất kỳ màn hình nào rồi lùi lại chính xác.
- **Thanh Bottom Navigation Bar (5 tabs):**
  1. `Trang chủ`: Dashboard tìm kiếm, banner ưu đãi, 6 tiện ích nhanh, lịch khám gần đây.
  2. `Hồ sơ`: Lịch sử các đợt khám, hồ sơ sức khỏe cá nhân, liên kết đợt khám hôm nay sang trang kết quả.
  3. `Đặt lịch` (Nút tròn nổi ở giữa): Đặt lịch khám đa khoa, chuyên khoa với bộ chip tương tác linh hoạt.
  4. `Thông báo`: Tin nhắn nhắc lịch tư vấn với Bác sĩ lúc 10:15, thông báo có kết quả xét nghiệm, voucher VIP.
  5. `Tài khoản`: Thông tin VIP Care, Touch ID/Face ID, chính sách bảo mật Nghị định 13/2023/NĐ-CP.
- **Tất cả các thành phần trên màn hình kết quả đều có thể click:**
  - Thẻ thông tin bệnh nhân → Nhảy sang Trang Tài Khoản / Hồ Sơ.
  - Banner tiến độ khám 10:15 → Nhảy sang Trang Thông Báo.
  - Từng dòng kết quả trong bản PDF Scan cũ hoặc bản Native AI → Chạm vào mở ngay Care Navigator giải thích tương ứng.
  - Nút đặt lịch tái khám và xem hồ sơ cận lâm sàng dưới chân kết quả → Nhảy sang Đặt Lịch hoặc Hồ Sơ.

### 🔘 2. Cơ Chế Ẩn Thông Minh Của Nút Trợ Lý AI Care Navigator (Smart FAB)
- **Vị trí chuẩn xác MyVinmec:** Nút tròn màu Teal nằm ở góc dưới bên phải (`bottom: 84px; right: 18px`).
- **Khi người dùng bắt đầu cuộn trang:** Nút tự động thu nhỏ (`scale: 0.8`), làm mờ (`opacity: 0.35`) và ẩn tooltip để **hoàn toàn không che khuất bảng số liệu và chữ số y khoa**.
- **Khi người dùng dừng cuộn 1.2 giây:** Nút tự động phục hồi kích thước và độ mờ ban đầu.
- **Khi người dùng dừng cuộn quá 10 giây (Idle State):** Nút tự động nép vào mép phải màn hình dạng tai thỏ nhỏ (`docked mode`). Chạm hoặc rê chuột vào sẽ bung lại toàn bộ.

### 🛡️ 3. RAG Y Tế 2 Tầng & Cơ Chế Bọc Lỗi An Toàn (Zero-Error Leakage)
- **Cấu hình API Key linh hoạt (`.env`):** Tự động đọc key từ `.env` (hỗ trợ `AGNES_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `BASE_URL`). File `.env` được bảo vệ tuyệt đối bởi `.gitignore`.
- **Nguyên tắc "No Error on UI":** Nếu mạng đứt, lỗi API hoặc câu hỏi ngoài tầm kiểm soát:
  - **Giao diện người dùng:** Tuyệt đối KHÔNG hiển thị exception hay lỗi kỹ thuật; chỉ hiển thị lời khuyên nhẹ nhàng kèm nút gọi Điều dưỡng Vinmec `1900 23 23 89`.
  - **Bảng điều khiển DevTools:** Toàn bộ thông điệp lỗi kỹ thuật được đẩy kín đáo về `console.error` (F12) để kỹ sư kiểm tra.
- **Bức tường lửa Red-Flag Clinical Escalation:** Phản hồi dưới **100ms** khi phát hiện dấu hiệu cấp cứu (đau ngực dữ dội, méo miệng, hụt hơi, nôn ra máu, v.v.), ngay lập tức khóa luồng chat và hiển thị thẻ cảnh báo đỏ toàn màn hình kèm hotline cấp cứu 115 và Vinmec.

### 🧠 4. Trải Nghiệm Tâm Lý Lâm Sàng: Giải Tỏa "Scanxiety" & "Cyberchondria" (In-Context AI)
- **Sự đồng thuận ngữ cảnh ngầm định (Implicit Contextual Consent):** Bệnh nhân đã đăng nhập và chủ động chạm vào AI trên trang kết quả xét nghiệm cá nhân. Bot đọc ngầm dữ liệu màn hình (AST 52, ALT 58, HbA1c 6.1%) mà **tuyệt đối không bắt người dùng bấm popup xin phép cấp quyền đọc màn hình**, loại bỏ hoàn toàn lực cản tâm lý (friction).
- **Ranh giới "Không chẩn đoán nhưng tuyệt đối không vô tích sự":** Cấm hoàn toàn câu từ chối máy móc (*"Đây là chuyên môn sâu, vui lòng chờ bác sĩ"*), vì câu từ chối này sẽ đẩy bệnh nhân vào trạng thái **Cyberchondria** (tự tra Google và hù dọa mình bằng ung thư gan).
- **Áp dụng Mô hình 3 bước (Translate – Contextualize – Empower):**
  1. *Translate:* Dịch bản chất enzym men gan và đường huyết sang ngôn ngữ bình dân.
  2. *Contextualize:* Định khung mức độ: tăng nhẹ 52, 58 U/L là rất phổ biến do thức khuya, stress, thuốc giảm đau hay rượu bia, hoàn toàn không đồng nghĩa với suy gan.
  3. *Empower:* Chuẩn bị sẵn 2 câu hỏi trọng tâm để bệnh nhân tự tin phối hợp cùng Bác sĩ Mai tại phòng 302.

| Tiêu chí | Kịch bản Chatbot rập khuôn (Thất bại) | Kịch bản Trợ lý In-context chuẩn xác (MyVinmec MIA) |
| :--- | :--- | :--- |
| **Phản xạ ban đầu** | Bắt copy-paste hoặc hiện pop-up xin cấp quyền đọc màn hình. Chào hỏi chung chung vô nghĩa. | Đọc ngầm dữ liệu màn hình (Implicit Contextual Consent), biết chính xác người bệnh đang xem xét nghiệm nào tại buồng khám nào. |
| **Xử lý chỉ số đỏ (H)** | *"Chỉ số này bất thường, đây là chuyên môn sâu, bạn hãy chờ gặp bác sĩ chuyên khoa để được chẩn đoán."* | Giải thích bản chất men gan/đường huyết là gì và giải tỏa nỗi sợ: mức tăng nhẹ này rất phổ biến do lối sống, dập tắt ý định tra Google. |
| **Cảm xúc người bệnh** | Hoang mang tăng vọt, cảm thấy hệ thống giấu bệnh, lập tức mở Google tra cứu dẫn đến Cyberchondria. | Thở phào nhẹ nhõm, bớt căng thẳng, nhịp tim ổn định trở lại, dập tắt hội chứng Scanxiety trong phòng chờ. |
| **Giá trị tạo ra cho ca khám** | Người bệnh bước vào phòng khám với thái độ chất vấn, căng thẳng, dồn dập hỏi bác sĩ làm quá tải thời gian tư vấn. | Người bệnh bình tĩnh bước vào với đúng 2 câu hỏi trọng tâm đã chuẩn bị sẵn, tăng hiệu quả phối hợp cùng Bác sĩ. |

---

## 3. Hướng Dẫn Khởi Chạy Nhanh (Quickstart)

### 🌐 Cách 1: Xem Trực Tiếp Trên Web Qua Vercel Live (Khuyến nghị số 1 cho Người Chấm)
Truy cập ngay đường dẫn:  
👉 **[https://myvinmec-care-navigator.vercel.app](https://myvinmec-care-navigator.vercel.app)**  
- Không cần cài đặt bất kỳ công cụ nào, mở được trên cả điện thoại di động và máy tính.
- Tự động tích hợp sẵn đầy đủ cơ chế Local Deterministic RAG và Cloud API.

### ⚡ Cách 2: 1-Click Bằng Double-Click Trên Windows (Khởi chạy cục bộ)
Chỉ cần nhấp đúp chuột vào file:
```cmd
start.bat
```
- Nếu máy có cài Python: Script sẽ tự động chạy `server.py` trong cửa sổ riêng và mở trình duyệt tại `http://localhost:8000`.
- Nếu máy không có Python: Script sẽ mở trực tiếp file `index.html` độc lập trên trình duyệt mặc định.

### 📄 Cách 3: Mở Trực Tiếp File index.html (Offline Tĩnh)
Mở trực tiếp file `index.html` bằng bất kỳ trình duyệt nào (Chrome, Safari, Edge, Firefox).
- Giao diện điện thoại 412px được căn giữa trang web, hai bên rìa màu trắng hoàn toàn (`#FFFFFF`).
- Không cần cài đặt bất kỳ phần mềm hay thư viện bên ngoài nào.

### 🛠️ Cách 3: Chạy Thủ Công Qua Dòng Lệnh
```bash
# Khởi động Backend Server
python server.py

# Mở trình duyệt tại địa chỉ
http://localhost:8000
```
