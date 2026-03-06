import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildApp } from "../src/app.js";
import { operationDocSpecs, type OperationDocSpec } from "./openapi-doc-metadata.js";

type OpenApiSchema = {
  $ref?: string;
  type?: string;
  format?: string;
  description?: string;
  default?: unknown;
  enum?: unknown[];
  nullable?: boolean;
  items?: OpenApiSchema;
  oneOf?: OpenApiSchema[];
  anyOf?: OpenApiSchema[];
  allOf?: OpenApiSchema[];
  required?: string[];
  properties?: Record<string, OpenApiSchema>;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  additionalProperties?: boolean | OpenApiSchema;
};

type OpenApiParameter = {
  name: string;
  in: string;
  required?: boolean;
  description?: string;
  schema?: OpenApiSchema;
};

type OpenApiResponse = {
  description?: string;
  content?: Record<string, { schema?: OpenApiSchema }>;
};

type OpenApiOperation = {
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: OpenApiParameter[];
  requestBody?: {
    required?: boolean;
    content?: Record<string, { schema?: OpenApiSchema }>;
  };
  responses?: Record<string, OpenApiResponse>;
};

type PathItem = {
  parameters?: OpenApiParameter[];
  [method: string]: OpenApiOperation | OpenApiParameter[] | unknown;
};

type OpenApiDocument = {
  paths?: Record<string, PathItem>;
  components?: {
    schemas?: Record<string, OpenApiSchema>;
  };
};

type ExistingDocMeta = {
  created: string;
  version: string;
  raw: string;
};

type FieldRow = {
  field: string;
  required: string;
  type: string;
  defaultValue: string;
  constraints: string;
  description: string;
};

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");
const outputDir = resolve(repoRoot, "docs/2.基本設計(BD)/03.アプリ(APP)/32.OpenAPI IF(IF)");
const legacyOutputDir = resolve(repoRoot, "docs/3.詳細設計(DD)/02.アプリ(APP)/23.OpenAPI契約(OAS)");
const indexDocId = "BD-APP-OAS-000";
const indexDocPath = resolve(outputDir, `${indexDocId}.md`);
const today = new Date().toISOString().slice(0, 10);
const methods = ["get", "post", "patch", "put", "delete"] as const;

