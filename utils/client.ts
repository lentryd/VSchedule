namespace Client {
  const _properties = PropertiesService.getUserProperties();

  function request(
    url: string,
    opt?: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions
  ) {
    const request = UrlFetchApp.fetch(url, {
      ...opt,
      headers: {
        ...opt.headers,
        cookie: "authToken=" + _properties.getProperty("AUTH_TOKEN"),
      },
    });

    return request;
  }

  export function get(
    url: string,
    opt?: Omit<GoogleAppsScript.URL_Fetch.URLFetchRequestOptions, "method">
  ) {
    return request(url, { ...opt, method: "get" });
  }

  export function post(
    url: string,
    opt?: Omit<GoogleAppsScript.URL_Fetch.URLFetchRequestOptions, "method">
  ) {
    return request(url, { ...opt, method: "post" });
  }
}
