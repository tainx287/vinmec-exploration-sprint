"""
generate_mockups.py
Tạo các hình ảnh mockup trực quan sắc nét cho Slide 01 và Slide 06 của bài thuyết trình.
"""

import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs('slides/images', exist_ok=True)

# Tìm font Segoe UI hoặc Arial
def get_font(size, bold=False):
    try:
        font_name = 'segoeui.ttf' if not bold else 'segoeuib.ttf'
        return ImageFont.truetype(f'C:/Windows/Fonts/{font_name}', size)
    except:
        return ImageFont.load_default()

def draw_phone_frame(draw, x, y, w, h, bg_color=(15, 23, 42)):
    # Viền máy điện thoại bo tròn góc cao cấp
    radius = 36
    draw.rounded_rectangle([x, y, x + w, y + h], radius=radius, fill=bg_color, outline=(71, 85, 105), width=3)
    # Dynamic Island / Loa thoại
    notch_w, notch_h = 90, 16
    draw.rounded_rectangle([x + (w - notch_w)//2, y + 10, x + (w + notch_w)//2, y + 10 + notch_h], radius=8, fill=(30, 41, 59))
    # Thanh hiển thị pin & giờ
    f_stat = get_font(12, bold=True)
    draw.text((x + 28, y + 12), "09:41", font=f_stat, fill=(148, 163, 184))
    draw.text((x + w - 48, y + 12), "5G 98%", font=f_stat, fill=(148, 163, 184))

# -----------------------------------------------------------------------------
# 1. Slide 01 Evidence: Bảng kết quả thực tế MyVinmec kèm khoanh đỏ cảnh báo
# -----------------------------------------------------------------------------
def create_slide1_evidence():
    W, H = 500, 750
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    draw_phone_frame(draw, 10, 10, W - 20, H - 20, bg_color=(248, 250, 252))

    # Header MyVinmec Teal
    draw.rectangle([13, 38, W - 13, 105], fill=(32, 166, 154))
    f_head = get_font(18, bold=True)
    draw.text((32, 54), "Hồ Sơ Y Tế • MyVinmec", font=f_head, fill=(255, 255, 255))
    f_subhead = get_font(13)
    draw.text((32, 78), "Khoa Khám bệnh • Bệnh viện Vinmec Times City", font=f_subhead, fill=(224, 242, 241))

    # Info card
    draw.rounded_rectangle([25, 120, W - 25, 175], radius=12, fill=(255, 255, 255), outline=(226, 232, 240), width=1)
    f_p = get_font(13)
    draw.text((38, 130), "Bệnh nhân: NGUYỄN XUÂN TÀI (Nam - 28t)", font=get_font(13, bold=True), fill=(30, 41, 59))
    draw.text((38, 150), "Bác sĩ: BS.CKII Trần Thị Mai • Phòng 302", font=f_p, fill=(100, 116, 139))

    # Section title
    draw.text((28, 190), "KẾT QUẢ XÉT NGHIỆM SINH HÓA MÁU (PDF)", font=get_font(14, bold=True), fill=(15, 23, 42))

    # Table Header
    draw.rounded_rectangle([25, 215, W - 25, 248], radius=6, fill=(241, 245, 249))
    draw.text((35, 224), "Chỉ số", font=get_font(12, bold=True), fill=(71, 85, 105))
    draw.text((170, 224), "Kết quả", font=get_font(12, bold=True), fill=(71, 85, 105))
    draw.text((275, 224), "Tham chiếu", font=get_font(12, bold=True), fill=(71, 85, 105))
    draw.text((395, 224), "Đơn vị", font=get_font(12, bold=True), fill=(71, 85, 105))

    rows = [
        ("AST (SGOT)", "52.0  H", "< 40", "U/L", True),
        ("ALT (SGPT)", "58.0  H", "< 40", "U/L", True),
        ("HbA1c", "6.1   H", "4.0 - 5.6", "%", True),
        ("Glucose lúc đói", "5.2", "3.9 - 6.4", "mmol/L", False),
        ("Creatinine", "85.0", "62 - 106", "µmol/L", False),
        ("Acid Uric", "380.0", "200 - 420", "µmol/L", False),
    ]

    y_t = 255
    for name, val, ref, unit, is_high in rows:
        draw.line([25, y_t + 36, W - 25, y_t + 36], fill=(241, 245, 249), width=1)
        draw.text((35, y_t + 8), name, font=get_font(13, bold=is_high), fill=(15, 23, 42) if not is_high else (225, 29, 72))
        draw.text((170, y_t + 8), val, font=get_font(13, bold=is_high), fill=(225, 29, 72) if is_high else (16, 185, 129))
        draw.text((275, y_t + 8), ref, font=get_font(13), fill=(100, 116, 139))
        draw.text((395, y_t + 8), unit, font=get_font(13), fill=(100, 116, 139))
        y_t += 40

    # KHOANH VÙNG ĐỎ "BẰNG CHỨNG TỘI PHẠM" (Crime Scene Callout)
    # Khoanh vùng AST & ALT
    draw.rounded_rectangle([28, 252, 255, 335], radius=12, outline=(239, 68, 68), width=3)
    # Banner cảnh báo đỏ
    draw.rounded_rectangle([25, 520, W - 25, 610], radius=12, fill=(254, 242, 242), outline=(248, 113, 113), width=2)
    draw.text((38, 532), "⚠️ ĐIỂM MÙ TRẢI NGHIỆM GÂY SCANXIETY:", font=get_font(13, bold=True), fill=(185, 28, 28))
    draw.text((38, 555), "• Chữ viết tắt y khoa kỹ thuật không ngữ cảnh giải thích.", font=get_font(12), fill=(153, 27, 27))
    draw.text((38, 575), "• Chỉ số bôi đỏ H khiến bệnh nhân hoảng loạn tự tra Google.", font=get_font(12), fill=(153, 27, 27))

    # Bottom bar
    draw.rounded_rectangle([40, 630, W - 40, 680], radius=10, fill=(30, 41, 59))
    draw.text((95, 645), "Tải File Bản Scan PDF Đính Kèm", font=get_font(14, bold=True), fill=(255, 255, 255))

    img.save('slides/images/myvinmec_evidence.png')
    print('Created slides/images/myvinmec_evidence.png')

# -----------------------------------------------------------------------------
# 2. Slide 06 Prototype Mockup 1: Thẻ kết quả 3 màu (Results Screen)
# -----------------------------------------------------------------------------
def create_prototype_mockup_results():
    W, H = 420, 720
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    draw_phone_frame(draw, 10, 10, W - 20, H - 20, bg_color=(241, 245, 249))

    # App Header
    draw.rectangle([13, 38, W - 13, 95], fill=(32, 166, 154))
    draw.text((28, 52), "← Kết Quả Cận Lâm Sàng", font=get_font(16, bold=True), fill=(255, 255, 255))
    draw.text((28, 74), "Phòng khám 302 • Bác sĩ Trần Thị Mai", font=get_font(12), fill=(204, 251, 241))

    # Live Waiting Badge
    draw.rounded_rectangle([25, 108, W - 25, 155], radius=10, fill=(255, 255, 255), outline=(203, 213, 225), width=1)
    draw.text((38, 118), "⏱️ Đang chờ gọi khám: Còn ~15 phút", font=get_font(13, bold=True), fill=(15, 23, 42))
    draw.text((38, 136), "Số thứ tự: 18 · Hiện tại đang phục vụ số 16", font=get_font(11), fill=(100, 116, 139))

    # Result Card 1 (ALT - Amber)
    draw.rounded_rectangle([25, 168, W - 25, 275], radius=14, fill=(255, 255, 255), outline=(251, 191, 36), width=2)
    draw.rounded_rectangle([W - 120, 178, W - 35, 204], radius=6, fill=(254, 243, 199))
    draw.text((W - 110, 183), "HƠI NHÍCH NHẸ", font=get_font(10, bold=True), fill=(180, 83, 9))
    draw.text((38, 180), "Men gan ALT (SGPT)", font=get_font(14, bold=True), fill=(15, 23, 42))
    draw.text((38, 205), "58.0 U/L", font=get_font(22, bold=True), fill=(217, 119, 6))
    draw.text((150, 212), "Ngưỡng chuẩn: < 40 U/L", font=get_font(11), fill=(100, 116, 139))
    draw.text((38, 240), "💡 Mức tăng nhẹ thường gặp do thức khuya, dùng thuốc.", font=get_font(11), fill=(71, 85, 105))

    # Result Card 2 (AST - Amber)
    draw.rounded_rectangle([25, 288, W - 25, 395], radius=14, fill=(255, 255, 255), outline=(251, 191, 36), width=2)
    draw.rounded_rectangle([W - 120, 298, W - 35, 324], radius=6, fill=(254, 243, 199))
    draw.text((W - 110, 303), "HƠI NHÍCH NHẸ", font=get_font(10, bold=True), fill=(180, 83, 9))
    draw.text((38, 300), "Men gan AST (SGOT)", font=get_font(14, bold=True), fill=(15, 23, 42))
    draw.text((38, 325), "52.0 U/L", font=get_font(22, bold=True), fill=(217, 119, 6))
    draw.text((150, 332), "Ngưỡng chuẩn: < 40 U/L", font=get_font(11), fill=(100, 116, 139))
    draw.text((38, 360), "💡 Không đồng nghĩa tổn thương tế bào gan nghiêm trọng.", font=get_font(11), fill=(71, 85, 105))

    # Result Card 3 (Creatinine - Green)
    draw.rounded_rectangle([25, 408, W - 25, 495], radius=14, fill=(255, 255, 255), outline=(52, 211, 153), width=2)
    draw.rounded_rectangle([W - 105, 418, W - 35, 444], radius=6, fill=(209, 250, 229))
    draw.text((W - 98, 423), "RẤT TỐT", font=get_font(10, bold=True), fill=(4, 120, 87))
    draw.text((38, 420), "Chức năng thận Creatinine", font=get_font(14, bold=True), fill=(15, 23, 42))
    draw.text((38, 445), "85.0 µmol/L", font=get_font(20, bold=True), fill=(5, 150, 105))
    draw.text((170, 452), "Dải chuẩn: 62 - 106", font=get_font(11), fill=(100, 116, 139))
    draw.text((38, 474), "✓ Tốc độ lọc cầu thận hoàn toàn ổn định.", font=get_font(11), fill=(71, 85, 105))

    # Bottom Button
    draw.rounded_rectangle([30, 620, W - 30, 675], radius=12, fill=(32, 166, 154))
    draw.text((55, 636), "🤖 Nhờ Trợ lý AI MIA Giải Thích & Chuẩn Bị Câu Hỏi", font=get_font(12, bold=True), fill=(255, 255, 255))

    img.save('slides/images/prototype_mockup_1.png')
    print('Created slides/images/prototype_mockup_1.png')

# -----------------------------------------------------------------------------
# 3. Slide 06 Prototype Mockup 2: Khung Chat Trợ Lý MIA In-Context
# -----------------------------------------------------------------------------
def create_prototype_mockup_chat():
    W, H = 420, 720
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    draw_phone_frame(draw, 10, 10, W - 20, H - 20, bg_color=(248, 250, 252))

    # Header MIA Drawer
    draw.rounded_rectangle([13, 38, W - 13, 105], radius=14, fill=(255, 255, 255), outline=(226, 232, 240), width=1)
    draw.text((30, 52), "🤖 Trợ lý sức khoẻ AI MIA", font=get_font(16, bold=True), fill=(32, 166, 154))
    draw.text((30, 76), "In-Context · Neo vào xét nghiệm P.302 BS Mai", font=get_font(11), fill=(100, 116, 139))
    draw.text((W - 40, 55), "✕", font=get_font(16), fill=(148, 163, 184))

    # User bubble
    draw.rounded_rectangle([W - 250, 120, W - 30, 160], radius=12, fill=(32, 166, 154))
    draw.text((W - 240, 132), "Các chỉ số của tôi có ý nghĩa là gì?", font=get_font(12, bold=True), fill=(255, 255, 255))

    # MIA Response Card (Translate - Contextualize - Empower)
    draw.rounded_rectangle([25, 175, W - 25, 615], radius=14, fill=(255, 255, 255), outline=(226, 232, 240), width=1)

    # Step 1: Translate
    draw.rounded_rectangle([35, 190, W - 35, 275], radius=10, fill=(240, 253, 250))
    draw.text((45, 198), "1. DỊCH THUẬT NGỮ ĐỜI THƯỜNG", font=get_font(11, bold=True), fill=(15, 118, 110))
    draw.text((45, 220), "AST & ALT là 2 enzym nằm trong tế bào gan.", font=get_font(11), fill=(51, 65, 85))
    draw.text((45, 240), "Khi gan phản ứng nhẹ, enzym tiết vào máu làm số nhích lên.", font=get_font(11), fill=(51, 65, 85))

    # Step 2: Contextualize
    draw.rounded_rectangle([35, 285, W - 35, 385], radius=10, fill=(254, 243, 199))
    draw.text((45, 293), "2. ĐỊNH KHUNG MỨC ĐỘ AN TOÀN", font=get_font(11, bold=True), fill=(180, 83, 9))
    draw.text((45, 315), "52 & 58 U/L là mức tăng nhẹ, rất phổ biến do thức khuya,", font=get_font(11), fill=(120, 53, 15))
    draw.text((45, 335), "căng thẳng hoặc dùng thuốc giảm đau gần đây.", font=get_font(11), fill=(120, 53, 15))
    draw.text((45, 355), "✓ KHÔNG ĐỒNG NGHĨA tổn thương gan nghiêm trọng.", font=get_font(11, bold=True), fill=(180, 83, 9))

    # Step 3: Empower (2 questions)
    draw.rounded_rectangle([35, 395, W - 35, 595], radius=10, fill=(238, 242, 255))
    draw.text((45, 403), "3. 2 CÂU HỎI TRỌNG TÂM NÊN HỎI BÁC SĨ MAI:", font=get_font(11, bold=True), fill=(67, 56, 202))
    
    draw.rounded_rectangle([45, 430, W - 45, 500], radius=8, fill=(255, 255, 255), outline=(199, 210, 254), width=1)
    draw.text((55, 438), "Câu 1: \"Thưa bác sĩ, men gan tôi hơi nhích", font=get_font(11, bold=True), fill=(30, 41, 59))
    draw.text((55, 458), "nhẹ có liên quan đến thuốc/sinh hoạt gần đây?\"", font=get_font(11), fill=(51, 65, 85))

    draw.rounded_rectangle([45, 510, W - 45, 580], radius=8, fill=(255, 255, 255), outline=(199, 210, 254), width=1)
    draw.text((55, 518), "Câu 2: \"Tôi cần điều chỉnh thói quen ăn uống", font=get_font(11, bold=True), fill=(30, 41, 59))
    draw.text((55, 538), "hay cần làm thêm siêu âm kiểm tra không?\"", font=get_font(11), fill=(51, 65, 85))

    # Chat Input
    draw.rounded_rectangle([25, 630, W - 25, 680], radius=24, fill=(241, 245, 249), outline=(203, 213, 225), width=1)
    draw.text((45, 645), "Hỏi thêm về kết quả xét nghiệm...", font=get_font(12), fill=(148, 163, 184))
    draw.rounded_rectangle([W - 65, 635, W - 35, 675], radius=20, fill=(32, 166, 154))
    draw.text((W - 55, 645), "➤", font=get_font(12, bold=True), fill=(255, 255, 255))

    img.save('slides/images/prototype_mockup_2.png')
    print('Created slides/images/prototype_mockup_2.png')

# -----------------------------------------------------------------------------
# 4. Slide 06 Prototype Mockup 3: Cảnh báo Cấp cứu Red-Flag Interception
# -----------------------------------------------------------------------------
def create_prototype_mockup_redflag():
    W, H = 420, 720
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    draw_phone_frame(draw, 10, 10, W - 20, H - 20, bg_color=(254, 242, 242))

    # Emergency Header
    draw.rectangle([13, 38, W - 13, 95], fill=(225, 29, 72))
    draw.text((28, 52), "🚨 CẢNH BÁO CẤP CỨU Y TẾ", font=get_font(16, bold=True), fill=(255, 255, 255))
    draw.text((28, 74), "Hệ thống tự động ngắt luồng AI (< 1.0s)", font=get_font(12), fill=(254, 205, 211))

    # Flashing Alert Box
    draw.rounded_rectangle([25, 115, W - 25, 340], radius=16, fill=(255, 255, 255), outline=(225, 29, 72), width=3)
    draw.text((40, 135), "PHÁT HIỆN TRIỆU CHỨNG NGUY KỊCH:", font=get_font(14, bold=True), fill=(225, 29, 72))
    draw.rounded_rectangle([40, 165, W - 40, 205], radius=8, fill=(255, 228, 230))
    draw.text((50, 175), "Từ khóa chặn: \"Đau thắt ngực, khó thở dữ dội\"", font=get_font(12, bold=True), fill=(159, 18, 57))

    draw.text((40, 225), "Bạn đang có dấu hiệu cần can thiệp y tế khẩn cấp.", font=get_font(12, bold=True), fill=(15, 23, 42))
    draw.text((40, 250), "TUYỆT ĐỐI KHÔNG tiếp tục ngồi chờ đọc kết quả.", font=get_font(12), fill=(71, 85, 105))
    draw.text((40, 275), "Hãy báo ngay cho Điều dưỡng tại sảnh hoặc", font=get_font(12), fill=(71, 85, 105))
    draw.text((40, 295), "bấm nút gọi khẩn cấp phía dưới!", font=get_font(12, bold=True), fill=(225, 29, 72))

    # Big CTA Hotline Vinmec
    draw.rounded_rectangle([30, 370, W - 30, 440], radius=14, fill=(225, 29, 72))
    draw.text((65, 385), "📞 GỌI CẤP CỨU VINMEC", font=get_font(15, bold=True), fill=(255, 255, 255))
    draw.text((125, 410), "1900 23 23 89", font=get_font(18, bold=True), fill=(254, 205, 211))

    # Big CTA 115
    draw.rounded_rectangle([30, 460, W - 30, 530], radius=14, fill=(15, 23, 42))
    draw.text((85, 475), "🚑 GỌI CẤP CỨU 115", font=get_font(15, bold=True), fill=(255, 255, 255))
    draw.text((160, 500), "Bấm gọi ngay", font=get_font(13), fill=(148, 163, 184))

    # Safe notice
    draw.rounded_rectangle([30, 560, W - 30, 670], radius=12, fill=(255, 255, 255), outline=(226, 232, 240), width=1)
    draw.text((45, 575), "🛡️ Rào chắn an toàn phi lâm sàng:", font=get_font(12, bold=True), fill=(30, 41, 59))
    draw.text((45, 600), "• Tự động ngắt kết nối LLM tránh ảo giác tư vấn sai.", font=get_font(11), fill=(100, 116, 139))
    draw.text((45, 620), "• Tuân thủ nghiêm ngặt Luật Khám chữa bệnh 2023.", font=get_font(11), fill=(100, 116, 139))
    draw.text((45, 640), "• Định vị công cụ chỉ hỗ trợ giao tiếp và triage.", font=get_font(11), fill=(100, 116, 139))

    img.save('slides/images/prototype_mockup_3.png')
    print('Created slides/images/prototype_mockup_3.png')

if __name__ == '__main__':
    create_slide1_evidence()
    create_prototype_mockup_results()
    create_prototype_mockup_chat()
    create_prototype_mockup_redflag()
