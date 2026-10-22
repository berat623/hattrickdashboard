import crypto from "crypto";
import OAuth from "oauth-1.0a";

const CHPP_BASE_URL = "https://chpp.hattrick.org";
const REQUEST_TOKEN_URL = `${CHPP_BASE_URL}/oauth/request_token.ashx`;
const AUTHORIZE_URL = `${CHPP_BASE_URL}/oauth/authorize.aspx`;
const ACCESS_TOKEN_URL = `${CHPP_BASE_URL}/oauth/access_token.ashx`;
export const CHPP_XML_URL = `${CHPP_BASE_URL}/chppxml.ashx`;

// Default registered CHPP credentials if user has not set custom env vars
const DEFAULT_CONSUMER_KEY = "sKDixHQBSGgdJ3a9O6lRtL";
const DEFAULT_CONSUMER_SECRET = "DIZIDBTX64d0+-9fPq8GrYN5PNHtMxYhpS9ZKsbcPqf";

export function getOAuthConfig(customKey?: string, customSecret?: string) {
  const consumerKey = customKey || process.env.HATTRICK_CONSUMER_KEY || DEFAULT_CONSUMER_KEY;
  const consumerSecret = customSecret || process.env.HATTRICK_CONSUMER_SECRET || DEFAULT_CONSUMER_SECRET;

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

export async function getRequestToken(
  callbackUrl: string,
  includeWriteScope = true
): Promise<RequestTokenResult> {
  const { oauth } = getOAuthConfig();

  const requestData = {
    url: REQUEST_TOKEN_URL,
    method: "GET",
    data: {
      oauth_callback: callbackUrl,
    },
  };

  const authData = oauth.authorize(requestData);
  const queryParams = new URLSearchParams({
    ...Object.fromEntries(Object.entries(authData).map(([k, v]) => [k, String(v)])),
    oauth_callback: callbackUrl,
  });

  const response = await fetch(`${REQUEST_TOKEN_URL}?${queryParams.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hattrick CHPP Request Token hatası: ${response.status} - ${errorText}`);
  }

  const text = await response.text();
  const params = new URLSearchParams(text);
  const oauthToken = params.get("oauth_token");
  const oauthTokenSecret = params.get("oauth_token_secret");

  if (!oauthToken || !oauthTokenSecret) {
    throw new Error(`Hattrick CHPP geçerli token döndürmedi: ${text}`);
  }

  const scopeParam = includeWriteScope
    ? `&scope=${encodeURIComponent("manage_matchorders,manage_training")}`
    : "";
  const authorizeUrl = `${AUTHORIZE_URL}?oauth_token=${encodeURIComponent(oauthToken)}${scopeParam}`;

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

  const authData = oauth.authorize(requestData, {
    key: requestToken,
    secret: requestTokenSecret,
  });

  const queryParams = new URLSearchParams({
    ...Object.fromEntries(Object.entries(authData).map(([k, v]) => [k, String(v)])),
    oauth_verifier: oauthVerifier,
  });

  const response = await fetch(`${ACCESS_TOKEN_URL}?${queryParams.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hattrick CHPP Access Token hatası: ${response.status} - ${errorText}`);
  }

  const text = await response.text();
  const params = new URLSearchParams(text);
  const oauthToken = params.get("oauth_token");
  const oauthTokenSecret = params.get("oauth_token_secret");

  if (!oauthToken || !oauthTokenSecret) {
    throw new Error(`Hattrick CHPP erişim anahtarlarını döndürmedi: ${text}`);
  }

  return {
    oauthToken,
    oauthTokenSecret,
  };
}

export function buildSignedChppUrl(
  params: Record<string, string>,
  accessToken: string,
  accessTokenSecret: string,
  method: "GET" | "POST" = "GET"
): string {
  const { oauth } = getOAuthConfig();

  const requestData = {
    url: CHPP_XML_URL,
    method,
    data: params,
  };

  const authData = oauth.authorize(requestData, {
    key: accessToken,
    secret: accessTokenSecret,
  });

  const allParams = new URLSearchParams({
    ...params,
    ...Object.fromEntries(Object.entries(authData).map(([k, v]) => [k, String(v)])),
  });

  return `${CHPP_XML_URL}?${allParams.toString()}`;
}