const checkMode = process.argv.includes("--check");
const glossaryLinks = [
  ["収集実行", "[[RQ-GL-002|収集実行]]"],
  ["出演動画", "[[RQ-GL-004|出演動画]]"],
  ["再収集", "[[RQ-GL-011|再収集]]"],
  ["再確認実行", "[[RQ-GL-019|再確認実行]]"],
  ["タグ辞書", "[[RQ-GL-005|タグ辞書]]"],
  ["タグ種別", "[[RQ-GL-013|タグ種別]]"],
  ["bootstrap", "[[RQ-GL-007|bootstrap]]"],
  ["タグマスター", "[[RQ-GL-008|タグマスター]]"],
  ["検索条件", "[[RQ-GL-014|検索条件]]"],
  ["段階ロード", "[[RQ-GL-010|段階ロード]]"],
] as const;
const parameterDescriptionMap: Record<string, string> = {
  "header:authorization": "Cognito JWT を渡す Authorization ヘッダー。",
  "header:idempotency-key": "重複実行を防ぐための冪等キー。",
  "path:docsPublishRunId": "対象ドキュメント公開実行の識別子。",
  "path:publishRunId": "対象公開実行の識別子。",
  "path:recheckRunId": "対象再確認実行の識別子。",
  "path:runId": "対象実行の識別子。",
  "path:tagId": "対象タグの識別子。",
  "path:videoId": "対象動画の識別子。",
  "query:cursor": "次ページ取得に使うカーソル。",
  "query:limit": "1回の取得件数上限。",
  "query:page": "取得対象ページ番号。",
  "query:q": "検索条件として使うキーワード。",
  "query:status": "絞り込み対象の状態。",
};
const exactFieldDescriptionMap: Record<string, string> = {
  "checks.archive_page_completeness": "archive_index のページ欠落や件数不整合を検知した結果。",
  "checks.data_freshness": "配信データが所定の鮮度以内かどうかの判定結果。",
  "checks.distribution_availability": "配信成果物が取得可能かどうかの判定結果。",
  "checks.tag_master_consistency": "タグマスターと配信データの整合判定結果。",
  "diff_summary.changed_count": "差分ありと判定した件数。",
  "diff_summary.unchanged_count": "差分なしと判定した件数。",
  "errors[].field": "エラーが発生した入力フィールド名。",
  "errors[].message": "エラー内容を示すメッセージ。",
  "errors[].code": "エラーの機械判定用コード。",
  "errors[].index": "items 配列内の対象インデックス。",
  "items[].duration_sec": "動画の再生時間（秒）。",
  "items[].error_code": "対象動画に対するエラーコード。",
  "items[].published_at": "動画の公開日時。",
  "items[].reason": "タグ更新や取込に使う理由。",
  "items[].set": "付与するタグ ID 一覧。",
  "items[].source_type": "動画の取得元区分。",
  "items[].status": "対象項目の状態。",
  "items[].tag_ids": "対象動画に紐づくタグ ID 一覧。",
  "items[].title": "動画タイトル。",
  "items[].unset": "解除するタグ ID 一覧。",
  "items[].update_type": "更新処理の種別。",
  "items[].video_id": "対象動画の識別子。",
  "next.archive_index": "archive_index の取得先情報。",
  "next.archive_index.page_size": "archive_index 取得時の既定ページ件数。",
  "next.archive_index.url_pattern": "archive_index を取得する URL パターン。",
  "next.tag_master": "タグマスターの取得先情報。",
  "next.tag_master.url": "タグマスターを取得する URL。",
  "rollback.executed": "ロールバックを実施したかどうか。",
  "rollback.rollback_to_version": "ロールバック先の成果物バージョン。",
  "steps[].name": "処理ステップ名。",
  "steps[].status": "処理ステップの状態。",
  "tag_types[].id": "タグ種別の識別子。",
  "tag_types[].key": "タグ種別の内部キー。",
  "tag_types[].name": "タグ種別の表示名。",
  "target_counts.appearance": "出演動画の対象件数。",
  "target_counts.official": "公式動画の対象件数。",
  "target_counts.total": "対象全体の件数。",
};
const leafFieldDescriptionMap: Record<string, string> = {
  accepted_at: "要求を受理した日時。",
  applied_count: "実際に適用した件数。",
  archive_version: "archive_index 成果物のバージョン。",
  bootstrap_version: "bootstrap 成果物のバージョン。",
  checks: "診断チェック結果の一覧。",
  code: "機械判定用のコード。",
  detail: "詳細内容。",
  diff_summary: "差分件数の集計結果。",
  docs_publish_run_id: "ドキュメント公開実行の識別子。",
  dry_run: "副作用を発生させない試行実行かどうか。",
  duration_sec: "動画の再生時間（秒）。",
  error_code: "エラーコード。",
  error_message: "エラーメッセージ。",
  error_summary: "エラーの要約。",
  errors: "エラー詳細の一覧。",
  finished_at: "処理が完了した日時。",
  forceInvalidate: "CDN キャッシュを強制削除するかどうか。",
  from_published_at: "収集開始基準とする公開日時。",
  generated_at: "成果物を生成した日時。",
  import_run_id: "取込実行の識別子。",
  include_fields: "プロンプトへ含める項目一覧。",
  instance: "問題が発生した対象 URI または識別子。",
  is_active: "有効状態かどうか。",
  items: "返却対象の一覧。",
  last_run_id: "直近の実行 ID。",
  last_success_at: "直近成功日時。",
  latest: "最新動画一覧。",
  merged_into: "統合先のタグ ID。",
  mode: "実行モード。",
  next: "次取得先の情報。",
  next_action: "次に取るべき運用アクション。",
  page: "取得対象ページ番号。",
  page_size: "1ページあたりの件数。",
  parent_run_id: "親実行の run ID。",
  processed_count: "処理済み件数。",
  prompt_text: "LLM へ渡すプロンプト本文。",
  prompt_version: "プロンプト定義のバージョン。",
  propagation_state: "公開反映の状態。",
  publish_run_id: "公開実行の識別子。",
  publish_scope: "公開対象の範囲。",
  publish_type: "公開処理の種別。",
  published_at: "動画の公開日時。",
  reason: "処理や操作の理由。",
  recheck_run_id: "再確認実行の識別子。",
  rejected_count: "却下件数。",
  retryable: "再試行可能かどうか。",
  rollback: "ロールバック結果。",
  run_id: "実行の識別子。",
  run_kind: "実行種別。",
  schema_version: "契約スキーマのバージョン。",
  scope: "処理対象の範囲。",
  set: "付与する値の一覧。",
  started_at: "処理開始日時。",
  status: "現在の状態。",
  steps: "処理ステップ一覧。",
  synonyms: "同義語一覧。",
  tag_id: "タグの識別子。",
  tag_ids: "タグ ID 一覧。",
  tag_master_version: "タグマスター成果物のバージョン。",
  tag_name: "タグ名称。",
  tag_preview: "初期表示で使うタグのプレビュー一覧。",
  tag_type_id: "タグ種別の識別子。",
  tag_types: "タグ種別一覧。",
  tags: "タグ一覧。",
  targetRef: "公開対象の Git ref。",
  targetVideoIds: "再確認対象の動画 ID 一覧。",
  target_counts: "対象件数の集計。",
  target_types: "収集対象の区分一覧。",
  title: "表示タイトル。",
  total: "総件数。",
  trace_id: "追跡用トレース ID。",
  trigger_mode: "起動元のモード。",
  triggered_by: "起動者。",
  type: "Problem Details の型 URI または契約種別。",
  unset: "解除する値の一覧。",
  updated_at: "更新日時。",
  validated_count: "検証対象件数。",
  video_count: "動画件数。",
  video_id: "動画の識別子。",
  video_ids: "動画 ID 一覧。",
  warnings: "警告一覧。",
};

