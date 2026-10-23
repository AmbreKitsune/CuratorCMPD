import { ApiClient } from "../ApiClient";

export const UnitService = {
  getUnits() {
    return ApiClient.get("/units/");
  },
  getUnit(id) {
    return ApiClient.get(`/units/${id}`);
  },
  getOfficersUnit(id) {
    return ApiClient.get(`/units/${id}/officers`);
  },
};
