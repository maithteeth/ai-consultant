export type QuestionChoice = {
  value: string;
  label: string;
};

export type Question = {
  id: number;
  category: string;
  text: string;
  choices: QuestionChoice[];
};

export const questions: Question[] = [
  // 1-5: データの状態
  {
    id: 1,
    category: "データの状態",
    text: "紙の印刷は業務でどの程度ありますか？",
    choices: [
      { value: "often", label: "よくある（ほぼ毎日）" },
      { value: "sometimes", label: "たまにある（週に数回）" },
      { value: "rarely", label: "ほとんどない" },
    ],
  },
  {
    id: 2,
    category: "データの状態",
    text: "手書き入力（書類・メモ等）はどの程度ありますか？",
    choices: [
      { value: "often", label: "多い" },
      { value: "sometimes", label: "たまにある" },
      { value: "rarely", label: "ほとんどない" },
    ],
  },
  {
    id: 3,
    category: "データの状態",
    text: "ファイルや資料の検索に苦労することがありますか？",
    choices: [
      { value: "yes", label: "よくある" },
      { value: "sometimes", label: "たまにある" },
      { value: "no", label: "ほとんどない" },
    ],
  },
  {
    id: 4,
    category: "データの状態",
    text: "社内で資料・データの共有は主にどの方法で行っていますか？",
    choices: [
      { value: "cloud", label: "クラウド（共有フォルダ・Drive等）" },
      { value: "email", label: "メール添付が中心" },
      { value: "mixed", label: "紙・USB・メールなど混在" },
    ],
  },
  {
    id: 5,
    category: "データの状態",
    text: "業務マニュアルや手順書は整備されていますか？",
    choices: [
      { value: "yes", label: "はい、整っている" },
      { value: "partial", label: "一部あるが不足している" },
      { value: "no", label: "いいえ、ほとんどない" },
    ],
  },
  // 6-10: ネットと環境
  {
    id: 6,
    category: "ネットと環境",
    text: "Web会議（Teams・Zoom等）の通信は安定していますか？",
    choices: [
      { value: "stable", label: "はい、安定している" },
      { value: "sometimes", label: "たまに切れる・重い" },
      { value: "unstable", label: "よく不安定になる" },
    ],
  },
  {
    id: 7,
    category: "ネットと環境",
    text: "業務データの主な保存先はどこですか？",
    choices: [
      { value: "cloud", label: "クラウド（OneDrive・Google等）" },
      { value: "server", label: "社内サーバー" },
      { value: "local", label: "主にPC内（ローカル）" },
    ],
  },
  {
    id: 8,
    category: "ネットと環境",
    text: "システムやネットが混雑する時間帯はありますか？",
    choices: [
      { value: "yes", label: "はい、決まった時間に遅くなる" },
      { value: "sometimes", label: "たまにある" },
      { value: "no", label: "いいえ、特になし" },
    ],
  },
  {
    id: 9,
    category: "ネットと環境",
    text: "業務で使う場所にWi-Fiは利用可能ですか？",
    choices: [
      { value: "yes", label: "はい、問題なく使える" },
      { value: "limited", label: "使えるが不安定・制限あり" },
      { value: "no", label: "いいえ、使えない／有線のみ" },
    ],
  },
  {
    id: 10,
    category: "ネットと環境",
    text: "使用しているPCの動作速度に不満はありますか？",
    choices: [
      { value: "fast", label: "速く、不満はない" },
      { value: "ok", label: "普通、たまに重い" },
      { value: "slow", label: "遅く、業務に支障がある" },
    ],
  },
  // 11-15: 守りとルール
  {
    id: 11,
    category: "守りとルール",
    text: "業務で使うWebサイト・ツールに閲覧制限はありますか？",
    choices: [
      { value: "yes", label: "はい、厳しく制限されている" },
      { value: "partial", label: "一部制限されている" },
      { value: "no", label: "いいえ、特になし" },
    ],
  },
  {
    id: 12,
    category: "守りとルール",
    text: "AI（ChatGPT等）の業務利用についてルールはありますか？",
    choices: [
      { value: "yes", label: "はい、ルールがある" },
      { value: "discussing", label: "検討中・一部のみ可" },
      { value: "no", label: "いいえ、特に定めていない" },
    ],
  },
  {
    id: 13,
    category: "守りとルール",
    text: "個人情報・機密情報の取り扱いルールは浸透していますか？",
    choices: [
      { value: "yes", label: "はい、厳格に守られている" },
      { value: "partial", label: "あるが、徹底は課題" },
      { value: "weak", label: "曖昧・教育不足と感じる" },
    ],
  },
  {
    id: 14,
    category: "守りとルール",
    text: "パスワードの管理（使い回し・定期変更等）は適切だと思いますか？",
    choices: [
      { value: "good", label: "適切に管理されている" },
      { value: "improve", label: "改善の余地がある" },
      { value: "weak", label: "課題が大きい" },
    ],
  },
  {
    id: 15,
    category: "守りとルール",
    text: "リモートアクセス（在宅・外出先から社内システム）は可能ですか？",
    choices: [
      { value: "yes", label: "はい、問題なく使える" },
      { value: "limited", label: "一部のみ・制限あり" },
      { value: "no", label: "いいえ、不可" },
    ],
  },
  // 16-20: 仕事の内容
  {
    id: 16,
    category: "仕事の内容",
    text: "メールの確認・返信に費やす時間はどの程度ですか？",
    choices: [
      { value: "many", label: "多い（1日1時間以上）" },
      { value: "normal", label: "普通（30分〜1時間程度）" },
      { value: "few", label: "少ない（30分未満）" },
    ],
  },
  {
    id: 17,
    category: "仕事の内容",
    text: "議事録・メモの作成はどの程度ありますか？",
    choices: [
      { value: "often", label: "よくある" },
      { value: "sometimes", label: "たまにある" },
      { value: "rarely", label: "ほとんどない" },
    ],
  },
  {
    id: 18,
    category: "仕事の内容",
    text: "長文の資料・文章を読む業務はどの程度ありますか？",
    choices: [
      { value: "many", label: "多い" },
      { value: "normal", label: "普通" },
      { value: "few", label: "少ない" },
    ],
  },
  {
    id: 19,
    category: "仕事の内容",
    text: "コピー＆ペーストや転記のような作業はどの程度ありますか？",
    choices: [
      { value: "often", label: "多い" },
      { value: "sometimes", label: "たまにある" },
      { value: "rarely", label: "ほとんどない" },
    ],
  },
  {
    id: 20,
    category: "仕事の内容",
    text: "ミスがないか確認する作業の負荷はどの程度ですか？",
    choices: [
      { value: "high", label: "高い（時間・精神的負荷が大きい）" },
      { value: "normal", label: "普通" },
      { value: "low", label: "低い" },
    ],
  },
];
