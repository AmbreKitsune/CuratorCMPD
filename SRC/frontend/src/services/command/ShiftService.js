import { ApiClient } from "../ApiClient";

export const ShiftService = {
  start() {
    return ApiClient.post("/shift/start");
  },
};
