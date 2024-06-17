export type Body = Record<string | number, unknown>;

// ----------

type ResponseMessage = {
  type: "success" | "error" | "warning" | "info";
  content: string;
};

export type ResponseFormat = {
  success: boolean;
  messages: ResponseMessage[];
  data: Record<string | number, unknown>;
};

// -----------
