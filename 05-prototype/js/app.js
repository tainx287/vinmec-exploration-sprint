/**
 * Core Application Router, Navigation Flow & Smart FAB Controller
 * MyVinmec Mobile Simulator Prototype
 */

// LỊCH SỬ ĐIỀU HƯỚNG (NAVIGATION HISTORY STACK)
let navigationHistory = ["screen-home", "screen-records", "screen-result"];
let currentScreenId = "screen-result"; // Mặc định mở lên là trang báo kết quả cận lâm sàng theo yêu cầu

// CÁC THÔNG SỐ TITLE CHO TỪNG MÀN HÌNH (CHUẨN DNA ẢNH CHỤP APP THẬT)
const SCREEN_TITLES = {
  "screen-home": { title: "MyVinmec", subtitle: "Chăm sóc bằng tài năng, y đức và sự thấu cảm", showBack: false, badge: "HOME" },
  "screen-records": { title: "Hồ Sơ Sức Khỏe", subtitle: "Lịch sử khám & Cận lâm sàng", showBack: true, badge: "RECORDS" },
  "screen-result": { title: "Chi Tiết Xét Nghiệm", subtitle: "Hồ sơ sức khỏe Vinmec Times City", showBack: true, badge: "LIVE MOCK" },
  "screen-booking": { title: "Đặt Lịch Khám", subtitle: "Chọn chuyên khoa & bác sĩ", showBack: true, badge: "BOOKING" },
  "screen-notifications": { title: "Thông Báo", subtitle: "Luôn cập nhật lịch hẹn, ưu đãi và hơn thế nữa", showBack: true, badge: "10 MỚI" },
  "screen-profile": { title: "Tài Khoản Cá Nhân", subtitle: "Hồ sơ cá nhân & Cài đặt bảo mật", showBack: true, badge: "VIP" }
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
  const topAppBar = document.querySelector(".top-app-bar");
  
  // Trên Trang Cá Nhân (Profile), ẩn Top App Bar để nhường chỗ cho Header vòm sóng Teal tự nhiên (Screenshot 7)
  if (screenId === "screen-profile") {
    if (topAppBar) topAppBar.style.display = "none";
    return;
  } else {
    if (topAppBar) topAppBar.style.display = "flex";
  }

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
 * Hiển thị Toast thông báo tương tác trong màn hình điện thoại
 */
let toastTimeoutId = null;
function showAppToast(message) {
  const toast = document.getElementById("app-toast-box");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");

  if (toastTimeoutId) clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
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
    scrollChatToBottom();
  }
}

function openDrawerWithPreset(presetType) {
  toggleDrawer();
  handlePreset(presetType);
}

/* ========================================================= */
/* RATE LIMITING, SESSION IDENTIFIER & CONVERSATION TIMELINE */
/* ========================================================= */

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getCurrentTimeStr() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function getSessionId() {
  let sid = localStorage.getItem("vinmec_session_id");
  if (!sid) {
    sid = "sess_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now().toString(36);
    localStorage.setItem("vinmec_session_id", sid);
  }
  return sid;
}

const RATE_LIMIT_CONFIG = {
  MAX_PER_10_MIN: 20,
  MAX_PER_DAY: 30,
  // Tự động khoá API vào ngày cuối tháng (31/10/2026 23:59:59 GMT+7)
  EXPIRATION_TIMESTAMP: new Date("2026-10-31T23:59:59+07:00").getTime()
};

