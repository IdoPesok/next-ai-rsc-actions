"server-only";

import { getEventsRenderedAction } from "./_actions/get-events";
import { listStocksRenderedAction } from "./_actions/list-stocks";
import { showStockPriceRenderedAction } from "./_actions/show-stock-price";
import { showStockPriceUIRenderedAction } from "./_actions/show-stock-purchase-ui";
import { createRenderedActionsRegistry } from "./generators";

const RenderedActionsRegistry = createRenderedActionsRegistry([
  listStocksRenderedAction,
  showStockPriceRenderedAction,
  getEventsRenderedAction,
  showStockPriceUIRenderedAction,
]);

export { RenderedActionsRegistry };
