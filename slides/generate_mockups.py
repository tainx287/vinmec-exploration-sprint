"""
generate_mockups.py
Tạo các hình ảnh mockup trực quan sắc nét, tỷ lệ dọc chuẩn smartphone (9:19.4)
với Dynamic Island phồng bo tròn tự nhiên và khử định danh y tế chuẩn NĐ 13/2023.
"""

import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs('slides/images', exist_ok=True)

def get_font(size, bold=False):
    try:
        font_name = 'segoeui.ttf' if not bold else 'segoeuib.ttf'
        return ImageFont.truetype(f'C:/Windows/Fonts/{font_name}', size)
    except:
        return ImageFont.load_default()

def draw_phone_frame(draw, x, y, w, h, bg_color=(15, 23, 42)):
    # Viền máy bo góc chuẩn điện thoại (radius 44)
    radius = 44
    draw.rounded_rectangle([x, y, x + w, y + h], radius=radius, fill=bg_color, outline=(71, 85, 105), width=3)
    
    # Dynamic Island chuẩn: phồng cân đối (120px x 28px, bo tròn 14px)
    notch_w, notch_h = 120, 28
    notch_x = x + (w - notch_w) // 2
    notch_y = y + 12
    draw.rounded_rectangle([notch_x, notch_y, notch_x + notch_w, notch_y + notch_h], radius=14, fill=(10, 15, 28))
    # Chấm camera cảm biến & loa thoại
    draw.ellipse([notch_x + 18, notch_y + 7, notch_x + 32, notch_y + 21], fill=(20, 30, 48))
    draw.ellipse([notch_x + notch_w - 32, notch_y + 9, notch_x + notch_w - 22, notch_y + 19], fill=(20, 30, 48))
    
    # Thanh hiển thị pin & giờ
    f_stat = get_font(12, bold=True)
    draw.text((x + 32, y + 17), "09:41", font=f_stat, fill=(148, 163, 184))
    draw.text((x + w - 54, y + 17), "5G 98%", font=f_stat, fill=(148, 163, 184))


