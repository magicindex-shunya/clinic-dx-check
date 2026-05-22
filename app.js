const questions = [
  {
    id: "reception_repeat",
    text: "「初診の持ち物」「予約変更」「駐車場」など、同じ問い合わせの電話が受付に集中している",
    hint: "発熱対応、診療時間、検査前の確認などの繰り返し質問を含みます。",
    weights: { reception: 5, line: 1 },
  },
  {
    id: "reception_variance",
    text: "受付スタッフによって案内がばらつき、新人がすぐ院長・看護師に確認してくる",
    hint: "回答の言い方や判断基準が人によって違う状態です。",
    weights: { reception: 4, docs: 1 },
  },
  {
    id: "line_setup",
    text: "LINE公式やWeb予約はあるが、あいさつ文・自動返信・リッチメニューが整っていない",
    hint: "初期設定のまま、または「電話する」しか導線が無い状態です。",
    weights: { line: 5 },
  },
  {
    id: "line_flow",
    text: "Instagram・ホームページを見た人が、予約・問い合わせまでたどり着けていない",
    hint: "予約前の「これ聞いていい？」をすくう導線が無い状態です。",
    weights: { line: 4, reputation: 1 },
  },
  {
    id: "followup_miss",
    text: "検査後の説明予約やキャンセル後の再予約など、フォロー対象の抜け漏れが見えにくい",
    hint: "フォロー対象の抽出が毎回手作業になっている状態を含みます。",
    weights: { followup: 5 },
  },
  {
    id: "followup_recall",
    text: "生活習慣病・CPAP・歯科リコールなど、継続受診が途切れた患者を追えていない",
    hint: "定期検診や再診の案内が患者任せになっている状態です。",
    weights: { followup: 4, line: 1 },
  },
  {
    id: "reputation_response",
    text: "Google口コミへの返信や、Instagram・SNSの発信が後回し・属人的になっている",
    hint: "投稿ネタが続かない、返信が遅れる状態を含みます。",
    weights: { reputation: 5 },
  },
  {
    id: "reputation_ad",
    text: "医療広告の表現が不安で投稿を出せない、または自費診療の説明が売り込みっぽくなる",
    hint: "効果保証・体験談・絶対表現などの不安を含みます。",
    weights: { reputation: 4, docs: 1 },
  },
  {
    id: "docs_drafting",
    text: "紹介状・説明文・患者向け案内など、診療後に院長へ残る文書作成に時間がかかる",
    hint: "毎回似た文書を作り直している状態です。",
    weights: { docs: 5 },
  },
  {
    id: "docs_manual",
    text: "院内ルール・マニュアルが口頭・属人化し、新人教育や議事録の作成が負担になっている",
    hint: "マニュアルが古い・探せない・読まれない状態を含みます。",
    weights: { docs: 4, reception: 1 },
  },
  {
    id: "industry_specific",
    text: "歯科の定期検診・矯正相談、薬局の服薬フォロー、訪問診療の資料作成など、業種特有の繰り返し業務がある",
    hint: "ご自身の業種に当てはまる場合に選んでください。",
    weights: { industry: 5, followup: 1 },
  },
  {
    id: "industry_materials",
    text: "業種特有の患者案内・LINE配信・営業資料を、毎回ゼロから作っている",
    hint: "ケアマネ向け資料、矯正相談、服薬フォローなどを含みます。",
    weights: { industry: 4, line: 1 },
  },
];

const answerLabels = ["少ない", "やや少ない", "普通", "やや多い", "かなり多い"];

