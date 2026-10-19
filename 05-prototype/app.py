"""
MyVinmec Plain-Language Care Navigator — Interactive Prototype
Phát triển phục vụ: Bài tập ứng tuyển Exploration Sprint 6 tuần tại Vinmec (VRIC)
Tác giả: Nguyễn Xuân Tài (K2) — Forward Deployed Engineer / Technical Lead & K4 Lab Coach
"""

import os
import json
import re
import streamlit as st
from dotenv import load_dotenv

# Tải cấu hình biến môi trường
load_dotenv()

# Danh mục từ khóa kích hoạt cảnh báo đỏ khẩn cấp (Clinical Escalation Triggers)
RED_FLAG_PATTERNS = [
    r"đau\s*ngực", r"tức\s*ngực", r"thắt\s*ngực", r"khó\s*thở", r"thở\s*dốc",
    r"vã\s*mồ\s*hôi\s*lạnh", r"méo\s*miệng", r"liệt\s*nửa\s*người", r"mất\s*thị\s*lực",
    r"co\s*giật", r"ngất\s*xỉu", r"hôn\s*mê", r"nôn\s*ra\s*máu", r"tự\s*tử", r"tự\s*hại"
]

def check_red_flags(query: str) -> bool:
    """Kiểm tra sự xuất hiện của từ khóa cảnh báo nguy kịch."""
    query_lower = query.lower()
    for pattern in RED_FLAG_PATTERNS:
        if re.search(pattern, query_lower):
            return True
    return False

def get_plain_language_explanation(test_name: str, value: float, unit: str, ref: str) -> dict:
    """Tạo phản hồi chuẩn mực dạng ngôn ngữ bình dân (Deterministic Verified Response)."""
    if "AST" in test_name or "ALT" in test_name:
        return {
            "meaning": (
                f"Chỉ số {test_name} hiện tại là **{value} {unit}** (khoảng tham chiếu bình thường {ref}). "
                "Đây là men gan thường được phóng thích vào máu khi tế bào gan hoạt động tích cực. "
                "Mức tăng nhẹ này rất thường gặp trong đời sống thường ngày do ăn uống nhiều dầu mỡ/đạm, "
                "sử dụng rượu bia gần ngày lấy mẫu, thức khuya hoặc vận động mạnh, "
                "hoàn toàn **không đồng nghĩa với việc bạn mắc bệnh gan nguy hiểm**."
            ),
            "questions": [
                "Thưa bác sĩ, mức men gan tăng nhẹ này của cháu có cần dùng thuốc hỗ trợ không hay chỉ cần điều chỉnh sinh hoạt?",
                "Cháu có cần hẹn ngày kiểm tra lại chỉ số này sau 1 đến 2 tháng không ạ?"
            ],
            "disclaimer": "Kết quả chỉ số cần được Bác sĩ chuyên khoa kết hợp cùng tiền sử sức khỏe thực tế để đưa ra kết luận chính xác."
        }
    elif "HbA1c" in test_name:
        return {
            "meaning": (
                f"Chỉ số {test_name} là **{value} {unit}** (khoảng bình thường {ref}). "
                "HbA1c phản ánh mức đường huyết trung bình của cơ thể trong suốt 2 đến 3 tháng qua. "
                "Kết quả 6.1% nằm ở vùng ranh giới (tiền đái tháo đường). "
                "Điều này báo hiệu cơ thể bạn cần chú ý cân đối lại lượng tinh bột và tăng cường vận động, "
                "chứ **tuyệt đối không được tự ý mua thuốc tiểu đường uống khi chưa có chỉ định**."
            ),
            "questions": [
                "Thưa bác sĩ, mức đường huyết trung bình này của tôi có thể cải thiện bằng chế độ ăn và tập luyện không?",
                "Tôi nên hạn chế cụ thể những nhóm thực phẩm nào trong thực đơn hàng ngày ạ?"
            ],
            "disclaimer": "Chỉ bác sĩ điều trị mới có thẩm quyền quyết định việc có cần sử dụng thuốc hạ đường huyết hay không."
        }
    else:
        return {
            "meaning": f"Chỉ số {test_name} là {value} {unit} (tham chiếu {ref}). Vui lòng trao đổi trực tiếp với Bác sĩ tại phòng khám.",
            "questions": [
                "Bác sĩ có thể giải thích ý nghĩa chỉ số này đối với thể trạng hiện tại của tôi không?",
                "Tôi cần lưu ý gì trong sinh hoạt sau khi có kết quả này?"
            ],
            "disclaimer": "Thông tin mang tính tham khảo, luôn tuân thủ hướng dẫn của bác sĩ trực tiếp khám bệnh."
        }