const app = buildApp();
const document = app.getOpenAPIDocument({
  openapi: "3.0.0",
  info: {
    title: "diopside backend api",
    version: "1.0.0",
    description: "Backend API aligned with DD-APP-API-002..015",
  },
}) as OpenApiDocument;
const componentsSchemas = document.components?.schemas ?? {};

const operationMap = new Map<
  string,
  { method: string; path: string; pathItem: PathItem; operation: OpenApiOperation }
>();

for (const [path, pathItem] of Object.entries(document.paths ?? {})) {
  for (const method of methods) {
    const operation = pathItem?.[method];
    if (!operation || typeof operation !== "object") {
      continue;
    }
    const op = operation as OpenApiOperation;
    if (!op.operationId) {
      continue;
    }
    operationMap.set(op.operationId, {
      method: method.toUpperCase(),
      path,
      pathItem,
      operation: op,
    });
  }
}

const escapeCell = (value: string) => value.replace(/\|/g, "\\|").replace(/\n/g, "<br>");
const applyGlossaryLinks = (value: string) =>
  glossaryLinks.reduce((current, [term, link]) => current.replaceAll(term, link), value);
const refName = (schema?: OpenApiSchema) => schema?.$ref?.split("/").at(-1);
const normalizeForComparison = (text: string) =>
  text.replace(/^version: .+$/m, "version: __VERSION__").replace(/^updated: .+$/m, "updated: '__UPDATED__'");
const toCell = (value: string) => escapeCell(applyGlossaryLinks(value));
const isObjectSchema = (schema?: OpenApiSchema) => Boolean(schema?.properties || schema?.type === "object");
const isArraySchema = (schema?: OpenApiSchema) => schema?.type === "array";
const lastFieldSegment = (fieldPath: string) => fieldPath.split(".").at(-1)?.replace(/\[\]/g, "") ?? fieldPath;

