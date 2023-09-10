namespace Client {
  const _properties = PropertiesService.getUserProperties();

  function request(
    url: string,
    opt?: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions
  ) {
    let done = false;
    while (!done) {
      try {
        const request = UrlFetchApp.fetch(url, {
          ...opt,
          headers: {
            ...opt.headers,
            cookie: "authToken=" + _properties.getProperty("AUTH_TOKEN"),
          },
        });
        done = true;

        return request;
      } catch (e) {
        if (
          e.message.includes("Address unavailable") ||
          e.message.includes("Адрес недоступен")
        ) {
          Logger.log(e);
          Utilities.sleep(1000);
        } else {
          throw e;
        }
      }
    }
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
