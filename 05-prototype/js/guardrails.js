/**
 * Guardrails & Clinical Escalation Protocol for MyVinmec Care Navigator
 * Tuân thủ quy chuẩn y tế nghiêm ngặt: Phản hồi < 100ms, Hard-Stop mọi luồng chat khi gặp Red-Flag
 */

const RED_FLAG_DICTIONARY = [
  // Tim mạch & Đau ngực
  { pattern: /đau\s*(thắt\s*)?ngực/i, label: "Đau thắt ngực cấp" },
  { pattern: /tức\s*ngực/i, label: "Tức ngực đè nặng" },
  { pattern: /nghẹt\s*thở|khó\s*thở(\s*dữ\s*dội)?/i, label: "Khó thở cấp tính" },
  { pattern: /thở\s*dốc|thở\s*không\s*ra\s*hơi/i, label: "Hụt hơi suy hô hấp" },
  { pattern: /vã\s*mồ\s*hôi\s*lạnh/i, label: "Vã mồ hôi lạnh kèm choáng" },
  
  // Đột quỵ (FAST Protocol)
  { pattern: /méo\s*miệng|lệch\s*mặt/i, label: "Méo miệng đột ngột" },
  { pattern: /liệt(\s*nửa\s*người|\s*mặt|\s*tay|\s*chân)?/i, label: "Liệt vận động" },
  { pattern: /yếu\s*(tay|chân)(\s*một\s*bên)?/i, label: "Yếu tay chân một bên" },
  { pattern: /nói\s*ngọng|mất\s*tiếng\s*đột\s*ngột/i, label: "Rối loạn ngôn ngữ cấp" },
  { pattern: /mất\s*thị\s*lực|nhìn\s*đôi|mù\s*đột\s*ngột/i, label: "Mất thị lực cấp tính" },
  { pattern: /đau\s*đầu\s*dữ\s*dội(\s*như\s*sét\s*đánh)?/i, label: "Đau đầu dữ dội nghi xuất huyết" },

  // Rối loạn tri giác & Co giật
  { pattern: /ngất(\s*xỉu)?|bất\s*tỉnh|mất\s*ý\s*thức/i, label: "Ngất mất ý thức" },
  { pattern: /co\s*giật|sùi\s*bọt\s*mép/i, label: "Co giật nghi động kinh" },
  { pattern: /hôn\s*mê|lơ\s*mơ|li\s*bì/i, label: "Hôn mê lơ mơ" },

  // Chảy máu cấp
  { pattern: /nôn\s*(ra\s*)?máu/i, label: "Nôn ra máu" },
  { pattern: /ho\s*(ra\s*)?máu/i, label: "Ho ra máu tươi" },
  { pattern: /chảy\s*máu\s*không\s*cầm/i, label: "Xuất huyết không cầm được" },

  // Khủng hoảng tâm lý & Tự hại
  { pattern: /tự\s*tử|tự\s*sát|kết\s*thúc\s*cuộc\s*đời/i, label: "Ý định tự tử khẩn cấp" },
  { pattern: /tự\s*hại|không\s*muốn\s*sống\s*nữa/i, label: "Nguy cơ tự hại" }
];

/**
 * Kiểm tra xem câu hỏi có chứa dấu hiệu cảnh báo đỏ nguy kịch không
 * @param {string} text 
 * @returns {object|null} Chi tiết red-flag nếu phát hiện, null nếu an toàn
 */
function detectRedFlags(text) {
  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim();

  for (const item of RED_FLAG_DICTIONARY) {
    if (item.pattern.test(trimmed)) {
      return {
        isEmergency: true,
        detectedLabel: item.label,
        timestamp: new Date().toISOString()
      };
    }
  }

  return null;
}

/**
 * BỘ TỪ KHÓA NHẬN DIỆN CÂU HỎI ĐỊNH DANH & TÍNH NĂNG (IDENTITY & ROLE FALLBACK)
 * Quy tắc:
 * 1. Chỉ giới hạn nhắc đến Lab Coach Nguyễn Xuân Tài 1 lần duy nhất ở đầu session cho câu hỏi "Bạn là ai".
 * 2. Đối với "Bạn có thể làm gì", bỏ qua tên tác giả, giải thích ngắn gọn 3 việc thiết thực (Dịch thuật ngữ, Định khung an toàn, Soạn câu hỏi).
 * 3. Tuyệt đối không đính kèm 2 câu hỏi bác sĩ thừa thãi hay gợi ý bấm nút máy móc.
 */
const WHO_ARE_YOU_PATTERNS = [
  /bạn\s*(là|la)\s*(ai|gì|gi)/i,
  /bạn\s*tên\s*(là\s*)?gì/i,
  /mày\s*(là|la)\s*(ai|gì)/i,
  /who\s*are\s*you/i,
  /ai\s*(tạo|làm|viết|code|dựng)\s*ra\s*bạn/i,
  /nguồn\s*gốc\s*(của\s*)?bạn/i,
  /giới\s*thiệu\s*(về\s*)?bạn/i
];

