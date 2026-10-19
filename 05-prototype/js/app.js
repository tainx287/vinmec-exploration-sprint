/**
 * Core Application Router, Navigation Flow & Smart FAB Controller
 * MyVinmec Mobile Simulator Prototype
 */

// LỊCH SỬ ĐIỀU HƯỚNG (NAVIGATION HISTORY STACK)
let navigationHistory = ["screen-home", "screen-records", "screen-result"];
let currentScreenId = "screen-result"; // Mặc định mở lên là trang báo kết quả cận lâm sàng theo yêu cầu

// CÁC THÔNG SỐ TITLE CHO TỪNG MÀN HÌNH
const SCREEN_TITLES = {
  "screen-home": { title: "MyVinmec", subtitle: "Hệ thống Y tế Quốc tế Vinmec", showBack: false, badge: "HOME" },
  "screen-records": { title: "Hồ Sơ Sức Khỏe", subtitle: "Lịch sử khám & Cận lâm sàng", showBack: true, badge: "RECORDS" },
  "screen-result": { title: "Chi Tiết Xét Nghiệm", subtitle: "Hồ sơ sức khỏe Vinmec Times City", showBack: true, badge: "LIVE MOCK" },
  "screen-booking": { title: "Đặt Lịch Khám", subtitle: "Chọn chuyên khoa & bác sĩ", showBack: true, badge: "BOOKING" },
  "screen-notifications": { title: "Thông Báo", subtitle: "Tin nhắn hệ thống & Lịch khám", showBack: true, badge: "NOTIF" },
  "screen-profile": { title: "Tài Khoản Cá Nhân", subtitle: "Thông tin & Cài đặt bảo mật", showBack: true, badge: "VIP" }
};

/**
 * Điều hướng mượt mà giữa tất cả các màn hình trong ứng dụng
 */
function navigateTo(screenId, pushHistory = true) {
  if (screenId === currentScreenId) return;

  const prevScreen = document.getElementById(currentScreenId);
  const nextScreen = document.getElementById(screenId);

  if (!nextScreen) {
    console.error(`Screen #${screenId} not found`);
    return;
  }

  if (pushHistory) {
    navigationHistory.push(screenId);
  }

  // Ẩn màn hình cũ, hiện màn hình mới
  if (prevScreen) prevScreen.classList.remove("active");
  nextScreen.classList.add("active");
  currentScreenId = screenId;

  // Cập nhật Top App Bar
  updateTopAppBar(screenId);

  // Cập nhật Bottom Navigation Bar
  updateBottomNavBar(screenId);

  // Cuộn lên đầu màn hình mới
  nextScreen.scrollTop = 0;

  // Reset Smart FAB
  resetSmartFab();
}

/**
 * Nút quay lại (Back Button '<' trên thanh App Bar)
 */
function goBack() {
  if (navigationHistory.length > 1) {
    navigationHistory.pop(); // Bỏ màn hình hiện tại
    const targetScreen = navigationHistory[navigationHistory.length - 1];
    navigateTo(targetScreen, false);
  } else {
    // Nếu hết stack, quay về Trang Hồ Sơ hoặc Trang Chủ
    navigateTo("screen-records", false);
  }
}

/**
 * Cập nhật thông tin tiêu đề và nút Back trên thanh Header
 */
function updateTopAppBar(screenId) {
  const config = SCREEN_TITLES[screenId] || { title: "MyVinmec", subtitle: "Vinmec Healthcare", showBack: true, badge: "MOCK" };
  
  document.getElementById("header-title").textContent = config.title;
  document.getElementById("header-subtitle").textContent = config.subtitle;
  document.getElementById("header-badge").textContent = config.badge;

  const btnBack = document.getElementById("btn-header-back");
  if (config.showBack) {
    btnBack.style.visibility = "visible";
  } else {
    btnBack.style.visibility = "hidden";
  }
}

/**
 * Cập nhật trạng thái Active trên 5 Tabs dưới chân trang
 */
