import Cookies from "js-cookie";

export const csrfFetch = async (url, options = {}) => {
  options.headers = options.headers || {};
  options.method = options.method || "GET";

  if (options.method.toUpperCase() !== "GET") {
    options.headers["Content-Type"] =
      options.headers["Content-Type"] || "application/json";
    options.headers["XSRF-Token"] = Cookies.get("XSRF-TOKEN");
  }

  try {
    const res = await window.fetch(url, options);
    return res;
  } catch (error) {
    return error;
  }

  // if using async await, comment out line 16
  // easier to handle failures without throwing exceptions to async await

  // if res status code is 400 or more, throw an error with the
  // error being the res
  // if (res.status >= 400) throw res;

  // if response status code is under 400
  // return the response to the next promise chain
  // if (res.ok) {
  //   const data = res.json()
  //   return data;
  // } else {
  //   const errors = res.json()
  //   return errors;
  // }
};

// call this to get the "XSRF-TOKEN" cookie, should only be used in development
export function restoreCSRF() {
  return csrfFetch("/api/csrf/restore");
}
