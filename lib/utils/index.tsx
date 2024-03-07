import { OpenAIStream } from "ai";
import type OpenAI from "openai";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { setupFunctionCalling } from "ai-actions";

const consumeStream = async (stream: ReadableStream) => {
  const reader = stream.getReader();
  while (true) {
    const { done } = await reader.read();
    if (done) break;
  }
};

export function runOpenAICompletion(
  openai: OpenAI,
  functionCallHandler: ReturnType<
    typeof setupFunctionCalling<any, any>
  >["functionCallHandler"],
  params: Parameters<typeof OpenAI.prototype.chat.completions.create>[0]
) {
  let text = "";
  let hasFunction = false;

  let onTextContent: (text: string, isFinal: boolean) => void = () => {};

  (async () => {
    consumeStream(
      OpenAIStream(
        (await openai.chat.completions.create({
          ...params,
          stream: true,
        })) as any,
        {
          async experimental_onFunctionCall(functionCallPayload) {
            hasFunction = true;

            functionCallHandler({
              name: functionCallPayload.name,
              arguments: functionCallPayload.arguments,
            });
          },
          onToken(token) {
            text += token;
            if (text.startsWith("{")) return;
            onTextContent(text, false);
          },
          onFinal() {
            if (hasFunction) return;
            onTextContent(text, true);
          },
        }
      )
    );
  })();

  return {
    onTextContent: (
      callback: (text: string, isFinal: boolean) => void | Promise<void>
    ) => {
      onTextContent = callback;
    },
  };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export const runAsyncFnWithoutBlocking = (
  fn: (...args: any) => Promise<any>
) => {
  fn();
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Fake data
export function getStockPrice(name: string) {
  let total = 0;
  for (let i = 0; i < name.length; i++) {
    total = (total + name.charCodeAt(i) * 9999121) % 9999;
  }
  return total / 100;
}

export const logJSON = (data: any, prefix = "") => {
  console.log(prefix, JSON.stringify(data, null, 2), "\n");
};

export const simulateLongRequest = async (
  requestName: string,
  durationInSeconds: number
) => {
  for (let i = 0; i < durationInSeconds; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`${requestName} request ${i + 1} of ${durationInSeconds}`);
  }
};