const humanizeIdentifier = (value: string) =>
  value
    .replace(/\[\]/g, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .trim();

const describeFieldInJapanese = (fieldPath: string, schema?: OpenApiSchema): string => {
  const materialized = materializeSchema(schema);
  if (materialized?.description) {
    return materialized.description;
  }
  if (exactFieldDescriptionMap[fieldPath]) {
    return exactFieldDescriptionMap[fieldPath];
  }

  const leaf = lastFieldSegment(fieldPath);
  if (leafFieldDescriptionMap[leaf]) {
    return leafFieldDescriptionMap[leaf];
  }
  if (leaf.endsWith("_id")) {
    return `${humanizeIdentifier(leaf.replace(/_id$/, ""))}の識別子。`;
  }
  if (leaf.endsWith("_at")) {
    return `${humanizeIdentifier(leaf.replace(/_at$/, ""))}日時。`;
  }
  if (leaf.endsWith("_count")) {
    return `${humanizeIdentifier(leaf.replace(/_count$/, ""))}件数。`;
  }
  if (leaf.endsWith("_version")) {
    return `${humanizeIdentifier(leaf.replace(/_version$/, ""))}バージョン。`;
  }
  if (leaf.endsWith("_ids")) {
    return `${humanizeIdentifier(leaf.replace(/_ids$/, ""))}の識別子一覧。`;
  }

  return `${humanizeIdentifier(leaf)}を表す項目。`;
};

const describeParameterInJapanese = (parameter: OpenApiParameter): string => {
  if (parameter.description) {
    return parameter.description;
  }

  const key = `${parameter.in}:${parameter.name}`;
  if (parameterDescriptionMap[key]) {
    return parameterDescriptionMap[key];
  }

  if (parameter.in === "path" && parameter.name.endsWith("Id")) {
    return `対象${humanizeIdentifier(parameter.name.replace(/Id$/, ""))}の識別子。`;
  }
  if (parameter.in === "query") {
    return `${humanizeIdentifier(parameter.name)}条件。`;
  }
  if (parameter.in === "header") {
    return `${parameter.name} ヘッダー。`;
  }

  return `${humanizeIdentifier(parameter.name)}を指定する${parameter.in}パラメータ。`;
};

const mergeAllOf = (schemas: OpenApiSchema[], visitedRefs: Set<string>): OpenApiSchema => {
  const merged: OpenApiSchema = { type: "object", properties: {}, required: [] };

  for (const schema of schemas) {
    const materialized = materializeSchema(schema, visitedRefs);
    if (!materialized) {
      continue;
    }

    if (materialized.type) {
      merged.type = materialized.type;
    }
    if (materialized.description && !merged.description) {
      merged.description = materialized.description;
    }
    if (materialized.format && !merged.format) {
      merged.format = materialized.format;
    }
    if (materialized.enum && !merged.enum) {
      merged.enum = materialized.enum;
    }
    if (materialized.items && !merged.items) {
      merged.items = materialized.items;
    }
    if (materialized.properties) {
      merged.properties = {
        ...(merged.properties ?? {}),
        ...materialized.properties,
      };
    }
    if (materialized.required?.length) {
      merged.required = [...new Set([...(merged.required ?? []), ...materialized.required])];
    }
  }

  return merged;
};

function materializeSchema(schema?: OpenApiSchema, visitedRefs: Set<string> = new Set()): OpenApiSchema | undefined {
  if (!schema) {
    return undefined;
  }

  let materialized: OpenApiSchema = { ...schema };

  if (schema.$ref) {
    const name = refName(schema);
    if (name && !visitedRefs.has(name)) {
      const nextVisitedRefs = new Set(visitedRefs);
      nextVisitedRefs.add(name);
      const resolved = materializeSchema(componentsSchemas[name], nextVisitedRefs) ?? componentsSchemas[name];
      if (resolved) {
        materialized = {
          ...resolved,
          ...schema,
          properties: schema.properties ?? resolved.properties,
          required: schema.required ?? resolved.required,
          items: schema.items ?? resolved.items,
          oneOf: schema.oneOf ?? resolved.oneOf,
          anyOf: schema.anyOf ?? resolved.anyOf,
          allOf: schema.allOf ?? resolved.allOf,
        };
      }
    }
  }

  if (materialized.allOf?.length) {
    const mergedAllOf = mergeAllOf(materialized.allOf, visitedRefs);
    materialized = {
      ...mergedAllOf,
      ...materialized,
      properties: {
        ...(mergedAllOf.properties ?? {}),
        ...(materialized.properties ?? {}),
      },
      required: [...new Set([...(mergedAllOf.required ?? []), ...(materialized.required ?? [])])],
    };
  }

  return materialized;
}

const describeDefault = (schema?: OpenApiSchema): string => {
  const materialized = materializeSchema(schema);
  if (materialized?.default === undefined) {
    return "-";
  }
  if (typeof materialized.default === "string") {
    return materialized.default === "" ? '""' : materialized.default;
  }
  return JSON.stringify(materialized.default);
};

const describeSchemaType = (schema?: OpenApiSchema): string => {
  const materialized = materializeSchema(schema);
  if (!materialized) {
    return "-";
  }
  if (materialized.oneOf?.length) {
    return `oneOf<${materialized.oneOf.map((item) => describeSchemaType(item)).join(" | ")}>`;
  }
  if (materialized.anyOf?.length) {
    return `anyOf<${materialized.anyOf.map((item) => describeSchemaType(item)).join(" | ")}>`;
  }
  if (materialized.allOf?.length) {
    return `allOf<${materialized.allOf.map((item) => describeSchemaType(item)).join(" & ")}>`;
  }
  if (materialized.type === "array") {
    return `array<${describeSchemaType(materialized.items)}>`;
  }
  if (materialized.type) {
    return materialized.type;
  }
  return refName(schema) ?? "-";
};

const describeSchemaConstraints = (schema?: OpenApiSchema): string => {
  const materialized = materializeSchema(schema);
  if (!materialized) {
    return "-";
  }

  const constraints: string[] = [];
  const schemaName = refName(schema);

  if (schemaName) {
    constraints.push(`schema: ${schemaName}`);
  }
  if (materialized.format) {
    constraints.push(`format: ${materialized.format}`);
  }
  if (materialized.enum?.length) {
    constraints.push(`enum: ${materialized.enum.map((value) => String(value)).join(" | ")}`);
  }
  if (materialized.nullable) {
    constraints.push("nullable");
  }
  if (typeof materialized.minimum === "number") {
    constraints.push(`minimum: ${materialized.minimum}`);
  }
  if (typeof materialized.maximum === "number") {
    constraints.push(`maximum: ${materialized.maximum}`);
  }
  if (typeof materialized.minLength === "number") {
    constraints.push(`minLength: ${materialized.minLength}`);
  }
  if (typeof materialized.maxLength === "number") {
    constraints.push(`maxLength: ${materialized.maxLength}`);
  }
  if (materialized.pattern) {
    constraints.push(`pattern: ${materialized.pattern}`);
  }
  if (materialized.additionalProperties === true) {
    constraints.push("additionalProperties: true");
  }
  if (materialized.type === "array" && materialized.items) {
    const itemConstraints = describeSchemaConstraints(materialized.items);
    if (itemConstraints !== "-") {
      constraints.push(`items: ${describeSchemaType(materialized.items)} (${itemConstraints})`);
    }
  }
  if (materialized.oneOf?.length) {
    constraints.push(`oneOf: ${materialized.oneOf.length} patterns`);
  }
  if (materialized.anyOf?.length) {
    constraints.push(`anyOf: ${materialized.anyOf.length} patterns`);
  }

  return constraints.join("; ") || "-";
};

const describeParameters = (pathItem: PathItem, operation: OpenApiOperation): OpenApiParameter[] => {
  const pathParameters = Array.isArray(pathItem.parameters) ? pathItem.parameters : [];
  const operationParameters = Array.isArray(operation.parameters) ? operation.parameters : [];
  const merged = new Map<string, OpenApiParameter>();
  for (const parameter of [...pathParameters, ...operationParameters]) {
    merged.set(`${parameter.in}:${parameter.name}`, parameter);
  }
  return [...merged.values()];
};

const flattenSchemaFields = (schema?: OpenApiSchema, prefix = "", visitedRefs: Set<string> = new Set()): FieldRow[] => {
  const materialized = materializeSchema(schema, visitedRefs);
  if (!materialized) {
    return [];
  }

  const rows: FieldRow[] = [];
  const properties = materialized.properties ?? {};
  const requiredNames = new Set(materialized.required ?? []);

  for (const [name, propertySchema] of Object.entries(properties)) {
    const fieldPath = prefix ? `${prefix}.${name}` : name;
    const propertyMaterialized = materializeSchema(propertySchema, visitedRefs);

    rows.push({
      field: fieldPath,
      required: requiredNames.has(name) ? "yes" : "no",
      type: describeSchemaType(propertySchema),
      defaultValue: describeDefault(propertySchema),
      constraints: describeSchemaConstraints(propertySchema),
      description: describeFieldInJapanese(fieldPath, propertySchema),
    });

    if (isObjectSchema(propertyMaterialized)) {
      rows.push(...flattenSchemaFields(propertySchema, fieldPath, visitedRefs));
      continue;
    }

    if (isArraySchema(propertyMaterialized)) {
      const itemSchema = materializeSchema(propertyMaterialized?.items, visitedRefs);
      if (isObjectSchema(itemSchema)) {
        rows.push(...flattenSchemaFields(itemSchema, `${fieldPath}[]`, visitedRefs));
      }
    }
  }

  if (materialized.type === "array" && materialized.items) {
    const itemSchema = materializeSchema(materialized.items, visitedRefs);
    if (isObjectSchema(itemSchema)) {
      rows.push(...flattenSchemaFields(itemSchema, prefix ? `${prefix}[]` : "[]", visitedRefs));
    }
  }

  return rows;
};

const renderFieldTable = (rows: FieldRow[]): string[] => {
  if (rows.length === 0) {
    return ["- フィールド定義なし"];
  }

  const lines = [
    "| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |",
    "| --- | --- | --- | --- | --- | --- |",
  ];

  for (const row of rows) {
    lines.push(
      `| ${escapeCell(row.field)} | ${row.required} | ${escapeCell(row.type)} | ${escapeCell(row.defaultValue)} | ${toCell(row.constraints)} | ${toCell(row.description)} |`,
    );
  }

  return lines;
};

const renderSchemaFieldSections = (headingLabel: string, schema?: OpenApiSchema): string[] => {
  const materialized = materializeSchema(schema);
  if (!materialized) {
    return ["- フィールド定義なし"];
  }

  const variants = materialized.oneOf ?? materialized.anyOf;
  if (variants?.length) {
    const lines: string[] = [];
    variants.forEach((variant, index) => {
      if (index > 0) {
        lines.push("");
      }
      lines.push(`#### ${headingLabel} パターン${index + 1}`);
      lines.push(...renderFieldTable(flattenSchemaFields(variant)));
    });
    return lines;
  }

  return renderFieldTable(flattenSchemaFields(materialized));
};

const renderOverviewSection = (spec: OperationDocSpec, method: string, path: string, operation: OpenApiOperation): string[] => {
  const authLabel = path.startsWith("/api/v1/admin/") ? "Cognito JWT + 管理者権限" : "Cognito JWT";

  return [
    "## API概要",
    "| 項目 | 値 |",
    "| --- | --- |",
    `| メソッド | \`${method}\` |`,
    `| パス | \`${path}\` |`,
    `| operationId | \`${spec.operationId}\` |`,
    `| タグ | ${(operation.tags ?? []).map((tag) => `\`${tag}\``).join(", ") || "-"} |`,
    `| 認証/認可 | ${authLabel} |`,
  ];
};

const renderParameterSection = (pathItem: PathItem, operation: OpenApiOperation): string[] => {
  const parameters = describeParameters(pathItem, operation);
  const lines = ["## パラメータ"];

  if (parameters.length === 0) {
    lines.push("- なし");
    return lines;
  }

  lines.push("| 種別 | 名前 | 必須 | 型 | 既定値 | 制約 | 説明 |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- |");

  for (const parameter of parameters) {
    lines.push(
      `| ${escapeCell(parameter.in)} | ${escapeCell(parameter.name)} | ${parameter.required ? "yes" : "no"} | ${escapeCell(describeSchemaType(parameter.schema))} | ${escapeCell(describeDefault(parameter.schema))} | ${toCell(describeSchemaConstraints(parameter.schema))} | ${toCell(describeParameterInJapanese(parameter))} |`,
    );
  }

  return lines;
};

const renderRequestBodySection = (operation: OpenApiOperation): string[] => {
  const requestBody = operation.requestBody;
  const lines = ["## リクエストボディ"];

  if (!requestBody?.content || Object.keys(requestBody.content).length === 0) {
    lines.push("- なし");
    return lines;
  }

  lines.push("| メディアタイプ | 必須 | 型 | 制約 |");
  lines.push("| --- | --- | --- | --- |");

  for (const [contentType, media] of Object.entries(requestBody.content)) {
    lines.push(
      `| ${escapeCell(contentType)} | ${requestBody.required ? "yes" : "no"} | ${escapeCell(describeSchemaType(media.schema))} | ${toCell(describeSchemaConstraints(media.schema))} |`,
    );
  }

  for (const [contentType, media] of Object.entries(requestBody.content)) {
    lines.push("");
    lines.push(`### ${contentType} フィールド`);
    lines.push(...renderSchemaFieldSections(contentType, media.schema));
  }

  return lines;
};