function checkRateLimit() {
  const now = Date.now();
  if (now > RATE_LIMIT_CONFIG.EXPIRATION_TIMESTAMP) {
    return {
      allowed: false,
      reason: "expired",
      message: "🔒 Dự án nghiên cứu thử nghiệm của Lab Coach Nguyễn Xuân Tài đã kết thúc thời hạn mở API vào ngày cuối tháng (31/10/2026). Hệ thống tự động chuyển sang cơ sở tri thức nội bộ (Offline Corpus) để BGK tiếp tục nghiệm thu."
    };
  }

  const todayStr = new Date().toISOString().split("T")[0];
  let store = {};
  try {
    store = JSON.parse(localStorage.getItem("vinmec_rate_limits") || "{}");
  } catch (e) {
    store = {};
  }

  if (store.date !== todayStr) {
    store = { date: todayStr, dayCount: 0, timestamps: [] };
  }

  const tenMinAgo = now - 10 * 60 * 1000;
  store.timestamps = (store.timestamps || []).filter(t => t > tenMinAgo);

  if (store.timestamps.length >= RATE_LIMIT_CONFIG.MAX_PER_10_MIN) {
    return {
      allowed: false,
      reason: "burst_limit",
      message: "⏳ Bạn đã gửi hơn 20 yêu cầu trong 10 phút liên tục. Để bảo vệ tài nguyên API, hệ thống tạm thời dùng Offline RAG cho câu trả lời này."
    };
  }

  if (store.dayCount >= RATE_LIMIT_CONFIG.MAX_PER_DAY) {
    return {
      allowed: false,
      reason: "day_limit",
      message: "⚠️ Đã đạt hạn mức 30 yêu cầu/ngày cho phiên này. Hệ thống tự động chuyển sang cơ chế Offline RAG để duy trì trải nghiệm liền mạch."
    };
  }

  return { allowed: true, store };
}

function recordClientRequest() {
  const todayStr = new Date().toISOString().split("T")[0];
  const now = Date.now();
  let store = {};
  try {
    store = JSON.parse(localStorage.getItem("vinmec_rate_limits") || "{}");
  } catch (e) {
    store = {};
  }
  if (store.date !== todayStr) {
    store = { date: todayStr, dayCount: 0, timestamps: [] };
  }
  store.dayCount = (store.dayCount || 0) + 1;
  store.timestamps = (store.timestamps || []).filter(t => t > (now - 10 * 60 * 1000));
  store.timestamps.push(now);
  localStorage.setItem("vinmec_rate_limits", JSON.stringify(store));
}

/* ========================================================= */
/* LỊCH SỬ HỘI THOẠI & CUỘN TIMELINE                         */
/* ========================================================= */

function scrollChatToBottom() {
  const drawerBody = document.querySelector("#ai-drawer .drawer-body");
  if (drawerBody) {
    setTimeout(() => {
      drawerBody.scrollTo({ top: drawerBody.scrollHeight, behavior: "smooth" });
    }, 50);
  }
}

function getChatHistory() {
  try {
    return JSON.parse(sessionStorage.getItem("vinmec_chat_history") || "[]");
  } catch (e) {
    return [];
  }
}

function saveChatHistory(history) {
  try {
    sessionStorage.setItem("vinmec_chat_history", JSON.stringify(history));
  } catch (e) {
    console.warn("Could not save chat history to sessionStorage", e);
  }
}

function appendUserBubbleToUI(userText, timeStr) {
  const container = document.getElementById("ai-response-container");
  if (!container) return;
  const row = document.createElement("div");
  row.className = "chat-row user";
  row.innerHTML = `
    <div class="chat-bubble-user">${escapeHtml(userText)}</div>
    <div class="chat-meta-user">${timeStr || getCurrentTimeStr()}</div>
  `;
  container.appendChild(row);
  scrollChatToBottom();
}

function showBotLoading() {
  removeBotLoading();
  const container = document.getElementById("ai-response-container");
  if (!container) return;
  const row = document.createElement("div");
  row.id = "chat-loading-row";
  row.className = "chat-row bot";
  row.innerHTML = `
    <div class="chat-bot-wrap">
      <img src="assets/logo_chatbot_fab.webp" alt="MIA" class="chat-bot-avatar" onerror="this.src='assets/logo_chatbot_fab.png'">
      <div class="chat-bubble-bot loading">
        <div class="pulse-dot" style="width:10px; height:10px; margin:0;"></div>
        <span>MIA đang tra cứu cơ sở dữ liệu y tế Vinmec...</span>
      </div>
    </div>
  `;
  container.appendChild(row);
  scrollChatToBottom();
}

function removeBotLoading() {
  const loadingRow = document.getElementById("chat-loading-row");
  if (loadingRow) loadingRow.remove();
}