# -----------------------------------------------------------------------------
# 1. Slide 01 Evidence: Bảng kết quả thực tế MyVinmec kèm khoanh đỏ cảnh báo
# -----------------------------------------------------------------------------
def create_slide1_evidence():
    W, H = 400, 840
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    draw_phone_frame(draw, 10, 10, W - 20, H - 20, bg_color=(248, 250, 252))

    # Header MyVinmec Teal
    draw.rectangle([13, 46, W - 13, 118], fill=(32, 166, 154))
    draw.text((28, 62), "Hồ Sơ Sức Khỏe • MyVinmec", font=get_font(16, bold=True), fill=(255, 255, 255))
    draw.text((28, 88), "Bệnh viện ĐKQT Vinmec Times City", font=get_font(12), fill=(224, 242, 241))

    # Info card bệnh nhân khử định danh
    draw.rounded_rectangle([22, 130, W - 22, 200], radius=12, fill=(255, 255, 255), outline=(226, 232, 240), width=1)
    draw.text((34, 140), "Bệnh nhân: N.V.A (Nam - 32t) • Khử định danh", font=get_font(12, bold=True), fill=(30, 41, 59))
    draw.text((34, 160), "Hồ sơ ca khám lâm sàng tham chiếu (NĐ 13/2023)", font=get_font(11), fill=(100, 116, 139))
    draw.text((34, 178), "Bác sĩ chỉ định: BS.CKII Trần Thị Mai • P.302", font=get_font(11), fill=(15, 118, 110))

    # Section title
    draw.text((25, 212), "KẾT QUẢ XÉT NGHIỆM SINH HÓA MÁU", font=get_font(13, bold=True), fill=(15, 23, 42))

    # Table Header
    draw.rounded_rectangle([22, 234, W - 22, 268], radius=6, fill=(241, 245, 249))
    draw.text((32, 244), "Chỉ số", font=get_font(11, bold=True), fill=(71, 85, 105))
    draw.text((150, 244), "Kết quả", font=get_font(11, bold=True), fill=(71, 85, 105))
    draw.text((245, 244), "Tham chiếu", font=get_font(11, bold=True), fill=(71, 85, 105))
    draw.text((335, 244), "Đơn vị", font=get_font(11, bold=True), fill=(71, 85, 105))

    rows = [
        ("AST (SGOT)", "52.0  H", "< 40", "U/L", True),
        ("ALT (SGPT)", "58.0  H", "< 40", "U/L", True),
        ("HbA1c", "6.1   H", "4.0 - 5.6", "%", True),
        ("Glucose lúc đói", "5.2", "3.9 - 6.4", "mmol/L", False),
        ("Creatinine", "85.0", "62 - 106", "µmol/L", False),
        ("Acid Uric", "380.0", "200 - 420", "µmol/L", False),
    ]

    y_t = 276
    for name, val, ref, unit, is_high in rows:
        draw.line([22, y_t + 36, W - 22, y_t + 36], fill=(241, 245, 249), width=1)
        draw.text((32, y_t + 8), name, font=get_font(12, bold=is_high), fill=(15, 23, 42) if not is_high else (225, 29, 72))
        draw.text((150, y_t + 8), val, font=get_font(12, bold=is_high), fill=(225, 29, 72) if is_high else (16, 185, 129))
        draw.text((245, y_t + 8), ref, font=get_font(12), fill=(100, 116, 139))
        draw.text((335, y_t + 8), unit, font=get_font(12), fill=(100, 116, 139))
        y_t += 40

    # KHOANH VÙNG ĐỎ "BẰNG CHỨNG TỘI PHẠM" (Crime Scene Callout)
    draw.rounded_rectangle([25, 274, 235, 356], radius=10, outline=(239, 68, 68), width=3)

    # Banner cảnh báo đỏ
    draw.rounded_rectangle([22, 535, W - 22, 675], radius=14, fill=(254, 242, 242), outline=(248, 113, 113), width=2)
    draw.text((34, 548), "⚠️ ĐIỂM MÙ TRẢI NGHIỆM GÂY SCANXIETY:", font=get_font(12, bold=True), fill=(185, 28, 28))
    draw.text((34, 574), "• Chữ viết tắt y khoa khó hiểu, không có giải thích.", font=get_font(11), fill=(153, 27, 27))
    draw.text((34, 596), "• Chỉ số bôi đỏ [H] khiến bệnh nhân hoảng sợ.", font=get_font(11), fill=(153, 27, 27))
    draw.text((34, 618), "• Không có dải tham chiếu phân biệt nhẹ vs nặng.", font=get_font(11), fill=(153, 27, 27))
    draw.text((34, 642), "👉 Hậu quả: Bệnh nhân lập tức mở Google tự tra cứu!", font=get_font(11, bold=True), fill=(185, 28, 28))

    # Bottom action bar
    draw.rounded_rectangle([30, 715, W - 30, 770], radius=12, fill=(30, 41, 59))
    draw.text((70, 732), "Tải Bản Scan PDF Báo Cáo A4", font=get_font(13, bold=True), fill=(255, 255, 255))

    img.save('slides/images/myvinmec_evidence.png')
    print('Created slides/images/myvinmec_evidence.png')


