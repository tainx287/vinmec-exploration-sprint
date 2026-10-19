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
        Hệ thống phát hiện dấu hiệu nguy kịch cần can thiệp y khoa <strong>NGAY LẬP TỨC</strong>. Để đảm bảo an toàn sinh mạng, Trợ lý Care Navigator đã tự động khóa luồng trò chuyện.
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
  module.exports = { detectRedFlags, renderEmergencyCard, RED_FLAG_DICTIONARY };
}
