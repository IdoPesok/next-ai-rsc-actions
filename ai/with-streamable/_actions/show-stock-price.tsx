import { z } from 'zod';
import { createStreamableUIAction } from '../generators';
import { BotCard } from '@/components/llm-stocks';
import { sleep } from 'openai/core.mjs';
import { Stock } from '@/components/llm-stocks/stock';
import { StockSkeleton } from '@/components/llm-stocks/stock-skeleton';

export const showStockStreamablePriceAction = createStreamableUIAction({
  id: 'showStockPrice',
  metadata: {
    title: 'Show Stock Price',
    description:
      'Get the current stock price of a given stock or currency. Use this to show the price to the user.',
    avatarGradient: 'Purple',
    systemMessage:
      'If the user wants just the price, call `showStockPrice` to show the price.',
  },
})
  .describe(
    'Get the current stock price of a given stock or currency. Use this to show the price to the user.',
  )
  .input({
    symbol: z
      .string()
      .default('DOGE')
      .describe(
        'The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD.',
      ),
    price: z.number().describe('The price of the stock.').default(100),
    delta: z.number().describe('The change in price of the stock').default(1),
  })
  .handler(async ({ input, context }) => {
    const { reply, aiState } = context;
    const { symbol, price, delta } = input;

    const fn = context.mode === 'normal' ? reply.update : () => {};
    fn(
      <BotCard>
        <StockSkeleton />
      </BotCard>,
    );

    await sleep(1000);

    // we want to use done in normal mode, but append in super mode
    const fn2 = context.mode === 'normal' ? reply.done : reply.append;
    fn2(
      <BotCard>
        <Stock {...input} />
      </BotCard>,
    );

    // we want to use done in normal mode, but update in super mode
    const fn3 = context.mode === 'normal' ? aiState.done : aiState.update;
    fn3([
      ...aiState.get(),
      {
        role: 'function',
        name: 'showStockPrice',
        content: `[Price of ${symbol} = ${price}]`,
      },
    ]);

    return input;
  });