# -----------------------------------------------------------------------------
# 2. Slide 06 Prototype Mockup 1: Thẻ kết quả 3 màu (Results Screen)
# -----------------------------------------------------------------------------
def create_prototype_mockup_results():
    W, H = 400, 840
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    draw_phone_frame(draw, 10, 10, W - 20, H - 20, bg_color=(241, 245, 249))

    # App Header
    draw.rectangle([13, 46, W - 13, 112], fill=(32, 166, 154))
    draw.text((28, 62), "← Kết Quả Cận Lâm Sàng", font=get_font(15, bold=True), fill=(255, 255, 255))
    draw.text((28, 86), "Phòng khám 302 • BS.CKII Trần Thị Mai", font=get_font(11), fill=(204, 251, 241))

    # Live Waiting Badge
    draw.rounded_rectangle([22, 122, W - 22, 172], radius=10, fill=(255, 255, 255), outline=(203, 213, 225), width=1)
    draw.text((34, 132), "⏱️ Đang chờ gọi khám: Còn ~15 phút", font=get_font(12, bold=True), fill=(15, 23, 42))
    draw.text((34, 150), "Số thứ tự: 18 · Hiện tại đang phục vụ số 16", font=get_font(11), fill=(100, 116, 139))

    # Result Card 1 (ALT - Amber)
    draw.rounded_rectangle([22, 185, W - 22, 290], radius=12, fill=(255, 255, 255), outline=(251, 191, 36), width=2)
    draw.rounded_rectangle([W - 110, 195, W - 32, 220], radius=6, fill=(254, 243, 199))
    draw.text((W - 102, 200), "HƠI NHÍCH NHẸ", font=get_font(9, bold=True), fill=(180, 83, 9))
    draw.text((34, 196), "Men gan ALT (SGPT)", font=get_font(13, bold=True), fill=(15, 23, 42))
    draw.text((34, 220), "58.0 U/L", font=get_font(20, bold=True), fill=(217, 119, 6))
    draw.text((140, 226), "Ngưỡng chuẩn: < 40 U/L", font=get_font(11), fill=(100, 116, 139))
    draw.text((34, 254), "💡 Tăng nhẹ phổ biến do thức khuya, dùng thuốc.", font=get_font(10), fill=(71, 85, 105))

    # Result Card 2 (AST - Amber)
    draw.rounded_rectangle([22, 302, W - 22, 407], radius=12, fill=(255, 255, 255), outline=(251, 191, 36), width=2)
    draw.rounded_rectangle([W - 110, 312, W - 32, 337], radius=6, fill=(254, 243, 199))
    draw.text((W - 102, 317), "HƠI NHÍCH NHẸ", font=get_font(9, bold=True), fill=(180, 83, 9))
    draw.text((34, 313), "Men gan AST (SGOT)", font=get_font(13, bold=True), fill=(15, 23, 42))
    draw.text((34, 337), "52.0 U/L", font=get_font(20, bold=True), fill=(217, 119, 6))
    draw.text((140, 343), "Ngưỡng chuẩn: < 40 U/L", font=get_font(11), fill=(100, 116, 139))
    draw.text((34, 371), "💡 Không đồng nghĩa tổn thương gan nghiêm trọng.", font=get_font(10), fill=(71, 85, 105))

    # Result Card 3 (Creatinine - Green)
    draw.rounded_rectangle([22, 419, W - 22, 510], radius=12, fill=(255, 255, 255), outline=(52, 211, 153), width=2)
    draw.rounded_rectangle([W - 95, 429, W - 32, 454], radius=6, fill=(209, 250, 229))
    draw.text((W - 88, 434), "RẤT TỐT", font=get_font(9, bold=True), fill=(4, 120, 87))
    draw.text((34, 430), "Chức năng thận Creatinine", font=get_font(13, bold=True), fill=(15, 23, 42))
    draw.text((34, 453), "85.0 µmol/L", font=get_font(18, bold=True), fill=(5, 150, 105))
    draw.text((150, 458), "Dải chuẩn: 62 - 106", font=get_font(11), fill=(100, 116, 139))
    draw.text((34, 482), "✓ Tốc độ lọc cầu thận hoàn toàn ổn định.", font=get_font(10), fill=(71, 85, 105))

    # Result Card 4 (HbA1c - Amber Border)
    draw.rounded_rectangle([22, 522, W - 22, 613], radius=12, fill=(255, 255, 255), outline=(251, 191, 36), width=2)
    draw.rounded_rectangle([W - 110, 532, W - 32, 557], radius=6, fill=(254, 243, 199))
    draw.text((W - 102, 537), "RANH GIỚI", font=get_font(9, bold=True), fill=(180, 83, 9))
    draw.text((34, 533), "Đường huyết HbA1c", font=get_font(13, bold=True), fill=(15, 23, 42))
    draw.text((34, 556), "6.1 %", font=get_font(18, bold=True), fill=(217, 119, 6))
    draw.text((120, 561), "Chuẩn: 4.0 - 5.6%", font=get_font(11), fill=(100, 116, 139))
    draw.text((34, 585), "💡 Tiền đái tháo đường, điều chỉnh được qua ăn uống.", font=get_font(10), fill=(71, 85, 105))

    # Bottom CTA Button
    draw.rounded_rectangle([26, 715, W - 26, 775], radius=14, fill=(32, 166, 154))
    draw.text((45, 735), "🤖 Nhờ AI MIA Giải Thích & Soạn Câu Hỏi BS", font=get_font(12, bold=True), fill=(255, 255, 255))

    img.save('slides/images/prototype_mockup_1.png')
    print('Created slides/images/prototype_mockup_1.png')