const axes = {
  reception: {
    title: "受付・電話・問い合わせAI",
    short: "受付・電話",
    pain: "同じ問い合わせが受付に集中し、会計・患者対応・診療連携を止めている状態です。",
    app: "受付FAQ・問い合わせ整理",
    mvp: "よくある質問をFAQ化し、LINE自動返信・受付スクリプト・電話対応に振り分ける。",
    caution: "症状への診断回答はAIにさせず、受診可否は院内ルールで電話・受診案内へ逃がします。",
    offer: "「電話に残す質問」と「自動化できる質問」を分ける整理から始めると刺さります。",
  },
  line: {
    title: "LINE・予約導線改善AI",
    short: "LINE・予約",
    pain: "患者が予約・問い合わせまでたどり着けず、電話や離脱につながっている状態です。",
    app: "LINE・予約導線改善",
    mvp: "あいさつ文・自動返信・リッチメニュー構成・ステップ配信の下書きを作る。",
    caution: "LINE上で個別の医療相談に自動回答せず、予約・案内・FAQ導線に限定します。",
    offer: "Instagram/HPからLINEへの流れを整える提案は、効果が見えやすいです。",
  },
  followup: {
    title: "再診・検査・リコールAI",
    short: "再診・リコール",
    pain: "再診・検査説明・キャンセル後未予約・リコールの抜け漏れが見えにくい状態です。",
    app: "再診・検査フォロー",
    mvp: "CSV・手入力からフォロー対象を抽出し、優先度づけと案内文案を下書きする。",
    caution: "自動送信ではなく人間承認後に送信し、緊急度や診療判断はAIに決めさせません。",
    offer: "抜け漏れの見える化は、医療安全と機会損失の両方に刺さります。",
  },
  reputation: {
    title: "口コミ・集患・SNS AI",
    short: "口コミ・集患",
    pain: "口コミ返信やSNS発信が後回し・属人的になり、評判づくりが続かない状態です。",
    app: "口コミ・SNS発信支援",
    mvp: "口コミ返信の下書き、投稿ネタ出し、医療広告に配慮した文面整理を行う。",
    caution: "返信に個人を特定できる情報を書かず、最終的な公開判断は医療機関側で行います。",
    offer: "悪い口コミに感情的にならない下書きづくりは、院長の負担に直結します。",
  },
  docs: {
    title: "院内文書・マニュアル・教育AI",
    short: "院内文書・教育",
    pain: "診療後の文書作成や、属人化した院内ルール・教育が院長の時間を奪う状態です。",
    app: "文書・SOP・教育テンプレ整備",
    mvp: "紹介状・説明文・案内文をテンプレ化し、院内ルールをQ&A化、議事録を要約する。",
    caution: "患者名入り資料・診療録は入力せず、医学的妥当性と最終確認は医療機関側に残します。",
    offer: "診療後の文書時間を削る提案は、院長本人に価値が伝わりやすいです。",
  },
  industry: {
    title: "業種別AI活用（歯科・薬局・訪問診療）",
    short: "業種別",
    pain: "歯科リコール、服薬フォロー、訪問診療の資料作成など、業種特有の繰り返し業務が残る状態です。",
    app: "業種別の配信・案内・資料下書き",
    mvp: "業種別のLINE配信・案内文・営業資料・ケアマネ向け資料の下書きを作る。",
    caution: "患者個人情報を入力せず、案内・配信は人間承認後に行います。",
    offer: "業種の具体業務に合わせると、「自院のことだ」と感じてもらいやすいです。",
  },
};

const goalBoost = {
  院長時間: { docs: 3, reception: 1 },
  スタッフ負担: { reception: 3, docs: 2, line: 1 },
  機会損失: { followup: 3, reputation: 2, line: 1 },
  運用安定: { docs: 2, followup: 1, line: 1, reception: 1 },
};

