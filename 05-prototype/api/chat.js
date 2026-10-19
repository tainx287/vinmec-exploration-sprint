/**
 * Serverless Chat API Endpoint with Rate Limiting & End-of-Month Hard-Lock
 * MyVinmec AI MIA Research Prototype
 */

// In-memory Rate Limit Cache
const rateLimitStore = global._rateLimitStore || new Map();
global._rateLimitStore = rateLimitStore;

// Ngày khóa tự động API: 23:59:59 ngày 31/10/2026 (GMT+7)
const EXPIRATION_TIMESTAMP = new Date("2026-10-31T23:59:59+07:00").getTime();

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-session-id");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 1. KIỂM TRA KHÓA API TỰ ĐỘNG VÀO NGÀY CUỐI THÁNG (ANTI-SPAM END-OF-MONTH LOCK)
  const now = Date.now();
  if (now > EXPIRATION_TIMESTAMP) {
    return res.status(200).json({
      fallback: true,
      expired: true,
      message: "Thời gian mở API trực tiếp của đề án nghiên cứu đã kết thúc vào ngày 31/10/2026. Hệ thống tự động chuyển sang chế độ Demo Ngoại tuyến (Offline RAG Cache) với đầy đủ 5 tình huống lâm sàng chuẩn."
    });
  }

  // 2. PARSE BODY & LẤY SESSION ID
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }
  const { query, context, sessionId } = body || {};

  // 3. KIỂM SOÁT TẦN SUẤT TRUY VẤN (RATE LIMITING: MAX 20/10 PHÚT, MAX 30/NGÀY)
  const clientKey = sessionId || req.headers["x-session-id"] || req.headers["x-forwarded-for"] || "guest_session";
  const userTimestamps = rateLimitStore.get(clientKey) || [];
  
  // Lọc các request trong 10 phút và trong 24 giờ
  const tenMinutesAgo = now - 10 * 60 * 1000;
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  
  const recent10Min = userTimestamps.filter(t => t > tenMinutesAgo);
  const recentDay = userTimestamps.filter(t => t > oneDayAgo);

  if (recent10Min.length >= 20) {
    return res.status(200).json({
      fallback: true,
      rateLimited: true,
      message: "⚠️ Bạn đã đạt giới hạn gửi tin nhắn thử nghiệm (Tối đa 20 lượt trong 10 phút). Vui lòng đợi ít phút trước khi hỏi tiếp hoặc nhấp chọn các tình huống lâm sàng mẫu có sẵn!"
    });
  }

  if (recentDay.length >= 30) {
    return res.status(200).json({
      fallback: true,
      rateLimited: true,
      message: "⚠️ Bạn đã đạt giới hạn 30 lượt truy vấn trong ngày để bảo vệ tài nguyên API. Vui lòng quay lại vào ngày mai hoặc sử dụng các tình huống cận lâm sàng mẫu có sẵn!"
    });
  }

  // Cập nhật timestamp request
  recentDay.push(now);
  rateLimitStore.set(clientKey, recentDay);

  const apiKey = process.env.AGNES_API_KEY || "sk-vGNgw8bXxGCW4FBLEHMqf4PjG50LILXZHFM3hinsY2Iziv4X";
  const baseUrl = process.env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1";
  const model = process.env.LLM_MODEL || "agnes-3.0-flash";

  const systemPrompt = `Bạn là Trợ lý AI MIA (Phiên bản mô phỏng nghiên cứu - Research Prototype) được phát triển trong đề án thực chiến của Lab Coach Nguyễn Xuân Tài (Vinmec Exploration Sprint).
MỤC ĐÍCH THỬ NGHIỆM: Mô phỏng giải pháp giao tiếp phi lâm sàng thân thiện, giúp bệnh nhân đọc hiểu nhanh ý nghĩa đời thường của các chỉ số xét nghiệm máu (như ALT, AST, HbA1c, Creatinine...) trong 45 phút chờ khám và chuẩn bị sẵn đúng 2 câu hỏi trọng tâm để tự tin trao đổi với Bác sĩ tại phòng khám.
ĐÂY LÀ BẢN COPY MÔ PHỎNG PHỤC VỤ HỘI ĐỒNG GIÁM KHẢO ĐÁNH GIÁ, KHÔNG PHẢI PHIÊN BẢN CHÍNH THỨC THAY THẾ CHO HỆ THỐNG Y TẾ SẢN XUẤT CỦA BỆNH VIỆN VINMEC.

QUY TẮC BẮT BUỘC:
1. Khi bệnh nhân hỏi bạn là ai, bạn có tác dụng gì, ai tạo ra bạn: Giới thiệu rõ bạn là Bản mô phỏng Trợ lý AI MIA thuộc dự án nghiên cứu AI Y tế của Lab Coach Nguyễn Xuân Tài (Vinmec Exploration Sprint), đóng vai trò hỗ trợ bệnh nhân đọc hiểu cận lâm sàng và chuẩn bị câu hỏi trước khi gặp Bác sĩ.
2. Tuyệt đối KHÔNG chẩn đoán bệnh tật, KHÔNG khẳng định bệnh nan y và KHÔNG kê đơn thuốc.
3. Với các chỉ số tăng nhẹ (như ALT 58 U/L, AST 52 U/L), luôn giải thích rằng đây là hiện tượng phổ biến do sinh hoạt ăn uống, vận động hoặc bia rượu gần ngày khám, HOÀN TOÀN KHÔNG đồng nghĩa với suy gan hay bệnh hiểm nghèo.
4. Luôn cung cấp đúng 2 câu hỏi thực tế để bệnh nhân trao đổi cùng bác sĩ.
5. Đưa ra 1 gợi ý sinh hoạt nhẹ nhàng (uống nước, nghỉ ngơi, thở sâu).
6. Giọng điệu ấm áp, xưng là "MIA" (thân thiện, gần gũi, thấu cảm, không dùng từ kỹ thuật thô ráp như "Core Navigator").

BẮT BUỘC TRẢ VỀ DUY NHẤT ĐỊNH DẠNG JSON HỢP LỆ (Không kèm markdown code fence):
{
  "badge": "Trợ lý AI MIA • [Tên chuyên khoa hoặc nhóm chỉ số]",
  "meaning": "Lời giải thích đời thường, thân thiện, trấn an tâm lý...",
  "questions": ["Câu hỏi 1 bạn nên hỏi Bác sĩ?", "Câu hỏi 2 bạn nên hỏi Bác sĩ?"],
  "lifestyle": "Gợi ý sinh hoạt nhẹ nhàng...",
  "disclaimer": "Thông tin mang tính chất mô phỏng tham khảo. Mọi kết luận chính xác do Bác sĩ tại phòng khám đưa ra."
}`;

  try {
    const userContent = `Câu hỏi của bệnh nhân: ${query}\n` + (context ? `Ngữ cảnh: ${JSON.stringify(context)}` : "");
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ],
        temperature: 0.3,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      throw new Error(`Upstream API status ${response.status}`);
    }

    const data = await response.json();
    let rawText = data.choices?.[0]?.message?.content || "";
    rawText = rawText.replace(/^```(?:json)?\s*/m, "").replace(/\s*```$/m, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const s = rawText.indexOf("{");
      const e = rawText.lastIndexOf("}");
      if (s !== -1 && e > s) {
        parsed = JSON.parse(rawText.slice(s, e + 1));
      } else {
        throw new Error("Invalid JSON from LLM");
      }
    }

    return res.status(200).json({ response: parsed, source: "LLM_AUGMENTED" });
  } catch (err) {
    return res.status(200).json({
      fallback: true,
      error_details: err.message,
      message: "LLM API fallback to local RAG"
    });
  }
}
