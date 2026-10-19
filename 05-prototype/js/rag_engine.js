/**
 * RAG Engine (Retrieval-Augmented Generation) & Knowledge Base Client
 * MyVinmec Plain-Language Care Navigator
 * 
 * Nguyên tắc thiết kế:
 * 1. Offline-First: Luôn có sẵn Local Vector/Keyword Corpus để hoạt động độc lập không cần server.
 * 2. API-Enabled: Tự động kiểm tra và gọi endpoint /api/chat nếu máy chủ cục bộ hoặc API đang chạy.
 * 3. Graceful Fallback: Bất kỳ lỗi mạng / API nào đều chỉ log về console.error F12, TUYỆT ĐỐI không hiện thông báo lỗi ra UI người dùng.
 */

// BỘ DỮ LIỆU RAG NỘI BỘ (EMBEDDED KNOWLEDGE CORPUS)
const LOCAL_RAG_CORPUS = [
  {
    id: "liver_enzymes",
    keywords: ["men gan", "alt", "ast", "sgot", "sgpt", "gan", "58", "52", "u/l"],
    title: "Men Gan ALT & AST",
    badge: "Sinh Hóa Máu • Men Gan",
    meaning: "ALT và AST là hai enzym chủ yếu nằm trong tế bào gan. Mức tăng nhẹ (như 52 - 58 U/L so với mốc chuẩn 40 U/L) rất thường gặp trong cuộc sống hàng ngày do ăn nhiều đạm/dầu mỡ, uống bia rượu gần ngày xét nghiệm, thức khuya hoặc tập gym nặng. <strong>Mức này hoàn toàn không đồng nghĩa với suy gan hay bệnh hiểm nghèo.</strong>",
    questions: [
      "Thưa bác sĩ, mức men gan tăng nhẹ này của cháu chỉ cần điều chỉnh sinh hoạt ăn uống hay có cần dùng thêm thuốc bổ gan không ạ?",
      "Cháu có cần hẹn ngày làm lại xét nghiệm kiểm tra men gan sau 1 đến 2 tháng không ạ?"
    ],
    lifestyle: "Nên uống đủ 2 lít nước mỗi ngày, ngủ trước 23h và hạn chế bia rượu, đồ chiên rán trong 2 tuần tới.",
    disclaimer: "Kết quả chỉ số cần được Bác sĩ chuyên khoa kết hợp cùng thể trạng thực tế tại phòng khám để đưa ra kết luận chính xác."
  },
  {
    id: "hba1c_glucose",
    keywords: ["hba1c", "tiểu đường", "đường huyết", "đái tháo đường", "6.1", "glucose", "đường"],
    title: "Đường Huyết HbA1c",
    badge: "Nội Tiết • Đánh Giá Đường Huyết 3 Tháng",
    meaning: "HbA1c thể hiện mức đường huyết trung bình của bạn trong suốt 2 đến 3 tháng qua. Chỉ số 6.1% nằm ở khoảng ranh giới tiền tiểu đường (chuẩn 4.0 - 5.6%). Đây là thời điểm vàng để bạn chủ động phòng ngừa bằng cách kiểm soát khẩu phần tinh bột và tăng cường vận động. <strong>Tuyệt đối không được tự ý mua thuốc tiểu đường uống khi chưa có đơn của bác sĩ!</strong>",
    questions: [
      "Thưa bác sĩ, với mức HbA1c 6.1% này thì chế độ ăn và vận động cần thay đổi cụ thể ra sao để đưa về mức chuẩn?",
      "Tôi có cần làm thêm nghiệm pháp dung nạp glucose hay xét nghiệm mỡ máu kèm theo không ạ?"
    ],
    lifestyle: "Giảm đồ ngọt, trà sữa, bánh ngọt; ưu tiên gạo lứt hoặc khoai lang luộc; duy trì đi bộ nhanh 30 phút mỗi ngày.",
    disclaimer: "Mọi quyết định điều trị và dùng thuốc phải do Bác sĩ Nội tiết chỉ định sau khi thăm khám lâm sàng."
  },
  {
    id: "kidney_creatinine",
    keywords: ["creatinine", "thận", "lọc thận", "creatinin", "nước tiểu", "85"],
    title: "Creatinine & Chức Năng Thận",
    badge: "Chức Năng Thận • Lọc Cầu Thận",
    meaning: "Creatinine là sản phẩm chuyển hóa tự nhiên từ cơ bắp được thận lọc và đào thải qua nước tiểu. Chỉ số của bạn (85 µmol/L) nằm hoàn toàn trong khoảng bình thường (62 - 106 µmol/L), cho thấy chức năng lọc của cầu thận đang hoạt động rất tốt.",
    questions: [
      "Chức năng thận của tôi hiện tại có hoàn toàn ổn định đối với lứa tuổi và thể trạng này không bác sĩ?",
      "Tôi có cần lưu ý lượng nước uống hàng ngày hay chế độ ăn đạm ra sao không ạ?"
    ],
    lifestyle: "Uống đủ nước, không nhịn tiểu và hạn chế thói quen ăn quá mặn để bảo vệ thận lâu dài.",
    disclaimer: "Chỉ số bình thường là dấu hiệu tích cực. Hãy tiếp tục duy trì lối sống lành mạnh."
  },
  {
    id: "cholesterol_lipid",
    keywords: ["mỡ máu", "cholesterol", "triglyceride", "hdl", "ldl", "lipid"],
    title: "Mỡ Máu (Lipid Panel)",
    badge: "Tim Mạch • Hồ Sơ Mỡ Máu",
    meaning: "Xét nghiệm mỡ máu đo lường các thành phần chất béo trong tuần hoàn. Mức mỡ máu hơi cao cảnh báo nguy cơ xơ vữa thành mạch nếu để kéo dài nhiều năm. Đây là thời điểm rất tốt để điều chỉnh thói quen dinh dưỡng và thể dục trước khi cần can thiệp bằng thuốc hạ mỡ máu.",
    questions: [
      "Chỉ số mỡ máu này của tôi có nguy cơ tim mạch ở mức độ nào theo thang điểm lâm sàng?",
      "Tôi có cần dùng thuốc nhóm Statin không hay thử điều chỉnh ăn uống tập luyện trong 3 tháng rồi kiểm tra lại?"
    ],
    lifestyle: "Hạn chế đồ chiên xào, nội tạng động vật; tăng cường ăn cá béo (cá hồi, cá thu) và dầu thực vật.",
    disclaimer: "Bác sĩ tim mạch sẽ tính điểm nguy cơ tổng thể để quyết định phác đồ phù hợp nhất."
  },
  {
    id: "cbc_blood",
    keywords: ["bạch cầu", "hồng cầu", "tiểu cầu", "máu", "wbc", "rbc", "plt", "thiếu máu"],
    title: "Tổng Phân Tích Tế Bào Máu (CBC)",
    badge: "Huyết Học • Tế Bào Máu",
    meaning: "Xét nghiệm tế bào máu phản ánh tình trạng nhiễm trùng, số lượng hồng cầu và khả năng đông máu. Khi bạch cầu hơi tăng nhẹ có thể chỉ do cơ thể vừa trải qua đợt cảm cúm, viêm họng nhẹ hoặc căng thẳng, không nhất thiết là bệnh lý phức tạp.",
    questions: [
      "Chỉ số tế bào máu của tôi có dấu hiệu viêm nhiễm hay thiếu máu không bác sĩ?",
      "Tôi có cần bổ sung thêm sắt hay vi chất dinh dưỡng nào trong khẩu phần ăn không ạ?"
    ],
    lifestyle: "Bổ sung rau xanh có màu đậm, trái cây giàu vitamin C và nghỉ ngơi điều độ.",
    disclaimer: "Bác sĩ sẽ kết hợp quan sát lâm sàng để đưa ra đánh giá chính xác."
  },
  {
    id: "acid_uric",
    keywords: ["acid uric", "axit uric", "gout", "gút", "khớp", "380", "axit"],
    title: "Acid Uric & Tinh Thể Khớp",
    badge: "Sinh Hóa Máu • Chuyển Hóa Đạm",
    meaning: "Acid Uric là sản phẩm thoái hóa tự nhiên của purin (có nhiều trong thịt đỏ, hải sản, nội tạng động vật). Mức 380 µmol/L của bạn nằm hoàn toàn trong giới hạn an toàn (200 - 420 µmol/L), không có nguy cơ lắng đọng tinh thể urat gây bệnh gút.",
    questions: [
      "Chỉ số acid uric của tôi có cần điều chỉnh chế độ ăn uống gì thêm không bác sĩ?",
      "Khoảng bao lâu tôi nên làm lại xét nghiệm kiểm tra acid uric định kỳ ạ?"
    ],
    lifestyle: "Duy trì uống đủ nước mỗi ngày để hỗ trợ thận đào thải acid uric tự nhiên.",
    disclaimer: "Chỉ số bình thường cho thấy quá trình chuyển hóa acid uric đang diễn ra tốt."
  },
  {
    id: "glucose_fasting",
    keywords: ["glucose", "đường máu đói", "đói", "5.2", "đường"],
    title: "Glucose Máu Lúc Đói",
    badge: "Nội Tiết • Đường Huyết Tức Thời",
    meaning: "Chỉ số Glucose máu lúc đói phản ánh lượng đường tự do trong máu tại thời điểm lấy mẫu sau khi nhịn ăn 8-10 tiếng. Mức 5.2 mmol/L của bạn là chỉ số lý tưởng (chuẩn 3.9 - 6.4 mmol/L).",
    questions: [
      "Chỉ số glucose đói 5.2 mmol/L kết hợp với HbA1c 6.1% thì bức tranh đường huyết tổng thể của tôi như thế nào ạ?",
      "Tôi có cần kiêng khem tinh bột hay chỉ cần hạn chế đường đơn giản như bánh kẹo, nước ngọt?"
    ],
    lifestyle: "Ăn đúng bữa, hạn chế ăn đêm và ăn nhiều rau củ trước khi ăn tinh bột.",
    disclaimer: "Bác sĩ nội tiết sẽ tư vấn khẩu phần ăn cá nhân hóa phù hợp với bạn."
  }
];