function updateBottomNavBar(screenId) {
  document.querySelectorAll(".nav-tab-item").forEach(tab => tab.classList.remove("active"));

  if (screenId === "screen-home") {
    document.getElementById("tab-nav-home")?.classList.add("active");
  } else if (screenId === "screen-records" || screenId === "screen-result") {
    document.getElementById("tab-nav-records")?.classList.add("active");
  } else if (screenId === "screen-booking") {
    document.getElementById("tab-nav-booking")?.classList.add("active");
  } else if (screenId === "screen-notifications") {
    document.getElementById("tab-nav-notifications")?.classList.add("active");
  } else if (screenId === "screen-profile") {
    document.getElementById("tab-nav-profile")?.classList.add("active");
  }
}

/* ========================================================= */
/* CƠ CHẾ ẨN THÔNG MINH CHO NÚT HỎI TRỢ LÝ AI CARE NAVIGATOR */
/* ========================================================= */
let scrollTimeoutId = null;
let idleTimerId = null;

function setupSmartFab() {
  const fabContainer = document.getElementById("fab-main-container");
  if (!fabContainer) return;

  // Lắng nghe sự kiện cuộn trên tất cả các màn hình
  document.querySelectorAll(".app-screen").forEach(screen => {
    screen.addEventListener("scroll", () => {
      // 1. Khi người dùng bắt đầu cuộn: Thu nhỏ và làm mờ nút để không che bảng số liệu
      fabContainer.classList.add("scrolling");
      fabContainer.classList.remove("docked");

      if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
      if (idleTimerId) clearTimeout(idleTimerId);

      // 2. Khi người dùng dừng cuộn quá 1.2 giây: Phục hồi lại kích thước bình thường
      scrollTimeoutId = setTimeout(() => {
        fabContainer.classList.remove("scrolling");
        
        // 3. Nếu người dùng tiếp tục dừng cuộn và không chạm vào màn hình quá 10 giây:
        // Tự động thu gọn sang mép phải dạng tai thỏ nhỏ (Docked mode)
        idleTimerId = setTimeout(() => {
          fabContainer.classList.add("docked");
        }, 10000);

      }, 1200);
    }, { passive: true });
  });

  // Khi hover hoặc chạm vào nút: Phục hồi kích thước đầy đủ ngay lập tức
  fabContainer.addEventListener("mouseenter", () => {
    fabContainer.classList.remove("docked");
    fabContainer.classList.remove("scrolling");
    if (idleTimerId) clearTimeout(idleTimerId);
  });

  fabContainer.addEventListener("touchstart", () => {
    fabContainer.classList.remove("docked");
    fabContainer.classList.remove("scrolling");
  }, { passive: true });
}

function resetSmartFab() {
  const fabContainer = document.getElementById("fab-main-container");
  if (!fabContainer) return;
  fabContainer.classList.remove("scrolling");
  fabContainer.classList.remove("docked");
  if (idleTimerId) clearTimeout(idleTimerId);

  // Kích hoạt hẹn giờ nghỉ 10 giây
  idleTimerId = setTimeout(() => {
    fabContainer.classList.add("docked");
  }, 10000);
}

/* ========================================================= */
/* CHUYỂN ĐỔI CHẾ ĐỘ XEM TRÊN MÀN HÌNH KẾT QUẢ (A/B TESTING) */
/* ========================================================= */
function switchView(mode) {
  const rawPane = document.getElementById("view-raw-pdf");
  const nativePane = document.getElementById("view-native-ai");
  const rawBtn = document.getElementById("tab-btn-raw");
  const nativeBtn = document.getElementById("tab-btn-native");

  if (mode === "raw") {
    rawPane.classList.add("active");
    nativePane.classList.remove("active");
    rawBtn.classList.add("active");
    nativeBtn.classList.remove("active");
  } else {
    rawPane.classList.remove("active");
    nativePane.classList.add("active");
    rawBtn.classList.remove("active");
    nativeBtn.classList.add("active");
  }
}

/* ========================================================= */
/* ĐIỀU KHIỂN DRAWER AI CARE NAVIGATOR & XỬ LÝ TRUY VẤN     */
/* ========================================================= */
function toggleDrawer() {
  const drawer = document.getElementById("ai-drawer");
  const overlay = document.getElementById("drawer-overlay");
  const isOpen = drawer.classList.contains("open");

  if (isOpen) {
    drawer.classList.remove("open");
    overlay.classList.remove("active");
  } else {
    drawer.classList.add("open");
    overlay.classList.add("active");
  }
}

