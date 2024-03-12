import { getEventsRenderedAction } from "./_actions/get-events";
import { listStocksRenderedAction } from "./_actions/list-stocks";
import { showStockPriceRenderedAction } from "./_actions/show-stock-price";
import { showStockPriceUIRenderedAction } from "./_actions/show-stock-price-ui";
import { createRenderedActionsRegistry } from "./generators";

const ActionsRegistryWithRender = createRenderedActionsRegistry([
  listStocksRenderedAction,
  showStockPriceRenderedAction,
  getEventsRenderedAction,
  showStockPriceUIRenderedAction,
]);

export { ActionsRegistryWithRender };
