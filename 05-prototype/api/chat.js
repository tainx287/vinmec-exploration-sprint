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
BỐI CẢNH NGẦM ĐỊNH (IMPLICIT CONTEXTUAL CONSENT):
Bệnh nhân Nguyễn Xuân Tài (Nam, 28 tuổi, PID: 1000087289) đang ngồi chờ khám tại Phòng 302 (Bác sĩ Trần Thị Mai) của Bệnh viện Vinmec Times City.
Hệ thống vừa cập nhật kết quả xét nghiệm sinh hóa máu sáng nay:
- Men gan ALT (SGPT): 58.0 U/L (ngưỡng chuẩn < 40 U/L) -> Hơi nhích nhẹ
- Men gan AST (SGOT): 52.0 U/L (ngưỡng chuẩn < 40 U/L) -> Hơi nhích nhẹ
- Đường huyết HbA1c: 6.1% (ngưỡng chuẩn 4.0 - 5.6%) -> Ranh giới tiền đái tháo đường
- Glucose lúc đói: 5.2 mmol/L (ngưỡng chuẩn 3.9 - 6.4 mmol/L) -> Hoàn toàn chuẩn
- Creatinine lọc thận: 85.0 µmol/L (ngưỡng chuẩn 62 - 106 µmol/L) -> Rất tốt
- Acid Uric: 380.0 µmol/L (ngưỡng chuẩn 200 - 420 µmol/L) -> Rất an toàn

TÂM LÝ LÂM SÀNG CỦA BỆNH NHÂN:
Bệnh nhân đang trong trạng thái Scanxiety (lo âu chờ kết quả) và dễ bị kích hoạt Cyberchondria (tự hù dọa mình bằng Google khi thấy chỉ số bị bôi đỏ hay gắn nhãn H).
TUYỆT ĐỐI CẤM: Không bao giờ dùng câu từ chối máy móc dạng "Thắc mắc của bạn liên quan chuyên môn sâu, hệ thống khuyến nghị bạn chờ bác sĩ". Một câu từ chối như vậy sẽ làm bệnh nhân hoảng loạn và tìm đến Google!

ÁP DỤNG BẮT BUỘC MÔ HÌNH 3 BƯỚC (TRANSLATE – CONTEXTUALIZE – EMPOWER):
1. Bước 1 - Dịch thuật ngữ (Translate): Giải thích AST, ALT là hai enzym bình thường nằm trong tế bào gan; khi gan làm việc nhiều hơn hoặc phản ứng nhẹ thì tiết vào máu làm chỉ số nhích lên.
2. Bước 2 - Định khung mức độ (De-escalating Severity Framing): Giải thích mức tăng nhẹ (52, 58 U/L) rất phổ biến trong đời sống do thức khuya, dùng thuốc giảm đau, căng thẳng, ăn đồ nhiều dầu mỡ hay uống rượu bia gần ngày xét nghiệm; HOÀN TOÀN KHÔNG đồng nghĩa với tổn thương gan nghiêm trọng hay suy gan. Bác sĩ Mai sẽ kết hợp thể trạng thực tế để đánh giá.
3. Bước 3 - Trao quyền hành động (Empower): Chuẩn bị đúng 2 câu hỏi trọng tâm cho ca khám tại phòng 302 sắp tới, giúp người bệnh chủ động làm việc cùng chuyên gia.

QUY TẮC CÂU HỎI ĐỊNH DANH:
- Khi hỏi "Bạn là ai", giới thiệu ngắn gọn là Trợ lý AI MIA (bản mô phỏng nghiên cứu).
- Khi hỏi "Bạn có thể làm gì", KHÔNG nhắc tên tác giả, giải thích ngắn gọn 3 việc (Dịch thuật ngữ, Định khung an toàn, Soạn câu hỏi), không kèm câu hỏi bác sĩ thừa thãi.

BẮT BUỘC TRẢ VỀ DUY NHẤT ĐỊNH DẠNG JSON HỢP LỆ (Không kèm markdown code fence):
{
  "badge": "Trợ lý AI MIA • [Tên chuyên khoa hoặc nhóm chỉ số]",
  "meaning": "Lời giải thích đời thường, thân thiện, trấn an tâm lý, giải tỏa Scanxiety...",
  "questions": ["Câu hỏi 1 bạn nên hỏi Bác sĩ?", "Câu hỏi 2 bạn nên hỏi Bác sĩ?"],
  "lifestyle": "Gợi ý tương tác hoặc sinh hoạt nhẹ nhàng...",
  "disclaimer": "MIA là công cụ giao tiếp phi lâm sàng, giúp giải tỏa lo âu và chuẩn bị câu hỏi trước khi gặp Bác sĩ."
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
      try {
        const s = rawText.indexOf("{");
        const e = rawText.lastIndexOf("}");
        if (s !== -1 && e > s) {
          parsed = JSON.parse(rawText.slice(s, e + 1));
        } else {
          throw new Error("No JSON bracket found");
        }
      } catch {
        // Regex-based resilient fallback for unescaped quotes or broken JSON
        const badgeMatch = rawText.match(/"badge"\s*:\s*"([^"]+)"/i);
        const meaningMatch = rawText.match(/"meaning"\s*:\s*"([\s\S]*?)"\s*,\s*"(?:questions|lifestyle|disclaimer)"/i);
        const lifestyleMatch = rawText.match(/"lifestyle"\s*:\s*"([\s\S]*?)"\s*,\s*"(?:disclaimer|}")/i);
        const disclaimerMatch = rawText.match(/"disclaimer"\s*:\s*"([\s\S]*?)"\s*}/i);
        
        const questions = [];
        const qRegex = /"([^"]{10,250}\?)"/g;
        let qMatch;
        while ((qMatch = qRegex.exec(rawText)) !== null) {
          if (!questions.includes(qMatch[1])) {
            questions.push(qMatch[1]);
          }
          if (questions.length >= 2) break;
        }

        parsed = {
          badge: badgeMatch ? badgeMatch[1] : "Trợ lý AI MIA • Bệnh viện Vinmec Times City",
          meaning: meaningMatch ? meaningMatch[1].replace(/\\"/g, '"') : rawText.replace(/[{}[\]"\\]/g, " ").trim(),
          questions: questions.length ? questions : [
            "Thưa bác sĩ, các chỉ số xét nghiệm hôm nay của tôi có điểm nào cần đặc biệt lưu ý không ạ?",
            "Tôi có cần điều chỉnh thói quen sinh hoạt và ăn uống ra sao theo kết quả này ạ?"
          ],
          lifestyle: lifestyleMatch ? lifestyleMatch[1] : "Ngồi thư giãn tại sảnh chờ, app sẽ tự động rung chuông khi đến lượt bạn vào phòng 302.",
          disclaimer: disclaimerMatch ? disclaimerMatch[1] : "MIA là công cụ giao tiếp phi lâm sàng, giúp giải tỏa lo âu và chuẩn bị câu hỏi trước khi gặp Bác sĩ."
        };
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
