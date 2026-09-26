import { ApiClient } from "../ApiClient"

export const ShiftService = {
    getState() {
        return ApiClient.get("/shift/")
    }
}