# -----------------------------------------------------------------------------
# 3. Slide 06 Prototype Mockup 2: Khung Chat Trợ Lý MIA In-Context
# -----------------------------------------------------------------------------
def create_prototype_mockup_chat():
    W, H = 400, 840
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    draw_phone_frame(draw, 10, 10, W - 20, H - 20, bg_color=(248, 250, 252))

    # Header MIA Drawer
    draw.rounded_rectangle([13, 46, W - 13, 115], radius=14, fill=(255, 255, 255), outline=(226, 232, 240), width=1)
    draw.text((28, 60), "🤖 Trợ lý sức khoẻ AI MIA", font=get_font(15, bold=True), fill=(32, 166, 154))
    draw.text((28, 84), "In-Context · Neo vào xét nghiệm P.302 BS Mai", font=get_font(11), fill=(100, 116, 139))
    draw.text((W - 38, 62), "✕", font=get_font(15), fill=(148, 163, 184))

    # User bubble
    draw.rounded_rectangle([W - 245, 128, W - 25, 168], radius=12, fill=(32, 166, 154))
    draw.text((W - 235, 140), "Các chỉ số của tôi có ý nghĩa là gì?", font=get_font(11, bold=True), fill=(255, 255, 255))

    # MIA Response Card (Translate - Contextualize - Empower)
    draw.rounded_rectangle([20, 180, W - 20, 700], radius=14, fill=(255, 255, 255), outline=(226, 232, 240), width=1)

    # Step 1: Translate
    draw.rounded_rectangle([30, 195, W - 30, 290], radius=10, fill=(240, 253, 250))
    draw.text((40, 205), "1. DỊCH THUẬT NGỮ ĐỜI THƯỜNG", font=get_font(11, bold=True), fill=(15, 118, 110))
    draw.text((40, 228), "AST & ALT là 2 enzym bình thường trong tế bào gan.", font=get_font(11), fill=(51, 65, 85))
    draw.text((40, 250), "Khi gan làm việc nhiều, enzym tiết nhẹ vào máu", font=get_font(11), fill=(51, 65, 85))
    draw.text((40, 268), "khiến chỉ số nhích lên cao hơn chuẩn một chút.", font=get_font(11), fill=(51, 65, 85))

    # Step 2: Contextualize
    draw.rounded_rectangle([30, 302, W - 30, 422], radius=10, fill=(254, 243, 199))
    draw.text((40, 312), "2. ĐỊNH KHUNG MỨC ĐỘ AN TOÀN", font=get_font(11, bold=True), fill=(180, 83, 9))
    draw.text((40, 335), "Chỉ số 52 và 58 U/L là mức tăng nhẹ, rất phổ biến", font=get_font(11), fill=(120, 53, 15))
    draw.text((40, 355), "do thức khuya, căng thẳng hoặc dùng thuốc giảm đau.", font=get_font(11), fill=(120, 53, 15))
    draw.text((40, 375), "Mức này KHÔNG ĐỒNG NGHĨA với tổn thương gan cấp.", font=get_font(11, bold=True), fill=(180, 83, 9))
    draw.text((40, 397), "Các chỉ số Thận & Đường huyết của bạn đều rất chuẩn.", font=get_font(10), fill=(120, 53, 15))

    # Step 3: Empower (2 questions)
    draw.rounded_rectangle([30, 434, W - 30, 680], radius=10, fill=(238, 242, 255))
    draw.text((40, 444), "3. 2 CÂU HỎI TRỌNG TÂM NÊN HỎI BÁC SĨ MAI:", font=get_font(11, bold=True), fill=(67, 56, 202))
    
    draw.rounded_rectangle([38, 470, W - 38, 560], radius=8, fill=(255, 255, 255), outline=(199, 210, 254), width=1)
    draw.text((46, 480), "Câu 1: \"Thưa bác sĩ, men gan tôi hơi nhích", font=get_font(11, bold=True), fill=(30, 41, 59))
    draw.text((46, 502), "nhẹ có liên quan đến thuốc hay thói quen sinh", font=get_font(11), fill=(51, 65, 85))
    draw.text((46, 524), "hoạt gần đây không ạ?\"", font=get_font(11), fill=(51, 65, 85))

    draw.rounded_rectangle([38, 574, W - 38, 664], radius=8, fill=(255, 255, 255), outline=(199, 210, 254), width=1)
    draw.text((46, 584), "Câu 2: \"Với HbA1c 6.1%, tôi cần điều chỉnh", font=get_font(11, bold=True), fill=(30, 41, 59))
    draw.text((46, 606), "thói quen ăn uống thế nào hay có cần làm thêm", font=get_font(11), fill=(51, 65, 85))
    draw.text((46, 628), "siêu âm kiểm tra gan không ạ?\"", font=get_font(11), fill=(51, 65, 85))

    # Chat Input
    draw.rounded_rectangle([20, 715, W - 20, 765], radius=24, fill=(241, 245, 249), outline=(203, 213, 225), width=1)
    draw.text((38, 730), "Hỏi thêm về chỉ số xét nghiệm...", font=get_font(11), fill=(148, 163, 184))
    draw.rounded_rectangle([W - 60, 720, W - 30, 760], radius=20, fill=(32, 166, 154))
    draw.text((W - 50, 730), "➤", font=get_font(12, bold=True), fill=(255, 255, 255))

    img.save('slides/images/prototype_mockup_2.png')
    print('Created slides/images/prototype_mockup_2.png')


