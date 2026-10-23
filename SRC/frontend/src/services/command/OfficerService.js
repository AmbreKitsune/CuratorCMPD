import { ApiClient } from "../ApiClient";

export const OfficerService = {
  assign(officer_id, unit_id) {
    return ApiClient.post(`/officers/${officer_id}/assign/${unit_id}`);
  },
  unassign(officer_id) {
    return ApiClient.post(`/officers/${officer_id}/unassign`);
  },
};
