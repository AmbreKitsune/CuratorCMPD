import { ApiClient } from "../ApiClient";

export const UnitService = {
  setTargetState(id, target) {
    return ApiClient.post(`/units/${id}/target/${target}`);
  },
};
