import { ApiClient } from "../ApiClient"

export const OfficerService = {
    getOfficers() {
        return ApiClient.get("/officers/")
    },
    getOfficer(id) {
        return ApiClient.get(`/officers/${id}`)
    }
}