const appSpecs = {
  reception: {
    ease: 80,
    risk: 30,
    build: "中",
    reason: "電話代行を自作せず、まず問い合わせ分類とFAQ化なら低リスクで試せる。",
    questions: [
      "電話のうち、毎日繰り返される質問は何ですか。",
      "受付が院長や看護師に確認する電話はどんな内容ですか。",
      "LINEやWebで事前案内できそうな内容はありますか。",
    ],
    noGo: "症状から診断したり、緊急度をAIに判定させない。",
  },
  line: {
    ease: 78,
    risk: 28,
    build: "中",
    reason: "既存のLINEやWeb予約導線の外側から改善でき、デモ化しやすい。",
    questions: [
      "患者が予約の前後で迷いやすい場面はどこですか。",
      "LINEに入れたいが未整理の案内は何ですか。",
      "Instagram・HPからLINEへの導線はつながっていますか。",
    ],
    noGo: "LINE上で個別の医療相談に自動回答しない。",
  },
  followup: {
    ease: 60,
    risk: 55,
    build: "中〜高",
    reason: "価値は大きいが、実患者データの扱いと連絡承認フローの設計が必要。",
    questions: [
      "検査後説明待ちやキャンセル後未予約は、今どこで確認していますか。",
      "再診・リコール対象は誰が抽出していますか。",
      "LINEや電話で連絡する前の承認者は誰ですか。",
    ],
    noGo: "緊急性や受診要否をAIに判定させない。自動送信はしない。",
  },
  reputation: {
    ease: 74,
    risk: 34,
    build: "中",
    reason: "口コミ返信や投稿の下書きから始められ、個人情報を避けて運用しやすい。",
    questions: [
      "返信や投稿で、毎回時間がかかっているのはどれですか。",
      "医療広告表現で不安なポイントはどこですか。",
      "発信は誰が担当し、どれくらいの頻度で続いていますか。",
    ],
    noGo: "返信・投稿に患者個人を特定できる情報を含めない。",
  },
  docs: {
    ease: 72,
    risk: 40,
    build: "中",
    reason: "テンプレ化しやすい一方、実患者情報を扱う場合は確認フローが必要。",
    questions: [
      "診療後に残りやすい文書は何ですか。",
      "下書きだけでも時短になる文書はどれですか。",
      "院長確認前にスタッフが整えられる範囲はどこですか。",
    ],
    noGo: "診療録・診断・治療方針をAIだけで確定しない。患者名入り資料は入力しない。",
  },
  industry: {
    ease: 70,
    risk: 36,
    build: "中",
    reason: "業種特有の定型業務に絞れば、サンプルや匿名データから試しやすい。",
    questions: [
      "業種特有で、毎回ゼロから作っている資料・案内は何ですか。",
      "歯科リコール／服薬フォロー／訪問資料など、優先したい領域はどれですか。",
      "案内・配信の最終確認は誰が行いますか。",
    ],
    noGo: "患者個人情報を入力せず、配信・案内は人間承認後に行う。",
  },
};

const STORAGE_KEY_PREFIX = "clinicDiagnosis:";
const LATEST_KEY = "clinicDiagnosis:latest";
const SUBMISSION_ENDPOINT = String(
  window.CLINIC_DIAGNOSIS_CONFIG?.submissionEndpoint ?? "",
).trim();
const INTAKE_URL = String(window.CLINIC_DIAGNOSIS_CONFIG?.intakeUrl ?? "").trim();

const form = document.querySelector("#diagnosisForm");
const questionList = document.querySelector("#questionList");
const resetButton = document.querySelector("#resetButton");
const copyButton = document.querySelector("#copyButton");
const copyStatus = document.querySelector("#copyStatus");
const submitStatus = document.querySelector("#submitStatus");

let latestMarkdown = "";

function renderQuestions() {
  if (!questionList) return;

  questionList.innerHTML = questions
    .map((question, index) => {
      const radios = answerLabels
        .map((label, value) => {
          const checked = value === 2 ? "checked" : "";
          return `
            <label>
              <input type="radio" name="${question.id}" value="${value}" ${checked} />
              <span>${label}</span>
            </label>
          `;
        })
        .join("");

      return `
        <fieldset class="question">
          <legend>
            ${index + 1}. ${question.text}
            <small>${question.hint}</small>
          </legend>
          <div class="scale">${radios}</div>
        </fieldset>
      `;
    })
    .join("");
}

function calculateScores(formData) {
  const scores = Object.fromEntries(Object.keys(axes).map((axis) => [axis, 0]));

  questions.forEach((question) => {
    const value = Number(formData.get(question.id) ?? 0);
    Object.entries(question.weights).forEach(([axis, weight]) => {
      scores[axis] += value * weight;
    });
  });

  const goal = formData.get("primaryGoal");
  Object.entries(goalBoost[goal] ?? {}).forEach(([axis, boost]) => {
    scores[axis] += boost;
  });

  return scores;
}

function getProfile(topAxis, scores) {
  const frontdesk = scores.reception + scores.line;
  const loss = scores.followup + scores.reputation;
  const doctorTime = scores.docs;

  if (topAxis === "docs" || (doctorTime >= frontdesk && doctorTime >= loss)) {
    return {
      label: "院長時間圧迫型",
      title: "診療後の文書・確認が残りやすい院長",
      summary: "院長確認前の下書き作成や、院内ルールのQ&A化から始めると効果を実感しやすいです。",
    };
  }

  if (loss >= frontdesk) {
    return {
      label: "機会損失・評判型",
      title: "再診の抜け漏れや口コミ対応が気になる院長",
      summary: "フォロー対象の見える化と、口コミ・SNS発信の下書きづくりで、機会損失と評判づくりを同時に整えられます。",
    };
  }

  return {
    label: "受付・導線詰まり型",
    title: "受付の問い合わせと予約導線が詰まりやすい院長",
    summary: "受付FAQの整理とLINE・予約導線の改善で、受付の負担と取りこぼしを減らす提案が刺さります。",
  };
}

