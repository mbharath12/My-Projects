import http from 'k6/http';
import { check } from 'k6';

// Get clientID & Secret
const data = JSON.parse(open('./support_data.json'));


//#####Get Access Token function####//
export function getAuthToken() {
    let url = data.tokenUrl;
  
    // Payload client ID & secret
    let payload = JSON.stringify({
        client_id: __ENV.MY_CLIENTID,
        client_secret: '' + __ENV.MY_CLIENTSECRET
    });

    //headers
    let params = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };

    // making Get Access Token POST call
    let response = http.post(url, payload, params);

    //console.log("Full response = " + JSON.stringify(response));

    //Grabbing Access Token 
    let tokenType = response.json("token_type");
    let accessTokenValue = response.json("access_token");

    // Assertions 
    check(response, {
        'AccessToken response is 200': (res) => res.status == 200,
        'AccessToken response token_type is Bearer': (res) => res.json("token_type") === 'Bearer',
    });

    return accessTokenValue;
}