# Cấu hình giao diện Streamlit
st.set_page_config(
    page_title="MyVinmec Care Navigator — Prototype",
    page_icon="🏥",
    layout="centered"
)

# Tùy biến CSS mô phỏng phong cách hiện đại của MyVinmec (Teal/Mint/Gold)
st.markdown("""
<style>
    :root {
        --vinmec-teal: #008B7A;
        --vinmec-mint: #E0F2F1;
        --vinmec-gold: #F59E0B;
    }
    .stApp {
        background-color: #F8FAFC;
    }
    .main-header {
        color: #008B7A;
        font-size: 24px;
        font-weight: 800;
        margin-bottom: 2px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .sub-header {
        color: #64748B;
        font-size: 13px;
        margin-bottom: 16px;
    }
    .patient-badge {
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 12px;
        padding: 10px 14px;
        margin-bottom: 16px;
        box-shadow: 0 2px 6px rgba(0, 139, 122, 0.06);
    }
    .emergency-card {
        background-color: #FEF2F2;
        border: 2px solid #DC2626;
        border-radius: 14px;
        padding: 20px;
        color: #991B1B;
        margin-top: 15px;
        margin-bottom: 20px;
    }
    .emergency-card h3 {
        color: #B91C1C;
        margin-top: 0;
    }
    .result-card {
        background-color: #FFFFFF;
        border-left: 4px solid #008B7A;
        padding: 14px 16px;
        border-radius: 12px;
        margin-bottom: 14px;
        border: 1px solid #E2E8F0;
    }
    .stButton>button {
        background-color: #008B7A !important;
        color: white !important;
        border-radius: 20px !important;
        border: none !important;
        font-weight: 700 !important;
    }
    .stButton>button:hover {
        background-color: #006D60 !important;
    }
</style>
""", unsafe_allow_html=True)

st.markdown('<div class="main-header">🏥 MyVinmec Care Navigator</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-header">Trợ lý phiên dịch kết quả cận lâm sàng dạng ngôn ngữ bình dân • Trang bị câu hỏi hỏi Bác sĩ</div>', unsafe_allow_html=True)

st.markdown("""
<div class="patient-badge">
    <strong>Bệnh nhân:</strong> NGUYỄN VĂN A &nbsp;|&nbsp; <strong>Mã y tế:</strong> 10088921 (Vinmec Times City)<br>
    <span style="font-size:12px; color:#64748B;">Khoa Khám bệnh Ngoại trú • Bác sĩ chỉ định: CKI. Trần Thị Mai</span>
</div>
""", unsafe_allow_html=True)

# Sidebar điều khiển tình huống kiểm thử
st.sidebar.header("🧪 Bộ Tình Huống Kiểm Thử (Presets)")
selected_preset = st.sidebar.radio(
    "Chọn kịch bản mô phỏng:",
    [
        "Kịch bản 1: Men gan tăng nhẹ (Tester P1)",
        "Kịch bản 2: HbA1c ranh giới tiền tiểu đường (Tester P2)",
        "Kịch bản 3: Thử thách Cấp cứu Khẩn cấp (Tester P3 - Red-Flag)",
        "Nhập câu hỏi tự do (Free input)"
    ]
)

st.sidebar.markdown("---")
st.sidebar.info(
    "**Cam kết an toàn:**\n"
    "- 100% dữ liệu mock giả lập.\n"
    "- Không đưa ra chẩn đoán.\n"
    "- Tự động ngắt khẩn cấp khi gặp triệu chứng cấp cứu."
)

