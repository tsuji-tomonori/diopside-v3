type OperationDocSpec = {
  operationId: string;
  docId: string;
  title: string;
  legacyDocId: string;
  purpose: string[];
  flow: string[];
  detail: string[];
  acceptance: string[];
  related?: string[];
};

const commonRelated = ["BD-APP-API-004", "BD-SYS-ADR-025", "UT-PLAN-005", "IT-PLAN-001"];

const withCommonRelated = (spec: OperationDocSpec): OperationDocSpec => ({
  ...spec,
  related: [...new Set([...(spec.related ?? []), ...commonRelated])],
});

export const operationDocSpecs: OperationDocSpec[] = [
  withCommonRelated({
    operationId: "createIngestionRun",
    docId: "BD-APP-OAS-001",
    title: "収集実行起動API契約",
    legacyDocId: "DD-APP-API-002",
    purpose: [
      "収集実行要求を受け付け、運用runを採番する。",
      "手動実行と定期実行で共通の受理契約を維持する。",
    ],
    flow: [
      "要求ヘッダーとJSON本文を検証する。",
      "冪等キーと同時実行制約を評価する。",
      "runを作成してqueuedで受理する。",
      "run_idを含む202 Acceptedを返却する。",
    ],
    detail: [
      "OpenAPIのrequest/responseがI/F正本であり、本文では受理判定と副作用開始条件を補足する。",
      "同種runの競合時は409系業務エラーを返し、重複起動を防止する。",
      "Idempotency-Keyが一致する場合は既存runの再利用を許容する。",
    ],
    acceptance: [
      "不正入力はProblem Detailsで拒否できる。",
      "受理時にrun_id、accepted_at、run種別が返る。",
    ],
  }),
  withCommonRelated({
    operationId: "getIngestionRun",
    docId: "BD-APP-OAS-002",
    title: "収集実行状態取得API契約",
    legacyDocId: "DD-APP-API-003",
    purpose: [
      "収集runの現在状態と集計情報を参照する。",
    ],
    flow: [
      "runIdを検証する。",
      "対象runを取得して状態を集約する。",
      "statusと件数を返却する。",
    ],
    detail: [
      "状態語彙はOpenAPIで定義されたrun statusを正本とする。",
      "存在しないrunIdは404系エラーで返す。",
    ],
    acceptance: [
      "run_id単位でstatus、processed_count、error_summaryを参照できる。",
      "未存在runは正常系と混在せずに判別できる。",
    ],
  }),
  withCommonRelated({
    operationId: "getIngestionItems",
    docId: "BD-APP-OAS-003",
    title: "収集結果明細取得API契約",
    legacyDocId: "DD-APP-API-011",
    purpose: [
      "収集run配下の動画明細を状態別に参照する。",
    ],
    flow: [
      "runIdとquery条件を検証する。",
      "明細一覧を抽出し、状態やカーソル条件で整形する。",
      "items配列として返却する。",
    ],
    detail: [
      "filter条件とページング条件はOpenAPIのquery定義に従う。",
      "動画単位の成功/失敗結果を運用画面が再確認できる粒度で返す。",
    ],
    acceptance: [
      "run単位のitemsをstatus/limit/cursor条件で取得できる。",
      "明細のsource_type、update_type、statusが判別できる。",
    ],
  }),
  withCommonRelated({
    operationId: "retryIngestionRun",
    docId: "BD-APP-OAS-004",
    title: "再収集起動API契約",
    legacyDocId: "DD-APP-API-008",
    purpose: [
      "失敗した収集runを親runに紐づけて再実行する。",
    ],
    flow: [
      "runIdと冪等キーを検証する。",
      "再実行可能性を判定する。",
      "親runに紐づく新規runを発行する。",
      "新しいrun_idを返却する。",
    ],
    detail: [
      "親runの状態と再実行回数は業務制約として補足管理する。",
      "再収集APIは親子runの関係を応答で明示する。",
    ],
    acceptance: [
      "再収集受理時に新旧runの対応関係を取得できる。",
      "再実行不可状態は業務エラーとして返却できる。",
    ],
  }),
  withCommonRelated({
    operationId: "getIngestionLatest",
    docId: "BD-APP-OAS-005",
    title: "最新収集結果取得API契約",
    legacyDocId: "DD-APP-API-009",
    purpose: [
      "直近の収集成功結果と対象件数サマリを参照する。",
    ],
    flow: [
      "最新成功runを検索する。",
      "対象件数と警告を集約する。",
      "サマリ応答を返却する。",
    ],
    detail: [
      "運用画面はlast_success_atとwarning配列を使って運用可否を判断する。",
      "未実行状態はnull許容項目で表現する。",
    ],
    acceptance: [
      "直近成功時刻、対象件数、警告一覧を1回の呼び出しで取得できる。",
    ],
  }),
  withCommonRelated({
    operationId: "getHealth",
    docId: "BD-APP-OAS-006",
    title: "運用ヘルス診断API契約",
    legacyDocId: "DD-APP-API-009",
    purpose: [
      "配信可否の判断に必要な診断結果を返却する。",
    ],
    flow: [
      "診断対象のヘルス情報を取得する。",
      "各checkの状態を集約する。",
      "overall statusとchecksを返却する。",
    ],
    detail: [
      "診断APIは可観測性入口であり、各check名と状態語彙を固定する。",
      "詳細原因の追跡はログ/監査系文書へ委譲する。",
    ],
    acceptance: [
      "overall statusとcheck別状態を機械可読に取得できる。",
    ],
  }),
  withCommonRelated({
    operationId: "createRecheckRun",
    docId: "BD-APP-OAS-007",
    title: "再確認起動API契約",
    legacyDocId: "DD-APP-API-012",
    purpose: [
      "配信前後の再確認runを受け付ける。",
    ],
    flow: [
      "run起点またはvideo_ids起点の入力を検証する。",
      "再確認対象を確定する。",
      "recheck runを受理して202を返す。",
    ],
    detail: [
      "union型の入力分岐はOpenAPI requestBodyを正本とする。",
      "before/after deliveryの判定モード差異はフロー側で補足する。",
    ],
    acceptance: [
      "run_id起点とmode起点の両方式を受理できる。",
      "再確認runが非同期に開始される。",
    ],
  }),
  withCommonRelated({
    operationId: "getRecheckRun",
    docId: "BD-APP-OAS-008",
    title: "再確認状態取得API契約",
    legacyDocId: "DD-APP-API-012",
    purpose: [
      "再確認runの進捗と結果を参照する。",
    ],
    flow: [
      "recheckRunIdを検証する。",
      "run結果と差分件数を取得する。",
      "状態応答を返却する。",
    ],
    detail: [
      "再確認APIは配信前後差分の可視化に必要な結果項目を返す。",
      "存在しないrunは404系で区別する。",
    ],
    acceptance: [
      "再確認run単位でstatusと結果件数を取得できる。",
    ],
  }),
  withCommonRelated({
    operationId: "createTag",
    docId: "BD-APP-OAS-009",
    title: "タグ作成API契約",
    legacyDocId: "DD-APP-API-013",
    purpose: [
      "タグ辞書へ新規タグを追加する。",
    ],
    flow: [
      "JSON本文を検証する。",
      "重複や整合性を判定する。",
      "タグを作成し201 Createdを返す。",
    ],
    detail: [
      "タグ名、タグ種別、同義語の組み合わせを契約どおり受け付ける。",
      "競合時は409系で返し、公開前反映の再実行判断へ繋げる。",
    ],
    acceptance: [
      "tag_idとupdated_atを返却できる。",
      "重複タグは競合として検知できる。",
    ],
  }),
  withCommonRelated({
    operationId: "patchTag",
    docId: "BD-APP-OAS-010",
    title: "タグ更新API契約",
    legacyDocId: "DD-APP-API-013",
    purpose: [
      "既存タグの名称、同義語、有効状態を更新する。",
    ],
    flow: [
      "tagIdと更新本文を検証する。",
      "対象タグを更新する。",
      "公開反映状態を含む結果を返却する。",
    ],
    detail: [
      "部分更新項目はPATCH契約を正本とし、未指定項目は保持する。",
      "propagation_stateで公開反映の要否を判断できるようにする。",
    ],
    acceptance: [
      "更新後のtag_id、propagation_state、updated_atを参照できる。",
    ],
  }),
  withCommonRelated({
    operationId: "patchVideoTags",
    docId: "BD-APP-OAS-011",
    title: "動画タグ更新API契約",
    legacyDocId: "DD-APP-API-013",
    purpose: [
      "動画単位のタグ付与・解除を手動で更新する。",
    ],
    flow: [
      "videoIdとset/unset配列を検証する。",
      "対象動画のタグ集合を更新する。",
      "更新後のtag_idsを返却する。",
    ],
    detail: [
      "理由文字列は監査ログと運用判断の入力に用いる。",
      "setとunsetの整合は業務制約として補足する。",
    ],
    acceptance: [
      "動画単位でタグ集合更新の結果を取得できる。",
    ],
  }),
  withCommonRelated({
    operationId: "createTaggingPrompt",
    docId: "BD-APP-OAS-012",
    title: "タグ提案プロンプト生成API契約",
    legacyDocId: "DD-APP-API-013",
    purpose: [
      "タグ提案に使うLLM向けプロンプトを生成する。",
    ],
    flow: [
      "run_id、video_ids、include_fieldsを検証する。",
      "対象動画情報を集約する。",
      "prompt_textと生成メタを返却する。",
    ],
    detail: [
      "提案生成APIは実行結果を即時返却し、外部モデル呼び出しは契約外とする。",
      "生成対象件数とバージョンを応答で固定する。",
    ],
    acceptance: [
      "prompt_text、prompt_version、video_countを取得できる。",
    ],
  }),
  withCommonRelated({
    operationId: "importTaggingJson",
    docId: "BD-APP-OAS-013",
    title: "タグ提案JSON取込API契約",
    legacyDocId: "DD-APP-API-013",
    purpose: [
      "タグ提案JSONを検証し、適用結果を返却する。",
    ],
    flow: [
      "schema_versionとitems配列を検証する。",
      "各itemを検証して適用可否を判定する。",
      "件数とエラー一覧を返却する。",
    ],
    detail: [
      "取込契約は1件ごとの検証エラーをerrors配列で返し、全体失敗と部分適用を区別する。",
      "next_actionで公開反映の要否を判定できるようにする。",
    ],
    acceptance: [
      "validated/applied/rejected件数とerrorsを取得できる。",
      "publish_required判定を返却できる。",
    ],
  }),
  withCommonRelated({
    operationId: "createDocsPublishRun",
    docId: "BD-APP-OAS-014",
    title: "ドキュメント公開起動API契約",
    legacyDocId: "DD-APP-API-014",
    purpose: [
      "docs公開runを受け付ける。",
    ],
    flow: [
      "targetRefなどの入力を検証する。",
      "公開runを作成する。",
      "docs_publish_run_idを返却する。",
    ],
    detail: [
      "docs公開は非同期runとして扱い、開始応答と進捗取得を分離する。",
      "許可対象refの制約は業務判定で補足する。",
    ],
    acceptance: [
      "202 Acceptedでdocs publish runを受理できる。",
    ],
  }),
  withCommonRelated({
    operationId: "getDocsPublishRun",
    docId: "BD-APP-OAS-015",
    title: "ドキュメント公開状態取得API契約",
    legacyDocId: "DD-APP-API-014",
    purpose: [
      "docs公開runの状態とstep進捗を参照する。",
    ],
    flow: [
      "docsPublishRunIdを検証する。",
      "runとrollback情報を取得する。",
      "進捗状態を返却する。",
    ],
    detail: [
      "docs publish専用runでないIDは404系エラーで返す。",
      "rollback情報は公開失敗時の復旧判断に用いる。",
    ],
    acceptance: [
      "status、steps、rollbackを取得できる。",
    ],
  }),
  withCommonRelated({
    operationId: "createTagMasterPublishRun",
    docId: "BD-APP-OAS-016",
    title: "タグマスター公開起動API契約",
    legacyDocId: "DD-APP-API-015",
    purpose: [
      "タグマスター中心の公開runを受け付ける。",
    ],
    flow: [
      "scope入力を検証する。",
      "公開runを生成する。",
      "publish_run_idを返却する。",
    ],
    detail: [
      "scope既定値と公開対象の意味はOpenAPI enumを正本とする。",
      "run statusは公開系共通語彙へ正規化して返す。",
    ],
    acceptance: [
      "scope指定あり/なしの両方で公開runを起動できる。",
    ],
  }),
  withCommonRelated({
    operationId: "createPublishRun",
    docId: "BD-APP-OAS-017",
    title: "配信反映起動API契約",
    legacyDocId: "DD-APP-API-015",
    purpose: [
      "配信成果物の公開runを受け付ける。",
    ],
    flow: [
      "scope入力を検証する。",
      "公開runを生成する。",
      "publish_run_idを返却する。",
    ],
    detail: [
      "publish/tag-master専用起動と共通publish起動の違いは経路で切り分ける。",
      "配信反映は非同期runとして進捗APIと分離する。",
    ],
    acceptance: [
      "公開runを202で受理できる。",
    ],
  }),
  withCommonRelated({
    operationId: "getPublishRun",
    docId: "BD-APP-OAS-018",
    title: "配信反映状態取得API契約",
    legacyDocId: "DD-APP-API-015",
    purpose: [
      "公開runの状態、step進捗、rollback結果を参照する。",
    ],
    flow: [
      "publishRunIdを検証する。",
      "公開run詳細を取得する。",
      "状態と失敗情報を返却する。",
    ],
    detail: [
      "publish_type、status、retryableは公開運用の判断キーとして返す。",
      "ロールバック情報は公開失敗時の継続判断に使用する。",
    ],
    acceptance: [
      "公開run単位でstep、error、rollback情報を取得できる。",
    ],
  }),
  withCommonRelated({
    operationId: "getBootstrapContract",
    docId: "BD-APP-OAS-019",
    title: "bootstrap契約取得API",
    legacyDocId: "DD-APP-API-004",
    purpose: [
      "一覧初期表示に必要なbootstrap契約を返却する。",
    ],
    flow: [
      "現在のbootstrap成果物を取得する。",
      "関連versionとnext参照を整形する。",
      "一覧初期表示用の契約を返却する。",
    ],
    detail: [
      "段階ロードの先頭契約として、tag_masterとarchive_indexへの参照を保持する。",
      "schema_versionとartifact versionで配信整合を判定する。",
    ],
    acceptance: [
      "初回描画に必要なversion情報とnext参照を取得できる。",
    ],
  }),
  withCommonRelated({
    operationId: "getTagMasterContract",
    docId: "BD-APP-OAS-020",
    title: "タグマスター契約取得API",
    legacyDocId: "DD-APP-API-005",
    purpose: [
      "タグ辞書とタグ種別定義を返却する。",
    ],
    flow: [
      "現行tag_master成果物を取得する。",
      "タグ種別とタグ配列を整形する。",
      "辞書契約を返却する。",
    ],
    detail: [
      "タグ辞書は検索/絞り込みと詳細表示で共有利用する。",
      "tag_master_versionで公開反映後の整合を判定する。",
    ],
    acceptance: [
      "タグ辞書全体を1回で取得できる。",
    ],
  }),
  withCommonRelated({
    operationId: "getArchiveIndexContract",
    docId: "BD-APP-OAS-021",
    title: "archive index契約取得API",
    legacyDocId: "DD-APP-API-004",
    purpose: [
      "ページ単位のarchive index契約を返却する。",
    ],
    flow: [
      "page queryを検証する。",
      "対応ページのarchive index成果物を取得する。",
      "一覧描画用の契約を返却する。",
    ],
    detail: [
      "page queryと応答page値の整合はOpenAPI query契約を正本とする。",
      "一覧件数とページ境界は配信成果物の整合確認に用いる。",
    ],
    acceptance: [
      "page指定に応じたarchive index契約を取得できる。",
    ],
  }),
  withCommonRelated({
    operationId: "searchVideos",
    docId: "BD-APP-OAS-022",
    title: "動画検索API契約",
    legacyDocId: "DD-APP-API-006",
    purpose: [
      "キーワード条件に合致する動画一覧を返却する。",
    ],
    flow: [
      "query文字列を検証する。",
      "索引データから一致動画を抽出する。",
      "検索結果一覧を返却する。",
    ],
    detail: [
      "検索条件はqueryのqを正本とし、空文字も許容する。",
      "結果一覧は動画カード表示に必要な最小項目へ限定する。",
    ],
    acceptance: [
      "q条件に応じたitems配列を取得できる。",
    ],
  }),
  withCommonRelated({
    operationId: "getVideoDetail",
    docId: "BD-APP-OAS-023",
    title: "動画詳細API契約",
    legacyDocId: "DD-APP-API-007",
    purpose: [
      "動画詳細モーダル表示に必要な詳細情報を返却する。",
    ],
    flow: [
      "videoIdを検証する。",
      "対象動画を取得する。",
      "詳細表示用の応答を返却する。",
    ],
    detail: [
      "動画詳細のI/F正本はOpenAPIであり、表示フォールバックやUX制約は従来DD文書で補足する。",
      "存在しないvideoIdは業務エラーとして区別する。",
    ],
    acceptance: [
      "動画詳細表示に必要な項目を1回で取得できる。",
    ],
  }),
];

export type { OperationDocSpec };
