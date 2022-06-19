import http from 'k6/http';
import { check } from 'k6';
import { getAuthToken } from "./01_authorization_rc.js";
// @ts-ignore
import { randomString } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";

// Get URLs
const data = JSON.parse(open('./support_data.json'));

// Get Invite API User JSON
const inviteApiUserJson = JSON.parse(open('./09_invite_api_user_json.json'));

// Scenario Start
export const options = {
    stages: [{
            duration: '30s',
            target: 10
        },
        {
            duration: '58m',
            target: 10
        },
        {
            duration: '30s',
            target: 0
        },
    ],
    thresholds: {
        http_req_failed: ['rate<0.02'], // http errors should be less than 2%
        http_req_duration: ['p(99)<200'], // 99% requests should be below 200MS
    },
    ext: {
        loadimpact: {
          apm: [
            {
              provider: 'datadog',
              apiKey: '****',
              appKey: '****',

              // optional parameters
              region: 'us',
              metrics: ['http_req_sending', 'my_rate', 'my_gauge'],
              includeDefaultMetrics: true,
              includeTestRunId: true,
            },
          ],
          projectID: 3560313,
          // Test runs with the same name groups test runs together
          name: "09_invite_api_user.js",
            distribution: {
                'amazon:us:ashburn': {
                    loadZone: 'amazon:us:ashburn',
                    percent: 100
                },
            },
        },
    },
}


//#####Get Access Token function####//
export default function() {
    let accessTokenValue = getAuthToken();



    // #####Invite API User request start#####// 

    // apiUsersUrl URL 
    let apiUsersUrl = data.apiUsersUrl;

    // Dynamic Email ID generate for every request
    let dynamicEmail = "Canopy" + randomString(10) + "@sharklasers.com";

    //Form Invite API User JSON
    let updateJson = inviteApiUserJson;
    updateJson["email"] = dynamicEmail;
    let inviteUser = JSON.stringify(updateJson);

    //console.log("Print inviteUser ="+ updateJson); 

    // Invite API user headers
    let inviteUserParams = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessTokenValue,
            // 'customer_id' : '1866', 
            'event_id': '',
        }
    };

    //console.log("Print inviteUserParams ="+ inviteUserParams); 
    // Post request
    let inviteUserPost = http.post(apiUsersUrl, inviteUser, inviteUserParams);


    // Assertions 
    check(inviteUserPost, {
        'inviteUserPost Response is 200': (res) => res.status == 200,
        'inviteUserPost Response has Success': (res) => res.json("status") == 'success',
    });
    //console.log("Print createrProductResponse ="+ JSON.stringify(inviteUserPost)); 

}
