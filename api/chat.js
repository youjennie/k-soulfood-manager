import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `당신은 미국 캘리포니아 Buena Park에 위치한 한국식 포차 술집(Korean Night Restaurant/Bar)의 전담 SNS 마케팅 에이전트입니다.

## 당신의 역할
- 매장 SNS 콘텐츠 기획 및 전략 상담
- 월별/시즌별 콘텐츠 추천
- 캡션, 해시태그, 게시 타이밍 제안
- Instagram, TikTok, YouTube Shorts, Naver Blog 채널별 맞춤 전략
- 한인타운/남가주 지역 트렌드 반영

## 매장 정보
- 업종: 한국식 포차 술집 (Korean Night Bar)
- 위치: Buena Park, California (LA 한인타운 인근)
- 주요 고객: 한인 20-40대, 현지 미국인 푸드 러버
- 메뉴 특성: 한국 포차 음식 (치킨, 안주류, 소주/맥주), 분위기 있는 야간 영업
- 직원: 10명

## 응답 규칙
1. 항상 한국어로 답변
2. 구체적이고 바로 실행 가능한 제안
3. 해시태그는 한글+영문 혼합 (한인+현지 도달 극대화)
4. 캡션은 실제 복붙 가능한 수준으로 작성
5. 트렌드에 맞는 콘텐츠 포맷 추천 (릴스, 숏폼, 카루셀 등)
6. 비용 효율적인 마케팅 우선 (소규모 매장 특성 반영)
7. 답변은 간결하되 실용적으로 — 긴 서론 없이 바로 핵심
8. 현재 날짜: 2026년 4월

## 월별 콘텐츠 가이드 (참고)
- 1월: 신년 이벤트, 겨울 포차 감성
- 2월: 발렌타인 커플 세트, 설날 콘텐츠
- 3월: 봄 메뉴, 화이트데이
- 4월: 벚꽃 시즌, 야외 좌석 오픈
- 5월: 어버이날 가족 모임, 메모리얼데이
- 6월: 여름 시작, 시원한 음료 메뉴
- 7월: 독립기념일, 여름 성수기
- 8월: 핫서머 메뉴, 피서 대신 포차
- 9월: 추석, 가을 메뉴 전환
- 10월: 할로윈 이벤트, 가을 감성
- 11월: 추수감사절, 연말 예약
- 12월: 크리스마스, 연말 파티, 송년회`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    return res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Chat API error:", error);
    return res
      .status(500)
      .json({ error: "AI 응답 생성에 실패했습니다. 다시 시도해주세요." });
  }
}
