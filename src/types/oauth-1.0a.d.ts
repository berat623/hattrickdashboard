declare module "oauth-1.0a" {
  interface OAuthOptions {
    consumer: {
      key: string;
      secret: string;
    };
    signature_method?: string;
    hash_function?: (base_string: string, key: string) => string;
    version?: string;
    realm?: string;
  }

  interface RequestOptions {
    url: string;
    method: string;
    data?: Record<string, string | number | boolean>;
  }

  interface Token {
    key: string;
    secret: string;
  }

  interface HeaderData {
    Authorization: string;
    [key: string]: string;
  }

  class OAuth {
    constructor(opts: OAuthOptions);
    authorize(request: RequestOptions, token?: Token): Record<string, string>;
    toHeader(data: Record<string, string>): HeaderData;
    getBaseString(request: RequestOptions, token?: Token): string;
    getSigningKey(tokenSecret?: string): string;
  }

  export default OAuth;
}
