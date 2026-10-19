# Bức Tranh Lớn Vận Hành Bệnh Viện Đa Khoa & Cơ Chế Phân Chia Nhóm (Hospital Operations Blueprint)

> **Mục tiêu tài liệu:** Cung cấp cho Coach K2 và các học viên Khóa 4 (K4) một **Bản đồ dịch vụ toàn diện (Service Blueprint)** về dòng chảy bệnh nhân trong bệnh viện đa khoa Vinmec.  
> **Ứng dụng thực chiến:**  
> 1. Làm kim chỉ nam để **phân chia các Cặp (Pairs) khảo sát dữ liệu hiện trường** trong Tuần 1 mà không bỏ sót bất kỳ điểm nghẽn nào.  
> 2. Cung cấp cơ sở dữ liệu đối chiếu khách quan để **tái cấu trúc nhóm thành 2 Team Dev chuyên trách** trong Tuần 2 và Tuần 3.

---

## 1. Bản Đồ Dòng Chảy Bệnh Nhân Toàn Cảnh (Macro Patient Flow)

Trong một bệnh viện đa khoa quốc tế như Vinmec, quy trình khám chữa bệnh ngoại trú vận hành theo một chuỗi giá trị khép kín gồm 4 chặng then chốt:

```mermaid
flowchart TD
    subgraph S1["TRẠM 1: TIẾP ĐÓN & PHÂN LUỒNG (CHECK-IN & TRIAGE)"]
        A1["Bệnh nhân đến viện<br>(Đã hẹn app MyVinmec hoặc Vãng lai)"] --> A2["Kiosk bấm số tự động / Quầy Lễ tân"]
        A2 --> A3["Xác thực BHYT / Bảo hiểm Bảo lãnh"]
        A3 --> A4["Phân luồng về Chuyên khoa ban đầu"]
    end

    subgraph S2["TRẠM 2: KHÁM LÂM SÀNG BAN ĐẦU (PRIMARY CONSULTATION)"]
        A4 --> B1["Sảnh chờ trước cửa phòng khám"]
        B1 --> B2["Điều dưỡng đo sinh hiệu (Huyết áp, Chiều cao, Cân nặng)"]
        B2 --> B3["Bác sĩ hỏi bệnh & Khám lâm sàng"]
        B3 --> B4["Bác sĩ chỉ định Cận lâm sàng (Xét nghiệm / Chẩn đoán hình ảnh)"]
    end

    subgraph S3["TRẠM 3: KỸ THUẬT CẬN LÂM SÀNG (DIAGNOSTICS & LAB)"]
        B4 --> C1["Di chuyển tìm phòng Xét nghiệm / Chẩn đoán hình ảnh"]
        C1 --> C2["Lấy máu / Nước tiểu (Tầng 1 hoặc Tầng 2)"]
        C1 --> C3["Chụp X-Quang / Siêu âm / CT / MRI"]
        C2 --> C4["CHỜ KẾT QUẢ (45 - 90 phút chết tại hành lang)"]
        C3 --> C4
        C4 --> C5["Nhận kết quả in giấy / Xem trên App MyVinmec"]
    end

    subgraph S4["TRẠM 4: KẾT LUẬN, NHÀ THUỐC & RA VIỆN (DISCHARGE & PHARMACY)"]
        C5 --> D1["Quay lại Phòng khám ban đầu (Trạm 2) đọc kết quả"]
        D1 --> D2["Bác sĩ kết luận bệnh, giải thích & Kê đơn thuốc điện tử"]
        D2 --> D3["Quầy Thu ngân (Quyết toán chi phí BHYT/BHTN)"]
        D3 --> D4["Nhà thuốc Bệnh viện (Dược sĩ hướng dẫn dùng thuốc)"]
        D4 --> D5["Ra viện & Hẹn lịch tái khám / Theo dõi tại nhà"]
    end
```

---

## 2. Chi Tiết 4 Trạm Trọng Yếu & Danh Mục Điểm Nghẽn Tiềm Năng

