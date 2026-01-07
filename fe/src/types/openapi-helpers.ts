import type { paths } from "./openapi";

type ResponsesOf<
  TPath extends keyof paths,
  TMethod extends keyof paths[TPath]
> =
  paths[TPath][TMethod] extends { responses: infer R }
    ? R
    : never;

export type JsonResponse<
  TPath extends keyof paths,
  TMethod extends keyof paths[TPath],
  TStatus extends keyof ResponsesOf<TPath, TMethod>
> =
  ResponsesOf<TPath, TMethod>[TStatus] extends {
    content: {
      "application/json": infer R;
    };
  }
    ? R
    : never;
