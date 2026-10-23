import { ApiClient } from "../ApiClient";

export const CandidateService = {
  getCandidates() {
    return ApiClient.get("/candidates/");
  },
  getCandidate(id) {
    return ApiClient.get(`/candidates/${id}`);
  },
};
