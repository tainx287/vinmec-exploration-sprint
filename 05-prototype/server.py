#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MyVinmec Care Navigator - Lightweight Local RAG Proxy & Static Server
Tối ưu hóa: Chỉ sử dụng thư viện chuẩn của Python (Zero external dependencies).
Tự động nạp cấu hình từ file .env (hỗ trợ OpenAI, Agnes AI, Gemini hoặc Offline Mode).
"""

import http.server
import socketserver
import os
import sys
import json
import urllib.request
import urllib.error
from pathlib import Path

# Thư mục gốc của prototype
PROTOTYPE_DIR = Path(__file__).resolve().parent
WORKSPACE_ROOT = PROTOTYPE_DIR.parent

PORT = int(os.environ.get("PORT", 8000))

def load_env_file(filepath):
    """Nạp biến môi trường từ file .env đơn giản không cần python-dotenv"""
    env_vars = {}
    if not os.path.exists(filepath):
        return env_vars
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" in line:
                    key, val = line.split("=", 1)
                    key = key.strip()
                    val = val.strip().strip('"').strip("'")
                    env_vars[key] = val
    except Exception as e:
        print(f"[WARN] Khong the doc file env tai {filepath}: {e}")
    return env_vars

# Đọc cấu hình từ .env tại prototype trước, sau đó bổ sung từ workspace root
ENV_VARS = {}
ENV_VARS.update(load_env_file(WORKSPACE_ROOT / ".env"))
ENV_VARS.update(load_env_file(PROTOTYPE_DIR / ".env"))

# Xác định API Key và Base URL
OPENAI_API_KEY = ENV_VARS.get("OPENAI_API_KEY") or ENV_VARS.get("AGNES_API_KEY") or ENV_VARS.get("TYPESAFE_API_KEY")
OPENAI_BASE_URL = ENV_VARS.get("OPENAI_BASE_URL") or ENV_VARS.get("AGNES_BASE_URL")
if OPENAI_BASE_URL and not OPENAI_BASE_URL.endswith("/v1") and "apihub.agnes-ai.com" in OPENAI_BASE_URL:
    OPENAI_BASE_URL = OPENAI_BASE_URL.rstrip("/") + "/v1"
elif not OPENAI_BASE_URL:
    OPENAI_BASE_URL = "https://api.openai.com/v1"

GEMINI_API_KEY = ENV_VARS.get("GEMINI_API_KEY")
LLM_MODEL = ENV_VARS.get("LLM_MODEL", "gpt-4o-mini")

print("=" * 68)
print("  🏥 MYVINMEC CARE NAVIGATOR - LOCAL BACKEND SERVER")
print(f"  • Thu muc web: {PROTOTYPE_DIR}")
print(f"  • Cong HTTP:   http://localhost:{PORT}")
if OPENAI_API_KEY:
    masked_key = OPENAI_API_KEY[:6] + "..." + OPENAI_API_KEY[-4:]
    print(f"  • API Key:     Da tim thay ({masked_key})")
    print(f"  • Base URL:    {OPENAI_BASE_URL}")
    print(f"  • Model:       {LLM_MODEL}")
elif GEMINI_API_KEY:
    print(f"  • API Key:     Gemini API san sang")
else:
    print("  • Trang thai:  Che do Offline RAG Deterministic (Khong co API key)")
print("=" * 68)

SYSTEM_PROMPT = """Bạn là Trợ lý MyVinmec Care Navigator - công cụ giao tiếp y tế phi lâm sàng của Hệ thống Y tế Quốc tế Vinmec.
Mục tiêu của bạn là giúp bệnh nhân hiểu nhanh ý nghĩa của các chỉ số xét nghiệm (như ALT, AST, HbA1c, Creatinine...) bằng ngôn ngữ đời thường, giải tỏa tâm lý lo âu trong khoảng thời gian chờ đến lượt gặp bác sĩ, đồng thời trang bị cho bệnh nhân đúng 2 câu hỏi trọng tâm để chủ động trao đổi với bác sĩ tại phòng khám.