const WHAT_CAN_YOU_DO_PATTERNS = [
  /bạn\s*(có\s*thể\s*)?làm\s*(được\s*)?(gì|gi)/i,
  /bạn\s*có\s*(tác\s*dụng|tính\s*năng|vai\s*trò|nhiệm\s*vụ|chức\s*năng)\s*(gì|gi)/i,
  /bạn\s*(giúp|hỗ\s*trợ)\s*(được\s*)?(gì|gi)/i,
  /what\s*(can\s*you\s*do|is\s*your\s*purpose)/i,
  /tác\s*dụng\s*của\s*bạn/i,
  /chức\s*năng\s*của\s*bạn/i,
  /bạn\s*biết\s*làm\s*gì/i
];

/**
 * Kiểm tra xem câu hỏi có phải hỏi về danh tính / tác dụng của bot không
 */
function detectIdentityQuestion(text) {
  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim();

  // 1. Kiểm tra câu hỏi "Bạn là ai?"
  for (const pattern of WHO_ARE_YOU_PATTERNS) {
    if (pattern.test(trimmed)) {
      let alreadyMentioned = false;
      try {
        alreadyMentioned = !!sessionStorage.getItem("vinmec_author_mentioned");
      } catch (e) {
        alreadyMentioned = false;
      }

      let introText = "";
      if (!alreadyMentioned) {
        try {
          sessionStorage.setItem("vinmec_author_mentioned", "1");
        } catch (e) {}
        introText = `Chào bạn! Tôi là <strong>Trợ lý AI MIA (bản mô phỏng nghiên cứu)</strong>, thuộc đề án AI Y tế thực chiến của Lab Coach Nguyễn Xuân Tài. Tôi giúp bạn đọc hiểu nhanh ý nghĩa đời thường của các chỉ số cận lâm sàng và chuẩn bị sẵn các câu hỏi trọng tâm trước khi vào phòng khám.`;
      } else {
        introText = `Tôi là <strong>Trợ lý AI MIA</strong>, đồng hành hỗ trợ bạn đọc hiểu kết quả cận lâm sàng và giải tỏa lo lắng trong lúc chờ gặp Bác sĩ.`;
      }

      return {
        isIdentity: true,
        badge: "Trợ Lý AI MIA • Giới Thiệu",
        meaning: introText,
        questions: [],
        lifestyle: null,
        disclaimer: null
      };
    }
  }

  // 2. Kiểm tra câu hỏi "Bạn có thể làm gì?"
  for (const pattern of WHAT_CAN_YOU_DO_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isIdentity: true,
        badge: "Trợ Lý AI MIA • Tính Năng Đồng Hành",
        meaning: `Tôi giúp bạn 3 việc thiết thực ngay trong lúc chờ khám:<br><br>
1. <strong>Dịch thuật ngữ y khoa:</strong> Giải thích các chữ viết tắt (như AST, ALT, HbA1c...) sang ngôn ngữ đời thường, dễ hiểu.<br>
2. <strong>Định khung mức độ (De-escalate):</strong> Giúp bạn hiểu vì sao chỉ số nhích nhẹ mà không vội hoảng sợ tra Google.<br>
3. <strong>Soạn sẵn câu hỏi cho Bác sĩ:</strong> Chuẩn bị 2 câu hỏi trọng tâm để bạn tận dụng tối đa 10–15 phút trao đổi cùng Bác sĩ.<br><br>
Anh/chị có thể hỏi em về bất kỳ chỉ số nào trên màn hình hoặc gõ thắc mắc của mình nhé!`,
        questions: [],
        lifestyle: null,
        disclaimer: null
      };
    }
  }

  return null;
}

/**
 * Sinh mã HTML hiển thị Thẻ Cảnh Báo Khẩn Cấp Chuẩn Vinmec
 */
function renderEmergencyCard(flagInfo) {
  return `
    <div class="emergency-card-red animate-shake">
      <div class="emergency-header">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span>🚨 BÁO ĐỘNG ĐỎ CẤP CỨU Y TẾ!</span>
      </div>

      <div class="emergency-badge-tag">
        Dấu hiệu nhận diện: <strong>${flagInfo.detectedLabel || 'Triệu chứng nguy kịch'}</strong>
      </div>

      <div class="emergency-text">
        Hệ thống phát hiện dấu hiệu nguy kịch cần can thiệp y khoa <strong>NGAY LẬP TỨC</strong>. Để đảm bảo an toàn sinh mạng, Trợ lý AI MIA đã tự động khóa luồng trò chuyện.
      </div>
      
      <a href="tel:1900232389" class="hotline-action-btn primary-hotline">
        📞 GỌI CẤP CỨU VINMEC: 1900 23 23 89
      </a>
      
      <a href="tel:115" class="hotline-action-btn secondary-hotline">
        🚑 GỌI CẤP CỨU QUỐC GIA: 115
      </a>

      <div class="emergency-guide-box">
        👉 <strong>Nếu bạn đang có mặt tại Vinmec:</strong> Báo ngay cho nhân viên điều dưỡng, bảo vệ hoặc di chuyển thẳng tới <strong>KHOA CẤP CỨU (TẦNG 1)</strong>.<br>
        👉 <em>Hãy ngồi nghỉ tại chỗ, nới lỏng cổ áo và nhờ người bên cạnh hỗ trợ. Tuyệt đối không tự điều khiển phương tiện giao thông.</em>
      </div>
    </div>
  `;
}

// Export cho môi trường Browser / Node
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { detectRedFlags, detectIdentityQuestion, renderEmergencyCard, RED_FLAG_DICTIONARY };
}