const renderResponseSection = (operation: OpenApiOperation): string[] => {
  const responses = Object.entries(operation.responses ?? {});
  const lines = ["## 戻り値"];

  if (responses.length === 0) {
    lines.push("- 戻り値定義なし");
    return lines;
  }

  lines.push("| ステータス | メディアタイプ | 型 | 制約 | 説明 |");
  lines.push("| --- | --- | --- | --- | --- |");

  for (const [status, response] of responses) {
    const content = Object.entries(response.content ?? {});
    if (content.length === 0) {
      lines.push(`| ${status} | - | - | - | ${toCell(response.description ?? "-")} |`);
      continue;
    }

    for (const [contentType, media] of content) {
      lines.push(
        `| ${status} | ${escapeCell(contentType)} | ${escapeCell(describeSchemaType(media.schema))} | ${toCell(describeSchemaConstraints(media.schema))} | ${toCell(response.description ?? "-")} |`,
      );
    }
  }

  for (const [status, response] of responses) {
    const content = Object.entries(response.content ?? {});
    if (content.length === 0) {
      continue;
    }

    for (const [contentType, media] of content) {
      lines.push("");
      lines.push(`### ${status} ${contentType} フィールド`);
      lines.push(...renderSchemaFieldSections(`${status} ${contentType}`, media.schema));
    }
  }

  return lines;
};

