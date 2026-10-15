# Quy Trình Chuyển Tuyến Khẩn Cấp (Clinical Escalation Protocol)

> **Mục tiêu:** Đảm bảo an toàn sinh mạng tuyệt đối cho người bệnh. Khi người dùng nhập bất kỳ dấu hiệu hoặc câu hỏi phản ánh tình trạng y tế nguy kịch, hệ thống AI phải ngay lập tức dừng toàn bộ các tác vụ thông thường và kích hoạt quy trình hướng dẫn cấp cứu khẩn cấp.

---

## 1. Sơ Đồ Quy Trình Can Thiệp Khẩn Cấp (Escalation Flowchart)

```mermaid
flowchart TD
    Start([Người dùng gửi tin nhắn / thao tác app]) --> RegexCheck{Kiểm tra Bộ từ khóa Cảnh báo Đỏ<br>(Regex & Semantic Matcher)}
    
    RegexCheck -- Phát hiện Cảnh báo Đỏ --> HardStop[1. HARD STOP: Ngắt toàn bộ luồng AI]
    RegexCheck -- Không có Cảnh báo Đỏ --> NormalAI[Tiếp tục luồng giải thích thông thường]
    
    HardStop --> DisplayCard[2. Bật màn hình Cảnh báo Đỏ khẩn cấp<br>Hotline 115 & Hotline Cấp cứu Vinmec: 1900 23 23 89]
    DisplayCard --> LogAlert[3. Ghi vết Audit Trail an toàn]
    LogAlert --> StaffNotify[4. Gửi tín hiệu thông báo cho Lễ tân / Trực ban tại sảnh]
```

---

## 2. Danh Mục Từ Khóa & Tín Hiệu Cảnh Báo Đỏ (Red-Flag Triggers)

Bộ lọc an toàn sử dụng cơ chế so khớp mẫu kết hợp phân loại ngữ nghĩa (Semantic Classifier) để quét các nhóm triệu chứng nguy cấp sau:

| Nhóm bệnh lý nguy kịch | Danh sách từ khóa kích hoạt (Red-Flag Keywords) | Hành vi nguy cơ |
| :--- | :--- | :--- |
| **Tim mạch & Hô hấp cấp** | `đau ngực`, `tức ngực`, `thắt ngực`, `đè nặng ngực`, `khó thở`, `thở dốc`, `thở khò khè dữ dội`, `vã mồ hôi lạnh`, `tím tái môi` | Nghi ngờ Nhồi máu cơ tim, Thuyên tắc phổi, Hen phế quản cấp |
| **Thần kinh & Đột quỵ (FAST)** | `méo miệng`, `liệt mặt`, `yếu tay chân một bên`, `nói ngọng đột ngột`, `nhìn đôi`, `mất thị lực đột ngột`, `đau đầu dữ dội như sét đánh` | Nghi ngờ Đột quỵ não (Tai biến mạch máu não) |
| **Rối loạn tri giác & Co giật** | `ngất xỉu`, `mất ý thức`, `lơ mơ`, `co giật`, `sùi bọt mép`, `sốt li bì gọi không dậy` | Nghi ngờ Động kinh, Xuất huyết não, Sốc phản vệ |
| **Chảy máu & Chấn thương nặng** | `nôn ra máu`, `ho ra máu`, `đi ngoài ra máu tươi ồ ạt`, `chảy máu không cầm được`, `tai nạn ngã đập đầu` | Xuất huyết tiêu hóa nặng, Chấn thương sọ não |
| **Tâm thần & Ý định tự hại** | `muốn tự tử`, `muốn kết thúc cuộc đời`, `tự hại`, `không muốn sống nữa` | Khủng hoảng tâm lý cấp bách |

---

## 3. Ba Bước Can Thiệp Tự Động Của Hệ Thống

### Bước 1: Khóa Luồng Hội Thoại (Hard-Stop Interception)
* Thời gian phản hồi: **< 1.0 giây**.
* Không gửi câu hỏi của người dùng tới mô hình LLM để tránh việc mô hình tạo ra câu trả lời giải thích lan man làm mất "thời gian vàng" cấp cứu của người bệnh.

### Bước 2: Hiển Thị Thẻ Cảnh Báo Cấp Cứu Toàn Màn Hình (Emergency Card UI)
* Toàn bộ giao diện chuyển sang chế độ nền đỏ đậm cảnh báo (`#dc2626`).
* Hiển thị nổi bật 2 số điện thoại khẩn cấp có thể bấm gọi trực tiếp (One-touch Dial):
  * **Hotline Cấp cứu Vinmec:** `1900 23 23 89` (hoặc hotline riêng của từng cơ sở bệnh viện).
  * **Đường dây Cấp cứu Quốc gia:** `115`.
* Chỉ dẫn vị trí vật lý tức thì: *"Nếu bạn đang có mặt tại Vinmec, hãy lập tức di chuyển đến Khoa Cấp Cứu tại Tầng 1 hoặc gọi to nhân viên y tế gần nhất!"*.

### Bước 3: Ghi Vết Kiểm Toán An Toàn (Safety Audit Trail)
* Hệ thống tự động ghi lại log: Thời gian kích hoạt, từ khóa phát hiện, mã phiên người dùng (đã ẩn danh), tọa độ định vị sảnh chờ (nếu người dùng cho phép).
* Tín hiệu cảnh báo được đẩy vào hệ thống giám sát vận hành của viện (Dashboard) để nhân viên chăm sóc khách hàng tại sảnh có thể rà soát và hỗ trợ người bệnh kịp thời.

---

## 4. Mẫu Thông Điệp Phản Hồi Khẩn Cấp Chuẩn Hóa

```text
================================================================================
🚨 CẢNH BÁO Y TẾ KHẨN CẤP / MEDICAL EMERGENCY ALERT 🚨
================================================================================

Triệu chứng bạn vừa mô tả có thể là dấu hiệu của một tình trạng sức khỏe nguy kịch 
đòi hỏi sự can thiệp y tế NGAY LẬP TỨC. Mọi sự chậm trễ đều có thể gây nguy hiểm tính mạng!

HÃY HÀNH ĐỘNG NGAY BÂY GIỜ:

1. NẾU BẠN ĐANG CÓ MẶT TẠI BỆNH VIỆN VINMEC:
   - Hãy báo ngay cho điều dưỡng, bác sĩ, hoặc bảo vệ tại sảnh gần bạn nhất.
   - Hoặc di chuyển khẩn cấp tới KHOA CẤP CỨU (TẦNG 1).

2. NẾU BẠN ĐANG Ở BÊN NGOÀI BỆNH VIỆN:
   - Bấm gọi Cấp cứu Quốc gia: 115
   - Hoặc Hotline Cấp cứu Vinmec: 1900 23 23 89

3. LƯU Ý AN TOÀN TRONG KHI CHỜ TRỢ GIÚP:
   - Ngồi hoặc nằm nghỉ ngơi tại chỗ, nới lỏng quần áo.
   - Nhờ người thân hoặc người xung quanh ở cạnh hỗ trợ.
   - TUYỆT ĐỐI KHÔNG tự ý lái xe hoặc tự đi lại một mình.

================================================================================
```