function openDrawerWithPreset(presetType) {
  toggleDrawer();
  handlePreset(presetType);
}

/**
 * Xử lý các tình huống mẫu có sẵn (1-Click Presets)
 */
async function handlePreset(type) {
  const container = document.getElementById("ai-response-container");
  
  if (type === "ast_alt") {
    renderRAGResult({
      badge: "Sinh Hóa Máu • Men Gan ALT (58 U/L)",
      meaning: "ALT và AST là hai enzym chủ yếu nằm trong tế bào gan. Mức tăng nhẹ (như 52 - 58 U/L so với mốc chuẩn 40 U/L) rất thường gặp do ăn nhiều đạm/dầu mỡ, uống bia rượu gần ngày xét nghiệm, thức khuya hoặc tập thể thao nặng. <strong>Mức này hoàn toàn không đồng nghĩa với suy gan hay bệnh nguy hiểm.</strong>",
      questions: [
        "Thưa bác sĩ, mức men gan tăng nhẹ này của cháu chỉ cần điều chỉnh sinh hoạt ăn uống hay có cần dùng thêm thuốc bổ gan không ạ?",
        "Cháu có cần hẹn ngày làm lại xét nghiệm kiểm tra men gan sau 1 đến 2 tháng không ạ?"
      ],
      lifestyle: "Nên uống đủ 2 lít nước mỗi ngày, ngủ trước 23h và hạn chế bia rượu, đồ chiên xào trong 2 tuần tới.",
      disclaimer: "Luôn chờ kết luận chính thức của bác sĩ tại Phòng 302 sau ít phút nữa. Hãy giữ tâm lý bình tĩnh!"
    });
  } else if (type === "hba1c") {
    renderRAGResult({
      badge: "Nội Tiết • Đường Huyết HbA1c (6.1%)",
      meaning: "HbA1c thể hiện mức đường huyết trung bình trong 3 tháng qua. Kết quả 6.1% nằm ở khoảng ranh giới tiền tiểu đường (chuẩn 4.0 - 5.6%). Đây là thời điểm vàng để điều chỉnh chế độ ăn và tăng vận động. <strong>Tuyệt đối không được tự ý mua thuốc hạ đường huyết uống khi chưa có đơn của bác sĩ!</strong>",
      questions: [
        "Thưa bác sĩ, với mức 6.1% này thì chế độ ăn uống và tập luyện cần thay đổi cụ thể ra sao để đưa về mức chuẩn ạ?",
        "Tôi có cần làm thêm nghiệm pháp dung nạp glucose hay kiểm tra mỡ máu kèm theo không ạ?"
      ],
      lifestyle: "Hạn chế đồ uống có đường, trà sữa, bánh kẹo; thay một phần cơm trắng bằng gạo lứt; duy trì đi bộ nhanh 30 phút/ngày.",
      disclaimer: "Mọi quyết định điều trị và dùng thuốc phải do Bác sĩ Nội tiết chỉ định sau khi thăm khám lâm sàng."
    });
  } else if (type === "creatinine") {
    renderRAGResult({
      badge: "Chức Năng Thận • Creatinine (85.0 µmol/L)",
      meaning: "Creatinine huyết thanh 85 µmol/L nằm hoàn hảo trong giới hạn chuẩn (62 - 106 µmol/L). Điều này cho thấy chức năng lọc chất thải của thận đang hoạt động rất tốt và ổn định.",
      questions: [
        "Chức năng thận của tôi hiện tại có hoàn toàn ổn định không bác sĩ?",
        "Tôi có cần lưu ý lượng nước uống hàng ngày hay chế độ ăn đạm ra sao không ạ?"
      ],
      lifestyle: "Duy trì uống đủ nước, không nhịn tiểu và ăn thanh đạm.",
      disclaimer: "Chỉ số bình thường là dấu hiệu tích cực. Hãy tiếp tục duy trì lối sống lành mạnh."
    });
  } else if (type === "acid_uric") {
    renderRAGResult({
      badge: "Sinh Hóa Máu • Acid Uric (380 µmol/L)",
      meaning: "Acid Uric ở mức 380 µmol/L nằm an toàn dưới ngưỡng cảnh báo (200 - 420 µmol/L). Bạn không có dấu hiệu lắng đọng tinh thể urat tại các khớp.",
      questions: [
        "Chỉ số acid uric của tôi có cần lưu ý gì trong ăn uống hải sản hay thịt đỏ không ạ?",
        "Khoảng bao lâu tôi nên làm lại xét nghiệm kiểm tra acid uric định kỳ ạ?"
      ],
      lifestyle: "Uống đủ nước mỗi ngày giúp thận đào thải acid uric tự nhiên hiệu quả.",
      disclaimer: "Chỉ số hoàn toàn trong giới hạn chuẩn."
    });
  } else if (type === "glucose") {
    renderRAGResult({
      badge: "Nội Tiết • Glucose Lúc Đói (5.2 mmol/L)",
      meaning: "Glucose máu lúc đói 5.2 mmol/L là mức lý tưởng (chuẩn 3.9 - 6.4 mmol/L), phản ánh cơ thể đang kiểm soát đường huyết tức thời rất tốt sau khi nhịn ăn sáng.",
      questions: [
        "Chỉ số glucose đói 5.2 mmol/L kết hợp HbA1c 6.1% thì bức tranh đường huyết tổng thể của tôi như thế nào ạ?",
        "Tôi có cần làm thêm nghiệm pháp dung nạp glucose không bác sĩ?"
      ],
      lifestyle: "Ăn đúng giờ, hạn chế tinh bột nhanh và nước ngọt có gas.",
      disclaimer: "Bác sĩ sẽ tư vấn chế độ dinh dưỡng tối ưu cho bạn."
    });
  } else if (type === "red_flag") {
    // Kích hoạt Báo động đỏ Cấp cứu qua Guardrail
    const flagInfo = { detectedLabel: "Đau thắt ngực cấp tính & Khó thở dữ dội" };
    container.innerHTML = renderEmergencyCard(flagInfo);
  }
}