const parseExistingDocMeta = async (filePath: string): Promise<ExistingDocMeta | null> => {
  try {
    const raw = await readFile(filePath, "utf8");
    const createdMatch = raw.match(/^created:\s*['"]?([^'"\n]+)['"]?$/m);
    const versionMatch = raw.match(/^version:\s*([^\n]+)$/m);
    return {
      created: createdMatch?.[1] ?? today,
      version: versionMatch?.[1]?.trim() ?? "1.0.0",
      raw,
    };
  } catch {
    return null;
  }
};

const bumpPatchVersion = (version: string): string => {
  const match = version.trim().match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    return "1.0.0";
  }
  return `${match[1]}.${match[2]}.${Number(match[3]) + 1}`;
};

const renderFrontmatter = ({
  docId,
  title,
  created,
  version,
  updated,
  up,
  related,
  operationId,
  method,
  path,
}: {
  docId: string;
  title: string;
  created: string;
  version: string;
  updated: string;
  up: string[];
  related: string[];
  operationId?: string;
  method?: string;
  path?: string;
}) => {
  const lines = [
    "---",
    `id: ${docId}`,
    `title: ${title}`,
    "doc_type: API設計",
    "phase: BD",
    `version: ${version}`,
    "status: 下書き",
    "owner: RQ-SH-001",
    `created: ${created}`,
    `updated: '${updated}'`,
    "up:",
    ...up.map((link) => `- '${link}'`),
    "related:",
    ...related.map((link) => `- '${link}'`),
    "tags:",
    "- diopside",
    "- BD",
    "- API",
    "- OpenAPI",
  ];
  if (operationId) {
    lines.push(`openapi_operation_id: ${operationId}`);
  }
  if (method) {
    lines.push(`openapi_method: ${method}`);
  }
  if (path) {
    lines.push(`openapi_path: ${path}`);
  }
  lines.push("---", "");
  return lines;
};