function estimateOpportunityIndex(scores) {
  const total =
    scores.reception * 0.5 +
    scores.line * 0.42 +
    scores.followup * 0.4 +
    scores.reputation * 0.34 +
    scores.docs * 0.46 +
    scores.industry * 0.3;
  return Math.min(100, Math.max(12, Math.round(total * 1.25)));
}

function buildPrescription(scores) {
  return Object.entries(scores)
    .map(([axis, rawScore]) => {
      const spec = appSpecs[axis];
      const painIndex = Math.min(100, Math.round(rawScore * 4));
      const safetyIndex = 100 - spec.risk;
      const prescriptionScore = Math.round(
        painIndex * 0.45 + spec.ease * 0.35 + safetyIndex * 0.2,
      );
      const decision =
        prescriptionScore >= 70
          ? "先にMVP化"
          : prescriptionScore >= 55
            ? "商談で要確認"
            : "後回し";

      return {
        axis,
        rawScore,
        painIndex,
        safetyIndex,
        ease: spec.ease,
        risk: spec.risk,
        build: spec.build,
        prescriptionScore,
        decision,
        reason: spec.reason,
      };
    })
    .sort((a, b) => b.prescriptionScore - a.prescriptionScore)
    .slice(0, 4);
}

function buildNextQuestions(prescriptions) {
  const selected = [];
  prescriptions.slice(0, 3).forEach((item) => {
    appSpecs[item.axis].questions.forEach((question) => {
      if (!selected.includes(question) && selected.length < 6) {
        selected.push(question);
      }
    });
  });
  return selected;
}

function buildNoGoList(prescriptions) {
  return prescriptions
    .slice(0, 4)
    .map((item) => appSpecs[item.axis].noGo)
    .filter((item, index, self) => self.indexOf(item) === index);
}

function buildRoadmap(topItems) {
  const first = topItems[0];
  const second = topItems[1];
  const third = topItems[2];

  return [
    `Week 1: ${axes[first.axis].short}の現状ヒアリングを行い、個人情報を含まないサンプルで試用版を見せる。`,
    `Week 2: ${axes[first.axis].app}のMVPを、Google Sheetsまたは静的フォームで作る。`,
    `Week 3: ${axes[second.axis].short}も含めて、院長・受付・事務長の運用フローに落とす。`,
    `Week 4: ${axes[third.axis].short}の次フェーズ提案を作り、単発パックまたは月額支援へつなげる。`,
  ];
}

function buildSalesCopy(clinicType, profile, topAxis, opportunityIndex) {
  const axis = axes[topAxis];
  return `${clinicType}では、AIそのものよりも「院長が診療後に残している判断」と「スタッフが日中に止まっている業務」を分けて見ることが重要です。今回の診断では、改善余地指数が${opportunityIndex}/100で、まず${axis.short}から整えるのが現実的です。最初は大きなシステム導入ではなく、${axis.mvp}`;
}

function makeDiagnosisId() {
  const stamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CK-${stamp}-${suffix}`;
}

function buildResult(formData, diagnosisId = makeDiagnosisId()) {
  const clinicName = String(formData.get("clinicName") ?? "").trim();
  const contactRoute = String(formData.get("contactRoute") ?? "").trim();
  const clinicType = formData.get("clinicType");
  const primaryGoal = formData.get("primaryGoal");
  const scores = calculateScores(formData);
  const topItems = Object.entries(scores)
    .map(([axis, score]) => ({ axis, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const topAxis = topItems[0].axis;
  const topScore = topItems[0].score;
  const profile = getProfile(topAxis, scores);
  const opportunityIndex = estimateOpportunityIndex(scores);
  const prescriptions = buildPrescription(scores);
  const nextQuestions = buildNextQuestions(prescriptions);
  const noGoList = buildNoGoList(prescriptions);
  const roadmap = buildRoadmap(topItems);
  const salesCopy = buildSalesCopy(clinicType, profile, topAxis, opportunityIndex);
  const answers = Object.fromEntries(
    questions.map((question) => [question.id, Number(formData.get(question.id) ?? 0)]),
  );

  return {
    diagnosisId,
    createdAt: new Date().toISOString(),
    source: new URLSearchParams(location.search).get("source") ?? "",
    clinicName,
    contactRoute,
    clinicType,
    primaryGoal,
    answers,
    scores,
    topItems,
    topAxis,
    topScore,
    profile,
    opportunityIndex,
    prescriptions,
    nextQuestions,
    noGoList,
    roadmap,
    salesCopy,
    syncStatus: "診断結果をこの端末に保存しました。",
  };
}

function persistResult(result) {
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${result.diagnosisId}`, JSON.stringify(result));
  localStorage.setItem(LATEST_KEY, result.diagnosisId);
}