function appendBotResultToUI(data, isEmergency = false, noticeText = null) {
  removeBotLoading();
  const container = document.getElementById("ai-response-container");
  if (!container) return;

  const row = document.createElement("div");
  row.className = "chat-row bot";

  let innerContent = "";
  if (isEmergency) {
    innerContent = renderEmergencyCard(data);
  } else {
    innerContent = buildRAGCardHtml(data, noticeText);
  }

  row.innerHTML = `
    <div class="chat-bot-wrap">
      <img src="assets/logo_chatbot_fab.webp" alt="MIA" class="chat-bot-avatar" onerror="this.src='assets/logo_chatbot_fab.png'">
      <div class="chat-bubble-bot">
        ${innerContent}
      </div>
    </div>
  `;
  container.appendChild(row);
  scrollChatToBottom();
}

function buildRAGCardHtml(data, noticeText) {
  let noticeHtml = "";
  if (noticeText) {
    noticeHtml = `
      <div class="rate-limit-card">
        ${noticeText}
      </div>
    `;
  }

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

  return `
    ${noticeHtml}
    <div class="ai-response-box" style="margin-top:0;">
      <div class="ai-response-section">
        <span class="ai-section-badge">✨ ${data.badge || "Ý Nghĩa Thông Thường"}</span>
        <div class="ai-plain-text">${data.meaning}</div>
      </div>

      ${questionsHtml ? `
        <div class="ai-response-section">
          <span class="ai-section-badge" style="background:#FEF3C7; color:#B45309;">💡 2 Câu hỏi trọng tâm nên hỏi Bác sĩ:</span>
          <ul class="question-list">
            ${questionsHtml}
          </ul>
        </div>
      ` : ""}

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

function restoreChatHistory() {
  const history = getChatHistory();
  if (!history || history.length === 0) return;

  const container = document.getElementById("ai-response-container");
  if (!container) return;

  // Xóa lời chào mặc định nếu đã có lịch sử trò chuyện
  container.innerHTML = "";

  history.forEach(item => {
    if (item.role === "user") {
      appendUserBubbleToUI(item.text, item.time);
    } else if (item.role === "bot") {
      appendBotResultToUI(item.data, item.isEmergency, item.noticeText);
    }
  });
}

/* ========================================================= */
/* PRESET SCENARIOS & USER QUERY HANDLERS                    */
/* ========================================================= */

const PRESET_MAP = {
  ast_alt: {
    userText: "Tình huống 1: Men gan ALT tăng nhẹ 58 U/L (P1)",
    data: {
      badge: "Sinh Hóa Máu • Men Gan ALT (58 U/L)",
      meaning: "ALT và AST là hai enzym chủ yếu nằm trong tế bào gan. Mức tăng nhẹ (như 52 - 58 U/L so với mốc chuẩn 40 U/L) rất thường gặp do ăn nhiều đạm/dầu mỡ, uống bia rượu gần ngày xét nghiệm, thức khuya hoặc tập thể thao nặng. <strong>Mức này hoàn toàn không đồng nghĩa với suy gan hay bệnh nguy hiểm.</strong>",
      questions: [
        "Thưa bác sĩ, mức men gan tăng nhẹ này của cháu chỉ cần điều chỉnh sinh hoạt ăn uống hay có cần dùng thêm thuốc bổ gan không ạ?",
        "Cháu có cần hẹn ngày làm lại xét nghiệm kiểm tra men gan sau 1 đến 2 tháng không ạ?"
      ],
      lifestyle: "Nên uống đủ 2 lít nước mỗi ngày, ngủ trước 23h và hạn chế bia rượu, đồ chiên xào trong 2 tuần tới.",
      disclaimer: "Luôn chờ kết luận chính thức của bác sĩ tại Phòng 302 sau ít phút nữa. Hãy giữ tâm lý bình tĩnh!"
    }
  },
  hba1c: {
    userText: "Tình huống 2: HbA1c 6.1% ranh giới tiền tiểu đường (P2)",
    data: {
      badge: "Nội Tiết • Đường Huyết HbA1c (6.1%)",
      meaning: "HbA1c thể hiện mức đường huyết trung bình trong 3 tháng qua. Kết quả 6.1% nằm ở khoảng ranh giới tiền tiểu đường (chuẩn 4.0 - 5.6%). Đây là thời điểm vàng để điều chỉnh chế độ ăn và tăng vận động. <strong>Tuyệt đối không được tự ý mua thuốc hạ đường huyết uống khi chưa có đơn của bác sĩ!</strong>",
      questions: [
        "Thưa bác sĩ, với mức 6.1% này thì chế độ ăn uống và tập luyện cần thay đổi cụ thể ra sao để đưa về mức chuẩn ạ?",
        "Tôi có cần làm thêm nghiệm pháp dung nạp glucose hay kiểm tra mỡ máu kèm theo không ạ?"
      ],
      lifestyle: "Hạn chế đồ uống có đường, trà sữa, bánh kẹo; thay một phần cơm trắng bằng gạo lứt; duy trì đi bộ nhanh 30 phút/ngày.",
      disclaimer: "Mọi quyết định điều trị và dùng thuốc phải do Bác sĩ Nội tiết chỉ định sau khi thăm khám lâm sàng."
    }
  },
  creatinine: {
    userText: "Tình huống 3: Creatinine 85 µmol/L (Thận tốt)",
    data: {
      badge: "Chức Năng Thận • Creatinine (85.0 µmol/L)",
      meaning: "Creatinine huyết thanh 85 µmol/L nằm hoàn hảo trong giới hạn chuẩn (62 - 106 µmol/L). Điều này cho thấy chức năng lọc chất thải của thận đang hoạt động rất tốt và ổn định.",
      questions: [
        "Chức năng thận của tôi hiện tại có hoàn toàn ổn định không bác sĩ?",
        "Tôi có cần lưu ý lượng nước uống hàng ngày hay chế độ ăn đạm ra sao không ạ?"
      ],
      lifestyle: "Duy trì uống đủ nước, không nhịn tiểu và ăn thanh đạm.",
      disclaimer: "Chỉ số bình thường là dấu hiệu tích cực. Hãy tiếp tục duy trì lối sống lành mạnh."
    }
  },
  acid_uric: {
    userText: "Tình huống 4: Acid Uric 380 µmol/L (An toàn)",
    data: {
      badge: "Sinh Hóa Máu • Acid Uric (380 µmol/L)",
      meaning: "Acid Uric ở mức 380 µmol/L nằm an toàn dưới ngưỡng cảnh báo (200 - 420 µmol/L). Bạn không có dấu hiệu lắng đọng tinh thể urat tại các khớp.",
      questions: [
        "Chỉ số acid uric của tôi có cần lưu ý gì trong ăn uống hải sản hay thịt đỏ không ạ?",
        "Khoảng bao lâu tôi nên làm lại xét nghiệm kiểm tra acid uric định kỳ ạ?"
      ],
      lifestyle: "Uống đủ nước mỗi ngày giúp thận đào thải acid uric tự nhiên hiệu quả.",
      disclaimer: "Chỉ số hoàn toàn trong giới hạn chuẩn."
    }
  },
  glucose: {
    userText: "Tình huống 5: Glucose đói 5.2 mmol/L (Chuẩn)",
    data: {
      badge: "Nội Tiết • Glucose Lúc Đói (5.2 mmol/L)",
      meaning: "Glucose máu lúc đói 5.2 mmol/L là mức lý tưởng (chuẩn 3.9 - 6.4 mmol/L), phản ánh cơ thể đang kiểm soát đường huyết tức thời rất tốt sau khi nhịn ăn sáng.",
      questions: [
        "Chỉ số glucose đói 5.2 mmol/L kết hợp HbA1c 6.1% thì bức tranh đường huyết tổng thể của tôi như thế nào ạ?",
        "Tôi có cần làm thêm nghiệm pháp dung nạp glucose không bác sĩ?"
      ],
      lifestyle: "Ăn đúng giờ, hạn chế tinh bột nhanh và nước ngọt có gas.",
      disclaimer: "Bác sĩ sẽ tư vấn chế độ dinh dưỡng tối ưu cho bạn."
    }
  },
  red_flag: {
    userText: "Thử thách Cấp cứu: Đau thắt ngực & Khó thở dữ dội (Red-Flag)",
    isEmergency: true,
    data: { detectedLabel: "Đau thắt ngực cấp tính & Khó thở dữ dội" }
  }
};

/**
 * Xử lý các tình huống mẫu có sẵn (1-Click Presets)
 */
async function handlePreset(type) {
  const preset = PRESET_MAP[type];
  if (!preset) return;

  const timeStr = getCurrentTimeStr();
  appendUserBubbleToUI(preset.userText, timeStr);

  showBotLoading();
  setTimeout(() => {
    removeBotLoading();
    appendBotResultToUI(preset.data, !!preset.isEmergency);

    const history = getChatHistory();
    history.push({ role: "user", text: preset.userText, time: timeStr });
    history.push({ role: "bot", data: preset.data, isEmergency: !!preset.isEmergency, time: getCurrentTimeStr() });
    saveChatHistory(history);
  }, 350);
}

/**
 * Xử lý câu hỏi tự do của người dùng (RAG + Guardrails + Rate Limiting + Timeline)
 */
async function sendUserQuery() {
  const input = document.getElementById("user-chat-input");
  const query = input.value.trim();
  if (!query) return;

  const timeStr = getCurrentTimeStr();
  appendUserBubbleToUI(query, timeStr);
  input.value = "";

  showBotLoading();

  // 1. KIỂM TRA BỨC TƯỜNG LỬA CẤP CỨU RED-FLAG (< 100ms)
  const redFlagInfo = detectRedFlags(query);
  if (redFlagInfo) {
    removeBotLoading();
    appendBotResultToUI(redFlagInfo, true);
    const history = getChatHistory();
    history.push({ role: "user", text: query, time: timeStr });
    history.push({ role: "bot", data: redFlagInfo, isEmergency: true, time: getCurrentTimeStr() });
    saveChatHistory(history);
    return;
  }

  // 2. KIỂM TRA HỎI DANH TÍNH / TÁC DỤNG / BẢN QUYỀN (Guardrail Fallback)
  const identityInfo = detectIdentityQuestion(query);
  if (identityInfo) {
    removeBotLoading();
    appendBotResultToUI(identityInfo, false);
    const history = getChatHistory();
    history.push({ role: "user", text: query, time: timeStr });
    history.push({ role: "bot", data: identityInfo, isEmergency: false, time: getCurrentTimeStr() });
    saveChatHistory(history);
    return;
  }

  // 3. KIỂM TRA RATE LIMIT CLIENT
  const rateLimitStatus = checkRateLimit();
  let noticeText = null;
  if (!rateLimitStatus.allowed) {
    noticeText = rateLimitStatus.message;
  } else {
    recordClientRequest();
  }

  // 4. XỬ LÝ QUA RAG ENGINE (API Backend nếu có -> Offline Corpus Fallback)
  try {
    const result = await ragEngine.processQuery(query);
    appendBotResultToUI(result, false, noticeText);
    const history = getChatHistory();
    history.push({ role: "user", text: query, time: timeStr });
    history.push({ role: "bot", data: result, isEmergency: false, noticeText: noticeText, time: getCurrentTimeStr() });
    saveChatHistory(history);
  } catch (err) {
    console.error("[Vinmec AI Console]: Unexpected processing error:", err);
    const fallbackResult = {
      badge: "Hỗ Trợ Thông Tin Y Tế",
      meaning: "Cảm ơn bạn đã đặt câu hỏi. Chỉ số này cần được Bác sĩ đối chiếu trực tiếp cùng thể trạng thực tế tại buồng khám.",
      questions: [
        "Bác sĩ có thể giải thích ý nghĩa chỉ số này đối với sức khỏe của tôi không?",
        "Tôi cần kiêng cữ hay lưu ý gì sau buổi khám hôm nay ạ?"
      ],
      lifestyle: "Hãy giữ tâm lý thoải mái và chuẩn bị sẵn các câu hỏi trên để trao đổi cùng Bác sĩ.",
      disclaimer: "MIA (Bản mô phỏng nghiên cứu) giữ ranh giới an toàn phi lâm sàng.",
      showNurseButton: true
    };
    appendBotResultToUI(fallbackResult, false, noticeText);
    const history = getChatHistory();
    history.push({ role: "user", text: query, time: timeStr });
    history.push({ role: "bot", data: fallbackResult, isEmergency: false, noticeText: noticeText, time: getCurrentTimeStr() });
    saveChatHistory(history);
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

// KHỞI TẠO ỨNG DỤNG KHI DOM SẴN SÀNG
document.addEventListener("DOMContentLoaded", () => {
  setupSmartFab();
  setupBookingChips();
  updateTopAppBar(currentScreenId);
  updateBottomNavBar(currentScreenId);
  resetSmartFab();
  restoreChatHistory();
});