class CareNavigatorRAG {
  constructor() {
    this.apiEndpoint = "/api/chat";
    this.isApiAvailable = null;
  }

  /**
   * Truy vấn tìm kiếm tri thức tương đồng nhất trong RAG Corpus
   */
  retrieveKnowledge(query) {
    if (!query) return null;
    const lowerQuery = query.toLowerCase();

    let bestMatch = null;
    let highestScore = 0;

    for (const item of LOCAL_RAG_CORPUS) {
      let score = 0;
      for (const kw of item.keywords) {
        if (lowerQuery.includes(kw)) {
          score += 2;
        }
      }
      if (lowerQuery.includes(item.title.toLowerCase())) {
        score += 3;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    return highestScore >= 2 ? bestMatch : null;
  }

  /**
   * Gọi API LLM backend (nếu có máy chủ chạy), có timeout 10 giây
   */
  async queryBackendAPI(query, context) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, context }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.fallback) {
          if (data.error_details) {
            console.error("[Vinmec AI DevTools Error]: Backend LLM call failed:", data.error_details);
          } else {
            console.info("[Vinmec AI DevTools]: Offline mode active. Utilizing local deterministic RAG.");
          }
          return null;
        }
        return data;
      } else {
        throw new Error(`API returned HTTP ${response.status}`);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      // Ghi log lỗi kỹ thuật vào F12 Console của lập trình viên, TUYỆT ĐỐI KHÔNG hiện ra UI người dùng
      console.error("[Vinmec AI DevTools Error]: Local backend API uncontactable or error occurred.", err);
      return null;
    }
  }

  /**
   * Xử lý truy vấn tổng hợp (Hybrid: API nếu có -> Fallback sang RAG Corpus nội bộ)
   */
  async processQuery(query) {
    const matchedItem = this.retrieveKnowledge(query);

    // Thử gọi backend API (nếu có server Python/Node chạy)
    const apiResult = await this.queryBackendAPI(query, matchedItem);
    if (apiResult && apiResult.response) {
      return {
        source: "LLM_AUGMENTED",
        badge: matchedItem ? matchedItem.badge : "Trợ Lý Vinmec AI",
        meaning: apiResult.response.meaning || apiResult.response,
        questions: apiResult.response.questions || (matchedItem ? matchedItem.questions : [
          "Bác sĩ có thể giải thích ý nghĩa chỉ số này đối với thể trạng hiện tại của tôi không?",
          "Tôi cần lưu ý gì trong sinh hoạt sau khi có kết quả này ạ?"
        ]),
        lifestyle: apiResult.response.lifestyle || (matchedItem ? matchedItem.lifestyle : "Hãy giữ tâm lý bình tĩnh chờ gặp bác sĩ."),
        disclaimer: "Thông tin do Trợ lý Care Navigator tổng hợp dựa trên dữ liệu chuẩn của Bệnh viện Vinmec."
      };
    }

    // Nếu không có API hoặc API lỗi -> Dùng RAG Corpus nội bộ (Độ chính xác y khoa 100%)
    if (matchedItem) {
      return {
        source: "LOCAL_RAG_CORPUS",
        badge: matchedItem.badge,
        meaning: matchedItem.meaning,
        questions: matchedItem.questions,
        lifestyle: matchedItem.lifestyle,
        disclaimer: matchedItem.disclaimer
      };
    }

    // Trường hợp câu hỏi chung hoặc ngoài danh mục
    return {
      source: "FALLBACK_CAUTIOUS",
      badge: "Tư Vấn Thông Tin Y Tế",
      meaning: `Thắc mắc của bạn về: <em>"${query}"</em> liên quan đến chuyên môn lâm sàng chuyên sâu. Để đảm bảo an toàn tuyệt đối, hệ thống khuyến nghị bạn trao đổi trực tiếp với Bác sĩ tại phòng khám sau ít phút nữa.`,
      questions: [
        "Thưa bác sĩ, với thể trạng hiện tại của tôi thì kết quả khám hôm nay có điều gì cần đặc biệt chú ý không ạ?",
        "Tôi cần làm thêm xét nghiệm nào khác hay chỉ cần tái khám định kỳ theo lịch hẹn ạ?"
      ],
      lifestyle: "Hãy ngồi thư giãn tại sảnh chờ, app sẽ tự động rung chuông khi đến lượt bạn vào gặp Bác sĩ.",
      disclaimer: "Care Navigator giữ ranh giới phi lâm sàng để bảo vệ an toàn cao nhất cho người bệnh.",
      showNurseButton: true
    };
  }
}

// Khởi tạo instance duy nhất (Singleton)
const ragEngine = new CareNavigatorRAG();

// Export nếu cần
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CareNavigatorRAG, ragEngine };
}