const renderOperationDoc = (
  spec: OperationDocSpec,
  method: string,
  path: string,
  pathItem: PathItem,
  operation: OpenApiOperation,
  created: string,
  version: string,
  updated: string,
) => {
  const frontmatter = renderFrontmatter({
    docId: spec.docId,
    title: spec.title,
    created,
    version,
    updated,
    up: [`[[${indexDocId}]]`, "[[BD-APP-API-004]]"],
    related: [`[[${spec.legacyDocId}]]`, ...new Set((spec.related ?? []).map((id) => `[[${id}]]`))],
    operationId: spec.operationId,
    method,
    path,
  });

  return [
    ...frontmatter,
    ...renderOverviewSection(spec, method, path, operation),
    "",
    ...renderParameterSection(pathItem, operation),
    "",
    ...renderRequestBodySection(operation),
    "",
    ...renderResponseSection(operation),
    "",
    "## 変更履歴",
    `- ${updated}: OpenAPI 正本から表形式のI/F文書を自動生成 [[BD-SYS-ADR-023]]`,
    "",
  ].join("\n");
};

const renderIndexDoc = (
  created: string,
  version: string,
  updated: string,
  items: Array<{ spec: OperationDocSpec; method: string; path: string }>,
) => {
  const frontmatter = renderFrontmatter({
    docId: indexDocId,
    title: "OpenAPI IF一覧",
    created,
    version,
    updated,
    up: ["[[BD-APP-API-004]]", "[[BD-APP-API-001]]"],
    related: ["[[DD-APP-API-001]]", "[[BD-SYS-ADR-025]]", "[[UT-PLAN-005]]", "[[IT-PLAN-001]]"],
  });

  const lines = [
    ...frontmatter,
    "## 方針",
    "- 本一覧および `BD-APP-OAS-*` は OpenAPI 正本から自動生成する。",
    "- 各文書は HTTP I/F のみを表形式で記載し、処理フロー・制約・オラクルは `DD-APP-API-*` を参照する。",
    "",
    "## 一覧",
    "| doc_id | title | method | path | 処理詳細 |",
    "| --- | --- | --- | --- | --- |",
  ];

  for (const item of items) {
    lines.push(
      `| [[${item.spec.docId}]] | ${escapeCell(applyGlossaryLinks(item.spec.title))} | \`${item.method}\` | \`${escapeCell(item.path)}\` | [[${item.spec.legacyDocId}]] |`,
    );
  }

  lines.push("", "## 変更履歴", `- ${updated}: OpenAPI 正本から表形式のI/F一覧を自動生成 [[BD-SYS-ADR-023]]`, "");
  return lines.join("\n");
};

