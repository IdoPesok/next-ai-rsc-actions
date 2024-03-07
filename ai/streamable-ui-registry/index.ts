"server-only";

import { getEventsStreamableAction } from "./_actions/get-events";
import { listStocksStreamableAction } from "./_actions/list-stocks";
import { showStockStreamablePriceAction } from "./_actions/show-stock-price";
import { showStockPriceUIStreamableAction } from "./_actions/show-stock-purchase-ui";
import { createStreamableUIActionsRegistry } from "./generators";

const StreamableActionsRegistry = createStreamableUIActionsRegistry([
  listStocksStreamableAction,
  getEventsStreamableAction,
  showStockPriceUIStreamableAction,
  showStockStreamablePriceAction,
]);

export { StreamableActionsRegistry };
