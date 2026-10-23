import { ApiClient } from "../ApiClient";

export const CandidateService = {
  accept(id) {
    return ApiClient.post(`/candidates/${id}`);
  },
};