QUY TẮC BẮT BUỘC:
1. Tuyệt đối KHÔNG chẩn đoán bệnh, KHÔNG khẳng định bệnh nan y và KHÔNG kê đơn thuốc.
2. Với các chỉ số tăng nhẹ (như men gan 50-60 U/L), luôn giải thích rằng đây là hiện tượng phổ biến do sinh hoạt (ăn nhiều đạm, thức khuya, tập gym...) và hoàn toàn không đồng nghĩa với suy gan hay bệnh nguy hiểm.
3. Luôn cung cấp đúng 2 câu hỏi thực tế, lễ phép để bệnh nhân hỏi bác sĩ.
4. Đưa ra 1 gợi ý thói quen sinh hoạt nhẹ nhàng (uống nước, nghỉ ngơi, giảm đồ ngọt/rượu bia).
5. Nhắc bệnh nhân kiên nhẫn và thoải mái tinh thần chờ lượt khám.

BẮT BUỘC TRẢ VỀ DUY NHẤT ĐỊNH DẠNG JSON HỢP LỆ (Không kèm markdown code fence ```json):
{
  "badge": "Tên chuyên khoa hoặc nhóm chỉ số",
  "meaning": "Lời giải thích đời thường, trấn an tâm lý ngắn gọn...",
  "questions": [
    "Câu hỏi 1 cụ thể hỏi bác sĩ?",
    "Câu hỏi 2 cụ thể hỏi bác sĩ?"
  ],
  "lifestyle": "Gợi ý sinh hoạt đời thường ngắn gọn...",
  "disclaimer": "Kết quả chỉ số mang tính tham khảo sơ bộ. Bác sĩ chuyên khoa tại phòng khám sẽ kết luận chính xác."
}
"""

class VinmecHttpHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PROTOTYPE_DIR), **kwargs)

    def log_message(self, format, *args):
        # Giảm ồn console, chỉ in request quan trọng
        if "POST /api/chat" in str(args):
            sys.stdout.write(f"[API Call] {args[0]} - Code: {args[1]}\n")
            sys.stdout.flush()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        if self.path == "/api/chat":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            
            try:
                payload = json.loads(post_data.decode("utf-8"))
            except Exception as e:
                payload = {}

            query = payload.get("query", "").strip()
            context = payload.get("context", {})

            # Xử lý truy vấn qua LLM nếu có API key
            response_data = self.call_llm(query, context)

            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode("utf-8"))
        else:
            self.send_error(404, "Endpoint Not Found")

    def call_llm(self, query, context):
        if not OPENAI_API_KEY and not GEMINI_API_KEY:
            return {
                "fallback": True,
                "message": "Offline deterministic mode active. Client will use local RAG corpus."
            }

        user_content = f"Câu hỏi của bệnh nhân: {query}\n"
        if context:
            user_content += f"Ngữ cảnh kết quả xét nghiệm liên quan: {json.dumps(context, ensure_ascii=False)}\n"

        if OPENAI_API_KEY:
            url = f"{OPENAI_BASE_URL.rstrip('/')}/chat/completions"
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {OPENAI_API_KEY}"
            }
            body = {
                "model": LLM_MODEL,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_content}
                ],
                "temperature": 0.3,
                "max_tokens": 600
            }

            try:
                req = urllib.request.Request(url, data=json.dumps(body).encode("utf-8"), headers=headers, method="POST")
                with urllib.request.urlopen(req, timeout=12) as res:
                    res_body = res.read().decode("utf-8")
                    result = json.loads(res_body)
                    raw_text = result["choices"][0]["message"]["content"].strip()
                    
                    # Dọn dẹp codeblock markdown nếu có
                    if raw_text.startswith("```"):
                        lines = raw_text.splitlines()
                        if lines[0].startswith("```"):
                            lines = lines[1:]
                        if lines and lines[-1].startswith("```"):
                            lines = lines[:-1]
                        raw_text = "\n".join(lines).strip()
                    
                    parsed_json = json.loads(raw_text)
                    return {"response": parsed_json, "source": "LLM_AUGMENTED"}
            except Exception as e:
                # Ghi log lỗi ra console máy chủ để lập trình viên xem, trả về fallback an toàn
                print(f"[API ERROR /api/chat]: {e}", file=sys.stderr)
                return {
                    "fallback": True,
                    "error_details": str(e),
                    "message": "LLM API temporarily unavailable. Gracefully switched to Local RAG."
                }

        return {"fallback": True}

def run_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), VinmecHttpHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[INFO] May chu da dung theo yeu cau.")

if __name__ == "__main__":
    run_server()