# -----------------------------------------------------------------------------
# 4. Slide 06 Prototype Mockup 3: Cảnh báo Cấp cứu Red-Flag Interception
# -----------------------------------------------------------------------------
def create_prototype_mockup_redflag():
    W, H = 400, 840
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    draw_phone_frame(draw, 10, 10, W - 20, H - 20, bg_color=(254, 242, 242))

    # Emergency Header
    draw.rectangle([13, 46, W - 13, 115], fill=(225, 29, 72))
    draw.text((28, 62), "🚨 CẢNH BÁO CẤP CỨU Y TẾ", font=get_font(15, bold=True), fill=(255, 255, 255))
    draw.text((28, 86), "Hệ thống tự động ngắt luồng AI (< 1.0s)", font=get_font(11), fill=(254, 205, 211))

    # Flashing Alert Box
    draw.rounded_rectangle([22, 130, W - 22, 380], radius=16, fill=(255, 255, 255), outline=(225, 29, 72), width=3)
    draw.text((36, 148), "PHÁT HIỆN DẤU HIỆU NGUY KỊCH:", font=get_font(13, bold=True), fill=(225, 29, 72))
    
    draw.rounded_rectangle([36, 180, W - 36, 225], radius=8, fill=(255, 228, 230))
    draw.text((46, 194), "Từ khóa chặn: \"Đau thắt ngực, khó thở dữ dội\"", font=get_font(11, bold=True), fill=(159, 18, 57))

    draw.text((36, 245), "Bạn đang có triệu chứng cần cấp cứu y tế ngay.", font=get_font(12, bold=True), fill=(15, 23, 42))
    draw.text((36, 272), "TUYỆT ĐỐI KHÔNG tiếp tục ngồi chờ đọc kết quả.", font=get_font(11), fill=(71, 85, 105))
    draw.text((36, 296), "Hãy báo ngay cho Điều dưỡng trực tại sảnh hoặc", font=get_font(11), fill=(71, 85, 105))
    draw.text((36, 318), "bấm các nút gọi khẩn cấp bên dưới!", font=get_font(11, bold=True), fill=(225, 29, 72))
    draw.text((36, 344), "Thời gian vàng can thiệp là yếu tố sống còn.", font=get_font(10), fill=(100, 116, 139))

    # Big CTA Hotline Vinmec
    draw.rounded_rectangle([26, 410, W - 26, 490], radius=14, fill=(225, 29, 72))
    draw.text((60, 428), "📞 GỌI CẤP CỨU VINMEC", font=get_font(14, bold=True), fill=(255, 255, 255))
    draw.text((120, 454), "1900 23 23 89", font=get_font(18, bold=True), fill=(254, 205, 211))

    # Big CTA 115
    draw.rounded_rectangle([26, 510, W - 26, 585], radius=14, fill=(15, 23, 42))
    draw.text((85, 528), "🚑 GỌI CẤP CỨU 115", font=get_font(14, bold=True), fill=(255, 255, 255))
    draw.text((150, 552), "Bấm để gọi ngay", font=get_font(12), fill=(148, 163, 184))

    # Safe notice
    draw.rounded_rectangle([26, 610, W - 26, 755], radius=12, fill=(255, 255, 255), outline=(226, 232, 240), width=1)
    draw.text((38, 626), "🛡️ Rào chắn an toàn phi lâm sàng:", font=get_font(11, bold=True), fill=(30, 41, 59))
    draw.text((38, 650), "• Tự động ngắt kết nối LLM tránh ảo giác tư vấn sai.", font=get_font(10), fill=(100, 116, 139))
    draw.text((38, 672), "• Tuân thủ nghiêm ngặt Luật Khám chữa bệnh 2023.", font=get_font(10), fill=(100, 116, 139))
    draw.text((38, 694), "• Không bao giờ thay thế phản xạ lâm sàng thực tế.", font=get_font(10), fill=(100, 116, 139))
    draw.text((38, 716), "• Định vị công cụ chỉ hỗ trợ giao tiếp và triage.", font=get_font(10), fill=(100, 116, 139))

    img.save('slides/images/prototype_mockup_3.png')
    print('Created slides/images/prototype_mockup_3.png')

if __name__ == '__main__':
    create_slide1_evidence()
    create_prototype_mockup_results()
    create_prototype_mockup_chat()
    create_prototype_mockup_redflag()
