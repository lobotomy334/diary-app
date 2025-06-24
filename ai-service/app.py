
from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F

app = Flask(__name__)

try:
    model_id = "hun3359/klue-bert-base-sentiment"
    tokenizer = AutoTokenizer.from_pretrained(model_id)
    model = AutoModelForSequenceClassification.from_pretrained(model_id)
    model.eval()
except Exception as e:
    print("❌ 모델 로딩 실패:", e)
    tokenizer = None
    model = None

# 60개 감정 → 5개 상위 감정으로 매핑
label_map = {
    "분노 😡": ["짜증", "분노", "억울함", "질투", "화남"],
    "두려움 😨": ["불안", "당황", "긴장", "초조", "무서움"],
    "기쁨 😊": ["기쁨", "사랑스러움", "행복", "희열", "설렘", "만족"],
    "평온 😌": ["편안함", "평온함", "신뢰", "안정감"],
    "슬픔 😢": ["슬픔", "외로움", "허탈함", "우울", "실망"]
}

@app.route('/analyze', methods=['POST'])
def analyze():
    if not tokenizer or not model:
        return jsonify({"error": "모델이 로드되지 않았습니다."}), 500

    try:
        data = request.json
        text = data.get("text", "")

        if not text.strip():
            return jsonify({"error": "텍스트가 제공되지 않았습니다."}), 400

        inputs = tokenizer(text, return_tensors="pt")
        with torch.no_grad():
            outputs = model(**inputs)

        logits = outputs.logits[0]
        probs = F.softmax(logits, dim=0)

        # load 60개 라벨
        raw_labels = model.config.id2label
        group_scores = { group: 0.0 for group in label_map }

        for idx, score in enumerate(probs):
            label_text = raw_labels[idx].lower()
            for group, keywords in label_map.items():
                if any(kw in label_text for kw in keywords):
                    group_scores[group] += float(score.item())

        top_emotions = [
            {"label": k, "score": round(v * 100, 2)}
            for k, v in sorted(group_scores.items(), key=lambda x: x[1], reverse=True)
        ]

        best_emotion = top_emotions[0]["label"]
        best_score = top_emotions[0]["score"]

        return jsonify({
            "emotion": best_emotion,
            "score": best_score,
            "top_emotions": top_emotions
        })

    except Exception as e:
        print("❌ 감정 분석 중 오류:", e)
        return jsonify({"error": "감정 분석 중 오류가 발생했습니다."}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