| Trạm vận hành | Vị trí thực tế | Đối tượng tương tác | Điểm đau & Điểm nghẽn tiềm năng (Bottlenecks) |
| :--- | :--- | :--- | :--- |
| **TRẠM 1: Tiếp Đón & Phân Luồng** | Sảnh chính Tầng 1, Kiosk tự phục vụ, Quầy lễ tân. | Bệnh nhân mới, Người nhà, Nhân viên lễ tân, Bảo vệ. | • Bệnh nhân lúng túng giữa luồng hẹn trước và luồng vãng lai.<br>• Thủ tục bảo lãnh viện phí mất 15–20 phút xác minh.<br>• Chưa biết đi thang máy hay thang cuốn nào để đến đúng khoa. |
| **TRẠM 2: Khám Lâm Sàng Ngoại Trú** | Hành lang phòng khám Nội/Ngoại/Sản/Nhi. | Bệnh nhân ngồi chờ, Bác sĩ khám, Điều dưỡng trực cửa. | • **Thời gian chờ chết:** Ngồi chờ 30–45 phút nhưng chỉ được khám 7–10 phút.<br>• Bệnh nhân vào gặp bác sĩ thì bị "quên mất câu cần hỏi".<br>• Bác sĩ bị quá tải câu hỏi hành chính (giá thuốc, bảo hiểm, tìm phòng). |
| **TRẠM 3: Kỹ Thuật Cận Lâm Sàng** | Khu lấy máu, Phòng chụp X-quang, Siêu âm, MRI. | Bệnh nhân cầm giấy chỉ định, Kỹ thuật viên hình ảnh, Y tá. | • **Nghẽn điều hướng (Wayfinding Friction):** Đi lạc giữa các phòng khám cận lâm sàng phân tán ở nhiều tầng.<br>• **Khủng hoảng tâm lý lúc nhận kết quả:** Cầm tờ kết quả xét nghiệm máu có chỉ số bôi đậm/mũi tên đỏ nhưng chưa được bác sĩ giải thích $\rightarrow$ Hoang mang tra Google. |
| **TRẠM 4: Trả Kết Quả, Dược & Ra Viện** | Quầy Thu ngân, Quầy Dược sảnh Tầng 1, Cửa ra viện. | Bệnh nhân hoàn tất khám, Dược sĩ phát thuốc, Thu ngân. | • Dồn ứ giờ cao điểm (10h30 – 11h30 trưa & 15h30 – 16h30 chiều).<br>• Bệnh nhân nghe dược sĩ dặn thuốc 2 phút nhưng về nhà quên cách dùng.<br>• Mất kết nối hậu khám: Bệnh nhân có tác dụng phụ nhẹ không biết hỏi ai. |

---

## 3. Cơ Chế Phân Cặp Khảo Sát Hiện Trường Trong Tuần 1

Để bao phủ toàn diện 4 trạm mà không gây ồn ào khoa phòng, Coach chia nhóm K4 thành **3–4 Cặp (Buddy Pairs)**:

```mermaid
flowchart TD
    Squad["Nhóm K4 (6 - 10 bạn)"] --> Pair1["Cặp A (2 bạn): Chuyên trách Trạm 1"]
    Squad --> Pair2["Cặp B (2 bạn): Chuyên trách Trạm 2"]
    Squad --> Pair3["Cặp C (2 bạn): Chuyên trách Trạm 3"]
    Squad --> Pair4["Cặp D (1-2 bạn): Chuyên trách Trạm 4"]
    
    Pair1 -. Luân phiên mỗi ngày .-> Pair2
    Pair2 -. Luân phiên mỗi ngày .-> Pair3
    Pair3 -. Luân phiên mỗi ngày .-> Pair4
    Pair4 -. Luân phiên mỗi ngày .-> Pair1
```

### 3.1. Phân vai trong từng Cặp (Pair Roles)
1. **Lead Interviewer (Người chủ trì giao tiếp):**
   - Đóng vai người cần giúp đỡ hoặc thực tập sinh thân thiện.
   - Trò chuyện với bệnh nhân/người nhà/điều dưỡng theo đúng kỹ thuật *The Mom Test* (tuyệt đối không nhắc đến AI/App).
2. **Behavioral Observer & Scribe (Người ghi chép & quan sát cử chỉ):**
   - Cầm sổ tay nhỏ ghi lại **nguyên văn câu nói (Raw Quotes)**.
   - Bấm giờ đo thời gian chờ thực tế (bằng đồng hồ đeo tay).
   - Ghi lại các giải pháp chữa cháy (Workarounds) của nhân viên y tế (như dán giấy note viết tay, chỉ tay nhiều lần).