/**
 * Xử lý đặt lịch khám trên screen-booking
 */
function confirmBooking() {
  const selectedHospital = document.querySelector("#screen-booking .booking-step-card:nth-child(1) .booking-chip.selected")?.textContent || "Vinmec Times City";
  const selectedDept = document.querySelector("#screen-booking .booking-step-card:nth-child(2) .booking-chip.selected")?.textContent || "Nội Đa Khoa";
  const selectedTime = document.querySelector("#screen-booking .booking-step-card:nth-child(3) .booking-chip.selected")?.textContent || "Sáng 09:00 - 10:00";
  
  showToast(`✅ Đã đặt lịch: ${selectedDept} - ${selectedTime}! Điều phối viên Vinmec sẽ gọi xác nhận trong 15 phút.`);
  setTimeout(() => {
    navigateTo('screen-notifications');
  }, 1200);
}

/**
 * Hiển thị Toast thông báo nhanh trong điện thoại
 */
function showToast(message) {
  let toast = document.getElementById("app-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "app-toast";
    toast.className = "app-toast";
    document.querySelector(".device-wrapper").appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

/**
 * Kích hoạt tương tác chọn Chip trên màn hình Đặt Lịch
 */
function setupBookingChips() {
  document.querySelectorAll(".booking-step-card").forEach(card => {
    const chips = card.querySelectorAll(".booking-chip");
    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        chips.forEach(c => c.classList.remove("selected"));
        chip.classList.add("selected");
      });
    });
  });
}

/**
 * Xử lý câu hỏi tự do của người dùng (RAG + Guardrails)
 */
