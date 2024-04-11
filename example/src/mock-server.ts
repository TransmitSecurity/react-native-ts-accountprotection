export interface AccessTokenResponse {
    token: string;
    expireDate: Date;
}

class MockServer {

    private baseurl: string;
    private clientId: string;
    private secret: string;

    constructor(baseUrl: string, clientId: string, secret: string) {
        this.baseurl = baseUrl;
        this.clientId = clientId;
        this.secret = secret;
    }

    public fetchRecommendation = async (actionToken: string): Promise<any> => {
        try {
            const query = new URLSearchParams({
                action_token: actionToken,
            }).toString();

            const accessTokenResponse = await this.getAccessToken();
            
            console.log("Access token url: ", `${this.baseurl}/oidc/token`);
            console.log("Access Token Response: ", accessTokenResponse)
            console.log("Recomendation: ", `${this.baseurl}/risk/v1/recommendation?${query}`)

            const resp = await fetch(
                `${this.baseurl}/risk/v1/recommendation?${query}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessTokenResponse.token}`
                    },
                }
            );

            const data = await resp.json();

            return data;

        } catch (error) {
            return Promise.reject(`Error in completeAuthentication: ${error}`);
        }
    }

    public getAccessToken = async (): Promise<AccessTokenResponse> => {
        const formData = {
            client_id: this.clientId,
            client_secret: this.secret,
            grant_type: 'client_credentials',
            resource: 'https://risk.identity.security'
        };

        try {
            const resp = await fetch(
                `${this.baseurl}/oidc/token`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams(formData).toString()
                }
            );

            const json = await resp.json();
            const expireDate = new Date();
            expireDate.setSeconds(expireDate.getSeconds() + json.expires_in);
            return { token: json.access_token, expireDate };
        } catch (error) {
            return Promise.reject(`Error in getAccessToken: ${error}`);
        }
    }
}
export default MockServer;