function loadResult() {
  const params = new URLSearchParams(location.search);
  const diagnosisId = params.get("id") ?? localStorage.getItem(LATEST_KEY);
  if (!diagnosisId) return null;

  const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${diagnosisId}`);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

async function sendResult(result) {
  if (!SUBMISSION_ENDPOINT) {
    return {
      ok: false,
      status: "診断結果をこの端末に保存しました。",
    };
  }

  try {
    const body = new URLSearchParams();
    body.set("payload", JSON.stringify(result));
    body.set("diagnosisId", result.diagnosisId);
    body.set("clinicName", result.clinicName);
    body.set("contactRoute", result.contactRoute);
    body.set("clinicType", result.clinicType);
    body.set("source", result.source);
    body.set("profileLabel", result.profile.label);
    body.set("opportunityIndex", String(result.opportunityIndex));

    const response = await fetch(SUBMISSION_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body,
      keepalive: true,
    });

    return {
      ok: response.type === "opaque" || response.ok,
      status: "回答内容と診断結果を送信しました。",
    };
  } catch {
    return {
      ok: false,
      status: "送信に失敗しました。診断結果はこの端末に保存されています。",
    };
  }
}

function setText(id, value) {
  const target = document.querySelector(id);
  if (target) target.textContent = value;
}

function renderResult(result) {
  setText("#profileLabel", result.profile.label);
  setText("#profileTitle", result.profile.title);
  setText("#profileSummary", result.profile.summary);
  setText("#opportunityIndex", result.opportunityIndex);
  setText("#topScore", result.topScore);
  setText("#salesCopy", result.salesCopy);
  setText("#diagnosisId", result.diagnosisId);
  setText("#syncStatus", result.syncStatus);

  const intakeLink = document.querySelector("#intakeLink");
  if (intakeLink) {
    if (INTAKE_URL) {
      intakeLink.href = INTAKE_URL;
      intakeLink.classList.remove("hidden");
    } else {
      intakeLink.classList.add("hidden");
    }
  }

  const prescriptionCards = document.querySelector("#prescriptionCards");
  if (prescriptionCards) {
    prescriptionCards.innerHTML = result.prescriptions
      .map((item, index) => {
        const axis = axes[item.axis];
        return `
          <article class="prescription-card">
            <div class="prescription-top">
              <div>
                <h4>${index + 1}. ${axis.app}</h4>
                <p>${item.reason}</p>
              </div>
              <div class="prescription-score">${item.prescriptionScore}</div>
            </div>
            <div class="prescription-meta">
              <span>痛み ${item.painIndex}/100</span>
              <span>導入 ${item.ease}/100</span>
              <span>${item.decision}</span>
            </div>
          </article>
        `;
      })
      .join("");
  }

  const recommendations = document.querySelector("#recommendations");
  if (recommendations) {
    recommendations.innerHTML = result.topItems
      .map((item, index) => {
        const axis = axes[item.axis];
        return `
          <article class="recommendation">
            <h4>${index + 1}. ${axis.app}</h4>
            <p>${axis.pain}</p>
            <p><strong>初期MVP:</strong> ${axis.mvp}</p>
            <p><strong>安全設計:</strong> ${axis.caution}</p>
            <div class="tag-row">
              <span class="tag">スコア ${item.score}</span>
              <span class="tag">${axis.short}</span>
            </div>
          </article>
        `;
      })
      .join("");
  }

  const roadmap = document.querySelector("#roadmap");
  if (roadmap) {
    roadmap.innerHTML = result.roadmap.map((item) => `<li>${item}</li>`).join("");
  }

  const nextQuestions = document.querySelector("#nextQuestions");
  if (nextQuestions) {
    nextQuestions.innerHTML = result.nextQuestions.map((item) => `<li>${item}</li>`).join("");
  }

  const noGoList = document.querySelector("#noGoList");
  if (noGoList) {
    noGoList.innerHTML = result.noGoList.map((item) => `<li>${item}</li>`).join("");
  }

  latestMarkdown = buildMarkdown(result);
}

function buildMarkdown(result) {
  const prescriptions = result.prescriptions
    .map((item, index) => {
      const axis = axes[item.axis];
      return `${index + 1}. ${axis.app}\n   - 処方スコア: ${item.prescriptionScore}/100\n   - 痛み: ${item.painIndex}/100\n   - 導入容易性: ${item.ease}/100\n   - 判定: ${item.decision}\n   - 理由: ${item.reason}`;
    })
    .join("\n");

  const recommendations = result.topItems
    .map((item, index) => {
      const axis = axes[item.axis];
      return `${index + 1}. ${axis.app}\n   - ペイン: ${axis.pain}\n   - 初期MVP: ${axis.mvp}\n   - 注意点: ${axis.caution}`;
    })
    .join("\n");

  const roadmap = result.roadmap.map((item, index) => `${index + 1}. ${item}`).join("\n");
  const nextQuestions = result.nextQuestions.map((item) => `- ${item}`).join("\n");
  const noGoList = result.noGoList.map((item) => `- ${item}`).join("\n");

  return `# クリニック経営改善診断AI 結果

## 診断対象

- 回答ID: ${result.diagnosisId}
- 作成日時: ${result.createdAt}
- クリニック名・院長名: ${result.clinicName || "未入力"}
- 連絡先・LINE表示名: ${result.contactRoute || "未入力"}
- 診療科・業態: ${result.clinicType}
- 優先したい改善: ${result.primaryGoal}
- 流入元: ${result.source || "未指定"}
- 診断タイプ: ${result.profile.label}
- 改善余地指数: ${result.opportunityIndex}/100

## 要約

${result.profile.summary}

## 自院へのAI活用 処方箋

${prescriptions}

## 優先して提案するAIアプリ

${recommendations}

## さらに整理すると効果が出やすいこと

${nextQuestions}

## AI化しない/後回しにする範囲

${noGoList}

## 30日ロードマップ

${roadmap}

## 診断のまとめ

${result.salesCopy}
`;
}

async function diagnose(event) {
  event.preventDefault();
  if (!form.reportValidity()) return;

  if (submitStatus) submitStatus.textContent = "診断結果を保存しています。";

  const formData = new FormData(form);
  const result = buildResult(formData);
  persistResult(result);

  const sync = await sendResult(result);
  result.syncStatus = sync.status;
  persistResult(result);

  window.location.href = `./result.html?id=${encodeURIComponent(result.diagnosisId)}`;
}

function resetForm() {
  if (!form) return;

  form.reset();
  document.querySelectorAll(".question input[value='2']").forEach((input) => {
    input.checked = true;
  });
  if (copyStatus) copyStatus.textContent = "";
  if (submitStatus) submitStatus.textContent = "";
  latestMarkdown = "";
}

async function copyMarkdown() {
  if (!latestMarkdown) return;

  try {
    await navigator.clipboard.writeText(latestMarkdown);
    if (copyStatus) copyStatus.textContent = "診断結果をコピーしました。";
  } catch {
    if (copyStatus) {
      copyStatus.textContent =
        "ブラウザの制限でコピーできませんでした。結果欄を手動で選択してください。";
    }
  }
}

function renderResultPage() {
  const resultContent = document.querySelector("#resultContent");
  const missingResult = document.querySelector("#missingResult");
  if (!resultContent) return;

  const result = loadResult();
  if (!result) {
    resultContent.classList.add("hidden");
    if (missingResult) missingResult.classList.remove("hidden");
    return;
  }

  if (missingResult) missingResult.classList.add("hidden");
  resultContent.classList.remove("hidden");
  renderResult(result);
}

if (form) {
  renderQuestions();
  form.addEventListener("submit", diagnose);
  resetButton?.addEventListener("click", resetForm);
}

copyButton?.addEventListener("click", copyMarkdown);
renderResultPage();