# Xử lý theo từng tình huống
query_text = ""
if selected_preset == "Kịch bản 1: Men gan tăng nhẹ (Tester P1)":
    query_text = "Em vừa nhận kết quả máu thấy chỉ số AST ghi 52 U/L và ALT ghi 58 U/L có chữ H màu đỏ. Em có bị bệnh gan nặng không ạ?"
elif selected_preset == "Kịch bản 2: HbA1c ranh giới tiền tiểu đường (Tester P2)":
    query_text = "Tôi thấy chỉ số HbA1c là 6.1%, tôi có nên tự ra hiệu thuốc mua thuốc tiểu đường uống luôn không?"
elif selected_preset == "Kịch bản 3: Thử thách Cấp cứu Khẩn cấp (Tester P3 - Red-Flag)":
    query_text = "Bác sĩ ơi tôi đang thấy đau thắt ngực dữ dội, khó thở và vã mồ hôi lạnh quá!"

user_input = st.text_area("Nhập thắc mắc hoặc chọn kịch bản phía trên:", value=query_text, height=90)

if st.button("Gửi thắc mắc tới Trợ lý MyVinmec", type="primary"):
    if not user_input.strip():
        st.warning("Vui lòng nhập nội dung cần giải đáp.")
    else:
        # BƯỚC 1: KIỂM TRA BỨC TƯỜNG LỬA CẤP CỨU (RED-FLAG INTERCEPTION)
        if check_red_flags(user_input):
            st.markdown("""
            <div class="emergency-card">
                <h3>🚨 CẢNH BÁO Y TẾ KHẨN CẤP / MEDICAL EMERGENCY</h3>
                <p><strong>Dấu hiệu bạn vừa mô tả có thể là tình trạng nguy kịch cần can thiệp y tế NGAY LẬP TỨC!</strong></p>
                <p>👉 <strong>Nếu bạn đang có mặt tại Vinmec:</strong> Hãy báo ngay cho điều dưỡng, bác sĩ hoặc bảo vệ gần nhất, hoặc di chuyển lập tức tới <strong>KHOA CẤP CỨU (TẦNG 1)</strong>.</p>
                <p>👉 <strong>Nếu bạn đang ở ngoài viện:</strong> Bấm gọi ngay:</p>
                <ul>
                    <li>📞 <strong>Cấp cứu Quốc gia: 115</strong></li>
                    <li>📞 <strong>Hotline Cấp cứu Vinmec: 1900 23 23 89</strong></li>
                </ul>
                <p><em>Hãy ngồi nghỉ tại chỗ, nới lỏng quần áo và nhờ người thân ở cạnh hỗ trợ. Tuyệt đối không tự lái xe.</em></p>
            </div>
            """, unsafe_allow_html=True)
        else:
            # BƯỚC 2: XỬ LÝ GIẢI THÍCH NGÔN NGỮ BÌNH DÂN
            st.success("Đã phân tích thông tin xét nghiệm thành công!")
            
            if "hba1c" in user_input.lower():
                data = get_plain_language_explanation("HbA1c", 6.1, "%", "4.0 - 5.6")
            else:
                data = get_plain_language_explanation("AST (SGOT) & ALT (SGPT)", 58.0, "U/L", "< 40")
                
            col1, col2 = st.columns([1, 1])
            with col1:
                st.markdown("### 📖 Ý nghĩa thông thường:")
                st.info(data["meaning"])
            
            with col2:
                st.markdown("### 💡 Gợi ý câu hỏi cho Bác sĩ:")
                st.markdown(f"1. *\"{data['questions'][0]}\"*")
                st.markdown(f"2. *\"{data['questions'][1]}\"*")
                
            st.markdown(f"> ⚠️ **Lưu ý an toàn:** {data['disclaimer']}")

st.markdown("---")
st.caption("MyVinmec Exploration Sprint Prototype • Tác giả: Nguyễn Xuân Tài (K2) • Phục vụ đề án nghiên cứu VinUni VRIC x Vinmec 2026")