### 3.2. Lịch luân chuyển trạm khám (Daily Rotation)
- Mỗi ngày 1 cặp phụ trách 1 trạm. Sau 4 ngày (Thứ Hai $\rightarrow$ Thứ Năm), 100% học viên đều đi qua đủ 4 trạm.
- 18h00 mỗi ngày: Từng cá nhân nộp [Daily Field Observation Log](./fieldwork-stakeholder-questions.md#phần-vi-mẫu-nhật-ký-quan-sát-hiện-trường-hàng-ngày-daily-field-observation-log-template).
- **18h00 Thứ Năm (05/11):** Khóa sổ dữ liệu để sáng Thứ Sáu tổng hợp chéo.

---

## 4. Cơ Chế Chuyển Giao: Từ Khảo Sát Theo Cặp Sang 2 Team Dev (Tuần 2 & 3)

Vào sáng Thứ Sáu Tuần 1 (06/11) và cuối tuần (07–08/11), Coach dùng bảng ma trận đối chiếu để **gạn lọc ra đúng 2 Bài toán lớn nhất** có dữ liệu thực tế dày dặn nhất. 

Sáng Thứ Hai Tuần 2 (09/11), toàn bộ nhân sự các cặp khảo sát sẽ được **tái cấu trúc thành 2 Team Dev chuyên trách**:

```mermaid
flowchart LR
    subgraph W1["TUẦN 1: 4 CẶP KHẢO SÁT THEO TRẠM"]
        P1["Cặp A (Trạm 1)"]
        P2["Cặp B (Trạm 2)"]
        P3["Cặp C (Trạm 3)"]
        P4["Cặp D (Trạm 4)"]
    end

    Filter{"HỘI TỤ DỮ LIỆU<br>(Tổng hợp sáng T6 06/11 & CN 08/11)<br>Coach chốt 2 Bài toán"}

    subgraph W23["TUẦN 2 & 3: 2 TEAM DEV CHUYÊN TRÁCH"]
        DevA["TEAM DEV A: CARE NAVIGATOR<br>• Giải quyết điểm nghẽn Trạm 2 & 3<br>• Hỗ trợ giải thích kết quả cận lâm sàng & Hậu khám<br>(1 Lead + 2 Dev + 1 Tester)"]
        DevB["TEAM DEV B: LIVE WAYFINDING & TRIAGE<br>• Giải quyết điểm nghẽn Trạm 1 & 3<br>• Điều hướng luồng khám & Giảm thời gian chờ chết<br>(1 Lead + 2 Dev + 1 Tester)"]
    end

    P1 --> Filter
    P2 --> Filter
    P3 --> Filter
    P4 --> Filter
    Filter --> DevA
    Filter --> DevB
```

### 4.1. Cấu trúc tiêu chuẩn của 1 Team Dev (4–5 người)
- **1 Product / Clinical Lead:** Bạn có kỹ năng quan sát thấu cảm và viết log sắc sảo nhất ở Tuần 1. Chịu trách nhiệm viết và bảo vệ câu Need Statement tại Cổng 1 (Thứ Sáu 13/11).
- **2 AI & Frontend Dev:** Chịu trách nhiệm code giao diện Streamlit/Figma clickable và tinh chỉnh System Prompt/RAG Pipeline.
- **1 Data & Testing Specialist:** Chịu trách nhiệm tạo dữ liệu giả lập (Mock Data sạch) và xây dựng kịch bản kiểm thử người dùng cho Tuần 4.

### 4.2. Kế hoạch bàn giao sang Tuần 3
- Khi vượt qua **Cổng 1 vào Thứ Sáu 13/11/2026**, hai Team Dev đã có sẵn đầy đủ:
  1. Need Statement được Trưởng khoa Vinmec phê duyệt.
  2. Bằng chứng thực địa từ 4 Trạm khám của Tuần 1.
  3. Phân công vai trò kỹ thuật rõ ràng.
- **Sáng Thứ Hai 16/11/2026:** Cả 2 team mở repo nhánh và bắt tay vào Sprint Dev 2 tuần tốc lực mà không mất một phút nào phân vân hay cãi vã về ý tưởng!