const writeManagedDoc = async (filePath: string, render: (created: string, version: string, updated: string) => string) => {
  const existing = await parseExistingDocMeta(filePath);
  const created = existing?.created ?? today;
  const baseline = render(created, existing?.version ?? "1.0.0", today);
  if (existing && normalizeForComparison(existing.raw) === normalizeForComparison(baseline)) {
    return { changed: false, path: filePath };
  }

  const version = existing ? bumpPatchVersion(existing.version) : "1.0.0";
  const content = render(created, version, today);

  if (checkMode) {
    return { changed: true, path: filePath };
  }

  await writeFile(filePath, content, "utf8");
  return { changed: true, path: filePath };
};

const collectManagedFiles = async (dirPath: string, pattern: RegExp) => {
  try {
    return (await readdir(dirPath)).filter((name) => pattern.test(name)).map((name) => resolve(dirPath, name));
  } catch {
    return [];
  }
};

await mkdir(outputDir, { recursive: true });

const expectedPaths = new Set<string>();
const generatedEntries: Array<{ spec: OperationDocSpec; method: string; path: string }> = [];
const changedPaths: string[] = [];

for (const spec of operationDocSpecs) {
  const matched = operationMap.get(spec.operationId);
  if (!matched) {
    throw new Error(`operation not found in OpenAPI: ${spec.operationId}`);
  }

  const filePath = resolve(outputDir, `${spec.docId}.md`);
  expectedPaths.add(filePath);
  generatedEntries.push({ spec, method: matched.method, path: matched.path });

  const result = await writeManagedDoc(filePath, (created, version, updated) =>
    renderOperationDoc(spec, matched.method, matched.path, matched.pathItem, matched.operation, created, version, updated),
  );
  if (result.changed) {
    changedPaths.push(result.path);
  }
}

expectedPaths.add(indexDocPath);
const indexResult = await writeManagedDoc(indexDocPath, (created, version, updated) =>
  renderIndexDoc(created, version, updated, generatedEntries),
);
if (indexResult.changed) {
  changedPaths.push(indexResult.path);
}

const currentFiles = await collectManagedFiles(outputDir, /^BD-APP-OAS-\d{3}\.md$/);
const extraCurrentFiles = currentFiles.filter((filePath) => !expectedPaths.has(filePath));
if (extraCurrentFiles.length > 0) {
  if (checkMode) {
    changedPaths.push(...extraCurrentFiles);
  } else {
    await Promise.all(extraCurrentFiles.map((filePath) => rm(filePath)));
  }
}

const legacyFiles = await collectManagedFiles(legacyOutputDir, /^DD-APP-OAS-\d{3}\.md$/);
if (legacyFiles.length > 0) {
  if (checkMode) {
    changedPaths.push(...legacyFiles);
  } else {
    await Promise.all(legacyFiles.map((filePath) => rm(filePath)));
  }
}

if (checkMode) {
  if (changedPaths.length > 0) {
    console.error("generated API docs are out of date:");
    for (const filePath of changedPaths.sort()) {
      console.error(`- ${filePath}`);
    }
    process.exit(1);
  }
  console.log("OpenAPI markdown docs are up to date.");
} else {
  console.log(`generated ${operationDocSpecs.length + 1} OpenAPI markdown docs under ${outputDir}`);
}
