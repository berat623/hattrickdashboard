import crypto from "crypto";
import OAuth from "oauth-1.0a";

const CHPP_BASE_URL = "https://chpp.hattrick.org";
const REQUEST_TOKEN_URL = `${CHPP_BASE_URL}/oauth/request_token.ashx`;
const AUTHORIZE_URL = `${CHPP_BASE_URL}/oauth/authorize.aspx`;
const ACCESS_TOKEN_URL = `${CHPP_BASE_URL}/oauth/access_token.ashx`;
export const CHPP_XML_URL = `${CHPP_BASE_URL}/chppxml.ashx`;

export function getOAuthConfig() {
  const consumerKey = process.env.HATTRICK_CONSUMER_KEY || "YOUR_HATTRICK_CONSUMER_KEY";
  const consumerSecret = process.env.HATTRICK_CONSUMER_SECRET || "YOUR_HATTRICK_CONSUMER_SECRET";

  const oauth = new OAuth({
    consumer: {
      key: consumerKey,
      secret: consumerSecret,
    },
    signature_method: "HMAC-SHA1",
    hash_function(base_string: string, key: string) {
      return crypto
        .createHmac("sha1", key)
        .update(base_string)
        .digest("base64");
    },
  });

  return { oauth, consumerKey, consumerSecret };
}

export interface RequestTokenResult {
  oauthToken: string;
  oauthTokenSecret: string;
  authorizeUrl: string;
}

export interface AccessTokenResult {
  oauthToken: string;
  oauthTokenSecret: string;
}

export async function getRequestToken(callbackUrl: string): Promise<RequestTokenResult> {
  const { oauth } = getOAuthConfig();

  const requestData = {
    url: REQUEST_TOKEN_URL,
    method: "GET",
    data: {
      oauth_callback: callbackUrl,
    },
  };

  const headers = oauth.toHeader(oauth.authorize(requestData));

  const response = await fetch(REQUEST_TOKEN_URL, {
    method: "GET",
    headers: {
      ...headers,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hattrick CHPP Request Token error: ${response.status} - ${errorText}`);
  }

  const text = await response.text();
  const params = new URLSearchParams(text);
  const oauthToken = params.get("oauth_token");
  const oauthTokenSecret = params.get("oauth_token_secret");

  if (!oauthToken || !oauthTokenSecret) {
    throw new Error(`Hattrick CHPP failed to return valid tokens. Response: ${text}`);
  }

  // Request scopes: manage_training, manage_lineup (needed to change lineups and training automatically)
  const authorizeUrl = `${AUTHORIZE_URL}?oauth_token=${encodeURIComponent(
    oauthToken
  )}&scope=manage_training,manage_lineup`;

  return {
    oauthToken,
    oauthTokenSecret,
    authorizeUrl,
  };
}

export async function getAccessToken(
  requestToken: string,
  requestTokenSecret: string,
  oauthVerifier: string
): Promise<AccessTokenResult> {
  const { oauth } = getOAuthConfig();

  const requestData = {
    url: ACCESS_TOKEN_URL,
    method: "GET",
    data: {
      oauth_verifier: oauthVerifier,
    },
  };

  const headers = oauth.toHeader(
    oauth.authorize(requestData, {
      key: requestToken,
      secret: requestTokenSecret,
    })
  );

  const response = await fetch(ACCESS_TOKEN_URL, {
    method: "GET",
    headers: {
      ...headers,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hattrick CHPP Access Token error: ${response.status} - ${errorText}`);
  }

  const text = await response.text();
  const params = new URLSearchParams(text);
  const oauthToken = params.get("oauth_token");
  const oauthTokenSecret = params.get("oauth_token_secret");

  if (!oauthToken || !oauthTokenSecret) {
    throw new Error(`Hattrick CHPP failed to return access tokens. Response: ${text}`);
  }

  return {
    oauthToken,
    oauthTokenSecret,
  };
}

export function getSignedHeaders(
  url: string,
  method: string,
  accessToken: string,
  accessTokenSecret: string,
  params?: Record<string, string | number | boolean>
): Record<string, string> {
  const { oauth } = getOAuthConfig();

  const requestData = {
    url,
    method,
    data: params,
  };

  const headers = oauth.toHeader(
    oauth.authorize(requestData, {
      key: accessToken,
      secret: accessTokenSecret,
    })
  );

  return headers;
}
