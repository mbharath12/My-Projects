import http from "k6/http";
import { check } from "k6";

/** Get clientID & Secret */
const supportData = JSON.parse(open("./support_data.json"));

export function getAuthToken() {
  let url = supportData.tokenUrl;
  let payload = JSON.stringify({
    client_id: supportData.clientId,
    client_secret: "" + supportData.clientSecret,
  });

  let params = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  let response = http.post(url, payload, params);

  let tokenType = response.json("token_type");
  let accessTokenValue = response.json("access_token");

  /** Assertions */
  check(response, {
    "AccessToken response is 200": (res) => res.status == 200,
    "AccessToken response token_type is Bearer": (res) => res.json("token_type") === "Bearer",
  });

  return accessTokenValue;
}