async function sendUserQuery() {
  const input = document.getElementById("user-chat-input");
  const query = input.value.trim();
  if (!query) return;

  const container = document.getElementById("ai-response-container");

  // 1. KIỂM TRA BỨC TƯỜNG LỬA RED-FLAG (< 100ms)
  const redFlagInfo = detectRedFlags(query);
  if (redFlagInfo) {
    container.innerHTML = renderEmergencyCard(redFlagInfo);
    input.value = "";
    return;
  }

  // 2. HIỂN THỊ TRẠNG THÁI ĐANG XỬ LÝ (LOADING)
  container.innerHTML = `
    <div class="ai-response-box" style="text-align:center; padding: 24px;">
      <div class="pulse-dot" style="margin: 0 auto 10px; width:14px; height:14px;"></div>
      <div style="font-size:12px; color: var(--vinmec-teal); font-weight:700;">
        Care Navigator đang tra cứu cơ sở dữ liệu y tế Vinmec...
      </div>
    </div>
  `;

  // 3. XỬ LÝ QUA RAG ENGINE (API nếu có -> Fallback sang Corpus nội bộ)
  try {
    const result = await ragEngine.processQuery(query);
    renderRAGResult(result);
  } catch (err) {
    console.error("[Vinmec AI Console]: Unexpected processing error:", err);
    // Fallback an toàn ra UI, tuyệt đối không văng lỗi kỹ thuật
    renderRAGResult({
      badge: "Hỗ Trợ Thông Tin Y Tế",
      meaning: "Cảm ơn bạn đã đặt câu hỏi. Chỉ số này cần được Bác sĩ đối chiếu trực tiếp cùng thể trạng thực tế tại buồng khám.",
      questions: [
        "Bác sĩ có thể giải thích ý nghĩa chỉ số này đối với sức khỏe của tôi không?",
        "Tôi cần kiêng cữ hay lưu ý gì sau buổi khám hôm nay ạ?"
      ],
      lifestyle: "Hãy giữ tâm lý thoải mái và chuẩn bị sẵn các câu hỏi trên để trao đổi cùng Bác sĩ.",
      disclaimer: "Care Navigator giữ ranh giới an toàn phi lâm sàng.",
      showNurseButton: true
    });
  }

  input.value = "";
}

/**
 * Render cấu trúc câu trả lời chuẩn 3 phần của AI
 */
function renderRAGResult(data) {
  const container = document.getElementById("ai-response-container");
  
  let questionsHtml = "";
  if (data.questions && data.questions.length > 0) {
    questionsHtml = data.questions.map((q, idx) => `<li>${idx + 1}. <em>"${q}"</em></li>`).join("");
  }

  let nurseHtml = "";
  if (data.showNurseButton) {
    nurseHtml = `
      <div class="nurse-connect-box">
        <div style="font-size:11px; color:#1E40AF; font-weight:600;">Bạn cần giải đáp thủ tục hoặc hỗ trợ trực tiếp?</div>
        <a href="tel:1900232389" class="btn-call-nurse">
          📞 Gọi Điều Dưỡng Vinmec: 1900 23 23 89
        </a>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="ai-response-box">
      <div class="ai-response-section">
        <span class="ai-section-badge">✨ ${data.badge || "Ý Nghĩa Thông Thường"}</span>
        <div class="ai-plain-text">${data.meaning}</div>
      </div>

      <div class="ai-response-section">
        <span class="ai-section-badge" style="background:#FEF3C7; color:#B45309;">💡 2 Câu hỏi trọng tâm nên hỏi Bác sĩ:</span>
        <ul class="question-list">
          ${questionsHtml}
        </ul>
      </div>

      ${data.lifestyle ? `
        <div class="lifestyle-box">
          🌱 <strong>Gợi ý sinh hoạt:</strong> ${data.lifestyle}
        </div>
      ` : ""}

      <div class="disclaimer-badge" style="margin-top:10px;">
        <span>⚠️</span>
        <span>${data.disclaimer || "Thông tin mang tính giải thích đời thường, luôn tuân thủ hướng dẫn của Bác sĩ."}</span>
      </div>

      ${nurseHtml}
    </div>
  `;
}

// KHỞI TẠO ỨNG DỤNG KHI DOM SẴN SÀNG
document.addEventListener("DOMContentLoaded", () => {
  setupSmartFab();
  setupBookingChips();
  updateTopAppBar(currentScreenId);
  updateBottomNavBar(currentScreenId);
  resetSmartFab();
});
