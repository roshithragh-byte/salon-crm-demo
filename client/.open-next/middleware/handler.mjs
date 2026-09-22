
import {Buffer} from "node:buffer";
globalThis.Buffer = Buffer;

import {AsyncLocalStorage} from "node:async_hooks";
globalThis.AsyncLocalStorage = AsyncLocalStorage;


const defaultDefineProperty = Object.defineProperty;
Object.defineProperty = function(o, p, a) {
  if(p=== '__import_unsupported' && Boolean(globalThis.__import_unsupported)) {
    return;
  }
  return defaultDefineProperty(o, p, a);
};

  
  
  globalThis.openNextDebug = false;globalThis.openNextVersion = "4.1.0";globalThis.nextVersion = "16.3.0";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/@opennextjs/aws/dist/utils/error.js
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var init_error = __esm({
  "../../node_modules/@opennextjs/aws/dist/utils/error.js"() {
  }
});

// ../../node_modules/@opennextjs/aws/dist/adapters/logger.js
function debug(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn(...args) {
  console.warn(...args);
}
function error(...args) {
  if (args.some((arg) => isDownplayedErrorLog(arg))) {
    return debug(...args);
  }
  if (args.some((arg) => isOpenNextError(arg))) {
    const error2 = args.find((arg) => isOpenNextError(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DOWNPLAYED_ERROR_LOGS, isDownplayedErrorLog;
var init_logger = __esm({
  "../../node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
    init_error();
    DOWNPLAYED_ERROR_LOGS = [
      {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey"
      }
    ];
    isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
  }
});

// ../../node_modules/@opennextjs/aws/node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "../../node_modules/@opennextjs/aws/node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseCookie = parseCookie;
    exports.parse = parseCookie;
    exports.stringifyCookie = stringifyCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    exports.parseSetCookie = parseSetCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var maxAgeRegExp = /^-?\d+$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parseCookie(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = eqIndex(str, index, len);
        if (eqIdx === -1)
          break;
        const endIdx = endIndex(str, index, len);
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const key = valueSlice(str, index, eqIdx);
        if (obj[key] === void 0) {
          obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function stringifyCookie(cookie, options) {
      const enc = options?.encode || encodeURIComponent;
      const cookieStrings = [];
      for (const name of Object.keys(cookie)) {
        const val = cookie[name];
        if (val === void 0)
          continue;
        if (!cookieNameRegExp.test(name)) {
          throw new TypeError(`cookie name is invalid: ${name}`);
        }
        const value = enc(val);
        if (!cookieValueRegExp.test(value)) {
          throw new TypeError(`cookie val is invalid: ${val}`);
        }
        cookieStrings.push(`${name}=${value}`);
      }
      return cookieStrings.join("; ");
    }
    function stringifySetCookie(_name, _val, _opts) {
      const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
      const options = typeof _val === "object" ? _val : _opts;
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(cookie.name)) {
        throw new TypeError(`argument name is invalid: ${cookie.name}`);
      }
      const value = cookie.value ? enc(cookie.value) : "";
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${cookie.value}`);
      }
      let str = cookie.name + "=" + value;
      if (cookie.maxAge !== void 0) {
        if (!Number.isInteger(cookie.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
        }
        str += "; Max-Age=" + cookie.maxAge;
      }
      if (cookie.domain) {
        if (!domainValueRegExp.test(cookie.domain)) {
          throw new TypeError(`option domain is invalid: ${cookie.domain}`);
        }
        str += "; Domain=" + cookie.domain;
      }
      if (cookie.path) {
        if (!pathValueRegExp.test(cookie.path)) {
          throw new TypeError(`option path is invalid: ${cookie.path}`);
        }
        str += "; Path=" + cookie.path;
      }
      if (cookie.expires) {
        if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${cookie.expires}`);
        }
        str += "; Expires=" + cookie.expires.toUTCString();
      }
      if (cookie.httpOnly) {
        str += "; HttpOnly";
      }
      if (cookie.secure) {
        str += "; Secure";
      }
      if (cookie.partitioned) {
        str += "; Partitioned";
      }
      if (cookie.priority) {
        const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${cookie.priority}`);
        }
      }
      if (cookie.sameSite) {
        const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
        }
      }
      return str;
    }
    function parseSetCookie(str, options) {
      const dec = options?.decode || decode;
      const len = str.length;
      const endIdx = endIndex(str, 0, len);
      const eqIdx = eqIndex(str, 0, endIdx);
      const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
        name: valueSlice(str, 0, eqIdx),
        value: dec(valueSlice(str, eqIdx + 1, endIdx))
      };
      let index = endIdx + 1;
      while (index < len) {
        const endIdx2 = endIndex(str, index, len);
        const eqIdx2 = eqIndex(str, index, endIdx2);
        const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
        const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
        switch (attr.toLowerCase()) {
          case "httponly":
            setCookie.httpOnly = true;
            break;
          case "secure":
            setCookie.secure = true;
            break;
          case "partitioned":
            setCookie.partitioned = true;
            break;
          case "domain":
            setCookie.domain = val;
            break;
          case "path":
            setCookie.path = val;
            break;
          case "max-age":
            if (val && maxAgeRegExp.test(val))
              setCookie.maxAge = Number(val);
            break;
          case "expires":
            if (!val)
              break;
            const date = new Date(val);
            if (Number.isFinite(date.valueOf()))
              setCookie.expires = date;
            break;
          case "priority":
            if (!val)
              break;
            const priority = val.toLowerCase();
            if (priority === "low" || priority === "medium" || priority === "high") {
              setCookie.priority = priority;
            }
            break;
          case "samesite":
            if (!val)
              break;
            const sameSite = val.toLowerCase();
            if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
              setCookie.sameSite = sameSite;
            }
            break;
        }
        index = endIdx2 + 1;
      }
      return setCookie;
    }
    function endIndex(str, min, len) {
      const index = str.indexOf(";", min);
      return index === -1 ? len : index;
    }
    function eqIndex(str, min, max) {
      const index = str.indexOf("=", min);
      return index < max ? index : -1;
    }
    function valueSlice(str, min, max) {
      let start = min;
      let end = max;
      do {
        const code = str.charCodeAt(start);
        if (code !== 32 && code !== 9)
          break;
      } while (++start < end);
      while (end > start) {
        const code = str.charCodeAt(end - 1);
        if (code !== 32 && code !== 9)
          break;
        end--;
      }
      return str.slice(start, end);
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});

// ../../node_modules/@opennextjs/aws/dist/http/util.js
function parseSetCookieHeader(cookies) {
  if (!cookies) {
    return [];
  }
  if (typeof cookies === "string") {
    return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
  }
  return cookies;
}
function getQueryFromIterator(it) {
  const query = {};
  for (const [key, value] of it) {
    if (key in query) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  return query;
}
var init_util = __esm({
  "../../node_modules/@opennextjs/aws/dist/http/util.js"() {
    init_logger();
  }
});

// ../../node_modules/@opennextjs/aws/dist/overrides/converters/utils.js
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "../../node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});

// ../../node_modules/@opennextjs/aws/dist/overrides/converters/edge.js
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
import { Buffer as Buffer2 } from "node:buffer";
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "../../node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
    import_cookie = __toESM(require_dist(), 1);
    init_util();
    init_utils();
    NULL_BODY_STATUSES = /* @__PURE__ */ new Set([101, 103, 204, 205, 304]);
    converter = {
      convertFrom: async (event) => {
        const url = new URL(event.url);
        const searchParams = url.searchParams;
        const query = getQueryFromSearchParams(searchParams);
        const headers = {};
        event.headers.forEach((value, key) => {
          headers[key] = value;
        });
        const rawPath = url.pathname;
        const method = event.method;
        const shouldHaveBody = method !== "GET" && method !== "HEAD";
        const body = shouldHaveBody ? Buffer2.from(await event.arrayBuffer()) : void 0;
        const cookieHeader = event.headers.get("cookie");
        const cookies = cookieHeader ? import_cookie.default.parse(cookieHeader) : {};
        return {
          type: "core",
          method,
          rawPath,
          url: event.url,
          body,
          headers,
          remoteAddress: event.headers.get("x-forwarded-for") ?? "::1",
          query,
          cookies
        };
      },
      convertTo: async (result) => {
        if ("internalEvent" in result) {
          const request = new Request(result.internalEvent.url, {
            body: result.internalEvent.body,
            method: result.internalEvent.method,
            headers: {
              ...result.internalEvent.headers,
              "x-forwarded-host": result.internalEvent.headers.host
            }
          });
          if (globalThis.__dangerous_ON_edge_converter_returns_request === true) {
            return request;
          }
          const cfCache = (result.isISR || result.internalEvent.rawPath.startsWith("/_next/image")) && process.env.DISABLE_CACHE !== "true" ? { cacheEverything: true } : {};
          return fetch(request, {
            // This is a hack to make sure that the response is cached by Cloudflare
            // See https://developers.cloudflare.com/workers/examples/cache-using-fetch/#caching-html-resources
            // @ts-expect-error - This is a Cloudflare specific option
            cf: cfCache
          });
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(result.headers)) {
          if (key === "set-cookie" && typeof value === "string") {
            const cookies = parseSetCookieHeader(value);
            for (const cookie of cookies) {
              headers.append(key, cookie);
            }
            continue;
          }
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.set(key, value);
          }
        }
        const body = NULL_BODY_STATUSES.has(result.statusCode) ? null : result.body;
        return new Response(body, {
          status: result.statusCode,
          headers
        });
      },
      name: "edge"
    };
    edge_default = converter;
  }
});

// ../../node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js
var cloudflare_edge_exports = {};
__export(cloudflare_edge_exports, {
  default: () => cloudflare_edge_default
});
var cfPropNameMapping, handler, cloudflare_edge_default;
var init_cloudflare_edge = __esm({
  "../../node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js"() {
    cfPropNameMapping = {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: [encodeURIComponent, "x-open-next-city"],
      country: "x-open-next-country",
      regionCode: "x-open-next-region",
      latitude: "x-open-next-latitude",
      longitude: "x-open-next-longitude"
    };
    handler = async (handler3, converter2) => async (request, env, ctx) => {
      globalThis.process = process;
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
      const internalEvent = await converter2.convertFrom(request);
      const cfProperties = request.cf;
      for (const [propName, mapping] of Object.entries(cfPropNameMapping)) {
        const propValue = cfProperties?.[propName];
        if (propValue != null) {
          const [encode, headerName] = Array.isArray(mapping) ? mapping : [null, mapping];
          internalEvent.headers[headerName] = encode ? encode(propValue) : propValue;
        }
      }
      const response = await handler3(internalEvent, {
        waitUntil: ctx.waitUntil.bind(ctx)
      });
      const result = await converter2.convertTo(response);
      return result;
    };
    cloudflare_edge_default = {
      wrapper: handler,
      name: "cloudflare-edge",
      supportStreaming: true,
      edgeRuntime: true
    };
  }
});

// ../../node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js
var pattern_env_exports = {};
__export(pattern_env_exports, {
  default: () => pattern_env_default
});
function initializeOnce() {
  if (initialized)
    return;
  cachedOrigins = JSON.parse(process.env.OPEN_NEXT_ORIGIN ?? "{}");
  const functions = globalThis.openNextConfig.functions ?? {};
  for (const key in functions) {
    if (key !== "default") {
      const value = functions[key];
      const regexes = [];
      for (const pattern of value.patterns) {
        const regexPattern = `/${pattern.replace(/\*\*/g, "(.*)").replace(/\*/g, "([^/]*)").replace(/\//g, "\\/").replace(/\?/g, ".")}`;
        regexes.push(new RegExp(regexPattern));
      }
      cachedPatterns.push({
        key,
        patterns: value.patterns,
        regexes
      });
    }
  }
  initialized = true;
}
var cachedOrigins, cachedPatterns, initialized, envLoader, pattern_env_default;
var init_pattern_env = __esm({
  "../../node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js"() {
    init_logger();
    cachedPatterns = [];
    initialized = false;
    envLoader = {
      name: "env",
      resolve: async (_path) => {
        try {
          initializeOnce();
          for (const { key, patterns, regexes } of cachedPatterns) {
            for (const regex of regexes) {
              if (regex.test(_path)) {
                debug("Using origin", key, patterns);
                return cachedOrigins[key];
              }
            }
          }
          if (_path.startsWith("/_next/image") && cachedOrigins.imageOptimizer) {
            debug("Using origin", "imageOptimizer", _path);
            return cachedOrigins.imageOptimizer;
          }
          if (cachedOrigins.default) {
            debug("Using default origin", cachedOrigins.default, _path);
            return cachedOrigins.default;
          }
          return false;
        } catch (e) {
          error("Error while resolving origin", e);
          return false;
        }
      }
    };
    pattern_env_default = envLoader;
  }
});

// ../../node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var resolver, dummy_default;
var init_dummy = __esm({
  "../../node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default = resolver;
  }
});

// ../../node_modules/@opennextjs/aws/dist/utils/stream.js
import { ReadableStream as ReadableStream2 } from "node:stream/web";
function toReadableStream(value, isBase64) {
  return new ReadableStream2({
    pull(controller) {
      controller.enqueue(Buffer.from(value, isBase64 ? "base64" : "utf8"));
      controller.close();
    }
  }, { highWaterMark: 0 });
}
function emptyReadableStream() {
  if (process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
    return new ReadableStream2({
      pull(controller) {
        maybeSomethingBuffer ??= Buffer.from("SOMETHING");
        controller.enqueue(maybeSomethingBuffer);
        controller.close();
      }
    }, { highWaterMark: 0 });
  }
  return new ReadableStream2({
    start(controller) {
      controller.close();
    }
  });
}
var maybeSomethingBuffer;
var init_stream = __esm({
  "../../node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});

// ../../node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "../../node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
    init_stream();
    fetchProxy = {
      name: "fetch-proxy",
      // @ts-ignore
      proxy: async (internalEvent) => {
        const { url, headers: eventHeaders, method, body } = internalEvent;
        const headers = Object.fromEntries(Object.entries(eventHeaders).filter(([key]) => key.toLowerCase() !== "cf-connecting-ip"));
        const response = await fetch(url, {
          method,
          headers,
          body
        });
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          const cur = responseHeaders[key];
          if (cur === void 0) {
            responseHeaders[key] = value;
          } else if (Array.isArray(cur)) {
            cur.push(value);
          } else {
            responseHeaders[key] = [cur, value];
          }
        });
        return {
          type: "core",
          headers: responseHeaders,
          statusCode: response.status,
          isBase64Encoded: true,
          body: response.body ?? emptyReadableStream()
        };
      }
    };
    fetch_default = fetchProxy;
  }
});

// .next/server/edge-runtime-webpack.js
var require_edge_runtime_webpack = __commonJS({
  ".next/server/edge-runtime-webpack.js"() {
    "use strict";
    (() => {
      "use strict";
      var a, b, c, d, e = {}, f = {};
      function g(a2) {
        var b2 = f[a2];
        if (void 0 !== b2) return b2.exports;
        var c2 = f[a2] = { exports: {} }, d2 = true;
        try {
          e[a2](c2, c2.exports, g), d2 = false;
        } finally {
          d2 && delete f[a2];
        }
        return c2.exports;
      }
      g.m = e, g.amdO = {}, a = [], g.O = (b2, c2, d2, e2) => {
        if (c2) {
          e2 = e2 || 0;
          for (var f2 = a.length; f2 > 0 && a[f2 - 1][2] > e2; f2--) a[f2] = a[f2 - 1];
          a[f2] = [c2, d2, e2];
          return;
        }
        for (var h = 1 / 0, f2 = 0; f2 < a.length; f2++) {
          for (var [c2, d2, e2] = a[f2], i = true, j = 0; j < c2.length; j++) (false & e2 || h >= e2) && Object.keys(g.O).every((a2) => g.O[a2](c2[j])) ? c2.splice(j--, 1) : (i = false, e2 < h && (h = e2));
          if (i) {
            a.splice(f2--, 1);
            var k = d2();
            void 0 !== k && (b2 = k);
          }
        }
        return b2;
      }, g.n = (a2) => {
        var b2 = a2 && a2.__esModule ? () => a2.default : () => a2;
        return g.d(b2, { a: b2 }), b2;
      }, g.d = (a2, b2) => {
        for (var c2 in b2) g.o(b2, c2) && !g.o(a2, c2) && Object.defineProperty(a2, c2, { enumerable: true, get: b2[c2] });
      }, g.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
          return this || Function("return this")();
        } catch (a2) {
          if ("object" == typeof window) return window;
        }
      }(), g.o = (a2, b2) => Object.prototype.hasOwnProperty.call(a2, b2), g.r = (a2) => {
        "u" > typeof Symbol && Symbol.toStringTag && Object.defineProperty(a2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(a2, "__esModule", { value: true });
      }, b = { 149: 0 }, g.O.j = (a2) => 0 === b[a2], c = (a2, c2) => {
        var d2, e2, [f2, h, i] = c2, j = 0;
        if (f2.some((a3) => 0 !== b[a3])) {
          for (d2 in h) g.o(h, d2) && (g.m[d2] = h[d2]);
          if (i) var k = i(g);
        }
        for (a2 && a2(c2); j < f2.length; j++) e2 = f2[j], g.o(b, e2) && b[e2] && b[e2][0](), b[e2] = 0;
        return g.O(k);
      }, (d = self.webpackChunk_N_E = self.webpackChunk_N_E || []).forEach(c.bind(null, 0)), d.push = c.bind(null, d.push.bind(d));
    })();
  }
});

// node-built-in-modules:node:buffer
var node_buffer_exports = {};
import * as node_buffer_star from "node:buffer";
var init_node_buffer = __esm({
  "node-built-in-modules:node:buffer"() {
    __reExport(node_buffer_exports, node_buffer_star);
  }
});

// node-built-in-modules:node:async_hooks
var node_async_hooks_exports = {};
import * as node_async_hooks_star from "node:async_hooks";
var init_node_async_hooks = __esm({
  "node-built-in-modules:node:async_hooks"() {
    __reExport(node_async_hooks_exports, node_async_hooks_star);
  }
});

// .next/server/src/middleware.js
var require_middleware = __commonJS({
  ".next/server/src/middleware.js"() {
    "use strict";
    (self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([[550], { 254: (a, b) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true }), b.default = { randomUUID: "u" > typeof crypto && crypto.randomUUID && crypto.randomUUID.bind(crypto) };
    }, 385: (a, b, c) => {
      "use strict";
      c.d(b, { Cu: () => g, RD: () => f, p$: () => e, qU: () => h, wN: () => i });
      var d = c(838);
      function e(a2) {
        let b2 = new Headers();
        for (let [c2, d2] of Object.entries(a2)) for (let a3 of Array.isArray(d2) ? d2 : [d2]) void 0 !== a3 && ("number" == typeof a3 && (a3 = a3.toString()), b2.append(c2, a3));
        return b2;
      }
      function f(a2) {
        var b2, c2, d2, e2, f2, g2 = [], h2 = 0;
        function i2() {
          for (; h2 < a2.length && /\s/.test(a2.charAt(h2)); ) h2 += 1;
          return h2 < a2.length;
        }
        for (; h2 < a2.length; ) {
          for (b2 = h2, f2 = false; i2(); ) if ("," === (c2 = a2.charAt(h2))) {
            for (d2 = h2, h2 += 1, i2(), e2 = h2; h2 < a2.length && "=" !== (c2 = a2.charAt(h2)) && ";" !== c2 && "," !== c2; ) h2 += 1;
            h2 < a2.length && "=" === a2.charAt(h2) ? (f2 = true, h2 = e2, g2.push(a2.substring(b2, d2)), b2 = h2) : h2 = d2 + 1;
          } else h2 += 1;
          (!f2 || h2 >= a2.length) && g2.push(a2.substring(b2, a2.length));
        }
        return g2;
      }
      function g(a2) {
        let b2 = {}, c2 = [];
        if (a2) for (let [d2, e2] of a2.entries()) "set-cookie" === d2.toLowerCase() ? (c2.push(...f(e2)), b2[d2] = 1 === c2.length ? c2[0] : c2) : b2[d2] = e2;
        return b2;
      }
      function h(a2) {
        try {
          return String(new URL(String(a2)));
        } catch (b2) {
          throw Object.defineProperty(Error(`URL is malformed "${String(a2)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: b2 }), "__NEXT_ERROR_CODE", { value: "E61", enumerable: false, configurable: true });
        }
      }
      function i(a2) {
        for (let b2 of [d.AA, d.h]) if (a2 !== b2 && a2.startsWith(b2)) return a2.substring(b2.length);
        return null;
      }
    }, 479: (a, b, c) => {
      "use strict";
      c.d(b, { R: () => k });
      var d = c(6221), e = c(7644), f = c(385), g = c(700);
      let h = Symbol("internal response"), i = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function j(a2, b2) {
        var c2;
        if (null == a2 || null == (c2 = a2.request) ? void 0 : c2.headers) {
          if (!(a2.request.headers instanceof Headers)) throw Object.defineProperty(Error("request.headers must be an instance of Headers"), "__NEXT_ERROR_CODE", { value: "E119", enumerable: false, configurable: true });
          let c3 = [];
          for (let [d2, e2] of a2.request.headers) b2.set("x-middleware-request-" + d2, e2), c3.push(d2);
          b2.set("x-middleware-override-headers", c3.join(","));
        }
      }
      class k extends Response {
        constructor(a2, b2 = {}) {
          super(a2, b2);
          const c2 = this.headers, i2 = new Proxy(new d.VO(c2), { get(a3, e2, f2) {
            switch (e2) {
              case "delete":
              case "set":
                return (...f3) => {
                  let g2 = Reflect.apply(a3[e2], a3, f3), h2 = new Headers(c2);
                  return g2 instanceof d.VO && c2.set("x-middleware-set-cookie", g2.getAll().map((a4) => (0, d.Ud)(a4)).join(",")), j(b2, h2), g2;
                };
              default:
                return g.l.get(a3, e2, f2);
            }
          } });
          this[h] = { cookies: i2, url: b2.url ? new e.X(b2.url, { headers: (0, f.Cu)(c2), nextConfig: b2.nextConfig }) : void 0 };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[h].cookies;
        }
        static json(a2, b2) {
          let c2 = Response.json(a2, b2);
          return new k(c2.body, c2);
        }
        static redirect(a2, b2) {
          let c2 = "number" == typeof b2 ? b2 : (null == b2 ? void 0 : b2.status) ?? 307;
          if (!i.has(c2)) throw Object.defineProperty(RangeError('Failed to execute "redirect" on "response": Invalid status code'), "__NEXT_ERROR_CODE", { value: "E529", enumerable: false, configurable: true });
          let d2 = "object" == typeof b2 ? b2 : {}, e2 = new Headers(null == d2 ? void 0 : d2.headers);
          return e2.set("Location", (0, f.qU)(a2)), new k(null, { ...d2, headers: e2, status: c2 });
        }
        static rewrite(a2, b2) {
          let c2 = new Headers(null == b2 ? void 0 : b2.headers);
          return c2.set("x-middleware-rewrite", (0, f.qU)(a2)), j(b2, c2), new k(null, { ...b2, headers: c2 });
        }
        static next(a2) {
          let b2 = new Headers(null == a2 ? void 0 : a2.headers);
          return b2.set("x-middleware-next", "1"), j(a2, b2), new k(null, { ...a2, headers: b2 });
        }
      }
    }, 512: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true }), b.updateV1State = void 0;
      let d = c(9344), e = c(4308), f = {};
      function g(a2, b2, c2) {
        return a2.msecs ??= -1 / 0, a2.nsecs ??= 0, b2 === a2.msecs ? (a2.nsecs++, a2.nsecs >= 1e4 && (a2.node = void 0, a2.nsecs = 0)) : b2 > a2.msecs ? a2.nsecs = 0 : b2 < a2.msecs && (a2.node = void 0), a2.node || (a2.node = c2.slice(10, 16), a2.node[0] |= 1, a2.clockseq = (c2[8] << 8 | c2[9]) & 16383), a2.msecs = b2, a2;
      }
      function h(a2, b2, c2, d2, e2, f2, g2 = 0) {
        if (a2.length < 16) throw Error("Random bytes length must be >= 16");
        if (f2) {
          if (g2 < 0 || g2 + 16 > f2.length) throw RangeError(`UUID byte range ${g2}:${g2 + 15} is out of buffer bounds`);
        } else f2 = new Uint8Array(16), g2 = 0;
        b2 ??= Date.now(), c2 ??= 0, d2 ??= (a2[8] << 8 | a2[9]) & 16383, e2 ??= a2.slice(10, 16);
        let i = ((268435455 & (b2 += 122192928e5)) * 1e4 + c2) % 4294967296;
        f2[g2++] = i >>> 24 & 255, f2[g2++] = i >>> 16 & 255, f2[g2++] = i >>> 8 & 255, f2[g2++] = 255 & i;
        let j = b2 / 4294967296 * 1e4 & 268435455;
        f2[g2++] = j >>> 8 & 255, f2[g2++] = 255 & j, f2[g2++] = j >>> 24 & 15 | 16, f2[g2++] = j >>> 16 & 255, f2[g2++] = d2 >>> 8 | 128, f2[g2++] = 255 & d2;
        for (let a3 = 0; a3 < 6; ++a3) f2[g2++] = e2[a3];
        return f2;
      }
      b.updateV1State = g, b.default = function(a2, b2, c2) {
        let i, j = a2?._v6 ?? false;
        if (a2) {
          let b3 = Object.keys(a2);
          1 === b3.length && "_v6" === b3[0] && (a2 = void 0);
        }
        if (a2) i = h(a2.random ?? a2.rng?.() ?? (0, d.default)(), a2.msecs, a2.nsecs, a2.clockseq, a2.node, b2, c2);
        else {
          let a3 = Date.now(), e2 = (0, d.default)();
          g(f, a3, e2), i = h(e2, f.msecs, f.nsecs, j ? void 0 : f.clockseq, j ? void 0 : f.node, b2, c2);
        }
        return b2 ?? (0, e.unsafeStringify)(i);
      };
    }, 700: (a, b, c) => {
      "use strict";
      c.d(b, { l: () => d });
      class d {
        static get(a2, b2, c2) {
          let d2 = Reflect.get(a2, b2, c2);
          return "function" == typeof d2 ? d2.bind(a2) : d2;
        }
        static set(a2, b2, c2, d2) {
          return Reflect.set(a2, b2, c2, d2);
        }
        static has(a2, b2) {
          return Reflect.has(a2, b2);
        }
        static deleteProperty(a2, b2) {
          return Reflect.deleteProperty(a2, b2);
        }
      }
    }, 794: (a, b) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true }), b.default = "00000000-0000-0000-0000-000000000000";
    }, 838: (a, b, c) => {
      "use strict";
      c.d(b, { AA: () => d, EP: () => l, RM: () => j, VC: () => m, c1: () => o, eM: () => q, gW: () => p, h: () => e, kz: () => f, mH: () => h, r4: () => g, tz: () => i, vS: () => n, x3: () => k });
      let d = "nxtP", e = "nxtI", f = "x-prerender-revalidate", g = "x-prerender-revalidate-if-generated", h = ".segments", i = ".segment.rsc", j = ".rsc", k = ".json", l = ".meta", m = "x-next-cache-tags", n = "x-next-revalidated-tags", o = "x-next-revalidate-tag-token", p = "_N_T_", q = 31536e3, r = { shared: "shared", reactServerComponents: "rsc", serverSideRendering: "ssr", actionBrowser: "action-browser", apiNode: "api-node", apiEdge: "api-edge", middleware: "middleware", instrument: "instrument", edgeAsset: "edge-asset", appPagesBrowser: "app-pages-browser", pagesDirBrowser: "pages-dir-browser", pagesDirEdge: "pages-dir-edge", pagesDirNode: "pages-dir-node" };
      ({ ...r, GROUP: { builtinReact: [r.reactServerComponents, r.actionBrowser], serverOnly: [r.reactServerComponents, r.actionBrowser, r.instrument, r.middleware], neutralTarget: [r.apiNode, r.apiEdge], clientOnly: [r.serverSideRendering, r.appPagesBrowser], bundled: [r.reactServerComponents, r.actionBrowser, r.serverSideRendering, r.appPagesBrowser, r.shared, r.instrument, r.middleware], appPages: [r.reactServerComponents, r.serverSideRendering, r.appPagesBrowser, r.actionBrowser] } });
    }, 1026: (a) => {
      (() => {
        "use strict";
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "//");
        var b, c, d, e, f = {};
        f.parse = function(a2, c2) {
          if ("string" != typeof a2) throw TypeError("argument str must be a string");
          for (var e2 = {}, f2 = a2.split(d), g = (c2 || {}).decode || b, h = 0; h < f2.length; h++) {
            var i = f2[h], j = i.indexOf("=");
            if (!(j < 0)) {
              var k = i.substr(0, j).trim(), l = i.substr(++j, i.length).trim();
              '"' == l[0] && (l = l.slice(1, -1)), void 0 == e2[k] && (e2[k] = function(a3, b2) {
                try {
                  return b2(a3);
                } catch (b3) {
                  return a3;
                }
              }(l, g));
            }
          }
          return e2;
        }, f.serialize = function(a2, b2, d2) {
          var f2 = d2 || {}, g = f2.encode || c;
          if ("function" != typeof g) throw TypeError("option encode is invalid");
          if (!e.test(a2)) throw TypeError("argument name is invalid");
          var h = g(b2);
          if (h && !e.test(h)) throw TypeError("argument val is invalid");
          var i = a2 + "=" + h;
          if (null != f2.maxAge) {
            var j = f2.maxAge - 0;
            if (isNaN(j) || !isFinite(j)) throw TypeError("option maxAge is invalid");
            i += "; Max-Age=" + Math.floor(j);
          }
          if (f2.domain) {
            if (!e.test(f2.domain)) throw TypeError("option domain is invalid");
            i += "; Domain=" + f2.domain;
          }
          if (f2.path) {
            if (!e.test(f2.path)) throw TypeError("option path is invalid");
            i += "; Path=" + f2.path;
          }
          if (f2.expires) {
            if ("function" != typeof f2.expires.toUTCString) throw TypeError("option expires is invalid");
            i += "; Expires=" + f2.expires.toUTCString();
          }
          if (f2.httpOnly && (i += "; HttpOnly"), f2.secure && (i += "; Secure"), f2.sameSite) switch ("string" == typeof f2.sameSite ? f2.sameSite.toLowerCase() : f2.sameSite) {
            case true:
            case "strict":
              i += "; SameSite=Strict";
              break;
            case "lax":
              i += "; SameSite=Lax";
              break;
            case "none":
              i += "; SameSite=None";
              break;
            default:
              throw TypeError("option sameSite is invalid");
          }
          return i;
        }, b = decodeURIComponent, c = encodeURIComponent, d = /; */, e = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/, a.exports = f;
      })();
    }, 1551: (a, b, c) => {
      "use strict";
      var d = c(7993);
      Object.defineProperty(b, "__esModule", { value: true }), b.default = void 0, b.withAuth = i;
      var e = c(2119), f = c(8479), g = d(c(5082));
      async function h(a2, b2, c2) {
        var d2, h2, i2, j, k, l, m, n, o, p, q;
        let { pathname: r, search: s, origin: t, basePath: u } = a2.nextUrl, v = null != (d2 = null == b2 || null == (h2 = b2.pages) ? void 0 : h2.signIn) ? d2 : "/api/auth/signin", w = null != (i2 = null == b2 || null == (j = b2.pages) ? void 0 : j.error) ? i2 : "/api/auth/error", x = (0, g.default)(process.env.NEXTAUTH_URL).path;
        if (`${u}${r}`.startsWith(x) || [v, w].includes(r) || ["/_next", "/favicon.ico"].some((a3) => r.startsWith(a3))) return;
        let y = null != (k = null != (l = null == b2 ? void 0 : b2.secret) ? l : process.env.NEXTAUTH_SECRET) ? k : process.env.AUTH_SECRET;
        if (!y) {
          console.error("[next-auth][error][NO_SECRET]", `
https://next-auth.js.org/errors#no_secret`);
          let a3 = new URL(`${u}${w}`, t);
          return a3.searchParams.append("error", "Configuration"), e.NextResponse.redirect(a3);
        }
        let z = await (0, f.getToken)({ req: a2, decode: null == b2 || null == (m = b2.jwt) ? void 0 : m.decode, cookieName: null == b2 || null == (n = b2.cookies) || null == (n = n.sessionToken) ? void 0 : n.name, secret: y });
        if (null != (o = await (null == b2 || null == (p = b2.callbacks) || null == (q = p.authorized) ? void 0 : q.call(p, { req: a2, token: z }))) ? o : !!z) return await (null == c2 ? void 0 : c2(z));
        let A = new URL(`${u}${v}`, t);
        return A.searchParams.append("callbackUrl", `${u}${r}${s}`), e.NextResponse.redirect(A);
      }
      function i(...a2) {
        if (!a2.length || a2[0] instanceof Request) return h(...a2);
        if ("function" == typeof a2[0]) {
          let b3 = a2[0], c2 = a2[1];
          return async (...a3) => await h(a3[0], c2, async (c3) => (a3[0].nextauth = { token: c3 }, await b3(...a3)));
        }
        let b2 = a2[0];
        return async (...a3) => await h(a3[0], b2);
      }
      b.default = i;
    }, 1587: (a, b) => {
      "use strict";
      var c = { H: null, A: null };
      function d(a2) {
        var b2 = "https://react.dev/errors/" + a2;
        if (1 < arguments.length) {
          b2 += "?args[]=" + encodeURIComponent(arguments[1]);
          for (var c2 = 2; c2 < arguments.length; c2++) b2 += "&args[]=" + encodeURIComponent(arguments[c2]);
        }
        return "Minified React error #" + a2 + "; visit " + b2 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
      }
      var e = Array.isArray;
      function f() {
      }
      var g = Symbol.for("react.transitional.element"), h = Symbol.for("react.portal"), i = Symbol.for("react.fragment"), j = Symbol.for("react.strict_mode"), k = Symbol.for("react.profiler"), l = Symbol.for("react.forward_ref"), m = Symbol.for("react.suspense"), n = Symbol.for("react.memo"), o = Symbol.for("react.lazy"), p = Symbol.for("react.activity"), q = Symbol.for("react.view_transition"), r = Symbol.iterator, s = Object.prototype.hasOwnProperty, t = Object.assign;
      function u(a2, b2, c2) {
        var d2 = c2.ref;
        return { $$typeof: g, type: a2, key: b2, ref: void 0 !== d2 ? d2 : null, props: c2 };
      }
      function v(a2) {
        return "object" == typeof a2 && null !== a2 && a2.$$typeof === g;
      }
      var w = /\/+/g;
      function x(a2, b2) {
        var c2, d2;
        return "object" == typeof a2 && null !== a2 && null != a2.key ? (c2 = "" + a2.key, d2 = { "=": "=0", ":": "=2" }, "$" + c2.replace(/[=:]/g, function(a3) {
          return d2[a3];
        })) : b2.toString(36);
      }
      function y(a2, b2, c2) {
        if (null == a2) return a2;
        var i2 = [], j2 = 0;
        return !function a3(b3, c3, i3, j3, k2) {
          var l2, m2, n2, p2 = typeof b3;
          ("undefined" === p2 || "boolean" === p2) && (b3 = null);
          var q2 = false;
          if (null === b3) q2 = true;
          else switch (p2) {
            case "bigint":
            case "string":
            case "number":
              q2 = true;
              break;
            case "object":
              switch (b3.$$typeof) {
                case g:
                case h:
                  q2 = true;
                  break;
                case o:
                  return a3((q2 = b3._init)(b3._payload), c3, i3, j3, k2);
              }
          }
          if (q2) return k2 = k2(b3), q2 = "" === j3 ? "." + x(b3, 0) : j3, e(k2) ? (i3 = "", null != q2 && (i3 = q2.replace(w, "$&/") + "/"), a3(k2, c3, i3, "", function(a4) {
            return a4;
          })) : null != k2 && (v(k2) && (l2 = k2, m2 = i3 + (null == k2.key || b3 && b3.key === k2.key ? "" : ("" + k2.key).replace(w, "$&/") + "/") + q2, k2 = u(l2.type, m2, l2.props)), c3.push(k2)), 1;
          q2 = 0;
          var s2 = "" === j3 ? "." : j3 + ":";
          if (e(b3)) for (var t2 = 0; t2 < b3.length; t2++) p2 = s2 + x(j3 = b3[t2], t2), q2 += a3(j3, c3, i3, p2, k2);
          else if ("function" == typeof (t2 = null === (n2 = b3) || "object" != typeof n2 ? null : "function" == typeof (n2 = r && n2[r] || n2["@@iterator"]) ? n2 : null)) for (b3 = t2.call(b3), t2 = 0; !(j3 = b3.next()).done; ) p2 = s2 + x(j3 = j3.value, t2++), q2 += a3(j3, c3, i3, p2, k2);
          else if ("object" === p2) {
            if ("function" == typeof b3.then) return a3(function(a4) {
              switch (a4.status) {
                case "fulfilled":
                  return a4.value;
                case "rejected":
                  throw a4.reason;
                default:
                  switch ("string" == typeof a4.status ? a4.then(f, f) : (a4.status = "pending", a4.then(function(b4) {
                    "pending" === a4.status && (a4.status = "fulfilled", a4.value = b4);
                  }, function(b4) {
                    "pending" === a4.status && (a4.status = "rejected", a4.reason = b4);
                  })), a4.status) {
                    case "fulfilled":
                      return a4.value;
                    case "rejected":
                      throw a4.reason;
                  }
              }
              throw a4;
            }(b3), c3, i3, j3, k2);
            throw Error(d(31, "[object Object]" === (c3 = String(b3)) ? "object with keys {" + Object.keys(b3).join(", ") + "}" : c3));
          }
          return q2;
        }(a2, i2, "", "", function(a3) {
          return b2.call(c2, a3, j2++);
        }), i2;
      }
      function z(a2) {
        if (-1 === a2._status) {
          var b2 = (0, a2._result)();
          b2.then(function(c2) {
            (0 === a2._status || -1 === a2._status) && (a2._status = 1, a2._result = c2, void 0 === b2.status && (b2.status = "fulfilled", b2.value = c2));
          }, function(c2) {
            (0 === a2._status || -1 === a2._status) && (a2._status = 2, a2._result = c2, void 0 === b2.status && (b2.status = "rejected", b2.reason = c2));
          }), -1 === a2._status && (a2._status = 0, a2._result = b2);
        }
        if (1 === a2._status) return a2._result.default;
        throw a2._result;
      }
      function A() {
        return /* @__PURE__ */ new WeakMap();
      }
      function B() {
        return { s: 0, v: void 0, o: null, p: null };
      }
      b.Activity = p, b.Children = { map: y, forEach: function(a2, b2, c2) {
        y(a2, function() {
          b2.apply(this, arguments);
        }, c2);
      }, count: function(a2) {
        var b2 = 0;
        return y(a2, function() {
          b2++;
        }), b2;
      }, toArray: function(a2) {
        return y(a2, function(a3) {
          return a3;
        }) || [];
      }, only: function(a2) {
        if (!v(a2)) throw Error(d(143));
        return a2;
      } }, b.Fragment = i, b.Profiler = k, b.StrictMode = j, b.Suspense = m, b.ViewTransition = q, b.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = c, b.cache = function(a2) {
        return function() {
          var b2 = c.A;
          if (!b2) return a2.apply(null, arguments);
          var d2 = b2.getCacheForType(A);
          void 0 === (b2 = d2.get(a2)) && (b2 = B(), d2.set(a2, b2)), d2 = 0;
          for (var e2 = arguments.length; d2 < e2; d2++) {
            var f2 = arguments[d2];
            if ("function" == typeof f2 || "object" == typeof f2 && null !== f2) {
              var g2 = b2.o;
              null === g2 && (b2.o = g2 = /* @__PURE__ */ new WeakMap()), void 0 === (b2 = g2.get(f2)) && (b2 = B(), g2.set(f2, b2));
            } else null === (g2 = b2.p) && (b2.p = g2 = /* @__PURE__ */ new Map()), void 0 === (b2 = g2.get(f2)) && (b2 = B(), g2.set(f2, b2));
          }
          if (1 === b2.s) return b2.v;
          if (2 === b2.s) throw b2.v;
          try {
            var h2 = a2.apply(null, arguments);
            return (d2 = b2).s = 1, d2.v = h2;
          } catch (a3) {
            throw (h2 = b2).s = 2, h2.v = a3, a3;
          }
        };
      }, b.cacheSignal = function() {
        var a2 = c.A;
        return a2 ? a2.cacheSignal() : null;
      }, b.captureOwnerStack = function() {
        return null;
      }, b.cloneElement = function(a2, b2, c2) {
        if (null == a2) throw Error(d(267, a2));
        var e2 = t({}, a2.props), f2 = a2.key;
        if (null != b2) for (g2 in void 0 !== b2.key && (f2 = "" + b2.key), b2) s.call(b2, g2) && "key" !== g2 && "__self" !== g2 && "__source" !== g2 && ("ref" !== g2 || void 0 !== b2.ref) && (e2[g2] = b2[g2]);
        var g2 = arguments.length - 2;
        if (1 === g2) e2.children = c2;
        else if (1 < g2) {
          for (var h2 = Array(g2), i2 = 0; i2 < g2; i2++) h2[i2] = arguments[i2 + 2];
          e2.children = h2;
        }
        return u(a2.type, f2, e2);
      }, b.createElement = function(a2, b2, c2) {
        var d2, e2 = {}, f2 = null;
        if (null != b2) for (d2 in void 0 !== b2.key && (f2 = "" + b2.key), b2) s.call(b2, d2) && "key" !== d2 && "__self" !== d2 && "__source" !== d2 && (e2[d2] = b2[d2]);
        var g2 = arguments.length - 2;
        if (1 === g2) e2.children = c2;
        else if (1 < g2) {
          for (var h2 = Array(g2), i2 = 0; i2 < g2; i2++) h2[i2] = arguments[i2 + 2];
          e2.children = h2;
        }
        if (a2 && a2.defaultProps) for (d2 in g2 = a2.defaultProps) void 0 === e2[d2] && (e2[d2] = g2[d2]);
        return u(a2, f2, e2);
      }, b.createRef = function() {
        return { current: null };
      }, b.forwardRef = function(a2) {
        return { $$typeof: l, render: a2 };
      }, b.isValidElement = v, b.lazy = function(a2) {
        return { $$typeof: o, _payload: { _status: -1, _result: a2 }, _init: z };
      }, b.memo = function(a2, b2) {
        return { $$typeof: n, type: a2, compare: void 0 === b2 ? null : b2 };
      }, b.use = function(a2) {
        return c.H.use(a2);
      }, b.useCallback = function(a2, b2) {
        return c.H.useCallback(a2, b2);
      }, b.useDebugValue = function() {
      }, b.useId = function() {
        return c.H.useId();
      }, b.useMemo = function(a2, b2) {
        return c.H.useMemo(a2, b2);
      }, b.version = "19.3.0-canary-cbb046ab-20260731";
    }, 1775: (a, b, c) => {
      "use strict";
      c.d(b, { Kr: () => f, M1: () => e, FP: () => d });
      let d = (0, c(7925).xl)();
      function e(a2) {
        throw Object.defineProperty(Error(`\`${a2}\` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`), "__NEXT_ERROR_CODE", { value: "E251", enumerable: false, configurable: true });
      }
      function f(a2) {
        switch (a2.type) {
          case "request":
          case "prerender":
          case "prerender-runtime":
          case "prerender-client":
          case "validation-client":
          case "prerender-ppr":
            return a2.resumeDataCache;
          case "cache":
          case "private-cache":
          case "unstable-cache":
          case "prerender-legacy":
          case "generate-static-params":
            return null;
          default:
            return a2;
        }
      }
    }, 1909: (a, b, c) => {
      "use strict";
      let d, e, f;
      c.r(b), c.d(b, { default: () => f0, handler: () => f_ });
      var g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v = {};
      async function w() {
        return "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && await _ENTRIES.middleware_instrumentation;
      }
      c.r(v), c.d(v, { config: () => fV, default: () => fU });
      let x = null;
      async function y() {
        if ("phase-production-build" === process.env.NEXT_PHASE) return;
        x || (x = w());
        let a10 = await x;
        if (null == a10 ? void 0 : a10.register) try {
          await a10.register();
        } catch (a11) {
          throw a11.message = `An error occurred while loading instrumentation hook: ${a11.message}`, a11;
        }
      }
      async function z(...a10) {
        let b10 = await w();
        try {
          var c10;
          await (null == b10 || null == (c10 = b10.onRequestError) ? void 0 : c10.call(b10, ...a10));
        } catch (a11) {
          console.error("Error in instrumentation.onRequestError:", a11);
        }
      }
      let A = null;
      function B() {
        return A || (A = y()), A;
      }
      function C(a10) {
        return `The edge runtime does not support Node.js '${a10}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      process !== c.g.process && (process.env = c.g.process.env, c.g.process = process);
      try {
        Object.defineProperty(globalThis, "__import_unsupported", { value: function(a10) {
          let b10 = new Proxy(function() {
          }, { get(b11, c10) {
            if ("then" === c10) return {};
            throw Object.defineProperty(Error(C(a10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, construct() {
            throw Object.defineProperty(Error(C(a10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, apply(c10, d10, e10) {
            if ("function" == typeof e10[0]) return e10[0](b10);
            throw Object.defineProperty(Error(C(a10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          } });
          return new Proxy({}, { get: () => b10 });
        }, enumerable: false, configurable: false });
      } catch {
      }
      B();
      var D = c(6664), E = c(385);
      let F = Symbol("response"), G = Symbol("passThrough"), H = Symbol("waitUntil");
      class I {
        constructor(a10, b10) {
          this[G] = false, this[H] = b10 ? { kind: "external", function: b10 } : { kind: "internal", promises: [] };
        }
        respondWith(a10) {
          this[F] || (this[F] = Promise.resolve(a10));
        }
        passThroughOnException() {
          this[G] = true;
        }
        waitUntil(a10) {
          if ("external" === this[H].kind) return (0, this[H].function)(a10);
          this[H].promises.push(a10);
        }
      }
      class J extends I {
        constructor(a10) {
          var b10;
          super(a10.request, null == (b10 = a10.context) ? void 0 : b10.waitUntil), this.sourcePage = a10.page;
        }
        get request() {
          throw Object.defineProperty(new D.CB({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new D.CB({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      var K = c(9531), L = c(479);
      function M(a10, b10) {
        let c10 = "string" == typeof b10 ? new URL(b10) : b10, d10 = new URL(a10, b10), e10 = d10.origin === c10.origin;
        return { url: e10 ? d10.toString().slice(c10.origin.length) : d10.toString(), isRelative: e10 };
      }
      var N = c(7644);
      let O = "next-router-prefetch", P = ["rsc", "next-router-state-tree", O, "next-hmr-refresh", "next-router-segment-prefetch"], Q = "_rsc";
      function R(a10) {
        return a10.startsWith("/") ? a10 : `/${a10}`;
      }
      function S(a10) {
        return R(a10.split("/").reduce((a11, b10, c10, d10) => b10 ? "(" === b10[0] && b10.endsWith(")") || "@" === b10[0] || ("page" === b10 || "route" === b10) && c10 === d10.length - 1 ? a11 : `${a11}/${b10}` : a11, ""));
      }
      var T = c(700);
      class U extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers"), Object.defineProperty(this, "__NEXT_ERROR_CODE", { value: "E1176", enumerable: false, configurable: true });
        }
        static callable() {
          throw new U();
        }
      }
      class V extends Headers {
        constructor(a10) {
          super(), this.headers = new Proxy(a10, { get(b10, c10, d10) {
            if ("symbol" == typeof c10) return T.l.get(b10, c10, d10);
            let e10 = c10.toLowerCase(), f2 = Object.keys(a10).find((a11) => a11.toLowerCase() === e10);
            if (void 0 !== f2) return T.l.get(b10, f2, d10);
          }, set(b10, c10, d10, e10) {
            if ("symbol" == typeof c10) return T.l.set(b10, c10, d10, e10);
            let f2 = c10.toLowerCase(), g2 = Object.keys(a10).find((a11) => a11.toLowerCase() === f2);
            return T.l.set(b10, g2 ?? c10, d10, e10);
          }, has(b10, c10) {
            if ("symbol" == typeof c10) return T.l.has(b10, c10);
            let d10 = c10.toLowerCase(), e10 = Object.keys(a10).find((a11) => a11.toLowerCase() === d10);
            return void 0 !== e10 && T.l.has(b10, e10);
          }, deleteProperty(b10, c10) {
            if ("symbol" == typeof c10) return T.l.deleteProperty(b10, c10);
            let d10 = c10.toLowerCase(), e10 = Object.keys(a10).find((a11) => a11.toLowerCase() === d10);
            return void 0 === e10 || T.l.deleteProperty(b10, e10);
          } });
        }
        static seal(a10) {
          return new Proxy(a10, { get(a11, b10, c10) {
            switch (b10) {
              case "append":
              case "delete":
              case "set":
                return U.callable;
              default:
                return T.l.get(a11, b10, c10);
            }
          } });
        }
        static fresh(a10) {
          return new Proxy(a10, { get: (a11, b10, c10) => T.l.get(a11, b10, c10) });
        }
        merge(a10) {
          return Array.isArray(a10) ? a10.join(", ") : a10;
        }
        static from(a10) {
          return a10 instanceof Headers ? a10 : new V(a10);
        }
        append(a10, b10) {
          let c10 = this.headers[a10];
          "string" == typeof c10 ? this.headers[a10] = [c10, b10] : Array.isArray(c10) ? c10.push(b10) : this.headers[a10] = b10;
        }
        delete(a10) {
          delete this.headers[a10];
        }
        get(a10) {
          let b10 = this.headers[a10];
          return void 0 !== b10 ? this.merge(b10) : null;
        }
        has(a10) {
          return void 0 !== this.headers[a10];
        }
        set(a10, b10) {
          this.headers[a10] = b10;
        }
        forEach(a10, b10) {
          for (let [c10, d10] of this.entries()) a10.call(b10, d10, c10, this);
        }
        *entries() {
          for (let a10 of Object.keys(this.headers)) {
            let b10 = a10.toLowerCase(), c10 = this.get(b10);
            yield [b10, c10];
          }
        }
        *keys() {
          for (let a10 of Object.keys(this.headers)) {
            let b10 = a10.toLowerCase();
            yield b10;
          }
        }
        *values() {
          for (let a10 of Object.keys(this.headers)) {
            let b10 = this.get(a10);
            yield b10;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
      var W = c(6221), X = c(7021);
      class Y extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options"), Object.defineProperty(this, "__NEXT_ERROR_CODE", { value: "E1180", enumerable: false, configurable: true });
        }
        static callable() {
          throw new Y();
        }
      }
      class Z {
        static seal(a10) {
          return new Proxy(a10, { get(a11, b10, c10) {
            switch (b10) {
              case "clear":
              case "delete":
              case "set":
                return Y.callable;
              default:
                return T.l.get(a11, b10, c10);
            }
          } });
        }
        static fresh(a10) {
          return new Proxy(a10, { get: (a11, b10, c10) => T.l.get(a11, b10, c10) });
        }
      }
      let $ = Symbol.for("next.mutated.cookies");
      class _ {
        static wrap(a10, b10) {
          let c10 = new W.VO(new Headers());
          for (let b11 of a10.getAll()) c10.set(b11);
          let d10 = [], e10 = /* @__PURE__ */ new Set(), f2 = () => {
            let a11 = X.J.getStore();
            if (a11 && (a11.pathWasRevalidated = 1), d10 = c10.getAll().filter((a12) => e10.has(a12.name)), b10) {
              let a12 = [];
              for (let b11 of d10) {
                let c11 = new W.VO(new Headers());
                c11.set(b11), a12.push(c11.toString());
              }
              b10(a12);
            }
          }, g2 = new Proxy(c10, { get(a11, b11, c11) {
            switch (b11) {
              case $:
                return d10;
              case "delete":
                return function(...b12) {
                  e10.add("string" == typeof b12[0] ? b12[0] : b12[0].name);
                  try {
                    return a11.delete(...b12), g2;
                  } finally {
                    f2();
                  }
                };
              case "set":
                return function(...b12) {
                  e10.add("string" == typeof b12[0] ? b12[0] : b12[0].name);
                  try {
                    return a11.set(...b12), g2;
                  } finally {
                    f2();
                  }
                };
              default:
                return T.l.get(a11, b11, c11);
            }
          } });
          return g2;
        }
      }
      function aa(a10, b10) {
        if ("action" !== a10.phase) throw new Y();
      }
      var ab = c(838), ac = ((g = ac || {}).handleRequest = "BaseServer.handleRequest", g.run = "BaseServer.run", g.pipe = "BaseServer.pipe", g.getStaticHTML = "BaseServer.getStaticHTML", g.render = "BaseServer.render", g.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", g.renderToResponse = "BaseServer.renderToResponse", g.renderToHTML = "BaseServer.renderToHTML", g.renderError = "BaseServer.renderError", g.renderErrorToResponse = "BaseServer.renderErrorToResponse", g.renderErrorToHTML = "BaseServer.renderErrorToHTML", g.render404 = "BaseServer.render404", g), ad = ((h = ad || {}).loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", h.loadComponents = "LoadComponents.loadComponents", h), ae = ((i = ae || {}).getRequestHandler = "NextServer.getRequestHandler", i.getRequestHandlerWithMetadata = "NextServer.getRequestHandlerWithMetadata", i.getServer = "NextServer.getServer", i.getServerRequestHandler = "NextServer.getServerRequestHandler", i.createServer = "createServer.createServer", i), af = ((j = af || {}).compression = "NextNodeServer.compression", j.getBuildId = "NextNodeServer.getBuildId", j.createComponentTree = "NextNodeServer.createComponentTree", j.clientComponentLoading = "NextNodeServer.clientComponentLoading", j.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", j.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", j.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", j.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", j.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", j.sendRenderResult = "NextNodeServer.sendRenderResult", j.proxyRequest = "NextNodeServer.proxyRequest", j.runApi = "NextNodeServer.runApi", j.render = "NextNodeServer.render", j.renderHTML = "NextNodeServer.renderHTML", j.imageOptimizer = "NextNodeServer.imageOptimizer", j.getPagePath = "NextNodeServer.getPagePath", j.getRoutesManifest = "NextNodeServer.getRoutesManifest", j.findPageComponents = "NextNodeServer.findPageComponents", j.getFontManifest = "NextNodeServer.getFontManifest", j.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", j.getRequestHandler = "NextNodeServer.getRequestHandler", j.renderToHTML = "NextNodeServer.renderToHTML", j.renderError = "NextNodeServer.renderError", j.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", j.render404 = "NextNodeServer.render404", j.startResponse = "NextNodeServer.startResponse", j.route = "route", j.onProxyReq = "onProxyReq", j.apiResolver = "apiResolver", j.internalFetch = "internalFetch", j), ag = ((k = ag || {}).startServer = "startServer.startServer", k), ah = ((l = ah || {}).getServerSideProps = "Render.getServerSideProps", l.getStaticProps = "Render.getStaticProps", l.renderToString = "Render.renderToString", l.renderDocument = "Render.renderDocument", l.createBodyResult = "Render.createBodyResult", l), ai = ((m = ai || {}).renderToString = "AppRender.renderToString", m.renderToReadableStream = "AppRender.renderToReadableStream", m.getBodyResult = "AppRender.getBodyResult", m.fetch = "AppRender.fetch", m.waitShellReady = "AppRender.waitShellReady", m.renderToNodeFizzStream = "AppRender.renderToNodeFizzStream", m.instantInsights = "AppRender.instantInsights", m.instantInsightsPrepareValidation = "AppRender.instantInsights.prepareValidation", m.instantInsightsRunValidation = "AppRender.instantInsights.runValidation", m), aj = ((n = aj || {}).executeRoute = "Router.executeRoute", n), ak = ((o = ak || {}).runHandler = "Node.runHandler", o), al = ((p = al || {}).runHandler = "AppRouteRouteHandlers.runHandler", p), am = ((q = am || {}).generateMetadata = "ResolveMetadata.generateMetadata", q.generateViewport = "ResolveMetadata.generateViewport", q), an = ((r = an || {}).execute = "Middleware.execute", r);
      let ao = /* @__PURE__ */ new Set(["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"]), ap = /* @__PURE__ */ new Set(["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"]);
      function aq(a10) {
        return null !== a10 && "object" == typeof a10 && "then" in a10 && "function" == typeof a10.then;
      }
      let ar = process.env.NEXT_OTEL_PERFORMANCE_PREFIX;
      function as() {
      }
      Symbol.for("@next/local-span-recorder");
      let { context: at, propagation: au, trace: av, SpanStatusCode: aw, SpanKind: ax, ROOT_CONTEXT: ay } = d = c(6076);
      class az extends Error {
        constructor(a10, b10) {
          super(), this.bubble = a10, this.result = b10;
        }
      }
      let aA = (a10, b10) => {
        "object" == typeof b10 && null !== b10 && b10 instanceof az && b10.bubble ? a10.setAttribute("next.bubble", true) : (b10 && (a10.recordException(b10), a10.setAttribute("error.type", b10.name)), a10.setStatus({ code: aw.ERROR, message: null == b10 ? void 0 : b10.message })), a10.end();
      }, aB = /* @__PURE__ */ new Map(), aC = d.createContextKey("next.rootSpanId"), aD = 0, aE = { set(a10, b10, c10) {
        a10.push({ key: b10, value: c10 });
      } };
      class aF {
        getTracerInstance() {
          return av.getTracer("next.js", "0.0.1");
        }
        isOpenTelemetryEnabled() {
          var a10, b10;
          let c10 = av.getSpan(at.active());
          if (null == c10 ? void 0 : c10.isRecording()) return true;
          let d10 = av.getTracerProvider();
          return !("getDelegate" in d10) || (null == d10.getDelegate || null == (b10 = d10.getDelegate.call(d10)) || null == (a10 = b10.constructor) ? void 0 : a10.name) !== "NoopTracerProvider";
        }
        getContext() {
          return at;
        }
        getTracePropagationData() {
          let a10 = at.active(), b10 = [];
          return au.inject(a10, b10, aE), b10;
        }
        getActiveScopeSpan() {
          let a10 = as(), b10 = null == a10 ? void 0 : a10.getActiveLocalSpan();
          return b10 && (null == a10 ? void 0 : a10.isOpenTelemetryIsolatedSpan(b10)) ? b10 : av.getSpan(at.active());
        }
        runWithDetachedContext(a10) {
          return ar || this.isOpenTelemetryEnabled() ? at.with(ay, a10) : a10();
        }
        withPropagatedContext(a10, b10, c10, d10 = false) {
          let e10 = at.active();
          if (!ar && !this.isOpenTelemetryEnabled() && !av.getSpanContext(e10)) return b10();
          if (d10) {
            let d11 = au.extract(ay, a10, c10);
            if (av.getSpanContext(d11)) return at.with(d11, b10);
            let f3 = au.extract(e10, a10, c10);
            return at.with(f3, b10);
          }
          if (av.getSpanContext(e10)) return b10();
          let f2 = au.extract(e10, a10, c10);
          return at.with(f2, b10);
        }
        trace(...a10) {
          let [b10, c10, d10] = a10, e10 = !!ar || this.isOpenTelemetryEnabled(), f2 = as(), g2 = (null == f2 ? void 0 : f2.isLocalSpanRecordingEnabled()) ?? false;
          if (!e10 && !g2) return "function" == typeof c10 ? c10() : d10();
          let { fn: h2, options: i2 } = "function" == typeof c10 ? { fn: c10, options: {} } : { fn: d10, options: { ...c10 } }, j2 = i2.spanName ?? b10, k2 = i2.parentSpan ?? this.getActiveScopeSpan(), l2 = k2 && (null == f2 ? void 0 : f2.isOpenTelemetryIsolatedSpan(k2)) ? k2 : void 0, m2 = !l2 && (ao.has(b10) || "1" === process.env.NEXT_OTEL_VERBOSE);
          if (!(m2 || (null == f2 ? void 0 : f2.isRequestInsightsEnabled())) || i2.hideSpan) return h2();
          let n2 = l2 ? at.active() : this.getSpanContext(k2);
          n2 || (n2 = (null == at ? void 0 : at.active()) ?? ay);
          let o2 = n2.getValue(aC), p2 = "number" != typeof o2 || !aB.has(o2), q2 = aD++;
          return i2.attributes = { "next.span_category": "nextjs", "next.span_name": j2, "next.span_type": b10, ...i2.attributes }, at.with(n2.setValue(aC, q2), () => this.runWithActiveSpan(j2, i2, n2, e10 && m2, g2, l2, (a11) => {
            let c11;
            ar && b10 && ap.has(b10) && (c11 = "performance" in globalThis && "measure" in performance ? globalThis.performance.now() : void 0);
            let d11 = false, e11 = () => {
              !d11 && (d11 = true, aB.delete(q2), c11 && performance.measure(`${ar}:next-${(b10.split(".").pop() || "").replace(/[A-Z]/g, (a12) => "-" + a12.toLowerCase())}`, { start: c11, end: performance.now() }));
            };
            if (p2 && aB.set(q2, new Map(Object.entries(i2.attributes ?? {}))), h2.length > 1) try {
              return h2(a11, (b11) => {
                b11 ? aA(a11, b11) : a11.end();
              });
            } catch (b11) {
              throw aA(a11, b11), b11;
            } finally {
              e11();
            }
            try {
              let b11 = h2(a11);
              if (aq(b11)) return b11.then((b12) => (a11.end(), b12)).catch((b12) => {
                throw aA(a11, b12), b12;
              }).finally(e11);
              return a11.end(), e11(), b11;
            } catch (b11) {
              throw aA(a11, b11), e11(), b11;
            }
          }));
        }
        runWithActiveSpan(a10, b10, c10, d10, e10, f2, g2) {
          if (d10) return this.getTracerInstance().startActiveSpan(a10, b10, (d11) => g2(e10 ? this.createLocalRecordingSpan(a10, b10, c10, d11, f2) : d11));
          let h2 = this.createLocalRecordingSpan(a10, b10, c10, void 0, f2), i2 = as();
          return i2.withLocalSpan(h2, () => i2.isOpenTelemetryIsolatedSpan(h2) ? g2(h2) : at.with(av.setSpan(at.active(), h2), g2, void 0, h2));
        }
        createLocalRecordingSpan(a10, b10, c10, d10, e10) {
          let f2 = (null == e10 ? void 0 : e10.spanContext()) ?? av.getSpanContext(c10), g2 = null == d10 ? void 0 : d10.spanContext();
          return as().createLocalSpan({ name: a10, attributes: b10.attributes, links: b10.links, startTime: b10.startTime, delegateSpan: d10, traceId: (null == g2 ? void 0 : g2.traceId) ?? (null == f2 ? void 0 : f2.traceId), spanId: null == g2 ? void 0 : g2.spanId, parentSpanId: null == f2 ? void 0 : f2.spanId, isolateOpenTelemetry: void 0 !== e10 });
        }
        wrap(...a10) {
          let b10 = this, [c10, d10, e10] = 3 === a10.length ? a10 : [a10[0], {}, a10[1]];
          return ao.has(c10) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let a11 = d10;
            "function" == typeof a11 && "function" == typeof e10 && (a11 = a11.apply(this, arguments));
            let f2 = arguments.length - 1, g2 = arguments[f2];
            if ("function" != typeof g2) return b10.trace(c10, a11, () => e10.apply(this, arguments));
            {
              let d11 = b10.getContext().bind(at.active(), g2);
              return b10.trace(c10, a11, (a12, b11) => (arguments[f2] = function(a13) {
                return null == b11 || b11(a13), d11.apply(this, arguments);
              }, e10.apply(this, arguments)));
            }
          } : e10;
        }
        startSpan(...a10) {
          let [b10, c10] = a10, d10 = c10 ? { ...c10, attributes: { "next.span_category": "nextjs", ...c10.attributes } } : { attributes: { "next.span_category": "nextjs" } }, e10 = as(), f2 = d10.parentSpan ?? this.getActiveScopeSpan(), g2 = f2 && (null == e10 ? void 0 : e10.isOpenTelemetryIsolatedSpan(f2)) ? f2 : void 0, h2 = (g2 ? void 0 : this.getSpanContext(f2)) ?? at.active();
          if (!(null == e10 ? void 0 : e10.isLocalSpanRecordingEnabled())) return this.getTracerInstance().startSpan(b10, d10, h2);
          let i2 = !g2 && this.isOpenTelemetryEnabled() ? this.getTracerInstance().startSpan(b10, d10, h2) : void 0;
          return this.createLocalRecordingSpan(b10, d10, h2, i2, g2);
        }
        getSpanContext(a10) {
          return a10 ? av.setSpan(at.active(), a10) : void 0;
        }
        getRootSpanAttributes() {
          let a10 = at.active().getValue(aC);
          return aB.get(a10);
        }
        setRootSpanAttribute(a10, b10) {
          let c10 = at.active().getValue(aC), d10 = aB.get(c10);
          d10 && !d10.has(a10) && d10.set(a10, b10);
        }
        withSpan(a10, b10) {
          let c10 = as();
          return (null == c10 ? void 0 : c10.isLocalRecordingSpan(a10)) ? c10.withLocalSpan(a10, () => c10.isOpenTelemetryIsolatedSpan(a10) ? b10() : at.with(av.setSpan(at.active(), a10), b10)) : at.with(av.setSpan(at.active(), a10), b10);
        }
      }
      let aG = (f = new aF(), () => f), aH = "__prerender_bypass";
      Symbol("__next_preview_data"), Symbol(aH);
      class aI {
        constructor(a10, b10, c10, d10) {
          var e10;
          const f2 = a10 && function(a11, b11) {
            if ("function" == typeof a11.get) {
              let c11 = V.from(a11);
              return { isOnDemandRevalidate: c11.get(ab.kz) === b11.previewModeId, revalidateOnlyGenerated: c11.has(ab.r4) };
            }
            return { isOnDemandRevalidate: a11[ab.kz] === b11.previewModeId, revalidateOnlyGenerated: a11.hasOwnProperty(ab.r4) };
          }(b10, a10).isOnDemandRevalidate, g2 = null == (e10 = c10.get(aH)) ? void 0 : e10.value;
          this._isEnabled = !!(!f2 && g2 && a10 && g2 === a10.previewModeId), this._previewModeId = null == a10 ? void 0 : a10.previewModeId, this._mutableCookies = d10;
        }
        get isEnabled() {
          return this._isEnabled;
        }
        enable() {
          if (!this._previewModeId) throw Object.defineProperty(Error("Invariant: previewProps missing previewModeId this should never happen"), "__NEXT_ERROR_CODE", { value: "E93", enumerable: false, configurable: true });
          this._mutableCookies.set({ name: aH, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" }), this._isEnabled = true;
        }
        disable() {
          this._mutableCookies.set({ name: aH, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) }), this._isEnabled = false;
        }
      }
      function aJ(a10, b10) {
        if ("x-middleware-set-cookie" in a10 && "string" == typeof a10["x-middleware-set-cookie"]) {
          let c10 = a10["x-middleware-set-cookie"], d10 = new Headers();
          for (let a11 of (0, E.RD)(c10)) d10.append("set-cookie", a11);
          for (let a11 of new W.VO(d10).getAll()) b10.set(a11);
        }
      }
      var aK = c(1775), aL = c(8850), aM = c.n(aL), aN = c(6506);
      class aO {
        constructor(a10, b10, c10) {
          this.prev = null, this.next = null, this.key = a10, this.data = b10, this.size = c10;
        }
      }
      class aP {
        constructor() {
          this.prev = null, this.next = null;
        }
      }
      class aQ {
        constructor(a10, b10, c10) {
          this.cache = /* @__PURE__ */ new Map(), this.totalSize = 0, this.maxSize = a10, this.calculateSize = b10, this.onEvict = c10, this.head = new aP(), this.tail = new aP(), this.head.next = this.tail, this.tail.prev = this.head;
        }
        addToHead(a10) {
          a10.prev = this.head, a10.next = this.head.next, this.head.next.prev = a10, this.head.next = a10;
        }
        removeNode(a10) {
          a10.prev.next = a10.next, a10.next.prev = a10.prev;
        }
        moveToHead(a10) {
          this.removeNode(a10), this.addToHead(a10);
        }
        removeTail() {
          let a10 = this.tail.prev;
          return this.removeNode(a10), a10;
        }
        set(a10, b10) {
          let c10 = (null == this.calculateSize ? void 0 : this.calculateSize.call(this, b10, a10)) ?? 1;
          if (c10 <= 0) throw Object.defineProperty(Error(`LRUCache: calculateSize returned ${c10}, but size must be > 0. Items with size 0 would never be evicted, causing unbounded cache growth.`), "__NEXT_ERROR_CODE", { value: "E1045", enumerable: false, configurable: true });
          if (c10 > this.maxSize) return console.warn("Single item size exceeds maxSize"), false;
          let d10 = this.cache.get(a10);
          if (d10) d10.data = b10, this.totalSize = this.totalSize - d10.size + c10, d10.size = c10, this.moveToHead(d10);
          else {
            let d11 = new aO(a10, b10, c10);
            this.cache.set(a10, d11), this.addToHead(d11), this.totalSize += c10;
          }
          for (; this.totalSize > this.maxSize && this.cache.size > 0; ) {
            let a11 = this.removeTail();
            this.cache.delete(a11.key), this.totalSize -= a11.size, null == this.onEvict || this.onEvict.call(this, a11.key, a11.data);
          }
          return true;
        }
        has(a10) {
          return this.cache.has(a10);
        }
        get(a10) {
          let b10 = this.cache.get(a10);
          if (b10) return this.moveToHead(b10), b10.data;
        }
        *[Symbol.iterator]() {
          let a10 = this.head.next;
          for (; a10 && a10 !== this.tail; ) {
            let b10 = a10;
            yield [b10.key, b10.data], a10 = a10.next;
          }
        }
        remove(a10) {
          let b10 = this.cache.get(a10);
          b10 && (this.removeNode(b10), this.cache.delete(a10), this.totalSize -= b10.size);
        }
        get size() {
          return this.cache.size;
        }
        get currentSize() {
          return this.totalSize;
        }
      }
      let aR = /* @__PURE__ */ new Map(), aS = (a10, b10) => {
        for (let c10 of a10) {
          let a11 = aR.get(c10), d10 = null == a11 ? void 0 : a11.expired;
          if ("number" == typeof d10 && d10 <= performance.timeOrigin + performance.now() && d10 > b10) return true;
        }
        return false;
      }, aT = (a10, b10) => {
        for (let c10 of a10) {
          let a11 = aR.get(c10), d10 = (null == a11 ? void 0 : a11.stale) ?? 0;
          if ("number" == typeof d10 && d10 > b10) return true;
        }
        return false;
      };
      c(5356).Buffer, process.env.NEXT_PRIVATE_DEBUG_CACHE, Symbol.for("@next/cache-handlers");
      let aU = Symbol.for("@next/cache-handlers-map"), aV = Symbol.for("@next/cache-handlers-set");
      Symbol.for("@next/cache-handlers-private"), Symbol.for("@next/cache-handlers-dev-fronts"), Symbol.for("@next/cache-handlers-dev-tiered"), Symbol.for("@next/cache-handlers-memory-disabled");
      let aW = globalThis;
      function aX() {
        let a10 = aW[aU];
        if (a10) return a10.entries();
      }
      async function aY(a10, b10) {
        if (!a10) return b10();
        let c10 = aZ(a10);
        try {
          return await b10();
        } finally {
          var d10, e10, f2, g2;
          let b11, h2, i2, j2, k2 = (d10 = c10, e10 = aZ(a10), b11 = new Set(d10.pendingRevalidatedTags.map((a11) => {
            let b12 = "object" == typeof a11.profile ? JSON.stringify(a11.profile) : a11.profile || "";
            return `${a11.tag}:${b12}`;
          })), h2 = new Set(d10.pendingRevalidateWrites), { pendingRevalidatedTags: e10.pendingRevalidatedTags.filter((a11) => {
            let c11 = "object" == typeof a11.profile ? JSON.stringify(a11.profile) : a11.profile || "";
            return !b11.has(`${a11.tag}:${c11}`);
          }), pendingRevalidates: Object.fromEntries(Object.entries(e10.pendingRevalidates).filter(([a11]) => !(a11 in d10.pendingRevalidates))), pendingRevalidateWrites: e10.pendingRevalidateWrites.filter((a11) => !h2.has(a11)) });
          await (f2 = a10, i2 = [], (j2 = (null == (g2 = k2) ? void 0 : g2.pendingRevalidatedTags) ?? f2.pendingRevalidatedTags ?? []).length > 0 && i2.push(a$(j2, f2.incrementalCache, f2)), i2.push(...Object.values((null == g2 ? void 0 : g2.pendingRevalidates) ?? f2.pendingRevalidates ?? {})), i2.push(...(null == g2 ? void 0 : g2.pendingRevalidateWrites) ?? f2.pendingRevalidateWrites ?? []), 0 !== i2.length && Promise.all(i2).then(() => void 0));
        }
      }
      function aZ(a10) {
        return { pendingRevalidatedTags: a10.pendingRevalidatedTags ? [...a10.pendingRevalidatedTags] : [], pendingRevalidates: { ...a10.pendingRevalidates }, pendingRevalidateWrites: a10.pendingRevalidateWrites ? [...a10.pendingRevalidateWrites] : [] };
      }
      async function a$(a10, b10, c10) {
        if (0 === a10.length) return;
        let d10 = function() {
          let a11 = aW[aV];
          if (a11) return a11.values();
        }(), e10 = [], f2 = /* @__PURE__ */ new Map();
        for (let b11 of a10) {
          let a11, c11 = b11.profile;
          for (let [b12] of f2) if ("string" == typeof b12 && "string" == typeof c11 && b12 === c11 || "object" == typeof b12 && "object" == typeof c11 && JSON.stringify(b12) === JSON.stringify(c11) || b12 === c11) {
            a11 = b12;
            break;
          }
          let d11 = a11 || c11;
          f2.has(d11) || f2.set(d11, []), f2.get(d11).push(b11.tag);
        }
        for (let [a11, g2] of f2) {
          let f3;
          if (a11) {
            let b11;
            if ("object" == typeof a11) b11 = a11;
            else if ("string" == typeof a11 && !(b11 = null == c10 ? void 0 : c10.cacheLifeProfiles[a11])) throw Object.defineProperty(Error(`Invalid profile provided "${a11}" must be configured under cacheLife in next.config or be "max"`), "__NEXT_ERROR_CODE", { value: "E873", enumerable: false, configurable: true });
            b11 && (f3 = { expire: b11.expire });
          }
          for (let b11 of d10 || []) a11 ? e10.push(null == b11.updateTags ? void 0 : b11.updateTags.call(b11, g2, f3)) : e10.push(null == b11.updateTags ? void 0 : b11.updateTags.call(b11, g2));
          b10 && e10.push(b10.revalidateTag(g2, f3));
        }
        await Promise.all(e10);
      }
      var a_ = c(7788), a0 = c(4796);
      class a1 {
        constructor({ waitUntil: a10, onClose: b10, onTaskError: c10 }) {
          this.isRequestClosed = false, this.initialOnCloseError = null, this.workUnitStores = /* @__PURE__ */ new Set(), this.waitUntil = a10, this.onClose = b10, this.onTaskError = c10, this.callbackQueue = new (aM())(), this.callbackQueue.pause();
          try {
            b10(() => {
              for (let a11 of (this.isRequestClosed = true, this.workUnitStores)) a11.phase = "after";
            });
          } catch (a11) {
            this.initialOnCloseError = { error: a11 };
          }
        }
        after(a10, b10) {
          if (this.initialOnCloseError) throw Object.defineProperty(new aN.z("An onClose call failed, which means after() can't work correctly.", { cause: this.initialOnCloseError.error }), "__NEXT_ERROR_CODE", { value: "E1376", enumerable: false, configurable: true });
          if (this.workUnitStores.add(b10), aq(a10)) this.addThenable(a10);
          else if ("function" == typeof a10) this.addCallback(a10, b10);
          else throw Object.defineProperty(Error("`after()`: Argument must be a promise or a function"), "__NEXT_ERROR_CODE", { value: "E50", enumerable: false, configurable: true });
        }
        addThenable(a10) {
          this.waitUntil || a2(), this.waitUntil(new Promise((b10) => {
            a10.then(() => {
              b10();
            }, (a11) => {
              b10(), this.reportTaskError("promise", a11);
            });
          }));
        }
        addCallback(a10, b10) {
          this.waitUntil || a2();
          let c10 = a0.Z.getStore(), d10 = c10 ? c10.rootTaskSpawnPhase : b10.phase;
          this.runCallbacksOnClosePromise || (this.runCallbacksOnClosePromise = this.runCallbacksOnClose(), this.waitUntil(this.runCallbacksOnClosePromise));
          let e10 = (0, a_.cg)(async () => {
            try {
              await a0.Z.run({ rootTaskSpawnPhase: d10 }, () => a10());
            } catch (a11) {
              this.reportTaskError("function", a11);
            }
          });
          this.callbackQueue.add(e10);
        }
        async runCallbacksOnClose() {
          return this.isRequestClosed ? await new Promise((a10) => {
            setTimeout(a10, 0);
          }) : await new Promise((a10) => this.onClose(a10)), this.runCallbacks();
        }
        async runCallbacks() {
          if (0 === this.callbackQueue.size) return;
          let a10 = X.J.getStore();
          if (!a10) throw Object.defineProperty(new aN.z("Missing workStore in AfterContext.runCallbacks"), "__NEXT_ERROR_CODE", { value: "E547", enumerable: false, configurable: true });
          return aY(a10, () => (this.callbackQueue.start(), this.callbackQueue.onIdle()));
        }
        reportTaskError(a10, b10) {
          if (console.error("promise" === a10 ? "A promise passed to `after()` rejected:" : "An error occurred in a function passed to `after()`:", b10), this.onTaskError) try {
            null == this.onTaskError || this.onTaskError.call(this, b10);
          } catch (a11) {
            console.error(Object.defineProperty(new aN.z("`onTaskError` threw while handling an error thrown from an `after` task", { cause: a11 }), "__NEXT_ERROR_CODE", { value: "E569", enumerable: false, configurable: true }));
          }
        }
      }
      function a2() {
        throw Object.defineProperty(Error("`after()` will not work correctly, because `waitUntil` is not available in the current environment."), "__NEXT_ERROR_CODE", { value: "E91", enumerable: false, configurable: true });
      }
      function a3(a10) {
        let b10, c10 = { then: (d10, e10) => (b10 || (b10 = Promise.resolve(a10())), b10.then((a11) => {
          c10.value = a11;
        }).catch(() => {
        }), b10.then(d10, e10)) };
        return c10;
      }
      class a4 {
        onClose(a10) {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot subscribe to a closed CloseController"), "__NEXT_ERROR_CODE", { value: "E365", enumerable: false, configurable: true });
          this.target.addEventListener("close", a10), this.listeners++;
        }
        dispatchClose() {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot close a CloseController multiple times"), "__NEXT_ERROR_CODE", { value: "E229", enumerable: false, configurable: true });
          this.listeners > 0 && this.target.dispatchEvent(new Event("close")), this.isClosed = true;
        }
        constructor() {
          this.target = new EventTarget(), this.listeners = 0, this.isClosed = false;
        }
      }
      function a5() {
        return { previewModeId: process.env.__NEXT_PREVIEW_MODE_ID || "", previewModeSigningKey: process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY || "", previewModeEncryptionKey: process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY || "" };
      }
      let a6 = Symbol.for("@next/request-context"), a7 = /[^\t\x20-\x7e]/, a8 = /[^\t\x20-\x7e]+/g;
      function a9(a10) {
        return a7.test(a10) ? a10.replace(a8, (a11) => encodeURIComponent(a11)) : a10;
      }
      async function ba(a10, b10, c10) {
        let d10 = /* @__PURE__ */ new Set();
        for (let b11 of ((a11) => {
          let b12 = ["/layout"];
          if (a11.startsWith("/")) {
            let c11 = a11.indexOf("/", 1);
            for (; ; ) {
              -1 === c11 && (c11 = a11.length);
              let d11 = a11.slice(0, c11);
              if (d11 && (d11.endsWith("/page") || d11.endsWith("/route") || (d11 = `${d11}${!d11.endsWith("/") ? "/" : ""}layout`), b12.push(d11)), c11 === a11.length) break;
              c11 = a11.indexOf("/", c11 + 1);
            }
          }
          return b12;
        })(a10)) b11 = a9(`${ab.gW}${b11}`), d10.add(b11);
        if (b10 && (!c10 || 0 === c10.size)) {
          let a11 = a9(`${ab.gW}${b10}`);
          d10.add(a11);
        }
        d10.has(`${ab.gW}/`) && d10.add(`${ab.gW}/index`), d10.has(`${ab.gW}/index`) && d10.add(`${ab.gW}/`);
        let e10 = Array.from(d10);
        return { tags: e10, expirationsByCacheKind: function(a11) {
          let b11 = /* @__PURE__ */ new Map(), c11 = aX();
          if (c11) for (let [d11, e11] of c11) "getExpiration" in e11 && b11.set(d11, a3(async () => e11.getExpiration(a11)));
          return b11;
        }(e10) };
      }
      let bb = Symbol.for("NextInternalRequestMeta"), bc = { get default() {
        throw Object.defineProperty(new aN.z("Proxy does not support `use cache`, so reading its `default` cacheLife profile is unexpected."), "__NEXT_ERROR_CODE", { value: "E1406", enumerable: false, configurable: true });
      } };
      class bd extends K.J {
        constructor(a10) {
          super(a10.input, a10.init), this.sourcePage = a10.page;
        }
        get request() {
          throw Object.defineProperty(new D.CB({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new D.CB({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        waitUntil() {
          throw Object.defineProperty(new D.CB({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      let be = { keys: (a10) => Array.from(a10.keys()), get: (a10, b10) => a10.get(b10) ?? void 0 }, bf = (a10, b10) => aG().withPropagatedContext(a10.headers, b10, be), bg = false;
      async function bh(a10) {
        var b10, d10, e10, f2, g2;
        let h2, i2, j2, k2, l2;
        !function() {
          if (!bg && (bg = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
            let { interceptTestApis: a11, wrapRequestHandler: b11 } = c(3233);
            a11(), bf = b11(bf);
          }
        }(), await B();
        let m2 = void 0 !== globalThis.__BUILD_MANIFEST;
        a10.request.url = a10.request.url.replace(/\.rsc($|\?)/, "$1");
        let n2 = a10.bypassNextUrl ? new URL(a10.request.url) : new N.X(a10.request.url, { headers: a10.request.headers, nextConfig: a10.request.nextConfig });
        for (let a11 of [...n2.searchParams.keys()]) {
          let b11 = n2.searchParams.getAll(a11), c10 = (0, E.wN)(a11);
          if (c10) {
            for (let a12 of (n2.searchParams.delete(c10), b11)) n2.searchParams.append(c10, a12);
            n2.searchParams.delete(a11);
          }
        }
        let o2 = process.env.__NEXT_BUILD_ID || "";
        "buildId" in n2 && (o2 = n2.buildId || "", n2.buildId = "");
        let p2 = (0, E.p$)(a10.request.headers), q2 = p2.has("x-nextjs-data"), r2 = "1" === p2.get("rsc");
        q2 && "/index" === n2.pathname && (n2.pathname = "/");
        let s2 = /* @__PURE__ */ new Map();
        if (!m2) for (let a11 of P) {
          let b11 = p2.get(a11);
          null !== b11 && (s2.set(a11, b11), p2.delete(a11));
        }
        let t2 = n2.searchParams.get(Q), u2 = new bd({ page: a10.page, input: ((k2 = (j2 = "string" == typeof n2) ? new URL(n2) : n2).searchParams.delete(Q), j2 ? k2.toString() : k2).toString(), init: { body: a10.request.body, headers: p2, method: a10.request.method, nextConfig: a10.request.nextConfig, signal: a10.request.signal } });
        a10.request.requestMeta && (g2 = a10.request.requestMeta, u2[bb] = g2), q2 && Object.defineProperty(u2, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCacheShared && a10.IncrementalCache && (globalThis.__incrementalCache = new a10.IncrementalCache({ CurCacheHandler: a10.incrementalCacheHandler, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: a10.request.headers, getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: a5() }) }));
        let v2 = a10.request.waitUntil ?? (null == (b10 = null == (l2 = globalThis[a6]) ? void 0 : l2.get()) ? void 0 : b10.waitUntil), w2 = new J({ request: u2, page: a10.page, context: v2 ? { waitUntil: v2 } : void 0 });
        if ((h2 = await bf(u2, () => {
          if ("/middleware" === a10.page || "/src/middleware" === a10.page || "/proxy" === a10.page || "/src/proxy" === a10.page) {
            let b11 = w2.waitUntil.bind(w2), c10 = new a4();
            return aG().trace(an.execute, { spanName: `middleware ${u2.method}`, attributes: { "http.target": u2.nextUrl.pathname, "http.method": u2.method } }, async () => {
              try {
                var d11, e11, f3, g3, h3;
                let j3 = a5(), k3 = await ba("/", u2.nextUrl.pathname, null), l3 = (f3 = u2.nextUrl, g3 = (a11) => {
                  i2 = a11;
                }, h3 = void 0, function(a11) {
                  let { phase: b12, headers: c11, onUpdateCookies: d12, url: e12, rootParams: f4, implicitTags: g4, resumeDataCache: h4, previewProps: i3, isHmrRefresh: j4, serverComponentsHmrCache: k4, hmrRefreshHash: l4, fallbackParams: m4 } = a11, n3 = {};
                  return { type: "request", phase: b12, implicitTags: g4, url: { pathname: e12.pathname, search: e12.search ?? "" }, rootParams: f4, get headers() {
                    return n3.headers || (n3.headers = function(a12) {
                      let b13 = V.from(a12 instanceof Headers ? new Headers(a12) : { ...a12 });
                      for (let a13 of P) b13.delete(a13);
                      return b13.delete("x-nextjs-request-id"), b13.delete("x-nextjs-html-request-id"), V.seal(b13);
                    }(c11)), n3.headers;
                  }, get cookies() {
                    if (!n3.cookies) {
                      let a12 = new W.tm(V.from(c11));
                      aJ(c11, a12), n3.cookies = Z.seal(a12);
                    }
                    return n3.cookies;
                  }, set cookies(value) {
                    n3.cookies = value;
                  }, get mutableCookies() {
                    if (!n3.mutableCookies) {
                      let a12, b13 = (a12 = new W.tm(V.from(c11)), _.wrap(a12, d12));
                      aJ(c11, b13), n3.mutableCookies = b13;
                    }
                    return n3.mutableCookies;
                  }, get userspaceMutableCookies() {
                    if (!n3.userspaceMutableCookies) {
                      var o3;
                      let a12;
                      o3 = this, n3.userspaceMutableCookies = a12 = new Proxy(o3.mutableCookies, { get(b13, c12, d13) {
                        switch (c12) {
                          case "delete":
                            return function(...c13) {
                              return aa(o3, "cookies().delete"), b13.delete(...c13), a12;
                            };
                          case "set":
                            return function(...c13) {
                              return aa(o3, "cookies().set"), b13.set(...c13), a12;
                            };
                          default:
                            return T.l.get(b13, c12, d13);
                        }
                      } });
                    }
                    return n3.userspaceMutableCookies;
                  }, get draftMode() {
                    return n3.draftMode || (n3.draftMode = new aI(i3, c11, this.cookies, this.mutableCookies)), n3.draftMode;
                  }, resumeDataCache: h4 ?? null, isHmrRefresh: j4, serverComponentsHmrCache: k4 || globalThis.__serverComponentsHmrCache, hmrRefreshHash: l4, fallbackParams: m4 };
                }({ phase: "action", headers: u2.headers, onUpdateCookies: g3, url: f3, rootParams: {}, implicitTags: k3, resumeDataCache: null, previewProps: j3, isHmrRefresh: false, serverComponentsHmrCache: void 0, hmrRefreshHash: h3, fallbackParams: null })), m3 = function({ page: a11, renderOpts: b12, isPrefetchRequest: c11, buildId: d12, deploymentId: e12, previouslyRevalidatedTags: f4, nonce: g4 }) {
                  let h4 = !b12.supportsDynamicResponse && !b12.isDraftMode && !b12.isPossibleServerAction, i3 = h4 && (!!process.env.NEXT_DEBUG_BUILD || "1" === process.env.NEXT_SSG_FETCH_METRICS), j4 = { isStaticGeneration: h4, page: a11, route: S(a11), incrementalCache: b12.incrementalCache || globalThis.__incrementalCache, cacheLifeProfiles: b12.cacheLifeProfiles, useCacheTimeout: b12.experimental.useCacheTimeout, staticPageGenerationTimeout: b12.staticPageGenerationTimeout, isBuildTimePrerendering: b12.isBuildTimePrerendering, fetchCache: b12.fetchCache, isOnDemandRevalidate: b12.isOnDemandRevalidate, requestId: void 0, htmlRequestId: void 0, isDraftMode: b12.isDraftMode, isPrefetchRequest: c11, buildId: d12, deploymentId: e12, reactLoadableManifest: (null == b12 ? void 0 : b12.reactLoadableManifest) || {}, assetPrefix: (null == b12 ? void 0 : b12.assetPrefix) || "", nonce: g4, afterContext: function(a12) {
                    let { waitUntil: b13, onClose: c12, onAfterTaskError: d13 } = a12;
                    return new a1({ waitUntil: b13, onClose: c12, onTaskError: d13 });
                  }(b12), cacheComponentsEnabled: b12.cacheComponents, validationLevel: b12.validationLevel, previouslyRevalidatedTags: f4, refreshTagsByCacheKind: function() {
                    let a12 = /* @__PURE__ */ new Map(), b13 = aX();
                    if (b13) for (let [c12, d13] of b13) "refreshTags" in d13 && a12.set(c12, a3(async () => d13.refreshTags()));
                    return a12;
                  }(), runInCleanSnapshot: (0, a_.$p)(), shouldTrackFetchMetrics: i3, reactServerErrorsByDigest: /* @__PURE__ */ new Map() };
                  return b12.store = j4, j4;
                }({ page: "/", renderOpts: { cacheLifeProfiles: bc, staticPageGenerationTimeout: 0, cacheComponents: false, validationLevel: "warning", experimental: { isRoutePPREnabled: false, authInterrupts: !!(null == (e11 = a10.request.nextConfig) || null == (d11 = e11.experimental) ? void 0 : d11.authInterrupts), useCacheTimeout: 0 }, supportsDynamicResponse: true, waitUntil: b11, onClose: c10.onClose.bind(c10), onAfterTaskError: void 0 }, isPrefetchRequest: "1" === u2.headers.get(O), buildId: o2 ?? "", deploymentId: false, previouslyRevalidatedTags: [] });
                return await X.J.run(m3, () => aK.FP.run(l3, a10.handler, u2, w2));
              } finally {
                setTimeout(() => {
                  c10.dispatchClose();
                }, 0);
              }
            });
          }
          return a10.handler(u2, w2);
        })) && !(h2 instanceof Response)) throw Object.defineProperty(TypeError("Expected an instance of Response to be returned"), "__NEXT_ERROR_CODE", { value: "E567", enumerable: false, configurable: true });
        h2 && i2 && h2.headers.set("set-cookie", i2);
        let x2 = null == h2 ? void 0 : h2.headers.get("x-middleware-rewrite");
        if (h2 && x2 && (r2 || !m2)) {
          let b11 = new N.X(x2, { forceLocale: true, headers: a10.request.headers, nextConfig: a10.request.nextConfig });
          m2 || b11.host !== u2.nextUrl.host || (b11.buildId = o2 || b11.buildId, h2.headers.set("x-middleware-rewrite", String(b11)));
          let { url: c10, isRelative: g3 } = M(b11.toString(), n2.toString());
          !m2 && q2 && h2.headers.set("x-nextjs-rewrite", c10);
          let i3 = !g3 && (null == (f2 = a10.request.nextConfig) || null == (e10 = f2.experimental) || null == (d10 = e10.clientParamParsingOrigins) ? void 0 : d10.some((a11) => new RegExp(a11).test(b11.origin)));
          r2 && (g3 || i3) && (n2.pathname !== b11.pathname && h2.headers.set("x-nextjs-rewritten-path", b11.pathname), n2.search !== b11.search && h2.headers.set("x-nextjs-rewritten-query", b11.search.slice(1)));
        }
        if (h2 && x2 && r2 && t2) {
          let a11 = new URL(x2);
          a11.searchParams.has(Q) || (a11.searchParams.set(Q, t2), h2.headers.set("x-middleware-rewrite", a11.toString()));
        }
        let y2 = null == h2 ? void 0 : h2.headers.get("Location");
        if (h2 && y2 && !m2) {
          let b11 = new N.X(y2, { forceLocale: false, headers: a10.request.headers, nextConfig: a10.request.nextConfig });
          h2 = new Response(h2.body, h2), b11.host === n2.host && (b11.buildId = o2 || b11.buildId, h2.headers.set("Location", M(b11, n2).url)), q2 && (h2.headers.delete("Location"), h2.headers.set("x-nextjs-redirect", M(b11.toString(), n2.toString()).url));
        }
        let z2 = h2 || L.R.next(), A2 = z2.headers.get("x-middleware-override-headers"), C2 = [];
        if (A2) {
          for (let [a11, b11] of s2) z2.headers.set(`x-middleware-request-${a11}`, b11), C2.push(a11);
          C2.length > 0 && z2.headers.set("x-middleware-override-headers", A2 + "," + C2.join(","));
        }
        return { response: z2, waitUntil: ("internal" === w2[H].kind ? Promise.all(w2[H].promises).then(() => {
        }) : void 0) ?? Promise.resolve(), fetchMetrics: u2.fetchMetrics };
      }
      let { env: bi, stdout: bj } = (null == (u = globalThis) ? void 0 : u.process) ?? {}, bk = bi && !bi.NO_COLOR && (bi.FORCE_COLOR || (null == bj ? void 0 : bj.isTTY) && !bi.CI && "dumb" !== bi.TERM), bl = (a10, b10, c10, d10) => {
        let e10 = a10.substring(0, d10) + c10, f2 = a10.substring(d10 + b10.length), g2 = f2.indexOf(b10);
        return ~g2 ? e10 + bl(f2, b10, c10, g2) : e10 + f2;
      }, bm = (a10, b10, c10 = a10) => bk ? (d10) => {
        let e10 = "" + d10, f2 = e10.indexOf(b10, a10.length);
        return ~f2 ? a10 + bl(e10, b10, c10, f2) + b10 : a10 + e10 + b10;
      } : String, bn = bm("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m");
      bm("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"), bm("\x1B[3m", "\x1B[23m"), bm("\x1B[4m", "\x1B[24m"), bm("\x1B[7m", "\x1B[27m"), bm("\x1B[8m", "\x1B[28m"), bm("\x1B[9m", "\x1B[29m"), bm("\x1B[30m", "\x1B[39m");
      let bo = bm("\x1B[31m", "\x1B[39m"), bp = bm("\x1B[32m", "\x1B[39m"), bq = bm("\x1B[33m", "\x1B[39m");
      bm("\x1B[34m", "\x1B[39m");
      let br = bm("\x1B[35m", "\x1B[39m");
      bm("\x1B[38;2;173;127;168m", "\x1B[39m"), bm("\x1B[36m", "\x1B[39m");
      let bs = bm("\x1B[37m", "\x1B[39m");
      bm("\x1B[90m", "\x1B[39m"), bm("\x1B[40m", "\x1B[49m"), bm("\x1B[41m", "\x1B[49m"), bm("\x1B[42m", "\x1B[49m"), bm("\x1B[43m", "\x1B[49m"), bm("\x1B[44m", "\x1B[49m"), bm("\x1B[45m", "\x1B[49m"), bm("\x1B[46m", "\x1B[49m"), bm("\x1B[47m", "\x1B[49m"), bs(bn("\u25CB")), bo(bn("\u2A2F")), bq(bn("\u26A0")), bs(bn(" ")), bp(bn("\u2713")), br(bn("\xBB")), new aQ(1e4, (a10) => a10.length), new aQ(1e4, (a10) => a10.length);
      var bt = ((s = {}).APP_PAGE = "APP_PAGE", s.APP_ROUTE = "APP_ROUTE", s.PAGES = "PAGES", s.FETCH = "FETCH", s.REDIRECT = "REDIRECT", s.IMAGE = "IMAGE", s), bu = ((t = {}).APP_PAGE = "APP_PAGE", t.APP_ROUTE = "APP_ROUTE", t.PAGES = "PAGES", t.FETCH = "FETCH", t.IMAGE = "IMAGE", t);
      function bv() {
      }
      new Uint8Array([60, 104, 116, 109, 108]), new Uint8Array([60, 104, 101, 97, 100]), new Uint8Array([60, 98, 111, 100, 121]), new Uint8Array([60, 47, 104, 101, 97, 100, 62]), new Uint8Array([60, 47, 98, 111, 100, 121, 62]), new Uint8Array([60, 47, 104, 116, 109, 108, 62]), new Uint8Array([60, 47, 98, 111, 100, 121, 62, 60, 47, 104, 116, 109, 108, 62]), new Uint8Array([60, 109, 101, 116, 97, 32, 110, 97, 109, 101, 61, 34, 194, 171, 110, 120, 116, 45, 105, 99, 111, 110, 194, 187, 34]), c(5356).Buffer, new TextEncoder(), c(5356).Buffer;
      let bw = new TextEncoder();
      function bx(a10) {
        return new ReadableStream({ start(b10) {
          b10.enqueue(bw.encode(a10)), b10.close();
        } });
      }
      function by(a10) {
        return new ReadableStream({ start(b10) {
          b10.enqueue(a10), b10.close();
        } });
      }
      async function bz(a10, b10) {
        let c10 = new TextDecoder("utf-8", { fatal: true }), d10 = "";
        for await (let e10 of a10) {
          if (null == b10 ? void 0 : b10.aborted) return d10;
          d10 += c10.decode(e10, { stream: true });
        }
        return d10 + c10.decode();
      }
      let bA = "ResponseAborted";
      class bB extends Error {
        constructor(...a10) {
          super(...a10), this.name = bA;
        }
      }
      class bC {
        constructor() {
          let a10, b10;
          this.promise = new Promise((c10, d10) => {
            a10 = c10, b10 = d10;
          }), this.resolve = a10, this.reject = b10;
        }
      }
      let bD = 0, bE = 0, bF = 0;
      function bG(a10 = {}) {
        let b10 = 0 === bD ? void 0 : { clientComponentLoadStart: bD, clientComponentLoadTimes: bE, clientComponentLoadCount: bF };
        return a10.reset && (bD = 0, bE = 0, bF = 0), b10;
      }
      function bH(a10) {
        return (null == a10 ? void 0 : a10.name) === "AbortError" || (null == a10 ? void 0 : a10.name) === bA;
      }
      let bI = "performance" in globalThis && process.env.NEXT_OTEL_PERFORMANCE_PREFIX;
      async function bJ(a10, b10, c10) {
        try {
          let d10, { errored: e10, destroyed: f2 } = b10;
          if (e10 || f2) return;
          let g2 = (d10 = new AbortController(), b10.once("close", () => {
            b10.writableFinished || d10.abort(new bB());
          }), d10), h2 = function(a11, b11) {
            let c11 = false, d11 = new bC();
            function e11() {
              d11.resolve();
            }
            a11.on("drain", e11), a11.once("close", () => {
              a11.off("drain", e11), d11.resolve();
            });
            let f3 = new bC();
            return a11.once("finish", () => {
              f3.resolve();
            }), new WritableStream({ write: async (b12) => {
              if (!c11) {
                if (c11 = true, bI) {
                  let a12 = bG();
                  a12 && performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-client-component-loading`, { start: a12.clientComponentLoadStart, end: a12.clientComponentLoadStart + a12.clientComponentLoadTimes });
                }
                a11.flushHeaders(), aG().trace(af.startResponse, { spanName: "start response" }, () => void 0);
              }
              try {
                let c12 = a11.write(b12);
                "flush" in a11 && "function" == typeof a11.flush && a11.flush(), c12 || (await d11.promise, d11 = new bC());
              } catch (b13) {
                throw a11.end(), Object.defineProperty(Error("failed to write chunk to response", { cause: b13 }), "__NEXT_ERROR_CODE", { value: "E321", enumerable: false, configurable: true });
              }
            }, abort: (b12) => {
              a11.writableFinished || a11.destroy(b12);
            }, close: async () => {
              if (b11 && await b11, !a11.writableFinished) return a11.end(), f3.promise;
            } });
          }(b10, c10);
          await a10.pipeTo(h2, { signal: g2.signal });
        } catch (a11) {
          if (bH(a11)) return;
          throw Object.defineProperty(Error("failed to pipe response", { cause: a11 }), "__NEXT_ERROR_CODE", { value: "E180", enumerable: false, configurable: true });
        }
      }
      async function bK(a10, b10, c10) {
        try {
          let { errored: d10, destroyed: e10 } = b10;
          if (d10 || e10) return;
          let f2 = false, g2 = new bC();
          b10.once("close", () => {
            a10.destroy(), g2.resolve();
          }), a10.on("data", (c11) => {
            if (!f2) {
              if (f2 = true, "performance" in globalThis && process.env.NEXT_OTEL_PERFORMANCE_PREFIX) {
                let a11 = bG();
                a11 && performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-client-component-loading`, { start: a11.clientComponentLoadStart, end: a11.clientComponentLoadStart + a11.clientComponentLoadTimes });
              }
              b10.flushHeaders(), aG().trace(af.startResponse, { spanName: "start response" }, () => void 0);
            }
            let d11 = b10.write(c11);
            "flush" in b10 && "function" == typeof b10.flush && b10.flush(), d11 || (a10.pause(), b10.once("drain", () => {
              a10.resume();
            }));
          }), a10.on("end", async () => {
            c10 && await c10, b10.writableFinished || b10.end(), g2.resolve();
          }), a10.on("error", (a11) => {
            bH(a11) || b10.destroy(a11), g2.resolve();
          }), await g2.promise;
        } catch (a11) {
          if (bH(a11)) return;
          throw Object.defineProperty(Error("failed to pipe response", { cause: a11 }), "__NEXT_ERROR_CODE", { value: "E180", enumerable: false, configurable: true });
        }
      }
      var bL = c(5356).Buffer;
      function bM(a10) {
        return null !== a10 && "object" == typeof a10 && "function" == typeof a10.pipe && "function" == typeof a10.on && !(a10 instanceof ReadableStream);
      }
      class bN {
        static #a = this.EMPTY = new bN(null, { metadata: {}, contentType: null });
        static fromStatic(a10, b10) {
          return new bN(a10, { metadata: {}, contentType: b10 });
        }
        constructor(a10, { contentType: b10, waitUntil: c10, metadata: d10 }) {
          this.response = a10, this.contentType = b10, this.metadata = d10, this.waitUntil = c10;
        }
        assignMetadata(a10) {
          Object.assign(this.metadata, a10);
        }
        get isNull() {
          return null === this.response;
        }
        get isDynamic() {
          return "string" != typeof this.response;
        }
        toUnchunkedString(a10 = false) {
          if (null === this.response) return "";
          if ("string" != typeof this.response) {
            if (!a10) throw Object.defineProperty(new aN.z("dynamic responses cannot be unchunked. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E732", enumerable: false, configurable: true });
            return bz(this.readable);
          }
          return this.response;
        }
        get readable() {
          if (null === this.response) return new ReadableStream({ start(a10) {
            a10.close();
          } });
          if ("string" == typeof this.response) return bx(this.response);
          if (bL.isBuffer(this.response)) return by(this.response);
          if (Array.isArray(this.response)) return function(...a10) {
            if (0 === a10.length) return new ReadableStream({ start(a11) {
              a11.close();
            } });
            if (1 === a10.length) return a10[0];
            let { readable: b10, writable: c10 } = new TransformStream(), d10 = a10[0].pipeTo(c10, { preventClose: true }), e10 = 1;
            for (; e10 < a10.length - 1; e10++) {
              let b11 = a10[e10];
              d10 = d10.then(() => b11.pipeTo(c10, { preventClose: true }));
            }
            let f2 = a10[e10];
            return (d10 = d10.then(() => f2.pipeTo(c10))).catch(bv), b10;
          }(...this.response);
          if (bM(this.response)) throw Object.defineProperty(new aN.z("Node.js Readable cannot be converted to a web stream in the edge runtime"), "__NEXT_ERROR_CODE", { value: "E1150", enumerable: false, configurable: true });
          return this.response;
        }
        coerce() {
          if (null === this.response) return [];
          if ("string" == typeof this.response) return [bx(this.response)];
          if (Array.isArray(this.response)) return this.response;
          if (bL.isBuffer(this.response)) return [by(this.response)];
          if (!bM(this.response)) return [this.response];
          throw Object.defineProperty(new aN.z("Node.js Readable cannot be converted to a web stream in the edge runtime"), "__NEXT_ERROR_CODE", { value: "E1150", enumerable: false, configurable: true });
        }
        pipeThrough(a10) {
          this.response = this.readable.pipeThrough(a10);
        }
        unshift(a10) {
          this.response = this.coerce(), this.response.unshift(a10);
        }
        push(a10) {
          this.response = this.coerce(), this.response.push(a10);
        }
        async pipeTo(a10) {
          try {
            await this.readable.pipeTo(a10, { preventClose: true }), this.waitUntil && await this.waitUntil, await a10.close();
          } catch (b10) {
            if (bH(b10)) return void await a10.abort(b10);
            throw b10;
          }
        }
        async pipeToNodeResponse(a10) {
          null !== this.response && "string" != typeof this.response && !bL.isBuffer(this.response) && !Array.isArray(this.response) && bM(this.response) ? await bK(this.response, a10, this.waitUntil) : await bJ(this.readable, a10, this.waitUntil);
        }
      }
      function bO(a10, b10) {
        if (!a10) return b10;
        let c10 = parseInt(a10, 10);
        return Number.isFinite(c10) && c10 > 0 ? c10 : b10;
      }
      bO(process.env.NEXT_PRIVATE_RESPONSE_CACHE_TTL, 1e4), bO(process.env.NEXT_PRIVATE_RESPONSE_CACHE_MAX_SIZE, 150);
      var bP = c(5824), bQ = c.n(bP);
      class bR {
        constructor(a10) {
          this.fs = a10, this.tasks = [];
        }
        findOrCreateTask(a10) {
          for (let b11 of this.tasks) if (b11[0] === a10) return b11;
          let b10 = this.fs.mkdir(a10);
          b10.catch(() => {
          });
          let c10 = [a10, b10, []];
          return this.tasks.push(c10), c10;
        }
        append(a10, b10) {
          let c10 = this.findOrCreateTask(bQ().dirname(a10)), d10 = c10[1].then(() => this.fs.writeFile(a10, b10));
          d10.catch(() => {
          }), c10[2].push(d10);
        }
        wait() {
          return Promise.all(this.tasks.flatMap((a10) => a10[2]));
        }
      }
      function bS(a10) {
        return (null == a10 ? void 0 : a10.length) || 0;
      }
      class bT {
        static #a = this.debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE;
        constructor(a10) {
          this.fs = a10.fs, this.flushToDisk = a10.flushToDisk, this.serverDistDir = a10.serverDistDir, this.revalidatedTags = a10.revalidatedTags, a10.maxMemoryCacheSize ? bT.memoryCache ? bT.debug && console.log("FileSystemCache: memory store already initialized") : (bT.debug && console.log("FileSystemCache: using memory store for fetch cache"), bT.memoryCache = function(a11) {
            return e || (e = new aQ(a11, function({ value: a12 }, b10) {
              var c10, d10;
              let e10;
              if (a12) if (a12.kind === bt.REDIRECT) e10 = JSON.stringify(a12.props).length;
              else if (a12.kind === bt.IMAGE) throw Object.defineProperty(Error("invariant image should not be incremental-cache"), "__NEXT_ERROR_CODE", { value: "E501", enumerable: false, configurable: true });
              else e10 = a12.kind === bt.FETCH ? JSON.stringify(a12.data || "").length : a12.kind === bt.APP_ROUTE ? a12.body.length : a12.kind === bt.APP_PAGE ? Math.max(1, a12.html.length + bS(a12.rscData) + ((null == (c10 = a12.postponed) ? void 0 : c10.length) || 0) + function(a13) {
                if (!a13) return 0;
                let b11 = 0;
                for (let [c11, d11] of a13) b11 += c11.length + bS(d11);
                return b11;
              }(a12.segmentData)) : a12.html.length + ((null == (d10 = JSON.stringify(a12.pageData)) ? void 0 : d10.length) || 0);
              else e10 = 25;
              return b10.length + e10;
            })), e;
          }(a10.maxMemoryCacheSize)) : bT.debug && console.log("FileSystemCache: not using memory store for fetch cache");
        }
        resetRequestCache() {
        }
        async revalidateTag(a10, b10) {
          if (a10 = "string" == typeof a10 ? [a10] : a10, bT.debug && console.log("FileSystemCache: revalidateTag", a10, b10), 0 === a10.length) return;
          let c10 = Date.now();
          for (let d10 of a10) {
            let a11 = aR.get(d10) || {};
            if (b10) {
              let e10 = { ...a11 };
              e10.stale = c10, void 0 !== b10.expire && (e10.expired = c10 + 1e3 * b10.expire), aR.set(d10, e10);
            } else aR.set(d10, { ...a11, expired: c10 });
          }
        }
        async get(...a10) {
          var b10, c10, d10, e10, f2, g2;
          let [h2, i2] = a10, { kind: j2 } = i2, k2 = null == (b10 = bT.memoryCache) ? void 0 : b10.get(h2);
          if (bT.debug && (j2 === bu.FETCH ? console.log("FileSystemCache: get", h2, i2.tags, j2, !!k2) : console.log("FileSystemCache: get", h2, j2, !!k2)), (null == k2 || null == (c10 = k2.value) ? void 0 : c10.kind) === bt.APP_PAGE || (null == k2 || null == (d10 = k2.value) ? void 0 : d10.kind) === bt.APP_ROUTE || (null == k2 || null == (e10 = k2.value) ? void 0 : e10.kind) === bt.PAGES) {
            let a11 = null == (g2 = k2.value.headers) ? void 0 : g2[ab.VC];
            if ("string" == typeof a11) {
              let b11 = a11.split(",");
              if (b11.length > 0 && aS(b11, k2.lastModified)) return bT.debug && console.log("FileSystemCache: expired tags", b11), null;
            }
          } else if ((null == k2 || null == (f2 = k2.value) ? void 0 : f2.kind) === bt.FETCH) {
            let a11 = i2.kind === bu.FETCH ? [...i2.tags || [], ...i2.softTags || []] : [];
            if (a11.some((a12) => this.revalidatedTags.includes(a12))) return bT.debug && console.log("FileSystemCache: was revalidated", a11), null;
            if (aS(a11, k2.lastModified)) return bT.debug && console.log("FileSystemCache: expired tags", a11), null;
          }
          return k2 ?? null;
        }
        async set(a10, b10, c10) {
          var d10;
          if (null == (d10 = bT.memoryCache) || d10.set(a10, { value: b10, lastModified: Date.now() }), bT.debug && console.log("FileSystemCache: set", a10), !this.flushToDisk || !b10) return;
          let e10 = new bR(this.fs);
          if (b10.kind === bt.APP_ROUTE) {
            let c11 = this.getFilePath(`${a10}.body`, bu.APP_ROUTE);
            e10.append(c11, b10.body);
            let d11 = { headers: b10.headers, status: b10.status, postponed: void 0, segmentPaths: void 0, prefetchHints: void 0 };
            e10.append(c11.replace(/\.body$/, ab.EP), JSON.stringify(d11, null, 2));
          } else if (b10.kind === bt.PAGES || b10.kind === bt.APP_PAGE) {
            let d11 = b10.kind === bt.APP_PAGE, f2 = this.getFilePath(`${a10}.html`, d11 ? bu.APP_PAGE : bu.PAGES);
            if (e10.append(f2, b10.html), c10.fetchCache || c10.isFallback || c10.isRoutePPREnabled || e10.append(this.getFilePath(`${a10}${d11 ? ab.RM : ab.x3}`, d11 ? bu.APP_PAGE : bu.PAGES), d11 ? b10.rscData : JSON.stringify(b10.pageData)), (null == b10 ? void 0 : b10.kind) === bt.APP_PAGE) {
              let a11;
              if (b10.segmentData) {
                a11 = [];
                let c12 = f2.replace(/\.html$/, ab.mH);
                for (let [d12, f3] of b10.segmentData) {
                  a11.push(d12);
                  let b11 = c12 + d12 + ab.tz;
                  e10.append(b11, f3);
                }
              }
              let c11 = { headers: b10.headers, status: b10.status, postponed: b10.postponed, segmentPaths: a11, prefetchHints: void 0 };
              e10.append(f2.replace(/\.html$/, ab.EP), JSON.stringify(c11));
            }
          } else if (b10.kind === bt.FETCH) {
            let d11 = this.getFilePath(a10, bu.FETCH);
            e10.append(d11, JSON.stringify({ ...b10, tags: c10.fetchCache ? c10.tags : [] }));
          }
          await e10.wait();
        }
        getFilePath(a10, b10) {
          switch (b10) {
            case bu.FETCH:
              return bQ().join(this.serverDistDir, "..", "cache", "fetch-cache", a10);
            case bu.PAGES:
              return bQ().join(this.serverDistDir, "pages", a10);
            case bu.IMAGE:
            case bu.APP_PAGE:
            case bu.APP_ROUTE:
              return bQ().join(this.serverDistDir, "app", a10);
            default:
              throw Object.defineProperty(Error(`Unexpected file path kind: ${b10}`), "__NEXT_ERROR_CODE", { value: "E479", enumerable: false, configurable: true });
          }
        }
      }
      let bU = ["(..)(..)", "(.)", "(..)", "(...)"], bV = /\/[^/]*\[[^/]+\][^/]*(?=\/|$)/, bW = /\/\[[^/]+\](?=\/|$)/;
      function bX(a10) {
        return a10.replace(/(?:\/index)?\/?$/, "") || "/";
      }
      "u" > typeof performance && ["mark", "measure", "getEntriesByName"].every((a10) => "function" == typeof performance[a10]);
      class bY {
        static #a = this.cacheControls = /* @__PURE__ */ new Map();
        constructor(a10) {
          this.prerenderManifest = a10;
        }
        get(a10) {
          let b10 = bY.cacheControls.get(a10);
          if (b10) return b10;
          let c10 = this.prerenderManifest.routes[a10];
          if (c10) {
            let { initialRevalidateSeconds: a11, initialExpireSeconds: b11 } = c10;
            if (void 0 !== a11) return { revalidate: a11, expire: b11 };
          }
          let d10 = this.prerenderManifest.dynamicRoutes[a10];
          if (d10) {
            let { fallbackRevalidate: a11, fallbackExpire: b11 } = d10;
            if (void 0 !== a11) return { revalidate: a11, expire: b11 };
          }
        }
        set(a10, b10) {
          bY.cacheControls.set(a10, b10);
        }
        clear() {
          bY.cacheControls.clear();
        }
      }
      function bZ(a10) {
        let b10 = "buffer" in a10 ? new Uint8Array(a10.buffer, a10.byteOffset, a10.byteLength) : new Uint8Array(a10), c10 = "";
        for (let a11 of b10) c10 += a11.toString(16).padStart(2, "0");
        return c10;
      }
      async function b$(a10) {
        {
          let b10 = new TextEncoder().encode(a10);
          return bZ(await crypto.subtle.digest("SHA-256", b10));
        }
      }
      c(6122), c(8797);
      class b_ {
        static #a = this.debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE;
        constructor({ fs: a10, dev: b10, flushToDisk: c10, minimalMode: d10, serverDistDir: e10, requestHeaders: f2, maxMemoryCacheSize: g2, getPrerenderManifest: h2, fetchCacheKeyPrefix: i2, CurCacheHandler: j2, allowedRevalidateHeaderKeys: k2 }) {
          var l2, m2, n2, o2;
          this.locks = /* @__PURE__ */ new Map(), this.hasCustomCacheHandler = !!j2;
          const p2 = Symbol.for("@next/cache-handlers"), q2 = globalThis;
          if (j2) b_.debug && console.log("IncrementalCache: using custom cache handler", j2.name);
          else {
            const b11 = q2[p2];
            (null == b11 ? void 0 : b11.FetchCache) ? (j2 = b11.FetchCache, b_.debug && console.log("IncrementalCache: using global FetchCache cache handler")) : a10 && e10 && (b_.debug && console.log("IncrementalCache: using filesystem cache handler"), j2 = bT);
          }
          process.env.__NEXT_TEST_MAX_ISR_CACHE && (g2 = parseInt(process.env.__NEXT_TEST_MAX_ISR_CACHE, 10)), this.dev = b10, this.disableForTestmode = "true" === process.env.NEXT_PRIVATE_TEST_PROXY, this.minimalMode = d10, this.requestHeaders = f2, this.allowedRevalidateHeaderKeys = k2, this.prerenderManifest = h2(), this.cacheControls = new bY(this.prerenderManifest), this.fetchCacheKeyPrefix = i2;
          let r2 = [];
          f2[ab.kz] === (null == (m2 = this.prerenderManifest) || null == (l2 = m2.preview) ? void 0 : l2.previewModeId) && (this.isOnDemandRevalidate = true), d10 && (r2 = this.revalidatedTags = function(a11, b11) {
            return "string" == typeof a11[ab.vS] && a11[ab.c1] === b11 ? a11[ab.vS].split(",") : [];
          }(f2, null == (o2 = this.prerenderManifest) || null == (n2 = o2.preview) ? void 0 : n2.previewModeId)), j2 && (this.cacheHandler = new j2({ dev: b10, fs: a10, flushToDisk: c10, serverDistDir: e10, revalidatedTags: r2, maxMemoryCacheSize: g2, _requestHeaders: f2, fetchCacheKeyPrefix: i2 }));
        }
        calculateRevalidate(a10, b10, c10, d10) {
          if (c10) return Math.floor(performance.timeOrigin + performance.now() - 1e3);
          let e10 = this.cacheControls.get(bX(a10)), f2 = e10 ? e10.revalidate : !d10 && 1;
          return "number" == typeof f2 ? 1e3 * f2 + b10 : f2;
        }
        _getPathname(a10, b10) {
          return b10 ? a10 : /^\/index(\/|$)/.test(a10) && !function(a11, b11 = true) {
            return (void 0 !== a11.split("/").find((a12) => bU.find((b12) => a12.startsWith(b12))) && (a11 = function(a12) {
              let b12, c10, d10;
              for (let e10 of a12.split("/")) if (c10 = bU.find((a13) => e10.startsWith(a13))) {
                [b12, d10] = a12.split(c10, 2);
                break;
              }
              if (!b12 || !c10 || !d10) throw Object.defineProperty(Error(`Invalid interception route: ${a12}. Must be in the format /<intercepting route>/(..|...|..)(..)/<intercepted route>`), "__NEXT_ERROR_CODE", { value: "E269", enumerable: false, configurable: true });
              switch (b12 = S(b12), c10) {
                case "(.)":
                  d10 = "/" === b12 ? `/${d10}` : b12 + "/" + d10;
                  break;
                case "(..)":
                  if ("/" === b12) throw Object.defineProperty(Error(`Invalid interception route: ${a12}. Cannot use (..) marker at the root level, use (.) instead.`), "__NEXT_ERROR_CODE", { value: "E207", enumerable: false, configurable: true });
                  d10 = b12.split("/").slice(0, -1).concat(d10).join("/");
                  break;
                case "(...)":
                  d10 = "/" + d10;
                  break;
                case "(..)(..)":
                  let e10 = b12.split("/");
                  if (e10.length <= 2) throw Object.defineProperty(Error(`Invalid interception route: ${a12}. Cannot use (..)(..) marker at the root level or one level up.`), "__NEXT_ERROR_CODE", { value: "E486", enumerable: false, configurable: true });
                  d10 = e10.slice(0, -2).concat(d10).join("/");
                  break;
                default:
                  throw Object.defineProperty(Error("Invariant: unexpected marker"), "__NEXT_ERROR_CODE", { value: "E112", enumerable: false, configurable: true });
              }
              return { interceptingRoute: b12, interceptedRoute: d10 };
            }(a11).interceptedRoute), b11) ? bW.test(a11) : bV.test(a11);
          }(a10) ? `/index${a10}` : "/" === a10 ? "/index" : R(a10);
        }
        resetRequestCache() {
          var a10, b10;
          null == (b10 = this.cacheHandler) || null == (a10 = b10.resetRequestCache) || a10.call(b10);
        }
        async lock(a10) {
          for (; ; ) {
            let b11 = this.locks.get(a10);
            if (b_.debug && console.log("IncrementalCache: lock get", a10, !!b11), !b11) break;
            await b11;
          }
          let { resolve: b10, promise: c10 } = new bC();
          return b_.debug && console.log("IncrementalCache: successfully locked", a10), this.locks.set(a10, c10), () => {
            b10(), this.locks.delete(a10);
          };
        }
        async revalidateTag(a10, b10) {
          var c10;
          return null == (c10 = this.cacheHandler) ? void 0 : c10.revalidateTag(a10, b10);
        }
        async generateSimpleCacheKey(a10) {
          return b$(JSON.stringify(["v4", this.fetchCacheKeyPrefix || "", a10]));
        }
        async generateCacheKey(a10, b10 = {}) {
          let c10 = [], d10 = new TextEncoder(), e10 = null, f2 = b10.body;
          if (f2) if ("object" == typeof f2 && "byteLength" in f2) c10.push(`bytes:${bZ(f2)}`), b10._ogBody = f2;
          else if ("function" == typeof f2.getReader) {
            let a11 = [];
            try {
              await f2.pipeTo(new WritableStream({ write(b11) {
                a11.push("string" == typeof b11 ? d10.encode(b11) : b11);
              } }));
              let e11 = a11.reduce((a12, b11) => a12 + b11.length, 0), g3 = new Uint8Array(e11), h2 = 0;
              for (let b11 of a11) g3.set(b11, h2), h2 += b11.length;
              c10.push(`bytes:${bZ(g3)}`), b10._ogBody = g3;
            } catch (a12) {
              console.error("Problem reading body", a12);
            }
          } else if ("function" == typeof f2.keys) for (let [a11, d11] of (e10 = "[object FormData]" === String(f2) ? "multipart/form-data; boundary=" : "application/x-www-form-urlencoded;charset=UTF-8", b10._ogBody = f2, f2.entries())) c10.push(`key:${a11}`), "string" == typeof d11 ? c10.push(`str:${d11}`) : c10.push("file", d11.name, d11.type, `bytes:${bZ(await d11.arrayBuffer())}`);
          else if ("function" == typeof f2.arrayBuffer) {
            let a11 = await f2.arrayBuffer();
            c10.push("blob", f2.type, `bytes:${bZ(a11)}`), b10._ogBody = new Blob([a11], { type: f2.type }), e10 = f2.type;
          } else if ("string" == typeof f2) c10.push(`str:${f2}`), b10._ogBody = f2, e10 = "text/plain;charset=UTF-8";
          else throw Object.defineProperty(Error(`Unsupported body type: ${typeof f2}`), "__NEXT_ERROR_CODE", { value: "E1443", enumerable: false, configurable: true });
          let g2 = "function" == typeof (b10.headers || {}).keys ? Object.fromEntries(b10.headers) : Object.assign({}, b10.headers);
          return "traceparent" in g2 && delete g2.traceparent, "tracestate" in g2 && delete g2.tracestate, b$(JSON.stringify(["v4", this.fetchCacheKeyPrefix || "", a10, b10.method, e10, g2, b10.mode, b10.redirect, b10.credentials, b10.referrer, b10.referrerPolicy, b10.integrity, b10.cache, c10]));
        }
        async get(a10, b10) {
          var c10, d10, e10, f2, g2, h2, i2;
          let j2, k2;
          if (b10.kind === bu.FETCH) {
            let c11 = aK.FP.getStore(), d11 = c11 ? (0, aK.Kr)(c11) : null;
            if (d11) {
              let c12 = d11.fetch.get(a10);
              if ((null == c12 ? void 0 : c12.kind) === bt.FETCH) {
                let d12 = X.J.getStore();
                if (![...b10.tags || [], ...b10.softTags || []].some((a11) => {
                  var b11, c13;
                  return (null == (b11 = this.revalidatedTags) ? void 0 : b11.includes(a11)) || (null == d12 || null == (c13 = d12.pendingRevalidatedTags) ? void 0 : c13.some((b12) => b12.tag === a11));
                })) return b_.debug && console.log("IncrementalCache: rdc:hit", a10), { isStale: false, value: c12 };
                b_.debug && console.log("IncrementalCache: rdc:revalidated-tag", a10);
              } else b_.debug && console.log("IncrementalCache: rdc:miss", a10);
            } else b_.debug && console.log("IncrementalCache: rdc:no-resume-data");
          }
          if (this.disableForTestmode || this.dev && (b10.kind !== bu.FETCH || "no-cache" === this.requestHeaders["cache-control"])) return null;
          a10 = this._getPathname(a10, b10.kind === bu.FETCH);
          let l2 = await (null == (c10 = this.cacheHandler) ? void 0 : c10.get(a10, b10));
          if (b10.kind === bu.FETCH) {
            if (!l2) return null;
            if ((null == (e10 = l2.value) ? void 0 : e10.kind) !== bt.FETCH) throw Object.defineProperty(new aN.z(`Expected cached value for cache key ${JSON.stringify(a10)} to be a "FETCH" kind, got ${JSON.stringify(null == (f2 = l2.value) ? void 0 : f2.kind)} instead.`), "__NEXT_ERROR_CODE", { value: "E653", enumerable: false, configurable: true });
            let c11 = X.J.getStore(), d11 = [...b10.tags || [], ...b10.softTags || []];
            if (d11.some((a11) => {
              var b11, d12;
              return (null == (b11 = this.revalidatedTags) ? void 0 : b11.includes(a11)) || (null == c11 || null == (d12 = c11.pendingRevalidatedTags) ? void 0 : d12.some((b12) => b12.tag === a11));
            })) return b_.debug && console.log("IncrementalCache: expired tag", a10), null;
            let g3 = aK.FP.getStore();
            if (g3) {
              let b11 = (0, aK.Kr)(g3);
              (null == b11 ? void 0 : b11.mutable) && (b_.debug && console.log("IncrementalCache: rdc:set", a10), b11.fetch.set(a10, l2.value));
            }
            let h3 = b10.revalidate || l2.value.revalidate, i3 = (performance.timeOrigin + performance.now() - (l2.lastModified || 0)) / 1e3 > h3, j3 = l2.value.data;
            return aS(d11, l2.lastModified) ? null : (aT(d11, l2.lastModified) && (i3 = true), { isStale: i3, value: { kind: bt.FETCH, data: j3, revalidate: h3 } });
          }
          if ((null == l2 || null == (d10 = l2.value) ? void 0 : d10.kind) === bt.FETCH) throw Object.defineProperty(new aN.z(`Expected cached value for cache key ${JSON.stringify(a10)} not to be a ${JSON.stringify(b10.kind)} kind, got "FETCH" instead.`), "__NEXT_ERROR_CODE", { value: "E652", enumerable: false, configurable: true });
          let m2 = null, { isFallback: n2 } = b10, o2 = this.cacheControls.get(bX(a10));
          if ((null == l2 ? void 0 : l2.lastModified) === -1) j2 = -1, k2 = -1 * ab.eM * 1e3;
          else {
            let c11 = performance.timeOrigin + performance.now(), d11 = (null == l2 ? void 0 : l2.lastModified) || c11;
            k2 = this.calculateRevalidate(a10, d11, this.dev ?? false, b10.isFallback);
            let e11 = "number" == typeof (null == o2 ? void 0 : o2.expire) ? 1e3 * o2.expire + d11 : void 0;
            if (void 0 !== e11 && e11 < c11) j2 = -1;
            else if (void 0 === (j2 = false !== k2 && k2 < c11 || void 0) && ((null == l2 || null == (g2 = l2.value) ? void 0 : g2.kind) === bt.APP_PAGE || (null == l2 || null == (h2 = l2.value) ? void 0 : h2.kind) === bt.APP_ROUTE)) {
              let a11 = null == (i2 = l2.value.headers) ? void 0 : i2[ab.VC];
              if ("string" == typeof a11) {
                let b11 = a11.split(",");
                b11.length > 0 && (aS(b11, d11) ? j2 = -1 : aT(b11, d11) && (j2 = true));
              }
            }
          }
          return l2 && (m2 = { isStale: j2, cacheControl: o2, revalidateAfter: k2, value: l2.value, isFallback: n2 }), !l2 && this.prerenderManifest.notFoundRoutes.includes(a10) && (m2 = { isStale: j2, value: null, cacheControl: o2, revalidateAfter: k2, isFallback: n2 }, this.set(a10, m2.value, { ...b10, cacheControl: o2 })), m2;
        }
        async set(a10, b10, c10) {
          if ((null == b10 ? void 0 : b10.kind) === bt.FETCH) {
            let c11 = aK.FP.getStore(), d11 = c11 ? (0, aK.Kr)(c11) : null;
            (null == d11 ? void 0 : d11.mutable) && (b_.debug && console.log("IncrementalCache: rdc:set", a10), d11.fetch.set(a10, b10));
          }
          if (this.disableForTestmode || this.dev && !c10.fetchCache) return;
          a10 = this._getPathname(a10, c10.fetchCache);
          let d10 = JSON.stringify(b10).length;
          if (c10.fetchCache && d10 > 2097152 && !this.hasCustomCacheHandler && !c10.isImplicitBuildTimeCache) {
            let b11 = `Failed to set Next.js data cache for ${c10.fetchUrl || a10}, items over 2MB can not be cached (${d10} bytes)`;
            if (this.dev) throw Object.defineProperty(Error(b11), "__NEXT_ERROR_CODE", { value: "E1003", enumerable: false, configurable: true });
            console.warn(b11);
            return;
          }
          try {
            var e10;
            !c10.fetchCache && c10.cacheControl && this.cacheControls.set(bX(a10), c10.cacheControl), await (null == (e10 = this.cacheHandler) ? void 0 : e10.set(a10, b10, c10));
          } catch (b11) {
            console.warn("Failed to update prerender cache for", a10, b11);
          }
        }
      }
      var b0 = c(9437), b1 = c(2119), b2 = c(2896);
      let b3 = globalThis.crypto.subtle;
      var b4 = Object.defineProperty, b5 = {}, b6 = { UpstashError: () => b8, UpstashJSONParseError: () => ca, UrlError: () => b9 };
      for (var b7 in b6) b4(b5, b7, { get: b6[b7], enumerable: true });
      var b8 = class extends Error {
        constructor(a10, b10) {
          super(a10, b10), this.name = "UpstashError";
        }
      }, b9 = class extends Error {
        constructor(a10) {
          super(`Upstash Redis client was passed an invalid URL. You should pass a URL starting with https. Received: "${a10}". `), this.name = "UrlError";
        }
      }, ca = class extends b8 {
        constructor(a10, b10) {
          const c10 = a10.length > 200 ? a10.slice(0, 200) + "..." : a10;
          super(`Unable to parse response body: ${c10}`, b10), this.name = "UpstashJSONParseError";
        }
      };
      function cb(a10) {
        try {
          return function a11(b10) {
            let c10 = Array.isArray(b10) ? b10.map((b11) => {
              try {
                return a11(b11);
              } catch {
                return b11;
              }
            }) : JSON.parse(b10);
            return "number" == typeof c10 && c10.toString() !== b10 ? b10 : c10;
          }(a10);
        } catch {
          return a10;
        }
      }
      function cc(a10) {
        return [a10[0], ...cb(a10.slice(1))];
      }
      function cd(a10) {
        let [b10, c10] = a10, d10 = [];
        for (let a11 = 0; a11 < c10.length; a11 += 2) d10.push({ key: c10[a11], type: c10[a11 + 1] });
        return [b10, d10];
      }
      function ce(a10) {
        if ("object" == typeof a10 && null !== a10 && !Array.isArray(a10)) return a10;
        if (!Array.isArray(a10)) return {};
        let b10 = {};
        for (let c10 = 0; c10 < a10.length; c10 += 2) "string" == typeof a10[c10] && (b10[a10[c10]] = a10[c10 + 1]);
        return b10;
      }
      var cf = class {
        baseUrl;
        headers;
        options;
        readYourWrites;
        upstashSyncToken = "";
        hasCredentials;
        retry;
        constructor(a10) {
          if (this.options = { backend: a10.options?.backend, agent: a10.agent, responseEncoding: a10.responseEncoding ?? "base64", cache: a10.cache, signal: a10.signal, keepAlive: a10.keepAlive ?? true }, this.upstashSyncToken = "", this.readYourWrites = a10.readYourWrites ?? true, this.baseUrl = (a10.baseUrl || "").replace(/\/$/, ""), this.baseUrl && !/^https?:\/\/[^\s#$./?].\S*$/.test(this.baseUrl)) throw new b9(this.baseUrl);
          this.headers = { "Content-Type": "application/json", ...a10.headers }, this.hasCredentials = !!(this.baseUrl && this.headers.authorization.split(" ")[1]), "base64" === this.options.responseEncoding && (this.headers["Upstash-Encoding"] = "base64"), this.retry = "boolean" != typeof a10.retry || a10.retry ? { attempts: a10.retry?.retries ?? 5, backoff: a10.retry?.backoff ?? ((a11) => 50 * Math.exp(a11)) } : { attempts: 1, backoff: () => 0 };
        }
        mergeTelemetry(a10) {
          this.headers = ci(this.headers, "Upstash-Telemetry-Runtime", a10.runtime), this.headers = ci(this.headers, "Upstash-Telemetry-Platform", a10.platform), this.headers = ci(this.headers, "Upstash-Telemetry-Sdk", a10.sdk);
        }
        async request(a10) {
          let b10, c10 = function(...a11) {
            let b11 = {};
            for (let c11 of a11) if (c11) for (let [a12, d11] of Object.entries(c11)) null != d11 && (b11[a12] = d11);
            return b11;
          }(this.headers, a10.headers ?? {}), d10 = [this.baseUrl, ...a10.path ?? []].join("/"), e10 = "text/event-stream" === c10.Accept, f2 = a10.signal ?? this.options.signal, g2 = "function" == typeof f2, h2 = { cache: this.options.cache, method: "POST", headers: c10, body: JSON.stringify(a10.body), keepalive: this.options.keepAlive, agent: this.options.agent, signal: g2 ? f2() : f2, backend: this.options.backend };
          if (this.hasCredentials || console.warn("[Upstash Redis] Redis client was initialized without url or token. Failed to execute command."), this.readYourWrites) {
            let a11 = this.upstashSyncToken;
            this.headers["upstash-sync-token"] = a11;
          }
          let i2 = null, j2 = null;
          for (let a11 = 0; a11 <= this.retry.attempts; a11++) try {
            i2 = await fetch(d10, h2);
            break;
          } catch (b11) {
            if (h2.signal?.aborted && g2) throw b11;
            if (h2.signal?.aborted) {
              i2 = new Response(new Blob([JSON.stringify({ result: h2.signal.reason ?? "Aborted" })]), { status: 200, statusText: h2.signal.reason ?? "Aborted" });
              break;
            }
            j2 = b11, a11 < this.retry.attempts && await new Promise((b12) => setTimeout(b12, this.retry.backoff(a11)));
          }
          if (!i2) throw j2 ?? Error("Exhausted all retries");
          if (!i2.ok) {
            let b11, c11 = await i2.text();
            try {
              b11 = JSON.parse(c11);
            } catch (a11) {
              throw new ca(c11, { cause: a11 });
            }
            throw new b8(`${b11.error}, command was: ${JSON.stringify(a10.body)}`);
          }
          if (this.readYourWrites) {
            let a11 = i2.headers;
            this.upstashSyncToken = a11.get("upstash-sync-token") ?? "";
          }
          if (e10 && a10 && a10.onMessage && i2.body) {
            let b11 = i2.body.getReader(), c11 = new TextDecoder();
            return (async () => {
              try {
                let d11 = "";
                for (; ; ) {
                  let { value: e11, done: f3 } = await b11.read();
                  if (f3) break;
                  let g3 = (d11 += c11.decode(e11, { stream: true })).split("\n");
                  if ((d11 = g3.pop() || "").length > 1048576) throw Error("Buffer size exceeded (1MB)");
                  for (let b12 of g3) if (b12.startsWith("data: ")) {
                    let c12 = b12.slice(6);
                    a10.onMessage?.(c12);
                  }
                }
              } catch (a11) {
                a11 instanceof Error && "AbortError" === a11.name || console.error("Stream reading error:", a11);
              } finally {
                try {
                  await b11.cancel();
                } catch {
                }
              }
            })(), { result: 1 };
          }
          let k2 = await i2.text();
          try {
            b10 = JSON.parse(k2);
          } catch (a11) {
            throw new ca(k2, { cause: a11 });
          }
          if (this.readYourWrites) {
            let a11 = i2.headers;
            this.upstashSyncToken = a11.get("upstash-sync-token") ?? "";
          }
          return "base64" === this.options.responseEncoding ? Array.isArray(b10) ? b10.map(({ result: a11, error: b11 }) => ({ result: ch(a11), error: b11 })) : { result: ch(b10.result), error: b10.error } : b10;
        }
      };
      function cg(a10) {
        let b10 = "";
        try {
          let c10 = atob(a10), d10 = c10.length, e10 = new Uint8Array(d10);
          for (let a11 = 0; a11 < d10; a11++) e10[a11] = c10.charCodeAt(a11);
          b10 = new TextDecoder().decode(e10);
        } catch {
          b10 = a10;
        }
        return b10;
      }
      function ch(a10) {
        let b10;
        switch (typeof a10) {
          case "undefined":
            return a10;
          case "number":
            b10 = a10;
            break;
          case "object":
            b10 = Array.isArray(a10) ? a10.map((a11) => "string" == typeof a11 ? cg(a11) : Array.isArray(a11) ? a11.map((a12) => ch(a12)) : a11) : null;
            break;
          case "string":
            b10 = "OK" === a10 ? "OK" : cg(a10);
        }
        return b10;
      }
      function ci(a10, b10, c10) {
        if (!c10) return a10;
        if (!a10[b10]) return a10[b10] = c10, a10;
        let d10 = a10[b10].split(",");
        return d10.includes(c10) || (d10.push(c10), a10[b10] = d10.join(",")), a10;
      }
      var cj = (a10) => {
        switch (typeof a10) {
          case "string":
          case "number":
          case "boolean":
            return a10;
          default:
            return JSON.stringify(a10);
        }
      }, ck = class {
        command;
        serialize;
        deserialize;
        headers;
        path;
        onMessage;
        isStreaming;
        signal;
        constructor(a10, b10) {
          if (this.serialize = cj, this.deserialize = b10?.automaticDeserialization === void 0 || b10.automaticDeserialization ? b10?.deserialize ?? cb : (a11) => a11, this.command = a10.map((a11) => this.serialize(a11)), this.headers = b10?.headers, this.path = b10?.path, this.onMessage = b10?.streamOptions?.onMessage, this.isStreaming = b10?.streamOptions?.isStreaming ?? false, this.signal = b10?.streamOptions?.signal, b10?.latencyLogging) {
            const a11 = this.exec.bind(this);
            this.exec = async (b11) => {
              let c10 = performance.now(), d10 = await a11(b11), e10 = (performance.now() - c10).toFixed(2);
              return console.log(`Latency for \x1B[38;2;19;185;39m${this.command[0].toString().toUpperCase()}\x1B[0m: \x1B[38;2;0;255;255m${e10} ms\x1B[0m`), d10;
            };
          }
        }
        async exec(a10) {
          let { result: b10, error: c10 } = await a10.request({ body: this.command, path: this.path, upstashSyncToken: a10.upstashSyncToken, headers: this.headers, onMessage: this.onMessage, isStreaming: this.isStreaming, signal: this.signal });
          if (c10) throw new b8(c10);
          if (void 0 === b10) throw TypeError("Request did not return a result");
          return this.deserialize(b10);
        }
      }, cl = class extends ck {
        constructor(a10, b10) {
          super(a10.map((a11) => "string" == typeof a11 ? a11 : String(a11)), b10);
        }
      }, cm = ["TEXT", "U64", "I64", "F64", "BOOL", "DATE", "KEYWORD", "FACET"];
      function cn(a10) {
        return "string" == typeof a10 && cm.includes(a10);
      }
      function co(a10) {
        return "object" == typeof a10 && null !== a10 && "type" in a10 && cn(a10.type);
      }
      function cp(a10) {
        let b10 = {};
        for (let c10 = 0; c10 < a10.length; c10 += 2) {
          let d10 = a10[c10], e10 = a10[c10 + 1];
          if (Array.isArray(e10) && e10.length > 0) "string" == typeof e10[0] ? b10[d10] = cp(e10) : Array.isArray(e10[0]) && "string" == typeof e10[0][0] ? b10[d10] = e10.map((a11) => cp(a11)) : b10[d10] = e10;
          else b10[d10] = "string" != typeof e10 || "" === e10 || Number.isNaN(Number(e10)) ? e10 : Number(e10);
        }
        return b10;
      }
      function cq(a10, b10, c10) {
        let d10 = [a10, b10, JSON.stringify(c10?.filter ?? {})];
        if (c10?.limit !== void 0 && d10.push("LIMIT", c10.limit.toString()), c10?.offset !== void 0 && d10.push("OFFSET", c10.offset.toString()), c10?.select && 0 === Object.keys(c10.select).length && d10.push("NOCONTENT"), c10) if ("orderBy" in c10 && c10.orderBy) for (let [a11, b11] of (d10.push("ORDERBY"), Object.entries(c10.orderBy))) d10.push(a11, b11);
        else "scoreFunc" in c10 && c10.scoreFunc && d10.push("SCOREFUNC", ...function(a11) {
          let b11 = [];
          if ("string" == typeof a11) b11.push("FIELDVALUE", a11);
          else if ("fields" in a11) for (let c11 of (a11.combineMode && b11.push("COMBINEMODE", a11.combineMode.toUpperCase()), a11.scoreMode && b11.push("SCOREMODE", a11.scoreMode.toUpperCase()), a11.fields)) b11.push(...cr(c11));
          else b11.push(...cr(a11));
          return b11;
        }(c10.scoreFunc));
        return c10?.highlight && (d10.push("HIGHLIGHT", "FIELDS", c10.highlight.fields.length.toString(), ...c10.highlight.fields), c10.highlight.preTag && c10.highlight.postTag && d10.push("TAGS", c10.highlight.preTag, c10.highlight.postTag)), c10?.select && Object.keys(c10.select).length > 0 && d10.push("SELECT", Object.keys(c10.select).length.toString(), ...Object.keys(c10.select)), d10;
      }
      function cr(a10) {
        let b10 = [];
        return "string" == typeof a10 ? b10.push("FIELDVALUE", a10) : (a10.scoreMode && b10.push("SCOREMODE", a10.scoreMode.toUpperCase()), b10.push("FIELDVALUE", a10.field), a10.modifier && b10.push("MODIFIER", a10.modifier.toUpperCase()), void 0 !== a10.factor && b10.push("FACTOR", a10.factor.toString()), void 0 !== a10.missing && b10.push("MISSING", a10.missing.toString())), b10;
      }
      var cs = class {
        name;
        schema;
        client;
        constructor({ name: a10, schema: b10, client: c10 }) {
          this.name = a10, this.schema = b10, this.client = c10;
        }
        async waitIndexing() {
          let a10 = ["SEARCH.WAITINDEXING", this.name];
          return await new cl(a10).exec(this.client);
        }
        async describe() {
          let a10 = ["SEARCH.DESCRIBE", this.name], b10 = await new cl(a10).exec(this.client);
          return b10 ? function(a11) {
            let b11 = {};
            for (let c10 = 0; c10 < a11.length; c10 += 2) switch (a11[c10]) {
              case "name":
                b11.name = a11[c10 + 1];
                break;
              case "type":
                b11.dataType = a11[c10 + 1].toLowerCase();
                break;
              case "prefixes":
                b11.prefixes = a11[c10 + 1];
                break;
              case "language":
                b11.language = a11[c10 + 1];
                break;
              case "schema": {
                let d10 = {};
                for (let b12 of a11[c10 + 1]) {
                  let a12 = b12[0], c11 = { type: b12[1] };
                  if (b12.length > 2) for (let a13 = 2; a13 < b12.length; a13++) switch (b12[a13]) {
                    case "NOSTEM":
                      c11.noStem = true;
                      break;
                    case "NOTOKENIZE":
                      c11.noTokenize = true;
                      break;
                    case "FAST":
                      c11.fast = true;
                      break;
                    case "FROM":
                      c11.from = b12[++a13];
                  }
                  d10[a12] = c11;
                }
                b11.schema = d10;
              }
            }
            return b11;
          }(b10) : null;
        }
        async query(a10) {
          let b10 = cq("SEARCH.QUERY", this.name, a10), c10 = await new cl(b10).exec(this.client);
          return c10 ? c10.map((a11) => {
            let b11 = a11[0], c11 = Number(a11[1]), d10 = a11[2];
            if (void 0 === d10) return { key: b11, score: c11 };
            if (!Array.isArray(d10) || 0 === d10.length) return { key: b11, score: c11, data: {} };
            let e10 = {};
            for (let a12 of d10) {
              let b12 = a12[0], c12 = a12[1], d11 = b12.split(".");
              if (1 === d11.length) e10[b12] = c12;
              else {
                let a13 = e10;
                for (let b13 = 0; b13 < d11.length - 1; b13++) {
                  let c13 = d11[b13];
                  c13 in a13 || (a13[c13] = {}), a13 = a13[c13];
                }
                a13[d11.at(-1)] = c12;
              }
            }
            return "$" in e10 && (e10 = e10.$), { key: b11, score: c11, data: e10 };
          }) : c10;
        }
        async aggregate(a10) {
          var b10;
          let c10 = (b10 = this.name, ["SEARCH.AGGREGATE", b10, JSON.stringify(a10?.filter ?? {}), JSON.stringify(a10.aggregations)]);
          return function a11(b11) {
            let c11 = {};
            for (let d10 = 0; d10 < b11.length; d10 += 2) {
              let e10 = b11[d10], f2 = b11[d10 + 1];
              Array.isArray(f2) ? f2.length > 0 && "string" == typeof f2[0] ? c11[e10] = "buckets" === f2[0] ? function(a12) {
                if ("buckets" === a12[0] && Array.isArray(a12[1])) {
                  let b12 = { buckets: a12[1].map((a13) => {
                    let b13 = {};
                    for (let c12 = 0; c12 < a13.length; c12 += 2) {
                      let d11 = a13[c12], e11 = a13[c12 + 1];
                      b13[d11] = Array.isArray(e11) && e11.length > 0 && "string" == typeof e11[0] ? cp(e11) : e11;
                    }
                    return b13;
                  }) };
                  for (let c12 = 2; c12 < a12.length; c12 += 2) b12[a12[c12]] = a12[c12 + 1];
                  return b12;
                }
                return a12;
              }(f2) : cp(f2) : c11[e10] = a11(f2) : c11[e10] = f2;
            }
            return c11;
          }(await new cl(c10).exec(this.client));
        }
        async count({ filter: a10 }) {
          var b10;
          let c10 = cq("SEARCH.COUNT", this.name, { filter: a10 });
          return { count: "number" == typeof (b10 = await new cl(c10).exec(this.client)) ? b10 : Number.parseInt(b10, 10) };
        }
        async drop() {
          let a10 = ["SEARCH.DROP", this.name];
          return await new cl(a10).exec(this.client);
        }
        async addAlias({ alias: a10 }) {
          let b10 = ["SEARCH.ALIASADD", a10, this.name];
          return await new cl(b10).exec(this.client);
        }
      };
      async function ct(a10, b10) {
        let { name: c10, schema: d10 } = b10, e10 = function(a11) {
          let { name: b11, schema: c11, dataType: d11, prefix: e11, language: f2, skipInitialScan: g2, existsOk: h2 } = a11, i2 = Array.isArray(e11) ? e11 : [e11], j2 = [b11, ...g2 ? ["SKIPINITIALSCAN"] : [], ...h2 ? ["EXISTSOK"] : [], "ON", d11.toUpperCase(), "PREFIX", i2.length.toString(), ...i2, ...f2 ? ["LANGUAGE", f2] : [], "SCHEMA"];
          for (let a12 of function a13(b12, c12 = []) {
            let d12 = [];
            for (let [e12, f3] of Object.entries(b12)) {
              let b13 = [...c12, e12], g3 = b13.join(".");
              if (cn(f3)) d12.push({ path: g3, type: f3 });
              else if (co(f3)) d12.push({ path: g3, type: f3.type, fast: "fast" in f3 ? f3.fast : void 0, noTokenize: "noTokenize" in f3 ? f3.noTokenize : void 0, noStem: "noStem" in f3 ? f3.noStem : void 0, from: "from" in f3 ? f3.from : void 0 });
              else if ("object" == typeof f3 && null !== f3 && !co(f3)) {
                let c13 = a13(f3, b13);
                d12.push(...c13);
              }
            }
            return d12;
          }(c11)) j2.push(a12.path, a12.type), a12.fast && j2.push("FAST"), a12.noTokenize && j2.push("NOTOKENIZE"), a12.noStem && j2.push("NOSTEM"), a12.from && j2.push("FROM", a12.from);
          return ["SEARCH.CREATE", ...j2];
        }(b10);
        return await new cl(e10).exec(a10), cu(a10, { name: c10, schema: d10 });
      }
      function cu(a10, b10) {
        let { name: c10, schema: d10 } = b10;
        return new cs({ name: c10, schema: d10, client: a10 });
      }
      async function cv(a10) {
        let b10 = await new cl(["SEARCH.LISTALIASES"]).exec(a10);
        if (0 === b10 || Array.isArray(b10) && 0 === b10.length || !Array.isArray(b10)) return {};
        let c10 = {};
        for (let a11 of b10) if (Array.isArray(a11) && 2 === a11.length) {
          let [b11, d10] = a11;
          c10[b11] = d10;
        }
        return c10;
      }
      async function cw(a10, { indexName: b10, alias: c10 }) {
        return await new cl(["SEARCH.ALIASADD", c10, b10]).exec(a10);
      }
      async function cx(a10, { alias: b10 }) {
        return await new cl(["SEARCH.ALIASDEL", b10]).exec(a10);
      }
      var cy = class extends ck {
        constructor(a10, b10) {
          const c10 = ["hrandfield", a10[0]];
          "number" == typeof a10[1] && c10.push(a10[1]), a10[2] && c10.push("WITHVALUES"), super(c10, { deserialize: a10[2] ? (a11) => function(a12) {
            if (0 === a12.length) return null;
            let b11 = {};
            for (let c11 = 0; c11 < a12.length; c11 += 2) {
              let d10 = a12[c11], e10 = a12[c11 + 1];
              try {
                b11[d10] = JSON.parse(e10);
              } catch {
                b11[d10] = e10;
              }
            }
            return b11;
          }(a11) : b10?.deserialize, ...b10 });
        }
      }, cz = class extends ck {
        constructor(a10, b10) {
          super(["append", ...a10], b10);
        }
      }, cA = class extends ck {
        constructor([a10, b10, c10], d10) {
          const e10 = ["bitcount", a10];
          "number" == typeof b10 && e10.push(b10), "number" == typeof c10 && e10.push(c10), super(e10, d10);
        }
      }, cB = class {
        constructor(a10, b10, c10, d10 = (a11) => a11.exec(this.client)) {
          this.client = b10, this.opts = c10, this.execOperation = d10, this.command = ["bitfield", ...a10];
        }
        command;
        chain(...a10) {
          return this.command.push(...a10), this;
        }
        get(...a10) {
          return this.chain("get", ...a10);
        }
        set(...a10) {
          return this.chain("set", ...a10);
        }
        incrby(...a10) {
          return this.chain("incrby", ...a10);
        }
        overflow(a10) {
          return this.chain("overflow", a10);
        }
        exec() {
          let a10 = new ck(this.command, this.opts);
          return this.execOperation(a10);
        }
      }, cC = class extends ck {
        constructor(a10, b10) {
          super(["bitop", ...a10], b10);
        }
      }, cD = class extends ck {
        constructor(a10, b10) {
          super(["bitpos", ...a10], b10);
        }
      }, cE = class extends ck {
        constructor([a10, b10], c10) {
          super(["CLIENT", "SETINFO", a10.toUpperCase(), b10], c10);
        }
      }, cF = class extends ck {
        constructor([a10, b10, c10], d10) {
          super(["COPY", a10, b10, ...c10?.replace ? ["REPLACE"] : []], { ...d10, deserialize: (a11) => a11 > 0 ? "COPIED" : "NOT_COPIED" });
        }
      }, cG = class extends ck {
        constructor(a10) {
          super(["dbsize"], a10);
        }
      }, cH = class extends ck {
        constructor(a10, b10) {
          super(["decr", ...a10], b10);
        }
      }, cI = class extends ck {
        constructor(a10, b10) {
          super(["decrby", ...a10], b10);
        }
      }, cJ = class extends ck {
        constructor(a10, b10) {
          super(["del", ...a10], b10);
        }
      }, cK = class extends ck {
        constructor(a10, b10) {
          super(["echo", ...a10], b10);
        }
      }, cL = class extends ck {
        constructor([a10, b10, c10], d10) {
          super(["eval_ro", a10, b10.length, ...b10, ...c10 ?? []], d10);
        }
      }, cM = class extends ck {
        constructor([a10, b10, c10], d10) {
          super(["eval", a10, b10.length, ...b10, ...c10 ?? []], d10);
        }
      }, cN = class extends ck {
        constructor([a10, b10, c10], d10) {
          super(["evalsha_ro", a10, b10.length, ...b10, ...c10 ?? []], d10);
        }
      }, cO = class extends ck {
        constructor([a10, b10, c10], d10) {
          super(["evalsha", a10, b10.length, ...b10, ...c10 ?? []], d10);
        }
      }, cP = class extends ck {
        constructor(a10, b10) {
          super(["exists", ...a10], b10);
        }
      }, cQ = class extends ck {
        constructor(a10, b10) {
          super(["expire", ...a10.filter(Boolean)], b10);
        }
      }, cR = class extends ck {
        constructor(a10, b10) {
          super(["expireat", ...a10], b10);
        }
      }, cS = class extends ck {
        constructor([a10, b10, c10], d10) {
          super(["fcall", a10, ...b10 ? [b10.length, ...b10] : [0], ...c10 ?? []], d10);
        }
      }, cT = class extends ck {
        constructor([a10, b10, c10], d10) {
          super(["fcall_ro", a10, ...b10 ? [b10.length, ...b10] : [0], ...c10 ?? []], d10);
        }
      }, cU = class extends ck {
        constructor(a10, b10) {
          const c10 = ["flushall"];
          a10 && a10.length > 0 && a10[0].async && c10.push("async"), super(c10, b10);
        }
      }, cV = class extends ck {
        constructor([a10], b10) {
          const c10 = ["flushdb"];
          a10?.async && c10.push("async"), super(c10, b10);
        }
      }, cW = class extends ck {
        constructor([a10], b10) {
          super(["function", "delete", a10], b10);
        }
      }, cX = class extends ck {
        constructor(a10) {
          super(["function", "flush"], a10);
        }
      }, cY = class extends ck {
        constructor([a10], b10) {
          const c10 = ["function", "list"];
          a10?.libraryName && c10.push("libraryname", a10.libraryName), a10?.withCode && c10.push("withcode"), super(c10, { deserialize: cZ, ...b10 });
        }
      };
      function cZ(a10) {
        return Array.isArray(a10) ? a10.map((a11) => {
          let b10 = ce(a11), c10 = b10.functions.map((a12) => ce(a12));
          return { libraryName: b10.library_name, engine: b10.engine, functions: c10.map((a12) => ({ name: a12.name, description: a12.description ?? void 0, flags: a12.flags })), libraryCode: b10.library_code };
        }) : [];
      }
      var c$ = class extends ck {
        constructor([a10], b10) {
          super(["function", "load", ...a10.replace ? ["replace"] : [], a10.code], b10);
        }
      }, c_ = class extends ck {
        constructor(a10) {
          super(["function", "stats"], { deserialize: c0, ...a10 });
        }
      };
      function c0(a10) {
        return { engines: Object.fromEntries(Object.entries(Object.fromEntries(Object.entries(ce(ce(a10).engines)).map(([a11, b10]) => [a11, ce(b10)]))).map(([a11, b10]) => [a11, { librariesCount: b10.libraries_count, functionsCount: b10.functions_count }])) };
      }
      var c1 = class extends ck {
        constructor([a10, b10, ...c10], d10) {
          const e10 = ["geoadd", a10];
          "nx" in b10 && b10.nx ? e10.push("nx") : "xx" in b10 && b10.xx && e10.push("xx"), "ch" in b10 && b10.ch && e10.push("ch"), "latitude" in b10 && b10.latitude && e10.push(b10.longitude, b10.latitude, b10.member), e10.push(...c10.flatMap(({ latitude: a11, longitude: b11, member: c11 }) => [b11, a11, c11])), super(e10, d10);
        }
      }, c2 = class extends ck {
        constructor([a10, b10, c10, d10 = "M"], e10) {
          super(["GEODIST", a10, b10, c10, d10], e10);
        }
      }, c3 = class extends ck {
        constructor(a10, b10) {
          const [c10] = a10;
          super(["GEOHASH", c10, ...Array.isArray(a10[1]) ? a10[1] : a10.slice(1)], b10);
        }
      }, c4 = class extends ck {
        constructor(a10, b10) {
          const [c10] = a10;
          super(["GEOPOS", c10, ...Array.isArray(a10[1]) ? a10[1] : a10.slice(1)], { deserialize: (a11) => function(a12) {
            let b11 = [];
            for (let c11 of a12) c11?.[0] && c11?.[1] && b11.push({ lng: Number.parseFloat(c11[0]), lat: Number.parseFloat(c11[1]) });
            return b11;
          }(a11), ...b10 });
        }
      }, c5 = class extends ck {
        constructor([a10, b10, c10, d10, e10], f2) {
          const g2 = ["GEOSEARCH", a10];
          ("FROMMEMBER" === b10.type || "frommember" === b10.type) && g2.push(b10.type, b10.member), ("FROMLONLAT" === b10.type || "fromlonlat" === b10.type) && g2.push(b10.type, b10.coordinate.lon, b10.coordinate.lat), ("BYRADIUS" === c10.type || "byradius" === c10.type) && g2.push(c10.type, c10.radius, c10.radiusType), ("BYBOX" === c10.type || "bybox" === c10.type) && g2.push(c10.type, c10.rect.width, c10.rect.height, c10.rectType), g2.push(d10), e10?.count && g2.push("COUNT", e10.count.limit, ...e10.count.any ? ["ANY"] : []), super([...g2, ...e10?.withCoord ? ["WITHCOORD"] : [], ...e10?.withDist ? ["WITHDIST"] : [], ...e10?.withHash ? ["WITHHASH"] : []], { deserialize: (a11) => e10?.withCoord || e10?.withDist || e10?.withHash ? a11.map((a12) => {
            let b11 = 1, c11 = {};
            try {
              c11.member = JSON.parse(a12[0]);
            } catch {
              c11.member = a12[0];
            }
            return e10.withDist && (c11.dist = Number.parseFloat(a12[b11++])), e10.withHash && (c11.hash = a12[b11++].toString()), e10.withCoord && (c11.coord = { long: Number.parseFloat(a12[b11][0]), lat: Number.parseFloat(a12[b11][1]) }), c11;
          }) : a11.map((a12) => {
            try {
              return { member: JSON.parse(a12) };
            } catch {
              return { member: a12 };
            }
          }), ...f2 });
        }
      }, c6 = class extends ck {
        constructor([a10, b10, c10, d10, e10, f2], g2) {
          const h2 = ["GEOSEARCHSTORE", a10, b10];
          ("FROMMEMBER" === c10.type || "frommember" === c10.type) && h2.push(c10.type, c10.member), ("FROMLONLAT" === c10.type || "fromlonlat" === c10.type) && h2.push(c10.type, c10.coordinate.lon, c10.coordinate.lat), ("BYRADIUS" === d10.type || "byradius" === d10.type) && h2.push(d10.type, d10.radius, d10.radiusType), ("BYBOX" === d10.type || "bybox" === d10.type) && h2.push(d10.type, d10.rect.width, d10.rect.height, d10.rectType), h2.push(e10), f2?.count && h2.push("COUNT", f2.count.limit, ...f2.count.any ? ["ANY"] : []), super([...h2, ...f2?.storeDist ? ["STOREDIST"] : []], g2);
        }
      }, c7 = class extends ck {
        constructor(a10, b10) {
          super(["get", ...a10], b10);
        }
      }, c8 = class extends ck {
        constructor(a10, b10) {
          super(["getbit", ...a10], b10);
        }
      }, c9 = class extends ck {
        constructor(a10, b10) {
          super(["getdel", ...a10], b10);
        }
      }, da = class extends ck {
        constructor([a10, b10], c10) {
          const d10 = ["getex", a10];
          b10 && ("ex" in b10 && "number" == typeof b10.ex ? d10.push("ex", b10.ex) : "px" in b10 && "number" == typeof b10.px ? d10.push("px", b10.px) : "exat" in b10 && "number" == typeof b10.exat ? d10.push("exat", b10.exat) : "pxat" in b10 && "number" == typeof b10.pxat ? d10.push("pxat", b10.pxat) : "persist" in b10 && b10.persist && d10.push("persist")), super(d10, c10);
        }
      }, db = class extends ck {
        constructor(a10, b10) {
          super(["getrange", ...a10], b10);
        }
      }, dc = class extends ck {
        constructor(a10, b10) {
          super(["getset", ...a10], b10);
        }
      }, dd = class extends ck {
        constructor(a10, b10) {
          super(["hdel", ...a10], b10);
        }
      }, de = class extends ck {
        constructor(a10, b10) {
          super(["hexists", ...a10], b10);
        }
      }, df = class extends ck {
        constructor(a10, b10) {
          const [c10, d10, e10, f2] = a10, g2 = Array.isArray(d10) ? d10 : [d10];
          super(["hexpire", c10, e10, ...f2 ? [f2] : [], "FIELDS", g2.length, ...g2], b10);
        }
      }, dg = class extends ck {
        constructor(a10, b10) {
          const [c10, d10, e10, f2] = a10, g2 = Array.isArray(d10) ? d10 : [d10];
          super(["hexpireat", c10, e10, ...f2 ? [f2] : [], "FIELDS", g2.length, ...g2], b10);
        }
      }, dh = class extends ck {
        constructor(a10, b10) {
          const [c10, d10] = a10, e10 = Array.isArray(d10) ? d10 : [d10];
          super(["hexpiretime", c10, "FIELDS", e10.length, ...e10], b10);
        }
      }, di = class extends ck {
        constructor(a10, b10) {
          const [c10, d10] = a10, e10 = Array.isArray(d10) ? d10 : [d10];
          super(["hpersist", c10, "FIELDS", e10.length, ...e10], b10);
        }
      }, dj = class extends ck {
        constructor(a10, b10) {
          const [c10, d10, e10, f2] = a10, g2 = Array.isArray(d10) ? d10 : [d10];
          super(["hpexpire", c10, e10, ...f2 ? [f2] : [], "FIELDS", g2.length, ...g2], b10);
        }
      }, dk = class extends ck {
        constructor(a10, b10) {
          const [c10, d10, e10, f2] = a10, g2 = Array.isArray(d10) ? d10 : [d10];
          super(["hpexpireat", c10, e10, ...f2 ? [f2] : [], "FIELDS", g2.length, ...g2], b10);
        }
      }, dl = class extends ck {
        constructor(a10, b10) {
          const [c10, d10] = a10, e10 = Array.isArray(d10) ? d10 : [d10];
          super(["hpexpiretime", c10, "FIELDS", e10.length, ...e10], b10);
        }
      }, dm = class extends ck {
        constructor(a10, b10) {
          const [c10, d10] = a10, e10 = Array.isArray(d10) ? d10 : [d10];
          super(["hpttl", c10, "FIELDS", e10.length, ...e10], b10);
        }
      }, dn = class extends ck {
        constructor(a10, b10) {
          super(["hget", ...a10], b10);
        }
      }, dp = class extends ck {
        constructor(a10, b10) {
          super(["hgetall", ...a10], { deserialize: (a11) => function(a12) {
            if (0 === a12.length) return null;
            let b11 = {};
            for (let c10 = 0; c10 < a12.length; c10 += 2) {
              let d10 = a12[c10], e10 = a12[c10 + 1];
              try {
                let a13 = !Number.isNaN(Number(e10)) && !Number.isSafeInteger(Number(e10));
                b11[d10] = a13 ? e10 : JSON.parse(e10);
              } catch {
                b11[d10] = e10;
              }
            }
            return b11;
          }(a11), ...b10 });
        }
      };
      function dq(a10, b10) {
        if (b10.every((a11) => null === a11)) return null;
        let c10 = {};
        for (let [d10, e10] of a10.entries()) try {
          c10[e10] = JSON.parse(b10[d10]);
        } catch {
          c10[e10] = b10[d10];
        }
        return c10;
      }
      var dr = class extends ck {
        constructor([a10, ...b10], c10) {
          super(["hmget", a10, ...b10], { deserialize: (a11) => dq(b10, a11), ...c10 });
        }
      }, ds = class extends ck {
        constructor([a10, ...b10], c10) {
          super(["hgetdel", a10, "FIELDS", b10.length, ...b10], { deserialize: (a11) => dq(b10.map(String), a11), ...c10 });
        }
      }, dt = class extends ck {
        constructor([a10, b10, ...c10], d10) {
          const e10 = ["hgetex", a10];
          "ex" in b10 && "number" == typeof b10.ex ? e10.push("EX", b10.ex) : "px" in b10 && "number" == typeof b10.px ? e10.push("PX", b10.px) : "exat" in b10 && "number" == typeof b10.exat ? e10.push("EXAT", b10.exat) : "pxat" in b10 && "number" == typeof b10.pxat ? e10.push("PXAT", b10.pxat) : "persist" in b10 && b10.persist && e10.push("PERSIST"), e10.push("FIELDS", c10.length, ...c10), super(e10, { deserialize: (a11) => dq(c10.map(String), a11), ...d10 });
        }
      }, du = class extends ck {
        constructor(a10, b10) {
          super(["hincrby", ...a10], b10);
        }
      }, dv = class extends ck {
        constructor(a10, b10) {
          super(["hincrbyfloat", ...a10], b10);
        }
      }, dw = class extends ck {
        constructor([a10], b10) {
          super(["hkeys", a10], b10);
        }
      }, dx = class extends ck {
        constructor(a10, b10) {
          super(["hlen", ...a10], b10);
        }
      }, dy = class extends ck {
        constructor([a10, b10], c10) {
          super(["hmset", a10, ...Object.entries(b10).flatMap(([a11, b11]) => [a11, b11])], c10);
        }
      }, dz = class extends ck {
        constructor([a10, b10, c10], d10) {
          const e10 = ["hscan", a10, b10];
          c10?.match && e10.push("match", c10.match), "number" == typeof c10?.count && e10.push("count", c10.count), super(e10, { deserialize: cc, ...d10 });
        }
      }, dA = class extends ck {
        constructor([a10, b10], c10) {
          super(["hset", a10, ...Object.entries(b10).flatMap(([a11, b11]) => [a11, b11])], c10);
        }
      }, dB = class extends ck {
        constructor([a10, b10, c10], d10) {
          const e10 = ["hsetex", a10];
          b10.conditional && e10.push(b10.conditional.toUpperCase()), b10.expiration && ("ex" in b10.expiration && "number" == typeof b10.expiration.ex ? e10.push("EX", b10.expiration.ex) : "px" in b10.expiration && "number" == typeof b10.expiration.px ? e10.push("PX", b10.expiration.px) : "exat" in b10.expiration && "number" == typeof b10.expiration.exat ? e10.push("EXAT", b10.expiration.exat) : "pxat" in b10.expiration && "number" == typeof b10.expiration.pxat ? e10.push("PXAT", b10.expiration.pxat) : "keepttl" in b10.expiration && b10.expiration.keepttl && e10.push("KEEPTTL"));
          const f2 = Object.entries(c10);
          for (const [a11, b11] of (e10.push("FIELDS", f2.length), f2)) e10.push(a11, b11);
          super(e10, d10);
        }
      }, dC = class extends ck {
        constructor(a10, b10) {
          super(["hsetnx", ...a10], b10);
        }
      }, dD = class extends ck {
        constructor(a10, b10) {
          super(["hstrlen", ...a10], b10);
        }
      }, dE = class extends ck {
        constructor(a10, b10) {
          const [c10, d10] = a10, e10 = Array.isArray(d10) ? d10 : [d10];
          super(["httl", c10, "FIELDS", e10.length, ...e10], b10);
        }
      }, dF = class extends ck {
        constructor(a10, b10) {
          super(["hvals", ...a10], b10);
        }
      }, dG = class extends ck {
        constructor(a10, b10) {
          super(["incr", ...a10], b10);
        }
      }, dH = class extends ck {
        constructor(a10, b10) {
          super(["incrby", ...a10], b10);
        }
      }, dI = class extends ck {
        constructor(a10, b10) {
          super(["incrbyfloat", ...a10], b10);
        }
      }, dJ = class extends ck {
        constructor(a10, b10) {
          super(["JSON.ARRAPPEND", ...a10], b10);
        }
      }, dK = class extends ck {
        constructor(a10, b10) {
          super(["JSON.ARRINDEX", ...a10], b10);
        }
      }, dL = class extends ck {
        constructor(a10, b10) {
          super(["JSON.ARRINSERT", ...a10], b10);
        }
      }, dM = class extends ck {
        constructor(a10, b10) {
          super(["JSON.ARRLEN", a10[0], a10[1] ?? "$"], b10);
        }
      }, dN = class extends ck {
        constructor(a10, b10) {
          super(["JSON.ARRPOP", ...a10], b10);
        }
      }, dO = class extends ck {
        constructor(a10, b10) {
          const c10 = a10[1] ?? "$", d10 = a10[2] ?? 0, e10 = a10[3] ?? 0;
          super(["JSON.ARRTRIM", a10[0], c10, d10, e10], b10);
        }
      }, dP = class extends ck {
        constructor(a10, b10) {
          super(["JSON.CLEAR", ...a10], b10);
        }
      }, dQ = class extends ck {
        constructor(a10, b10) {
          super(["JSON.DEL", ...a10], b10);
        }
      }, dR = class extends ck {
        constructor(a10, b10) {
          super(["JSON.FORGET", ...a10], b10);
        }
      }, dS = class extends ck {
        constructor(a10, b10) {
          const c10 = ["JSON.GET"];
          "string" == typeof a10[1] ? c10.push(...a10) : (c10.push(a10[0]), a10[1] && (a10[1].indent && c10.push("INDENT", a10[1].indent), a10[1].newline && c10.push("NEWLINE", a10[1].newline), a10[1].space && c10.push("SPACE", a10[1].space)), c10.push(...a10.slice(2))), super(c10, b10);
        }
      }, dT = class extends ck {
        constructor(a10, b10) {
          super(["JSON.MERGE", ...a10], b10);
        }
      }, dU = class extends ck {
        constructor(a10, b10) {
          super(["JSON.MGET", ...a10[0], a10[1]], b10);
        }
      }, dV = class extends ck {
        constructor(a10, b10) {
          const c10 = ["JSON.MSET"];
          for (const b11 of a10) c10.push(b11.key, b11.path, b11.value);
          super(c10, b10);
        }
      }, dW = class extends ck {
        constructor(a10, b10) {
          super(["JSON.NUMINCRBY", ...a10], b10);
        }
      }, dX = class extends ck {
        constructor(a10, b10) {
          super(["JSON.NUMMULTBY", ...a10], b10);
        }
      }, dY = class extends ck {
        constructor(a10, b10) {
          super(["JSON.OBJKEYS", ...a10], b10);
        }
      }, dZ = class extends ck {
        constructor(a10, b10) {
          super(["JSON.OBJLEN", ...a10], b10);
        }
      }, d$ = class extends ck {
        constructor(a10, b10) {
          super(["JSON.RESP", ...a10], b10);
        }
      }, d_ = class extends ck {
        constructor(a10, b10) {
          const c10 = ["JSON.SET", a10[0], a10[1], a10[2]];
          a10[3] && (a10[3].nx ? c10.push("NX") : a10[3].xx && c10.push("XX")), super(c10, b10);
        }
      }, d0 = class extends ck {
        constructor(a10, b10) {
          super(["JSON.STRAPPEND", ...a10], b10);
        }
      }, d1 = class extends ck {
        constructor(a10, b10) {
          super(["JSON.STRLEN", ...a10], b10);
        }
      }, d2 = class extends ck {
        constructor(a10, b10) {
          super(["JSON.TOGGLE", ...a10], b10);
        }
      }, d3 = class extends ck {
        constructor(a10, b10) {
          super(["JSON.TYPE", ...a10], b10);
        }
      }, d4 = class extends ck {
        constructor(a10, b10) {
          super(["keys", ...a10], b10);
        }
      }, d5 = class extends ck {
        constructor(a10, b10) {
          super(["lindex", ...a10], b10);
        }
      }, d6 = class extends ck {
        constructor(a10, b10) {
          super(["linsert", ...a10], b10);
        }
      }, d7 = class extends ck {
        constructor(a10, b10) {
          super(["llen", ...a10], b10);
        }
      }, d8 = class extends ck {
        constructor(a10, b10) {
          super(["lmove", ...a10], b10);
        }
      }, d9 = class extends ck {
        constructor(a10, b10) {
          const [c10, d10, e10, f2] = a10;
          super(["LMPOP", c10, ...d10, e10, ...f2 ? ["COUNT", f2] : []], b10);
        }
      }, ea = class extends ck {
        constructor(a10, b10) {
          super(["lpop", ...a10], b10);
        }
      }, eb = class extends ck {
        constructor(a10, b10) {
          const c10 = ["lpos", a10[0], a10[1]];
          "number" == typeof a10[2]?.rank && c10.push("rank", a10[2].rank), "number" == typeof a10[2]?.count && c10.push("count", a10[2].count), "number" == typeof a10[2]?.maxLen && c10.push("maxLen", a10[2].maxLen), super(c10, b10);
        }
      }, ec = class extends ck {
        constructor(a10, b10) {
          super(["lpush", ...a10], b10);
        }
      }, ed = class extends ck {
        constructor(a10, b10) {
          super(["lpushx", ...a10], b10);
        }
      }, ee = class extends ck {
        constructor(a10, b10) {
          super(["lrange", ...a10], b10);
        }
      }, ef = class extends ck {
        constructor(a10, b10) {
          super(["lrem", ...a10], b10);
        }
      }, eg = class extends ck {
        constructor(a10, b10) {
          super(["lset", ...a10], b10);
        }
      }, eh = class extends ck {
        constructor(a10, b10) {
          super(["ltrim", ...a10], b10);
        }
      }, ei = class extends ck {
        constructor(a10, b10) {
          super(["mget", ...Array.isArray(a10[0]) ? a10[0] : a10], b10);
        }
      }, ej = class extends ck {
        constructor([a10], b10) {
          super(["mset", ...Object.entries(a10).flatMap(([a11, b11]) => [a11, b11])], b10);
        }
      }, ek = class extends ck {
        constructor([a10], b10) {
          super(["msetnx", ...Object.entries(a10).flat()], b10);
        }
      }, el = class extends ck {
        constructor(a10, b10) {
          super(["persist", ...a10], b10);
        }
      }, em = class extends ck {
        constructor(a10, b10) {
          super(["pexpire", ...a10], b10);
        }
      }, en = class extends ck {
        constructor(a10, b10) {
          super(["pexpireat", ...a10], b10);
        }
      }, eo = class extends ck {
        constructor(a10, b10) {
          super(["pfadd", ...a10], b10);
        }
      }, ep = class extends ck {
        constructor(a10, b10) {
          super(["pfcount", ...a10], b10);
        }
      }, eq = class extends ck {
        constructor(a10, b10) {
          super(["pfmerge", ...a10], b10);
        }
      }, er = class extends ck {
        constructor(a10, b10) {
          const c10 = ["ping"];
          a10?.[0] !== void 0 && c10.push(a10[0]), super(c10, b10);
        }
      }, es = class extends ck {
        constructor(a10, b10) {
          super(["psetex", ...a10], b10);
        }
      }, et = class extends ck {
        constructor(a10, b10) {
          super(["pttl", ...a10], b10);
        }
      }, eu = class extends ck {
        constructor(a10, b10) {
          super(["publish", ...a10], b10);
        }
      }, ev = class extends ck {
        constructor(a10) {
          super(["randomkey"], a10);
        }
      }, ew = class extends ck {
        constructor(a10, b10) {
          super(["rename", ...a10], b10);
        }
      }, ex = class extends ck {
        constructor(a10, b10) {
          super(["renamenx", ...a10], b10);
        }
      }, ey = class extends ck {
        constructor(a10, b10) {
          super(["rpop", ...a10], b10);
        }
      }, ez = class extends ck {
        constructor(a10, b10) {
          super(["rpush", ...a10], b10);
        }
      }, eA = class extends ck {
        constructor(a10, b10) {
          super(["rpushx", ...a10], b10);
        }
      }, eB = class extends ck {
        constructor(a10, b10) {
          super(["sadd", ...a10], b10);
        }
      }, eC = class extends ck {
        constructor([a10, b10], c10) {
          const d10 = ["scan", a10];
          b10?.match && d10.push("match", b10.match), "number" == typeof b10?.count && d10.push("count", b10.count), b10 && "withType" in b10 && true === b10.withType ? d10.push("withtype") : b10 && "type" in b10 && b10.type && b10.type.length > 0 && d10.push("type", b10.type), super(d10, { deserialize: b10?.withType ? cd : cc, ...c10 });
        }
      }, eD = class extends ck {
        constructor(a10, b10) {
          super(["scard", ...a10], b10);
        }
      }, eE = class extends ck {
        constructor(a10, b10) {
          super(["script", "exists", ...a10], { deserialize: (a11) => a11, ...b10 });
        }
      }, eF = class extends ck {
        constructor([a10], b10) {
          const c10 = ["script", "flush"];
          a10?.sync ? c10.push("sync") : a10?.async && c10.push("async"), super(c10, b10);
        }
      }, eG = class extends ck {
        constructor(a10, b10) {
          super(["script", "load", ...a10], b10);
        }
      }, eH = class extends ck {
        constructor(a10, b10) {
          super(["sdiff", ...a10], b10);
        }
      }, eI = class extends ck {
        constructor(a10, b10) {
          super(["sdiffstore", ...a10], b10);
        }
      }, eJ = class extends ck {
        constructor([a10, b10, c10], d10) {
          const e10 = ["set", a10, b10];
          c10 && ("nx" in c10 && c10.nx ? e10.push("nx") : "xx" in c10 && c10.xx && e10.push("xx"), "get" in c10 && c10.get && e10.push("get"), "ex" in c10 && "number" == typeof c10.ex ? e10.push("ex", c10.ex) : "px" in c10 && "number" == typeof c10.px ? e10.push("px", c10.px) : "exat" in c10 && "number" == typeof c10.exat ? e10.push("exat", c10.exat) : "pxat" in c10 && "number" == typeof c10.pxat ? e10.push("pxat", c10.pxat) : "keepTtl" in c10 && c10.keepTtl && e10.push("keepTtl")), super(e10, d10);
        }
      }, eK = class extends ck {
        constructor(a10, b10) {
          super(["setbit", ...a10], b10);
        }
      }, eL = class extends ck {
        constructor(a10, b10) {
          super(["setex", ...a10], b10);
        }
      }, eM = class extends ck {
        constructor(a10, b10) {
          super(["setnx", ...a10], b10);
        }
      }, eN = class extends ck {
        constructor(a10, b10) {
          super(["setrange", ...a10], b10);
        }
      }, eO = class extends ck {
        constructor(a10, b10) {
          super(["sinter", ...a10], b10);
        }
      }, eP = class extends ck {
        constructor(a10, b10) {
          const [c10, d10] = a10, e10 = ["sintercard", c10.length, ...c10];
          d10?.limit !== void 0 && e10.push("LIMIT", d10.limit), super(e10, b10);
        }
      }, eQ = class extends ck {
        constructor(a10, b10) {
          super(["sinterstore", ...a10], b10);
        }
      }, eR = class extends ck {
        constructor(a10, b10) {
          super(["sismember", ...a10], b10);
        }
      }, eS = class extends ck {
        constructor(a10, b10) {
          super(["smembers", ...a10], b10);
        }
      }, eT = class extends ck {
        constructor(a10, b10) {
          super(["smismember", a10[0], ...a10[1]], b10);
        }
      }, eU = class extends ck {
        constructor(a10, b10) {
          super(["smove", ...a10], b10);
        }
      }, eV = class extends ck {
        constructor([a10, b10], c10) {
          const d10 = ["spop", a10];
          "number" == typeof b10 && d10.push(b10), super(d10, c10);
        }
      }, eW = class extends ck {
        constructor([a10, b10], c10) {
          const d10 = ["srandmember", a10];
          "number" == typeof b10 && d10.push(b10), super(d10, c10);
        }
      }, eX = class extends ck {
        constructor(a10, b10) {
          super(["srem", ...a10], b10);
        }
      }, eY = class extends ck {
        constructor([a10, b10, c10], d10) {
          const e10 = ["sscan", a10, b10];
          c10?.match && e10.push("match", c10.match), "number" == typeof c10?.count && e10.push("count", c10.count), super(e10, { deserialize: cc, ...d10 });
        }
      }, eZ = class extends ck {
        constructor(a10, b10) {
          super(["strlen", ...a10], b10);
        }
      }, e$ = class extends ck {
        constructor(a10, b10) {
          super(["sunion", ...a10], b10);
        }
      }, e_ = class extends ck {
        constructor(a10, b10) {
          super(["sunionstore", ...a10], b10);
        }
      }, e0 = class extends ck {
        constructor(a10) {
          super(["time"], a10);
        }
      }, e1 = class extends ck {
        constructor(a10, b10) {
          super(["touch", ...a10], b10);
        }
      }, e2 = class extends ck {
        constructor(a10, b10) {
          super(["ttl", ...a10], b10);
        }
      }, e3 = class extends ck {
        constructor(a10, b10) {
          super(["type", ...a10], b10);
        }
      }, e4 = class extends ck {
        constructor(a10, b10) {
          super(["unlink", ...a10], b10);
        }
      }, e5 = class extends ck {
        constructor([a10, b10, c10], d10) {
          super(["XACK", a10, b10, ...Array.isArray(c10) ? [...c10] : [c10]], d10);
        }
      }, e6 = class extends ck {
        constructor([a10, b10, c10, ...d10], e10) {
          const f2 = ["XACKDEL", a10, b10];
          f2.push(c10.toUpperCase(), "IDS", d10.length, ...d10), super(f2, e10);
        }
      }, e7 = class extends ck {
        constructor([a10, b10, c10, d10], e10) {
          const f2 = ["XADD", a10];
          for (const [a11, e11] of (d10 && (d10.nomkStream && f2.push("NOMKSTREAM"), d10.trim && (f2.push(d10.trim.type, d10.trim.comparison, d10.trim.threshold), void 0 !== d10.trim.limit && f2.push("LIMIT", d10.trim.limit))), f2.push(b10), Object.entries(c10))) f2.push(a11, e11);
          super(f2, e10);
        }
      }, e8 = class extends ck {
        constructor([a10, b10, c10, d10, e10, f2], g2) {
          const h2 = [];
          f2?.count && h2.push("COUNT", f2.count), f2?.justId && h2.push("JUSTID"), super(["XAUTOCLAIM", a10, b10, c10, d10, e10, ...h2], g2);
        }
      }, e9 = class extends ck {
        constructor([a10, b10, c10, d10, e10, f2], g2) {
          const h2 = Array.isArray(e10) ? [...e10] : [e10], i2 = [];
          f2?.idleMS && i2.push("IDLE", f2.idleMS), f2?.idleMS && i2.push("TIME", f2.timeMS), f2?.retryCount && i2.push("RETRYCOUNT", f2.retryCount), f2?.force && i2.push("FORCE"), f2?.justId && i2.push("JUSTID"), f2?.lastId && i2.push("LASTID", f2.lastId), super(["XCLAIM", a10, b10, c10, d10, ...h2, ...i2], g2);
        }
      }, fa = class extends ck {
        constructor([a10, b10], c10) {
          super(["XDEL", a10, ...Array.isArray(b10) ? [...b10] : [b10]], c10);
        }
      }, fb = class extends ck {
        constructor([a10, b10, ...c10], d10) {
          const e10 = ["XDELEX", a10];
          b10 && e10.push(b10.toUpperCase()), e10.push("IDS", c10.length, ...c10), super(e10, d10);
        }
      }, fc = class extends ck {
        constructor([a10, b10], c10) {
          const d10 = ["XGROUP"];
          switch (b10.type) {
            case "CREATE":
              d10.push("CREATE", a10, b10.group, b10.id), b10.options && (b10.options.MKSTREAM && d10.push("MKSTREAM"), void 0 !== b10.options.ENTRIESREAD && d10.push("ENTRIESREAD", b10.options.ENTRIESREAD.toString()));
              break;
            case "CREATECONSUMER":
              d10.push("CREATECONSUMER", a10, b10.group, b10.consumer);
              break;
            case "DELCONSUMER":
              d10.push("DELCONSUMER", a10, b10.group, b10.consumer);
              break;
            case "DESTROY":
              d10.push("DESTROY", a10, b10.group);
              break;
            case "SETID":
              d10.push("SETID", a10, b10.group, b10.id), b10.options?.ENTRIESREAD !== void 0 && d10.push("ENTRIESREAD", b10.options.ENTRIESREAD.toString());
              break;
            default:
              throw Error("Invalid XGROUP");
          }
          super(d10, c10);
        }
      }, fd = class extends ck {
        constructor([a10, b10], c10) {
          const d10 = [];
          "CONSUMERS" === b10.type ? d10.push("CONSUMERS", a10, b10.group) : d10.push("GROUPS", a10), super(["XINFO", ...d10], c10);
        }
      }, fe = class extends ck {
        constructor(a10, b10) {
          super(["XLEN", ...a10], b10);
        }
      }, ff = class extends ck {
        constructor([a10, b10, c10, d10, e10, f2], g2) {
          const h2 = f2?.consumer === void 0 ? [] : Array.isArray(f2.consumer) ? [...f2.consumer] : [f2.consumer];
          super(["XPENDING", a10, b10, ...f2?.idleTime ? ["IDLE", f2.idleTime] : [], c10, d10, e10, ...h2], g2);
        }
      }, fg = class extends ck {
        constructor([a10, b10, c10, d10], e10) {
          const f2 = ["XRANGE", a10, b10, c10];
          "number" == typeof d10 && f2.push("COUNT", d10), super(f2, { deserialize: (a11) => function(a12) {
            let b11 = {};
            for (let c11 of a12) for (let a13 = 0; a13 < c11.length; a13 += 2) {
              let d11 = c11[a13], e11 = c11[a13 + 1];
              d11 in b11 || (b11[d11] = {});
              for (let a14 = 0; a14 < e11.length; a14 += 2) {
                let c12 = e11[a14], f3 = e11[a14 + 1];
                try {
                  b11[d11][c12] = JSON.parse(f3);
                } catch {
                  b11[d11][c12] = f3;
                }
              }
            }
            return b11;
          }(a11), ...e10 });
        }
      }, fh = class extends ck {
        constructor([a10, b10, c10], d10) {
          if (Array.isArray(a10) && Array.isArray(b10) && a10.length !== b10.length) throw Error("ERR Unbalanced XREAD list of streams: for each stream key an ID or '$' must be specified");
          const e10 = [];
          "number" == typeof c10?.count && e10.push("COUNT", c10.count), "number" == typeof c10?.blockMS && e10.push("BLOCK", c10.blockMS), e10.push("STREAMS", ...Array.isArray(a10) ? [...a10] : [a10], ...Array.isArray(b10) ? [...b10] : [b10]), super(["XREAD", ...e10], d10);
        }
      }, fi = class extends ck {
        constructor([a10, b10, c10, d10, e10], f2) {
          if (Array.isArray(c10) && Array.isArray(d10) && c10.length !== d10.length) throw Error("ERR Unbalanced XREADGROUP list of streams: for each stream key an ID or '$' must be specified");
          const g2 = [];
          "number" == typeof e10?.count && g2.push("COUNT", e10.count), "number" == typeof e10?.blockMS && g2.push("BLOCK", e10.blockMS), "boolean" == typeof e10?.NOACK && e10.NOACK && g2.push("NOACK"), g2.push("STREAMS", ...Array.isArray(c10) ? [...c10] : [c10], ...Array.isArray(d10) ? [...d10] : [d10]), super(["XREADGROUP", "GROUP", a10, b10, ...g2], f2);
        }
      }, fj = class extends ck {
        constructor([a10, b10, c10, d10], e10) {
          const f2 = ["XREVRANGE", a10, b10, c10];
          "number" == typeof d10 && f2.push("COUNT", d10), super(f2, { deserialize: (a11) => function(a12) {
            let b11 = {};
            for (let c11 of a12) for (let a13 = 0; a13 < c11.length; a13 += 2) {
              let d11 = c11[a13], e11 = c11[a13 + 1];
              d11 in b11 || (b11[d11] = {});
              for (let a14 = 0; a14 < e11.length; a14 += 2) {
                let c12 = e11[a14], f3 = e11[a14 + 1];
                try {
                  b11[d11][c12] = JSON.parse(f3);
                } catch {
                  b11[d11][c12] = f3;
                }
              }
            }
            return b11;
          }(a11), ...e10 });
        }
      }, fk = class extends ck {
        constructor([a10, b10], c10) {
          const { limit: d10, strategy: e10, threshold: f2, exactness: g2 = "~" } = b10;
          super(["XTRIM", a10, e10, g2, f2, ...d10 ? ["LIMIT", d10] : []], c10);
        }
      }, fl = class extends ck {
        constructor([a10, b10, ...c10], d10) {
          const e10 = ["zadd", a10];
          "nx" in b10 && b10.nx ? e10.push("nx") : "xx" in b10 && b10.xx && e10.push("xx"), "ch" in b10 && b10.ch && e10.push("ch"), "incr" in b10 && b10.incr && e10.push("incr"), "lt" in b10 && b10.lt ? e10.push("lt") : "gt" in b10 && b10.gt && e10.push("gt"), "score" in b10 && "member" in b10 && e10.push(b10.score, b10.member), e10.push(...c10.flatMap(({ score: a11, member: b11 }) => [a11, b11])), super(e10, d10);
        }
      }, fm = class extends ck {
        constructor(a10, b10) {
          super(["zcard", ...a10], b10);
        }
      }, fn = class extends ck {
        constructor(a10, b10) {
          super(["zcount", ...a10], b10);
        }
      }, fo = class extends ck {
        constructor(a10, b10) {
          super(["zincrby", ...a10], b10);
        }
      }, fp = class extends ck {
        constructor([a10, b10, c10, d10], e10) {
          const f2 = ["zinterstore", a10, b10];
          Array.isArray(c10) ? f2.push(...c10) : f2.push(c10), d10 && ("weights" in d10 && d10.weights ? f2.push("weights", ...d10.weights) : "weight" in d10 && "number" == typeof d10.weight && f2.push("weights", d10.weight), "aggregate" in d10 && f2.push("aggregate", d10.aggregate)), super(f2, e10);
        }
      }, fq = class extends ck {
        constructor(a10, b10) {
          super(["zlexcount", ...a10], b10);
        }
      }, fr = class extends ck {
        constructor([a10, b10], c10) {
          const d10 = ["zpopmax", a10];
          "number" == typeof b10 && d10.push(b10), super(d10, c10);
        }
      }, fs = class extends ck {
        constructor([a10, b10], c10) {
          const d10 = ["zpopmin", a10];
          "number" == typeof b10 && d10.push(b10), super(d10, c10);
        }
      }, ft = class extends ck {
        constructor([a10, b10, c10, d10], e10) {
          const f2 = ["zrange", a10, b10, c10];
          d10?.byScore && f2.push("byscore"), d10?.byLex && f2.push("bylex"), d10?.rev && f2.push("rev"), d10?.count !== void 0 && void 0 !== d10.offset && f2.push("limit", d10.offset, d10.count), d10?.withScores && f2.push("withscores"), super(f2, e10);
        }
      }, fu = class extends ck {
        constructor(a10, b10) {
          super(["zrank", ...a10], b10);
        }
      }, fv = class extends ck {
        constructor(a10, b10) {
          super(["zrem", ...a10], b10);
        }
      }, fw = class extends ck {
        constructor(a10, b10) {
          super(["zremrangebylex", ...a10], b10);
        }
      }, fx = class extends ck {
        constructor(a10, b10) {
          super(["zremrangebyrank", ...a10], b10);
        }
      }, fy = class extends ck {
        constructor(a10, b10) {
          super(["zremrangebyscore", ...a10], b10);
        }
      }, fz = class extends ck {
        constructor(a10, b10) {
          super(["zrevrank", ...a10], b10);
        }
      }, fA = class extends ck {
        constructor([a10, b10, c10], d10) {
          const e10 = ["zscan", a10, b10];
          c10?.match && e10.push("match", c10.match), "number" == typeof c10?.count && e10.push("count", c10.count), super(e10, { deserialize: cc, ...d10 });
        }
      }, fB = class extends ck {
        constructor(a10, b10) {
          super(["zscore", ...a10], b10);
        }
      }, fC = class extends ck {
        constructor([a10, b10, c10], d10) {
          const e10 = ["zunion", a10];
          Array.isArray(b10) ? e10.push(...b10) : e10.push(b10), c10 && ("weights" in c10 && c10.weights ? e10.push("weights", ...c10.weights) : "weight" in c10 && "number" == typeof c10.weight && e10.push("weights", c10.weight), "aggregate" in c10 && e10.push("aggregate", c10.aggregate), c10.withScores && e10.push("withscores")), super(e10, d10);
        }
      }, fD = class extends ck {
        constructor([a10, b10, c10, d10], e10) {
          const f2 = ["zunionstore", a10, b10];
          Array.isArray(c10) ? f2.push(...c10) : f2.push(c10), d10 && ("weights" in d10 && d10.weights ? f2.push("weights", ...d10.weights) : "weight" in d10 && "number" == typeof d10.weight && f2.push("weights", d10.weight), "aggregate" in d10 && f2.push("aggregate", d10.aggregate)), super(f2, e10);
        }
      }, fE = class extends ck {
        constructor(a10, b10) {
          super(["zdiffstore", ...a10], b10);
        }
      }, fF = class extends ck {
        constructor(a10, b10) {
          const [c10, d10] = a10;
          super(["zmscore", c10, ...d10], b10);
        }
      }, fG = class {
        client;
        commands;
        commandOptions;
        multiExec;
        constructor(a10) {
          if (this.client = a10.client, this.commands = [], this.commandOptions = a10.commandOptions, this.multiExec = a10.multiExec ?? false, this.commandOptions?.latencyLogging) {
            const a11 = this.exec.bind(this);
            this.exec = async (b10) => {
              let c10 = performance.now(), d10 = await (b10 ? a11(b10) : a11()), e10 = (performance.now() - c10).toFixed(2);
              return console.log(`Latency for \x1B[38;2;19;185;39m${this.multiExec ? ["MULTI-EXEC"] : ["PIPELINE"].toString().toUpperCase()}\x1B[0m: \x1B[38;2;0;255;255m${e10} ms\x1B[0m`), d10;
            };
          }
        }
        exec = async (a10) => {
          if (0 === this.commands.length) throw Error("Pipeline is empty");
          let b10 = this.multiExec ? ["multi-exec"] : ["pipeline"], c10 = await this.client.request({ path: b10, body: Object.values(this.commands).map((a11) => a11.command) });
          return a10?.keepErrors ? c10.map(({ error: a11, result: b11 }, c11) => ({ error: a11, result: this.commands[c11].deserialize(b11) })) : c10.map(({ error: a11, result: b11 }, c11) => {
            if (a11) throw new b8(`Command ${c11 + 1} [ ${this.commands[c11].command[0]} ] failed: ${a11}`);
            return this.commands[c11].deserialize(b11);
          });
        };
        length() {
          return this.commands.length;
        }
        chain(a10) {
          return this.commands.push(a10), this;
        }
        append = (...a10) => this.chain(new cz(a10, this.commandOptions));
        bitcount = (...a10) => this.chain(new cA(a10, this.commandOptions));
        bitfield = (...a10) => new cB(a10, this.client, this.commandOptions, this.chain.bind(this));
        bitop = (a10, b10, c10, ...d10) => this.chain(new cC([a10, b10, c10, ...d10], this.commandOptions));
        bitpos = (...a10) => this.chain(new cD(a10, this.commandOptions));
        clientSetinfo = (...a10) => this.chain(new cE(a10, this.commandOptions));
        copy = (...a10) => this.chain(new cF(a10, this.commandOptions));
        zdiffstore = (...a10) => this.chain(new fE(a10, this.commandOptions));
        dbsize = () => this.chain(new cG(this.commandOptions));
        decr = (...a10) => this.chain(new cH(a10, this.commandOptions));
        decrby = (...a10) => this.chain(new cI(a10, this.commandOptions));
        del = (...a10) => this.chain(new cJ(a10, this.commandOptions));
        echo = (...a10) => this.chain(new cK(a10, this.commandOptions));
        evalRo = (...a10) => this.chain(new cL(a10, this.commandOptions));
        eval = (...a10) => this.chain(new cM(a10, this.commandOptions));
        evalshaRo = (...a10) => this.chain(new cN(a10, this.commandOptions));
        evalsha = (...a10) => this.chain(new cO(a10, this.commandOptions));
        exists = (...a10) => this.chain(new cP(a10, this.commandOptions));
        expire = (...a10) => this.chain(new cQ(a10, this.commandOptions));
        expireat = (...a10) => this.chain(new cR(a10, this.commandOptions));
        flushall = (a10) => this.chain(new cU(a10, this.commandOptions));
        flushdb = (...a10) => this.chain(new cV(a10, this.commandOptions));
        geoadd = (...a10) => this.chain(new c1(a10, this.commandOptions));
        geodist = (...a10) => this.chain(new c2(a10, this.commandOptions));
        geopos = (...a10) => this.chain(new c4(a10, this.commandOptions));
        geohash = (...a10) => this.chain(new c3(a10, this.commandOptions));
        geosearch = (...a10) => this.chain(new c5(a10, this.commandOptions));
        geosearchstore = (...a10) => this.chain(new c6(a10, this.commandOptions));
        get = (...a10) => this.chain(new c7(a10, this.commandOptions));
        getbit = (...a10) => this.chain(new c8(a10, this.commandOptions));
        getdel = (...a10) => this.chain(new c9(a10, this.commandOptions));
        getex = (...a10) => this.chain(new da(a10, this.commandOptions));
        getrange = (...a10) => this.chain(new db(a10, this.commandOptions));
        getset = (a10, b10) => this.chain(new dc([a10, b10], this.commandOptions));
        hdel = (...a10) => this.chain(new dd(a10, this.commandOptions));
        hexists = (...a10) => this.chain(new de(a10, this.commandOptions));
        hexpire = (...a10) => this.chain(new df(a10, this.commandOptions));
        hexpireat = (...a10) => this.chain(new dg(a10, this.commandOptions));
        hexpiretime = (...a10) => this.chain(new dh(a10, this.commandOptions));
        httl = (...a10) => this.chain(new dE(a10, this.commandOptions));
        hpexpire = (...a10) => this.chain(new dj(a10, this.commandOptions));
        hpexpireat = (...a10) => this.chain(new dk(a10, this.commandOptions));
        hpexpiretime = (...a10) => this.chain(new dl(a10, this.commandOptions));
        hpttl = (...a10) => this.chain(new dm(a10, this.commandOptions));
        hpersist = (...a10) => this.chain(new di(a10, this.commandOptions));
        hget = (...a10) => this.chain(new dn(a10, this.commandOptions));
        hgetall = (...a10) => this.chain(new dp(a10, this.commandOptions));
        hgetdel = (...a10) => this.chain(new ds(a10, this.commandOptions));
        hgetex = (...a10) => this.chain(new dt(a10, this.commandOptions));
        hincrby = (...a10) => this.chain(new du(a10, this.commandOptions));
        hincrbyfloat = (...a10) => this.chain(new dv(a10, this.commandOptions));
        hkeys = (...a10) => this.chain(new dw(a10, this.commandOptions));
        hlen = (...a10) => this.chain(new dx(a10, this.commandOptions));
        hmget = (...a10) => this.chain(new dr(a10, this.commandOptions));
        hmset = (a10, b10) => this.chain(new dy([a10, b10], this.commandOptions));
        hrandfield = (a10, b10, c10) => this.chain(new cy([a10, b10, c10], this.commandOptions));
        hscan = (...a10) => this.chain(new dz(a10, this.commandOptions));
        hset = (a10, b10) => this.chain(new dA([a10, b10], this.commandOptions));
        hsetex = (...a10) => this.chain(new dB(a10, this.commandOptions));
        hsetnx = (a10, b10, c10) => this.chain(new dC([a10, b10, c10], this.commandOptions));
        hstrlen = (...a10) => this.chain(new dD(a10, this.commandOptions));
        hvals = (...a10) => this.chain(new dF(a10, this.commandOptions));
        incr = (...a10) => this.chain(new dG(a10, this.commandOptions));
        incrby = (...a10) => this.chain(new dH(a10, this.commandOptions));
        incrbyfloat = (...a10) => this.chain(new dI(a10, this.commandOptions));
        keys = (...a10) => this.chain(new d4(a10, this.commandOptions));
        lindex = (...a10) => this.chain(new d5(a10, this.commandOptions));
        linsert = (a10, b10, c10, d10) => this.chain(new d6([a10, b10, c10, d10], this.commandOptions));
        llen = (...a10) => this.chain(new d7(a10, this.commandOptions));
        lmove = (...a10) => this.chain(new d8(a10, this.commandOptions));
        lpop = (...a10) => this.chain(new ea(a10, this.commandOptions));
        lmpop = (...a10) => this.chain(new d9(a10, this.commandOptions));
        lpos = (...a10) => this.chain(new eb(a10, this.commandOptions));
        lpush = (a10, ...b10) => this.chain(new ec([a10, ...b10], this.commandOptions));
        lpushx = (a10, ...b10) => this.chain(new ed([a10, ...b10], this.commandOptions));
        lrange = (...a10) => this.chain(new ee(a10, this.commandOptions));
        lrem = (a10, b10, c10) => this.chain(new ef([a10, b10, c10], this.commandOptions));
        lset = (a10, b10, c10) => this.chain(new eg([a10, b10, c10], this.commandOptions));
        ltrim = (...a10) => this.chain(new eh(a10, this.commandOptions));
        mget = (...a10) => this.chain(new ei(a10, this.commandOptions));
        mset = (a10) => this.chain(new ej([a10], this.commandOptions));
        msetnx = (a10) => this.chain(new ek([a10], this.commandOptions));
        persist = (...a10) => this.chain(new el(a10, this.commandOptions));
        pexpire = (...a10) => this.chain(new em(a10, this.commandOptions));
        pexpireat = (...a10) => this.chain(new en(a10, this.commandOptions));
        pfadd = (...a10) => this.chain(new eo(a10, this.commandOptions));
        pfcount = (...a10) => this.chain(new ep(a10, this.commandOptions));
        pfmerge = (...a10) => this.chain(new eq(a10, this.commandOptions));
        ping = (a10) => this.chain(new er(a10, this.commandOptions));
        psetex = (a10, b10, c10) => this.chain(new es([a10, b10, c10], this.commandOptions));
        pttl = (...a10) => this.chain(new et(a10, this.commandOptions));
        publish = (...a10) => this.chain(new eu(a10, this.commandOptions));
        randomkey = () => this.chain(new ev(this.commandOptions));
        rename = (...a10) => this.chain(new ew(a10, this.commandOptions));
        renamenx = (...a10) => this.chain(new ex(a10, this.commandOptions));
        rpop = (...a10) => this.chain(new ey(a10, this.commandOptions));
        rpush = (a10, ...b10) => this.chain(new ez([a10, ...b10], this.commandOptions));
        rpushx = (a10, ...b10) => this.chain(new eA([a10, ...b10], this.commandOptions));
        sadd = (a10, b10, ...c10) => this.chain(new eB([a10, b10, ...c10], this.commandOptions));
        scan = (...a10) => this.chain(new eC(a10, this.commandOptions));
        scard = (...a10) => this.chain(new eD(a10, this.commandOptions));
        scriptExists = (...a10) => this.chain(new eE(a10, this.commandOptions));
        scriptFlush = (...a10) => this.chain(new eF(a10, this.commandOptions));
        scriptLoad = (...a10) => this.chain(new eG(a10, this.commandOptions));
        sdiff = (...a10) => this.chain(new eH(a10, this.commandOptions));
        sdiffstore = (...a10) => this.chain(new eI(a10, this.commandOptions));
        set = (a10, b10, c10) => this.chain(new eJ([a10, b10, c10], this.commandOptions));
        setbit = (...a10) => this.chain(new eK(a10, this.commandOptions));
        setex = (a10, b10, c10) => this.chain(new eL([a10, b10, c10], this.commandOptions));
        setnx = (a10, b10) => this.chain(new eM([a10, b10], this.commandOptions));
        setrange = (...a10) => this.chain(new eN(a10, this.commandOptions));
        sinter = (...a10) => this.chain(new eO(a10, this.commandOptions));
        sintercard = (...a10) => this.chain(new eP(a10, this.commandOptions));
        sinterstore = (...a10) => this.chain(new eQ(a10, this.commandOptions));
        sismember = (a10, b10) => this.chain(new eR([a10, b10], this.commandOptions));
        smembers = (...a10) => this.chain(new eS(a10, this.commandOptions));
        smismember = (a10, b10) => this.chain(new eT([a10, b10], this.commandOptions));
        smove = (a10, b10, c10) => this.chain(new eU([a10, b10, c10], this.commandOptions));
        spop = (...a10) => this.chain(new eV(a10, this.commandOptions));
        srandmember = (...a10) => this.chain(new eW(a10, this.commandOptions));
        srem = (a10, ...b10) => this.chain(new eX([a10, ...b10], this.commandOptions));
        sscan = (...a10) => this.chain(new eY(a10, this.commandOptions));
        strlen = (...a10) => this.chain(new eZ(a10, this.commandOptions));
        sunion = (...a10) => this.chain(new e$(a10, this.commandOptions));
        sunionstore = (...a10) => this.chain(new e_(a10, this.commandOptions));
        time = () => this.chain(new e0(this.commandOptions));
        touch = (...a10) => this.chain(new e1(a10, this.commandOptions));
        ttl = (...a10) => this.chain(new e2(a10, this.commandOptions));
        type = (...a10) => this.chain(new e3(a10, this.commandOptions));
        unlink = (...a10) => this.chain(new e4(a10, this.commandOptions));
        zadd = (...a10) => ("score" in a10[1], this.chain(new fl([a10[0], a10[1], ...a10.slice(2)], this.commandOptions)));
        xadd = (...a10) => this.chain(new e7(a10, this.commandOptions));
        xack = (...a10) => this.chain(new e5(a10, this.commandOptions));
        xackdel = (...a10) => this.chain(new e6(a10, this.commandOptions));
        xdel = (...a10) => this.chain(new fa(a10, this.commandOptions));
        xdelex = (...a10) => this.chain(new fb(a10, this.commandOptions));
        xgroup = (...a10) => this.chain(new fc(a10, this.commandOptions));
        xread = (...a10) => this.chain(new fh(a10, this.commandOptions));
        xreadgroup = (...a10) => this.chain(new fi(a10, this.commandOptions));
        xinfo = (...a10) => this.chain(new fd(a10, this.commandOptions));
        xlen = (...a10) => this.chain(new fe(a10, this.commandOptions));
        xpending = (...a10) => this.chain(new ff(a10, this.commandOptions));
        xclaim = (...a10) => this.chain(new e9(a10, this.commandOptions));
        xautoclaim = (...a10) => this.chain(new e8(a10, this.commandOptions));
        xtrim = (...a10) => this.chain(new fk(a10, this.commandOptions));
        xrange = (...a10) => this.chain(new fg(a10, this.commandOptions));
        xrevrange = (...a10) => this.chain(new fj(a10, this.commandOptions));
        zcard = (...a10) => this.chain(new fm(a10, this.commandOptions));
        zcount = (...a10) => this.chain(new fn(a10, this.commandOptions));
        zincrby = (a10, b10, c10) => this.chain(new fo([a10, b10, c10], this.commandOptions));
        zinterstore = (...a10) => this.chain(new fp(a10, this.commandOptions));
        zlexcount = (...a10) => this.chain(new fq(a10, this.commandOptions));
        zmscore = (...a10) => this.chain(new fF(a10, this.commandOptions));
        zpopmax = (...a10) => this.chain(new fr(a10, this.commandOptions));
        zpopmin = (...a10) => this.chain(new fs(a10, this.commandOptions));
        zrange = (...a10) => this.chain(new ft(a10, this.commandOptions));
        zrank = (a10, b10) => this.chain(new fu([a10, b10], this.commandOptions));
        zrem = (a10, ...b10) => this.chain(new fv([a10, ...b10], this.commandOptions));
        zremrangebylex = (...a10) => this.chain(new fw(a10, this.commandOptions));
        zremrangebyrank = (...a10) => this.chain(new fx(a10, this.commandOptions));
        zremrangebyscore = (...a10) => this.chain(new fy(a10, this.commandOptions));
        zrevrank = (a10, b10) => this.chain(new fz([a10, b10], this.commandOptions));
        zscan = (...a10) => this.chain(new fA(a10, this.commandOptions));
        zscore = (a10, b10) => this.chain(new fB([a10, b10], this.commandOptions));
        zunionstore = (...a10) => this.chain(new fD(a10, this.commandOptions));
        zunion = (...a10) => this.chain(new fC(a10, this.commandOptions));
        get json() {
          return { arrappend: (...a10) => this.chain(new dJ(a10, this.commandOptions)), arrindex: (...a10) => this.chain(new dK(a10, this.commandOptions)), arrinsert: (...a10) => this.chain(new dL(a10, this.commandOptions)), arrlen: (...a10) => this.chain(new dM(a10, this.commandOptions)), arrpop: (...a10) => this.chain(new dN(a10, this.commandOptions)), arrtrim: (...a10) => this.chain(new dO(a10, this.commandOptions)), clear: (...a10) => this.chain(new dP(a10, this.commandOptions)), del: (...a10) => this.chain(new dQ(a10, this.commandOptions)), forget: (...a10) => this.chain(new dR(a10, this.commandOptions)), get: (...a10) => this.chain(new dS(a10, this.commandOptions)), merge: (...a10) => this.chain(new dT(a10, this.commandOptions)), mget: (...a10) => this.chain(new dU(a10, this.commandOptions)), mset: (...a10) => this.chain(new dV(a10, this.commandOptions)), numincrby: (...a10) => this.chain(new dW(a10, this.commandOptions)), nummultby: (...a10) => this.chain(new dX(a10, this.commandOptions)), objkeys: (...a10) => this.chain(new dY(a10, this.commandOptions)), objlen: (...a10) => this.chain(new dZ(a10, this.commandOptions)), resp: (...a10) => this.chain(new d$(a10, this.commandOptions)), set: (...a10) => this.chain(new d_(a10, this.commandOptions)), strappend: (...a10) => this.chain(new d0(a10, this.commandOptions)), strlen: (...a10) => this.chain(new d1(a10, this.commandOptions)), toggle: (...a10) => this.chain(new d2(a10, this.commandOptions)), type: (...a10) => this.chain(new d3(a10, this.commandOptions)) };
        }
        get functions() {
          return { load: (...a10) => this.chain(new c$(a10, this.commandOptions)), list: (...a10) => this.chain(new cY(a10, this.commandOptions)), delete: (...a10) => this.chain(new cW(a10, this.commandOptions)), flush: () => this.chain(new cX(this.commandOptions)), stats: () => this.chain(new c_(this.commandOptions)), call: (...a10) => this.chain(new cS(a10, this.commandOptions)), callRo: (...a10) => this.chain(new cT(a10, this.commandOptions)) };
        }
      }, fH = /* @__PURE__ */ new Set(["get", "getrange", "mget", "strlen", "bitcount", "bitpos", "getbit", "hexists", "hget", "hgetall", "hkeys", "hlen", "hmget", "hrandfield", "hscan", "hstrlen", "httl", "hvals", "hexpiretime", "hpexpiretime", "hpttl", "lindex", "llen", "lpos", "lrange", "scard", "sdiff", "sinter", "sintercard", "sismember", "smembers", "smismember", "srandmember", "sscan", "sunion", "zcard", "zcount", "zlexcount", "zmscore", "zrange", "zrank", "zrevrank", "zscan", "zscore", "zunion", "exists", "type", "ttl", "pttl", "randomkey", "touch", "pfcount", "xinfo", "xlen", "xpending", "xrange", "xread", "xrevrange", "geodist", "geohash", "geopos", "geosearch", "scriptExists", "evalRo", "evalshaRo", "dbsize", "echo", "ping", "time", "scan", "keys", "arrindex", "arrlen", "objkeys", "objlen", "resp", "list", "stats", "callRo"]), fI = /* @__PURE__ */ new Set(["scan", "keys", "flushdb", "flushall", "dbsize", "hscan", "hgetall", "hkeys", "lrange", "sscan", "smembers", "xrange", "xrevrange", "zscan", "zrange", "exec"]), fJ = class {
        pipelinePromises = /* @__PURE__ */ new WeakMap();
        activeReadPipeline = null;
        activeWritePipeline = null;
        readIndex = 0;
        writeIndex = 0;
        redis;
        pipeline;
        pipelineCounter = 0;
        constructor(a10) {
          this.redis = a10, this.pipeline = a10.pipeline();
        }
        async withAutoPipeline(a10, b10) {
          let c10 = "read" === a10, d10 = c10 ? this.activeReadPipeline : this.activeWritePipeline, e10 = d10 ?? this.redis.pipeline();
          d10 || (c10 ? (this.activeReadPipeline = e10, this.readIndex = 0) : (this.activeWritePipeline = e10, this.writeIndex = 0));
          let f2 = c10 ? this.readIndex++ : this.writeIndex++;
          b10(e10), c10 && this.readIndex >= 1e3 ? this.activeReadPipeline = null : !c10 && this.writeIndex >= 1e3 && (this.activeWritePipeline = null);
          let g2 = this.deferExecution().then(() => {
            if (!this.pipelinePromises.has(e10)) {
              let a11 = e10.exec({ keepErrors: true });
              this.pipelineCounter += 1, this.pipelinePromises.set(e10, a11), this.activeReadPipeline === e10 && (this.activeReadPipeline = null), this.activeWritePipeline === e10 && (this.activeWritePipeline = null);
            }
            return this.pipelinePromises.get(e10);
          }), h2 = (await g2)[f2];
          if (h2.error) throw new b8(`Command failed: ${h2.error}`);
          return h2.result;
        }
        async deferExecution() {
          await Promise.resolve(), await Promise.resolve();
        }
      }, fK = class extends ck {
        constructor(a10, b10) {
          super([], { ...b10, headers: { Accept: "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" }, path: ["psubscribe", ...a10], streamOptions: { isStreaming: true, onMessage: b10?.streamOptions?.onMessage, signal: b10?.streamOptions?.signal } });
        }
      }, fL = class extends EventTarget {
        subscriptions;
        client;
        listeners;
        opts;
        constructor(a10, b10, c10 = false, d10) {
          for (const e10 of (super(), this.client = a10, this.subscriptions = /* @__PURE__ */ new Map(), this.listeners = /* @__PURE__ */ new Map(), this.opts = d10, b10)) c10 ? this.subscribeToPattern(e10) : this.subscribeToChannel(e10);
        }
        subscribeToChannel(a10) {
          let b10 = new AbortController(), c10 = new fM([a10], { streamOptions: { signal: b10.signal, onMessage: (a11) => this.handleMessage(a11, false) } });
          c10.exec(this.client).catch((a11) => {
            "AbortError" !== a11.name && this.dispatchToListeners("error", a11);
          }), this.subscriptions.set(a10, { command: c10, controller: b10, isPattern: false });
        }
        subscribeToPattern(a10) {
          let b10 = new AbortController(), c10 = new fK([a10], { streamOptions: { signal: b10.signal, onMessage: (a11) => this.handleMessage(a11, true) } });
          c10.exec(this.client).catch((a11) => {
            "AbortError" !== a11.name && this.dispatchToListeners("error", a11);
          }), this.subscriptions.set(a10, { command: c10, controller: b10, isPattern: true });
        }
        handleMessage(a10, b10) {
          let c10 = a10.replace(/^data:\s*/, ""), d10 = c10.indexOf(","), e10 = c10.indexOf(",", d10 + 1), f2 = b10 ? c10.indexOf(",", e10 + 1) : -1;
          if (-1 !== d10 && -1 !== e10) {
            let a11 = c10.slice(0, d10);
            if (b10 && "pmessage" === a11 && -1 !== f2) {
              let a12 = c10.slice(d10 + 1, e10), b11 = c10.slice(e10 + 1, f2), g2 = c10.slice(f2 + 1);
              try {
                let c11 = this.opts?.automaticDeserialization === false ? g2 : JSON.parse(g2);
                this.dispatchToListeners("pmessage", { pattern: a12, channel: b11, message: c11 }), this.dispatchToListeners(`pmessage:${a12}`, { pattern: a12, channel: b11, message: c11 });
              } catch (a13) {
                this.dispatchToListeners("error", Error(`Failed to parse message: ${a13}`));
              }
            } else {
              let b11 = c10.slice(d10 + 1, e10), f3 = c10.slice(e10 + 1);
              try {
                if ("subscribe" === a11 || "psubscribe" === a11 || "unsubscribe" === a11 || "punsubscribe" === a11) {
                  let b12 = Number.parseInt(f3);
                  this.dispatchToListeners(a11, b12);
                } else {
                  let c11 = this.opts?.automaticDeserialization === false ? f3 : fN(f3);
                  this.dispatchToListeners(a11, { channel: b11, message: c11 }), this.dispatchToListeners(`${a11}:${b11}`, { channel: b11, message: c11 });
                }
              } catch (a12) {
                this.dispatchToListeners("error", Error(`Failed to parse message: ${a12}`));
              }
            }
          }
        }
        dispatchToListeners(a10, b10) {
          let c10 = this.listeners.get(a10);
          if (c10) for (let a11 of c10) a11(b10);
        }
        on(a10, b10) {
          this.listeners.has(a10) || this.listeners.set(a10, /* @__PURE__ */ new Set()), this.listeners.get(a10)?.add(b10);
        }
        removeAllListeners() {
          this.listeners.clear();
        }
        async unsubscribe(a10) {
          if (a10) for (let b10 of a10) {
            let a11 = this.subscriptions.get(b10);
            if (a11) {
              try {
                a11.controller.abort();
              } catch {
              }
              this.subscriptions.delete(b10);
            }
          }
          else {
            for (let a11 of this.subscriptions.values()) try {
              a11.controller.abort();
            } catch {
            }
            this.subscriptions.clear(), this.removeAllListeners();
          }
        }
        getSubscribedChannels() {
          return [...this.subscriptions.keys()];
        }
      }, fM = class extends ck {
        constructor(a10, b10) {
          super([], { ...b10, headers: { Accept: "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" }, path: ["subscribe", ...a10], streamOptions: { isStreaming: true, onMessage: b10?.streamOptions?.onMessage, signal: b10?.streamOptions?.signal } });
        }
      }, fN = (a10) => {
        try {
          return JSON.parse(a10);
        } catch {
          return a10;
        }
      }, fO = class {
        script;
        sha1;
        initPromise;
        redis;
        constructor(a10, b10) {
          this.redis = a10, this.script = b10, this.sha1 = "", this.init(b10);
        }
        init(a10) {
          return this.initPromise || (this.initPromise = this.digest(a10).then((a11) => {
            this.sha1 = a11;
          })), this.initPromise;
        }
        async eval(a10, b10) {
          return await this.init(this.script), await this.redis.eval(this.script, a10, b10);
        }
        async evalsha(a10, b10) {
          return await this.init(this.script), await this.redis.evalsha(this.sha1, a10, b10);
        }
        async exec(a10, b10) {
          return await this.init(this.script), await this.redis.evalsha(this.sha1, a10, b10).catch(async (c10) => {
            if (c10 instanceof Error && c10.message.toLowerCase().includes("noscript")) return await this.redis.eval(this.script, a10, b10);
            throw c10;
          });
        }
        async digest(a10) {
          let b10 = new TextEncoder().encode(a10);
          return [...new Uint8Array(await b3.digest("SHA-1", b10))].map((a11) => a11.toString(16).padStart(2, "0")).join("");
        }
      }, fP = class {
        script;
        sha1;
        initPromise;
        redis;
        constructor(a10, b10) {
          this.redis = a10, this.sha1 = "", this.script = b10, this.init(b10);
        }
        init(a10) {
          return this.initPromise || (this.initPromise = this.digest(a10).then((a11) => {
            this.sha1 = a11;
          })), this.initPromise;
        }
        async evalRo(a10, b10) {
          return await this.init(this.script), await this.redis.evalRo(this.script, a10, b10);
        }
        async evalshaRo(a10, b10) {
          return await this.init(this.script), await this.redis.evalshaRo(this.sha1, a10, b10);
        }
        async exec(a10, b10) {
          return await this.init(this.script), await this.redis.evalshaRo(this.sha1, a10, b10).catch(async (c10) => {
            if (c10 instanceof Error && c10.message.toLowerCase().includes("noscript")) return await this.redis.evalRo(this.script, a10, b10);
            throw c10;
          });
        }
        async digest(a10) {
          let b10 = new TextEncoder().encode(a10);
          return [...new Uint8Array(await b3.digest("SHA-1", b10))].map((a11) => a11.toString(16).padStart(2, "0")).join("");
        }
      }, fQ = class {
        client;
        opts;
        enableTelemetry;
        enableAutoPipelining;
        constructor(a10, b10) {
          this.client = a10, this.opts = b10, this.enableTelemetry = b10?.enableTelemetry ?? true, b10?.readYourWrites === false && (this.client.readYourWrites = false), this.enableAutoPipelining = b10?.enableAutoPipelining ?? true;
        }
        get readYourWritesSyncToken() {
          return this.client.upstashSyncToken;
        }
        set readYourWritesSyncToken(a10) {
          this.client.upstashSyncToken = a10;
        }
        get json() {
          return { arrappend: (...a10) => new dJ(a10, this.opts).exec(this.client), arrindex: (...a10) => new dK(a10, this.opts).exec(this.client), arrinsert: (...a10) => new dL(a10, this.opts).exec(this.client), arrlen: (...a10) => new dM(a10, this.opts).exec(this.client), arrpop: (...a10) => new dN(a10, this.opts).exec(this.client), arrtrim: (...a10) => new dO(a10, this.opts).exec(this.client), clear: (...a10) => new dP(a10, this.opts).exec(this.client), del: (...a10) => new dQ(a10, this.opts).exec(this.client), forget: (...a10) => new dR(a10, this.opts).exec(this.client), get: (...a10) => new dS(a10, this.opts).exec(this.client), merge: (...a10) => new dT(a10, this.opts).exec(this.client), mget: (...a10) => new dU(a10, this.opts).exec(this.client), mset: (...a10) => new dV(a10, this.opts).exec(this.client), numincrby: (...a10) => new dW(a10, this.opts).exec(this.client), nummultby: (...a10) => new dX(a10, this.opts).exec(this.client), objkeys: (...a10) => new dY(a10, this.opts).exec(this.client), objlen: (...a10) => new dZ(a10, this.opts).exec(this.client), resp: (...a10) => new d$(a10, this.opts).exec(this.client), set: (...a10) => new d_(a10, this.opts).exec(this.client), strappend: (...a10) => new d0(a10, this.opts).exec(this.client), strlen: (...a10) => new d1(a10, this.opts).exec(this.client), toggle: (...a10) => new d2(a10, this.opts).exec(this.client), type: (...a10) => new d3(a10, this.opts).exec(this.client) };
        }
        get functions() {
          return { load: (...a10) => new c$(a10, this.opts).exec(this.client), list: (...a10) => new cY(a10, this.opts).exec(this.client), delete: (...a10) => new cW(a10, this.opts).exec(this.client), flush: () => new cX(this.opts).exec(this.client), stats: () => new c_(this.opts).exec(this.client), call: (...a10) => new cS(a10, this.opts).exec(this.client), callRo: (...a10) => new cT(a10, this.opts).exec(this.client) };
        }
        use = (a10) => {
          let b10 = this.client.request.bind(this.client);
          this.client.request = (c10) => a10(c10, b10);
        };
        addTelemetry = (a10) => {
          if (this.enableTelemetry) try {
            this.client.mergeTelemetry(a10);
          } catch {
          }
        };
        createScript(a10, b10) {
          return b10?.readonly ? new fP(this, a10) : new fO(this, a10);
        }
        get search() {
          return { createIndex: (a10) => ct(this.client, a10), index: (a10) => cu(this.client, a10), alias: { list: () => cv(this.client), add: ({ indexName: a10, alias: b10 }) => cw(this.client, { indexName: a10, alias: b10 }), delete: ({ alias: a10 }) => cx(this.client, { alias: a10 }) } };
        }
        pipeline = () => new fG({ client: this.client, commandOptions: this.opts, multiExec: false });
        autoPipeline = () => function a10(b10, c10 = "root") {
          return b10.autoPipelineExecutor || (b10.autoPipelineExecutor = new fJ(b10)), new Proxy(b10, { get: (b11, d10) => {
            if ("pipelineCounter" === d10) return b11.autoPipelineExecutor.pipelineCounter;
            if ("root" === c10 && "json" === d10) return a10(b11, "json");
            if ("root" === c10 && "functions" === d10) return a10(b11, "functions");
            if ("root" === c10) {
              let a11 = d10 in b11 && !(d10 in b11.autoPipelineExecutor.pipeline), c11 = fI.has(d10);
              if (a11 || c11) return b11[d10];
            }
            let e10 = b11.autoPipelineExecutor.pipeline, f2 = "json" === c10 ? e10.json[d10] : "functions" === c10 ? e10.functions[d10] : e10[d10];
            return "function" == typeof f2 ? (...a11) => {
              let e11 = fH.has(d10) ? "read" : "write";
              return b11.autoPipelineExecutor.withAutoPipeline(e11, (b12) => {
                ("json" === c10 ? b12.json[d10] : "functions" === c10 ? b12.functions[d10] : b12[d10])(...a11);
              });
            } : f2;
          } });
        }(this);
        multi = () => new fG({ client: this.client, commandOptions: this.opts, multiExec: true });
        bitfield = (...a10) => new cB(a10, this.client, this.opts);
        append = (...a10) => new cz(a10, this.opts).exec(this.client);
        bitcount = (...a10) => new cA(a10, this.opts).exec(this.client);
        bitop = (a10, b10, c10, ...d10) => new cC([a10, b10, c10, ...d10], this.opts).exec(this.client);
        bitpos = (...a10) => new cD(a10, this.opts).exec(this.client);
        clientSetinfo = (...a10) => new cE(a10, this.opts).exec(this.client);
        copy = (...a10) => new cF(a10, this.opts).exec(this.client);
        dbsize = () => new cG(this.opts).exec(this.client);
        decr = (...a10) => new cH(a10, this.opts).exec(this.client);
        decrby = (...a10) => new cI(a10, this.opts).exec(this.client);
        del = (...a10) => new cJ(a10, this.opts).exec(this.client);
        echo = (...a10) => new cK(a10, this.opts).exec(this.client);
        evalRo = (...a10) => new cL(a10, this.opts).exec(this.client);
        eval = (...a10) => new cM(a10, this.opts).exec(this.client);
        evalshaRo = (...a10) => new cN(a10, this.opts).exec(this.client);
        evalsha = (...a10) => new cO(a10, this.opts).exec(this.client);
        exec = (a10) => new cl(a10, this.opts).exec(this.client);
        exists = (...a10) => new cP(a10, this.opts).exec(this.client);
        expire = (...a10) => new cQ(a10, this.opts).exec(this.client);
        expireat = (...a10) => new cR(a10, this.opts).exec(this.client);
        flushall = (a10) => new cU(a10, this.opts).exec(this.client);
        flushdb = (...a10) => new cV(a10, this.opts).exec(this.client);
        geoadd = (...a10) => new c1(a10, this.opts).exec(this.client);
        geopos = (...a10) => new c4(a10, this.opts).exec(this.client);
        geodist = (...a10) => new c2(a10, this.opts).exec(this.client);
        geohash = (...a10) => new c3(a10, this.opts).exec(this.client);
        geosearch = (...a10) => new c5(a10, this.opts).exec(this.client);
        geosearchstore = (...a10) => new c6(a10, this.opts).exec(this.client);
        get = (...a10) => new c7(a10, this.opts).exec(this.client);
        getbit = (...a10) => new c8(a10, this.opts).exec(this.client);
        getdel = (...a10) => new c9(a10, this.opts).exec(this.client);
        getex = (...a10) => new da(a10, this.opts).exec(this.client);
        getrange = (...a10) => new db(a10, this.opts).exec(this.client);
        getset = (a10, b10) => new dc([a10, b10], this.opts).exec(this.client);
        hdel = (...a10) => new dd(a10, this.opts).exec(this.client);
        hexists = (...a10) => new de(a10, this.opts).exec(this.client);
        hexpire = (...a10) => new df(a10, this.opts).exec(this.client);
        hexpireat = (...a10) => new dg(a10, this.opts).exec(this.client);
        hexpiretime = (...a10) => new dh(a10, this.opts).exec(this.client);
        httl = (...a10) => new dE(a10, this.opts).exec(this.client);
        hpexpire = (...a10) => new dj(a10, this.opts).exec(this.client);
        hpexpireat = (...a10) => new dk(a10, this.opts).exec(this.client);
        hpexpiretime = (...a10) => new dl(a10, this.opts).exec(this.client);
        hpttl = (...a10) => new dm(a10, this.opts).exec(this.client);
        hpersist = (...a10) => new di(a10, this.opts).exec(this.client);
        hget = (...a10) => new dn(a10, this.opts).exec(this.client);
        hgetall = (...a10) => new dp(a10, this.opts).exec(this.client);
        hgetdel = (...a10) => new ds(a10, this.opts).exec(this.client);
        hgetex = (...a10) => new dt(a10, this.opts).exec(this.client);
        hincrby = (...a10) => new du(a10, this.opts).exec(this.client);
        hincrbyfloat = (...a10) => new dv(a10, this.opts).exec(this.client);
        hkeys = (...a10) => new dw(a10, this.opts).exec(this.client);
        hlen = (...a10) => new dx(a10, this.opts).exec(this.client);
        hmget = (...a10) => new dr(a10, this.opts).exec(this.client);
        hmset = (a10, b10) => new dy([a10, b10], this.opts).exec(this.client);
        hrandfield = (a10, b10, c10) => new cy([a10, b10, c10], this.opts).exec(this.client);
        hscan = (...a10) => new dz(a10, this.opts).exec(this.client);
        hset = (a10, b10) => new dA([a10, b10], this.opts).exec(this.client);
        hsetex = (...a10) => new dB(a10, this.opts).exec(this.client);
        hsetnx = (a10, b10, c10) => new dC([a10, b10, c10], this.opts).exec(this.client);
        hstrlen = (...a10) => new dD(a10, this.opts).exec(this.client);
        hvals = (...a10) => new dF(a10, this.opts).exec(this.client);
        incr = (...a10) => new dG(a10, this.opts).exec(this.client);
        incrby = (...a10) => new dH(a10, this.opts).exec(this.client);
        incrbyfloat = (...a10) => new dI(a10, this.opts).exec(this.client);
        keys = (...a10) => new d4(a10, this.opts).exec(this.client);
        lindex = (...a10) => new d5(a10, this.opts).exec(this.client);
        linsert = (a10, b10, c10, d10) => new d6([a10, b10, c10, d10], this.opts).exec(this.client);
        llen = (...a10) => new d7(a10, this.opts).exec(this.client);
        lmove = (...a10) => new d8(a10, this.opts).exec(this.client);
        lpop = (...a10) => new ea(a10, this.opts).exec(this.client);
        lmpop = (...a10) => new d9(a10, this.opts).exec(this.client);
        lpos = (...a10) => new eb(a10, this.opts).exec(this.client);
        lpush = (a10, ...b10) => new ec([a10, ...b10], this.opts).exec(this.client);
        lpushx = (a10, ...b10) => new ed([a10, ...b10], this.opts).exec(this.client);
        lrange = (...a10) => new ee(a10, this.opts).exec(this.client);
        lrem = (a10, b10, c10) => new ef([a10, b10, c10], this.opts).exec(this.client);
        lset = (a10, b10, c10) => new eg([a10, b10, c10], this.opts).exec(this.client);
        ltrim = (...a10) => new eh(a10, this.opts).exec(this.client);
        mget = (...a10) => new ei(a10, this.opts).exec(this.client);
        mset = (a10) => new ej([a10], this.opts).exec(this.client);
        msetnx = (a10) => new ek([a10], this.opts).exec(this.client);
        persist = (...a10) => new el(a10, this.opts).exec(this.client);
        pexpire = (...a10) => new em(a10, this.opts).exec(this.client);
        pexpireat = (...a10) => new en(a10, this.opts).exec(this.client);
        pfadd = (...a10) => new eo(a10, this.opts).exec(this.client);
        pfcount = (...a10) => new ep(a10, this.opts).exec(this.client);
        pfmerge = (...a10) => new eq(a10, this.opts).exec(this.client);
        ping = (a10) => new er(a10, this.opts).exec(this.client);
        psetex = (a10, b10, c10) => new es([a10, b10, c10], this.opts).exec(this.client);
        psubscribe = (a10) => {
          let b10 = Array.isArray(a10) ? a10 : [a10];
          return new fL(this.client, b10, true, this.opts);
        };
        pttl = (...a10) => new et(a10, this.opts).exec(this.client);
        publish = (...a10) => new eu(a10, this.opts).exec(this.client);
        randomkey = () => new ev().exec(this.client);
        rename = (...a10) => new ew(a10, this.opts).exec(this.client);
        renamenx = (...a10) => new ex(a10, this.opts).exec(this.client);
        rpop = (...a10) => new ey(a10, this.opts).exec(this.client);
        rpush = (a10, ...b10) => new ez([a10, ...b10], this.opts).exec(this.client);
        rpushx = (a10, ...b10) => new eA([a10, ...b10], this.opts).exec(this.client);
        sadd = (a10, b10, ...c10) => new eB([a10, b10, ...c10], this.opts).exec(this.client);
        scan(a10, b10) {
          return new eC([a10, b10], this.opts).exec(this.client);
        }
        scard = (...a10) => new eD(a10, this.opts).exec(this.client);
        scriptExists = (...a10) => new eE(a10, this.opts).exec(this.client);
        scriptFlush = (...a10) => new eF(a10, this.opts).exec(this.client);
        scriptLoad = (...a10) => new eG(a10, this.opts).exec(this.client);
        sdiff = (...a10) => new eH(a10, this.opts).exec(this.client);
        sdiffstore = (...a10) => new eI(a10, this.opts).exec(this.client);
        set = (a10, b10, c10) => new eJ([a10, b10, c10], this.opts).exec(this.client);
        setbit = (...a10) => new eK(a10, this.opts).exec(this.client);
        setex = (a10, b10, c10) => new eL([a10, b10, c10], this.opts).exec(this.client);
        setnx = (a10, b10) => new eM([a10, b10], this.opts).exec(this.client);
        setrange = (...a10) => new eN(a10, this.opts).exec(this.client);
        sinter = (...a10) => new eO(a10, this.opts).exec(this.client);
        sintercard = (...a10) => new eP(a10, this.opts).exec(this.client);
        sinterstore = (...a10) => new eQ(a10, this.opts).exec(this.client);
        sismember = (a10, b10) => new eR([a10, b10], this.opts).exec(this.client);
        smismember = (a10, b10) => new eT([a10, b10], this.opts).exec(this.client);
        smembers = (...a10) => new eS(a10, this.opts).exec(this.client);
        smove = (a10, b10, c10) => new eU([a10, b10, c10], this.opts).exec(this.client);
        spop = (...a10) => new eV(a10, this.opts).exec(this.client);
        srandmember = (...a10) => new eW(a10, this.opts).exec(this.client);
        srem = (a10, ...b10) => new eX([a10, ...b10], this.opts).exec(this.client);
        sscan = (...a10) => new eY(a10, this.opts).exec(this.client);
        strlen = (...a10) => new eZ(a10, this.opts).exec(this.client);
        subscribe = (a10) => {
          let b10 = Array.isArray(a10) ? a10 : [a10];
          return new fL(this.client, b10, false, this.opts);
        };
        sunion = (...a10) => new e$(a10, this.opts).exec(this.client);
        sunionstore = (...a10) => new e_(a10, this.opts).exec(this.client);
        time = () => new e0().exec(this.client);
        touch = (...a10) => new e1(a10, this.opts).exec(this.client);
        ttl = (...a10) => new e2(a10, this.opts).exec(this.client);
        type = (...a10) => new e3(a10, this.opts).exec(this.client);
        unlink = (...a10) => new e4(a10, this.opts).exec(this.client);
        xadd = (...a10) => new e7(a10, this.opts).exec(this.client);
        xack = (...a10) => new e5(a10, this.opts).exec(this.client);
        xackdel = (...a10) => new e6(a10, this.opts).exec(this.client);
        xdel = (...a10) => new fa(a10, this.opts).exec(this.client);
        xdelex = (...a10) => new fb(a10, this.opts).exec(this.client);
        xgroup = (...a10) => new fc(a10, this.opts).exec(this.client);
        xread = (...a10) => new fh(a10, this.opts).exec(this.client);
        xreadgroup = (...a10) => new fi(a10, this.opts).exec(this.client);
        xinfo = (...a10) => new fd(a10, this.opts).exec(this.client);
        xlen = (...a10) => new fe(a10, this.opts).exec(this.client);
        xpending = (...a10) => new ff(a10, this.opts).exec(this.client);
        xclaim = (...a10) => new e9(a10, this.opts).exec(this.client);
        xautoclaim = (...a10) => new e8(a10, this.opts).exec(this.client);
        xtrim = (...a10) => new fk(a10, this.opts).exec(this.client);
        xrange = (...a10) => new fg(a10, this.opts).exec(this.client);
        xrevrange = (...a10) => new fj(a10, this.opts).exec(this.client);
        zadd = (...a10) => ("score" in a10[1], new fl([a10[0], a10[1], ...a10.slice(2)], this.opts).exec(this.client));
        zcard = (...a10) => new fm(a10, this.opts).exec(this.client);
        zcount = (...a10) => new fn(a10, this.opts).exec(this.client);
        zdiffstore = (...a10) => new fE(a10, this.opts).exec(this.client);
        zincrby = (a10, b10, c10) => new fo([a10, b10, c10], this.opts).exec(this.client);
        zinterstore = (...a10) => new fp(a10, this.opts).exec(this.client);
        zlexcount = (...a10) => new fq(a10, this.opts).exec(this.client);
        zmscore = (...a10) => new fF(a10, this.opts).exec(this.client);
        zpopmax = (...a10) => new fr(a10, this.opts).exec(this.client);
        zpopmin = (...a10) => new fs(a10, this.opts).exec(this.client);
        zrange = (...a10) => new ft(a10, this.opts).exec(this.client);
        zrank = (a10, b10) => new fu([a10, b10], this.opts).exec(this.client);
        zrem = (a10, ...b10) => new fv([a10, ...b10], this.opts).exec(this.client);
        zremrangebylex = (...a10) => new fw(a10, this.opts).exec(this.client);
        zremrangebyrank = (...a10) => new fx(a10, this.opts).exec(this.client);
        zremrangebyscore = (...a10) => new fy(a10, this.opts).exec(this.client);
        zrevrank = (a10, b10) => new fz([a10, b10], this.opts).exec(this.client);
        zscan = (...a10) => new fA(a10, this.opts).exec(this.client);
        zscore = (a10, b10) => new fB([a10, b10], this.opts).exec(this.client);
        zunion = (...a10) => new fC(a10, this.opts).exec(this.client);
        zunionstore = (...a10) => new fD(a10, this.opts).exec(this.client);
      }, fR = c(5356).Buffer;
      "u" < typeof atob && (global.atob = (a10) => fR.from(a10, "base64").toString("utf8"));
      var fS = class a10 extends fQ {
        constructor(a11) {
          if ("request" in a11) return void super(a11);
          a11.url ? (a11.url.startsWith(" ") || a11.url.endsWith(" ") || /\r|\n/.test(a11.url)) && console.warn("[Upstash Redis] The redis url contains whitespace or newline, which can cause errors!") : console.warn("[Upstash Redis] The 'url' property is missing or undefined in your Redis config. To create a database instantly (no signup needed), run: curl -X POST https://upstash.com/start-redis"), a11.token ? (a11.token.startsWith(" ") || a11.token.endsWith(" ") || /\r|\n/.test(a11.token)) && console.warn("[Upstash Redis] The redis token contains whitespace or newline, which can cause errors!") : console.warn("[Upstash Redis] The 'token' property is missing or undefined in your Redis config. To create a database instantly (no signup needed), run: curl -X POST https://upstash.com/start-redis");
          const b10 = new cf({ baseUrl: a11.url, retry: a11.retry, headers: { authorization: `Bearer ${a11.token}` }, agent: a11.agent, responseEncoding: a11.responseEncoding, cache: a11.cache ?? "no-store", signal: a11.signal, keepAlive: a11.keepAlive, readYourWrites: a11.readYourWrites }), c10 = "object" == typeof process && process && "object" == typeof process.env && process.env ? process.env : {};
          if (super(b10, { automaticDeserialization: a11.automaticDeserialization, enableTelemetry: a11.enableTelemetry ?? !c10.UPSTASH_DISABLE_TELEMETRY, latencyLogging: a11.latencyLogging, enableAutoPipelining: a11.enableAutoPipelining }), "object" == typeof process && process && process.version, this.addTelemetry({ runtime: "edge-light", platform: c10.UPSTASH_CONSOLE ? "console" : c10.VERCEL ? "vercel" : c10.AWS_REGION ? "aws" : "unknown", sdk: "@upstash/redis@v1.38.2" }), this.enableAutoPipelining) return this.autoPipeline();
        }
        static fromEnv(b10) {
          if ("object" != typeof process || !process || "object" != typeof process.env || !process.env) throw TypeError('[Upstash Redis] Unable to get environment variables, `process.env` is undefined. If you are deploying to cloudflare, please import from "@upstash/redis/cloudflare" instead');
          let c10 = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
          c10 || console.warn("[Upstash Redis] Unable to find environment variable: `UPSTASH_REDIS_REST_URL`. To create a database instantly (no signup needed), run: curl -X POST https://upstash.com/start-redis");
          let d10 = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
          return d10 || console.warn("[Upstash Redis] Unable to find environment variable: `UPSTASH_REDIS_REST_TOKEN`. To create a database instantly (no signup needed), run: curl -X POST https://upstash.com/start-redis"), new a10({ ...b10, url: c10, token: d10 });
        }
      };
      let fT = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN ? new b2.Ratelimit({ redis: fS.fromEnv(), limiter: b2.Ratelimit.slidingWindow(5, "10 m"), analytics: true, prefix: "@upstash/ratelimit/my-skincare" }) : { limit: async () => ({ success: false }) }, fU = (0, b0.withAuth)(async function(a10) {
        let b10 = a10.nextauth.token, c10 = !!b10, d10 = a10.nextUrl.pathname.startsWith("/admin"), e10 = "/admin/login" === a10.nextUrl.pathname;
        if (e10) {
          let b11 = a10.headers.get("x-forwarded-for") ?? "127.0.0.1", { success: c11 } = await fT.limit(b11);
          if (!c11) return new b1.NextResponse("Too many requests", { status: 429 });
        }
        if (e10) return c10 ? b1.NextResponse.redirect(new URL("/admin/appointments", a10.url)) : null;
        if (d10 && !c10) {
          let b11 = a10.nextUrl.pathname;
          return b1.NextResponse.redirect(new URL(`/admin/login?from=${encodeURIComponent(b11)}`, a10.url));
        }
        return d10 && b10?.role !== "ADMIN" ? b1.NextResponse.redirect(new URL("/", a10.url)) : null;
      }, { callbacks: { authorized: () => true } }), fV = { matcher: ["/admin/:path*"] };
      Object.values({ NOT_FOUND: 404, FORBIDDEN: 403, UNAUTHORIZED: 401 });
      let fW = { ...v }, fX = "/src/middleware", fY = (0, fW.middleware || fW.default);
      class fZ extends Error {
        constructor(a10) {
          super(a10), Object.defineProperty(this, "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true }), this.stack = "";
        }
      }
      if ("function" != typeof fY) throw new fZ(`The Middleware file "${fX}" must export a function named \`middleware\` or a default function.`);
      let f$ = async (a10) => bh({ ...a10, IncrementalCache: b_, incrementalCacheHandler: null, page: fX, handler: async (...a11) => {
        try {
          return await fY(...a11);
        } catch (e10) {
          let b10 = a11[0], c10 = new URL(b10.url), d10 = c10.pathname + c10.search;
          throw await z(e10, { path: d10, method: b10.method, headers: Object.fromEntries(b10.headers.entries()) }, { routerKind: "Pages Router", routePath: "/proxy", routeType: "proxy", revalidateReason: void 0 }), e10;
        }
      } });
      async function f_(a10, b10) {
        let c10 = await f$({ request: { url: a10.url, method: a10.method, headers: (0, E.Cu)(a10.headers), nextConfig: { basePath: "", i18n: "", trailingSlash: false, experimental: { cacheLife: { default: { stale: 300, revalidate: 900, expire: 4294967294 }, seconds: { stale: 30, revalidate: 1, expire: 60 }, minutes: { stale: 300, revalidate: 60, expire: 3600 }, hours: { stale: 300, revalidate: 3600, expire: 86400 }, days: { stale: 300, revalidate: 86400, expire: 604800 }, weeks: { stale: 300, revalidate: 604800, expire: 2592e3 }, max: { stale: 300, revalidate: 2592e3, expire: 31536e3 } }, authInterrupts: false, clientParamParsingOrigins: [] } }, page: { name: fX }, body: "GET" !== a10.method && "HEAD" !== a10.method ? a10.body ?? void 0 : void 0, waitUntil: b10.waitUntil, requestMeta: b10.requestMeta, signal: b10.signal || new AbortController().signal } });
        return null == b10.waitUntil || b10.waitUntil.call(b10, c10.waitUntil), c10.response;
      }
      let f0 = f$;
    }, 1967: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true });
      let d = c(4308), e = c(512), f = c(7079);
      b.default = function(a2, b2, c2) {
        a2 ??= {}, c2 ??= 0;
        let g = (0, e.default)({ ...a2, _v6: true }, new Uint8Array(16));
        if (g = (0, f.default)(g), b2) {
          if (c2 < 0 || c2 + 16 > b2.length) throw RangeError(`UUID byte range ${c2}:${c2 + 15} is out of buffer bounds`);
          for (let a3 = 0; a3 < 16; a3++) b2[c2 + a3] = g[a3];
          return b2;
        }
        return (0, d.unsafeStringify)(g);
      };
    }, 2036: (a, b) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true });
    }, 2119: (a, b, c) => {
      "use strict";
      function d() {
        throw Object.defineProperty(Error('ImageResponse moved from "next/server" to "next/og" since Next.js 14, please import from "next/og" instead'), "__NEXT_ERROR_CODE", { value: "E183", enumerable: false, configurable: true });
      }
      c.r(b), c.d(b, { ImageResponse: () => d, NextRequest: () => g.J, NextResponse: () => h.R, URLPattern: () => m, after: () => p, connection: () => C, userAgent: () => l, userAgentFromString: () => k });
      var e, f, g = c(9531), h = c(479), i = c(5808), j = c.n(i);
      function k(a2) {
        return { ...j()(a2), isBot: void 0 !== a2 && /Googlebot|Mediapartners-Google|AdsBot-Google|googleweblight|Storebot-Google|Google-PageRenderer|Google-InspectionTool|Bingbot|BingPreview|Slurp|DuckDuckBot|baiduspider|yandex|sogou|LinkedInBot|bitlybot|tumblr|vkShare|quora link preview|facebookexternalhit|facebookcatalog|Twitterbot|applebot|redditbot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|ia_archiver|GPTBot/i.test(a2) };
      }
      function l({ headers: a2 }) {
        return k(a2.get("user-agent") || void 0);
      }
      let m = "u" < typeof URLPattern ? void 0 : URLPattern;
      var n = c(7021), o = c(1775);
      function p(a2) {
        let b2 = n.J.getStore(), c2 = o.FP.getStore();
        if (!b2 || !c2) throw Object.defineProperty(Error("`after` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context"), "__NEXT_ERROR_CODE", { value: "E468", enumerable: false, configurable: true });
        let { afterContext: d2 } = b2;
        return d2.after(a2, c2);
      }
      var q = c(7879);
      class r extends Error {
        constructor(a2) {
          super(`Dynamic server usage: ${a2}`), this.description = a2, this.digest = "DYNAMIC_SERVER_USAGE";
        }
      }
      class s extends Error {
        constructor(...a2) {
          super(...a2), this.code = "NEXT_STATIC_GEN_BAILOUT";
        }
      }
      var t = c(6506), u = ((e = {})[e.Before = 1] = "Before", e[e.ShellStatic = 11] = "ShellStatic", e[e.Static = 13] = "Static", e[e.ShellRuntime = 21] = "ShellRuntime", e[e.Runtime = 23] = "Runtime", e[e.Dynamic = 30] = "Dynamic", e[e.Abandoned = 40] = "Abandoned", e);
      class v extends Error {
        constructor(a2, b2) {
          super(`During prerendering, ${b2} rejects when the prerender is complete. Typically these errors are handled by React but if you move ${b2} to a different context by using \`setTimeout\`, \`after\`, or similar functions you may observe this error and you should handle it in that context. This occurred at route "${a2}".`), this.route = a2, this.expression = b2, this.digest = "HANGING_PROMISE_REJECTION";
        }
      }
      let w = /* @__PURE__ */ new WeakMap();
      function x() {
      }
      u.ShellRuntime, u.Static, u.Runtime;
      let y = "function" == typeof q.unstable_postpone;
      function z(a2, b2) {
        return `Route ${a2} needs to bail out of prerendering at this point because it used ${b2}. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error`;
      }
      if (false === ((f = z("%%%", "^^^")).includes("needs to bail out of prerendering at this point because it used") && f.includes("Learn more: https://nextjs.org/docs/messages/ppr-caught-error"))) throw Object.defineProperty(Error("Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E296", enumerable: false, configurable: true });
      RegExp("\\n\\s+at Suspense \\(<anonymous>\\)(?:(?!\\n\\s+at (?:body|div|main|section|article|aside|header|footer|nav|form|p|span|h1|h2|h3|h4|h5|h6) \\(<anonymous>\\))[\\s\\S])*?\\n\\s+at __next_root_layout_boundary__ \\([^\\n]*\\)"), RegExp("\\n\\s+at __next_metadata_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_viewport_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_outlet_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_instant_validation_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_instant_slot_(\\d+)__[\\n\\s]");
      let A = (0, c(7925).xl)();
      var B = c(4796);
      function C() {
        let a2 = n.J.getStore(), b2 = o.FP.getStore();
        if (a2) {
          if (b2 && !function(a3) {
            switch (a3.phase) {
              case "action":
              case "render":
                return true;
              case "after": {
                let a4 = A.getStore();
                if (a4 && (a4.isAppRoute || a4.isAction)) return true;
                let b3 = B.Z.getStore();
                if (b3) return "action" === b3.rootTaskSpawnPhase;
                return false;
              }
            }
          }(b2)) throw Object.defineProperty(Error(`Route ${a2.route} used \`connection()\` inside \`after()\` while rendering. The \`connection()\` function is used to indicate the subsequent code must only run when there is an actual Request, but \`after()\` executes after the request, so this function is not allowed in this scope. See more info here: https://nextjs.org/docs/app/api-reference/functions/after`), "__NEXT_ERROR_CODE", { value: "E1377", enumerable: false, configurable: true });
          if (a2.forceStatic) return Promise.resolve(void 0);
          if (a2.dynamicShouldError) throw Object.defineProperty(new s(`Route ${a2.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`connection()\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", { value: "E847", enumerable: false, configurable: true });
          if (b2) switch (b2.type) {
            case "cache": {
              let b3 = Object.defineProperty(Error(`Route ${a2.route} used \`connection()\` inside "use cache". The \`connection()\` function is used to indicate the subsequent code must only run when there is an actual request, but caches must be able to be produced before a request, so this function is not allowed in this scope. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", { value: "E841", enumerable: false, configurable: true });
              throw Error.captureStackTrace(b3, C), a2.invalidDynamicUsageError ??= b3, b3;
            }
            case "private-cache": {
              let b3 = Object.defineProperty(Error(`Route ${a2.route} used \`connection()\` inside "use cache: private". The \`connection()\` function is used to indicate the subsequent code must only run when there is an actual navigation request, but caches must be able to be produced before a navigation request, so this function is not allowed in this scope. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", { value: "E837", enumerable: false, configurable: true });
              throw Error.captureStackTrace(b3, C), a2.invalidDynamicUsageError ??= b3, b3;
            }
            case "unstable-cache":
              throw Object.defineProperty(Error(`Route ${a2.route} used \`connection()\` inside a function cached with \`unstable_cache()\`. The \`connection()\` function is used to indicate the subsequent code must only run when there is an actual Request, but caches must be able to be produced before a Request so this function is not allowed in this scope. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`), "__NEXT_ERROR_CODE", { value: "E840", enumerable: false, configurable: true });
            case "generate-static-params":
              throw Object.defineProperty(Error(`Route ${a2.route} used \`connection()\` inside \`generateStaticParams\`. This is not supported because \`generateStaticParams\` runs at build time without an HTTP request. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`), "__NEXT_ERROR_CODE", { value: "E1125", enumerable: false, configurable: true });
            case "prerender":
            case "prerender-client":
            case "prerender-runtime":
              return c2 = b2.renderSignal, function(a3, b3) {
                if (a3.aborted) return Promise.reject(b3);
                {
                  let c3 = new Promise((c4, d3) => {
                    let e3 = d3.bind(null, b3), f3 = w.get(a3);
                    if (f3) f3.push(e3);
                    else {
                      let b4 = [e3];
                      w.set(a3, b4), a3.addEventListener("abort", () => {
                        for (let a4 = 0; a4 < b4.length; a4++) b4[a4]();
                      }, { once: true });
                    }
                  });
                  return c3.catch(x), c3;
                }
              }(c2, new v(a2.route, "`connection()`"));
            case "validation-client": {
              let a3 = "`connection`";
              throw Object.defineProperty(new t.z(`${a3} must not be used within a Client Component. Next.js should be preventing ${a3} from being included in Client Components statically, but did not in this case.`), "__NEXT_ERROR_CODE", { value: "E1063", enumerable: false, configurable: true });
            }
            case "prerender-ppr":
              return d2 = a2.route, e2 = "connection", f2 = b2.dynamicTracking, void (function() {
                if (!y) throw Object.defineProperty(Error("Invariant: React.unstable_postpone is not defined. This suggests the wrong version of React was loaded. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E224", enumerable: false, configurable: true });
              }(), f2 && f2.dynamicAccesses.push({ stack: f2.isDebugDynamicAccesses ? Error().stack : void 0, expression: e2 }), q.unstable_postpone(z(d2, e2)));
            case "prerender-legacy":
              var c2, d2, e2, f2, g2 = "connection";
              let h2 = Object.defineProperty(new r(`Route ${a2.route} couldn't be rendered statically because it used \`${g2}\`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`), "__NEXT_ERROR_CODE", { value: "E558", enumerable: false, configurable: true });
              throw b2.revalidate = 0, a2.dynamicUsageDescription = g2, a2.dynamicUsageStack = h2.stack, h2;
            case "request":
              if (!function(a3) {
                switch (a3.type) {
                  case "cache":
                  case "unstable-cache":
                  case "private-cache":
                    return;
                }
              }(b2), b2.asyncApiPromises) return b2.asyncApiPromises.connection;
              return Promise.resolve(void 0);
          }
        }
        (0, o.M1)("connection");
      }
    }, 2397: (a, b) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true }), b.default = "ffffffff-ffff-ffff-ffff-ffffffffffff";
    }, 2454: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true }), b.URL = b.DNS = void 0;
      let d = c(6315), e = c(7961);
      var f = c(7961);
      function g(a2, b2, c2, f2) {
        return (0, e.default)(48, d.default, a2, b2, c2, f2);
      }
      Object.defineProperty(b, "DNS", { enumerable: true, get: function() {
        return f.DNS;
      } }), Object.defineProperty(b, "URL", { enumerable: true, get: function() {
        return f.URL;
      } }), g.DNS = e.DNS, g.URL = e.URL, b.default = g;
    }, 2681: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true });
      var d = { getTestReqInfo: function() {
        return i;
      }, withRequest: function() {
        return h;
      } };
      for (var e in d) Object.defineProperty(b, e, { enumerable: true, get: d[e] });
      let f = new (c(5521)).AsyncLocalStorage();
      function g(a2, b2) {
        let c2 = b2.header(a2, "next-test-proxy-port");
        if (!c2) return;
        let d2 = b2.url(a2);
        return { url: d2, proxyPort: Number(c2), testData: b2.header(a2, "next-test-data") || "" };
      }
      function h(a2, b2, c2) {
        let d2 = g(a2, b2);
        return d2 ? f.run(d2, c2) : c2();
      }
      function i(a2, b2) {
        let c2 = f.getStore();
        return c2 || (a2 && b2 ? g(a2, b2) : void 0);
      }
    }, 2896: (a, b, c) => {
      "use strict";
      var d = Object.defineProperty, e = Object.getOwnPropertyDescriptor, f = Object.getOwnPropertyNames, g = Object.prototype.hasOwnProperty, h = (a2, b2) => {
        for (var c2 in b2) d(a2, c2, { get: b2[c2], enumerable: true });
      }, i = {};
      h(i, { Analytics: () => k, IpDenyList: () => x, MultiRegionRatelimit: () => G, Ratelimit: () => H }), a.exports = ((a2, b2, c2) => {
        if (b2 && "object" == typeof b2 || "function" == typeof b2) for (let h2 of f(b2)) g.call(a2, h2) || void 0 === h2 || d(a2, h2, { get: () => b2[h2], enumerable: !(c2 = e(b2, h2)) || c2.enumerable });
        return a2;
      })(d({}, "__esModule", { value: true }), i);
      var j = c(9735), k = class {
        analytics;
        table = "events";
        constructor(a2) {
          this.analytics = new j.Analytics({ redis: a2.redis, window: "1h", prefix: a2.prefix ?? "@upstash/ratelimit", retention: "90d" });
        }
        extractGeo(a2) {
          return void 0 !== a2.geo ? a2.geo : void 0 !== a2.cf ? a2.cf : {};
        }
        async record(a2) {
          await this.analytics.ingest(this.table, a2);
        }
        async series(a2, b2) {
          let c2 = Math.min((this.analytics.getBucket(Date.now()) - this.analytics.getBucket(b2)) / 36e5, 256);
          return this.analytics.aggregateBucketsWithPipeline(this.table, a2, c2);
        }
        async getUsage(a2 = 0) {
          let b2 = Math.min((this.analytics.getBucket(Date.now()) - this.analytics.getBucket(a2)) / 36e5, 256);
          return await this.analytics.getAllowedBlocked(this.table, b2);
        }
        async getUsageOverTime(a2, b2) {
          return await this.analytics.aggregateBucketsWithPipeline(this.table, b2, a2);
        }
        async getMostAllowedBlocked(a2, b2, c2) {
          return b2 = b2 ?? 5, this.analytics.getMostAllowedBlocked(this.table, a2, b2, void 0, c2);
        }
      }, l = class {
        cache;
        constructor(a2) {
          this.cache = a2;
        }
        isBlocked(a2) {
          if (!this.cache.has(a2)) return { blocked: false, reset: 0 };
          let b2 = this.cache.get(a2);
          return b2 < Date.now() ? (this.cache.delete(a2), { blocked: false, reset: 0 }) : { blocked: true, reset: b2 };
        }
        blockUntil(a2, b2) {
          this.cache.set(a2, b2);
        }
        set(a2, b2) {
          this.cache.set(a2, b2);
        }
        get(a2) {
          return this.cache.get(a2) || null;
        }
        incr(a2, b2 = 1) {
          let c2 = this.cache.get(a2) ?? 0;
          return c2 += b2, this.cache.set(a2, c2), c2;
        }
        pop(a2) {
          this.cache.delete(a2);
        }
        empty() {
          this.cache.clear();
        }
        size() {
          return this.cache.size;
        }
      }, m = ":dynamic:global", n = "@upstash/ratelimit";
      function o(a2) {
        let b2 = a2.match(/^(\d+)\s?(ms|s|m|h|d)$/);
        if (!b2) throw Error(`Unable to parse window size: ${a2}`);
        let c2 = Number.parseInt(b2[1]);
        switch (b2[2]) {
          case "ms":
            return c2;
          case "s":
            return 1e3 * c2;
          case "m":
            return 1e3 * c2 * 60;
          case "h":
            return 1e3 * c2 * 3600;
          case "d":
            return 1e3 * c2 * 86400;
          default:
            throw Error(`Unable to parse window size: ${a2}`);
        }
      }
      var p = async (a2, b2, c2, d2) => {
        try {
          return await a2.redis.evalsha(b2.hash, c2, d2);
        } catch (e2) {
          if (`${e2}`.includes("NOSCRIPT")) return await a2.redis.eval(b2.script, c2, d2);
          throw e2;
        }
      }, q = { fixedWindow: { limit: { script: `
  local key           = KEYS[1]
  local dynamicLimitKey = KEYS[2]  -- optional: key for dynamic limit in redis
  local tokens        = tonumber(ARGV[1])  -- default limit
  local window        = ARGV[2]
  local incrementBy   = ARGV[3] -- increment rate per request at a given value, default is 1

  -- Check for dynamic limit
  local effectiveLimit = tokens
  if dynamicLimitKey ~= "" then
    local dynamicLimit = redis.call("GET", dynamicLimitKey)
    if dynamicLimit then
      effectiveLimit = tonumber(dynamicLimit)
    end
  end

  local r = redis.call("INCRBY", key, incrementBy)
  if r == tonumber(incrementBy) then
  -- The first time this key is set, the value will be equal to incrementBy.
  -- So we only need the expire command once
  redis.call("PEXPIRE", key, window)
  end

  return {r, effectiveLimit}
`, hash: "472e55443b62f60d0991028456c57815a387066d" }, getRemaining: { script: `
  local key = KEYS[1]
  local dynamicLimitKey = KEYS[2]  -- optional: key for dynamic limit in redis
  local tokens = tonumber(ARGV[1])  -- default limit

  -- Check for dynamic limit
  local effectiveLimit = tokens
  if dynamicLimitKey ~= "" then
    local dynamicLimit = redis.call("GET", dynamicLimitKey)
    if dynamicLimit then
      effectiveLimit = tonumber(dynamicLimit)
    end
  end

  local value = redis.call('GET', key)
  local usedTokens = 0
  if value then
    usedTokens = tonumber(value)
  end
  
  return {effectiveLimit - usedTokens, effectiveLimit}
`, hash: "40515c9dd0a08f8584f5f9b593935f6a87c1c1c3" } }, slidingWindow: { limit: { script: `
  local currentKey  = KEYS[1]           -- identifier including prefixes
  local previousKey = KEYS[2]           -- key of the previous bucket
  local dynamicLimitKey = KEYS[3]       -- optional: key for dynamic limit in redis
  local tokens      = tonumber(ARGV[1]) -- default tokens per window
  local now         = ARGV[2]           -- current timestamp in milliseconds
  local window      = ARGV[3]           -- interval in milliseconds
  local incrementBy = tonumber(ARGV[4]) -- increment rate per request at a given value, default is 1

  -- Check for dynamic limit
  local effectiveLimit = tokens
  if dynamicLimitKey ~= "" then
    local dynamicLimit = redis.call("GET", dynamicLimitKey)
    if dynamicLimit then
      effectiveLimit = tonumber(dynamicLimit)
    end
  end

  local requestsInCurrentWindow = redis.call("GET", currentKey)
  if requestsInCurrentWindow == false then
    requestsInCurrentWindow = 0
  end

  local requestsInPreviousWindow = redis.call("GET", previousKey)
  if requestsInPreviousWindow == false then
    requestsInPreviousWindow = 0
  end
  local percentageInCurrent = ( now % window ) / window
  -- weighted requests to consider from the previous window
  requestsInPreviousWindow = math.floor(( 1 - percentageInCurrent ) * requestsInPreviousWindow)

  -- Only check limit if not refunding (negative rate)
  if incrementBy > 0 and requestsInPreviousWindow + requestsInCurrentWindow >= effectiveLimit then
    return {-1, effectiveLimit}
  end

  local newValue = redis.call("INCRBY", currentKey, incrementBy)
  if newValue == incrementBy then
    -- The first time this key is set, the value will be equal to incrementBy.
    -- So we only need the expire command once
    redis.call("PEXPIRE", currentKey, window * 2 + 1000) -- Enough time to overlap with a new window + 1 second
  end
  return {effectiveLimit - ( newValue + requestsInPreviousWindow ), effectiveLimit}
`, hash: "977fb636fb5ceb7e98a96d1b3a1272ba018efdae" }, getRemaining: { script: `
  local currentKey  = KEYS[1]           -- identifier including prefixes
  local previousKey = KEYS[2]           -- key of the previous bucket
  local dynamicLimitKey = KEYS[3]       -- optional: key for dynamic limit in redis
  local tokens      = tonumber(ARGV[1]) -- default tokens per window
  local now         = ARGV[2]           -- current timestamp in milliseconds
  local window      = ARGV[3]           -- interval in milliseconds

  -- Check for dynamic limit
  local effectiveLimit = tokens
  if dynamicLimitKey ~= "" then
    local dynamicLimit = redis.call("GET", dynamicLimitKey)
    if dynamicLimit then
      effectiveLimit = tonumber(dynamicLimit)
    end
  end

  local requestsInCurrentWindow = redis.call("GET", currentKey)
  if requestsInCurrentWindow == false then
    requestsInCurrentWindow = 0
  end

  local requestsInPreviousWindow = redis.call("GET", previousKey)
  if requestsInPreviousWindow == false then
    requestsInPreviousWindow = 0
  end

  local percentageInCurrent = ( now % window ) / window
  -- weighted requests to consider from the previous window
  requestsInPreviousWindow = math.floor(( 1 - percentageInCurrent ) * requestsInPreviousWindow)

  local usedTokens = requestsInPreviousWindow + requestsInCurrentWindow
  return {effectiveLimit - usedTokens, effectiveLimit}
`, hash: "ee3a3265fad822f83acad23f8a1e2f5c0b156b03" } }, tokenBucket: { limit: { script: `
  local key         = KEYS[1]           -- identifier including prefixes
  local dynamicLimitKey = KEYS[2]       -- optional: key for dynamic limit in redis
  local maxTokens   = tonumber(ARGV[1]) -- default maximum number of tokens
  local interval    = tonumber(ARGV[2]) -- size of the window in milliseconds
  local refillRate  = tonumber(ARGV[3]) -- how many tokens are refilled after each interval
  local now         = tonumber(ARGV[4]) -- current timestamp in milliseconds
  local incrementBy = tonumber(ARGV[5]) -- how many tokens to consume, default is 1

  -- Check for dynamic limit
  local effectiveLimit = maxTokens
  if dynamicLimitKey ~= "" then
    local dynamicLimit = redis.call("GET", dynamicLimitKey)
    if dynamicLimit then
      effectiveLimit = tonumber(dynamicLimit)
    end
  end
        
  local bucket = redis.call("HMGET", key, "refilledAt", "tokens")
        
  local refilledAt
  local tokens

  if bucket[1] == false then
    refilledAt = now
    tokens = effectiveLimit
  else
    refilledAt = tonumber(bucket[1])
    tokens = tonumber(bucket[2])
  end
        
  if now >= refilledAt + interval then
    local numRefills = math.floor((now - refilledAt) / interval)
    tokens = math.min(effectiveLimit, tokens + numRefills * refillRate)

    refilledAt = refilledAt + numRefills * interval
  end

  -- Only reject if tokens are 0 and we're consuming (not refunding)
  if tokens == 0 and incrementBy > 0 then
    return {-1, refilledAt + interval, effectiveLimit}
  end

  local remaining = tokens - incrementBy
  local expireAt = math.ceil(((effectiveLimit - remaining) / refillRate)) * interval
        
  redis.call("HSET", key, "refilledAt", refilledAt, "tokens", remaining)

  if (expireAt > 0) then
    redis.call("PEXPIRE", key, expireAt)
  end
  return {remaining, refilledAt + interval, effectiveLimit}
`, hash: "b35c5bc0b7fdae7dd0573d4529911cabaf9d1d89" }, getRemaining: { script: `
  local key         = KEYS[1]
  local dynamicLimitKey = KEYS[2]       -- optional: key for dynamic limit in redis
  local maxTokens   = tonumber(ARGV[1]) -- default maximum number of tokens

  -- Check for dynamic limit
  local effectiveLimit = maxTokens
  if dynamicLimitKey ~= "" then
    local dynamicLimit = redis.call("GET", dynamicLimitKey)
    if dynamicLimit then
      effectiveLimit = tonumber(dynamicLimit)
    end
  end
        
  local bucket = redis.call("HMGET", key, "refilledAt", "tokens")

  if bucket[1] == false then
    return {effectiveLimit, -1, effectiveLimit}
  end
        
  return {tonumber(bucket[2]), tonumber(bucket[1]), effectiveLimit}
`, hash: "deb03663e8af5a968deee895dd081be553d2611b" } }, cachedFixedWindow: { limit: { script: `
  local key     = KEYS[1]
  local window  = ARGV[1]
  local incrementBy   = ARGV[2] -- increment rate per request at a given value, default is 1

  local r = redis.call("INCRBY", key, incrementBy)
  if r == incrementBy then
  -- The first time this key is set, the value will be equal to incrementBy.
  -- So we only need the expire command once
  redis.call("PEXPIRE", key, window)
  end
      
  return r
`, hash: "c26b12703dd137939b9a69a3a9b18e906a2d940f" }, getRemaining: { script: `
  local key = KEYS[1]
  local tokens = 0

  local value = redis.call('GET', key)
  if value then
      tokens = value
  end
  return tokens
`, hash: "8e8f222ccae68b595ee6e3f3bf2199629a62b91a" } } }, r = { fixedWindow: { limit: { script: `
	local key           = KEYS[1]
	local id            = ARGV[1]
	local window        = ARGV[2]
	local incrementBy   = tonumber(ARGV[3])

	redis.call("HSET", key, id, incrementBy)
	local fields = redis.call("HGETALL", key)
	if #fields == 2 and tonumber(fields[2])==incrementBy then
	-- The first time this key is set, and the value will be equal to incrementBy.
	-- So we only need the expire command once
	  redis.call("PEXPIRE", key, window)
	end

	return fields
`, hash: "a8c14f3835aa87bd70e5e2116081b81664abcf5c" }, getRemaining: { script: `
      local key = KEYS[1]
      local tokens = 0

      local fields = redis.call("HGETALL", key)

      return fields
    `, hash: "8ab8322d0ed5fe5ac8eb08f0c2e4557f1b4816fd" } }, slidingWindow: { limit: { script: `
	local currentKey    = KEYS[1]           -- identifier including prefixes
	local previousKey   = KEYS[2]           -- key of the previous bucket
	local tokens        = tonumber(ARGV[1]) -- tokens per window
	local now           = ARGV[2]           -- current timestamp in milliseconds
	local window        = ARGV[3]           -- interval in milliseconds
	local requestId     = ARGV[4]           -- uuid for this request
	local incrementBy   = tonumber(ARGV[5]) -- custom rate, default is  1

	local currentFields = redis.call("HGETALL", currentKey)
	local requestsInCurrentWindow = 0
	for i = 2, #currentFields, 2 do
	requestsInCurrentWindow = requestsInCurrentWindow + tonumber(currentFields[i])
	end

	local previousFields = redis.call("HGETALL", previousKey)
	local requestsInPreviousWindow = 0
	for i = 2, #previousFields, 2 do
	requestsInPreviousWindow = requestsInPreviousWindow + tonumber(previousFields[i])
	end

	local percentageInCurrent = ( now % window) / window

	-- Only check limit if not refunding (negative rate)
	if incrementBy > 0 and requestsInPreviousWindow * (1 - percentageInCurrent ) + requestsInCurrentWindow + incrementBy > tokens then
	  return {currentFields, previousFields, false}
	end

	redis.call("HSET", currentKey, requestId, incrementBy)

	if requestsInCurrentWindow == 0 then 
	  -- The first time this key is set, the value will be equal to incrementBy.
	  -- So we only need the expire command once
	  redis.call("PEXPIRE", currentKey, window * 2 + 1000) -- Enough time to overlap with a new window + 1 second
	end
	return {currentFields, previousFields, true}
`, hash: "1e7ca8dcd2d600a6d0124a67a57ea225ed62921b" }, getRemaining: { script: `
	local currentKey    = KEYS[1]           -- identifier including prefixes
	local previousKey   = KEYS[2]           -- key of the previous bucket
	local now         	= ARGV[1]           -- current timestamp in milliseconds
  	local window      	= ARGV[2]           -- interval in milliseconds

	local currentFields = redis.call("HGETALL", currentKey)
	local requestsInCurrentWindow = 0
	for i = 2, #currentFields, 2 do
	requestsInCurrentWindow = requestsInCurrentWindow + tonumber(currentFields[i])
	end

	local previousFields = redis.call("HGETALL", previousKey)
	local requestsInPreviousWindow = 0
	for i = 2, #previousFields, 2 do
	requestsInPreviousWindow = requestsInPreviousWindow + tonumber(previousFields[i])
	end

	local percentageInCurrent = ( now % window) / window
  	requestsInPreviousWindow = math.floor(( 1 - percentageInCurrent ) * requestsInPreviousWindow)
	
	return requestsInCurrentWindow + requestsInPreviousWindow
`, hash: "558c9306b7ec54abb50747fe0b17e5d44bd24868" } } }, s = { script: `
      local pattern = KEYS[1]

      -- Initialize cursor to start from 0
      local cursor = "0"

      repeat
          -- Scan for keys matching the pattern
          local scan_result = redis.call('SCAN', cursor, 'MATCH', pattern)

          -- Extract cursor for the next iteration
          cursor = scan_result[1]

          -- Extract keys from the scan result
          local keys = scan_result[2]

          for i=1, #keys do
          redis.call('DEL', keys[i])
          end

      -- Continue scanning until cursor is 0 (end of keyspace)
      until cursor == "0"
    `, hash: "54bd274ddc59fb3be0f42deee2f64322a10e2b50" }, t = "denyList", u = "ipDenyList", v = "ipDenyListStatus", w = `
  -- Checks if values provideed in ARGV are present in the deny lists.
  -- This is done using the allDenyListsKey below.

  -- Additionally, checks the status of the ip deny list using the
  -- ipDenyListStatusKey below. Here are the possible states of the
  -- ipDenyListStatusKey key:
  -- * status == -1: set to "disabled" with no TTL
  -- * status == -2: not set, meaning that is was set before but expired
  -- * status  >  0: set to "valid", with a TTL
  --
  -- In the case of status == -2, we set the status to "pending" with
  -- 30 second ttl. During this time, the process which got status == -2
  -- will update the ip deny list.

  local allDenyListsKey     = KEYS[1]
  local ipDenyListStatusKey = KEYS[2]

  local results = redis.call('SMISMEMBER', allDenyListsKey, unpack(ARGV))
  local status  = redis.call('TTL', ipDenyListStatusKey)
  if status == -2 then
    redis.call('SETEX', ipDenyListStatusKey, 30, "pending")
  end

  return { results, status }
`, x = {};
      h(x, { ThresholdError: () => y, disableIpDenyList: () => B, updateIpDenyList: () => A });
      var y = class extends Error {
        constructor(a2) {
          super(`Allowed threshold values are from 1 to 8, 1 and 8 included. Received: ${a2}`), this.name = "ThresholdError";
        }
      }, z = async (a2) => {
        if ("number" != typeof a2 || a2 < 1 || a2 > 8) throw new y(a2);
        try {
          let b2 = await fetch(`https://raw.githubusercontent.com/stamparm/ipsum/master/levels/${a2}.txt`);
          if (!b2.ok) throw Error(`Error fetching data: ${b2.statusText}`);
          return (await b2.text()).split("\n").filter((a3) => a3.length > 0);
        } catch (a3) {
          throw Error(`Failed to fetch ip deny list: ${a3}`);
        }
      }, A = async (a2, b2, c2, d2) => {
        let e2 = await z(c2), f2 = [b2, t, "all"].join(":"), g2 = [b2, t, u].join(":"), h2 = [b2, v].join(":"), i2 = a2.multi();
        return i2.sdiffstore(f2, f2, g2), i2.del(g2), i2.sadd(g2, e2.at(0), ...e2.slice(1)), i2.sdiffstore(g2, g2, f2), i2.sunionstore(f2, f2, g2), i2.set(h2, "valid", { px: d2 ?? 864e5 - (Date.now() - 72e5) % 864e5 }), await i2.exec();
      }, B = async (a2, b2) => {
        let c2 = [b2, t, "all"].join(":"), d2 = [b2, t, u].join(":"), e2 = [b2, v].join(":"), f2 = a2.multi();
        return f2.sdiffstore(c2, c2, d2), f2.del(d2), f2.set(e2, "disabled"), await f2.exec();
      }, C = new l(/* @__PURE__ */ new Map()), D = async (a2, b2, c2) => {
        let d2, [e2, f2] = await a2.eval(w, [[b2, t, "all"].join(":"), [b2, v].join(":")], c2);
        return e2.map((a3, b3) => {
          if (a3) {
            var e3;
            e3 = c2[b3], C.size() > 1e3 && C.empty(), C.blockUntil(e3, Date.now() + 6e4), d2 = c2[b3];
          }
        }), { deniedValue: d2, invalidIpDenyList: -2 === f2 };
      }, E = class {
        limiter;
        ctx;
        prefix;
        timeout;
        primaryRedis;
        analytics;
        enableProtection;
        denyListThreshold;
        dynamicLimits;
        constructor(a2) {
          this.ctx = a2.ctx, this.limiter = a2.limiter, this.timeout = a2.timeout ?? 5e3, this.prefix = a2.prefix ?? n, this.dynamicLimits = a2.dynamicLimits ?? false, this.enableProtection = a2.enableProtection ?? false, this.denyListThreshold = a2.denyListThreshold ?? 6, this.primaryRedis = "redis" in this.ctx ? this.ctx.redis : this.ctx.regionContexts[0].redis, "redis" in this.ctx && (this.ctx.dynamicLimits = this.dynamicLimits, this.ctx.prefix = this.prefix), this.analytics = a2.analytics ? new k({ redis: this.primaryRedis, prefix: this.prefix }) : void 0, a2.ephemeralCache instanceof Map ? this.ctx.cache = new l(a2.ephemeralCache) : void 0 === a2.ephemeralCache && (this.ctx.cache = new l(/* @__PURE__ */ new Map()));
        }
        limit = async (a2, b2) => {
          let c2 = null;
          try {
            let d2 = this.getRatelimitResponse(a2, b2), { responseArray: e2, newTimeoutId: f2 } = this.applyTimeout(d2);
            c2 = f2;
            let g2 = await Promise.race(e2);
            return this.submitAnalytics(g2, a2, b2);
          } finally {
            c2 && clearTimeout(c2);
          }
        };
        blockUntilReady = async (a2, b2) => {
          let c2;
          if (b2 <= 0) throw Error("timeout must be positive");
          let d2 = Date.now() + b2;
          for (; !(c2 = await this.limit(a2)).success; ) {
            if (0 === c2.reset) throw Error("This should not happen");
            let a3 = Math.min(c2.reset, d2) - Date.now();
            if (await new Promise((b3) => setTimeout(b3, a3)), Date.now() > d2) break;
          }
          return c2;
        };
        resetUsedTokens = async (a2) => {
          let b2 = [this.prefix, a2].join(":");
          await this.limiter().resetTokens(this.ctx, b2);
        };
        getRemaining = async (a2) => {
          let b2 = [this.prefix, a2].join(":");
          return await this.limiter().getRemaining(this.ctx, b2);
        };
        getRatelimitResponse = async (a2, b2) => {
          let c2 = this.getKey(a2), d2 = this.getDefinedMembers(a2, b2), e2 = d2.find((a3) => C.isBlocked(a3).blocked), f2 = e2 ? [{ success: false, limit: 0, remaining: 0, reset: 0, pending: Promise.resolve(), reason: "denyList", deniedValue: e2 }, { deniedValue: e2, invalidIpDenyList: false }] : await Promise.all([this.limiter().limit(this.ctx, c2, b2?.rate), this.enableProtection ? D(this.primaryRedis, this.prefix, d2) : { deniedValue: void 0, invalidIpDenyList: false }]);
          return ((a3, b3, [c3, d3], e3) => {
            if (d3.deniedValue && (c3.success = false, c3.remaining = 0, c3.reason = "denyList", c3.deniedValue = d3.deniedValue), d3.invalidIpDenyList) {
              let d4 = A(a3, b3, e3);
              c3.pending = Promise.all([c3.pending, d4]);
            }
            return c3;
          })(this.primaryRedis, this.prefix, f2, this.denyListThreshold);
        };
        applyTimeout = (a2) => {
          let b2 = null, c2 = [a2];
          if (this.timeout > 0) {
            let a3 = new Promise((a4) => {
              b2 = setTimeout(() => {
                a4({ success: true, limit: 0, remaining: 0, reset: 0, pending: Promise.resolve(), reason: "timeout" });
              }, this.timeout);
            });
            c2.push(a3);
          }
          return { responseArray: c2, newTimeoutId: b2 };
        };
        submitAnalytics = (a2, b2, c2) => {
          if (this.analytics) try {
            let d2 = c2 ? this.analytics.extractGeo(c2) : void 0, e2 = this.analytics.record({ identifier: "denyList" === a2.reason ? a2.deniedValue : b2, time: Date.now(), success: "denyList" === a2.reason ? "denied" : a2.success, ...d2 }).catch((a3) => {
              let b3 = "Failed to record analytics";
              `${a3}`.includes("WRONGTYPE") && (b3 = `
    Failed to record analytics. See the information below:

    This can occur when you uprade to Ratelimit version 1.1.2
    or later from an earlier version.

    This occurs simply because the way we store analytics data
    has changed. To avoid getting this error, disable analytics
    for *an hour*, then simply enable it back.

    `), console.warn(b3, a3);
            });
            a2.pending = Promise.all([a2.pending, e2]);
          } catch (a3) {
            console.warn("Failed to record analytics", a3);
          }
          return a2;
        };
        getKey = (a2) => [this.prefix, a2].join(":");
        getDefinedMembers = (a2, b2) => [a2, b2?.ip, b2?.userAgent, b2?.country].filter(Boolean);
        setDynamicLimit = async (a2) => {
          if (!this.dynamicLimits) throw Error("dynamicLimits must be enabled in the Ratelimit constructor to use setDynamicLimit()");
          let b2 = `${this.prefix}${m}`;
          await (false === a2.limit ? this.primaryRedis.del(b2) : this.primaryRedis.set(b2, a2.limit));
        };
        getDynamicLimit = async () => {
          if (!this.dynamicLimits) throw Error("dynamicLimits must be enabled in the Ratelimit constructor to use getDynamicLimit()");
          let a2 = `${this.prefix}${m}`, b2 = await this.primaryRedis.get(a2);
          return { dynamicLimit: null === b2 ? null : Number(b2) };
        };
      };
      function F() {
        let a2 = "", b2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", c2 = b2.length;
        for (let d2 = 0; d2 < 16; d2++) a2 += b2.charAt(Math.floor(Math.random() * c2));
        return a2;
      }
      var G = class extends E {
        constructor(a2) {
          super({ prefix: a2.prefix, limiter: a2.limiter, timeout: a2.timeout, analytics: a2.analytics, dynamicLimits: a2.dynamicLimits, ctx: { regionContexts: a2.redis.map((b2) => ({ redis: b2, prefix: a2.prefix ?? n })), cache: a2.ephemeralCache ? new l(a2.ephemeralCache) : void 0 } }), a2.dynamicLimits && console.warn("Warning: Dynamic limits are not yet supported for multi-region rate limiters. The dynamicLimits option will be ignored.");
        }
        static fixedWindow(a2, b2) {
          let c2 = o(b2);
          return () => ({ async limit(b3, d2, e2) {
            let f2 = F(), g2 = Math.floor(Date.now() / c2), h2 = [d2, g2].join(":"), i2 = e2 ?? 1;
            if (b3.cache && i2 > 0) {
              let { blocked: c3, reset: e3 } = b3.cache.isBlocked(d2);
              if (c3) return { success: false, limit: a2, remaining: 0, reset: e3, pending: Promise.resolve(), reason: "cacheBlock" };
            }
            let j2 = b3.regionContexts.map((a3) => ({ redis: a3.redis, request: p(a3, r.fixedWindow.limit, [h2], [f2, c2, i2]) })), k2 = a2 - (await Promise.any(j2.map((a3) => a3.request))).reduce((a3, b4, c3) => {
              let d3 = 0;
              return c3 % 2 && (d3 = Number.parseInt(b4)), a3 + d3;
            }, 0);
            async function l2() {
              let b4 = [...new Set((await Promise.all(j2.map((a3) => a3.request))).flat().reduce((a3, b5, c3) => (c3 % 2 == 0 && a3.push(b5), a3), [])).values()];
              for (let c3 of j2) {
                let d3 = (await c3.request).reduce((a3, b5, c4) => {
                  let d4 = 0;
                  return c4 % 2 && (d4 = Number.parseInt(b5)), a3 + d4;
                }, 0), e3 = (await c3.request).reduce((a3, b5, c4) => (c4 % 2 == 0 && a3.push(b5), a3), []);
                if (d3 >= a2) continue;
                let f3 = b4.filter((a3) => !e3.includes(a3));
                if (0 !== f3.length) for (let a3 of f3) await c3.redis.hset(h2, { [a3]: i2 });
              }
            }
            let m2 = k2 >= 0, n2 = (g2 + 1) * c2;
            return b3.cache && (m2 ? i2 < 0 && b3.cache.pop(d2) : b3.cache.blockUntil(d2, n2)), { success: m2, limit: a2, remaining: k2, reset: n2, pending: l2() };
          }, async getRemaining(b3, d2) {
            let e2 = Math.floor(Date.now() / c2), f2 = [d2, e2].join(":"), g2 = b3.regionContexts.map((a3) => ({ redis: a3.redis, request: p(a3, r.fixedWindow.getRemaining, [f2], [null]) }));
            return { remaining: Math.max(0, a2 - (await Promise.any(g2.map((a3) => a3.request))).reduce((a3, b4, c3) => {
              let d3 = 0;
              return c3 % 2 && (d3 = Number.parseInt(b4)), a3 + d3;
            }, 0)), reset: (e2 + 1) * c2, limit: a2 };
          }, async resetTokens(a3, b3) {
            let c3 = [b3, "*"].join(":");
            a3.cache && a3.cache.pop(b3), await Promise.all(a3.regionContexts.map((a4) => {
              p(a4, s, [c3], [null]);
            }));
          } });
        }
        static slidingWindow(a2, b2) {
          let c2 = o(b2), d2 = o(b2);
          return () => ({ async limit(b3, e2, f2) {
            let g2 = F(), h2 = Date.now(), i2 = Math.floor(h2 / c2), j2 = [e2, i2].join(":"), k2 = [e2, i2 - 1].join(":"), l2 = f2 ?? 1;
            if (b3.cache && l2 > 0) {
              let { blocked: c3, reset: d3 } = b3.cache.isBlocked(e2);
              if (c3) return { success: false, limit: a2, remaining: 0, reset: d3, pending: Promise.resolve(), reason: "cacheBlock" };
            }
            let m2 = b3.regionContexts.map((b4) => ({ redis: b4.redis, request: p(b4, r.slidingWindow.limit, [j2, k2], [a2, h2, d2, g2, l2]) })), n2 = h2 % d2 / d2, [o2, q2, s2] = await Promise.any(m2.map((a3) => a3.request));
            s2 && o2.push(g2, l2.toString());
            let t2 = a2 - (Math.ceil(q2.reduce((a3, b4, c3) => {
              let d3 = 0;
              return c3 % 2 && (d3 = Number.parseInt(b4)), a3 + d3;
            }, 0) * (1 - n2)) + o2.reduce((a3, b4, c3) => {
              let d3 = 0;
              return c3 % 2 && (d3 = Number.parseInt(b4)), a3 + d3;
            }, 0));
            async function u2() {
              let b4 = [...new Set((await Promise.all(m2.map((a3) => a3.request))).flatMap(([a3]) => a3).reduce((a3, b5, c3) => (c3 % 2 == 0 && a3.push(b5), a3), [])).values()];
              for (let c3 of m2) {
                let [d3, e3, f3] = await c3.request, g3 = d3.reduce((a3, b5, c4) => (c4 % 2 == 0 && a3.push(b5), a3), []);
                if (d3.reduce((a3, b5, c4) => {
                  let d4 = 0;
                  return c4 % 2 && (d4 = Number.parseInt(b5)), a3 + d4;
                }, 0) >= a2) continue;
                let h3 = b4.filter((a3) => !g3.includes(a3));
                if (0 !== h3.length) for (let a3 of h3) await c3.redis.hset(j2, { [a3]: l2 });
              }
            }
            let v2 = (i2 + 1) * d2;
            return b3.cache && (s2 ? l2 < 0 && b3.cache.pop(e2) : b3.cache.blockUntil(e2, v2)), { success: !!s2, limit: a2, remaining: Math.max(0, t2), reset: v2, pending: u2() };
          }, async getRemaining(b3, d3) {
            let e2 = Date.now(), f2 = Math.floor(e2 / c2), g2 = [d3, f2].join(":"), h2 = [d3, f2 - 1].join(":"), i2 = b3.regionContexts.map((a3) => ({ redis: a3.redis, request: p(a3, r.slidingWindow.getRemaining, [g2, h2], [e2, c2]) }));
            return { remaining: Math.max(0, a2 - await Promise.any(i2.map((a3) => a3.request))), reset: (f2 + 1) * c2, limit: a2 };
          }, async resetTokens(a3, b3) {
            let c3 = [b3, "*"].join(":");
            a3.cache && a3.cache.pop(b3), await Promise.all(a3.regionContexts.map((a4) => {
              p(a4, s, [c3], [null]);
            }));
          } });
        }
      }, H = class extends E {
        constructor(a2) {
          super({ prefix: a2.prefix, limiter: a2.limiter, timeout: a2.timeout, analytics: a2.analytics, ctx: { redis: a2.redis, prefix: a2.prefix ?? n }, ephemeralCache: a2.ephemeralCache, enableProtection: a2.enableProtection, denyListThreshold: a2.denyListThreshold, dynamicLimits: a2.dynamicLimits });
        }
        static fixedWindow(a2, b2) {
          let c2 = o(b2);
          return () => ({ async limit(b3, d2, e2) {
            let f2 = Math.floor(Date.now() / c2), g2 = [d2, f2].join(":"), h2 = e2 ?? 1;
            if (b3.cache && h2 > 0) {
              let { blocked: c3, reset: e3 } = b3.cache.isBlocked(d2);
              if (c3) return { success: false, limit: a2, remaining: 0, reset: e3, pending: Promise.resolve(), reason: "cacheBlock" };
            }
            let i2 = b3.dynamicLimits ? `${b3.prefix}${m}` : "", [j2, k2] = await p(b3, q.fixedWindow.limit, [g2, i2], [a2, c2, h2]), l2 = j2 <= k2, n2 = Math.max(0, k2 - j2), o2 = (f2 + 1) * c2;
            return b3.cache && (l2 ? h2 < 0 && b3.cache.pop(d2) : b3.cache.blockUntil(d2, o2)), { success: l2, limit: k2, remaining: n2, reset: o2, pending: Promise.resolve() };
          }, async getRemaining(b3, d2) {
            let e2 = Math.floor(Date.now() / c2), f2 = [d2, e2].join(":"), g2 = b3.dynamicLimits ? `${b3.prefix}${m}` : "", [h2, i2] = await p(b3, q.fixedWindow.getRemaining, [f2, g2], [a2]);
            return { remaining: Math.max(0, h2), reset: (e2 + 1) * c2, limit: i2 };
          }, async resetTokens(a3, b3) {
            let c3 = [b3, "*"].join(":");
            a3.cache && a3.cache.pop(b3), await p(a3, s, [c3], [null]);
          } });
        }
        static slidingWindow(a2, b2) {
          let c2 = o(b2);
          return () => ({ async limit(b3, d2, e2) {
            let f2 = Date.now(), g2 = Math.floor(f2 / c2), h2 = [d2, g2].join(":"), i2 = [d2, g2 - 1].join(":"), j2 = e2 ?? 1;
            if (b3.cache && j2 > 0) {
              let { blocked: c3, reset: e3 } = b3.cache.isBlocked(d2);
              if (c3) return { success: false, limit: a2, remaining: 0, reset: e3, pending: Promise.resolve(), reason: "cacheBlock" };
            }
            let k2 = b3.dynamicLimits ? `${b3.prefix}${m}` : "", [l2, n2] = await p(b3, q.slidingWindow.limit, [h2, i2, k2], [a2, f2, c2, j2]), o2 = l2 >= 0, r2 = (g2 + 1) * c2;
            return b3.cache && (o2 ? j2 < 0 && b3.cache.pop(d2) : b3.cache.blockUntil(d2, r2)), { success: o2, limit: n2, remaining: Math.max(0, l2), reset: r2, pending: Promise.resolve() };
          }, async getRemaining(b3, d2) {
            let e2 = Date.now(), f2 = Math.floor(e2 / c2), g2 = [d2, f2].join(":"), h2 = [d2, f2 - 1].join(":"), i2 = b3.dynamicLimits ? `${b3.prefix}${m}` : "", [j2, k2] = await p(b3, q.slidingWindow.getRemaining, [g2, h2, i2], [a2, e2, c2]);
            return { remaining: Math.max(0, j2), reset: (f2 + 1) * c2, limit: k2 };
          }, async resetTokens(a3, b3) {
            let c3 = [b3, "*"].join(":");
            a3.cache && a3.cache.pop(b3), await p(a3, s, [c3], [null]);
          } });
        }
        static tokenBucket(a2, b2, c2) {
          let d2 = o(b2);
          return () => ({ async limit(b3, e2, f2) {
            let g2 = Date.now(), h2 = f2 ?? 1;
            if (b3.cache && h2 > 0) {
              let { blocked: a3, reset: d3 } = b3.cache.isBlocked(e2);
              if (a3) return { success: false, limit: c2, remaining: 0, reset: d3, pending: Promise.resolve(), reason: "cacheBlock" };
            }
            let i2 = b3.dynamicLimits ? `${b3.prefix}${m}` : "", [j2, k2, l2] = await p(b3, q.tokenBucket.limit, [e2, i2], [c2, d2, a2, g2, h2]), n2 = j2 >= 0;
            return b3.cache && (n2 ? h2 < 0 && b3.cache.pop(e2) : b3.cache.blockUntil(e2, k2)), { success: n2, limit: l2, remaining: Math.max(0, j2), reset: k2, pending: Promise.resolve() };
          }, async getRemaining(a3, b3) {
            let e2 = a3.dynamicLimits ? `${a3.prefix}${m}` : "", [f2, g2, h2] = await p(a3, q.tokenBucket.getRemaining, [b3, e2], [c2]), i2 = Date.now() + d2, j2 = g2 + d2;
            return { remaining: Math.max(0, f2), reset: -1 === g2 ? i2 : j2, limit: h2 };
          }, async resetTokens(a3, b3) {
            a3.cache && a3.cache.pop(b3), await p(a3, s, [b3], [null]);
          } });
        }
        static cachedFixedWindow(a2, b2) {
          let c2 = o(b2);
          return () => ({ async limit(b3, d2, e2) {
            if (!b3.cache) throw Error("This algorithm requires a cache");
            b3.dynamicLimits && console.warn("Warning: Dynamic limits are not yet supported for cachedFixedWindow algorithm. The dynamicLimits option will be ignored.");
            let f2 = Math.floor(Date.now() / c2), g2 = [d2, f2].join(":"), h2 = (f2 + 1) * c2, i2 = e2 ?? 1;
            if ("number" == typeof b3.cache.get(g2)) {
              let d3 = b3.cache.incr(g2, i2), e3 = d3 < a2, f3 = e3 ? p(b3, q.cachedFixedWindow.limit, [g2], [c2, i2]) : Promise.resolve();
              return { success: e3, limit: a2, remaining: a2 - d3, reset: h2, pending: f3 };
            }
            let j2 = await p(b3, q.cachedFixedWindow.limit, [g2], [c2, i2]);
            b3.cache.set(g2, j2);
            let k2 = a2 - j2;
            return { success: k2 >= 0, limit: a2, remaining: k2, reset: h2, pending: Promise.resolve() };
          }, async getRemaining(b3, d2) {
            if (!b3.cache) throw Error("This algorithm requires a cache");
            let e2 = Math.floor(Date.now() / c2), f2 = [d2, e2].join(":");
            return "number" == typeof b3.cache.get(f2) ? { remaining: Math.max(0, a2 - (b3.cache.get(f2) ?? 0)), reset: (e2 + 1) * c2, limit: a2 } : { remaining: Math.max(0, a2 - await p(b3, q.cachedFixedWindow.getRemaining, [f2], [null])), reset: (e2 + 1) * c2, limit: a2 };
          }, async resetTokens(a3, b3) {
            if (!a3.cache) throw Error("This algorithm requires a cache");
            let d2 = [b3, Math.floor(Date.now() / c2)].join(":");
            a3.cache.pop(d2);
            let e2 = [b3, "*"].join(":");
            await p(a3, s, [e2], [null]);
          } });
        }
      };
    }, 3061: (a, b, c) => {
      "use strict";
      c.r(b), c.d(b, { default: () => f, hkdf: () => f });
      let d = async (a2, b2, c2, d2, e2) => {
        let { crypto: { subtle: f2 } } = (() => {
          if ("u" > typeof globalThis) return globalThis;
          if ("u" > typeof self) return self;
          if ("u" > typeof window) return window;
          throw Error("unable to locate global object");
        })();
        return new Uint8Array(await f2.deriveBits({ name: "HKDF", hash: `SHA-${a2.substr(3)}`, salt: c2, info: d2 }, await f2.importKey("raw", b2, "HKDF", false, ["deriveBits"]), e2 << 3));
      };
      function e(a2, b2) {
        if ("string" == typeof a2) return new TextEncoder().encode(a2);
        if (!(a2 instanceof Uint8Array)) throw TypeError(`"${b2}"" must be an instance of Uint8Array or a string`);
        return a2;
      }
      async function f(a2, b2, c2, f2, g) {
        return d(function(a3) {
          switch (a3) {
            case "sha256":
            case "sha384":
            case "sha512":
            case "sha1":
              return a3;
            default:
              throw TypeError('unsupported "digest" value');
          }
        }(a2), function(a3) {
          let b3 = e(a3, "ikm");
          if (!b3.byteLength) throw TypeError('"ikm" must be at least one byte in length');
          return b3;
        }(b2), e(c2, "salt"), function(a3) {
          let b3 = e(a3, "info");
          if (b3.byteLength > 1024) throw TypeError('"info" must not contain more than 1024 bytes');
          return b3;
        }(f2), function(a3, b3) {
          if ("number" != typeof a3 || !Number.isInteger(a3) || a3 < 1) throw TypeError('"keylen" must be a positive integer');
          if (a3 > 255 * (parseInt(b3.substr(3), 10) >> 3 || 20)) throw TypeError('"keylen" too large');
          return a3;
        }(g, a2));
      }
    }, 3107: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true });
      let d = c(8566), e = c(4308);
      b.default = function(a2) {
        var b2;
        let c2 = (b2 = "string" == typeof a2 ? (0, d.default)(a2) : a2, Uint8Array.of((15 & b2[3]) << 4 | b2[4] >> 4 & 15, (15 & b2[4]) << 4 | (240 & b2[5]) >> 4, (15 & b2[5]) << 4 | 15 & b2[6], b2[7], (15 & b2[1]) << 4 | (240 & b2[2]) >> 4, (15 & b2[2]) << 4 | (240 & b2[3]) >> 4, 16 | (240 & b2[0]) >> 4, (15 & b2[0]) << 4 | (240 & b2[1]) >> 4, b2[8], b2[9], b2[10], b2[11], b2[12], b2[13], b2[14], b2[15]));
        return "string" == typeof a2 ? (0, e.unsafeStringify)(c2) : c2;
      };
    }, 3233: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true });
      var d = { interceptTestApis: function() {
        return h;
      }, wrapRequestHandler: function() {
        return i;
      } };
      for (var e in d) Object.defineProperty(b, e, { enumerable: true, get: d[e] });
      let f = c(2681), g = c(4120);
      function h() {
        return (0, g.interceptFetch)(c.g.fetch);
      }
      function i(a2) {
        return (b2, c2) => (0, f.withRequest)(b2, g.reader, () => a2(b2, c2));
      }
    }, 3781: (a, b, c) => {
      "use strict";
      c.r(b), c.d(b, { CompactEncrypt: () => bb, CompactSign: () => be, EmbeddedJWK: () => bn, EncryptJWT: () => bj, FlattenedEncrypt: () => aX, FlattenedSign: () => bd, GeneralEncrypt: () => aZ, GeneralSign: () => bg, SignJWT: () => bi, UnsecuredJWT: () => bw, base64url: () => e, calculateJwkThumbprint: () => bl, calculateJwkThumbprintUri: () => bm, compactDecrypt: () => aP, compactVerify: () => a2, createLocalJWKSet: () => bs, createRemoteJWKSet: () => bv, cryptoRuntime: () => bG, decodeJwt: () => bA, decodeProtectedHeader: () => bz, errors: () => d, exportJWK: () => aU, exportPKCS8: () => aT, exportSPKI: () => aS, flattenedDecrypt: () => aO, flattenedVerify: () => a1, generalDecrypt: () => aQ, generalVerify: () => a3, generateKeyPair: () => bE, generateSecret: () => bF, importJWK: () => aE, importPKCS8: () => aD, importSPKI: () => aB, importX509: () => aC, jwtDecrypt: () => ba, jwtVerify: () => a9 });
      var d = {};
      c.r(d), c.d(d, { JOSEAlgNotAllowed: () => w, JOSEError: () => t, JOSENotSupported: () => x, JWEDecompressionFailed: () => z, JWEDecryptionFailed: () => y, JWEInvalid: () => A, JWKInvalid: () => D, JWKSInvalid: () => E, JWKSMultipleMatchingKeys: () => G, JWKSNoMatchingKey: () => F, JWKSTimeout: () => H, JWSInvalid: () => B, JWSSignatureVerificationFailed: () => I, JWTClaimValidationFailed: () => u, JWTExpired: () => v, JWTInvalid: () => C });
      var e = {};
      c.r(e), c.d(e, { decode: () => by, encode: () => bx });
      let f = crypto, g = async (a10, b2) => {
        let c2 = `SHA-${a10.slice(-3)}`;
        return new Uint8Array(await f.subtle.digest(c2, b2));
      }, h = new TextEncoder(), i = new TextDecoder();
      function j(...a10) {
        let b2 = new Uint8Array(a10.reduce((a11, { length: b3 }) => a11 + b3, 0)), c2 = 0;
        return a10.forEach((a11) => {
          b2.set(a11, c2), c2 += a11.length;
        }), b2;
      }
      function k(a10, b2, c2) {
        if (b2 < 0 || b2 >= 4294967296) throw RangeError(`value must be >= 0 and <= ${4294967296 - 1}. Received ${b2}`);
        a10.set([b2 >>> 24, b2 >>> 16, b2 >>> 8, 255 & b2], c2);
      }
      function l(a10) {
        let b2 = Math.floor(a10 / 4294967296), c2 = new Uint8Array(8);
        return k(c2, b2, 0), k(c2, a10 % 4294967296, 4), c2;
      }
      function m(a10) {
        let b2 = new Uint8Array(4);
        return k(b2, a10), b2;
      }
      function n(a10) {
        return j(m(a10.length), a10);
      }
      async function o(a10, b2, c2) {
        let d2 = Math.ceil((b2 >> 3) / 32), e2 = new Uint8Array(32 * d2);
        for (let b3 = 0; b3 < d2; b3++) {
          let d3 = new Uint8Array(4 + a10.length + c2.length);
          d3.set(m(b3 + 1)), d3.set(a10, 4), d3.set(c2, 4 + a10.length), e2.set(await g("sha256", d3), 32 * b3);
        }
        return e2.slice(0, b2 >> 3);
      }
      let p = (a10) => {
        let b2 = a10;
        "string" == typeof b2 && (b2 = h.encode(b2));
        let c2 = [];
        for (let a11 = 0; a11 < b2.length; a11 += 32768) c2.push(String.fromCharCode.apply(null, b2.subarray(a11, a11 + 32768)));
        return btoa(c2.join(""));
      }, q = (a10) => p(a10).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_"), r = (a10) => {
        let b2 = atob(a10), c2 = new Uint8Array(b2.length);
        for (let a11 = 0; a11 < b2.length; a11++) c2[a11] = b2.charCodeAt(a11);
        return c2;
      }, s = (a10) => {
        let b2 = a10;
        b2 instanceof Uint8Array && (b2 = i.decode(b2)), b2 = b2.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
        try {
          return r(b2);
        } catch (a11) {
          throw TypeError("The input to be decoded is not correctly encoded.");
        }
      };
      class t extends Error {
        static get code() {
          return "ERR_JOSE_GENERIC";
        }
        constructor(a10) {
          var b2;
          super(a10), this.code = "ERR_JOSE_GENERIC", this.name = this.constructor.name, null == (b2 = Error.captureStackTrace) || b2.call(Error, this, this.constructor);
        }
      }
      class u extends t {
        static get code() {
          return "ERR_JWT_CLAIM_VALIDATION_FAILED";
        }
        constructor(a10, b2 = "unspecified", c2 = "unspecified") {
          super(a10), this.code = "ERR_JWT_CLAIM_VALIDATION_FAILED", this.claim = b2, this.reason = c2;
        }
      }
      class v extends t {
        static get code() {
          return "ERR_JWT_EXPIRED";
        }
        constructor(a10, b2 = "unspecified", c2 = "unspecified") {
          super(a10), this.code = "ERR_JWT_EXPIRED", this.claim = b2, this.reason = c2;
        }
      }
      class w extends t {
        constructor() {
          super(...arguments), this.code = "ERR_JOSE_ALG_NOT_ALLOWED";
        }
        static get code() {
          return "ERR_JOSE_ALG_NOT_ALLOWED";
        }
      }
      class x extends t {
        constructor() {
          super(...arguments), this.code = "ERR_JOSE_NOT_SUPPORTED";
        }
        static get code() {
          return "ERR_JOSE_NOT_SUPPORTED";
        }
      }
      class y extends t {
        constructor() {
          super(...arguments), this.code = "ERR_JWE_DECRYPTION_FAILED", this.message = "decryption operation failed";
        }
        static get code() {
          return "ERR_JWE_DECRYPTION_FAILED";
        }
      }
      class z extends t {
        constructor() {
          super(...arguments), this.code = "ERR_JWE_DECOMPRESSION_FAILED", this.message = "decompression operation failed";
        }
        static get code() {
          return "ERR_JWE_DECOMPRESSION_FAILED";
        }
      }
      class A extends t {
        constructor() {
          super(...arguments), this.code = "ERR_JWE_INVALID";
        }
        static get code() {
          return "ERR_JWE_INVALID";
        }
      }
      class B extends t {
        constructor() {
          super(...arguments), this.code = "ERR_JWS_INVALID";
        }
        static get code() {
          return "ERR_JWS_INVALID";
        }
      }
      class C extends t {
        constructor() {
          super(...arguments), this.code = "ERR_JWT_INVALID";
        }
        static get code() {
          return "ERR_JWT_INVALID";
        }
      }
      class D extends t {
        constructor() {
          super(...arguments), this.code = "ERR_JWK_INVALID";
        }
        static get code() {
          return "ERR_JWK_INVALID";
        }
      }
      class E extends t {
        constructor() {
          super(...arguments), this.code = "ERR_JWKS_INVALID";
        }
        static get code() {
          return "ERR_JWKS_INVALID";
        }
      }
      class F extends t {
        constructor() {
          super(...arguments), this.code = "ERR_JWKS_NO_MATCHING_KEY", this.message = "no applicable key found in the JSON Web Key Set";
        }
        static get code() {
          return "ERR_JWKS_NO_MATCHING_KEY";
        }
      }
      class G extends t {
        constructor() {
          super(...arguments), this.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS", this.message = "multiple matching keys found in the JSON Web Key Set";
        }
        static get code() {
          return "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
        }
      }
      class H extends t {
        constructor() {
          super(...arguments), this.code = "ERR_JWKS_TIMEOUT", this.message = "request timed out";
        }
        static get code() {
          return "ERR_JWKS_TIMEOUT";
        }
      }
      class I extends t {
        constructor() {
          super(...arguments), this.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED", this.message = "signature verification failed";
        }
        static get code() {
          return "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
        }
      }
      let J = f.getRandomValues.bind(f);
      function K(a10) {
        switch (a10) {
          case "A128GCM":
          case "A128GCMKW":
          case "A192GCM":
          case "A192GCMKW":
          case "A256GCM":
          case "A256GCMKW":
            return 96;
          case "A128CBC-HS256":
          case "A192CBC-HS384":
          case "A256CBC-HS512":
            return 128;
          default:
            throw new x(`Unsupported JWE Algorithm: ${a10}`);
        }
      }
      let L = (a10) => J(new Uint8Array(K(a10) >> 3)), M = (a10, b2) => {
        if (b2.length << 3 !== K(a10)) throw new A("Invalid Initialization Vector length");
      }, N = (a10, b2) => {
        let c2 = a10.byteLength << 3;
        if (c2 !== b2) throw new A(`Invalid Content Encryption Key length. Expected ${b2} bits, got ${c2} bits`);
      };
      function O(a10, b2 = "algorithm.name") {
        return TypeError(`CryptoKey does not support this operation, its ${b2} must be ${a10}`);
      }
      function P(a10, b2) {
        return a10.name === b2;
      }
      function Q(a10) {
        return parseInt(a10.name.slice(4), 10);
      }
      function R(a10, b2) {
        if (b2.length && !b2.some((b3) => a10.usages.includes(b3))) {
          let a11 = "CryptoKey does not support this operation, its usages must include ";
          if (b2.length > 2) {
            let c2 = b2.pop();
            a11 += `one of ${b2.join(", ")}, or ${c2}.`;
          } else 2 === b2.length ? a11 += `one of ${b2[0]} or ${b2[1]}.` : a11 += `${b2[0]}.`;
          throw TypeError(a11);
        }
      }
      function S(a10, b2, ...c2) {
        switch (b2) {
          case "A128GCM":
          case "A192GCM":
          case "A256GCM": {
            if (!P(a10.algorithm, "AES-GCM")) throw O("AES-GCM");
            let c3 = parseInt(b2.slice(1, 4), 10);
            if (a10.algorithm.length !== c3) throw O(c3, "algorithm.length");
            break;
          }
          case "A128KW":
          case "A192KW":
          case "A256KW": {
            if (!P(a10.algorithm, "AES-KW")) throw O("AES-KW");
            let c3 = parseInt(b2.slice(1, 4), 10);
            if (a10.algorithm.length !== c3) throw O(c3, "algorithm.length");
            break;
          }
          case "ECDH":
            switch (a10.algorithm.name) {
              case "ECDH":
              case "X25519":
              case "X448":
                break;
              default:
                throw O("ECDH, X25519, or X448");
            }
            break;
          case "PBES2-HS256+A128KW":
          case "PBES2-HS384+A192KW":
          case "PBES2-HS512+A256KW":
            if (!P(a10.algorithm, "PBKDF2")) throw O("PBKDF2");
            break;
          case "RSA-OAEP":
          case "RSA-OAEP-256":
          case "RSA-OAEP-384":
          case "RSA-OAEP-512": {
            if (!P(a10.algorithm, "RSA-OAEP")) throw O("RSA-OAEP");
            let c3 = parseInt(b2.slice(9), 10) || 1;
            if (Q(a10.algorithm.hash) !== c3) throw O(`SHA-${c3}`, "algorithm.hash");
            break;
          }
          default:
            throw TypeError("CryptoKey does not support this operation");
        }
        R(a10, c2);
      }
      function T(a10, b2, ...c2) {
        if (c2.length > 2) {
          let b3 = c2.pop();
          a10 += `one of type ${c2.join(", ")}, or ${b3}.`;
        } else 2 === c2.length ? a10 += `one of type ${c2[0]} or ${c2[1]}.` : a10 += `of type ${c2[0]}.`;
        return null == b2 ? a10 += ` Received ${b2}` : "function" == typeof b2 && b2.name ? a10 += ` Received function ${b2.name}` : "object" == typeof b2 && null != b2 && b2.constructor && b2.constructor.name && (a10 += ` Received an instance of ${b2.constructor.name}`), a10;
      }
      let U = (a10, ...b2) => T("Key must be ", a10, ...b2);
      function V(a10, b2, ...c2) {
        return T(`Key for the ${a10} algorithm must be `, b2, ...c2);
      }
      let W = ["CryptoKey"];
      async function X(a10, b2, c2, d2, e2, g2) {
        let h2, i2;
        if (!(b2 instanceof Uint8Array)) throw TypeError(U(b2, "Uint8Array"));
        let k2 = parseInt(a10.slice(1, 4), 10), m2 = await f.subtle.importKey("raw", b2.subarray(k2 >> 3), "AES-CBC", false, ["decrypt"]), n2 = await f.subtle.importKey("raw", b2.subarray(0, k2 >> 3), { hash: `SHA-${k2 << 1}`, name: "HMAC" }, false, ["sign"]), o2 = j(g2, d2, c2, l(g2.length << 3)), p2 = new Uint8Array((await f.subtle.sign("HMAC", n2, o2)).slice(0, k2 >> 3));
        try {
          h2 = ((a11, b3) => {
            if (!(a11 instanceof Uint8Array)) throw TypeError("First argument must be a buffer");
            if (!(b3 instanceof Uint8Array)) throw TypeError("Second argument must be a buffer");
            if (a11.length !== b3.length) throw TypeError("Input buffers must have the same length");
            let c3 = a11.length, d3 = 0, e3 = -1;
            for (; ++e3 < c3; ) d3 |= a11[e3] ^ b3[e3];
            return 0 === d3;
          })(e2, p2);
        } catch (a11) {
        }
        if (!h2) throw new y();
        try {
          i2 = new Uint8Array(await f.subtle.decrypt({ iv: d2, name: "AES-CBC" }, m2, c2));
        } catch (a11) {
        }
        if (!i2) throw new y();
        return i2;
      }
      async function Y(a10, b2, c2, d2, e2, g2) {
        let h2;
        b2 instanceof Uint8Array ? h2 = await f.subtle.importKey("raw", b2, "AES-GCM", false, ["decrypt"]) : (S(b2, a10, "decrypt"), h2 = b2);
        try {
          return new Uint8Array(await f.subtle.decrypt({ additionalData: g2, iv: d2, name: "AES-GCM", tagLength: 128 }, h2, j(c2, e2)));
        } catch (a11) {
          throw new y();
        }
      }
      let Z = async (a10, b2, c2, d2, e2, f2) => {
        if (!(b2 instanceof CryptoKey) && !(b2 instanceof Uint8Array)) throw TypeError(U(b2, ...W, "Uint8Array"));
        switch (M(a10, d2), a10) {
          case "A128CBC-HS256":
          case "A192CBC-HS384":
          case "A256CBC-HS512":
            return b2 instanceof Uint8Array && N(b2, parseInt(a10.slice(-3), 10)), X(a10, b2, c2, d2, e2, f2);
          case "A128GCM":
          case "A192GCM":
          case "A256GCM":
            return b2 instanceof Uint8Array && N(b2, parseInt(a10.slice(1, 4), 10)), Y(a10, b2, c2, d2, e2, f2);
          default:
            throw new x("Unsupported JWE Content Encryption Algorithm");
        }
      }, $ = async () => {
        throw new x('JWE "zip" (Compression Algorithm) Header Parameter is not supported by your javascript runtime. You need to use the `inflateRaw` decrypt option to provide Inflate Raw implementation.');
      }, _ = async () => {
        throw new x('JWE "zip" (Compression Algorithm) Header Parameter is not supported by your javascript runtime. You need to use the `deflateRaw` encrypt option to provide Deflate Raw implementation.');
      }, aa = (...a10) => {
        let b2, c2 = a10.filter(Boolean);
        if (0 === c2.length || 1 === c2.length) return true;
        for (let a11 of c2) {
          let c3 = Object.keys(a11);
          if (!b2 || 0 === b2.size) {
            b2 = new Set(c3);
            continue;
          }
          for (let a12 of c3) {
            if (b2.has(a12)) return false;
            b2.add(a12);
          }
        }
        return true;
      };
      function ab(a10) {
        if ("object" != typeof a10 || null === a10 || "[object Object]" !== Object.prototype.toString.call(a10)) return false;
        if (null === Object.getPrototypeOf(a10)) return true;
        let b2 = a10;
        for (; null !== Object.getPrototypeOf(b2); ) b2 = Object.getPrototypeOf(b2);
        return Object.getPrototypeOf(a10) === b2;
      }
      let ac = [{ hash: "SHA-256", name: "HMAC" }, true, ["sign"]];
      function ad(a10, b2) {
        if (a10.algorithm.length !== parseInt(b2.slice(1, 4), 10)) throw TypeError(`Invalid key size for alg: ${b2}`);
      }
      function ae(a10, b2, c2) {
        if (a10 instanceof CryptoKey) return S(a10, b2, c2), a10;
        if (a10 instanceof Uint8Array) return f.subtle.importKey("raw", a10, "AES-KW", true, [c2]);
        throw TypeError(U(a10, ...W, "Uint8Array"));
      }
      let af = async (a10, b2, c2) => {
        let d2 = await ae(b2, a10, "wrapKey");
        ad(d2, a10);
        let e2 = await f.subtle.importKey("raw", c2, ...ac);
        return new Uint8Array(await f.subtle.wrapKey("raw", e2, d2, "AES-KW"));
      }, ag = async (a10, b2, c2) => {
        let d2 = await ae(b2, a10, "unwrapKey");
        ad(d2, a10);
        let e2 = await f.subtle.unwrapKey("raw", c2, d2, "AES-KW", ...ac);
        return new Uint8Array(await f.subtle.exportKey("raw", e2));
      };
      async function ah(a10, b2, c2, d2, e2 = new Uint8Array(0), g2 = new Uint8Array(0)) {
        let i2;
        if (!(a10 instanceof CryptoKey)) throw TypeError(U(a10, ...W));
        if (S(a10, "ECDH"), !(b2 instanceof CryptoKey)) throw TypeError(U(b2, ...W));
        S(b2, "ECDH", "deriveBits");
        let k2 = j(n(h.encode(c2)), n(e2), n(g2), m(d2));
        return i2 = "X25519" === a10.algorithm.name ? 256 : "X448" === a10.algorithm.name ? 448 : Math.ceil(parseInt(a10.algorithm.namedCurve.substr(-3), 10) / 8) << 3, o(new Uint8Array(await f.subtle.deriveBits({ name: a10.algorithm.name, public: a10 }, b2, i2)), d2, k2);
      }
      async function ai(a10) {
        if (!(a10 instanceof CryptoKey)) throw TypeError(U(a10, ...W));
        return f.subtle.generateKey(a10.algorithm, true, ["deriveBits"]);
      }
      function aj(a10) {
        if (!(a10 instanceof CryptoKey)) throw TypeError(U(a10, ...W));
        return ["P-256", "P-384", "P-521"].includes(a10.algorithm.namedCurve) || "X25519" === a10.algorithm.name || "X448" === a10.algorithm.name;
      }
      async function ak(a10, b2, c2, d2) {
        if (!(a10 instanceof Uint8Array) || a10.length < 8) throw new A("PBES2 Salt Input must be 8 or more octets");
        let e2 = j(h.encode(b2), new Uint8Array([0]), a10), g2 = parseInt(b2.slice(13, 16), 10), i2 = { hash: `SHA-${b2.slice(8, 11)}`, iterations: c2, name: "PBKDF2", salt: e2 }, k2 = await function(a11, b3) {
          if (a11 instanceof Uint8Array) return f.subtle.importKey("raw", a11, "PBKDF2", false, ["deriveBits"]);
          if (a11 instanceof CryptoKey) return S(a11, b3, "deriveBits", "deriveKey"), a11;
          throw TypeError(U(a11, ...W, "Uint8Array"));
        }(d2, b2);
        if (k2.usages.includes("deriveBits")) return new Uint8Array(await f.subtle.deriveBits(i2, k2, g2));
        if (k2.usages.includes("deriveKey")) return f.subtle.deriveKey(i2, k2, { length: g2, name: "AES-KW" }, false, ["wrapKey", "unwrapKey"]);
        throw TypeError('PBKDF2 key "usages" must include "deriveBits" or "deriveKey"');
      }
      let al = async (a10, b2, c2, d2 = 2048, e2 = J(new Uint8Array(16))) => {
        let f2 = await ak(e2, a10, d2, b2);
        return { encryptedKey: await af(a10.slice(-6), f2, c2), p2c: d2, p2s: q(e2) };
      }, am = async (a10, b2, c2, d2, e2) => {
        let f2 = await ak(e2, a10, d2, b2);
        return ag(a10.slice(-6), f2, c2);
      };
      function an(a10) {
        switch (a10) {
          case "RSA-OAEP":
          case "RSA-OAEP-256":
          case "RSA-OAEP-384":
          case "RSA-OAEP-512":
            return "RSA-OAEP";
          default:
            throw new x(`alg ${a10} is not supported either by JOSE or your javascript runtime`);
        }
      }
      let ao = (a10, b2) => {
        if (a10.startsWith("RS") || a10.startsWith("PS")) {
          let { modulusLength: c2 } = b2.algorithm;
          if ("number" != typeof c2 || c2 < 2048) throw TypeError(`${a10} requires key modulusLength to be 2048 bits or larger`);
        }
      }, ap = async (a10, b2, c2) => {
        if (!(b2 instanceof CryptoKey)) throw TypeError(U(b2, ...W));
        if (S(b2, a10, "encrypt", "wrapKey"), ao(a10, b2), b2.usages.includes("encrypt")) return new Uint8Array(await f.subtle.encrypt(an(a10), b2, c2));
        if (b2.usages.includes("wrapKey")) {
          let d2 = await f.subtle.importKey("raw", c2, ...ac);
          return new Uint8Array(await f.subtle.wrapKey("raw", d2, b2, an(a10)));
        }
        throw TypeError('RSA-OAEP key "usages" must include "encrypt" or "wrapKey" for this operation');
      }, aq = async (a10, b2, c2) => {
        if (!(b2 instanceof CryptoKey)) throw TypeError(U(b2, ...W));
        if (S(b2, a10, "decrypt", "unwrapKey"), ao(a10, b2), b2.usages.includes("decrypt")) return new Uint8Array(await f.subtle.decrypt(an(a10), b2, c2));
        if (b2.usages.includes("unwrapKey")) {
          let d2 = await f.subtle.unwrapKey("raw", c2, b2, an(a10), ...ac);
          return new Uint8Array(await f.subtle.exportKey("raw", d2));
        }
        throw TypeError('RSA-OAEP key "usages" must include "decrypt" or "unwrapKey" for this operation');
      };
      function ar(a10) {
        switch (a10) {
          case "A128GCM":
            return 128;
          case "A192GCM":
            return 192;
          case "A256GCM":
          case "A128CBC-HS256":
            return 256;
          case "A192CBC-HS384":
            return 384;
          case "A256CBC-HS512":
            return 512;
          default:
            throw new x(`Unsupported JWE Algorithm: ${a10}`);
        }
      }
      let as = (a10) => J(new Uint8Array(ar(a10) >> 3)), at = (a10, b2) => {
        let c2 = (a10.match(/.{1,64}/g) || []).join("\n");
        return `-----BEGIN ${b2}-----
${c2}
-----END ${b2}-----`;
      }, au = async (a10, b2, c2) => {
        if (!(c2 instanceof CryptoKey)) throw TypeError(U(c2, ...W));
        if (!c2.extractable) throw TypeError("CryptoKey is not extractable");
        if (c2.type !== a10) throw TypeError(`key is not a ${a10} key`);
        return at(p(new Uint8Array(await f.subtle.exportKey(b2, c2))), `${a10.toUpperCase()} KEY`);
      }, av = (a10, b2, c2 = 0) => {
        0 === c2 && (b2.unshift(b2.length), b2.unshift(6));
        let d2 = a10.indexOf(b2[0], c2);
        if (-1 === d2) return false;
        let e2 = a10.subarray(d2, d2 + b2.length);
        return e2.length === b2.length && (e2.every((a11, c3) => a11 === b2[c3]) || av(a10, b2, d2 + 1));
      }, aw = (a10) => {
        switch (true) {
          case av(a10, [42, 134, 72, 206, 61, 3, 1, 7]):
            return "P-256";
          case av(a10, [43, 129, 4, 0, 34]):
            return "P-384";
          case av(a10, [43, 129, 4, 0, 35]):
            return "P-521";
          case av(a10, [43, 101, 110]):
            return "X25519";
          case av(a10, [43, 101, 111]):
            return "X448";
          case av(a10, [43, 101, 112]):
            return "Ed25519";
          case av(a10, [43, 101, 113]):
            return "Ed448";
          default:
            throw new x("Invalid or unsupported EC Key Curve or OKP Key Sub Type");
        }
      }, ax = async (a10, b2, c2, d2, e2) => {
        var g2;
        let h2, i2, j2 = new Uint8Array(atob(c2.replace(a10, "")).split("").map((a11) => a11.charCodeAt(0))), k2 = "spki" === b2;
        switch (d2) {
          case "PS256":
          case "PS384":
          case "PS512":
            h2 = { name: "RSA-PSS", hash: `SHA-${d2.slice(-3)}` }, i2 = k2 ? ["verify"] : ["sign"];
            break;
          case "RS256":
          case "RS384":
          case "RS512":
            h2 = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${d2.slice(-3)}` }, i2 = k2 ? ["verify"] : ["sign"];
            break;
          case "RSA-OAEP":
          case "RSA-OAEP-256":
          case "RSA-OAEP-384":
          case "RSA-OAEP-512":
            h2 = { name: "RSA-OAEP", hash: `SHA-${parseInt(d2.slice(-3), 10) || 1}` }, i2 = k2 ? ["encrypt", "wrapKey"] : ["decrypt", "unwrapKey"];
            break;
          case "ES256":
            h2 = { name: "ECDSA", namedCurve: "P-256" }, i2 = k2 ? ["verify"] : ["sign"];
            break;
          case "ES384":
            h2 = { name: "ECDSA", namedCurve: "P-384" }, i2 = k2 ? ["verify"] : ["sign"];
            break;
          case "ES512":
            h2 = { name: "ECDSA", namedCurve: "P-521" }, i2 = k2 ? ["verify"] : ["sign"];
            break;
          case "ECDH-ES":
          case "ECDH-ES+A128KW":
          case "ECDH-ES+A192KW":
          case "ECDH-ES+A256KW": {
            let a11 = aw(j2);
            h2 = a11.startsWith("P-") ? { name: "ECDH", namedCurve: a11 } : { name: a11 }, i2 = k2 ? [] : ["deriveBits"];
            break;
          }
          case "EdDSA":
            h2 = { name: aw(j2) }, i2 = k2 ? ["verify"] : ["sign"];
            break;
          default:
            throw new x('Invalid or unsupported "alg" (Algorithm) value');
        }
        return f.subtle.importKey(b2, j2, h2, null != (g2 = null == e2 ? void 0 : e2.extractable) && g2, i2);
      };
      function ay(a10) {
        let b2 = [], c2 = 0;
        for (; c2 < a10.length; ) {
          let d2 = az(a10.subarray(c2));
          b2.push(d2), c2 += d2.byteLength;
        }
        return b2;
      }
      function az(a10) {
        let b2 = 0, c2 = 31 & a10[0];
        if (b2++, 31 === c2) {
          for (c2 = 0; a10[b2] >= 128; ) c2 = 128 * c2 + a10[b2] - 128, b2++;
          c2 = 128 * c2 + a10[b2] - 128, b2++;
        }
        let d2 = 0;
        if (a10[b2] < 128) d2 = a10[b2], b2++;
        else if (128 === d2) {
          for (d2 = 0; 0 !== a10[b2 + d2] || 0 !== a10[b2 + d2 + 1]; ) {
            if (d2 > a10.byteLength) throw TypeError("invalid indefinite form length");
            d2++;
          }
          let c3 = b2 + d2 + 2;
          return { byteLength: c3, contents: a10.subarray(b2, b2 + d2), raw: a10.subarray(0, c3) };
        } else {
          let c3 = 127 & a10[b2];
          b2++, d2 = 0;
          for (let e3 = 0; e3 < c3; e3++) d2 = 256 * d2 + a10[b2], b2++;
        }
        let e2 = b2 + d2;
        return { byteLength: e2, contents: a10.subarray(b2, e2), raw: a10.subarray(0, e2) };
      }
      let aA = async (a10) => {
        var b2, c2;
        if (!a10.alg) throw TypeError('"alg" argument is required when "jwk.alg" is not present');
        let { algorithm: d2, keyUsages: e2 } = function(a11) {
          let b3, c3;
          switch (a11.kty) {
            case "oct":
              switch (a11.alg) {
                case "HS256":
                case "HS384":
                case "HS512":
                  b3 = { name: "HMAC", hash: `SHA-${a11.alg.slice(-3)}` }, c3 = ["sign", "verify"];
                  break;
                case "A128CBC-HS256":
                case "A192CBC-HS384":
                case "A256CBC-HS512":
                  throw new x(`${a11.alg} keys cannot be imported as CryptoKey instances`);
                case "A128GCM":
                case "A192GCM":
                case "A256GCM":
                case "A128GCMKW":
                case "A192GCMKW":
                case "A256GCMKW":
                  b3 = { name: "AES-GCM" }, c3 = ["encrypt", "decrypt"];
                  break;
                case "A128KW":
                case "A192KW":
                case "A256KW":
                  b3 = { name: "AES-KW" }, c3 = ["wrapKey", "unwrapKey"];
                  break;
                case "PBES2-HS256+A128KW":
                case "PBES2-HS384+A192KW":
                case "PBES2-HS512+A256KW":
                  b3 = { name: "PBKDF2" }, c3 = ["deriveBits"];
                  break;
                default:
                  throw new x('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
              }
              break;
            case "RSA":
              switch (a11.alg) {
                case "PS256":
                case "PS384":
                case "PS512":
                  b3 = { name: "RSA-PSS", hash: `SHA-${a11.alg.slice(-3)}` }, c3 = a11.d ? ["sign"] : ["verify"];
                  break;
                case "RS256":
                case "RS384":
                case "RS512":
                  b3 = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${a11.alg.slice(-3)}` }, c3 = a11.d ? ["sign"] : ["verify"];
                  break;
                case "RSA-OAEP":
                case "RSA-OAEP-256":
                case "RSA-OAEP-384":
                case "RSA-OAEP-512":
                  b3 = { name: "RSA-OAEP", hash: `SHA-${parseInt(a11.alg.slice(-3), 10) || 1}` }, c3 = a11.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
                  break;
                default:
                  throw new x('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
              }
              break;
            case "EC":
              switch (a11.alg) {
                case "ES256":
                  b3 = { name: "ECDSA", namedCurve: "P-256" }, c3 = a11.d ? ["sign"] : ["verify"];
                  break;
                case "ES384":
                  b3 = { name: "ECDSA", namedCurve: "P-384" }, c3 = a11.d ? ["sign"] : ["verify"];
                  break;
                case "ES512":
                  b3 = { name: "ECDSA", namedCurve: "P-521" }, c3 = a11.d ? ["sign"] : ["verify"];
                  break;
                case "ECDH-ES":
                case "ECDH-ES+A128KW":
                case "ECDH-ES+A192KW":
                case "ECDH-ES+A256KW":
                  b3 = { name: "ECDH", namedCurve: a11.crv }, c3 = a11.d ? ["deriveBits"] : [];
                  break;
                default:
                  throw new x('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
              }
              break;
            case "OKP":
              switch (a11.alg) {
                case "EdDSA":
                  b3 = { name: a11.crv }, c3 = a11.d ? ["sign"] : ["verify"];
                  break;
                case "ECDH-ES":
                case "ECDH-ES+A128KW":
                case "ECDH-ES+A192KW":
                case "ECDH-ES+A256KW":
                  b3 = { name: a11.crv }, c3 = a11.d ? ["deriveBits"] : [];
                  break;
                default:
                  throw new x('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
              }
              break;
            default:
              throw new x('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
          }
          return { algorithm: b3, keyUsages: c3 };
        }(a10), g2 = [d2, null != (b2 = a10.ext) && b2, null != (c2 = a10.key_ops) ? c2 : e2];
        if ("PBKDF2" === d2.name) return f.subtle.importKey("raw", s(a10.k), ...g2);
        let h2 = { ...a10 };
        return delete h2.alg, delete h2.use, f.subtle.importKey("jwk", h2, ...g2);
      };
      async function aB(a10, b2, c2) {
        if ("string" != typeof a10 || 0 !== a10.indexOf("-----BEGIN PUBLIC KEY-----")) throw TypeError('"spki" must be SPKI formatted string');
        return ax(/(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g, "spki", a10, b2, c2);
      }
      async function aC(a10, b2, c2) {
        let d2;
        if ("string" != typeof a10 || 0 !== a10.indexOf("-----BEGIN CERTIFICATE-----")) throw TypeError('"x509" must be X.509 formatted string');
        try {
          var e2;
          let b3;
          e2 = a10, d2 = at((b3 = ay(ay(az(r(e2.replace(/(?:-----(?:BEGIN|END) CERTIFICATE-----|\s)/g, ""))).contents)[0].contents), p(b3[160 === b3[0].raw[0] ? 6 : 5].raw)), "PUBLIC KEY");
        } catch (a11) {
          throw TypeError("Failed to parse the X.509 certificate", { cause: a11 });
        }
        return ax(/(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g, "spki", d2, b2, c2);
      }
      async function aD(a10, b2, c2) {
        if ("string" != typeof a10 || 0 !== a10.indexOf("-----BEGIN PRIVATE KEY-----")) throw TypeError('"pkcs8" must be PKCS#8 formatted string');
        return ax(/(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g, "pkcs8", a10, b2, c2);
      }
      async function aE(a10, b2, c2) {
        var d2;
        if (!ab(a10)) throw TypeError("JWK must be an object");
        switch (b2 || (b2 = a10.alg), a10.kty) {
          case "oct":
            if ("string" != typeof a10.k || !a10.k) throw TypeError('missing "k" (Key Value) Parameter value');
            if (null != c2 || (c2 = true !== a10.ext), c2) return aA({ ...a10, alg: b2, ext: null != (d2 = a10.ext) && d2 });
            return s(a10.k);
          case "RSA":
            if (void 0 !== a10.oth) throw new x('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
          case "EC":
          case "OKP":
            return aA({ ...a10, alg: b2 });
          default:
            throw new x('Unsupported "kty" (Key Type) Parameter value');
        }
      }
      let aF = (a10, b2, c2) => {
        if (a10.startsWith("HS") || "dir" === a10 || a10.startsWith("PBES2") || /^A\d{3}(?:GCM)?KW$/.test(a10)) {
          if (!(b2 instanceof Uint8Array)) {
            if (!(b2 instanceof CryptoKey)) throw TypeError(V(a10, b2, ...W, "Uint8Array"));
            if ("secret" !== b2.type) throw TypeError(`${W.join(" or ")} instances for symmetric algorithms must be of type "secret"`);
          }
        } else {
          if (!(b2 instanceof CryptoKey)) throw TypeError(V(a10, b2, ...W));
          if ("secret" === b2.type) throw TypeError(`${W.join(" or ")} instances for asymmetric algorithms must not be of type "secret"`);
          if ("sign" === c2 && "public" === b2.type) throw TypeError(`${W.join(" or ")} instances for asymmetric algorithm signing must be of type "private"`);
          if ("decrypt" === c2 && "public" === b2.type) throw TypeError(`${W.join(" or ")} instances for asymmetric algorithm decryption must be of type "private"`);
          if (b2.algorithm && "verify" === c2 && "private" === b2.type) throw TypeError(`${W.join(" or ")} instances for asymmetric algorithm verifying must be of type "public"`);
          if (b2.algorithm && "encrypt" === c2 && "private" === b2.type) throw TypeError(`${W.join(" or ")} instances for asymmetric algorithm encryption must be of type "public"`);
        }
      };
      async function aG(a10, b2, c2, d2, e2) {
        if (!(c2 instanceof Uint8Array)) throw TypeError(U(c2, "Uint8Array"));
        let g2 = parseInt(a10.slice(1, 4), 10), h2 = await f.subtle.importKey("raw", c2.subarray(g2 >> 3), "AES-CBC", false, ["encrypt"]), i2 = await f.subtle.importKey("raw", c2.subarray(0, g2 >> 3), { hash: `SHA-${g2 << 1}`, name: "HMAC" }, false, ["sign"]), k2 = new Uint8Array(await f.subtle.encrypt({ iv: d2, name: "AES-CBC" }, h2, b2)), m2 = j(e2, d2, k2, l(e2.length << 3));
        return { ciphertext: k2, tag: new Uint8Array((await f.subtle.sign("HMAC", i2, m2)).slice(0, g2 >> 3)) };
      }
      async function aH(a10, b2, c2, d2, e2) {
        let g2;
        c2 instanceof Uint8Array ? g2 = await f.subtle.importKey("raw", c2, "AES-GCM", false, ["encrypt"]) : (S(c2, a10, "encrypt"), g2 = c2);
        let h2 = new Uint8Array(await f.subtle.encrypt({ additionalData: e2, iv: d2, name: "AES-GCM", tagLength: 128 }, g2, b2)), i2 = h2.slice(-16);
        return { ciphertext: h2.slice(0, -16), tag: i2 };
      }
      let aI = async (a10, b2, c2, d2, e2) => {
        if (!(c2 instanceof CryptoKey) && !(c2 instanceof Uint8Array)) throw TypeError(U(c2, ...W, "Uint8Array"));
        switch (M(a10, d2), a10) {
          case "A128CBC-HS256":
          case "A192CBC-HS384":
          case "A256CBC-HS512":
            return c2 instanceof Uint8Array && N(c2, parseInt(a10.slice(-3), 10)), aG(a10, b2, c2, d2, e2);
          case "A128GCM":
          case "A192GCM":
          case "A256GCM":
            return c2 instanceof Uint8Array && N(c2, parseInt(a10.slice(1, 4), 10)), aH(a10, b2, c2, d2, e2);
          default:
            throw new x("Unsupported JWE Content Encryption Algorithm");
        }
      };
      async function aJ(a10, b2, c2, d2) {
        let e2 = a10.slice(0, 7);
        d2 || (d2 = L(e2));
        let { ciphertext: f2, tag: g2 } = await aI(e2, c2, b2, d2, new Uint8Array(0));
        return { encryptedKey: f2, iv: q(d2), tag: q(g2) };
      }
      async function aK(a10, b2, c2, d2, e2) {
        return Z(a10.slice(0, 7), b2, c2, d2, e2, new Uint8Array(0));
      }
      async function aL(a10, b2, c2, d2, e2) {
        switch (aF(a10, b2, "decrypt"), a10) {
          case "dir":
            if (void 0 !== c2) throw new A("Encountered unexpected JWE Encrypted Key");
            return b2;
          case "ECDH-ES":
            if (void 0 !== c2) throw new A("Encountered unexpected JWE Encrypted Key");
          case "ECDH-ES+A128KW":
          case "ECDH-ES+A192KW":
          case "ECDH-ES+A256KW": {
            let e3, f2;
            if (!ab(d2.epk)) throw new A('JOSE Header "epk" (Ephemeral Public Key) missing or invalid');
            if (!aj(b2)) throw new x("ECDH with the provided key is not allowed or not supported by your javascript runtime");
            let g2 = await aE(d2.epk, a10);
            if (void 0 !== d2.apu) {
              if ("string" != typeof d2.apu) throw new A('JOSE Header "apu" (Agreement PartyUInfo) invalid');
              try {
                e3 = s(d2.apu);
              } catch (a11) {
                throw new A("Failed to base64url decode the apu");
              }
            }
            if (void 0 !== d2.apv) {
              if ("string" != typeof d2.apv) throw new A('JOSE Header "apv" (Agreement PartyVInfo) invalid');
              try {
                f2 = s(d2.apv);
              } catch (a11) {
                throw new A("Failed to base64url decode the apv");
              }
            }
            let h2 = await ah(g2, b2, "ECDH-ES" === a10 ? d2.enc : a10, "ECDH-ES" === a10 ? ar(d2.enc) : parseInt(a10.slice(-5, -2), 10), e3, f2);
            if ("ECDH-ES" === a10) return h2;
            if (void 0 === c2) throw new A("JWE Encrypted Key missing");
            return ag(a10.slice(-6), h2, c2);
          }
          case "RSA1_5":
          case "RSA-OAEP":
          case "RSA-OAEP-256":
          case "RSA-OAEP-384":
          case "RSA-OAEP-512":
            if (void 0 === c2) throw new A("JWE Encrypted Key missing");
            return aq(a10, b2, c2);
          case "PBES2-HS256+A128KW":
          case "PBES2-HS384+A192KW":
          case "PBES2-HS512+A256KW": {
            let f2;
            if (void 0 === c2) throw new A("JWE Encrypted Key missing");
            if ("number" != typeof d2.p2c) throw new A('JOSE Header "p2c" (PBES2 Count) missing or invalid');
            let g2 = (null == e2 ? void 0 : e2.maxPBES2Count) || 1e4;
            if (d2.p2c > g2) throw new A('JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds');
            if ("string" != typeof d2.p2s) throw new A('JOSE Header "p2s" (PBES2 Salt) missing or invalid');
            try {
              f2 = s(d2.p2s);
            } catch (a11) {
              throw new A("Failed to base64url decode the p2s");
            }
            return am(a10, b2, c2, d2.p2c, f2);
          }
          case "A128KW":
          case "A192KW":
          case "A256KW":
            if (void 0 === c2) throw new A("JWE Encrypted Key missing");
            return ag(a10, b2, c2);
          case "A128GCMKW":
          case "A192GCMKW":
          case "A256GCMKW": {
            let e3, f2;
            if (void 0 === c2) throw new A("JWE Encrypted Key missing");
            if ("string" != typeof d2.iv) throw new A('JOSE Header "iv" (Initialization Vector) missing or invalid');
            if ("string" != typeof d2.tag) throw new A('JOSE Header "tag" (Authentication Tag) missing or invalid');
            try {
              e3 = s(d2.iv);
            } catch (a11) {
              throw new A("Failed to base64url decode the iv");
            }
            try {
              f2 = s(d2.tag);
            } catch (a11) {
              throw new A("Failed to base64url decode the tag");
            }
            return aK(a10, b2, c2, e3, f2);
          }
          default:
            throw new x('Invalid or unsupported "alg" (JWE Algorithm) header value');
        }
      }
      let aM = function(a10, b2, c2, d2, e2) {
        let f2;
        if (void 0 !== e2.crit && void 0 === d2.crit) throw new a10('"crit" (Critical) Header Parameter MUST be integrity protected');
        if (!d2 || void 0 === d2.crit) return /* @__PURE__ */ new Set();
        if (!Array.isArray(d2.crit) || 0 === d2.crit.length || d2.crit.some((a11) => "string" != typeof a11 || 0 === a11.length)) throw new a10('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
        for (let g2 of (f2 = void 0 !== c2 ? new Map([...Object.entries(c2), ...b2.entries()]) : b2, d2.crit)) {
          if (!f2.has(g2)) throw new x(`Extension Header Parameter "${g2}" is not recognized`);
          if (void 0 === e2[g2]) throw new a10(`Extension Header Parameter "${g2}" is missing`);
          if (f2.get(g2) && void 0 === d2[g2]) throw new a10(`Extension Header Parameter "${g2}" MUST be integrity protected`);
        }
        return new Set(d2.crit);
      }, aN = (a10, b2) => {
        if (void 0 !== b2 && (!Array.isArray(b2) || b2.some((a11) => "string" != typeof a11))) throw TypeError(`"${a10}" option must be an array of strings`);
        if (b2) return new Set(b2);
      };
      async function aO(a10, b2, c2) {
        var d2;
        let e2, f2, g2, k2, l2, m2, n2;
        if (!ab(a10)) throw new A("Flattened JWE must be an object");
        if (void 0 === a10.protected && void 0 === a10.header && void 0 === a10.unprotected) throw new A("JOSE Header missing");
        if ("string" != typeof a10.iv) throw new A("JWE Initialization Vector missing or incorrect type");
        if ("string" != typeof a10.ciphertext) throw new A("JWE Ciphertext missing or incorrect type");
        if ("string" != typeof a10.tag) throw new A("JWE Authentication Tag missing or incorrect type");
        if (void 0 !== a10.protected && "string" != typeof a10.protected) throw new A("JWE Protected Header incorrect type");
        if (void 0 !== a10.encrypted_key && "string" != typeof a10.encrypted_key) throw new A("JWE Encrypted Key incorrect type");
        if (void 0 !== a10.aad && "string" != typeof a10.aad) throw new A("JWE AAD incorrect type");
        if (void 0 !== a10.header && !ab(a10.header)) throw new A("JWE Shared Unprotected Header incorrect type");
        if (void 0 !== a10.unprotected && !ab(a10.unprotected)) throw new A("JWE Per-Recipient Unprotected Header incorrect type");
        if (a10.protected) try {
          let b3 = s(a10.protected);
          e2 = JSON.parse(i.decode(b3));
        } catch (a11) {
          throw new A("JWE Protected Header is invalid");
        }
        if (!aa(e2, a10.header, a10.unprotected)) throw new A("JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint");
        let o2 = { ...e2, ...a10.header, ...a10.unprotected };
        if (aM(A, /* @__PURE__ */ new Map(), null == c2 ? void 0 : c2.crit, e2, o2), void 0 !== o2.zip) {
          if (!e2 || !e2.zip) throw new A('JWE "zip" (Compression Algorithm) Header MUST be integrity protected');
          if ("DEF" !== o2.zip) throw new x('Unsupported JWE "zip" (Compression Algorithm) Header Parameter value');
        }
        let { alg: p2, enc: q2 } = o2;
        if ("string" != typeof p2 || !p2) throw new A("missing JWE Algorithm (alg) in JWE Header");
        if ("string" != typeof q2 || !q2) throw new A("missing JWE Encryption Algorithm (enc) in JWE Header");
        let r2 = c2 && aN("keyManagementAlgorithms", c2.keyManagementAlgorithms), t2 = c2 && aN("contentEncryptionAlgorithms", c2.contentEncryptionAlgorithms);
        if (r2 && !r2.has(p2)) throw new w('"alg" (Algorithm) Header Parameter not allowed');
        if (t2 && !t2.has(q2)) throw new w('"enc" (Encryption Algorithm) Header Parameter not allowed');
        if (void 0 !== a10.encrypted_key) try {
          f2 = s(a10.encrypted_key);
        } catch (a11) {
          throw new A("Failed to base64url decode the encrypted_key");
        }
        let u2 = false;
        "function" == typeof b2 && (b2 = await b2(e2, a10), u2 = true);
        try {
          g2 = await aL(p2, b2, f2, o2, c2);
        } catch (a11) {
          if (a11 instanceof TypeError || a11 instanceof A || a11 instanceof x) throw a11;
          g2 = as(q2);
        }
        try {
          k2 = s(a10.iv);
        } catch (a11) {
          throw new A("Failed to base64url decode the iv");
        }
        try {
          l2 = s(a10.tag);
        } catch (a11) {
          throw new A("Failed to base64url decode the tag");
        }
        let v2 = h.encode(null != (d2 = a10.protected) ? d2 : "");
        m2 = void 0 !== a10.aad ? j(v2, h.encode("."), h.encode(a10.aad)) : v2;
        try {
          n2 = s(a10.ciphertext);
        } catch (a11) {
          throw new A("Failed to base64url decode the ciphertext");
        }
        let y2 = await Z(q2, g2, n2, k2, l2, m2);
        "DEF" === o2.zip && (y2 = await ((null == c2 ? void 0 : c2.inflateRaw) || $)(y2));
        let z2 = { plaintext: y2 };
        if (void 0 !== a10.protected && (z2.protectedHeader = e2), void 0 !== a10.aad) try {
          z2.additionalAuthenticatedData = s(a10.aad);
        } catch (a11) {
          throw new A("Failed to base64url decode the aad");
        }
        return (void 0 !== a10.unprotected && (z2.sharedUnprotectedHeader = a10.unprotected), void 0 !== a10.header && (z2.unprotectedHeader = a10.header), u2) ? { ...z2, key: b2 } : z2;
      }
      async function aP(a10, b2, c2) {
        if (a10 instanceof Uint8Array && (a10 = i.decode(a10)), "string" != typeof a10) throw new A("Compact JWE must be a string or Uint8Array");
        let { 0: d2, 1: e2, 2: f2, 3: g2, 4: h2, length: j2 } = a10.split(".");
        if (5 !== j2) throw new A("Invalid Compact JWE");
        let k2 = await aO({ ciphertext: g2, iv: f2 || void 0, protected: d2 || void 0, tag: h2 || void 0, encrypted_key: e2 || void 0 }, b2, c2), l2 = { plaintext: k2.plaintext, protectedHeader: k2.protectedHeader };
        return "function" == typeof b2 ? { ...l2, key: k2.key } : l2;
      }
      async function aQ(a10, b2, c2) {
        if (!ab(a10)) throw new A("General JWE must be an object");
        if (!Array.isArray(a10.recipients) || !a10.recipients.every(ab)) throw new A("JWE Recipients missing or incorrect type");
        if (!a10.recipients.length) throw new A("JWE Recipients has no members");
        for (let d2 of a10.recipients) try {
          return await aO({ aad: a10.aad, ciphertext: a10.ciphertext, encrypted_key: d2.encrypted_key, header: d2.header, iv: a10.iv, protected: a10.protected, tag: a10.tag, unprotected: a10.unprotected }, b2, c2);
        } catch (a11) {
        }
        throw new y();
      }
      let aR = async (a10) => {
        if (a10 instanceof Uint8Array) return { kty: "oct", k: q(a10) };
        if (!(a10 instanceof CryptoKey)) throw TypeError(U(a10, ...W, "Uint8Array"));
        if (!a10.extractable) throw TypeError("non-extractable CryptoKey cannot be exported as a JWK");
        let { ext: b2, key_ops: c2, alg: d2, use: e2, ...g2 } = await f.subtle.exportKey("jwk", a10);
        return g2;
      };
      async function aS(a10) {
        return au("public", "spki", a10);
      }
      async function aT(a10) {
        return au("private", "pkcs8", a10);
      }
      async function aU(a10) {
        return aR(a10);
      }
      async function aV(a10, b2, c2, d2, e2 = {}) {
        let f2, g2, h2;
        switch (aF(a10, c2, "encrypt"), a10) {
          case "dir":
            h2 = c2;
            break;
          case "ECDH-ES":
          case "ECDH-ES+A128KW":
          case "ECDH-ES+A192KW":
          case "ECDH-ES+A256KW": {
            if (!aj(c2)) throw new x("ECDH with the provided key is not allowed or not supported by your javascript runtime");
            let { apu: i2, apv: j2 } = e2, { epk: k2 } = e2;
            k2 || (k2 = (await ai(c2)).privateKey);
            let { x: l2, y: m2, crv: n2, kty: o2 } = await aU(k2), p2 = await ah(c2, k2, "ECDH-ES" === a10 ? b2 : a10, "ECDH-ES" === a10 ? ar(b2) : parseInt(a10.slice(-5, -2), 10), i2, j2);
            if (g2 = { epk: { x: l2, crv: n2, kty: o2 } }, "EC" === o2 && (g2.epk.y = m2), i2 && (g2.apu = q(i2)), j2 && (g2.apv = q(j2)), "ECDH-ES" === a10) {
              h2 = p2;
              break;
            }
            h2 = d2 || as(b2);
            let r2 = a10.slice(-6);
            f2 = await af(r2, p2, h2);
            break;
          }
          case "RSA1_5":
          case "RSA-OAEP":
          case "RSA-OAEP-256":
          case "RSA-OAEP-384":
          case "RSA-OAEP-512":
            h2 = d2 || as(b2), f2 = await ap(a10, c2, h2);
            break;
          case "PBES2-HS256+A128KW":
          case "PBES2-HS384+A192KW":
          case "PBES2-HS512+A256KW": {
            h2 = d2 || as(b2);
            let { p2c: i2, p2s: j2 } = e2;
            ({ encryptedKey: f2, ...g2 } = await al(a10, c2, h2, i2, j2));
            break;
          }
          case "A128KW":
          case "A192KW":
          case "A256KW":
            h2 = d2 || as(b2), f2 = await af(a10, c2, h2);
            break;
          case "A128GCMKW":
          case "A192GCMKW":
          case "A256GCMKW": {
            h2 = d2 || as(b2);
            let { iv: i2 } = e2;
            ({ encryptedKey: f2, ...g2 } = await aJ(a10, c2, h2, i2));
            break;
          }
          default:
            throw new x('Invalid or unsupported "alg" (JWE Algorithm) header value');
        }
        return { cek: h2, encryptedKey: f2, parameters: g2 };
      }
      let aW = Symbol();
      class aX {
        constructor(a10) {
          if (!(a10 instanceof Uint8Array)) throw TypeError("plaintext must be an instance of Uint8Array");
          this._plaintext = a10;
        }
        setKeyManagementParameters(a10) {
          if (this._keyManagementParameters) throw TypeError("setKeyManagementParameters can only be called once");
          return this._keyManagementParameters = a10, this;
        }
        setProtectedHeader(a10) {
          if (this._protectedHeader) throw TypeError("setProtectedHeader can only be called once");
          return this._protectedHeader = a10, this;
        }
        setSharedUnprotectedHeader(a10) {
          if (this._sharedUnprotectedHeader) throw TypeError("setSharedUnprotectedHeader can only be called once");
          return this._sharedUnprotectedHeader = a10, this;
        }
        setUnprotectedHeader(a10) {
          if (this._unprotectedHeader) throw TypeError("setUnprotectedHeader can only be called once");
          return this._unprotectedHeader = a10, this;
        }
        setAdditionalAuthenticatedData(a10) {
          return this._aad = a10, this;
        }
        setContentEncryptionKey(a10) {
          if (this._cek) throw TypeError("setContentEncryptionKey can only be called once");
          return this._cek = a10, this;
        }
        setInitializationVector(a10) {
          if (this._iv) throw TypeError("setInitializationVector can only be called once");
          return this._iv = a10, this;
        }
        async encrypt(a10, b2) {
          let c2, d2, e2, f2, g2, k2, l2;
          if (!this._protectedHeader && !this._unprotectedHeader && !this._sharedUnprotectedHeader) throw new A("either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()");
          if (!aa(this._protectedHeader, this._unprotectedHeader, this._sharedUnprotectedHeader)) throw new A("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
          let m2 = { ...this._protectedHeader, ...this._unprotectedHeader, ...this._sharedUnprotectedHeader };
          if (aM(A, /* @__PURE__ */ new Map(), null == b2 ? void 0 : b2.crit, this._protectedHeader, m2), void 0 !== m2.zip) {
            if (!this._protectedHeader || !this._protectedHeader.zip) throw new A('JWE "zip" (Compression Algorithm) Header MUST be integrity protected');
            if ("DEF" !== m2.zip) throw new x('Unsupported JWE "zip" (Compression Algorithm) Header Parameter value');
          }
          let { alg: n2, enc: o2 } = m2;
          if ("string" != typeof n2 || !n2) throw new A('JWE "alg" (Algorithm) Header Parameter missing or invalid');
          if ("string" != typeof o2 || !o2) throw new A('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
          if ("dir" === n2) {
            if (this._cek) throw TypeError("setContentEncryptionKey cannot be called when using Direct Encryption");
          } else if ("ECDH-ES" === n2 && this._cek) throw TypeError("setContentEncryptionKey cannot be called when using Direct Key Agreement");
          {
            let e3;
            ({ cek: d2, encryptedKey: c2, parameters: e3 } = await aV(n2, o2, a10, this._cek, this._keyManagementParameters)), e3 && (b2 && aW in b2 ? this._unprotectedHeader ? this._unprotectedHeader = { ...this._unprotectedHeader, ...e3 } : this.setUnprotectedHeader(e3) : this._protectedHeader ? this._protectedHeader = { ...this._protectedHeader, ...e3 } : this.setProtectedHeader(e3));
          }
          if (this._iv || (this._iv = L(o2)), f2 = this._protectedHeader ? h.encode(q(JSON.stringify(this._protectedHeader))) : h.encode(""), this._aad ? (g2 = q(this._aad), e2 = j(f2, h.encode("."), h.encode(g2))) : e2 = f2, "DEF" === m2.zip) {
            let a11 = await ((null == b2 ? void 0 : b2.deflateRaw) || _)(this._plaintext);
            ({ ciphertext: k2, tag: l2 } = await aI(o2, a11, d2, this._iv, e2));
          } else ({ ciphertext: k2, tag: l2 } = await aI(o2, this._plaintext, d2, this._iv, e2));
          let p2 = { ciphertext: q(k2), iv: q(this._iv), tag: q(l2) };
          return c2 && (p2.encrypted_key = q(c2)), g2 && (p2.aad = g2), this._protectedHeader && (p2.protected = i.decode(f2)), this._sharedUnprotectedHeader && (p2.unprotected = this._sharedUnprotectedHeader), this._unprotectedHeader && (p2.header = this._unprotectedHeader), p2;
        }
      }
      class aY {
        constructor(a10, b2, c2) {
          this.parent = a10, this.key = b2, this.options = c2;
        }
        setUnprotectedHeader(a10) {
          if (this.unprotectedHeader) throw TypeError("setUnprotectedHeader can only be called once");
          return this.unprotectedHeader = a10, this;
        }
        addRecipient(...a10) {
          return this.parent.addRecipient(...a10);
        }
        encrypt(...a10) {
          return this.parent.encrypt(...a10);
        }
        done() {
          return this.parent;
        }
      }
      class aZ {
        constructor(a10) {
          this._recipients = [], this._plaintext = a10;
        }
        addRecipient(a10, b2) {
          let c2 = new aY(this, a10, { crit: null == b2 ? void 0 : b2.crit });
          return this._recipients.push(c2), c2;
        }
        setProtectedHeader(a10) {
          if (this._protectedHeader) throw TypeError("setProtectedHeader can only be called once");
          return this._protectedHeader = a10, this;
        }
        setSharedUnprotectedHeader(a10) {
          if (this._unprotectedHeader) throw TypeError("setSharedUnprotectedHeader can only be called once");
          return this._unprotectedHeader = a10, this;
        }
        setAdditionalAuthenticatedData(a10) {
          return this._aad = a10, this;
        }
        async encrypt(a10) {
          var b2, c2, d2;
          let e2;
          if (!this._recipients.length) throw new A("at least one recipient must be added");
          if (a10 = { deflateRaw: null == a10 ? void 0 : a10.deflateRaw }, 1 === this._recipients.length) {
            let [b3] = this._recipients, c3 = await new aX(this._plaintext).setAdditionalAuthenticatedData(this._aad).setProtectedHeader(this._protectedHeader).setSharedUnprotectedHeader(this._unprotectedHeader).setUnprotectedHeader(b3.unprotectedHeader).encrypt(b3.key, { ...b3.options, ...a10 }), d3 = { ciphertext: c3.ciphertext, iv: c3.iv, recipients: [{}], tag: c3.tag };
            return c3.aad && (d3.aad = c3.aad), c3.protected && (d3.protected = c3.protected), c3.unprotected && (d3.unprotected = c3.unprotected), c3.encrypted_key && (d3.recipients[0].encrypted_key = c3.encrypted_key), c3.header && (d3.recipients[0].header = c3.header), d3;
          }
          for (let a11 = 0; a11 < this._recipients.length; a11++) {
            let b3 = this._recipients[a11];
            if (!aa(this._protectedHeader, this._unprotectedHeader, b3.unprotectedHeader)) throw new A("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
            let c3 = { ...this._protectedHeader, ...this._unprotectedHeader, ...b3.unprotectedHeader }, { alg: d3 } = c3;
            if ("string" != typeof d3 || !d3) throw new A('JWE "alg" (Algorithm) Header Parameter missing or invalid');
            if ("dir" === d3 || "ECDH-ES" === d3) throw new A('"dir" and "ECDH-ES" alg may only be used with a single recipient');
            if ("string" != typeof c3.enc || !c3.enc) throw new A('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
            if (e2) {
              if (e2 !== c3.enc) throw new A('JWE "enc" (Encryption Algorithm) Header Parameter must be the same for all recipients');
            } else e2 = c3.enc;
            if (aM(A, /* @__PURE__ */ new Map(), b3.options.crit, this._protectedHeader, c3), void 0 !== c3.zip && (!this._protectedHeader || !this._protectedHeader.zip)) throw new A('JWE "zip" (Compression Algorithm) Header MUST be integrity protected');
          }
          let f2 = as(e2), g2 = { ciphertext: "", iv: "", recipients: [], tag: "" };
          for (let h2 = 0; h2 < this._recipients.length; h2++) {
            let i2 = this._recipients[h2], j2 = {};
            g2.recipients.push(j2);
            let k2 = { ...this._protectedHeader, ...this._unprotectedHeader, ...i2.unprotectedHeader }.alg.startsWith("PBES2") ? 2048 + h2 : void 0;
            if (0 === h2) {
              let b3 = await new aX(this._plaintext).setAdditionalAuthenticatedData(this._aad).setContentEncryptionKey(f2).setProtectedHeader(this._protectedHeader).setSharedUnprotectedHeader(this._unprotectedHeader).setUnprotectedHeader(i2.unprotectedHeader).setKeyManagementParameters({ p2c: k2 }).encrypt(i2.key, { ...i2.options, ...a10, [aW]: true });
              g2.ciphertext = b3.ciphertext, g2.iv = b3.iv, g2.tag = b3.tag, b3.aad && (g2.aad = b3.aad), b3.protected && (g2.protected = b3.protected), b3.unprotected && (g2.unprotected = b3.unprotected), j2.encrypted_key = b3.encrypted_key, b3.header && (j2.header = b3.header);
              continue;
            }
            let { encryptedKey: l2, parameters: m2 } = await aV((null == (b2 = i2.unprotectedHeader) ? void 0 : b2.alg) || (null == (c2 = this._protectedHeader) ? void 0 : c2.alg) || (null == (d2 = this._unprotectedHeader) ? void 0 : d2.alg), e2, i2.key, f2, { p2c: k2 });
            j2.encrypted_key = q(l2), (i2.unprotectedHeader || m2) && (j2.header = { ...i2.unprotectedHeader, ...m2 });
          }
          return g2;
        }
      }
      function a$(a10, b2) {
        let c2 = `SHA-${a10.slice(-3)}`;
        switch (a10) {
          case "HS256":
          case "HS384":
          case "HS512":
            return { hash: c2, name: "HMAC" };
          case "PS256":
          case "PS384":
          case "PS512":
            return { hash: c2, name: "RSA-PSS", saltLength: a10.slice(-3) >> 3 };
          case "RS256":
          case "RS384":
          case "RS512":
            return { hash: c2, name: "RSASSA-PKCS1-v1_5" };
          case "ES256":
          case "ES384":
          case "ES512":
            return { hash: c2, name: "ECDSA", namedCurve: b2.namedCurve };
          case "EdDSA":
            return { name: b2.name };
          default:
            throw new x(`alg ${a10} is not supported either by JOSE or your javascript runtime`);
        }
      }
      function a_(a10, b2, c2) {
        if (b2 instanceof CryptoKey) return !function(a11, b3, ...c3) {
          switch (b3) {
            case "HS256":
            case "HS384":
            case "HS512": {
              if (!P(a11.algorithm, "HMAC")) throw O("HMAC");
              let c4 = parseInt(b3.slice(2), 10);
              if (Q(a11.algorithm.hash) !== c4) throw O(`SHA-${c4}`, "algorithm.hash");
              break;
            }
            case "RS256":
            case "RS384":
            case "RS512": {
              if (!P(a11.algorithm, "RSASSA-PKCS1-v1_5")) throw O("RSASSA-PKCS1-v1_5");
              let c4 = parseInt(b3.slice(2), 10);
              if (Q(a11.algorithm.hash) !== c4) throw O(`SHA-${c4}`, "algorithm.hash");
              break;
            }
            case "PS256":
            case "PS384":
            case "PS512": {
              if (!P(a11.algorithm, "RSA-PSS")) throw O("RSA-PSS");
              let c4 = parseInt(b3.slice(2), 10);
              if (Q(a11.algorithm.hash) !== c4) throw O(`SHA-${c4}`, "algorithm.hash");
              break;
            }
            case "EdDSA":
              if ("Ed25519" !== a11.algorithm.name && "Ed448" !== a11.algorithm.name) throw O("Ed25519 or Ed448");
              break;
            case "ES256":
            case "ES384":
            case "ES512": {
              if (!P(a11.algorithm, "ECDSA")) throw O("ECDSA");
              let c4 = function(a12) {
                switch (a12) {
                  case "ES256":
                    return "P-256";
                  case "ES384":
                    return "P-384";
                  case "ES512":
                    return "P-521";
                  default:
                    throw Error("unreachable");
                }
              }(b3);
              if (a11.algorithm.namedCurve !== c4) throw O(c4, "algorithm.namedCurve");
              break;
            }
            default:
              throw TypeError("CryptoKey does not support this operation");
          }
          R(a11, c3);
        }(b2, a10, c2), b2;
        if (b2 instanceof Uint8Array) {
          if (!a10.startsWith("HS")) throw TypeError(U(b2, ...W));
          return f.subtle.importKey("raw", b2, { hash: `SHA-${a10.slice(-3)}`, name: "HMAC" }, false, [c2]);
        }
        throw TypeError(U(b2, ...W, "Uint8Array"));
      }
      let a0 = async (a10, b2, c2, d2) => {
        let e2 = await a_(a10, b2, "verify");
        ao(a10, e2);
        let g2 = a$(a10, e2.algorithm);
        try {
          return await f.subtle.verify(g2, e2, c2, d2);
        } catch (a11) {
          return false;
        }
      };
      async function a1(a10, b2, c2) {
        var d2;
        let e2, f2;
        if (!ab(a10)) throw new B("Flattened JWS must be an object");
        if (void 0 === a10.protected && void 0 === a10.header) throw new B('Flattened JWS must have either of the "protected" or "header" members');
        if (void 0 !== a10.protected && "string" != typeof a10.protected) throw new B("JWS Protected Header incorrect type");
        if (void 0 === a10.payload) throw new B("JWS Payload missing");
        if ("string" != typeof a10.signature) throw new B("JWS Signature missing or incorrect type");
        if (void 0 !== a10.header && !ab(a10.header)) throw new B("JWS Unprotected Header incorrect type");
        let g2 = {};
        if (a10.protected) try {
          let b3 = s(a10.protected);
          g2 = JSON.parse(i.decode(b3));
        } catch (a11) {
          throw new B("JWS Protected Header is invalid");
        }
        if (!aa(g2, a10.header)) throw new B("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
        let k2 = { ...g2, ...a10.header }, l2 = aM(B, /* @__PURE__ */ new Map([["b64", true]]), null == c2 ? void 0 : c2.crit, g2, k2), m2 = true;
        if (l2.has("b64") && "boolean" != typeof (m2 = g2.b64)) throw new B('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
        let { alg: n2 } = k2;
        if ("string" != typeof n2 || !n2) throw new B('JWS "alg" (Algorithm) Header Parameter missing or invalid');
        let o2 = c2 && aN("algorithms", c2.algorithms);
        if (o2 && !o2.has(n2)) throw new w('"alg" (Algorithm) Header Parameter not allowed');
        if (m2) {
          if ("string" != typeof a10.payload) throw new B("JWS Payload must be a string");
        } else if ("string" != typeof a10.payload && !(a10.payload instanceof Uint8Array)) throw new B("JWS Payload must be a string or an Uint8Array instance");
        let p2 = false;
        "function" == typeof b2 && (b2 = await b2(g2, a10), p2 = true), aF(n2, b2, "verify");
        let q2 = j(h.encode(null != (d2 = a10.protected) ? d2 : ""), h.encode("."), "string" == typeof a10.payload ? h.encode(a10.payload) : a10.payload);
        try {
          e2 = s(a10.signature);
        } catch (a11) {
          throw new B("Failed to base64url decode the signature");
        }
        if (!await a0(n2, b2, e2, q2)) throw new I();
        if (m2) try {
          f2 = s(a10.payload);
        } catch (a11) {
          throw new B("Failed to base64url decode the payload");
        }
        else f2 = "string" == typeof a10.payload ? h.encode(a10.payload) : a10.payload;
        let r2 = { payload: f2 };
        return (void 0 !== a10.protected && (r2.protectedHeader = g2), void 0 !== a10.header && (r2.unprotectedHeader = a10.header), p2) ? { ...r2, key: b2 } : r2;
      }
      async function a2(a10, b2, c2) {
        if (a10 instanceof Uint8Array && (a10 = i.decode(a10)), "string" != typeof a10) throw new B("Compact JWS must be a string or Uint8Array");
        let { 0: d2, 1: e2, 2: f2, length: g2 } = a10.split(".");
        if (3 !== g2) throw new B("Invalid Compact JWS");
        let h2 = await a1({ payload: e2, protected: d2, signature: f2 }, b2, c2), j2 = { payload: h2.payload, protectedHeader: h2.protectedHeader };
        return "function" == typeof b2 ? { ...j2, key: h2.key } : j2;
      }
      async function a3(a10, b2, c2) {
        if (!ab(a10)) throw new B("General JWS must be an object");
        if (!Array.isArray(a10.signatures) || !a10.signatures.every(ab)) throw new B("JWS Signatures missing or incorrect type");
        for (let d2 of a10.signatures) try {
          return await a1({ header: d2.header, payload: a10.payload, protected: d2.protected, signature: d2.signature }, b2, c2);
        } catch (a11) {
        }
        throw new I();
      }
      let a4 = (a10) => Math.floor(a10.getTime() / 1e3), a5 = /^(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)$/i, a6 = (a10) => {
        let b2 = a5.exec(a10);
        if (!b2) throw TypeError("Invalid time period format");
        let c2 = parseFloat(b2[1]);
        switch (b2[2].toLowerCase()) {
          case "sec":
          case "secs":
          case "second":
          case "seconds":
          case "s":
            return Math.round(c2);
          case "minute":
          case "minutes":
          case "min":
          case "mins":
          case "m":
            return Math.round(60 * c2);
          case "hour":
          case "hours":
          case "hr":
          case "hrs":
          case "h":
            return Math.round(3600 * c2);
          case "day":
          case "days":
          case "d":
            return Math.round(86400 * c2);
          case "week":
          case "weeks":
          case "w":
            return Math.round(604800 * c2);
          default:
            return Math.round(31557600 * c2);
        }
      }, a7 = (a10) => a10.toLowerCase().replace(/^application\//, ""), a8 = (a10, b2, c2 = {}) => {
        var d2, e2;
        let f2, g2, { typ: h2 } = c2;
        if (h2 && ("string" != typeof a10.typ || a7(a10.typ) !== a7(h2))) throw new u('unexpected "typ" JWT header value', "typ", "check_failed");
        try {
          f2 = JSON.parse(i.decode(b2));
        } catch (a11) {
        }
        if (!ab(f2)) throw new C("JWT Claims Set must be a top-level JSON object");
        let { requiredClaims: j2 = [], issuer: k2, subject: l2, audience: m2, maxTokenAge: n2 } = c2;
        for (let a11 of (void 0 !== n2 && j2.push("iat"), void 0 !== m2 && j2.push("aud"), void 0 !== l2 && j2.push("sub"), void 0 !== k2 && j2.push("iss"), new Set(j2.reverse()))) if (!(a11 in f2)) throw new u(`missing required "${a11}" claim`, a11, "missing");
        if (k2 && !(Array.isArray(k2) ? k2 : [k2]).includes(f2.iss)) throw new u('unexpected "iss" claim value', "iss", "check_failed");
        if (l2 && f2.sub !== l2) throw new u('unexpected "sub" claim value', "sub", "check_failed");
        if (m2 && (d2 = f2.aud, e2 = "string" == typeof m2 ? [m2] : m2, "string" == typeof d2 ? !e2.includes(d2) : !(Array.isArray(d2) && e2.some(Set.prototype.has.bind(new Set(d2)))))) throw new u('unexpected "aud" claim value', "aud", "check_failed");
        switch (typeof c2.clockTolerance) {
          case "string":
            g2 = a6(c2.clockTolerance);
            break;
          case "number":
            g2 = c2.clockTolerance;
            break;
          case "undefined":
            g2 = 0;
            break;
          default:
            throw TypeError("Invalid clockTolerance option type");
        }
        let { currentDate: o2 } = c2, p2 = a4(o2 || /* @__PURE__ */ new Date());
        if ((void 0 !== f2.iat || n2) && "number" != typeof f2.iat) throw new u('"iat" claim must be a number', "iat", "invalid");
        if (void 0 !== f2.nbf) {
          if ("number" != typeof f2.nbf) throw new u('"nbf" claim must be a number', "nbf", "invalid");
          if (f2.nbf > p2 + g2) throw new u('"nbf" claim timestamp check failed', "nbf", "check_failed");
        }
        if (void 0 !== f2.exp) {
          if ("number" != typeof f2.exp) throw new u('"exp" claim must be a number', "exp", "invalid");
          if (f2.exp <= p2 - g2) throw new v('"exp" claim timestamp check failed', "exp", "check_failed");
        }
        if (n2) {
          let a11 = p2 - f2.iat;
          if (a11 - g2 > ("number" == typeof n2 ? n2 : a6(n2))) throw new v('"iat" claim timestamp check failed (too far in the past)', "iat", "check_failed");
          if (a11 < 0 - g2) throw new u('"iat" claim timestamp check failed (it should be in the past)', "iat", "check_failed");
        }
        return f2;
      };
      async function a9(a10, b2, c2) {
        var d2;
        let e2 = await a2(a10, b2, c2);
        if ((null == (d2 = e2.protectedHeader.crit) ? void 0 : d2.includes("b64")) && false === e2.protectedHeader.b64) throw new C("JWTs MUST NOT use unencoded payload");
        let f2 = { payload: a8(e2.protectedHeader, e2.payload, c2), protectedHeader: e2.protectedHeader };
        return "function" == typeof b2 ? { ...f2, key: e2.key } : f2;
      }
      async function ba(a10, b2, c2) {
        let d2 = await aP(a10, b2, c2), e2 = a8(d2.protectedHeader, d2.plaintext, c2), { protectedHeader: f2 } = d2;
        if (void 0 !== f2.iss && f2.iss !== e2.iss) throw new u('replicated "iss" claim header parameter mismatch', "iss", "mismatch");
        if (void 0 !== f2.sub && f2.sub !== e2.sub) throw new u('replicated "sub" claim header parameter mismatch', "sub", "mismatch");
        if (void 0 !== f2.aud && JSON.stringify(f2.aud) !== JSON.stringify(e2.aud)) throw new u('replicated "aud" claim header parameter mismatch', "aud", "mismatch");
        let g2 = { payload: e2, protectedHeader: f2 };
        return "function" == typeof b2 ? { ...g2, key: d2.key } : g2;
      }
      class bb {
        constructor(a10) {
          this._flattened = new aX(a10);
        }
        setContentEncryptionKey(a10) {
          return this._flattened.setContentEncryptionKey(a10), this;
        }
        setInitializationVector(a10) {
          return this._flattened.setInitializationVector(a10), this;
        }
        setProtectedHeader(a10) {
          return this._flattened.setProtectedHeader(a10), this;
        }
        setKeyManagementParameters(a10) {
          return this._flattened.setKeyManagementParameters(a10), this;
        }
        async encrypt(a10, b2) {
          let c2 = await this._flattened.encrypt(a10, b2);
          return [c2.protected, c2.encrypted_key, c2.iv, c2.ciphertext, c2.tag].join(".");
        }
      }
      let bc = async (a10, b2, c2) => {
        let d2 = await a_(a10, b2, "sign");
        return ao(a10, d2), new Uint8Array(await f.subtle.sign(a$(a10, d2.algorithm), d2, c2));
      };
      class bd {
        constructor(a10) {
          if (!(a10 instanceof Uint8Array)) throw TypeError("payload must be an instance of Uint8Array");
          this._payload = a10;
        }
        setProtectedHeader(a10) {
          if (this._protectedHeader) throw TypeError("setProtectedHeader can only be called once");
          return this._protectedHeader = a10, this;
        }
        setUnprotectedHeader(a10) {
          if (this._unprotectedHeader) throw TypeError("setUnprotectedHeader can only be called once");
          return this._unprotectedHeader = a10, this;
        }
        async sign(a10, b2) {
          let c2;
          if (!this._protectedHeader && !this._unprotectedHeader) throw new B("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
          if (!aa(this._protectedHeader, this._unprotectedHeader)) throw new B("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
          let d2 = { ...this._protectedHeader, ...this._unprotectedHeader }, e2 = aM(B, /* @__PURE__ */ new Map([["b64", true]]), null == b2 ? void 0 : b2.crit, this._protectedHeader, d2), f2 = true;
          if (e2.has("b64") && "boolean" != typeof (f2 = this._protectedHeader.b64)) throw new B('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
          let { alg: g2 } = d2;
          if ("string" != typeof g2 || !g2) throw new B('JWS "alg" (Algorithm) Header Parameter missing or invalid');
          aF(g2, a10, "sign");
          let k2 = this._payload;
          f2 && (k2 = h.encode(q(k2)));
          let l2 = j(c2 = this._protectedHeader ? h.encode(q(JSON.stringify(this._protectedHeader))) : h.encode(""), h.encode("."), k2), m2 = { signature: q(await bc(g2, a10, l2)), payload: "" };
          return f2 && (m2.payload = i.decode(k2)), this._unprotectedHeader && (m2.header = this._unprotectedHeader), this._protectedHeader && (m2.protected = i.decode(c2)), m2;
        }
      }
      class be {
        constructor(a10) {
          this._flattened = new bd(a10);
        }
        setProtectedHeader(a10) {
          return this._flattened.setProtectedHeader(a10), this;
        }
        async sign(a10, b2) {
          let c2 = await this._flattened.sign(a10, b2);
          if (void 0 === c2.payload) throw TypeError("use the flattened module for creating JWS with b64: false");
          return `${c2.protected}.${c2.payload}.${c2.signature}`;
        }
      }
      class bf {
        constructor(a10, b2, c2) {
          this.parent = a10, this.key = b2, this.options = c2;
        }
        setProtectedHeader(a10) {
          if (this.protectedHeader) throw TypeError("setProtectedHeader can only be called once");
          return this.protectedHeader = a10, this;
        }
        setUnprotectedHeader(a10) {
          if (this.unprotectedHeader) throw TypeError("setUnprotectedHeader can only be called once");
          return this.unprotectedHeader = a10, this;
        }
        addSignature(...a10) {
          return this.parent.addSignature(...a10);
        }
        sign(...a10) {
          return this.parent.sign(...a10);
        }
        done() {
          return this.parent;
        }
      }
      class bg {
        constructor(a10) {
          this._signatures = [], this._payload = a10;
        }
        addSignature(a10, b2) {
          let c2 = new bf(this, a10, b2);
          return this._signatures.push(c2), c2;
        }
        async sign() {
          if (!this._signatures.length) throw new B("at least one signature must be added");
          let a10 = { signatures: [], payload: "" };
          for (let b2 = 0; b2 < this._signatures.length; b2++) {
            let c2 = this._signatures[b2], d2 = new bd(this._payload);
            d2.setProtectedHeader(c2.protectedHeader), d2.setUnprotectedHeader(c2.unprotectedHeader);
            let { payload: e2, ...f2 } = await d2.sign(c2.key, c2.options);
            if (0 === b2) a10.payload = e2;
            else if (a10.payload !== e2) throw new B("inconsistent use of JWS Unencoded Payload (RFC7797)");
            a10.signatures.push(f2);
          }
          return a10;
        }
      }
      class bh {
        constructor(a10) {
          if (!ab(a10)) throw TypeError("JWT Claims Set MUST be an object");
          this._payload = a10;
        }
        setIssuer(a10) {
          return this._payload = { ...this._payload, iss: a10 }, this;
        }
        setSubject(a10) {
          return this._payload = { ...this._payload, sub: a10 }, this;
        }
        setAudience(a10) {
          return this._payload = { ...this._payload, aud: a10 }, this;
        }
        setJti(a10) {
          return this._payload = { ...this._payload, jti: a10 }, this;
        }
        setNotBefore(a10) {
          return "number" == typeof a10 ? this._payload = { ...this._payload, nbf: a10 } : this._payload = { ...this._payload, nbf: a4(/* @__PURE__ */ new Date()) + a6(a10) }, this;
        }
        setExpirationTime(a10) {
          return "number" == typeof a10 ? this._payload = { ...this._payload, exp: a10 } : this._payload = { ...this._payload, exp: a4(/* @__PURE__ */ new Date()) + a6(a10) }, this;
        }
        setIssuedAt(a10) {
          return void 0 === a10 ? this._payload = { ...this._payload, iat: a4(/* @__PURE__ */ new Date()) } : this._payload = { ...this._payload, iat: a10 }, this;
        }
      }
      class bi extends bh {
        setProtectedHeader(a10) {
          return this._protectedHeader = a10, this;
        }
        async sign(a10, b2) {
          var c2;
          let d2 = new be(h.encode(JSON.stringify(this._payload)));
          if (d2.setProtectedHeader(this._protectedHeader), Array.isArray(null == (c2 = this._protectedHeader) ? void 0 : c2.crit) && this._protectedHeader.crit.includes("b64") && false === this._protectedHeader.b64) throw new C("JWTs MUST NOT use unencoded payload");
          return d2.sign(a10, b2);
        }
      }
      class bj extends bh {
        setProtectedHeader(a10) {
          if (this._protectedHeader) throw TypeError("setProtectedHeader can only be called once");
          return this._protectedHeader = a10, this;
        }
        setKeyManagementParameters(a10) {
          if (this._keyManagementParameters) throw TypeError("setKeyManagementParameters can only be called once");
          return this._keyManagementParameters = a10, this;
        }
        setContentEncryptionKey(a10) {
          if (this._cek) throw TypeError("setContentEncryptionKey can only be called once");
          return this._cek = a10, this;
        }
        setInitializationVector(a10) {
          if (this._iv) throw TypeError("setInitializationVector can only be called once");
          return this._iv = a10, this;
        }
        replicateIssuerAsHeader() {
          return this._replicateIssuerAsHeader = true, this;
        }
        replicateSubjectAsHeader() {
          return this._replicateSubjectAsHeader = true, this;
        }
        replicateAudienceAsHeader() {
          return this._replicateAudienceAsHeader = true, this;
        }
        async encrypt(a10, b2) {
          let c2 = new bb(h.encode(JSON.stringify(this._payload)));
          return this._replicateIssuerAsHeader && (this._protectedHeader = { ...this._protectedHeader, iss: this._payload.iss }), this._replicateSubjectAsHeader && (this._protectedHeader = { ...this._protectedHeader, sub: this._payload.sub }), this._replicateAudienceAsHeader && (this._protectedHeader = { ...this._protectedHeader, aud: this._payload.aud }), c2.setProtectedHeader(this._protectedHeader), this._iv && c2.setInitializationVector(this._iv), this._cek && c2.setContentEncryptionKey(this._cek), this._keyManagementParameters && c2.setKeyManagementParameters(this._keyManagementParameters), c2.encrypt(a10, b2);
        }
      }
      let bk = (a10, b2) => {
        if ("string" != typeof a10 || !a10) throw new D(`${b2} missing or invalid`);
      };
      async function bl(a10, b2) {
        let c2;
        if (!ab(a10)) throw TypeError("JWK must be an object");
        if (null != b2 || (b2 = "sha256"), "sha256" !== b2 && "sha384" !== b2 && "sha512" !== b2) throw TypeError('digestAlgorithm must one of "sha256", "sha384", or "sha512"');
        switch (a10.kty) {
          case "EC":
            bk(a10.crv, '"crv" (Curve) Parameter'), bk(a10.x, '"x" (X Coordinate) Parameter'), bk(a10.y, '"y" (Y Coordinate) Parameter'), c2 = { crv: a10.crv, kty: a10.kty, x: a10.x, y: a10.y };
            break;
          case "OKP":
            bk(a10.crv, '"crv" (Subtype of Key Pair) Parameter'), bk(a10.x, '"x" (Public Key) Parameter'), c2 = { crv: a10.crv, kty: a10.kty, x: a10.x };
            break;
          case "RSA":
            bk(a10.e, '"e" (Exponent) Parameter'), bk(a10.n, '"n" (Modulus) Parameter'), c2 = { e: a10.e, kty: a10.kty, n: a10.n };
            break;
          case "oct":
            bk(a10.k, '"k" (Key Value) Parameter'), c2 = { k: a10.k, kty: a10.kty };
            break;
          default:
            throw new x('"kty" (Key Type) Parameter missing or unsupported');
        }
        let d2 = h.encode(JSON.stringify(c2));
        return q(await g(b2, d2));
      }
      async function bm(a10, b2) {
        null != b2 || (b2 = "sha256");
        let c2 = await bl(a10, b2);
        return `urn:ietf:params:oauth:jwk-thumbprint:sha-${b2.slice(-3)}:${c2}`;
      }
      async function bn(a10, b2) {
        let c2 = { ...a10, ...null == b2 ? void 0 : b2.header };
        if (!ab(c2.jwk)) throw new B('"jwk" (JSON Web Key) Header Parameter must be a JSON object');
        let d2 = await aE({ ...c2.jwk, ext: true }, c2.alg, true);
        if (d2 instanceof Uint8Array || "public" !== d2.type) throw new B('"jwk" (JSON Web Key) Header Parameter must be a public key');
        return d2;
      }
      function bo(a10) {
        return a10 && "object" == typeof a10 && Array.isArray(a10.keys) && a10.keys.every(bp);
      }
      function bp(a10) {
        return ab(a10);
      }
      class bq {
        constructor(a10) {
          if (this._cached = /* @__PURE__ */ new WeakMap(), !bo(a10)) throw new E("JSON Web Key Set malformed");
          this._jwks = function(a11) {
            return "function" == typeof structuredClone ? structuredClone(a11) : JSON.parse(JSON.stringify(a11));
          }(a10);
        }
        async getKey(a10, b2) {
          let { alg: c2, kid: d2 } = { ...a10, ...null == b2 ? void 0 : b2.header }, e2 = function(a11) {
            switch ("string" == typeof a11 && a11.slice(0, 2)) {
              case "RS":
              case "PS":
                return "RSA";
              case "ES":
                return "EC";
              case "Ed":
                return "OKP";
              default:
                throw new x('Unsupported "alg" value for a JSON Web Key Set');
            }
          }(c2), f2 = this._jwks.keys.filter((a11) => {
            let b3 = e2 === a11.kty;
            if (b3 && "string" == typeof d2 && (b3 = d2 === a11.kid), b3 && "string" == typeof a11.alg && (b3 = c2 === a11.alg), b3 && "string" == typeof a11.use && (b3 = "sig" === a11.use), b3 && Array.isArray(a11.key_ops) && (b3 = a11.key_ops.includes("verify")), b3 && "EdDSA" === c2 && (b3 = "Ed25519" === a11.crv || "Ed448" === a11.crv), b3) switch (c2) {
              case "ES256":
                b3 = "P-256" === a11.crv;
                break;
              case "ES256K":
                b3 = "secp256k1" === a11.crv;
                break;
              case "ES384":
                b3 = "P-384" === a11.crv;
                break;
              case "ES512":
                b3 = "P-521" === a11.crv;
            }
            return b3;
          }), { 0: g2, length: h2 } = f2;
          if (0 === h2) throw new F();
          if (1 !== h2) {
            let a11 = new G(), { _cached: b3 } = this;
            throw a11[Symbol.asyncIterator] = async function* () {
              for (let a12 of f2) try {
                yield await br(b3, a12, c2);
              } catch (a13) {
                continue;
              }
            }, a11;
          }
          return br(this._cached, g2, c2);
        }
      }
      async function br(a10, b2, c2) {
        let d2 = a10.get(b2) || a10.set(b2, {}).get(b2);
        if (void 0 === d2[c2]) {
          let a11 = await aE({ ...b2, ext: true }, c2);
          if (a11 instanceof Uint8Array || "public" !== a11.type) throw new E("JSON Web Key Set members must be public keys");
          d2[c2] = a11;
        }
        return d2[c2];
      }
      function bs(a10) {
        let b2 = new bq(a10);
        return async function(a11, c2) {
          return b2.getKey(a11, c2);
        };
      }
      let bt = async (a10, b2, c2) => {
        let d2, e2, f2 = false;
        "function" == typeof AbortController && (d2 = new AbortController(), e2 = setTimeout(() => {
          f2 = true, d2.abort();
        }, b2));
        let g2 = await fetch(a10.href, { signal: d2 ? d2.signal : void 0, redirect: "manual", headers: c2.headers }).catch((a11) => {
          if (f2) throw new H();
          throw a11;
        });
        if (void 0 !== e2 && clearTimeout(e2), 200 !== g2.status) throw new t("Expected 200 OK from the JSON Web Key Set HTTP response");
        try {
          return await g2.json();
        } catch (a11) {
          throw new t("Failed to parse the JSON Web Key Set HTTP response as JSON");
        }
      };
      class bu extends bq {
        constructor(a10, b2) {
          if (super({ keys: [] }), this._jwks = void 0, !(a10 instanceof URL)) throw TypeError("url must be an instance of URL");
          this._url = new URL(a10.href), this._options = { agent: null == b2 ? void 0 : b2.agent, headers: null == b2 ? void 0 : b2.headers }, this._timeoutDuration = "number" == typeof (null == b2 ? void 0 : b2.timeoutDuration) ? null == b2 ? void 0 : b2.timeoutDuration : 5e3, this._cooldownDuration = "number" == typeof (null == b2 ? void 0 : b2.cooldownDuration) ? null == b2 ? void 0 : b2.cooldownDuration : 3e4, this._cacheMaxAge = "number" == typeof (null == b2 ? void 0 : b2.cacheMaxAge) ? null == b2 ? void 0 : b2.cacheMaxAge : 6e5;
        }
        coolingDown() {
          return "number" == typeof this._jwksTimestamp && Date.now() < this._jwksTimestamp + this._cooldownDuration;
        }
        fresh() {
          return "number" == typeof this._jwksTimestamp && Date.now() < this._jwksTimestamp + this._cacheMaxAge;
        }
        async getKey(a10, b2) {
          this._jwks && this.fresh() || await this.reload();
          try {
            return await super.getKey(a10, b2);
          } catch (c2) {
            if (c2 instanceof F && false === this.coolingDown()) return await this.reload(), super.getKey(a10, b2);
            throw c2;
          }
        }
        async reload() {
          this._pendingFetch && ("u" > typeof WebSocketPair || "u" > typeof navigator && "Cloudflare-Workers" === navigator.userAgent) && (this._pendingFetch = void 0), this._pendingFetch || (this._pendingFetch = bt(this._url, this._timeoutDuration, this._options).then((a10) => {
            if (!bo(a10)) throw new E("JSON Web Key Set malformed");
            this._jwks = { keys: a10.keys }, this._jwksTimestamp = Date.now(), this._pendingFetch = void 0;
          }).catch((a10) => {
            throw this._pendingFetch = void 0, a10;
          })), await this._pendingFetch;
        }
      }
      function bv(a10, b2) {
        let c2 = new bu(a10, b2);
        return async function(a11, b3) {
          return c2.getKey(a11, b3);
        };
      }
      class bw extends bh {
        encode() {
          let a10 = q(JSON.stringify({ alg: "none" })), b2 = q(JSON.stringify(this._payload));
          return `${a10}.${b2}.`;
        }
        static decode(a10, b2) {
          let c2;
          if ("string" != typeof a10) throw new C("Unsecured JWT must be a string");
          let { 0: d2, 1: e2, 2: f2, length: g2 } = a10.split(".");
          if (3 !== g2 || "" !== f2) throw new C("Invalid Unsecured JWT");
          try {
            if (c2 = JSON.parse(i.decode(s(d2))), "none" !== c2.alg) throw Error();
          } catch (a11) {
            throw new C("Invalid Unsecured JWT");
          }
          return { payload: a8(c2, s(e2), b2), header: c2 };
        }
      }
      let bx = q, by = s;
      function bz(a10) {
        let b2;
        if ("string" == typeof a10) {
          let c2 = a10.split(".");
          (3 === c2.length || 5 === c2.length) && ([b2] = c2);
        } else if ("object" == typeof a10 && a10) if ("protected" in a10) b2 = a10.protected;
        else throw TypeError("Token does not contain a Protected Header");
        try {
          if ("string" != typeof b2 || !b2) throw Error();
          let a11 = JSON.parse(i.decode(by(b2)));
          if (!ab(a11)) throw Error();
          return a11;
        } catch (a11) {
          throw TypeError("Invalid Token or Protected Header formatting");
        }
      }
      function bA(a10) {
        let b2, c2;
        if ("string" != typeof a10) throw new C("JWTs must use Compact JWS serialization, JWT must be a string");
        let { 1: d2, length: e2 } = a10.split(".");
        if (5 === e2) throw new C("Only JWTs using Compact JWS serialization can be decoded");
        if (3 !== e2) throw new C("Invalid JWT");
        if (!d2) throw new C("JWTs must contain a payload");
        try {
          b2 = by(d2);
        } catch (a11) {
          throw new C("Failed to base64url decode the payload");
        }
        try {
          c2 = JSON.parse(i.decode(b2));
        } catch (a11) {
          throw new C("Failed to parse the decoded payload as JSON");
        }
        if (!ab(c2)) throw new C("Invalid JWT Claims Set");
        return c2;
      }
      async function bB(a10, b2) {
        var c2;
        let d2, e2, g2;
        switch (a10) {
          case "HS256":
          case "HS384":
          case "HS512":
            d2 = parseInt(a10.slice(-3), 10), e2 = { name: "HMAC", hash: `SHA-${d2}`, length: d2 }, g2 = ["sign", "verify"];
            break;
          case "A128CBC-HS256":
          case "A192CBC-HS384":
          case "A256CBC-HS512":
            return J(new Uint8Array((d2 = parseInt(a10.slice(-3), 10)) >> 3));
          case "A128KW":
          case "A192KW":
          case "A256KW":
            e2 = { name: "AES-KW", length: d2 = parseInt(a10.slice(1, 4), 10) }, g2 = ["wrapKey", "unwrapKey"];
            break;
          case "A128GCMKW":
          case "A192GCMKW":
          case "A256GCMKW":
          case "A128GCM":
          case "A192GCM":
          case "A256GCM":
            e2 = { name: "AES-GCM", length: d2 = parseInt(a10.slice(1, 4), 10) }, g2 = ["encrypt", "decrypt"];
            break;
          default:
            throw new x('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
        }
        return f.subtle.generateKey(e2, null != (c2 = null == b2 ? void 0 : b2.extractable) && c2, g2);
      }
      function bC(a10) {
        var b2;
        let c2 = null != (b2 = null == a10 ? void 0 : a10.modulusLength) ? b2 : 2048;
        if ("number" != typeof c2 || c2 < 2048) throw new x("Invalid or unsupported modulusLength option provided, 2048 bits or larger keys must be used");
        return c2;
      }
      async function bD(a10, b2) {
        var c2, d2, e2;
        let g2, h2;
        switch (a10) {
          case "PS256":
          case "PS384":
          case "PS512":
            g2 = { name: "RSA-PSS", hash: `SHA-${a10.slice(-3)}`, publicExponent: new Uint8Array([1, 0, 1]), modulusLength: bC(b2) }, h2 = ["sign", "verify"];
            break;
          case "RS256":
          case "RS384":
          case "RS512":
            g2 = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${a10.slice(-3)}`, publicExponent: new Uint8Array([1, 0, 1]), modulusLength: bC(b2) }, h2 = ["sign", "verify"];
            break;
          case "RSA-OAEP":
          case "RSA-OAEP-256":
          case "RSA-OAEP-384":
          case "RSA-OAEP-512":
            g2 = { name: "RSA-OAEP", hash: `SHA-${parseInt(a10.slice(-3), 10) || 1}`, publicExponent: new Uint8Array([1, 0, 1]), modulusLength: bC(b2) }, h2 = ["decrypt", "unwrapKey", "encrypt", "wrapKey"];
            break;
          case "ES256":
            g2 = { name: "ECDSA", namedCurve: "P-256" }, h2 = ["sign", "verify"];
            break;
          case "ES384":
            g2 = { name: "ECDSA", namedCurve: "P-384" }, h2 = ["sign", "verify"];
            break;
          case "ES512":
            g2 = { name: "ECDSA", namedCurve: "P-521" }, h2 = ["sign", "verify"];
            break;
          case "EdDSA":
            h2 = ["sign", "verify"];
            let i2 = null != (c2 = null == b2 ? void 0 : b2.crv) ? c2 : "Ed25519";
            switch (i2) {
              case "Ed25519":
              case "Ed448":
                g2 = { name: i2 };
                break;
              default:
                throw new x("Invalid or unsupported crv option provided");
            }
            break;
          case "ECDH-ES":
          case "ECDH-ES+A128KW":
          case "ECDH-ES+A192KW":
          case "ECDH-ES+A256KW": {
            h2 = ["deriveKey", "deriveBits"];
            let a11 = null != (d2 = null == b2 ? void 0 : b2.crv) ? d2 : "P-256";
            switch (a11) {
              case "P-256":
              case "P-384":
              case "P-521":
                g2 = { name: "ECDH", namedCurve: a11 };
                break;
              case "X25519":
              case "X448":
                g2 = { name: a11 };
                break;
              default:
                throw new x("Invalid or unsupported crv option provided, supported values are P-256, P-384, P-521, X25519, and X448");
            }
            break;
          }
          default:
            throw new x('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
        }
        return f.subtle.generateKey(g2, null != (e2 = null == b2 ? void 0 : b2.extractable) && e2, h2);
      }
      async function bE(a10, b2) {
        return bD(a10, b2);
      }
      async function bF(a10, b2) {
        return bB(a10, b2);
      }
      let bG = "WebCryptoAPI";
    }, 4056: (a) => {
      !function() {
        "use strict";
        var b = { 431: function(a2) {
          function b2(a3) {
            if ("string" != typeof a3) throw TypeError("Path must be a string. Received " + JSON.stringify(a3));
          }
          function c2(a3, b3) {
            for (var c3, d3 = "", e = 0, f = -1, g = 0, h = 0; h <= a3.length; ++h) {
              if (h < a3.length) c3 = a3.charCodeAt(h);
              else if (47 === c3) break;
              else c3 = 47;
              if (47 === c3) {
                if (f === h - 1 || 1 === g) ;
                else if (f !== h - 1 && 2 === g) {
                  if (d3.length < 2 || 2 !== e || 46 !== d3.charCodeAt(d3.length - 1) || 46 !== d3.charCodeAt(d3.length - 2)) {
                    if (d3.length > 2) {
                      var i = d3.lastIndexOf("/");
                      if (i !== d3.length - 1) {
                        -1 === i ? (d3 = "", e = 0) : e = (d3 = d3.slice(0, i)).length - 1 - d3.lastIndexOf("/"), f = h, g = 0;
                        continue;
                      }
                    } else if (2 === d3.length || 1 === d3.length) {
                      d3 = "", e = 0, f = h, g = 0;
                      continue;
                    }
                  }
                  b3 && (d3.length > 0 ? d3 += "/.." : d3 = "..", e = 2);
                } else d3.length > 0 ? d3 += "/" + a3.slice(f + 1, h) : d3 = a3.slice(f + 1, h), e = h - f - 1;
                f = h, g = 0;
              } else 46 === c3 && -1 !== g ? ++g : g = -1;
            }
            return d3;
          }
          var d2 = { resolve: function() {
            for (var a3, d3, e = "", f = false, g = arguments.length - 1; g >= -1 && !f; g--) g >= 0 ? d3 = arguments[g] : (void 0 === a3 && (a3 = ""), d3 = a3), b2(d3), 0 !== d3.length && (e = d3 + "/" + e, f = 47 === d3.charCodeAt(0));
            if (e = c2(e, !f), f) if (e.length > 0) return "/" + e;
            else return "/";
            return e.length > 0 ? e : ".";
          }, normalize: function(a3) {
            if (b2(a3), 0 === a3.length) return ".";
            var d3 = 47 === a3.charCodeAt(0), e = 47 === a3.charCodeAt(a3.length - 1);
            return (0 !== (a3 = c2(a3, !d3)).length || d3 || (a3 = "."), a3.length > 0 && e && (a3 += "/"), d3) ? "/" + a3 : a3;
          }, isAbsolute: function(a3) {
            return b2(a3), a3.length > 0 && 47 === a3.charCodeAt(0);
          }, join: function() {
            if (0 == arguments.length) return ".";
            for (var a3, c3 = 0; c3 < arguments.length; ++c3) {
              var e = arguments[c3];
              b2(e), e.length > 0 && (void 0 === a3 ? a3 = e : a3 += "/" + e);
            }
            return void 0 === a3 ? "." : d2.normalize(a3);
          }, relative: function(a3, c3) {
            if (b2(a3), b2(c3), a3 === c3 || (a3 = d2.resolve(a3)) === (c3 = d2.resolve(c3))) return "";
            for (var e = 1; e < a3.length && 47 === a3.charCodeAt(e); ++e) ;
            for (var f = a3.length, g = f - e, h = 1; h < c3.length && 47 === c3.charCodeAt(h); ++h) ;
            for (var i = c3.length - h, j = g < i ? g : i, k = -1, l = 0; l <= j; ++l) {
              if (l === j) {
                if (i > j) {
                  if (47 === c3.charCodeAt(h + l)) return c3.slice(h + l + 1);
                  else if (0 === l) return c3.slice(h + l);
                } else g > j && (47 === a3.charCodeAt(e + l) ? k = l : 0 === l && (k = 0));
                break;
              }
              var m = a3.charCodeAt(e + l);
              if (m !== c3.charCodeAt(h + l)) break;
              47 === m && (k = l);
            }
            var n = "";
            for (l = e + k + 1; l <= f; ++l) (l === f || 47 === a3.charCodeAt(l)) && (0 === n.length ? n += ".." : n += "/..");
            return n.length > 0 ? n + c3.slice(h + k) : (h += k, 47 === c3.charCodeAt(h) && ++h, c3.slice(h));
          }, _makeLong: function(a3) {
            return a3;
          }, dirname: function(a3) {
            if (b2(a3), 0 === a3.length) return ".";
            for (var c3 = a3.charCodeAt(0), d3 = 47 === c3, e = -1, f = true, g = a3.length - 1; g >= 1; --g) if (47 === (c3 = a3.charCodeAt(g))) {
              if (!f) {
                e = g;
                break;
              }
            } else f = false;
            return -1 === e ? d3 ? "/" : "." : d3 && 1 === e ? "//" : a3.slice(0, e);
          }, basename: function(a3, c3) {
            if (void 0 !== c3 && "string" != typeof c3) throw TypeError('"ext" argument must be a string');
            b2(a3);
            var d3, e = 0, f = -1, g = true;
            if (void 0 !== c3 && c3.length > 0 && c3.length <= a3.length) {
              if (c3.length === a3.length && c3 === a3) return "";
              var h = c3.length - 1, i = -1;
              for (d3 = a3.length - 1; d3 >= 0; --d3) {
                var j = a3.charCodeAt(d3);
                if (47 === j) {
                  if (!g) {
                    e = d3 + 1;
                    break;
                  }
                } else -1 === i && (g = false, i = d3 + 1), h >= 0 && (j === c3.charCodeAt(h) ? -1 == --h && (f = d3) : (h = -1, f = i));
              }
              return e === f ? f = i : -1 === f && (f = a3.length), a3.slice(e, f);
            }
            for (d3 = a3.length - 1; d3 >= 0; --d3) if (47 === a3.charCodeAt(d3)) {
              if (!g) {
                e = d3 + 1;
                break;
              }
            } else -1 === f && (g = false, f = d3 + 1);
            return -1 === f ? "" : a3.slice(e, f);
          }, extname: function(a3) {
            b2(a3);
            for (var c3 = -1, d3 = 0, e = -1, f = true, g = 0, h = a3.length - 1; h >= 0; --h) {
              var i = a3.charCodeAt(h);
              if (47 === i) {
                if (!f) {
                  d3 = h + 1;
                  break;
                }
                continue;
              }
              -1 === e && (f = false, e = h + 1), 46 === i ? -1 === c3 ? c3 = h : 1 !== g && (g = 1) : -1 !== c3 && (g = -1);
            }
            return -1 === c3 || -1 === e || 0 === g || 1 === g && c3 === e - 1 && c3 === d3 + 1 ? "" : a3.slice(c3, e);
          }, format: function(a3) {
            var b3, c3;
            if (null === a3 || "object" != typeof a3) throw TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof a3);
            return b3 = a3.dir || a3.root, c3 = a3.base || (a3.name || "") + (a3.ext || ""), b3 ? b3 === a3.root ? b3 + c3 : b3 + "/" + c3 : c3;
          }, parse: function(a3) {
            b2(a3);
            var c3, d3 = { root: "", dir: "", base: "", ext: "", name: "" };
            if (0 === a3.length) return d3;
            var e = a3.charCodeAt(0), f = 47 === e;
            f ? (d3.root = "/", c3 = 1) : c3 = 0;
            for (var g = -1, h = 0, i = -1, j = true, k = a3.length - 1, l = 0; k >= c3; --k) {
              if (47 === (e = a3.charCodeAt(k))) {
                if (!j) {
                  h = k + 1;
                  break;
                }
                continue;
              }
              -1 === i && (j = false, i = k + 1), 46 === e ? -1 === g ? g = k : 1 !== l && (l = 1) : -1 !== g && (l = -1);
            }
            return -1 === g || -1 === i || 0 === l || 1 === l && g === i - 1 && g === h + 1 ? -1 !== i && (0 === h && f ? d3.base = d3.name = a3.slice(1, i) : d3.base = d3.name = a3.slice(h, i)) : (0 === h && f ? (d3.name = a3.slice(1, g), d3.base = a3.slice(1, i)) : (d3.name = a3.slice(h, g), d3.base = a3.slice(h, i)), d3.ext = a3.slice(g, i)), h > 0 ? d3.dir = a3.slice(0, h - 1) : f && (d3.dir = "/"), d3;
          }, sep: "/", delimiter: ":", win32: null, posix: null };
          d2.posix = d2, a2.exports = d2;
        } }, c = {};
        function d(a2) {
          var e = c[a2];
          if (void 0 !== e) return e.exports;
          var f = c[a2] = { exports: {} }, g = true;
          try {
            b[a2](f, f.exports, d), g = false;
          } finally {
            g && delete c[a2];
          }
          return f.exports;
        }
        d.ab = "//", a.exports = d(431);
      }();
    }, 4120: (a, b, c) => {
      "use strict";
      var d = c(5356).Buffer;
      Object.defineProperty(b, "__esModule", { value: true });
      var e = { handleFetch: function() {
        return j;
      }, interceptFetch: function() {
        return k;
      }, reader: function() {
        return h;
      } };
      for (var f in e) Object.defineProperty(b, f, { enumerable: true, get: e[f] });
      let g = c(2681), h = { url: (a2) => a2.url, header: (a2, b2) => a2.headers.get(b2) };
      async function i(a2, b2) {
        let { url: c2, method: e2, headers: f2, body: g2, cache: h2, credentials: i2, integrity: j2, mode: k2, redirect: l, referrer: m, referrerPolicy: n } = b2;
        return { testData: a2, api: "fetch", request: { url: c2, method: e2, headers: [...Array.from(f2), ["next-test-stack", function() {
          let a3 = (Error().stack ?? "").split("\n");
          for (let b3 = 1; b3 < a3.length; b3++) if (a3[b3].length > 0) {
            a3 = a3.slice(b3);
            break;
          }
          return (a3 = (a3 = (a3 = a3.filter((a4) => !a4.includes("/next/dist/"))).slice(0, 5)).map((a4) => a4.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
        }()]], body: g2 ? d.from(await b2.arrayBuffer()).toString("base64") : null, cache: h2, credentials: i2, integrity: j2, mode: k2, redirect: l, referrer: m, referrerPolicy: n } };
      }
      async function j(a2, b2) {
        let c2 = (0, g.getTestReqInfo)(b2, h);
        if (!c2) return a2(b2);
        let { testData: e2, proxyPort: f2 } = c2, j2 = await i(e2, b2), k2 = await a2(`http://localhost:${f2}`, { method: "POST", body: JSON.stringify(j2), headers: { "next-test-internal": "1" }, next: { internal: true } });
        if (!k2.ok) throw Object.defineProperty(Error(`Proxy request failed: ${k2.status}`), "__NEXT_ERROR_CODE", { value: "E146", enumerable: false, configurable: true });
        let l = await k2.json(), { api: m } = l;
        switch (m) {
          case "continue":
            return a2(b2);
          case "abort":
          case "unhandled":
            throw Object.defineProperty(Error(`Proxy request aborted [${b2.method} ${b2.url}]`), "__NEXT_ERROR_CODE", { value: "E145", enumerable: false, configurable: true });
          case "fetch":
            return function(a3) {
              let { status: b3, headers: c3, body: e3 } = a3.response;
              return new Response(e3 ? d.from(e3, "base64") : null, { status: b3, headers: new Headers(c3) });
            }(l);
          default:
            return m;
        }
      }
      function k(a2) {
        return c.g.fetch = function(b2, c2) {
          var d2;
          return (null == c2 || null == (d2 = c2.next) ? void 0 : d2.internal) ? a2(b2, c2) : j(a2, new Request(b2, c2));
        }, () => {
          c.g.fetch = a2;
        };
      }
    }, 4308: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true }), b.unsafeStringify = void 0;
      let d = c(9293), e = [];
      for (let a2 = 0; a2 < 256; ++a2) e.push((a2 + 256).toString(16).slice(1));
      function f(a2, b2 = 0) {
        return (e[a2[b2 + 0]] + e[a2[b2 + 1]] + e[a2[b2 + 2]] + e[a2[b2 + 3]] + "-" + e[a2[b2 + 4]] + e[a2[b2 + 5]] + "-" + e[a2[b2 + 6]] + e[a2[b2 + 7]] + "-" + e[a2[b2 + 8]] + e[a2[b2 + 9]] + "-" + e[a2[b2 + 10]] + e[a2[b2 + 11]] + e[a2[b2 + 12]] + e[a2[b2 + 13]] + e[a2[b2 + 14]] + e[a2[b2 + 15]]).toLowerCase();
      }
      b.unsafeStringify = f, b.default = function(a2, b2 = 0) {
        let c2 = f(a2, b2);
        if (!(0, d.default)(c2)) throw TypeError("Stringified UUID is invalid");
        return c2;
      };
    }, 4738: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true }), b.updateV7State = void 0;
      let d = c(9344), e = c(4308), f = {};
      function g(a2, b2, c2) {
        return a2.msecs ??= -1 / 0, a2.seq ??= 0, b2 > a2.msecs ? (a2.seq = c2[6] << 23 | c2[7] << 16 | c2[8] << 8 | c2[9], a2.msecs = b2) : (a2.seq = a2.seq + 1 | 0, 0 === a2.seq && a2.msecs++), a2;
      }
      function h(a2, b2, c2, d2, e2 = 0) {
        if (a2.length < 16) throw Error("Random bytes length must be >= 16");
        if (d2) {
          if (e2 < 0 || e2 + 16 > d2.length) throw RangeError(`UUID byte range ${e2}:${e2 + 15} is out of buffer bounds`);
        } else d2 = new Uint8Array(16), e2 = 0;
        return b2 ??= Date.now(), c2 ??= 127 * a2[6] << 24 | a2[7] << 16 | a2[8] << 8 | a2[9], d2[e2++] = b2 / 1099511627776 & 255, d2[e2++] = b2 / 4294967296 & 255, d2[e2++] = b2 / 16777216 & 255, d2[e2++] = b2 / 65536 & 255, d2[e2++] = b2 / 256 & 255, d2[e2++] = 255 & b2, d2[e2++] = 112 | c2 >>> 28 & 15, d2[e2++] = c2 >>> 20 & 255, d2[e2++] = 128 | c2 >>> 14 & 63, d2[e2++] = c2 >>> 6 & 255, d2[e2++] = c2 << 2 & 255 | 3 & a2[10], d2[e2++] = a2[11], d2[e2++] = a2[12], d2[e2++] = a2[13], d2[e2++] = a2[14], d2[e2++] = a2[15], d2;
      }
      b.updateV7State = g, b.default = function(a2, b2, c2) {
        let i;
        if (a2) i = h(a2.random ?? a2.rng?.() ?? (0, d.default)(), a2.msecs, a2.seq, b2, c2);
        else {
          let a3 = Date.now(), e2 = (0, d.default)();
          g(f, a3, e2), i = h(e2, f.msecs, f.seq, b2, c2);
        }
        return b2 ?? (0, e.unsafeStringify)(i);
      };
    }, 4796: (a, b, c) => {
      "use strict";
      c.d(b, { Z: () => d });
      let d = (0, c(7788).xl)();
    }, 5082: (a, b) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true }), b.default = function(a2) {
        var b2;
        let c = new URL("http://localhost:3000/api/auth");
        a2 && !a2.startsWith("http") && (a2 = `https://${a2}`);
        let d = new URL(null != (b2 = a2) ? b2 : c), e = ("/" === d.pathname ? c.pathname : d.pathname).replace(/\/$/, ""), f = `${d.origin}${e}`;
        return { origin: d.origin, host: d.host, path: e, base: f, toString: () => f };
      };
    }, 5313: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true });
      let d = c(254), e = c(9344), f = c(4308);
      b.default = function(a2, b2, c2) {
        if (d.default.randomUUID && !b2 && !a2) return d.default.randomUUID();
        let g = (a2 = a2 || {}).random ?? a2.rng?.() ?? (0, e.default)();
        if (g.length < 16) throw Error("Random bytes length must be >= 16");
        if (g[6] = 15 & g[6] | 64, g[8] = 63 & g[8] | 128, b2) {
          if ((c2 = c2 || 0) < 0 || c2 + 16 > b2.length) throw RangeError(`UUID byte range ${c2}:${c2 + 15} is out of buffer bounds`);
          for (let a3 = 0; a3 < 16; ++a3) b2[c2 + a3] = g[a3];
          return b2;
        }
        return (0, f.unsafeStringify)(g);
      };
    }, 5356: (a) => {
      "use strict";
      a.exports = (init_node_buffer(), __toCommonJS(node_buffer_exports));
    }, 5521: (a) => {
      "use strict";
      a.exports = (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports));
    }, 5808: (a, b, c) => {
      var d, e = { 943: function(e2, f2) {
        !function(g2) {
          "use strict";
          var h = "function", i = "undefined", j = "object", k = "string", l = "major", m = "model", n = "name", o = "type", p = "vendor", q = "version", r = "architecture", s = "console", t = "mobile", u = "tablet", v = "smarttv", w = "wearable", x = "embedded", y = "Amazon", z = "Apple", A = "ASUS", B = "BlackBerry", C = "Browser", D = "Chrome", E = "Firefox", F = "Google", G = "Huawei", H = "Microsoft", I = "Motorola", J = "Opera", K = "Samsung", L = "Sharp", M = "Sony", N = "Xiaomi", O = "Zebra", P = "Facebook", Q = "Chromium OS", R = "Mac OS", S = function(a2, b2) {
            var c2 = {};
            for (var d2 in a2) b2[d2] && b2[d2].length % 2 == 0 ? c2[d2] = b2[d2].concat(a2[d2]) : c2[d2] = a2[d2];
            return c2;
          }, T = function(a2) {
            for (var b2 = {}, c2 = 0; c2 < a2.length; c2++) b2[a2[c2].toUpperCase()] = a2[c2];
            return b2;
          }, U = function(a2, b2) {
            return typeof a2 === k && -1 !== V(b2).indexOf(V(a2));
          }, V = function(a2) {
            return a2.toLowerCase();
          }, W = function(a2, b2) {
            if (typeof a2 === k) return a2 = a2.replace(/^\s\s*/, ""), typeof b2 === i ? a2 : a2.substring(0, 350);
          }, X = function(a2, b2) {
            for (var c2, d2, e3, f3, g3, i2, k2 = 0; k2 < b2.length && !g3; ) {
              var l2 = b2[k2], m2 = b2[k2 + 1];
              for (c2 = d2 = 0; c2 < l2.length && !g3 && l2[c2]; ) if (g3 = l2[c2++].exec(a2)) for (e3 = 0; e3 < m2.length; e3++) i2 = g3[++d2], typeof (f3 = m2[e3]) === j && f3.length > 0 ? 2 === f3.length ? typeof f3[1] == h ? this[f3[0]] = f3[1].call(this, i2) : this[f3[0]] = f3[1] : 3 === f3.length ? typeof f3[1] !== h || f3[1].exec && f3[1].test ? this[f3[0]] = i2 ? i2.replace(f3[1], f3[2]) : void 0 : this[f3[0]] = i2 ? f3[1].call(this, i2, f3[2]) : void 0 : 4 === f3.length && (this[f3[0]] = i2 ? f3[3].call(this, i2.replace(f3[1], f3[2])) : void 0) : this[f3] = i2 || void 0;
              k2 += 2;
            }
          }, Y = function(a2, b2) {
            for (var c2 in b2) if (typeof b2[c2] === j && b2[c2].length > 0) {
              for (var d2 = 0; d2 < b2[c2].length; d2++) if (U(b2[c2][d2], a2)) return "?" === c2 ? void 0 : c2;
            } else if (U(b2[c2], a2)) return "?" === c2 ? void 0 : c2;
            return a2;
          }, Z = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, $ = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [q, [n, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [q, [n, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [n, q], [/opios[\/ ]+([\w\.]+)/i], [q, [n, J + " Mini"]], [/\bopr\/([\w\.]+)/i], [q, [n, J]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [n, q], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [q, [n, "UC" + C]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [q, [n, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [q, [n, "WeChat"]], [/konqueror\/([\w\.]+)/i], [q, [n, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [q, [n, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [q, [n, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[n, /(.+)/, "$1 Secure " + C], q], [/\bfocus\/([\w\.]+)/i], [q, [n, E + " Focus"]], [/\bopt\/([\w\.]+)/i], [q, [n, J + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [q, [n, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [q, [n, "Dolphin"]], [/coast\/([\w\.]+)/i], [q, [n, J + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [q, [n, "MIUI " + C]], [/fxios\/([-\w\.]+)/i], [q, [n, E]], [/\bqihu|(qi?ho?o?|360)browser/i], [[n, "360 " + C]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[n, /(.+)/, "$1 " + C], q], [/(comodo_dragon)\/([\w\.]+)/i], [[n, /_/g, " "], q], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [n, q], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [n], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[n, P], q], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [n, q], [/\bgsa\/([\w\.]+) .*safari\//i], [q, [n, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [q, [n, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [q, [n, D + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[n, D + " WebView"], q], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [q, [n, "Android " + C]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [n, q], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [q, [n, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [q, n], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [n, [q, Y, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [n, q], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[n, "Netscape"], q], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [q, [n, E + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [n, q], [/(cobalt)\/([\w\.]+)/i], [n, [q, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[r, "amd64"]], [/(ia32(?=;))/i], [[r, V]], [/((?:i[346]|x)86)[;\)]/i], [[r, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[r, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[r, "armhf"]], [/windows (ce|mobile); ppc;/i], [[r, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[r, /ower/, "", V]], [/(sun4\w)[;\)]/i], [[r, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[r, V]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [m, [p, K], [o, u]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [m, [p, K], [o, t]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [m, [p, z], [o, t]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [m, [p, z], [o, u]], [/(macintosh);/i], [m, [p, z]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [m, [p, L], [o, t]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [m, [p, G], [o, u]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [m, [p, G], [o, t]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[m, /_/g, " "], [p, N], [o, t]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[m, /_/g, " "], [p, N], [o, u]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [m, [p, "OPPO"], [o, t]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [m, [p, "Vivo"], [o, t]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [m, [p, "Realme"], [o, t]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [m, [p, I], [o, t]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [m, [p, I], [o, u]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [m, [p, "LG"], [o, u]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [m, [p, "LG"], [o, t]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [m, [p, "Lenovo"], [o, u]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[m, /_/g, " "], [p, "Nokia"], [o, t]], [/(pixel c)\b/i], [m, [p, F], [o, u]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [m, [p, F], [o, t]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [m, [p, M], [o, t]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[m, "Xperia Tablet"], [p, M], [o, u]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [m, [p, "OnePlus"], [o, t]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [m, [p, y], [o, u]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[m, /(.+)/g, "Fire Phone $1"], [p, y], [o, t]], [/(playbook);[-\w\),; ]+(rim)/i], [m, p, [o, u]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [m, [p, B], [o, t]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [m, [p, A], [o, u]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [m, [p, A], [o, t]], [/(nexus 9)/i], [m, [p, "HTC"], [o, u]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [p, [m, /_/g, " "], [o, t]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [m, [p, "Acer"], [o, u]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [m, [p, "Meizu"], [o, t]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [p, m, [o, t]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [p, m, [o, u]], [/(surface duo)/i], [m, [p, H], [o, u]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [m, [p, "Fairphone"], [o, t]], [/(u304aa)/i], [m, [p, "AT&T"], [o, t]], [/\bsie-(\w*)/i], [m, [p, "Siemens"], [o, t]], [/\b(rct\w+) b/i], [m, [p, "RCA"], [o, u]], [/\b(venue[\d ]{2,7}) b/i], [m, [p, "Dell"], [o, u]], [/\b(q(?:mv|ta)\w+) b/i], [m, [p, "Verizon"], [o, u]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [m, [p, "Barnes & Noble"], [o, u]], [/\b(tm\d{3}\w+) b/i], [m, [p, "NuVision"], [o, u]], [/\b(k88) b/i], [m, [p, "ZTE"], [o, u]], [/\b(nx\d{3}j) b/i], [m, [p, "ZTE"], [o, t]], [/\b(gen\d{3}) b.+49h/i], [m, [p, "Swiss"], [o, t]], [/\b(zur\d{3}) b/i], [m, [p, "Swiss"], [o, u]], [/\b((zeki)?tb.*\b) b/i], [m, [p, "Zeki"], [o, u]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[p, "Dragon Touch"], m, [o, u]], [/\b(ns-?\w{0,9}) b/i], [m, [p, "Insignia"], [o, u]], [/\b((nxa|next)-?\w{0,9}) b/i], [m, [p, "NextBook"], [o, u]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[p, "Voice"], m, [o, t]], [/\b(lvtel\-)?(v1[12]) b/i], [[p, "LvTel"], m, [o, t]], [/\b(ph-1) /i], [m, [p, "Essential"], [o, t]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [m, [p, "Envizen"], [o, u]], [/\b(trio[-\w\. ]+) b/i], [m, [p, "MachSpeed"], [o, u]], [/\btu_(1491) b/i], [m, [p, "Rotor"], [o, u]], [/(shield[\w ]+) b/i], [m, [p, "Nvidia"], [o, u]], [/(sprint) (\w+)/i], [p, m, [o, t]], [/(kin\.[onetw]{3})/i], [[m, /\./g, " "], [p, H], [o, t]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [m, [p, O], [o, u]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [m, [p, O], [o, t]], [/smart-tv.+(samsung)/i], [p, [o, v]], [/hbbtv.+maple;(\d+)/i], [[m, /^/, "SmartTV"], [p, K], [o, v]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[p, "LG"], [o, v]], [/(apple) ?tv/i], [p, [m, z + " TV"], [o, v]], [/crkey/i], [[m, D + "cast"], [p, F], [o, v]], [/droid.+aft(\w)( bui|\))/i], [m, [p, y], [o, v]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [m, [p, L], [o, v]], [/(bravia[\w ]+)( bui|\))/i], [m, [p, M], [o, v]], [/(mitv-\w{5}) bui/i], [m, [p, N], [o, v]], [/Hbbtv.*(technisat) (.*);/i], [p, m, [o, v]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[p, W], [m, W], [o, v]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[o, v]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [p, m, [o, s]], [/droid.+; (shield) bui/i], [m, [p, "Nvidia"], [o, s]], [/(playstation [345portablevi]+)/i], [m, [p, M], [o, s]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [m, [p, H], [o, s]], [/((pebble))app/i], [p, m, [o, w]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [m, [p, z], [o, w]], [/droid.+; (glass) \d/i], [m, [p, F], [o, w]], [/droid.+; (wt63?0{2,3})\)/i], [m, [p, O], [o, w]], [/(quest( 2| pro)?)/i], [m, [p, P], [o, w]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [p, [o, x]], [/(aeobc)\b/i], [m, [p, y], [o, x]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [m, [o, t]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [m, [o, u]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[o, u]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[o, t]], [/(android[-\w\. ]{0,9});.+buil/i], [m, [p, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [q, [n, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [q, [n, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [n, q], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [q, n]], os: [[/microsoft (windows) (vista|xp)/i], [n, q], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [n, [q, Y, Z]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[n, "Windows"], [q, Y, Z]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[q, /_/g, "."], [n, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[n, R], [q, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [q, n], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [n, q], [/\(bb(10);/i], [q, [n, B]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [q, [n, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [q, [n, E + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [q, [n, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [q, [n, "watchOS"]], [/crkey\/([\d\.]+)/i], [q, [n, D + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[n, Q], q], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [n, q], [/(sunos) ?([\w\.\d]*)/i], [[n, "Solaris"], q], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [n, q]] }, _ = function(a2, b2) {
            if (typeof a2 === j && (b2 = a2, a2 = void 0), !(this instanceof _)) return new _(a2, b2).getResult();
            var c2 = typeof g2 !== i && g2.navigator ? g2.navigator : void 0, d2 = a2 || (c2 && c2.userAgent ? c2.userAgent : ""), e3 = c2 && c2.userAgentData ? c2.userAgentData : void 0, f3 = b2 ? S($, b2) : $, s2 = c2 && c2.userAgent == d2;
            return this.getBrowser = function() {
              var a3, b3 = {};
              return b3[n] = void 0, b3[q] = void 0, X.call(b3, d2, f3.browser), b3[l] = typeof (a3 = b3[q]) === k ? a3.replace(/[^\d\.]/g, "").split(".")[0] : void 0, s2 && c2 && c2.brave && typeof c2.brave.isBrave == h && (b3[n] = "Brave"), b3;
            }, this.getCPU = function() {
              var a3 = {};
              return a3[r] = void 0, X.call(a3, d2, f3.cpu), a3;
            }, this.getDevice = function() {
              var a3 = {};
              return a3[p] = void 0, a3[m] = void 0, a3[o] = void 0, X.call(a3, d2, f3.device), s2 && !a3[o] && e3 && e3.mobile && (a3[o] = t), s2 && "Macintosh" == a3[m] && c2 && typeof c2.standalone !== i && c2.maxTouchPoints && c2.maxTouchPoints > 2 && (a3[m] = "iPad", a3[o] = u), a3;
            }, this.getEngine = function() {
              var a3 = {};
              return a3[n] = void 0, a3[q] = void 0, X.call(a3, d2, f3.engine), a3;
            }, this.getOS = function() {
              var a3 = {};
              return a3[n] = void 0, a3[q] = void 0, X.call(a3, d2, f3.os), s2 && !a3[n] && e3 && "Unknown" != e3.platform && (a3[n] = e3.platform.replace(/chrome os/i, Q).replace(/macos/i, R)), a3;
            }, this.getResult = function() {
              return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
            }, this.getUA = function() {
              return d2;
            }, this.setUA = function(a3) {
              return d2 = typeof a3 === k && a3.length > 350 ? W(a3, 350) : a3, this;
            }, this.setUA(d2), this;
          };
          _.VERSION = "1.0.35", _.BROWSER = T([n, q, l]), _.CPU = T([r]), _.DEVICE = T([m, p, o, s, t, v, u, w, x]), _.ENGINE = _.OS = T([n, q]), typeof f2 !== i ? (e2.exports && (f2 = e2.exports = _), f2.UAParser = _) : c.amdO ? void 0 === (d = function() {
            return _;
          }.call(b, c, b, a)) || (a.exports = d) : typeof g2 !== i && (g2.UAParser = _);
          var aa = typeof g2 !== i && (g2.jQuery || g2.Zepto);
          if (aa && !aa.ua) {
            var ab = new _();
            aa.ua = ab.getResult(), aa.ua.get = function() {
              return ab.getUA();
            }, aa.ua.set = function(a2) {
              ab.setUA(a2);
              var b2 = ab.getResult();
              for (var c2 in b2) aa.ua[c2] = b2[c2];
            };
          }
        }("object" == typeof window ? window : this);
      } }, f = {};
      function g(a2) {
        var b2 = f[a2];
        if (void 0 !== b2) return b2.exports;
        var c2 = f[a2] = { exports: {} }, d2 = true;
        try {
          e[a2].call(c2.exports, c2, c2.exports, g), d2 = false;
        } finally {
          d2 && delete f[a2];
        }
        return c2.exports;
      }
      g.ab = "//", a.exports = g(943);
    }, 5824: (a, b, c) => {
      "use strict";
      a.exports = c(4056);
    }, 6076: (a, b, c) => {
      (() => {
        "use strict";
        let b2, d, e, f, g;
        var h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x = { 912: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.ContextAPI = void 0;
          let d2 = c2(108), e2 = c2(221), f2 = c2(44), g2 = "context", h2 = new d2.NoopContextManager();
          class i2 {
            static getInstance() {
              return this._instance || (this._instance = new i2()), this._instance;
            }
            setGlobalContextManager(a3) {
              return (0, e2.registerGlobal)(g2, a3, f2.DiagAPI.instance());
            }
            active() {
              return this._getContextManager().active();
            }
            with(a3, b4, c3, ...d3) {
              return this._getContextManager().with(a3, b4, c3, ...d3);
            }
            bind(a3, b4) {
              return this._getContextManager().bind(a3, b4);
            }
            _getContextManager() {
              return (0, e2.getGlobal)(g2) || h2;
            }
            disable() {
              this._getContextManager().disable(), (0, e2.unregisterGlobal)(g2, f2.DiagAPI.instance());
            }
          }
          b3.ContextAPI = i2;
        }, 44: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.DiagAPI = void 0;
          let d2 = c2(757), e2 = c2(412), f2 = c2(711), g2 = c2(221);
          class h2 {
            constructor() {
              function a3(a4) {
                return function(...b5) {
                  let c3 = (0, g2.getGlobal)("diag");
                  if (c3) return c3[a4](...b5);
                };
              }
              const b4 = this;
              b4.setLogger = (a4, c3 = { logLevel: f2.DiagLogLevel.INFO }) => {
                var d3, h3, i2;
                if (a4 === b4) {
                  let a5 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                  return b4.error(null != (d3 = a5.stack) ? d3 : a5.message), false;
                }
                "number" == typeof c3 && (c3 = { logLevel: c3 });
                let j2 = (0, g2.getGlobal)("diag"), k2 = (0, e2.createLogLevelDiagLogger)(null != (h3 = c3.logLevel) ? h3 : f2.DiagLogLevel.INFO, a4);
                if (j2 && !c3.suppressOverrideMessage) {
                  let a5 = null != (i2 = Error().stack) ? i2 : "<failed to generate stacktrace>";
                  j2.warn(`Current logger will be overwritten from ${a5}`), k2.warn(`Current logger will overwrite one already registered from ${a5}`);
                }
                return (0, g2.registerGlobal)("diag", k2, b4, true);
              }, b4.disable = () => {
                (0, g2.unregisterGlobal)("diag", b4);
              }, b4.createComponentLogger = (a4) => new d2.DiagComponentLogger(a4), b4.verbose = a3("verbose"), b4.debug = a3("debug"), b4.info = a3("info"), b4.warn = a3("warn"), b4.error = a3("error");
            }
            static instance() {
              return this._instance || (this._instance = new h2()), this._instance;
            }
          }
          b3.DiagAPI = h2;
        }, 262: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.MetricsAPI = void 0;
          let d2 = c2(586), e2 = c2(221), f2 = c2(44), g2 = "metrics";
          class h2 {
            static getInstance() {
              return this._instance || (this._instance = new h2()), this._instance;
            }
            setGlobalMeterProvider(a3) {
              return (0, e2.registerGlobal)(g2, a3, f2.DiagAPI.instance());
            }
            getMeterProvider() {
              return (0, e2.getGlobal)(g2) || d2.NOOP_METER_PROVIDER;
            }
            getMeter(a3, b4, c3) {
              return this.getMeterProvider().getMeter(a3, b4, c3);
            }
            disable() {
              (0, e2.unregisterGlobal)(g2, f2.DiagAPI.instance());
            }
          }
          b3.MetricsAPI = h2;
        }, 25: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.PropagationAPI = void 0;
          let d2 = c2(221), e2 = c2(19), f2 = c2(92), g2 = c2(398), h2 = c2(504), i2 = c2(44), j2 = "propagation", k2 = new e2.NoopTextMapPropagator();
          class l2 {
            constructor() {
              this.createBaggage = h2.createBaggage, this.getBaggage = g2.getBaggage, this.getActiveBaggage = g2.getActiveBaggage, this.setBaggage = g2.setBaggage, this.deleteBaggage = g2.deleteBaggage;
            }
            static getInstance() {
              return this._instance || (this._instance = new l2()), this._instance;
            }
            setGlobalPropagator(a3) {
              return (0, d2.registerGlobal)(j2, a3, i2.DiagAPI.instance());
            }
            inject(a3, b4, c3 = f2.defaultTextMapSetter) {
              return this._getGlobalPropagator().inject(a3, b4, c3);
            }
            extract(a3, b4, c3 = f2.defaultTextMapGetter) {
              return this._getGlobalPropagator().extract(a3, b4, c3);
            }
            fields() {
              return this._getGlobalPropagator().fields();
            }
            disable() {
              (0, d2.unregisterGlobal)(j2, i2.DiagAPI.instance());
            }
            _getGlobalPropagator() {
              return (0, d2.getGlobal)(j2) || k2;
            }
          }
          b3.PropagationAPI = l2;
        }, 397: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.TraceAPI = void 0;
          let d2 = c2(221), e2 = c2(498), f2 = c2(477), g2 = c2(793), h2 = c2(44), i2 = "trace";
          class j2 {
            constructor() {
              this._proxyTracerProvider = new e2.ProxyTracerProvider(), this.wrapSpanContext = f2.wrapSpanContext, this.isSpanContextValid = f2.isSpanContextValid, this.deleteSpan = g2.deleteSpan, this.getSpan = g2.getSpan, this.getActiveSpan = g2.getActiveSpan, this.getSpanContext = g2.getSpanContext, this.setSpan = g2.setSpan, this.setSpanContext = g2.setSpanContext;
            }
            static getInstance() {
              return this._instance || (this._instance = new j2()), this._instance;
            }
            setGlobalTracerProvider(a3) {
              let b4 = (0, d2.registerGlobal)(i2, this._proxyTracerProvider, h2.DiagAPI.instance());
              return b4 && this._proxyTracerProvider.setDelegate(a3), b4;
            }
            getTracerProvider() {
              return (0, d2.getGlobal)(i2) || this._proxyTracerProvider;
            }
            getTracer(a3, b4) {
              return this.getTracerProvider().getTracer(a3, b4);
            }
            disable() {
              (0, d2.unregisterGlobal)(i2, h2.DiagAPI.instance()), this._proxyTracerProvider = new e2.ProxyTracerProvider();
            }
          }
          b3.TraceAPI = j2;
        }, 398: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.deleteBaggage = b3.setBaggage = b3.getActiveBaggage = b3.getBaggage = void 0;
          let d2 = c2(912), e2 = (0, c2(23).createContextKey)("OpenTelemetry Baggage Key");
          function f2(a3) {
            return a3.getValue(e2) || void 0;
          }
          b3.getBaggage = f2, b3.getActiveBaggage = function() {
            return f2(d2.ContextAPI.getInstance().active());
          }, b3.setBaggage = function(a3, b4) {
            return a3.setValue(e2, b4);
          }, b3.deleteBaggage = function(a3) {
            return a3.deleteValue(e2);
          };
        }, 152: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.BaggageImpl = void 0;
          class c2 {
            constructor(a3) {
              this._entries = a3 ? new Map(a3) : /* @__PURE__ */ new Map();
            }
            getEntry(a3) {
              let b4 = this._entries.get(a3);
              if (b4) return Object.assign({}, b4);
            }
            getAllEntries() {
              return Array.from(this._entries.entries()).map(([a3, b4]) => [a3, b4]);
            }
            setEntry(a3, b4) {
              let d2 = new c2(this._entries);
              return d2._entries.set(a3, b4), d2;
            }
            removeEntry(a3) {
              let b4 = new c2(this._entries);
              return b4._entries.delete(a3), b4;
            }
            removeEntries(...a3) {
              let b4 = new c2(this._entries);
              for (let c3 of a3) b4._entries.delete(c3);
              return b4;
            }
            clear() {
              return new c2();
            }
          }
          b3.BaggageImpl = c2;
        }, 647: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.baggageEntryMetadataSymbol = void 0, b3.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
        }, 504: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.baggageEntryMetadataFromString = b3.createBaggage = void 0;
          let d2 = c2(44), e2 = c2(152), f2 = c2(647), g2 = d2.DiagAPI.instance();
          b3.createBaggage = function(a3 = {}) {
            return new e2.BaggageImpl(new Map(Object.entries(a3)));
          }, b3.baggageEntryMetadataFromString = function(a3) {
            return "string" != typeof a3 && (g2.error(`Cannot create baggage metadata from unknown type: ${typeof a3}`), a3 = ""), { __TYPE__: f2.baggageEntryMetadataSymbol, toString: () => a3 };
          };
        }, 778: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.context = void 0, b3.context = c2(912).ContextAPI.getInstance();
        }, 108: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NoopContextManager = void 0;
          let d2 = c2(23);
          class e2 {
            active() {
              return d2.ROOT_CONTEXT;
            }
            with(a3, b4, c3, ...d3) {
              return b4.call(c3, ...d3);
            }
            bind(a3, b4) {
              return b4;
            }
            enable() {
              return this;
            }
            disable() {
              return this;
            }
          }
          b3.NoopContextManager = e2;
        }, 23: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.ROOT_CONTEXT = b3.createContextKey = void 0, b3.createContextKey = function(a3) {
            return Symbol.for(a3);
          };
          class c2 {
            constructor(a3) {
              const b4 = this;
              b4._currentContext = a3 ? new Map(a3) : /* @__PURE__ */ new Map(), b4.getValue = (a4) => b4._currentContext.get(a4), b4.setValue = (a4, d2) => {
                let e2 = new c2(b4._currentContext);
                return e2._currentContext.set(a4, d2), e2;
              }, b4.deleteValue = (a4) => {
                let d2 = new c2(b4._currentContext);
                return d2._currentContext.delete(a4), d2;
              };
            }
          }
          b3.ROOT_CONTEXT = new c2();
        }, 304: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.diag = void 0, b3.diag = c2(44).DiagAPI.instance();
        }, 757: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.DiagComponentLogger = void 0;
          let d2 = c2(221);
          class e2 {
            constructor(a3) {
              this._namespace = a3.namespace || "DiagComponentLogger";
            }
            debug(...a3) {
              return f2("debug", this._namespace, a3);
            }
            error(...a3) {
              return f2("error", this._namespace, a3);
            }
            info(...a3) {
              return f2("info", this._namespace, a3);
            }
            warn(...a3) {
              return f2("warn", this._namespace, a3);
            }
            verbose(...a3) {
              return f2("verbose", this._namespace, a3);
            }
          }
          function f2(a3, b4, c3) {
            let e3 = (0, d2.getGlobal)("diag");
            if (e3) return c3.unshift(b4), e3[a3](...c3);
          }
          b3.DiagComponentLogger = e2;
        }, 83: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.DiagConsoleLogger = void 0;
          let c2 = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }];
          class d2 {
            constructor() {
              for (let a3 = 0; a3 < c2.length; a3++) this[c2[a3].n] = /* @__PURE__ */ function(a4) {
                return function(...b4) {
                  if (console) {
                    let c3 = console[a4];
                    if ("function" != typeof c3 && (c3 = console.log), "function" == typeof c3) return c3.apply(console, b4);
                  }
                };
              }(c2[a3].c);
            }
          }
          b3.DiagConsoleLogger = d2;
        }, 412: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.createLogLevelDiagLogger = void 0;
          let d2 = c2(711);
          b3.createLogLevelDiagLogger = function(a3, b4) {
            function c3(c4, d3) {
              let e2 = b4[c4];
              return "function" == typeof e2 && a3 >= d3 ? e2.bind(b4) : function() {
              };
            }
            return a3 < d2.DiagLogLevel.NONE ? a3 = d2.DiagLogLevel.NONE : a3 > d2.DiagLogLevel.ALL && (a3 = d2.DiagLogLevel.ALL), b4 = b4 || {}, { error: c3("error", d2.DiagLogLevel.ERROR), warn: c3("warn", d2.DiagLogLevel.WARN), info: c3("info", d2.DiagLogLevel.INFO), debug: c3("debug", d2.DiagLogLevel.DEBUG), verbose: c3("verbose", d2.DiagLogLevel.VERBOSE) };
          };
        }, 711: (a2, b3) => {
          var c2;
          Object.defineProperty(b3, "__esModule", { value: true }), b3.DiagLogLevel = void 0, (c2 = b3.DiagLogLevel || (b3.DiagLogLevel = {}))[c2.NONE = 0] = "NONE", c2[c2.ERROR = 30] = "ERROR", c2[c2.WARN = 50] = "WARN", c2[c2.INFO = 60] = "INFO", c2[c2.DEBUG = 70] = "DEBUG", c2[c2.VERBOSE = 80] = "VERBOSE", c2[c2.ALL = 9999] = "ALL";
        }, 221: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.unregisterGlobal = b3.getGlobal = b3.registerGlobal = void 0;
          let d2 = c2(678), e2 = c2(652), f2 = c2(662), g2 = e2.VERSION.split(".")[0], h2 = Symbol.for(`opentelemetry.js.api.${g2}`), i2 = d2._globalThis;
          b3.registerGlobal = function(a3, b4, c3, d3 = false) {
            var f3;
            let g3 = i2[h2] = null != (f3 = i2[h2]) ? f3 : { version: e2.VERSION };
            if (!d3 && g3[a3]) {
              let b5 = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${a3}`);
              return c3.error(b5.stack || b5.message), false;
            }
            if (g3.version !== e2.VERSION) {
              let b5 = Error(`@opentelemetry/api: Registration of version v${g3.version} for ${a3} does not match previously registered API v${e2.VERSION}`);
              return c3.error(b5.stack || b5.message), false;
            }
            return g3[a3] = b4, c3.debug(`@opentelemetry/api: Registered a global for ${a3} v${e2.VERSION}.`), true;
          }, b3.getGlobal = function(a3) {
            var b4, c3;
            let d3 = null == (b4 = i2[h2]) ? void 0 : b4.version;
            if (d3 && (0, f2.isCompatible)(d3)) return null == (c3 = i2[h2]) ? void 0 : c3[a3];
          }, b3.unregisterGlobal = function(a3, b4) {
            b4.debug(`@opentelemetry/api: Unregistering a global for ${a3} v${e2.VERSION}.`);
            let c3 = i2[h2];
            c3 && delete c3[a3];
          };
        }, 662: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.isCompatible = b3._makeCompatibilityCheck = void 0;
          let d2 = c2(652), e2 = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
          function f2(a3) {
            let b4 = /* @__PURE__ */ new Set([a3]), c3 = /* @__PURE__ */ new Set(), d3 = a3.match(e2);
            if (!d3) return () => false;
            let f3 = { major: +d3[1], minor: +d3[2], patch: +d3[3], prerelease: d3[4] };
            if (null != f3.prerelease) return function(b5) {
              return b5 === a3;
            };
            function g2(a4) {
              return c3.add(a4), false;
            }
            return function(a4) {
              if (b4.has(a4)) return true;
              if (c3.has(a4)) return false;
              let d4 = a4.match(e2);
              if (!d4) return g2(a4);
              let h2 = { major: +d4[1], minor: +d4[2], patch: +d4[3], prerelease: d4[4] };
              if (null != h2.prerelease || f3.major !== h2.major) return g2(a4);
              if (0 === f3.major) return f3.minor === h2.minor && f3.patch <= h2.patch ? (b4.add(a4), true) : g2(a4);
              return f3.minor <= h2.minor ? (b4.add(a4), true) : g2(a4);
            };
          }
          b3._makeCompatibilityCheck = f2, b3.isCompatible = f2(d2.VERSION);
        }, 120: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.metrics = void 0, b3.metrics = c2(262).MetricsAPI.getInstance();
        }, 532: (a2, b3) => {
          var c2;
          Object.defineProperty(b3, "__esModule", { value: true }), b3.ValueType = void 0, (c2 = b3.ValueType || (b3.ValueType = {}))[c2.INT = 0] = "INT", c2[c2.DOUBLE = 1] = "DOUBLE";
        }, 440: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.createNoopMeter = b3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = b3.NOOP_OBSERVABLE_GAUGE_METRIC = b3.NOOP_OBSERVABLE_COUNTER_METRIC = b3.NOOP_UP_DOWN_COUNTER_METRIC = b3.NOOP_HISTOGRAM_METRIC = b3.NOOP_COUNTER_METRIC = b3.NOOP_METER = b3.NoopObservableUpDownCounterMetric = b3.NoopObservableGaugeMetric = b3.NoopObservableCounterMetric = b3.NoopObservableMetric = b3.NoopHistogramMetric = b3.NoopUpDownCounterMetric = b3.NoopCounterMetric = b3.NoopMetric = b3.NoopMeter = void 0;
          class c2 {
            createHistogram(a3, c3) {
              return b3.NOOP_HISTOGRAM_METRIC;
            }
            createCounter(a3, c3) {
              return b3.NOOP_COUNTER_METRIC;
            }
            createUpDownCounter(a3, c3) {
              return b3.NOOP_UP_DOWN_COUNTER_METRIC;
            }
            createObservableGauge(a3, c3) {
              return b3.NOOP_OBSERVABLE_GAUGE_METRIC;
            }
            createObservableCounter(a3, c3) {
              return b3.NOOP_OBSERVABLE_COUNTER_METRIC;
            }
            createObservableUpDownCounter(a3, c3) {
              return b3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
            }
            addBatchObservableCallback(a3, b4) {
            }
            removeBatchObservableCallback(a3) {
            }
          }
          b3.NoopMeter = c2;
          class d2 {
          }
          b3.NoopMetric = d2;
          class e2 extends d2 {
            add(a3, b4) {
            }
          }
          b3.NoopCounterMetric = e2;
          class f2 extends d2 {
            add(a3, b4) {
            }
          }
          b3.NoopUpDownCounterMetric = f2;
          class g2 extends d2 {
            record(a3, b4) {
            }
          }
          b3.NoopHistogramMetric = g2;
          class h2 {
            addCallback(a3) {
            }
            removeCallback(a3) {
            }
          }
          b3.NoopObservableMetric = h2;
          class i2 extends h2 {
          }
          b3.NoopObservableCounterMetric = i2;
          class j2 extends h2 {
          }
          b3.NoopObservableGaugeMetric = j2;
          class k2 extends h2 {
          }
          b3.NoopObservableUpDownCounterMetric = k2, b3.NOOP_METER = new c2(), b3.NOOP_COUNTER_METRIC = new e2(), b3.NOOP_HISTOGRAM_METRIC = new g2(), b3.NOOP_UP_DOWN_COUNTER_METRIC = new f2(), b3.NOOP_OBSERVABLE_COUNTER_METRIC = new i2(), b3.NOOP_OBSERVABLE_GAUGE_METRIC = new j2(), b3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new k2(), b3.createNoopMeter = function() {
            return b3.NOOP_METER;
          };
        }, 586: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NOOP_METER_PROVIDER = b3.NoopMeterProvider = void 0;
          let d2 = c2(440);
          class e2 {
            getMeter(a3, b4, c3) {
              return d2.NOOP_METER;
            }
          }
          b3.NoopMeterProvider = e2, b3.NOOP_METER_PROVIDER = new e2();
        }, 678: function(a2, b3, c2) {
          var d2 = this && this.__createBinding || (Object.create ? function(a3, b4, c3, d3) {
            void 0 === d3 && (d3 = c3), Object.defineProperty(a3, d3, { enumerable: true, get: function() {
              return b4[c3];
            } });
          } : function(a3, b4, c3, d3) {
            void 0 === d3 && (d3 = c3), a3[d3] = b4[c3];
          }), e2 = this && this.__exportStar || function(a3, b4) {
            for (var c3 in a3) "default" === c3 || Object.prototype.hasOwnProperty.call(b4, c3) || d2(b4, a3, c3);
          };
          Object.defineProperty(b3, "__esModule", { value: true }), e2(c2(59), b3);
        }, 460: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3._globalThis = void 0, b3._globalThis = "object" == typeof globalThis ? globalThis : c.g;
        }, 59: function(a2, b3, c2) {
          var d2 = this && this.__createBinding || (Object.create ? function(a3, b4, c3, d3) {
            void 0 === d3 && (d3 = c3), Object.defineProperty(a3, d3, { enumerable: true, get: function() {
              return b4[c3];
            } });
          } : function(a3, b4, c3, d3) {
            void 0 === d3 && (d3 = c3), a3[d3] = b4[c3];
          }), e2 = this && this.__exportStar || function(a3, b4) {
            for (var c3 in a3) "default" === c3 || Object.prototype.hasOwnProperty.call(b4, c3) || d2(b4, a3, c3);
          };
          Object.defineProperty(b3, "__esModule", { value: true }), e2(c2(460), b3);
        }, 27: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.propagation = void 0, b3.propagation = c2(25).PropagationAPI.getInstance();
        }, 19: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NoopTextMapPropagator = void 0;
          class c2 {
            inject(a3, b4) {
            }
            extract(a3, b4) {
              return a3;
            }
            fields() {
              return [];
            }
          }
          b3.NoopTextMapPropagator = c2;
        }, 92: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.defaultTextMapSetter = b3.defaultTextMapGetter = void 0, b3.defaultTextMapGetter = { get(a3, b4) {
            if (null != a3) return a3[b4];
          }, keys: (a3) => null == a3 ? [] : Object.keys(a3) }, b3.defaultTextMapSetter = { set(a3, b4, c2) {
            null != a3 && (a3[b4] = c2);
          } };
        }, 816: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.trace = void 0, b3.trace = c2(397).TraceAPI.getInstance();
        }, 374: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NonRecordingSpan = void 0;
          let d2 = c2(546);
          class e2 {
            constructor(a3 = d2.INVALID_SPAN_CONTEXT) {
              this._spanContext = a3;
            }
            spanContext() {
              return this._spanContext;
            }
            setAttribute(a3, b4) {
              return this;
            }
            setAttributes(a3) {
              return this;
            }
            addEvent(a3, b4) {
              return this;
            }
            setStatus(a3) {
              return this;
            }
            updateName(a3) {
              return this;
            }
            end(a3) {
            }
            isRecording() {
              return false;
            }
            recordException(a3, b4) {
            }
          }
          b3.NonRecordingSpan = e2;
        }, 637: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NoopTracer = void 0;
          let d2 = c2(912), e2 = c2(793), f2 = c2(374), g2 = c2(477), h2 = d2.ContextAPI.getInstance();
          class i2 {
            startSpan(a3, b4, c3 = h2.active()) {
              var d3;
              if (null == b4 ? void 0 : b4.root) return new f2.NonRecordingSpan();
              let i3 = c3 && (0, e2.getSpanContext)(c3);
              return "object" == typeof (d3 = i3) && "string" == typeof d3.spanId && "string" == typeof d3.traceId && "number" == typeof d3.traceFlags && (0, g2.isSpanContextValid)(i3) ? new f2.NonRecordingSpan(i3) : new f2.NonRecordingSpan();
            }
            startActiveSpan(a3, b4, c3, d3) {
              let f3, g3, i3;
              if (arguments.length < 2) return;
              2 == arguments.length ? i3 = b4 : 3 == arguments.length ? (f3 = b4, i3 = c3) : (f3 = b4, g3 = c3, i3 = d3);
              let j2 = null != g3 ? g3 : h2.active(), k2 = this.startSpan(a3, f3, j2), l2 = (0, e2.setSpan)(j2, k2);
              return h2.with(l2, i3, void 0, k2);
            }
          }
          b3.NoopTracer = i2;
        }, 76: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NoopTracerProvider = void 0;
          let d2 = c2(637);
          class e2 {
            getTracer(a3, b4, c3) {
              return new d2.NoopTracer();
            }
          }
          b3.NoopTracerProvider = e2;
        }, 779: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.ProxyTracer = void 0;
          let d2 = new (c2(637)).NoopTracer();
          class e2 {
            constructor(a3, b4, c3, d3) {
              this._provider = a3, this.name = b4, this.version = c3, this.options = d3;
            }
            startSpan(a3, b4, c3) {
              return this._getTracer().startSpan(a3, b4, c3);
            }
            startActiveSpan(a3, b4, c3, d3) {
              let e3 = this._getTracer();
              return Reflect.apply(e3.startActiveSpan, e3, arguments);
            }
            _getTracer() {
              if (this._delegate) return this._delegate;
              let a3 = this._provider.getDelegateTracer(this.name, this.version, this.options);
              return a3 ? (this._delegate = a3, this._delegate) : d2;
            }
          }
          b3.ProxyTracer = e2;
        }, 498: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.ProxyTracerProvider = void 0;
          let d2 = c2(779), e2 = new (c2(76)).NoopTracerProvider();
          class f2 {
            getTracer(a3, b4, c3) {
              var e3;
              return null != (e3 = this.getDelegateTracer(a3, b4, c3)) ? e3 : new d2.ProxyTracer(this, a3, b4, c3);
            }
            getDelegate() {
              var a3;
              return null != (a3 = this._delegate) ? a3 : e2;
            }
            setDelegate(a3) {
              this._delegate = a3;
            }
            getDelegateTracer(a3, b4, c3) {
              var d3;
              return null == (d3 = this._delegate) ? void 0 : d3.getTracer(a3, b4, c3);
            }
          }
          b3.ProxyTracerProvider = f2;
        }, 312: (a2, b3) => {
          var c2;
          Object.defineProperty(b3, "__esModule", { value: true }), b3.SamplingDecision = void 0, (c2 = b3.SamplingDecision || (b3.SamplingDecision = {}))[c2.NOT_RECORD = 0] = "NOT_RECORD", c2[c2.RECORD = 1] = "RECORD", c2[c2.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
        }, 793: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.getSpanContext = b3.setSpanContext = b3.deleteSpan = b3.setSpan = b3.getActiveSpan = b3.getSpan = void 0;
          let d2 = c2(23), e2 = c2(374), f2 = c2(912), g2 = (0, d2.createContextKey)("OpenTelemetry Context Key SPAN");
          function h2(a3) {
            return a3.getValue(g2) || void 0;
          }
          function i2(a3, b4) {
            return a3.setValue(g2, b4);
          }
          b3.getSpan = h2, b3.getActiveSpan = function() {
            return h2(f2.ContextAPI.getInstance().active());
          }, b3.setSpan = i2, b3.deleteSpan = function(a3) {
            return a3.deleteValue(g2);
          }, b3.setSpanContext = function(a3, b4) {
            return i2(a3, new e2.NonRecordingSpan(b4));
          }, b3.getSpanContext = function(a3) {
            var b4;
            return null == (b4 = h2(a3)) ? void 0 : b4.spanContext();
          };
        }, 285: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.TraceStateImpl = void 0;
          let d2 = c2(240);
          class e2 {
            constructor(a3) {
              this._internalState = /* @__PURE__ */ new Map(), a3 && this._parse(a3);
            }
            set(a3, b4) {
              let c3 = this._clone();
              return c3._internalState.has(a3) && c3._internalState.delete(a3), c3._internalState.set(a3, b4), c3;
            }
            unset(a3) {
              let b4 = this._clone();
              return b4._internalState.delete(a3), b4;
            }
            get(a3) {
              return this._internalState.get(a3);
            }
            serialize() {
              return this._keys().reduce((a3, b4) => (a3.push(b4 + "=" + this.get(b4)), a3), []).join(",");
            }
            _parse(a3) {
              !(a3.length > 512) && (this._internalState = a3.split(",").reverse().reduce((a4, b4) => {
                let c3 = b4.trim(), e3 = c3.indexOf("=");
                if (-1 !== e3) {
                  let f2 = c3.slice(0, e3), g2 = c3.slice(e3 + 1, b4.length);
                  (0, d2.validateKey)(f2) && (0, d2.validateValue)(g2) && a4.set(f2, g2);
                }
                return a4;
              }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
            }
            _keys() {
              return Array.from(this._internalState.keys()).reverse();
            }
            _clone() {
              let a3 = new e2();
              return a3._internalState = new Map(this._internalState), a3;
            }
          }
          b3.TraceStateImpl = e2;
        }, 240: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.validateValue = b3.validateKey = void 0;
          let c2 = "[_0-9a-z-*/]", d2 = `[a-z]${c2}{0,255}`, e2 = `[a-z0-9]${c2}{0,240}@[a-z]${c2}{0,13}`, f2 = RegExp(`^(?:${d2}|${e2})$`), g2 = /^[ -~]{0,255}[!-~]$/, h2 = /,|=/;
          b3.validateKey = function(a3) {
            return f2.test(a3);
          }, b3.validateValue = function(a3) {
            return g2.test(a3) && !h2.test(a3);
          };
        }, 87: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.createTraceState = void 0;
          let d2 = c2(285);
          b3.createTraceState = function(a3) {
            return new d2.TraceStateImpl(a3);
          };
        }, 546: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.INVALID_SPAN_CONTEXT = b3.INVALID_TRACEID = b3.INVALID_SPANID = void 0;
          let d2 = c2(731);
          b3.INVALID_SPANID = "0000000000000000", b3.INVALID_TRACEID = "00000000000000000000000000000000", b3.INVALID_SPAN_CONTEXT = { traceId: b3.INVALID_TRACEID, spanId: b3.INVALID_SPANID, traceFlags: d2.TraceFlags.NONE };
        }, 613: (a2, b3) => {
          var c2;
          Object.defineProperty(b3, "__esModule", { value: true }), b3.SpanKind = void 0, (c2 = b3.SpanKind || (b3.SpanKind = {}))[c2.INTERNAL = 0] = "INTERNAL", c2[c2.SERVER = 1] = "SERVER", c2[c2.CLIENT = 2] = "CLIENT", c2[c2.PRODUCER = 3] = "PRODUCER", c2[c2.CONSUMER = 4] = "CONSUMER";
        }, 477: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.wrapSpanContext = b3.isSpanContextValid = b3.isValidSpanId = b3.isValidTraceId = void 0;
          let d2 = c2(546), e2 = c2(374), f2 = /^([0-9a-f]{32})$/i, g2 = /^[0-9a-f]{16}$/i;
          function h2(a3) {
            return f2.test(a3) && a3 !== d2.INVALID_TRACEID;
          }
          function i2(a3) {
            return g2.test(a3) && a3 !== d2.INVALID_SPANID;
          }
          b3.isValidTraceId = h2, b3.isValidSpanId = i2, b3.isSpanContextValid = function(a3) {
            return h2(a3.traceId) && i2(a3.spanId);
          }, b3.wrapSpanContext = function(a3) {
            return new e2.NonRecordingSpan(a3);
          };
        }, 854: (a2, b3) => {
          var c2;
          Object.defineProperty(b3, "__esModule", { value: true }), b3.SpanStatusCode = void 0, (c2 = b3.SpanStatusCode || (b3.SpanStatusCode = {}))[c2.UNSET = 0] = "UNSET", c2[c2.OK = 1] = "OK", c2[c2.ERROR = 2] = "ERROR";
        }, 731: (a2, b3) => {
          var c2;
          Object.defineProperty(b3, "__esModule", { value: true }), b3.TraceFlags = void 0, (c2 = b3.TraceFlags || (b3.TraceFlags = {}))[c2.NONE = 0] = "NONE", c2[c2.SAMPLED = 1] = "SAMPLED";
        }, 652: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.VERSION = void 0, b3.VERSION = "1.6.0";
        } }, y = {};
        function z(a2) {
          var b3 = y[a2];
          if (void 0 !== b3) return b3.exports;
          var c2 = y[a2] = { exports: {} }, d2 = true;
          try {
            x[a2].call(c2.exports, c2, c2.exports, z), d2 = false;
          } finally {
            d2 && delete y[a2];
          }
          return c2.exports;
        }
        z.ab = "//";
        var A = {};
        Object.defineProperty(A, "__esModule", { value: true }), A.trace = A.propagation = A.metrics = A.diag = A.context = A.INVALID_SPAN_CONTEXT = A.INVALID_TRACEID = A.INVALID_SPANID = A.isValidSpanId = A.isValidTraceId = A.isSpanContextValid = A.createTraceState = A.TraceFlags = A.SpanStatusCode = A.SpanKind = A.SamplingDecision = A.ProxyTracerProvider = A.ProxyTracer = A.defaultTextMapSetter = A.defaultTextMapGetter = A.ValueType = A.createNoopMeter = A.DiagLogLevel = A.DiagConsoleLogger = A.ROOT_CONTEXT = A.createContextKey = A.baggageEntryMetadataFromString = void 0, h = z(504), Object.defineProperty(A, "baggageEntryMetadataFromString", { enumerable: true, get: function() {
          return h.baggageEntryMetadataFromString;
        } }), i = z(23), Object.defineProperty(A, "createContextKey", { enumerable: true, get: function() {
          return i.createContextKey;
        } }), Object.defineProperty(A, "ROOT_CONTEXT", { enumerable: true, get: function() {
          return i.ROOT_CONTEXT;
        } }), j = z(83), Object.defineProperty(A, "DiagConsoleLogger", { enumerable: true, get: function() {
          return j.DiagConsoleLogger;
        } }), k = z(711), Object.defineProperty(A, "DiagLogLevel", { enumerable: true, get: function() {
          return k.DiagLogLevel;
        } }), l = z(440), Object.defineProperty(A, "createNoopMeter", { enumerable: true, get: function() {
          return l.createNoopMeter;
        } }), m = z(532), Object.defineProperty(A, "ValueType", { enumerable: true, get: function() {
          return m.ValueType;
        } }), n = z(92), Object.defineProperty(A, "defaultTextMapGetter", { enumerable: true, get: function() {
          return n.defaultTextMapGetter;
        } }), Object.defineProperty(A, "defaultTextMapSetter", { enumerable: true, get: function() {
          return n.defaultTextMapSetter;
        } }), o = z(779), Object.defineProperty(A, "ProxyTracer", { enumerable: true, get: function() {
          return o.ProxyTracer;
        } }), p = z(498), Object.defineProperty(A, "ProxyTracerProvider", { enumerable: true, get: function() {
          return p.ProxyTracerProvider;
        } }), q = z(312), Object.defineProperty(A, "SamplingDecision", { enumerable: true, get: function() {
          return q.SamplingDecision;
        } }), r = z(613), Object.defineProperty(A, "SpanKind", { enumerable: true, get: function() {
          return r.SpanKind;
        } }), s = z(854), Object.defineProperty(A, "SpanStatusCode", { enumerable: true, get: function() {
          return s.SpanStatusCode;
        } }), t = z(731), Object.defineProperty(A, "TraceFlags", { enumerable: true, get: function() {
          return t.TraceFlags;
        } }), u = z(87), Object.defineProperty(A, "createTraceState", { enumerable: true, get: function() {
          return u.createTraceState;
        } }), v = z(477), Object.defineProperty(A, "isSpanContextValid", { enumerable: true, get: function() {
          return v.isSpanContextValid;
        } }), Object.defineProperty(A, "isValidTraceId", { enumerable: true, get: function() {
          return v.isValidTraceId;
        } }), Object.defineProperty(A, "isValidSpanId", { enumerable: true, get: function() {
          return v.isValidSpanId;
        } }), w = z(546), Object.defineProperty(A, "INVALID_SPANID", { enumerable: true, get: function() {
          return w.INVALID_SPANID;
        } }), Object.defineProperty(A, "INVALID_TRACEID", { enumerable: true, get: function() {
          return w.INVALID_TRACEID;
        } }), Object.defineProperty(A, "INVALID_SPAN_CONTEXT", { enumerable: true, get: function() {
          return w.INVALID_SPAN_CONTEXT;
        } }), b2 = z(778), Object.defineProperty(A, "context", { enumerable: true, get: function() {
          return b2.context;
        } }), d = z(304), Object.defineProperty(A, "diag", { enumerable: true, get: function() {
          return d.diag;
        } }), e = z(120), Object.defineProperty(A, "metrics", { enumerable: true, get: function() {
          return e.metrics;
        } }), f = z(27), Object.defineProperty(A, "propagation", { enumerable: true, get: function() {
          return f.propagation;
        } }), g = z(816), Object.defineProperty(A, "trace", { enumerable: true, get: function() {
          return g.trace;
        } }), A.default = { context: b2.context, diag: d.diag, metrics: e.metrics, propagation: f.propagation, trace: g.trace }, a.exports = A;
      })();
    }, 6122: (a, b, c) => {
      "use strict";
      c.d(b, { d: () => e });
      let d = /* @__PURE__ */ new WeakMap();
      function e(a2, b2) {
        let c2;
        if (!b2) return { pathname: a2 };
        let e2 = d.get(b2);
        e2 || (e2 = b2.map((a3) => a3.toLowerCase()), d.set(b2, e2));
        let f = a2.split("/", 2);
        if (!f[1]) return { pathname: a2 };
        let g = f[1].toLowerCase(), h = e2.indexOf(g);
        return h < 0 ? { pathname: a2 } : (c2 = b2[h], { pathname: a2 = a2.slice(c2.length + 1) || "/", detectedLocale: c2 });
      }
    }, 6221: (a, b, c) => {
      "use strict";
      c.d(b, { Ud: () => d.stringifyCookie, VO: () => d.ResponseCookies, tm: () => d.RequestCookies });
      var d = c(6508);
    }, 6315: (a, b) => {
      "use strict";
      function c(a2) {
        return (a2 + 64 >>> 9 << 4) + 14 + 1;
      }
      function d(a2, b2) {
        let c2 = (65535 & a2) + (65535 & b2);
        return (a2 >> 16) + (b2 >> 16) + (c2 >> 16) << 16 | 65535 & c2;
      }
      function e(a2, b2, c2, e2, f2, g2) {
        var h2;
        return d((h2 = d(d(b2, a2), d(e2, g2))) << f2 | h2 >>> 32 - f2, c2);
      }
      function f(a2, b2, c2, d2, f2, g2, h2) {
        return e(b2 & c2 | ~b2 & d2, a2, b2, f2, g2, h2);
      }
      function g(a2, b2, c2, d2, f2, g2, h2) {
        return e(b2 & d2 | c2 & ~d2, a2, b2, f2, g2, h2);
      }
      function h(a2, b2, c2, d2, f2, g2, h2) {
        return e(b2 ^ c2 ^ d2, a2, b2, f2, g2, h2);
      }
      function i(a2, b2, c2, d2, f2, g2, h2) {
        return e(c2 ^ (b2 | ~d2), a2, b2, f2, g2, h2);
      }
      Object.defineProperty(b, "__esModule", { value: true }), b.default = function(a2) {
        var b2 = function(a3, b3) {
          let e3 = new Uint32Array(c(b3)).fill(0);
          e3.set(a3), e3[b3 >> 5] |= 128 << b3 % 32, e3[e3.length - 1] = b3, a3 = e3;
          let j = 1732584193, k = -271733879, l = -1732584194, m = 271733878;
          for (let b4 = 0; b4 < a3.length; b4 += 16) {
            let c2 = j, e4 = k, n = l, o = m;
            j = f(j, k, l, m, a3[b4], 7, -680876936), m = f(m, j, k, l, a3[b4 + 1], 12, -389564586), l = f(l, m, j, k, a3[b4 + 2], 17, 606105819), k = f(k, l, m, j, a3[b4 + 3], 22, -1044525330), j = f(j, k, l, m, a3[b4 + 4], 7, -176418897), m = f(m, j, k, l, a3[b4 + 5], 12, 1200080426), l = f(l, m, j, k, a3[b4 + 6], 17, -1473231341), k = f(k, l, m, j, a3[b4 + 7], 22, -45705983), j = f(j, k, l, m, a3[b4 + 8], 7, 1770035416), m = f(m, j, k, l, a3[b4 + 9], 12, -1958414417), l = f(l, m, j, k, a3[b4 + 10], 17, -42063), k = f(k, l, m, j, a3[b4 + 11], 22, -1990404162), j = f(j, k, l, m, a3[b4 + 12], 7, 1804603682), m = f(m, j, k, l, a3[b4 + 13], 12, -40341101), l = f(l, m, j, k, a3[b4 + 14], 17, -1502002290), k = f(k, l, m, j, a3[b4 + 15], 22, 1236535329), j = g(j, k, l, m, a3[b4 + 1], 5, -165796510), m = g(m, j, k, l, a3[b4 + 6], 9, -1069501632), l = g(l, m, j, k, a3[b4 + 11], 14, 643717713), k = g(k, l, m, j, a3[b4], 20, -373897302), j = g(j, k, l, m, a3[b4 + 5], 5, -701558691), m = g(m, j, k, l, a3[b4 + 10], 9, 38016083), l = g(l, m, j, k, a3[b4 + 15], 14, -660478335), k = g(k, l, m, j, a3[b4 + 4], 20, -405537848), j = g(j, k, l, m, a3[b4 + 9], 5, 568446438), m = g(m, j, k, l, a3[b4 + 14], 9, -1019803690), l = g(l, m, j, k, a3[b4 + 3], 14, -187363961), k = g(k, l, m, j, a3[b4 + 8], 20, 1163531501), j = g(j, k, l, m, a3[b4 + 13], 5, -1444681467), m = g(m, j, k, l, a3[b4 + 2], 9, -51403784), l = g(l, m, j, k, a3[b4 + 7], 14, 1735328473), k = g(k, l, m, j, a3[b4 + 12], 20, -1926607734), j = h(j, k, l, m, a3[b4 + 5], 4, -378558), m = h(m, j, k, l, a3[b4 + 8], 11, -2022574463), l = h(l, m, j, k, a3[b4 + 11], 16, 1839030562), k = h(k, l, m, j, a3[b4 + 14], 23, -35309556), j = h(j, k, l, m, a3[b4 + 1], 4, -1530992060), m = h(m, j, k, l, a3[b4 + 4], 11, 1272893353), l = h(l, m, j, k, a3[b4 + 7], 16, -155497632), k = h(k, l, m, j, a3[b4 + 10], 23, -1094730640), j = h(j, k, l, m, a3[b4 + 13], 4, 681279174), m = h(m, j, k, l, a3[b4], 11, -358537222), l = h(l, m, j, k, a3[b4 + 3], 16, -722521979), k = h(k, l, m, j, a3[b4 + 6], 23, 76029189), j = h(j, k, l, m, a3[b4 + 9], 4, -640364487), m = h(m, j, k, l, a3[b4 + 12], 11, -421815835), l = h(l, m, j, k, a3[b4 + 15], 16, 530742520), k = h(k, l, m, j, a3[b4 + 2], 23, -995338651), j = i(j, k, l, m, a3[b4], 6, -198630844), m = i(m, j, k, l, a3[b4 + 7], 10, 1126891415), l = i(l, m, j, k, a3[b4 + 14], 15, -1416354905), k = i(k, l, m, j, a3[b4 + 5], 21, -57434055), j = i(j, k, l, m, a3[b4 + 12], 6, 1700485571), m = i(m, j, k, l, a3[b4 + 3], 10, -1894986606), l = i(l, m, j, k, a3[b4 + 10], 15, -1051523), k = i(k, l, m, j, a3[b4 + 1], 21, -2054922799), j = i(j, k, l, m, a3[b4 + 8], 6, 1873313359), m = i(m, j, k, l, a3[b4 + 15], 10, -30611744), l = i(l, m, j, k, a3[b4 + 6], 15, -1560198380), k = i(k, l, m, j, a3[b4 + 13], 21, 1309151649), j = i(j, k, l, m, a3[b4 + 4], 6, -145523070), m = i(m, j, k, l, a3[b4 + 11], 10, -1120210379), l = i(l, m, j, k, a3[b4 + 2], 15, 718787259), k = i(k, l, m, j, a3[b4 + 9], 21, -343485551), j = d(j, c2), k = d(k, e4), l = d(l, n), m = d(m, o);
          }
          return Uint32Array.of(j, k, l, m);
        }(function(a3) {
          if (0 === a3.length) return new Uint32Array();
          let b3 = new Uint32Array(c(8 * a3.length)).fill(0);
          for (let c2 = 0; c2 < a3.length; c2++) b3[c2 >> 2] |= (255 & a3[c2]) << c2 % 4 * 8;
          return b3;
        }(a2), 8 * a2.length);
        let e2 = new Uint8Array(4 * b2.length);
        for (let a3 = 0; a3 < 4 * b2.length; a3++) e2[a3] = b2[a3 >> 2] >>> a3 % 4 * 8 & 255;
        return e2;
      };
    }, 6506: (a, b, c) => {
      "use strict";
      c.d(b, { z: () => d });
      class d extends Error {
        constructor(a2, b2) {
          super(`Invariant: ${a2.endsWith(".") ? a2 : a2 + "."} This is a bug in Next.js.`, b2), Object.defineProperty(this, "__NEXT_ERROR_CODE", { value: "E1179", enumerable: false, configurable: true }), this.name = "InvariantError";
        }
      }
    }, 6508: (a) => {
      "use strict";
      var b = Object.defineProperty, c = Object.getOwnPropertyDescriptor, d = Object.getOwnPropertyNames, e = Object.prototype.hasOwnProperty, f = {}, g = { RequestCookies: () => n, ResponseCookies: () => o, parseCookie: () => j, parseSetCookie: () => k, stringifyCookie: () => i };
      for (var h in g) b(f, h, { get: g[h], enumerable: true });
      function i(a2) {
        var b2;
        let c2 = ["path" in a2 && a2.path && `Path=${a2.path}`, "expires" in a2 && (a2.expires || 0 === a2.expires) && `Expires=${("number" == typeof a2.expires ? new Date(a2.expires) : a2.expires).toUTCString()}`, "maxAge" in a2 && "number" == typeof a2.maxAge && `Max-Age=${a2.maxAge}`, "domain" in a2 && a2.domain && `Domain=${a2.domain}`, "secure" in a2 && a2.secure && "Secure", "httpOnly" in a2 && a2.httpOnly && "HttpOnly", "sameSite" in a2 && a2.sameSite && `SameSite=${a2.sameSite}`, "partitioned" in a2 && a2.partitioned && "Partitioned", "priority" in a2 && a2.priority && `Priority=${a2.priority}`].filter(Boolean), d2 = `${a2.name}=${encodeURIComponent(null != (b2 = a2.value) ? b2 : "")}`;
        return 0 === c2.length ? d2 : `${d2}; ${c2.join("; ")}`;
      }
      function j(a2) {
        let b2 = /* @__PURE__ */ new Map();
        for (let c2 of a2.split(/; */)) {
          if (!c2) continue;
          let a3 = c2.indexOf("=");
          if (-1 === a3) {
            b2.set(c2, "true");
            continue;
          }
          let [d2, e2] = [c2.slice(0, a3), c2.slice(a3 + 1)];
          try {
            b2.set(d2, decodeURIComponent(null != e2 ? e2 : "true"));
          } catch {
          }
        }
        return b2;
      }
      function k(a2) {
        if (!a2) return;
        let [[b2, c2], ...d2] = j(a2), { domain: e2, expires: f2, httponly: g2, maxage: h2, path: i2, samesite: k2, secure: n2, partitioned: o2, priority: p } = Object.fromEntries(d2.map(([a3, b3]) => [a3.toLowerCase().replace(/-/g, ""), b3]));
        {
          var q, r, s = { name: b2, value: decodeURIComponent(c2), domain: e2, ...f2 && { expires: new Date(f2) }, ...g2 && { httpOnly: true }, ..."string" == typeof h2 && { maxAge: Number(h2) }, path: i2, ...k2 && { sameSite: l.includes(q = (q = k2).toLowerCase()) ? q : void 0 }, ...n2 && { secure: true }, ...p && { priority: m.includes(r = (r = p).toLowerCase()) ? r : void 0 }, ...o2 && { partitioned: true } };
          let a3 = {};
          for (let b3 in s) s[b3] && (a3[b3] = s[b3]);
          return a3;
        }
      }
      a.exports = ((a2, f2, g2) => {
        if (f2 && "object" == typeof f2 || "function" == typeof f2) for (let h2 of d(f2)) e.call(a2, h2) || void 0 === h2 || b(a2, h2, { get: () => f2[h2], enumerable: !(g2 = c(f2, h2)) || g2.enumerable });
        return a2;
      })(b({}, "__esModule", { value: true }), f);
      var l = ["strict", "lax", "none"], m = ["low", "medium", "high"], n = class {
        constructor(a2) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = a2;
          const b2 = a2.get("cookie");
          if (b2) for (const [a3, c2] of j(b2)) this._parsed.set(a3, { name: a3, value: c2 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...a2) {
          let b2 = "string" == typeof a2[0] ? a2[0] : a2[0].name;
          return this._parsed.get(b2);
        }
        getAll(...a2) {
          var b2;
          let c2 = Array.from(this._parsed);
          if (!a2.length) return c2.map(([a3, b3]) => b3);
          let d2 = "string" == typeof a2[0] ? a2[0] : null == (b2 = a2[0]) ? void 0 : b2.name;
          return c2.filter(([a3]) => a3 === d2).map(([a3, b3]) => b3);
        }
        has(a2) {
          return this._parsed.has(a2);
        }
        set(...a2) {
          let [b2, c2] = 1 === a2.length ? [a2[0].name, a2[0].value] : a2, d2 = this._parsed;
          return d2.set(b2, { name: b2, value: c2 }), this._headers.set("cookie", Array.from(d2).map(([a3, b3]) => i(b3)).join("; ")), this;
        }
        delete(a2) {
          let b2 = this._parsed, c2 = Array.isArray(a2) ? a2.map((a3) => b2.delete(a3)) : b2.delete(a2);
          return this._headers.set("cookie", Array.from(b2).map(([a3, b3]) => i(b3)).join("; ")), c2;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((a2) => `${a2.name}=${encodeURIComponent(a2.value)}`).join("; ");
        }
      }, o = class {
        constructor(a2) {
          var b2, c2, d2;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = a2;
          const e2 = null != (d2 = null != (c2 = null == (b2 = a2.getSetCookie) ? void 0 : b2.call(a2)) ? c2 : a2.get("set-cookie")) ? d2 : [];
          for (const a3 of Array.isArray(e2) ? e2 : function(a4) {
            if (!a4) return [];
            var b3, c3, d3, e3, f2, g2 = [], h2 = 0;
            function i2() {
              for (; h2 < a4.length && /\s/.test(a4.charAt(h2)); ) h2 += 1;
              return h2 < a4.length;
            }
            for (; h2 < a4.length; ) {
              for (b3 = h2, f2 = false; i2(); ) if ("," === (c3 = a4.charAt(h2))) {
                for (d3 = h2, h2 += 1, i2(), e3 = h2; h2 < a4.length && "=" !== (c3 = a4.charAt(h2)) && ";" !== c3 && "," !== c3; ) h2 += 1;
                h2 < a4.length && "=" === a4.charAt(h2) ? (f2 = true, h2 = e3, g2.push(a4.substring(b3, d3)), b3 = h2) : h2 = d3 + 1;
              } else h2 += 1;
              (!f2 || h2 >= a4.length) && g2.push(a4.substring(b3, a4.length));
            }
            return g2;
          }(e2)) {
            const b3 = k(a3);
            b3 && this._parsed.set(b3.name, b3);
          }
        }
        get(...a2) {
          let b2 = "string" == typeof a2[0] ? a2[0] : a2[0].name;
          return this._parsed.get(b2);
        }
        getAll(...a2) {
          var b2;
          let c2 = Array.from(this._parsed.values());
          if (!a2.length) return c2;
          let d2 = "string" == typeof a2[0] ? a2[0] : null == (b2 = a2[0]) ? void 0 : b2.name;
          return c2.filter((a3) => a3.name === d2);
        }
        has(a2) {
          return this._parsed.has(a2);
        }
        set(...a2) {
          let [b2, c2, d2] = 1 === a2.length ? [a2[0].name, a2[0].value, a2[0]] : a2, e2 = this._parsed;
          return e2.set(b2, function(a3 = { name: "", value: "" }) {
            return "number" == typeof a3.expires && (a3.expires = new Date(a3.expires)), a3.maxAge && (a3.expires = new Date(Date.now() + 1e3 * a3.maxAge)), (null === a3.path || void 0 === a3.path) && (a3.path = "/"), a3;
          }({ name: b2, value: c2, ...d2 })), function(a3, b3) {
            for (let [, c3] of (b3.delete("set-cookie"), a3)) {
              let a4 = i(c3);
              b3.append("set-cookie", a4);
            }
          }(e2, this._headers), this;
        }
        delete(...a2) {
          let [b2, c2] = "string" == typeof a2[0] ? [a2[0]] : [a2[0].name, a2[0]];
          return this.set({ ...c2, name: b2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(i).join("; ");
        }
      };
    }, 6664: (a, b, c) => {
      "use strict";
      c.d(b, { CB: () => d, Yq: () => e, l_: () => f });
      class d extends Error {
        constructor({ page: a2 }) {
          super(`The middleware "${a2}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `), Object.defineProperty(this, "__NEXT_ERROR_CODE", { value: "E1177", enumerable: false, configurable: true });
        }
      }
      class e extends Error {
        constructor() {
          super("The request.page has been deprecated in favour of `URLPattern`.\n  Read more: https://nextjs.org/docs/messages/middleware-request-page\n  "), Object.defineProperty(this, "__NEXT_ERROR_CODE", { value: "E1178", enumerable: false, configurable: true });
        }
      }
      class f extends Error {
        constructor() {
          super("The request.ua has been removed in favour of `userAgent` function.\n  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent\n  "), Object.defineProperty(this, "__NEXT_ERROR_CODE", { value: "E1172", enumerable: false, configurable: true });
        }
      }
    }, 7015: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true }), b.version = b.validate = b.v7 = b.v6ToV1 = b.v6 = b.v5 = b.v4 = b.v3 = b.v1ToV6 = b.v1 = b.stringify = b.parse = b.NIL = b.MAX = void 0;
      var d = c(2397);
      Object.defineProperty(b, "MAX", { enumerable: true, get: function() {
        return d.default;
      } });
      var e = c(794);
      Object.defineProperty(b, "NIL", { enumerable: true, get: function() {
        return e.default;
      } });
      var f = c(8566);
      Object.defineProperty(b, "parse", { enumerable: true, get: function() {
        return f.default;
      } });
      var g = c(4308);
      Object.defineProperty(b, "stringify", { enumerable: true, get: function() {
        return g.default;
      } });
      var h = c(512);
      Object.defineProperty(b, "v1", { enumerable: true, get: function() {
        return h.default;
      } });
      var i = c(7079);
      Object.defineProperty(b, "v1ToV6", { enumerable: true, get: function() {
        return i.default;
      } });
      var j = c(2454);
      Object.defineProperty(b, "v3", { enumerable: true, get: function() {
        return j.default;
      } });
      var k = c(5313);
      Object.defineProperty(b, "v4", { enumerable: true, get: function() {
        return k.default;
      } });
      var l = c(8764);
      Object.defineProperty(b, "v5", { enumerable: true, get: function() {
        return l.default;
      } });
      var m = c(1967);
      Object.defineProperty(b, "v6", { enumerable: true, get: function() {
        return m.default;
      } });
      var n = c(3107);
      Object.defineProperty(b, "v6ToV1", { enumerable: true, get: function() {
        return n.default;
      } });
      var o = c(4738);
      Object.defineProperty(b, "v7", { enumerable: true, get: function() {
        return o.default;
      } });
      var p = c(9293);
      Object.defineProperty(b, "validate", { enumerable: true, get: function() {
        return p.default;
      } });
      var q = c(7399);
      Object.defineProperty(b, "version", { enumerable: true, get: function() {
        return q.default;
      } });
    }, 7021: (a, b, c) => {
      "use strict";
      c.d(b, { J: () => d });
      let d = (0, c(7925).xl)();
    }, 7079: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true });
      let d = c(8566), e = c(4308);
      b.default = function(a2) {
        var b2;
        let c2 = (b2 = "string" == typeof a2 ? (0, d.default)(a2) : a2, Uint8Array.of((15 & b2[6]) << 4 | b2[7] >> 4 & 15, (15 & b2[7]) << 4 | (240 & b2[4]) >> 4, (15 & b2[4]) << 4 | (240 & b2[5]) >> 4, (15 & b2[5]) << 4 | (240 & b2[0]) >> 4, (15 & b2[0]) << 4 | (240 & b2[1]) >> 4, (15 & b2[1]) << 4 | (240 & b2[2]) >> 4, 96 | 15 & b2[2], b2[3], b2[8], b2[9], b2[10], b2[11], b2[12], b2[13], b2[14], b2[15]));
        return "string" == typeof a2 ? (0, e.unsafeStringify)(c2) : c2;
      };
    }, 7399: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true });
      let d = c(9293);
      b.default = function(a2) {
        if (!(0, d.default)(a2)) throw TypeError("Invalid UUID");
        return parseInt(a2.slice(14, 15), 16);
      };
    }, 7644: (a, b, c) => {
      "use strict";
      function d(a2) {
        return 47 === a2.charCodeAt(a2.length - 1) && a2.length > 1 ? a2.slice(0, -1) : a2;
      }
      function e(a2) {
        let b2 = a2.indexOf("#"), c2 = a2.indexOf("?"), d2 = c2 > -1 && (b2 < 0 || c2 < b2);
        return d2 || b2 > -1 ? { pathname: a2.substring(0, d2 ? c2 : b2), query: d2 ? a2.substring(c2, b2 > -1 ? b2 : void 0) : "", hash: b2 > -1 ? a2.slice(b2) : "" } : { pathname: a2, query: "", hash: "" };
      }
      function f(a2, b2) {
        if (!a2.startsWith("/") || !b2) return a2;
        let { pathname: c2, query: d2, hash: f2 } = e(a2);
        return `${b2}${c2}${d2}${f2}`;
      }
      function g(a2, b2) {
        if (!a2.startsWith("/") || !b2) return a2;
        let { pathname: c2, query: d2, hash: f2 } = e(a2);
        return `${c2}${b2}${d2}${f2}`;
      }
      function h(a2, b2) {
        if ("string" != typeof a2) return false;
        let { pathname: c2 } = e(a2);
        return c2 === b2 || c2.startsWith(b2 + "/");
      }
      c.d(b, { X: () => m });
      var i = c(6122);
      let j = /^(?:127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)$/;
      function k(a2, b2) {
        let c2 = new URL(String(a2), b2 && String(b2));
        return j.test(c2.hostname) && (c2.hostname = "localhost"), c2;
      }
      let l = Symbol("NextURLInternal");
      class m {
        constructor(a2, b2, c2) {
          let d2, e2;
          "object" == typeof b2 && "pathname" in b2 || "string" == typeof b2 ? (d2 = b2, e2 = c2 || {}) : e2 = c2 || b2 || {}, this[l] = { url: k(a2, d2 ?? e2.base), options: e2, basePath: "" }, this.analyze();
        }
        analyze() {
          var a2, b2, c2, d2, e2;
          let f2 = function(a3, b3) {
            let { basePath: c3, i18n: d3, trailingSlash: e3 } = b3.nextConfig ?? {}, f3 = { pathname: a3, trailingSlash: "/" !== a3 ? a3.endsWith("/") : e3 };
            c3 && h(f3.pathname, c3) && (f3.pathname = function(a4, b4) {
              if (!h(a4, b4)) return a4;
              let c4 = a4.slice(b4.length);
              return c4.startsWith("/") ? c4 : `/${c4}`;
            }(f3.pathname, c3), f3.basePath = c3);
            let g3 = f3.pathname;
            if (f3.pathname.startsWith("/_next/data/") && f3.pathname.endsWith(".json")) {
              let a4 = f3.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
              f3.buildId = a4[0], g3 = "index" !== a4[1] ? `/${a4.slice(1).join("/")}` : "/", true === b3.parseData && (f3.pathname = g3);
            }
            if (d3) {
              let a4 = b3.i18nProvider ? b3.i18nProvider.analyze(f3.pathname) : (0, i.d)(f3.pathname, d3.locales);
              f3.locale = a4.detectedLocale, f3.pathname = a4.pathname ?? f3.pathname, !a4.detectedLocale && f3.buildId && (a4 = b3.i18nProvider ? b3.i18nProvider.analyze(g3) : (0, i.d)(g3, d3.locales)).detectedLocale && (f3.locale = a4.detectedLocale);
            }
            return f3;
          }(this[l].url.pathname, { nextConfig: this[l].options.nextConfig, parseData: true, i18nProvider: this[l].options.i18nProvider }), g2 = function(a3, b3) {
            let c3;
            if (b3?.host && !Array.isArray(b3.host)) c3 = b3.host.toString().split(":", 1)[0];
            else {
              if (!a3.hostname) return;
              c3 = a3.hostname;
            }
            return c3.toLowerCase();
          }(this[l].url, this[l].options.headers);
          this[l].domainLocale = this[l].options.i18nProvider ? this[l].options.i18nProvider.detectDomainLocale(g2) : function(a3, b3, c3) {
            if (a3) {
              for (let d3 of (c3 && (c3 = c3.toLowerCase()), a3)) if (b3 === d3.domain?.split(":", 1)[0].toLowerCase() || c3 === d3.defaultLocale.toLowerCase() || d3.locales?.some((a4) => a4.toLowerCase() === c3)) return d3;
            }
          }(null == (b2 = this[l].options.nextConfig) || null == (a2 = b2.i18n) ? void 0 : a2.domains, g2);
          let j2 = (null == (c2 = this[l].domainLocale) ? void 0 : c2.defaultLocale) || (null == (e2 = this[l].options.nextConfig) || null == (d2 = e2.i18n) ? void 0 : d2.defaultLocale);
          this[l].url.pathname = f2.pathname, this[l].defaultLocale = j2, this[l].basePath = f2.basePath ?? "", this[l].buildId = f2.buildId, this[l].locale = f2.locale ?? j2, this[l].trailingSlash = f2.trailingSlash;
        }
        formatPathname() {
          var a2;
          let b2;
          return b2 = function(a3, b3, c2, d2) {
            if (!b3 || b3 === c2) return a3;
            let e2 = a3.toLowerCase();
            return !d2 && (h(e2, "/api") || h(e2, `/${b3.toLowerCase()}`)) ? a3 : f(a3, `/${b3}`);
          }((a2 = { basePath: this[l].basePath, buildId: this[l].buildId, defaultLocale: this[l].options.forceLocale ? void 0 : this[l].defaultLocale, locale: this[l].locale, pathname: this[l].url.pathname, trailingSlash: this[l].trailingSlash }).pathname, a2.locale, a2.buildId ? void 0 : a2.defaultLocale, a2.ignorePrefix), (a2.buildId || !a2.trailingSlash) && (b2 = d(b2)), a2.buildId && (b2 = g(f(b2, `/_next/data/${a2.buildId}`), "/" === a2.pathname ? "index.json" : ".json")), b2 = f(b2, a2.basePath), !a2.buildId && a2.trailingSlash ? b2.endsWith("/") ? b2 : g(b2, "/") : d(b2);
        }
        formatSearch() {
          return this[l].url.search;
        }
        get buildId() {
          return this[l].buildId;
        }
        set buildId(a2) {
          this[l].buildId = a2;
        }
        get locale() {
          return this[l].locale ?? "";
        }
        set locale(a2) {
          var b2, c2;
          if (!this[l].locale || !(null == (c2 = this[l].options.nextConfig) || null == (b2 = c2.i18n) ? void 0 : b2.locales.includes(a2))) throw Object.defineProperty(TypeError(`The NextURL configuration includes no locale "${a2}"`), "__NEXT_ERROR_CODE", { value: "E597", enumerable: false, configurable: true });
          this[l].locale = a2;
        }
        get defaultLocale() {
          return this[l].defaultLocale;
        }
        get domainLocale() {
          return this[l].domainLocale;
        }
        get searchParams() {
          return this[l].url.searchParams;
        }
        get host() {
          return this[l].url.host;
        }
        set host(a2) {
          this[l].url.host = a2;
        }
        get hostname() {
          return this[l].url.hostname;
        }
        set hostname(a2) {
          this[l].url.hostname = a2;
        }
        get port() {
          return this[l].url.port;
        }
        set port(a2) {
          this[l].url.port = a2;
        }
        get protocol() {
          return this[l].url.protocol;
        }
        set protocol(a2) {
          this[l].url.protocol = a2;
        }
        get href() {
          let a2 = this.formatPathname(), b2 = this.formatSearch();
          return `${this.protocol}//${this.host}${a2}${b2}${this.hash}`;
        }
        set href(a2) {
          this[l].url = k(a2), this.analyze();
        }
        get origin() {
          return this[l].url.origin;
        }
        get pathname() {
          return this[l].url.pathname;
        }
        set pathname(a2) {
          this[l].url.pathname = a2;
        }
        get hash() {
          return this[l].url.hash;
        }
        set hash(a2) {
          this[l].url.hash = a2;
        }
        get search() {
          return this[l].url.search;
        }
        set search(a2) {
          this[l].url.search = a2;
        }
        get password() {
          return this[l].url.password;
        }
        set password(a2) {
          this[l].url.password = a2;
        }
        get username() {
          return this[l].url.username;
        }
        set username(a2) {
          this[l].url.username = a2;
        }
        get basePath() {
          return this[l].basePath;
        }
        set basePath(a2) {
          this[l].basePath = a2.startsWith("/") ? a2 : `/${a2}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { href: this.href, origin: this.origin, protocol: this.protocol, username: this.username, password: this.password, host: this.host, hostname: this.hostname, port: this.port, pathname: this.pathname, search: this.search, searchParams: this.searchParams, hash: this.hash };
        }
        clone() {
          return new m(String(this), this[l].options);
        }
      }
    }, 7788: (a, b, c) => {
      "use strict";
      c.d(b, { $p: () => i, cg: () => h, xl: () => g });
      let d = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class e {
        disable() {
          throw d;
        }
        getStore() {
        }
        run() {
          throw d;
        }
        exit() {
          throw d;
        }
        enterWith() {
          throw d;
        }
        static bind(a2) {
          return a2;
        }
      }
      let f = "u" > typeof globalThis && globalThis.AsyncLocalStorage;
      function g() {
        return f ? new f() : new e();
      }
      function h(a2) {
        return f ? f.bind(a2) : e.bind(a2);
      }
      function i() {
        return f ? f.snapshot() : function(a2, ...b2) {
          return a2(...b2);
        };
      }
    }, 7879: (a, b, c) => {
      "use strict";
      a.exports = c(1587);
    }, 7925: (a, b, c) => {
      "use strict";
      c.d(b, { xl: () => g });
      let d = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class e {
        disable() {
          throw d;
        }
        getStore() {
        }
        run() {
          throw d;
        }
        exit() {
          throw d;
        }
        enterWith() {
          throw d;
        }
        static bind(a2) {
          return a2;
        }
      }
      let f = "u" > typeof globalThis && globalThis.AsyncLocalStorage;
      function g() {
        return f ? new f() : new e();
      }
    }, 7961: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true }), b.URL = b.DNS = b.stringToBytes = void 0;
      let d = c(8566), e = c(4308);
      function f(a2) {
        let b2 = new Uint8Array((a2 = unescape(encodeURIComponent(a2))).length);
        for (let c2 = 0; c2 < a2.length; ++c2) b2[c2] = a2.charCodeAt(c2);
        return b2;
      }
      b.stringToBytes = f, b.DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8", b.URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8", b.default = function(a2, b2, c2, g, h, i) {
        let j = "string" == typeof c2 ? f(c2) : c2, k = "string" == typeof g ? (0, d.default)(g) : g;
        if ("string" == typeof g && (g = (0, d.default)(g)), g?.length !== 16) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
        let l = new Uint8Array(16 + j.length);
        if (l.set(k), l.set(j, k.length), (l = b2(l))[6] = 15 & l[6] | a2, l[8] = 63 & l[8] | 128, h) {
          if ((i = i || 0) < 0 || i + 16 > h.length) throw RangeError(`UUID byte range ${i}:${i + 15} is out of buffer bounds`);
          for (let a3 = 0; a3 < 16; ++a3) h[i + a3] = l[a3];
          return h;
        }
        return (0, e.unsafeStringify)(l);
      };
    }, 7993: (a) => {
      a.exports = function(a2) {
        return a2 && a2.__esModule ? a2 : { default: a2 };
      }, a.exports.__esModule = true, a.exports.default = a.exports;
    }, 8340: (a, b) => {
      "use strict";
      function c(a2, b2) {
        return a2 << b2 | a2 >>> 32 - b2;
      }
      Object.defineProperty(b, "__esModule", { value: true }), b.default = function(a2) {
        let b2 = [1518500249, 1859775393, 2400959708, 3395469782], d = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], e = new Uint8Array(a2.length + 1);
        e.set(a2), e[a2.length] = 128;
        let f = Math.ceil(((a2 = e).length / 4 + 2) / 16), g = Array(f);
        for (let b3 = 0; b3 < f; ++b3) {
          let c2 = new Uint32Array(16);
          for (let d2 = 0; d2 < 16; ++d2) c2[d2] = a2[64 * b3 + 4 * d2] << 24 | a2[64 * b3 + 4 * d2 + 1] << 16 | a2[64 * b3 + 4 * d2 + 2] << 8 | a2[64 * b3 + 4 * d2 + 3];
          g[b3] = c2;
        }
        g[f - 1][14] = (a2.length - 1) * 8 / 4294967296, g[f - 1][14] = Math.floor(g[f - 1][14]), g[f - 1][15] = (a2.length - 1) * 8 | 0;
        for (let a3 = 0; a3 < f; ++a3) {
          let e2 = new Uint32Array(80);
          for (let b3 = 0; b3 < 16; ++b3) e2[b3] = g[a3][b3];
          for (let a4 = 16; a4 < 80; ++a4) e2[a4] = c(e2[a4 - 3] ^ e2[a4 - 8] ^ e2[a4 - 14] ^ e2[a4 - 16], 1);
          let f2 = d[0], h = d[1], i = d[2], j = d[3], k = d[4];
          for (let a4 = 0; a4 < 80; ++a4) {
            let d2 = Math.floor(a4 / 20), g2 = c(f2, 5) + function(a5, b3, c2, d3) {
              switch (a5) {
                case 0:
                  return b3 & c2 ^ ~b3 & d3;
                case 1:
                case 3:
                  return b3 ^ c2 ^ d3;
                case 2:
                  return b3 & c2 ^ b3 & d3 ^ c2 & d3;
              }
            }(d2, h, i, j) + k + b2[d2] + e2[a4] >>> 0;
            k = j, j = i, i = c(h, 30) >>> 0, h = f2, f2 = g2;
          }
          d[0] = d[0] + f2 >>> 0, d[1] = d[1] + h >>> 0, d[2] = d[2] + i >>> 0, d[3] = d[3] + j >>> 0, d[4] = d[4] + k >>> 0;
        }
        return Uint8Array.of(d[0] >> 24, d[0] >> 16, d[0] >> 8, d[0], d[1] >> 24, d[1] >> 16, d[1] >> 8, d[1], d[2] >> 24, d[2] >> 16, d[2] >> 8, d[2], d[3] >> 24, d[3] >> 16, d[3] >> 8, d[3], d[4] >> 24, d[4] >> 16, d[4] >> 8, d[4]);
      };
    }, 8479: (a, b, c) => {
      "use strict";
      var d = c(7993);
      Object.defineProperty(b, "__esModule", { value: true });
      var e = { encode: true, decode: true, getToken: true };
      b.decode = l, b.encode = k, b.getToken = m;
      var f = c(3781), g = d(c(3061)), h = c(7015), i = c(9131), j = c(2036);
      async function k(a2) {
        let { token: b2 = {}, secret: c2, maxAge: d2 = 2592e3, salt: e2 = "" } = a2, g2 = await n(c2, e2);
        return await new f.EncryptJWT(b2).setProtectedHeader({ alg: "dir", enc: "A256GCM" }).setIssuedAt().setExpirationTime((Date.now() / 1e3 | 0) + d2).setJti((0, h.v4)()).encrypt(g2);
      }
      async function l(a2) {
        let { token: b2, secret: c2, salt: d2 = "" } = a2;
        if (!b2) return null;
        let e2 = await n(c2, d2), { payload: g2 } = await (0, f.jwtDecrypt)(b2, e2, { clockTolerance: 15 });
        return g2;
      }
      async function m(a2) {
        var b2, c2, d2, e2;
        let { req: f2, secureCookie: g2 = null != (b2 = null == (c2 = process.env.NEXTAUTH_URL) ? void 0 : c2.startsWith("https://")) ? b2 : !!process.env.VERCEL, cookieName: h2 = g2 ? "__Secure-next-auth.session-token" : "next-auth.session-token", raw: j2, decode: k2 = l, logger: m2 = console, secret: n2 = null != (d2 = process.env.NEXTAUTH_SECRET) ? d2 : process.env.AUTH_SECRET } = a2;
        if (!f2) throw Error("Must pass `req` to JWT getToken()");
        let o = new i.SessionStore({ name: h2, options: { secure: g2 } }, { cookies: f2.cookies, headers: f2.headers }, m2).value, p = f2.headers instanceof Headers ? f2.headers.get("authorization") : null == (e2 = f2.headers) ? void 0 : e2.authorization;
        if (!o && (null == p ? void 0 : p.split(" ")[0]) === "Bearer") {
          let a3 = p.split(" ")[1];
          try {
            o = decodeURIComponent(a3);
          } catch (a4) {
            return null;
          }
        }
        if (!o) return null;
        if (j2) return o;
        try {
          return await k2({ token: o, secret: n2 });
        } catch (a3) {
          return null;
        }
      }
      async function n(a2, b2) {
        return await (0, g.default)("sha256", a2, b2, `NextAuth.js Generated Encryption Key${b2 ? ` (${b2})` : ""}`, 32);
      }
      Object.keys(j).forEach(function(a2) {
        "default" === a2 || "__esModule" === a2 || Object.prototype.hasOwnProperty.call(e, a2) || a2 in b && b[a2] === j[a2] || Object.defineProperty(b, a2, { enumerable: true, get: function() {
          return j[a2];
        } });
      });
    }, 8566: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true });
      let d = c(9293);
      b.default = function(a2) {
        let b2;
        if (!(0, d.default)(a2)) throw TypeError("Invalid UUID");
        return Uint8Array.of((b2 = parseInt(a2.slice(0, 8), 16)) >>> 24, b2 >>> 16 & 255, b2 >>> 8 & 255, 255 & b2, (b2 = parseInt(a2.slice(9, 13), 16)) >>> 8, 255 & b2, (b2 = parseInt(a2.slice(14, 18), 16)) >>> 8, 255 & b2, (b2 = parseInt(a2.slice(19, 23), 16)) >>> 8, 255 & b2, (b2 = parseInt(a2.slice(24, 36), 16)) / 1099511627776 & 255, b2 / 4294967296 & 255, b2 >>> 24 & 255, b2 >>> 16 & 255, b2 >>> 8 & 255, 255 & b2);
      };
    }, 8764: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true }), b.URL = b.DNS = void 0;
      let d = c(8340), e = c(7961);
      var f = c(7961);
      function g(a2, b2, c2, f2) {
        return (0, e.default)(80, d.default, a2, b2, c2, f2);
      }
      Object.defineProperty(b, "DNS", { enumerable: true, get: function() {
        return f.DNS;
      } }), Object.defineProperty(b, "URL", { enumerable: true, get: function() {
        return f.URL;
      } }), g.DNS = e.DNS, g.URL = e.URL, b.default = g;
    }, 8797: (a) => {
      (() => {
        "use strict";
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "//");
        var b = {};
        (() => {
          function a2(a3, b2) {
            void 0 === b2 && (b2 = {});
            for (var c2 = function(a4) {
              for (var b3 = [], c3 = 0; c3 < a4.length; ) {
                var d3 = a4[c3];
                if ("*" === d3 || "+" === d3 || "?" === d3) {
                  b3.push({ type: "MODIFIER", index: c3, value: a4[c3++] });
                  continue;
                }
                if ("\\" === d3) {
                  b3.push({ type: "ESCAPED_CHAR", index: c3++, value: a4[c3++] });
                  continue;
                }
                if ("{" === d3) {
                  b3.push({ type: "OPEN", index: c3, value: a4[c3++] });
                  continue;
                }
                if ("}" === d3) {
                  b3.push({ type: "CLOSE", index: c3, value: a4[c3++] });
                  continue;
                }
                if (":" === d3) {
                  for (var e2 = "", f3 = c3 + 1; f3 < a4.length; ) {
                    var g3 = a4.charCodeAt(f3);
                    if (g3 >= 48 && g3 <= 57 || g3 >= 65 && g3 <= 90 || g3 >= 97 && g3 <= 122 || 95 === g3) {
                      e2 += a4[f3++];
                      continue;
                    }
                    break;
                  }
                  if (!e2) throw TypeError("Missing parameter name at ".concat(c3));
                  b3.push({ type: "NAME", index: c3, value: e2 }), c3 = f3;
                  continue;
                }
                if ("(" === d3) {
                  var h3 = 1, i2 = "", f3 = c3 + 1;
                  if ("?" === a4[f3]) throw TypeError('Pattern cannot start with "?" at '.concat(f3));
                  for (; f3 < a4.length; ) {
                    if ("\\" === a4[f3]) {
                      i2 += a4[f3++] + a4[f3++];
                      continue;
                    }
                    if (")" === a4[f3]) {
                      if (0 == --h3) {
                        f3++;
                        break;
                      }
                    } else if ("(" === a4[f3] && (h3++, "?" !== a4[f3 + 1])) throw TypeError("Capturing groups are not allowed at ".concat(f3));
                    i2 += a4[f3++];
                  }
                  if (h3) throw TypeError("Unbalanced pattern at ".concat(c3));
                  if (!i2) throw TypeError("Missing pattern at ".concat(c3));
                  b3.push({ type: "PATTERN", index: c3, value: i2 }), c3 = f3;
                  continue;
                }
                b3.push({ type: "CHAR", index: c3, value: a4[c3++] });
              }
              return b3.push({ type: "END", index: c3, value: "" }), b3;
            }(a3), d2 = b2.prefixes, f2 = void 0 === d2 ? "./" : d2, g2 = b2.delimiter, h2 = void 0 === g2 ? "/#?" : g2, i = [], j = 0, k = 0, l = "", m = function(a4) {
              if (k < c2.length && c2[k].type === a4) return c2[k++].value;
            }, n = function(a4) {
              var b3 = m(a4);
              if (void 0 !== b3) return b3;
              var d3 = c2[k], e2 = d3.type, f3 = d3.index;
              throw TypeError("Unexpected ".concat(e2, " at ").concat(f3, ", expected ").concat(a4));
            }, o = function() {
              for (var a4, b3 = ""; a4 = m("CHAR") || m("ESCAPED_CHAR"); ) b3 += a4;
              return b3;
            }, p = function(a4) {
              for (var b3 = 0; b3 < h2.length; b3++) {
                var c3 = h2[b3];
                if (a4.indexOf(c3) > -1) return true;
              }
              return false;
            }, q = function(a4) {
              var b3 = i[i.length - 1], c3 = a4 || (b3 && "string" == typeof b3 ? b3 : "");
              if (b3 && !c3) throw TypeError('Must have text between two parameters, missing text after "'.concat(b3.name, '"'));
              return !c3 || p(c3) ? "[^".concat(e(h2), "]+?") : "(?:(?!".concat(e(c3), ")[^").concat(e(h2), "])+?");
            }; k < c2.length; ) {
              var r = m("CHAR"), s = m("NAME"), t = m("PATTERN");
              if (s || t) {
                var u = r || "";
                -1 === f2.indexOf(u) && (l += u, u = ""), l && (i.push(l), l = ""), i.push({ name: s || j++, prefix: u, suffix: "", pattern: t || q(u), modifier: m("MODIFIER") || "" });
                continue;
              }
              var v = r || m("ESCAPED_CHAR");
              if (v) {
                l += v;
                continue;
              }
              if (l && (i.push(l), l = ""), m("OPEN")) {
                var u = o(), w = m("NAME") || "", x = m("PATTERN") || "", y = o();
                n("CLOSE"), i.push({ name: w || (x ? j++ : ""), pattern: w && !x ? q(u) : x, prefix: u, suffix: y, modifier: m("MODIFIER") || "" });
                continue;
              }
              n("END");
            }
            return i;
          }
          function c(a3, b2) {
            void 0 === b2 && (b2 = {});
            var c2 = f(b2), d2 = b2.encode, e2 = void 0 === d2 ? function(a4) {
              return a4;
            } : d2, g2 = b2.validate, h2 = void 0 === g2 || g2, i = a3.map(function(a4) {
              if ("object" == typeof a4) return new RegExp("^(?:".concat(a4.pattern, ")$"), c2);
            });
            return function(b3) {
              for (var c3 = "", d3 = 0; d3 < a3.length; d3++) {
                var f2 = a3[d3];
                if ("string" == typeof f2) {
                  c3 += f2;
                  continue;
                }
                var g3 = b3 ? b3[f2.name] : void 0, j = "?" === f2.modifier || "*" === f2.modifier, k = "*" === f2.modifier || "+" === f2.modifier;
                if (Array.isArray(g3)) {
                  if (!k) throw TypeError('Expected "'.concat(f2.name, '" to not repeat, but got an array'));
                  if (0 === g3.length) {
                    if (j) continue;
                    throw TypeError('Expected "'.concat(f2.name, '" to not be empty'));
                  }
                  for (var l = 0; l < g3.length; l++) {
                    var m = e2(g3[l], f2);
                    if (h2 && !i[d3].test(m)) throw TypeError('Expected all "'.concat(f2.name, '" to match "').concat(f2.pattern, '", but got "').concat(m, '"'));
                    c3 += f2.prefix + m + f2.suffix;
                  }
                  continue;
                }
                if ("string" == typeof g3 || "number" == typeof g3) {
                  var m = e2(String(g3), f2);
                  if (h2 && !i[d3].test(m)) throw TypeError('Expected "'.concat(f2.name, '" to match "').concat(f2.pattern, '", but got "').concat(m, '"'));
                  c3 += f2.prefix + m + f2.suffix;
                  continue;
                }
                if (!j) {
                  var n = k ? "an array" : "a string";
                  throw TypeError('Expected "'.concat(f2.name, '" to be ').concat(n));
                }
              }
              return c3;
            };
          }
          function d(a3, b2, c2) {
            void 0 === c2 && (c2 = {});
            var d2 = c2.decode, e2 = void 0 === d2 ? function(a4) {
              return a4;
            } : d2;
            return function(c3) {
              var d3 = a3.exec(c3);
              if (!d3) return false;
              for (var f2 = d3[0], g2 = d3.index, h2 = /* @__PURE__ */ Object.create(null), i = 1; i < d3.length; i++) !function(a4) {
                if (void 0 !== d3[a4]) {
                  var c4 = b2[a4 - 1];
                  "*" === c4.modifier || "+" === c4.modifier ? h2[c4.name] = d3[a4].split(c4.prefix + c4.suffix).map(function(a5) {
                    return e2(a5, c4);
                  }) : h2[c4.name] = e2(d3[a4], c4);
                }
              }(i);
              return { path: f2, index: g2, params: h2 };
            };
          }
          function e(a3) {
            return a3.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
          }
          function f(a3) {
            return a3 && a3.sensitive ? "" : "i";
          }
          function g(a3, b2, c2) {
            void 0 === c2 && (c2 = {});
            for (var d2 = c2.strict, g2 = void 0 !== d2 && d2, h2 = c2.start, i = c2.end, j = c2.encode, k = void 0 === j ? function(a4) {
              return a4;
            } : j, l = c2.delimiter, m = c2.endsWith, n = "[".concat(e(void 0 === m ? "" : m), "]|$"), o = "[".concat(e(void 0 === l ? "/#?" : l), "]"), p = void 0 === h2 || h2 ? "^" : "", q = 0; q < a3.length; q++) {
              var r = a3[q];
              if ("string" == typeof r) p += e(k(r));
              else {
                var s = e(k(r.prefix)), t = e(k(r.suffix));
                if (r.pattern) if (b2 && b2.push(r), s || t) if ("+" === r.modifier || "*" === r.modifier) {
                  var u = "*" === r.modifier ? "?" : "";
                  p += "(?:".concat(s, "((?:").concat(r.pattern, ")(?:").concat(t).concat(s, "(?:").concat(r.pattern, "))*)").concat(t, ")").concat(u);
                } else p += "(?:".concat(s, "(").concat(r.pattern, ")").concat(t, ")").concat(r.modifier);
                else {
                  if ("+" === r.modifier || "*" === r.modifier) throw TypeError('Can not repeat "'.concat(r.name, '" without a prefix and suffix'));
                  p += "(".concat(r.pattern, ")").concat(r.modifier);
                }
                else p += "(?:".concat(s).concat(t, ")").concat(r.modifier);
              }
            }
            if (void 0 === i || i) g2 || (p += "".concat(o, "?")), p += c2.endsWith ? "(?=".concat(n, ")") : "$";
            else {
              var v = a3[a3.length - 1], w = "string" == typeof v ? o.indexOf(v[v.length - 1]) > -1 : void 0 === v;
              g2 || (p += "(?:".concat(o, "(?=").concat(n, "))?")), w || (p += "(?=".concat(o, "|").concat(n, ")"));
            }
            return new RegExp(p, f(c2));
          }
          function h(b2, c2, d2) {
            if (b2 instanceof RegExp) {
              var e2;
              if (!c2) return b2;
              for (var i = /\((?:\?<(.*?)>)?(?!\?)/g, j = 0, k = i.exec(b2.source); k; ) c2.push({ name: k[1] || j++, prefix: "", suffix: "", modifier: "", pattern: "" }), k = i.exec(b2.source);
              return b2;
            }
            return Array.isArray(b2) ? (e2 = b2.map(function(a3) {
              return h(a3, c2, d2).source;
            }), new RegExp("(?:".concat(e2.join("|"), ")"), f(d2))) : g(a2(b2, d2), c2, d2);
          }
          Object.defineProperty(b, "__esModule", { value: true }), b.pathToRegexp = b.tokensToRegexp = b.regexpToFunction = b.match = b.tokensToFunction = b.compile = b.parse = void 0, b.parse = a2, b.compile = function(b2, d2) {
            return c(a2(b2, d2), d2);
          }, b.tokensToFunction = c, b.match = function(a3, b2) {
            var c2 = [];
            return d(h(a3, c2, b2), c2, b2);
          }, b.regexpToFunction = d, b.tokensToRegexp = g, b.pathToRegexp = h;
        })(), a.exports = b;
      })();
    }, 8850: (a) => {
      (() => {
        "use strict";
        var b = { 234: (a2) => {
          var b2 = Object.prototype.hasOwnProperty, c2 = "~";
          function d2() {
          }
          function e2(a3, b3, c3) {
            this.fn = a3, this.context = b3, this.once = c3 || false;
          }
          function f(a3, b3, d3, f2, g2) {
            if ("function" != typeof d3) throw TypeError("The listener must be a function");
            var h2 = new e2(d3, f2 || a3, g2), i = c2 ? c2 + b3 : b3;
            return a3._events[i] ? a3._events[i].fn ? a3._events[i] = [a3._events[i], h2] : a3._events[i].push(h2) : (a3._events[i] = h2, a3._eventsCount++), a3;
          }
          function g(a3, b3) {
            0 == --a3._eventsCount ? a3._events = new d2() : delete a3._events[b3];
          }
          function h() {
            this._events = new d2(), this._eventsCount = 0;
          }
          Object.create && (d2.prototype = /* @__PURE__ */ Object.create(null), new d2().__proto__ || (c2 = false)), h.prototype.eventNames = function() {
            var a3, d3, e3 = [];
            if (0 === this._eventsCount) return e3;
            for (d3 in a3 = this._events) b2.call(a3, d3) && e3.push(c2 ? d3.slice(1) : d3);
            return Object.getOwnPropertySymbols ? e3.concat(Object.getOwnPropertySymbols(a3)) : e3;
          }, h.prototype.listeners = function(a3) {
            var b3 = c2 ? c2 + a3 : a3, d3 = this._events[b3];
            if (!d3) return [];
            if (d3.fn) return [d3.fn];
            for (var e3 = 0, f2 = d3.length, g2 = Array(f2); e3 < f2; e3++) g2[e3] = d3[e3].fn;
            return g2;
          }, h.prototype.listenerCount = function(a3) {
            var b3 = c2 ? c2 + a3 : a3, d3 = this._events[b3];
            return d3 ? d3.fn ? 1 : d3.length : 0;
          }, h.prototype.emit = function(a3, b3, d3, e3, f2, g2) {
            var h2 = c2 ? c2 + a3 : a3;
            if (!this._events[h2]) return false;
            var i, j, k = this._events[h2], l = arguments.length;
            if (k.fn) {
              switch (k.once && this.removeListener(a3, k.fn, void 0, true), l) {
                case 1:
                  return k.fn.call(k.context), true;
                case 2:
                  return k.fn.call(k.context, b3), true;
                case 3:
                  return k.fn.call(k.context, b3, d3), true;
                case 4:
                  return k.fn.call(k.context, b3, d3, e3), true;
                case 5:
                  return k.fn.call(k.context, b3, d3, e3, f2), true;
                case 6:
                  return k.fn.call(k.context, b3, d3, e3, f2, g2), true;
              }
              for (j = 1, i = Array(l - 1); j < l; j++) i[j - 1] = arguments[j];
              k.fn.apply(k.context, i);
            } else {
              var m, n = k.length;
              for (j = 0; j < n; j++) switch (k[j].once && this.removeListener(a3, k[j].fn, void 0, true), l) {
                case 1:
                  k[j].fn.call(k[j].context);
                  break;
                case 2:
                  k[j].fn.call(k[j].context, b3);
                  break;
                case 3:
                  k[j].fn.call(k[j].context, b3, d3);
                  break;
                case 4:
                  k[j].fn.call(k[j].context, b3, d3, e3);
                  break;
                default:
                  if (!i) for (m = 1, i = Array(l - 1); m < l; m++) i[m - 1] = arguments[m];
                  k[j].fn.apply(k[j].context, i);
              }
            }
            return true;
          }, h.prototype.on = function(a3, b3, c3) {
            return f(this, a3, b3, c3, false);
          }, h.prototype.once = function(a3, b3, c3) {
            return f(this, a3, b3, c3, true);
          }, h.prototype.removeListener = function(a3, b3, d3, e3) {
            var f2 = c2 ? c2 + a3 : a3;
            if (!this._events[f2]) return this;
            if (!b3) return g(this, f2), this;
            var h2 = this._events[f2];
            if (h2.fn) h2.fn !== b3 || e3 && !h2.once || d3 && h2.context !== d3 || g(this, f2);
            else {
              for (var i = 0, j = [], k = h2.length; i < k; i++) (h2[i].fn !== b3 || e3 && !h2[i].once || d3 && h2[i].context !== d3) && j.push(h2[i]);
              j.length ? this._events[f2] = 1 === j.length ? j[0] : j : g(this, f2);
            }
            return this;
          }, h.prototype.removeAllListeners = function(a3) {
            var b3;
            return a3 ? (b3 = c2 ? c2 + a3 : a3, this._events[b3] && g(this, b3)) : (this._events = new d2(), this._eventsCount = 0), this;
          }, h.prototype.off = h.prototype.removeListener, h.prototype.addListener = h.prototype.on, h.prefixed = c2, h.EventEmitter = h, a2.exports = h;
        }, 274: (a2) => {
          a2.exports = (a3, b2) => (b2 = b2 || (() => {
          }), a3.then((a4) => new Promise((a5) => {
            a5(b2());
          }).then(() => a4), (a4) => new Promise((a5) => {
            a5(b2());
          }).then(() => {
            throw a4;
          })));
        }, 294: (a2, b2) => {
          Object.defineProperty(b2, "__esModule", { value: true }), b2.default = function(a3, b3, c2) {
            let d2 = 0, e2 = a3.length;
            for (; e2 > 0; ) {
              let f = e2 / 2 | 0, g = d2 + f;
              0 >= c2(a3[g], b3) ? (d2 = ++g, e2 -= f + 1) : e2 = f;
            }
            return d2;
          };
        }, 838: (a2, b2, c2) => {
          Object.defineProperty(b2, "__esModule", { value: true });
          let d2 = c2(294);
          class e2 {
            constructor() {
              this._queue = [];
            }
            enqueue(a3, b3) {
              let c3 = { priority: (b3 = Object.assign({ priority: 0 }, b3)).priority, run: a3 };
              if (this.size && this._queue[this.size - 1].priority >= b3.priority) return void this._queue.push(c3);
              let e3 = d2.default(this._queue, c3, (a4, b4) => b4.priority - a4.priority);
              this._queue.splice(e3, 0, c3);
            }
            dequeue() {
              let a3 = this._queue.shift();
              return null == a3 ? void 0 : a3.run;
            }
            filter(a3) {
              return this._queue.filter((b3) => b3.priority === a3.priority).map((a4) => a4.run);
            }
            get size() {
              return this._queue.length;
            }
          }
          b2.default = e2;
        }, 138: (a2, b2, c2) => {
          let d2 = c2(274);
          class e2 extends Error {
            constructor(a3) {
              super(a3), this.name = "TimeoutError";
            }
          }
          let f = (a3, b3, c3) => new Promise((f2, g) => {
            if ("number" != typeof b3 || b3 < 0) throw TypeError("Expected `milliseconds` to be a positive number");
            if (b3 === 1 / 0) return void f2(a3);
            let h = setTimeout(() => {
              if ("function" == typeof c3) {
                try {
                  f2(c3());
                } catch (a4) {
                  g(a4);
                }
                return;
              }
              let d3 = "string" == typeof c3 ? c3 : `Promise timed out after ${b3} milliseconds`, h2 = c3 instanceof Error ? c3 : new e2(d3);
              "function" == typeof a3.cancel && a3.cancel(), g(h2);
            }, b3);
            d2(a3.then(f2, g), () => {
              clearTimeout(h);
            });
          });
          a2.exports = f, a2.exports.default = f, a2.exports.TimeoutError = e2;
        } }, c = {};
        function d(a2) {
          var e2 = c[a2];
          if (void 0 !== e2) return e2.exports;
          var f = c[a2] = { exports: {} }, g = true;
          try {
            b[a2](f, f.exports, d), g = false;
          } finally {
            g && delete c[a2];
          }
          return f.exports;
        }
        d.ab = "//";
        var e = {};
        (() => {
          Object.defineProperty(e, "__esModule", { value: true });
          let a2 = d(234), b2 = d(138), c2 = d(838), f = () => {
          }, g = new b2.TimeoutError();
          class h extends a2 {
            constructor(a3) {
              var b3, d2, e2, g2;
              if (super(), this._intervalCount = 0, this._intervalEnd = 0, this._pendingCount = 0, this._resolveEmpty = f, this._resolveIdle = f, !("number" == typeof (a3 = Object.assign({ carryoverConcurrencyCount: false, intervalCap: 1 / 0, interval: 0, concurrency: 1 / 0, autoStart: true, queueClass: c2.default }, a3)).intervalCap && a3.intervalCap >= 1)) throw TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${null != (d2 = null == (b3 = a3.intervalCap) ? void 0 : b3.toString()) ? d2 : ""}\` (${typeof a3.intervalCap})`);
              if (void 0 === a3.interval || !(Number.isFinite(a3.interval) && a3.interval >= 0)) throw TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${null != (g2 = null == (e2 = a3.interval) ? void 0 : e2.toString()) ? g2 : ""}\` (${typeof a3.interval})`);
              this._carryoverConcurrencyCount = a3.carryoverConcurrencyCount, this._isIntervalIgnored = a3.intervalCap === 1 / 0 || 0 === a3.interval, this._intervalCap = a3.intervalCap, this._interval = a3.interval, this._queue = new a3.queueClass(), this._queueClass = a3.queueClass, this.concurrency = a3.concurrency, this._timeout = a3.timeout, this._throwOnTimeout = true === a3.throwOnTimeout, this._isPaused = false === a3.autoStart;
            }
            get _doesIntervalAllowAnother() {
              return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
            }
            get _doesConcurrentAllowAnother() {
              return this._pendingCount < this._concurrency;
            }
            _next() {
              this._pendingCount--, this._tryToStartAnother(), this.emit("next");
            }
            _resolvePromises() {
              this._resolveEmpty(), this._resolveEmpty = f, 0 === this._pendingCount && (this._resolveIdle(), this._resolveIdle = f, this.emit("idle"));
            }
            _onResumeInterval() {
              this._onInterval(), this._initializeIntervalIfNeeded(), this._timeoutId = void 0;
            }
            _isIntervalPaused() {
              let a3 = Date.now();
              if (void 0 === this._intervalId) {
                let b3 = this._intervalEnd - a3;
                if (!(b3 < 0)) return void 0 === this._timeoutId && (this._timeoutId = setTimeout(() => {
                  this._onResumeInterval();
                }, b3)), true;
                this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
              }
              return false;
            }
            _tryToStartAnother() {
              if (0 === this._queue.size) return this._intervalId && clearInterval(this._intervalId), this._intervalId = void 0, this._resolvePromises(), false;
              if (!this._isPaused) {
                let a3 = !this._isIntervalPaused();
                if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
                  let b3 = this._queue.dequeue();
                  return !!b3 && (this.emit("active"), b3(), a3 && this._initializeIntervalIfNeeded(), true);
                }
              }
              return false;
            }
            _initializeIntervalIfNeeded() {
              this._isIntervalIgnored || void 0 !== this._intervalId || (this._intervalId = setInterval(() => {
                this._onInterval();
              }, this._interval), this._intervalEnd = Date.now() + this._interval);
            }
            _onInterval() {
              0 === this._intervalCount && 0 === this._pendingCount && this._intervalId && (clearInterval(this._intervalId), this._intervalId = void 0), this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0, this._processQueue();
            }
            _processQueue() {
              for (; this._tryToStartAnother(); ) ;
            }
            get concurrency() {
              return this._concurrency;
            }
            set concurrency(a3) {
              if (!("number" == typeof a3 && a3 >= 1)) throw TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${a3}\` (${typeof a3})`);
              this._concurrency = a3, this._processQueue();
            }
            async add(a3, c3 = {}) {
              return new Promise((d2, e2) => {
                let f2 = async () => {
                  this._pendingCount++, this._intervalCount++;
                  try {
                    let f3 = void 0 === this._timeout && void 0 === c3.timeout ? a3() : b2.default(Promise.resolve(a3()), void 0 === c3.timeout ? this._timeout : c3.timeout, () => {
                      (void 0 === c3.throwOnTimeout ? this._throwOnTimeout : c3.throwOnTimeout) && e2(g);
                    });
                    d2(await f3);
                  } catch (a4) {
                    e2(a4);
                  }
                  this._next();
                };
                this._queue.enqueue(f2, c3), this._tryToStartAnother(), this.emit("add");
              });
            }
            async addAll(a3, b3) {
              return Promise.all(a3.map(async (a4) => this.add(a4, b3)));
            }
            start() {
              return this._isPaused && (this._isPaused = false, this._processQueue()), this;
            }
            pause() {
              this._isPaused = true;
            }
            clear() {
              this._queue = new this._queueClass();
            }
            async onEmpty() {
              if (0 !== this._queue.size) return new Promise((a3) => {
                let b3 = this._resolveEmpty;
                this._resolveEmpty = () => {
                  b3(), a3();
                };
              });
            }
            async onIdle() {
              if (0 !== this._pendingCount || 0 !== this._queue.size) return new Promise((a3) => {
                let b3 = this._resolveIdle;
                this._resolveIdle = () => {
                  b3(), a3();
                };
              });
            }
            get size() {
              return this._queue.size;
            }
            sizeBy(a3) {
              return this._queue.filter(a3).length;
            }
            get pending() {
              return this._pendingCount;
            }
            get isPaused() {
              return this._isPaused;
            }
            get timeout() {
              return this._timeout;
            }
            set timeout(a3) {
              this._timeout = a3;
            }
          }
          e.default = h;
        })(), a.exports = e;
      })();
    }, 9118: (a, b) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true }), b.default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;
    }, 9131: (a, b) => {
      "use strict";
      function c(a2, b2, c2) {
        d(a2, b2), b2.set(a2, c2);
      }
      function d(a2, b2) {
        if (b2.has(a2)) throw TypeError("Cannot initialize the same private elements twice on an object");
      }
      function e(a2, b2) {
        return a2.get(g(a2, b2));
      }
      function f(a2, b2, c2) {
        return a2.set(g(a2, b2), c2), c2;
      }
      function g(a2, b2, c2) {
        if ("function" == typeof a2 ? a2 === b2 : a2.has(b2)) return arguments.length < 3 ? b2 : c2;
        throw TypeError("Private element is not present on this object");
      }
      Object.defineProperty(b, "__esModule", { value: true }), b.SessionStore = void 0, b.defaultCookies = function(a2) {
        let b2 = a2 ? "__Secure-" : "";
        return { sessionToken: { name: `${b2}next-auth.session-token`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: a2 } }, callbackUrl: { name: `${b2}next-auth.callback-url`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: a2 } }, csrfToken: { name: `${a2 ? "__Host-" : ""}next-auth.csrf-token`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: a2 } }, pkceCodeVerifier: { name: `${b2}next-auth.pkce.code_verifier`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: a2, maxAge: 900 } }, state: { name: `${b2}next-auth.state`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: a2, maxAge: 900 } }, nonce: { name: `${b2}next-auth.nonce`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: a2 } } };
      };
      var h = /* @__PURE__ */ new WeakMap(), i = /* @__PURE__ */ new WeakMap(), j = /* @__PURE__ */ new WeakMap(), k = /* @__PURE__ */ new WeakSet();
      class l {
        constructor(a2, b2, g2) {
          !function(a3, b3) {
            d(a3, b3), b3.add(a3);
          }(this, k), c(this, h, {}), c(this, i, void 0), c(this, j, void 0), f(j, this, g2), f(i, this, a2);
          const { cookies: l2 } = b2, { name: m2 } = a2;
          if ("function" == typeof (null == l2 ? void 0 : l2.getAll)) for (const { name: a3, value: b3 } of l2.getAll()) a3.startsWith(m2) && (e(h, this)[a3] = b3);
          else if (l2 instanceof Map) for (const a3 of l2.keys()) a3.startsWith(m2) && (e(h, this)[a3] = l2.get(a3));
          else for (const a3 in l2) a3.startsWith(m2) && (e(h, this)[a3] = l2[a3]);
        }
        get value() {
          return Object.keys(e(h, this)).sort((a2, b2) => {
            var c2, d2;
            return parseInt(null != (c2 = a2.split(".").pop()) ? c2 : "0") - parseInt(null != (d2 = b2.split(".").pop()) ? d2 : "0");
          }).map((a2) => e(h, this)[a2]).join("");
        }
        chunk(a2, b2) {
          let c2 = g(k, this, n).call(this);
          for (let d2 of g(k, this, m).call(this, { name: e(i, this).name, value: a2, options: { ...e(i, this).options, ...b2 } })) c2[d2.name] = d2;
          return Object.values(c2);
        }
        clean() {
          return Object.values(g(k, this, n).call(this));
        }
      }
      function m(a2) {
        let b2 = Math.ceil(a2.value.length / 3933);
        if (1 === b2) return e(h, this)[a2.name] = a2.value, [a2];
        let c2 = [];
        for (let d2 = 0; d2 < b2; d2++) {
          let b3 = `${a2.name}.${d2}`, f2 = a2.value.substr(3933 * d2, 3933);
          c2.push({ ...a2, name: b3, value: f2 }), e(h, this)[b3] = f2;
        }
        return e(j, this).debug("CHUNKING_SESSION_COOKIE", { message: "Session cookie exceeds allowed 4096 bytes.", emptyCookieSize: 163, valueSize: a2.value.length, chunks: c2.map((a3) => a3.value.length + 163) }), c2;
      }
      function n() {
        let a2 = {};
        for (let c2 in e(h, this)) {
          var b2;
          null == (b2 = e(h, this)) || delete b2[c2], a2[c2] = { name: c2, value: "", options: { ...e(i, this).options, maxAge: 0 } };
        }
        return a2;
      }
      b.SessionStore = l;
    }, 9293: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true });
      let d = c(9118);
      b.default = function(a2) {
        return "string" == typeof a2 && d.default.test(a2);
      };
    }, 9344: (a, b) => {
      "use strict";
      let c;
      Object.defineProperty(b, "__esModule", { value: true });
      let d = new Uint8Array(16);
      b.default = function() {
        if (!c) {
          if ("u" < typeof crypto || !crypto.getRandomValues) throw Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
          c = crypto.getRandomValues.bind(crypto);
        }
        return c(d);
      };
    }, 9437: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true });
      var d = {};
      Object.defineProperty(b, "default", { enumerable: true, get: function() {
        return e.default;
      } });
      var e = function(a2) {
        if (a2 && a2.__esModule) return a2;
        if (null === a2 || "object" != typeof a2 && "function" != typeof a2) return { default: a2 };
        var b2 = f(void 0);
        if (b2 && b2.has(a2)) return b2.get(a2);
        var c2 = { __proto__: null }, d2 = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var e2 in a2) if ("default" !== e2 && {}.hasOwnProperty.call(a2, e2)) {
          var g = d2 ? Object.getOwnPropertyDescriptor(a2, e2) : null;
          g && (g.get || g.set) ? Object.defineProperty(c2, e2, g) : c2[e2] = a2[e2];
        }
        return c2.default = a2, b2 && b2.set(a2, c2), c2;
      }(c(1551));
      function f(a2) {
        if ("function" != typeof WeakMap) return null;
        var b2 = /* @__PURE__ */ new WeakMap(), c2 = /* @__PURE__ */ new WeakMap();
        return (f = function(a3) {
          return a3 ? c2 : b2;
        })(a2);
      }
      Object.keys(e).forEach(function(a2) {
        "default" === a2 || "__esModule" === a2 || Object.prototype.hasOwnProperty.call(d, a2) || a2 in b && b[a2] === e[a2] || Object.defineProperty(b, a2, { enumerable: true, get: function() {
          return e[a2];
        } });
      });
    }, 9531: (a, b, c) => {
      "use strict";
      c.d(b, { J: () => i });
      var d = c(7644), e = c(385), f = c(6664), g = c(6221);
      let h = Symbol("internal request");
      class i extends Request {
        constructor(a2, b2 = {}) {
          const c2 = "string" != typeof a2 && "url" in a2 ? a2.url : String(a2);
          (0, e.qU)(c2), a2 instanceof Request ? super(a2, b2) : super(c2, b2);
          const f2 = new d.X(c2, { headers: (0, e.Cu)(this.headers), nextConfig: b2.nextConfig });
          this[h] = { cookies: new g.tm(this.headers), nextUrl: f2, url: f2.toString() };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[h].cookies;
        }
        get nextUrl() {
          return this[h].nextUrl;
        }
        get page() {
          throw new f.Yq();
        }
        get ua() {
          throw new f.l_();
        }
        get url() {
          return this[h].url;
        }
      }
    }, 9735: (a) => {
      "use strict";
      var b = Object.defineProperty, c = Object.getOwnPropertyDescriptor, d = Object.getOwnPropertyNames, e = Object.prototype.hasOwnProperty, f = {}, g = { Analytics: () => l };
      for (var h in g) b(f, h, { get: g[h], enumerable: true });
      a.exports = ((a2, f2, g2) => {
        if (f2 && "object" == typeof f2 || "function" == typeof f2) for (let h2 of d(f2)) e.call(a2, h2) || void 0 === h2 || b(a2, h2, { get: () => f2[h2], enumerable: !(g2 = c(f2, h2)) || g2.enumerable });
        return a2;
      })(b({}, "__esModule", { value: true }), f);
      var i = `
local key = KEYS[1]
local field = ARGV[1]

local data = redis.call("ZRANGE", key, 0, -1, "WITHSCORES")
local count = {}

for i = 1, #data, 2 do
  local json_str = data[i]
  local score = tonumber(data[i + 1])
  local obj = cjson.decode(json_str)

  local fieldValue = obj[field]

  if count[fieldValue] == nil then
    count[fieldValue] = score
  else
    count[fieldValue] = count[fieldValue] + score
  end
end

local result = {}
for k, v in pairs(count) do
  table.insert(result, {k, v})
end

return result
`, j = `
local prefix = KEYS[1]
local first_timestamp = tonumber(ARGV[1]) -- First timestamp to check
local increment = tonumber(ARGV[2])       -- Increment between each timestamp
local num_timestamps = tonumber(ARGV[3])  -- Number of timestampts to check (24 for a day and 24 * 7 for a week)
local num_elements = tonumber(ARGV[4])    -- Number of elements to fetch in each category
local check_at_most = tonumber(ARGV[5])   -- Number of elements to check at most.

local keys = {}
for i = 1, num_timestamps do
  local timestamp = first_timestamp - (i - 1) * increment
  table.insert(keys, prefix .. ":" .. timestamp)
end

-- get the union of the groups
local zunion_params = {"ZUNION", num_timestamps, unpack(keys)}
table.insert(zunion_params, "WITHSCORES")
local result = redis.call(unpack(zunion_params))

-- select num_elements many items
local true_group = {}
local false_group = {}
local denied_group = {}
local true_count = 0
local false_count = 0
local denied_count = 0
local i = #result - 1

-- index to stop at after going through "checkAtMost" many items:
local cutoff_index = #result - 2 * check_at_most

-- iterate over the results
while (true_count + false_count + denied_count) < (num_elements * 3) and 1 <= i and i >= cutoff_index do
  local score = tonumber(result[i + 1])
  if score > 0 then
    local element = result[i]
    if string.find(element, "success\\":true") and true_count < num_elements then
      table.insert(true_group, {score, element})
      true_count = true_count + 1
    elseif string.find(element, "success\\":false") and false_count < num_elements then
      table.insert(false_group, {score, element})
      false_count = false_count + 1
    elseif string.find(element, "success\\":\\"denied") and denied_count < num_elements then
      table.insert(denied_group, {score, element})
      denied_count = denied_count + 1
    end
  end
  i = i - 2
end

return {true_group, false_group, denied_group}
`, k = `
local prefix = KEYS[1]
local first_timestamp = tonumber(ARGV[1])
local increment = tonumber(ARGV[2])
local num_timestamps = tonumber(ARGV[3])

local keys = {}
for i = 1, num_timestamps do
  local timestamp = first_timestamp - (i - 1) * increment
  table.insert(keys, prefix .. ":" .. timestamp)
end

-- get the union of the groups
local zunion_params = {"ZUNION", num_timestamps, unpack(keys)}
table.insert(zunion_params, "WITHSCORES")
local result = redis.call(unpack(zunion_params))

return result
`, l = class {
        redis;
        prefix;
        bucketSize;
        constructor(a2) {
          this.redis = a2.redis, this.prefix = a2.prefix ?? "@upstash/analytics", this.bucketSize = this.parseWindow(a2.window);
        }
        validateTableName(a2) {
          if (!/^[a-zA-Z0-9_-]+$/.test(a2)) throw Error(`Invalid table name: ${a2}. Table names can only contain letters, numbers, dashes and underscores.`);
        }
        parseWindow(a2) {
          if ("number" == typeof a2) {
            if (a2 <= 0) throw Error(`Invalid window: ${a2}`);
            return a2;
          }
          let b2 = /^(\d+)([smhd])$/;
          if (!b2.test(a2)) throw Error(`Invalid window: ${a2}`);
          let [, c2, d2] = a2.match(b2), e2 = parseInt(c2);
          switch (d2) {
            case "s":
              return 1e3 * e2;
            case "m":
              return 1e3 * e2 * 60;
            case "h":
              return 1e3 * e2 * 3600;
            case "d":
              return 1e3 * e2 * 86400;
            default:
              throw Error(`Invalid window unit: ${d2}`);
          }
        }
        getBucket(a2) {
          return Math.floor((a2 ?? Date.now()) / this.bucketSize) * this.bucketSize;
        }
        async ingest(a2, ...b2) {
          this.validateTableName(a2), await Promise.all(b2.map(async (b3) => {
            let c2 = this.getBucket(b3.time), d2 = [this.prefix, a2, c2].join(":");
            await this.redis.zincrby(d2, 1, JSON.stringify({ ...b3, time: void 0 }));
          }));
        }
        formatBucketAggregate(a2, b2, c2) {
          let d2 = {};
          return a2.forEach(([a3, c3]) => {
            "success" == b2 && (a3 = 1 === a3 ? "true" : null === a3 ? "false" : a3), d2[b2] = d2[b2] || {}, d2[b2][(a3 ?? "null").toString()] = c3;
          }), { time: c2, ...d2 };
        }
        async aggregateBucket(a2, b2, c2) {
          this.validateTableName(a2);
          let d2 = this.getBucket(c2), e2 = [this.prefix, a2, d2].join(":"), f2 = await this.redis.eval(i, [e2], [b2]);
          return this.formatBucketAggregate(f2, b2, d2);
        }
        async aggregateBuckets(a2, b2, c2, d2) {
          this.validateTableName(a2);
          let e2 = this.getBucket(d2), f2 = [];
          for (let d3 = 0; d3 < c2; d3 += 1) f2.push(this.aggregateBucket(a2, b2, e2)), e2 -= this.bucketSize;
          return Promise.all(f2);
        }
        async aggregateBucketsWithPipeline(a2, b2, c2, d2, e2) {
          this.validateTableName(a2), e2 = e2 ?? 48;
          let f2 = this.getBucket(d2), g2 = [], h2 = this.redis.pipeline(), j2 = [];
          for (let d3 = 1; d3 <= c2; d3 += 1) {
            let k2 = [this.prefix, a2, f2].join(":");
            h2.eval(i, [k2], [b2]), g2.push(f2), f2 -= this.bucketSize, (d3 % e2 == 0 || d3 == c2) && (j2.push(h2.exec()), h2 = this.redis.pipeline());
          }
          return (await Promise.all(j2)).flat().map((a3, c3) => this.formatBucketAggregate(a3, b2, g2[c3]));
        }
        async getAllowedBlocked(a2, b2, c2) {
          this.validateTableName(a2);
          let d2 = [this.prefix, a2].join(":"), e2 = this.getBucket(c2), f2 = await this.redis.eval(k, [d2], [e2, this.bucketSize, b2]), g2 = {};
          for (let a3 = 0; a3 < f2.length; a3 += 2) {
            let b3 = f2[a3], c3 = b3.identifier, d3 = +f2[a3 + 1];
            g2[c3] || (g2[c3] = { success: 0, blocked: 0 }), g2[c3][b3.success ? "success" : "blocked"] = d3;
          }
          return g2;
        }
        async getMostAllowedBlocked(a2, b2, c2, d2, e2) {
          this.validateTableName(a2);
          let f2 = [this.prefix, a2].join(":"), g2 = this.getBucket(d2), [h2, i2, k2] = await this.redis.eval(j, [f2], [g2, this.bucketSize, b2, c2, e2 ?? 5 * c2]);
          return { allowed: this.toDicts(h2), ratelimited: this.toDicts(i2), denied: this.toDicts(k2) };
        }
        toDicts(a2) {
          let b2 = [];
          for (let c2 = 0; c2 < a2.length; c2 += 1) {
            let d2 = +a2[c2][0], e2 = a2[c2][1];
            b2.push({ identifier: e2.identifier, count: d2 });
          }
          return b2;
        }
      };
    } }, (a) => {
      var b = a(a.s = 1909);
      (_ENTRIES = "u" < typeof _ENTRIES ? {} : _ENTRIES)["middleware_src/middleware"] = b;
    }]);
  }
});

// ../../node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js
var edgeFunctionHandler_exports = {};
__export(edgeFunctionHandler_exports, {
  default: () => edgeFunctionHandler
});
async function edgeFunctionHandler(request) {
  const path3 = new URL(request.url).pathname;
  const routes = globalThis._ROUTES;
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(path3);
  } catch {
  }
  const correspondingRoute = routes.find((route) => route.regex.some((r) => {
    const regex = new RegExp(r);
    return regex.test(path3) || decodedPath !== void 0 && regex.test(decodedPath);
  }));
  if (!correspondingRoute) {
    throw new Error(`No route found for ${request.url}`);
  }
  const entry = await self._ENTRIES[`middleware_${correspondingRoute.name}`];
  const result = await entry.default({
    page: correspondingRoute.page,
    request: {
      ...request,
      page: {
        name: correspondingRoute.name
      }
    }
  });
  globalThis.__openNextAls.getStore()?.pendingPromiseRunner.add(result.waitUntil);
  const response = result.response;
  return response;
}
var init_edgeFunctionHandler = __esm({
  "../../node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js"() {
    globalThis._ENTRIES = {};
    globalThis.self = globalThis;
    globalThis._ROUTES = [{ "name": "src/middleware", "page": "/", "regex": ["^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/admin(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$"] }];
    require_edge_runtime_webpack();
    require_middleware();
  }
});

// ../../node_modules/@opennextjs/aws/dist/utils/promise.js
init_logger();

// ../../node_modules/@opennextjs/aws/dist/utils/requestCache.js
var RequestCache = class {
  _caches = /* @__PURE__ */ new Map();
  /**
   * Returns the Map registered under `key`.
   * If no Map exists yet for that key, a new empty Map is created, stored, and returned.
   * Repeated calls with the same key always return the **same** Map instance.
   */
  getOrCreate(key) {
    let cache = this._caches.get(key);
    if (!cache) {
      cache = /* @__PURE__ */ new Map();
      this._caches.set(key, cache);
    }
    return cache;
  }
};

// ../../node_modules/@opennextjs/aws/dist/utils/promise.js
var DetachedPromise = class {
  resolve;
  reject;
  promise;
  constructor() {
    let resolve;
    let reject;
    this.promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  }
};
var DetachedPromiseRunner = class {
  promises = [];
  withResolvers() {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    return detachedPromise;
  }
  add(promise) {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    promise.then(detachedPromise.resolve, detachedPromise.reject);
  }
  async await() {
    debug(`Awaiting ${this.promises.length} detached promises`);
    const results = await Promise.allSettled(this.promises.map((p) => p.promise));
    const rejectedPromises = results.filter((r) => r.status === "rejected");
    rejectedPromises.forEach((r) => {
      error(r.reason);
    });
  }
};
async function awaitAllDetachedPromise() {
  const store = globalThis.__openNextAls.getStore();
  const promisesToAwait = store?.pendingPromiseRunner.await() ?? Promise.resolve();
  if (store?.waitUntil) {
    store.waitUntil(promisesToAwait);
    return;
  }
  await promisesToAwait;
}
function provideNextAfterProvider() {
  const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for("@next/request-context");
  const VERCEL_REQUEST_CONTEXT_SYMBOL = Symbol.for("@vercel/request-context");
  const store = globalThis.__openNextAls.getStore();
  const waitUntil = store?.waitUntil ?? ((promise) => store?.pendingPromiseRunner.add(promise));
  const nextAfterContext = {
    get: () => ({
      waitUntil
    })
  };
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  if (process.env.EMULATE_VERCEL_REQUEST_CONTEXT) {
    globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  }
}
function runWithOpenNextRequestContext({ isISRRevalidation, waitUntil, requestId = Math.random().toString(36) }, fn) {
  return globalThis.__openNextAls.run({
    requestId,
    pendingPromiseRunner: new DetachedPromiseRunner(),
    isISRRevalidation,
    waitUntil,
    writtenTags: /* @__PURE__ */ new Set(),
    requestCache: new RequestCache()
  }, async () => {
    provideNextAfterProvider();
    let result;
    try {
      result = await fn();
    } finally {
      await awaitAllDetachedPromise();
    }
    return result;
  });
}

// ../../node_modules/@opennextjs/aws/dist/adapters/middleware.js
init_logger();

// ../../node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
init_logger();

// ../../node_modules/@opennextjs/aws/dist/core/resolve.js
async function resolveConverter(converter2) {
  if (typeof converter2 === "function") {
    return converter2();
  }
  const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));
  return m_1.default;
}
async function resolveWrapper(wrapper) {
  if (typeof wrapper === "function") {
    return wrapper();
  }
  const m_1 = await Promise.resolve().then(() => (init_cloudflare_edge(), cloudflare_edge_exports));
  return m_1.default;
}
async function resolveOriginResolver(originResolver) {
  if (typeof originResolver === "function") {
    return originResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_pattern_env(), pattern_env_exports));
  return m_1.default;
}
async function resolveAssetResolver(assetResolver) {
  if (typeof assetResolver === "function") {
    return assetResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy(), dummy_exports));
  return m_1.default;
}
async function resolveProxyRequest(proxyRequest) {
  if (typeof proxyRequest === "function") {
    return proxyRequest();
  }
  const m_1 = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  return m_1.default;
}

// ../../node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
async function createGenericHandler(handler3) {
  const config = await import("./open-next.config.mjs").then((m) => m.default);
  globalThis.openNextConfig = config;
  const handlerConfig = config[handler3.type];
  const override = handlerConfig && "override" in handlerConfig ? handlerConfig.override : void 0;
  const converter2 = await resolveConverter(override?.converter);
  const { name, wrapper } = await resolveWrapper(override?.wrapper);
  debug("Using wrapper", name);
  return wrapper(handler3.handler, converter2);
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/util.js
import crypto2 from "node:crypto";
import { parse as parseQs, stringify as stringifyQs } from "node:querystring";

// ../../node_modules/@opennextjs/aws/dist/adapters/config/index.js
init_logger();
import path from "node:path";
globalThis.__dirname ??= "";
var NEXT_DIR = path.join(__dirname, ".next");
var OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
debug({ NEXT_DIR, OPEN_NEXT_DIR });
var NextConfig = { "env": {}, "typescript": { "ignoreBuildErrors": false }, "typedRoutes": false, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.ts", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "instrumentationClientInject": [], "poweredByHeader": true, "compress": true, "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 14400, "formats": ["image/webp"], "maximumRedirects": 3, "maximumResponseBody": 5e7, "dangerouslyAllowLocalIP": false, "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "attachment", "localPatterns": [{ "pathname": "**", "search": "" }], "remotePatterns": [], "qualities": [75], "unoptimized": false, "customCacheHandler": false }, "devIndicators": { "position": "bottom-left" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "excludeDefaultMomentLocales": true, "reactProductionProfiling": false, "reactStrictMode": null, "reactMaxHeadersLength": 6e3, "httpAgentOptions": { "keepAlive": true }, "logging": { "serverFunctions": true, "browserToTerminal": "warn" }, "compiler": {}, "expireTime": 31536e3, "staticPageGenerationTimeout": 60, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "outputFileTracingRoot": "/home/machinerg/SourceCode/my-skincare", "enablePrerenderSourceMaps": true, "cacheComponents": false, "cacheLife": { "default": { "stale": 300, "revalidate": 900, "expire": 4294967294 }, "seconds": { "stale": 30, "revalidate": 1, "expire": 60 }, "minutes": { "stale": 300, "revalidate": 60, "expire": 3600 }, "hours": { "stale": 300, "revalidate": 3600, "expire": 86400 }, "days": { "stale": 300, "revalidate": 86400, "expire": 604800 }, "weeks": { "stale": 300, "revalidate": 604800, "expire": 2592e3 }, "max": { "stale": 300, "revalidate": 2592e3, "expire": 31536e3 } }, "cacheHandlers": {}, "experimental": { "appNewScrollHandler": true, "coldCacheBadge": false, "devValidationWorker": true, "useSkewCookie": false, "cssChunking": true, "multiZoneDraftMode": false, "appNavFailHandling": false, "prerenderEarlyExit": true, "serverMinification": true, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "cachedNavigations": false, "dynamicOnHover": false, "useOffline": false, "varyParams": true, "optimisticRouting": true, "instrumentationClientRouterTransitionEvents": false, "prefetchInlining": { "maxSize": 2048, "maxBundleSize": 10240 }, "preloadEntriesOnStart": true, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "proxyPrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 15, "memoryBasedWorkersCount": false, "imgOptConcurrency": null, "imgOptOperationCache": null, "imgOptTimeoutInSeconds": 7, "imgOptMaxInputPixels": 268402689, "imgOptSequentialRead": null, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "devMemoryThresholdRestart": true, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "swcTraceProfiling": false, "forceSwcTransforms": false, "requestInsights": false, "largePageDataBytes": 128e3, "typedEnv": false, "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "authInterrupts": false, "webpackMemoryOptimizations": false, "optimizeServerReact": true, "strictRouteTypes": false, "useTypeScriptCli": true, "removeUncaughtErrorAndRejectionListeners": false, "validateRSCRequestHeaders": true, "staleTimes": { "dynamic": 0, "static": 300 }, "reactDebugChannel": true, "serverComponentsHmrCache": true, "serverComponentsHmrCancellation": false, "staticGenerationMaxConcurrency": 8, "staticGenerationMinPagesPerWorker": 25, "transitionIndicator": false, "gestureTransition": false, "inlineCss": false, "useCache": false, "globalNotFound": false, "browserDebugInfoInTerminal": "warn", "lockDistDir": true, "proxyClientMaxBodySize": 10485760, "hideLogsAfterAbort": false, "mcpServer": true, "turbopackFileSystemCacheForDev": true, "turbopackFileSystemCacheForBuild": true, "turbopackInferModuleSideEffects": true, "turbopackPluginRuntimeStrategy": "childProcesses", "turbopackMemoryEvictionMode": "auto", "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "effect", "@effect/schema", "@effect/platform", "@effect/platform-node", "@effect/platform-browser", "@effect/platform-bun", "@effect/sql", "@effect/sql-mssql", "@effect/sql-mysql2", "@effect/sql-pg", "@effect/sql-sqlite-node", "@effect/sql-sqlite-bun", "@effect/sql-sqlite-wasm", "@effect/sql-sqlite-react-native", "@effect/rpc", "@effect/rpc-http", "@effect/typeclass", "@effect/experimental", "@effect/opentelemetry", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "useCacheTimeout": 54, "instantInsights": { "validationLevel": "warning" }, "trustHostHeader": false, "isExperimentalCompile": false }, "htmlLimitedBots": "[\\w-]+-Google|Google-[\\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight", "bundlePagesRouterDependencies": false, "configFileName": "next.config.ts", "repoRoot": "/home/machinerg/SourceCode/my-skincare", "turbopack": { "root": "/home/machinerg/SourceCode/my-skincare" }, "distDirRoot": ".next", "supportsImmutableAssets": false, "_originalRewrites": { "beforeFiles": [], "afterFiles": [{ "source": "/api/v1/:path*", "destination": "https://salon-api-service-23214758815.us-central1.run.app/api/v1/:path*" }], "fallback": [] } };
var BuildId = "waAPoeUCYCxS8HcLYwaf7";
var RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [{ "source": "/api/v1/:path*", "destination": "https://salon-api-service-23214758815.us-central1.run.app/api/v1/:path*", "regex": "^/api/v1(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))?(?:/)?$" }], "fallback": [] }, "redirects": [{ "source": "/:path+/", "destination": "/:path+", "internal": true, "priority": true, "statusCode": 308, "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$" }], "routes": { "static": [{ "page": "/", "regex": "^/(?:/)?$", "routeKeys": {}, "namedRegex": "^/(?:/)?$" }, { "page": "/_global-error", "regex": "^/_global\\-error(?:/)?$", "routeKeys": {}, "namedRegex": "^/_global\\-error(?:/)?$" }, { "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/admin/dashboard", "regex": "^/admin/dashboard(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/dashboard(?:/)?$" }, { "page": "/admin/login", "regex": "^/admin/login(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/login(?:/)?$" }, { "page": "/api/subscribe", "regex": "^/api/subscribe(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/subscribe(?:/)?$" }, { "page": "/appointments", "regex": "^/appointments(?:/)?$", "routeKeys": {}, "namedRegex": "^/appointments(?:/)?$" }, { "page": "/favicon.ico", "regex": "^/favicon\\.ico(?:/)?$", "routeKeys": {}, "namedRegex": "^/favicon\\.ico(?:/)?$" }], "dynamic": [{ "page": "/api/auth/[...nextauth]", "regex": "^/api/auth/(.+?)(?:/)?$", "routeKeys": { "nxtPnextauth": "nxtPnextauth" }, "namedRegex": "^/api/auth/(?<nxtPnextauth>.+?)(?:/)?$" }, { "page": "/catalogue/[id]", "regex": "^/catalogue/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/catalogue/(?<nxtPid>[^/]+?)(?:/)?$" }], "data": { "static": [], "dynamic": [] } }, "locales": [] };
var ConfigHeaders = [{ "source": "/(.*)", "headers": [{ "key": "Content-Security-Policy", "value": "    default-src 'self';    script-src 'self' 'unsafe-eval' 'unsafe-inline';    style-src 'self' 'unsafe-inline';    img-src 'self' blob: data: https://images.unsplash.com;    font-src 'self';    object-src 'none';    base-uri 'self';    form-action 'self';    frame-ancestors 'none';    upgrade-insecure-requests;" }, { "key": "X-Content-Type-Options", "value": "nosniff" }, { "key": "X-Frame-Options", "value": "DENY" }, { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }, { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }], "regex": "^(?:/(.*))(?:/)?$" }];
var PrerenderManifest = { "version": 4, "routes": { "/_global-error": { "routeType": "page", "response": "complete", "compute": "static", "htmlSize": 9010, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_global-error", "dataRoute": "/_global-error.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/_not-found": { "initialStatus": 404, "routeType": "page", "response": "complete", "compute": "static", "htmlSize": 8042, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_not-found", "dataRoute": "/_not-found.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/admin/login": { "routeType": "page", "response": "complete", "compute": "static", "htmlSize": 13332, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/admin/login", "dataRoute": "/admin/login.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/favicon.ico": { "initialHeaders": { "cache-control": "public, max-age=0, must-revalidate", "content-type": "image/x-icon", "x-next-cache-tags": "_N_T_/layout,_N_T_/favicon.ico/layout,_N_T_/favicon.ico/route,_N_T_/favicon.ico" }, "routeType": "route", "response": "complete", "compute": "static", "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/favicon.ico", "dataRoute": null, "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] } }, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "83ec6f386ca0bf481b07159d10b56296", "previewModeSigningKey": "fdb61be2d90651193254a84f30f863c8631c2205bd38f00892ebdf421562d12c", "previewModeEncryptionKey": "32cc98dc350ce0f03855129877c2248a51420a2ae7ab7efa5af9adf17009fd0c" } };
var MiddlewareManifest = { "version": 3, "middleware": { "/": { "files": ["server/edge-runtime-webpack.js", "server/src/middleware.js"], "entrypoint": "server/src/middleware.js", "name": "src/middleware", "page": "/", "matchers": [{ "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/admin(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$", "originalSource": "/admin/:path*" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "waAPoeUCYCxS8HcLYwaf7", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "oeGxrVBbTcCk7GZgGFqKE4YRiajpKbRswfO/kx4pImA=", "__NEXT_PREVIEW_MODE_ID": "83ec6f386ca0bf481b07159d10b56296", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "fdb61be2d90651193254a84f30f863c8631c2205bd38f00892ebdf421562d12c", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "32cc98dc350ce0f03855129877c2248a51420a2ae7ab7efa5af9adf17009fd0c" } } }, "functions": {}, "sortedMiddleware": ["/"] };
var AppPathRoutesManifest = { "/_not-found/page": "/_not-found", "/_global-error/page": "/_global-error", "/api/auth/[...nextauth]/route": "/api/auth/[...nextauth]", "/api/subscribe/route": "/api/subscribe", "/favicon.ico/route": "/favicon.ico", "/admin/login/page": "/admin/login", "/admin/dashboard/page": "/admin/dashboard", "/appointments/page": "/appointments", "/catalogue/[id]/page": "/catalogue/[id]", "/page": "/" };
var FunctionsConfigManifest = { "version": 1, "functions": {} };
var PagesManifest = { "/404": "pages/404.html", "/500": "pages/500.html" };
process.env.NEXT_BUILD_ID = BuildId;
process.env.OPEN_NEXT_BUILD_ID = NextConfig.deploymentId ?? BuildId;
process.env.NEXT_PREVIEW_MODE_ID = PrerenderManifest?.preview?.previewModeId;

// ../../node_modules/@opennextjs/aws/dist/http/openNextResponse.js
init_logger();
init_util();
import { Transform } from "node:stream";

// ../../node_modules/@opennextjs/aws/dist/core/routing/util.js
init_util();
init_logger();
import { ReadableStream as ReadableStream3 } from "node:stream/web";

// ../../node_modules/@opennextjs/aws/dist/utils/binary.js
var commonBinaryMimeTypes = /* @__PURE__ */ new Set([
  "application/octet-stream",
  // Docs
  "application/epub+zip",
  "application/msword",
  "application/pdf",
  "application/rtf",
  "application/vnd.amazon.ebook",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Fonts
  "font/otf",
  "font/woff",
  "font/woff2",
  // Images
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/webp",
  // Audio
  "audio/3gpp",
  "audio/aac",
  "audio/basic",
  "audio/flac",
  "audio/mpeg",
  "audio/ogg",
  "audio/wavaudio/webm",
  "audio/x-aiff",
  "audio/x-midi",
  "audio/x-wav",
  // Video
  "video/3gpp",
  "video/mp2t",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  // Archives
  "application/java-archive",
  "application/vnd.apple.installer+xml",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/x-bzip",
  "application/x-bzip2",
  "application/x-gzip",
  "application/x-java-archive",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-zip",
  "application/zip",
  // Serialized data
  "application/x-protobuf"
]);
function isBinaryContentType(contentType) {
  if (!contentType)
    return false;
  const value = contentType.split(";")[0];
  return commonBinaryMimeTypes.has(value);
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
init_stream();
init_logger();

// ../../node_modules/@opennextjs/aws/dist/core/routing/i18n/accept-header.js
function parse(raw, preferences, options) {
  const lowers = /* @__PURE__ */ new Map();
  const header = raw.replace(/[ \t]/g, "");
  if (preferences) {
    let pos = 0;
    for (const preference of preferences) {
      const lower = preference.toLowerCase();
      lowers.set(lower, { orig: preference, pos: pos++ });
      if (options.prefixMatch) {
        const parts2 = lower.split("-");
        while (parts2.pop(), parts2.length > 0) {
          const joined = parts2.join("-");
          if (!lowers.has(joined)) {
            lowers.set(joined, { orig: preference, pos: pos++ });
          }
        }
      }
    }
  }
  const parts = header.split(",");
  const selections = [];
  const map = /* @__PURE__ */ new Set();
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      continue;
    }
    const params = part.split(";");
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const selection = { token, pos: i, q: 1 };
    if (preferences && lowers.has(token)) {
      selection.pref = lowers.get(token).pos;
    }
    map.add(selection.token);
    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split("=");
      if (!value || key !== "q" && key !== "Q") {
        throw new Error(`Invalid ${options.type} header`);
      }
      const score = Number.parseFloat(value);
      if (score === 0) {
        continue;
      }
      if (Number.isFinite(score) && score <= 1 && score >= 1e-3) {
        selection.q = score;
      }
    }
    selections.push(selection);
  }
  selections.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    if (b.pref !== a.pref) {
      if (a.pref === void 0) {
        return 1;
      }
      if (b.pref === void 0) {
        return -1;
      }
      return a.pref - b.pref;
    }
    return a.pos - b.pos;
  });
  const values = selections.map((selection) => selection.token);
  if (!preferences || !preferences.length) {
    return values;
  }
  const preferred = [];
  for (const selection of values) {
    if (selection === "*") {
      for (const [preference, value] of lowers) {
        if (!map.has(preference)) {
          preferred.push(value.orig);
        }
      }
    } else {
      const lower = selection.toLowerCase();
      if (lowers.has(lower)) {
        preferred.push(lowers.get(lower).orig);
      }
    }
  }
  return preferred;
}
function acceptLanguage(header = "", preferences) {
  return parse(header, preferences, {
    type: "accept-language",
    prefixMatch: true
  })[0] || void 0;
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
function isLocalizedPath(path3) {
  return NextConfig.i18n?.locales.includes(path3.split("/")[1].toLowerCase()) ?? false;
}
function getLocaleFromCookie(cookies) {
  const i18n = NextConfig.i18n;
  const nextLocale = cookies.NEXT_LOCALE?.toLowerCase();
  return nextLocale ? i18n?.locales.find((locale) => nextLocale === locale.toLowerCase()) : void 0;
}
function detectDomainLocale({ hostname, detectedLocale }) {
  const i18n = NextConfig.i18n;
  const domains = i18n?.domains;
  if (!domains) {
    return;
  }
  const lowercasedLocale = detectedLocale?.toLowerCase();
  for (const domain of domains) {
    const domainHostname = domain.domain.split(":", 1)[0].toLowerCase();
    if (hostname === domainHostname || lowercasedLocale === domain.defaultLocale.toLowerCase() || domain.locales?.some((locale) => lowercasedLocale === locale.toLowerCase())) {
      return domain;
    }
  }
}
function detectLocale(internalEvent, i18n) {
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  if (i18n.localeDetection === false) {
    return domainLocale?.defaultLocale ?? i18n.defaultLocale;
  }
  const cookiesLocale = getLocaleFromCookie(internalEvent.cookies);
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  debug({
    cookiesLocale,
    preferredLocale,
    defaultLocale: i18n.defaultLocale,
    domainLocale
  });
  return domainLocale?.defaultLocale ?? cookiesLocale ?? preferredLocale ?? i18n.defaultLocale;
}
function localizePath(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n) {
    return internalEvent.rawPath;
  }
  if (isLocalizedPath(internalEvent.rawPath)) {
    return internalEvent.rawPath;
  }
  const detectedLocale = detectLocale(internalEvent, i18n);
  return `/${detectedLocale}${internalEvent.rawPath}`;
}
function handleLocaleRedirect(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n || i18n.localeDetection === false || internalEvent.rawPath !== "/") {
    return false;
  }
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  const detectedLocale = detectLocale(internalEvent, i18n);
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  const preferredDomain = detectDomainLocale({
    detectedLocale: preferredLocale
  });
  if (domainLocale && preferredDomain) {
    const isPDomain = preferredDomain.domain === domainLocale.domain;
    const isPLocale = preferredDomain.defaultLocale === preferredLocale;
    if (!isPDomain || !isPLocale) {
      const scheme = `http${preferredDomain.http ? "" : "s"}`;
      const rlocale = isPLocale ? "" : preferredLocale;
      return {
        type: "core",
        statusCode: 307,
        headers: {
          Location: `${scheme}://${preferredDomain.domain}/${rlocale}`
        },
        body: emptyReadableStream(),
        isBase64Encoded: false
      };
    }
  }
  const defaultLocale = domainLocale?.defaultLocale ?? i18n.defaultLocale;
  if (detectedLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
    const nextUrl = constructNextUrl(internalEvent.url, `/${detectedLocale}${NextConfig.trailingSlash ? "/" : ""}`);
    const queryString = convertToQueryString(internalEvent.query);
    return {
      type: "core",
      statusCode: 307,
      headers: {
        Location: `${nextUrl}${queryString}`
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/queue.js
function generateShardId(rawPath, maxConcurrency, prefix) {
  let a = cyrb128(rawPath);
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  const randomFloat = ((t ^ t >>> 14) >>> 0) / 4294967296;
  const randomInt = Math.floor(randomFloat * maxConcurrency);
  return `${prefix}-${randomInt}`;
}
function generateMessageGroupId(rawPath) {
  const maxConcurrency = Number.parseInt(process.env.MAX_REVALIDATE_CONCURRENCY ?? "10");
  return generateShardId(rawPath, maxConcurrency, "revalidate");
}
function cyrb128(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return h1 >>> 0;
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/util.js
function isExternal(url, host) {
  if (!url)
    return false;
  const pattern = /^https?:\/\//;
  if (!pattern.test(url))
    return false;
  if (host) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.host !== host;
    } catch {
      return !url.includes(host);
    }
  }
  return true;
}
function convertFromQueryString(query) {
  if (query === "")
    return {};
  const queryParts = query.split("&");
  return getQueryFromIterator(queryParts.map((p) => {
    const [key, value] = p.split("=");
    return [key, value];
  }));
}
function getUrlParts(url, isExternal2) {
  if (!isExternal2) {
    const regex2 = /\/([^?]*)\??(.*)/;
    const match3 = url.match(regex2);
    return {
      hostname: "",
      pathname: match3?.[1] ? `/${match3[1]}` : url,
      protocol: "",
      queryString: match3?.[2] ?? ""
    };
  }
  const regex = /^(https?:)\/\/?([^\/\s]+)(\/[^?]*)?(\?.*)?/;
  const match2 = url.match(regex);
  if (!match2) {
    throw new Error(`Invalid external URL: ${url}`);
  }
  return {
    protocol: match2[1] ?? "https:",
    hostname: match2[2],
    pathname: match2[3] ?? "",
    queryString: match2[4]?.slice(1) ?? ""
  };
}
function constructNextUrl(baseUrl, path3) {
  const nextBasePath = NextConfig.basePath ?? "";
  const url = new URL(`${nextBasePath}${path3}`, baseUrl);
  return url.href;
}
function convertToQueryString(query) {
  const queryStrings = [];
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => queryStrings.push(`${key}=${entry}`));
    } else {
      queryStrings.push(`${key}=${value}`);
    }
  });
  return queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
}
function getMiddlewareMatch(middlewareManifest2, functionsManifest) {
  if (functionsManifest?.functions?.["/_middleware"]) {
    return functionsManifest.functions["/_middleware"].matchers?.map(({ regexp }) => new RegExp(regexp)) ?? [/.*/];
  }
  const rootMiddleware = middlewareManifest2.middleware["/"];
  if (!rootMiddleware?.matchers)
    return [];
  return rootMiddleware.matchers.map(({ regexp }) => new RegExp(regexp));
}
function escapeRegex(str, { isPath } = {}) {
  const result = str.replaceAll("(.)", "_\xB51_").replaceAll("(..)", "_\xB52_").replaceAll("(...)", "_\xB53_");
  return isPath ? result : result.replaceAll("+", "_\xB54_");
}
function unescapeRegex(str) {
  return str.replaceAll("_\xB51_", "(.)").replaceAll("_\xB52_", "(..)").replaceAll("_\xB53_", "(...)").replaceAll("_\xB54_", "+");
}
function convertBodyToReadableStream(method, body) {
  if (method === "GET" || method === "HEAD")
    return void 0;
  if (!body)
    return void 0;
  return new ReadableStream3({
    start(controller) {
      controller.enqueue(body);
      controller.close();
    }
  });
}
var CommonHeaders;
(function(CommonHeaders2) {
  CommonHeaders2["CACHE_CONTROL"] = "cache-control";
  CommonHeaders2["NEXT_CACHE"] = "x-nextjs-cache";
})(CommonHeaders || (CommonHeaders = {}));
function normalizeLocationHeader(location, baseUrl, encodeQuery = false) {
  if (!URL.canParse(location)) {
    return location;
  }
  const locationURL = new URL(location);
  const origin = new URL(baseUrl).origin;
  let search = locationURL.search;
  if (encodeQuery && search) {
    search = `?${stringifyQs(parseQs(search.slice(1)))}`;
  }
  const href = `${locationURL.origin}${locationURL.pathname}${search}${locationURL.hash}`;
  if (locationURL.origin === origin) {
    return href.slice(origin.length);
  }
  return href;
}

// ../../node_modules/@opennextjs/aws/dist/core/routingHandler.js
init_logger();

// ../../node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
import { createHash } from "node:crypto";
init_stream();

// ../../node_modules/@opennextjs/aws/dist/utils/cache.js
init_logger();

// ../../node_modules/@opennextjs/aws/dist/utils/semver.js
function compareSemver(v1, operator, v2) {
  let versionDiff = 0;
  if (v1 === "latest") {
    versionDiff = 1;
  } else {
    if (/^[^\d]/.test(v1)) {
      v1 = v1.substring(1);
    }
    if (/^[^\d]/.test(v2)) {
      v2 = v2.substring(1);
    }
    const [major1, minor1 = 0, patch1 = 0] = v1.split(".").map(Number);
    const [major2, minor2 = 0, patch2 = 0] = v2.split(".").map(Number);
    if (Number.isNaN(major1) || Number.isNaN(major2)) {
      throw new Error("The major version is required.");
    }
    if (major1 !== major2) {
      versionDiff = major1 - major2;
    } else if (minor1 !== minor2) {
      versionDiff = minor1 - minor2;
    } else if (patch1 !== patch2) {
      versionDiff = patch1 - patch2;
    }
  }
  switch (operator) {
    case "=":
      return versionDiff === 0;
    case ">=":
      return versionDiff >= 0;
    case "<=":
      return versionDiff <= 0;
    case ">":
      return versionDiff > 0;
    case "<":
      return versionDiff < 0;
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

// ../../node_modules/@opennextjs/aws/dist/utils/cache.js
async function isStale(key, tags, lastModified) {
  if (!compareSemver(globalThis.nextVersion, ">=", "16.0.0")) {
    return false;
  }
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.isStale?.(tags, lastModified) ?? false;
  }
  return await globalThis.tagCache.isStale?.(key, lastModified) ?? false;
}
async function hasBeenRevalidated(key, tags, cacheEntry) {
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  const value = cacheEntry.value;
  if (!value) {
    return true;
  }
  if ("type" in cacheEntry && cacheEntry.type === "page") {
    return false;
  }
  const lastModified = cacheEntry.lastModified ?? Date.now();
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.hasBeenRevalidated(tags, lastModified);
  }
  const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
  return _lastModified === -1;
}
function getTagsFromValue(value) {
  if (!value) {
    return [];
  }
  try {
    const cacheTags = value.meta?.headers?.["x-next-cache-tags"]?.split(",") ?? [];
    delete value.meta?.headers?.["x-next-cache-tags"];
    return cacheTags;
  } catch (e) {
    return [];
  }
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
init_logger();
var CACHE_ONE_YEAR = 60 * 60 * 24 * 365;
var CACHE_ONE_MONTH = 60 * 60 * 24 * 30;
var VARY_HEADER = "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url";
var NEXT_SEGMENT_PREFETCH_HEADER = "next-router-segment-prefetch";
var NEXT_PRERENDER_HEADER = "x-nextjs-prerender";
var NEXT_POSTPONED_HEADER = "x-nextjs-postponed";
async function computeCacheControl(path3, body, host, revalidate, lastModified, isStaleFromTagCache = false) {
  let finalRevalidate = CACHE_ONE_YEAR;
  const existingRoute = Object.entries(PrerenderManifest?.routes ?? {}).find((p) => p[0] === path3)?.[1];
  if (revalidate === void 0 && existingRoute) {
    finalRevalidate = existingRoute.initialRevalidateSeconds === false ? CACHE_ONE_YEAR : existingRoute.initialRevalidateSeconds;
  } else if (revalidate !== void 0) {
    finalRevalidate = revalidate === false ? CACHE_ONE_YEAR : revalidate;
  }
  const age = Math.round((Date.now() - (lastModified ?? 0)) / 1e3);
  const hash = (str) => createHash("md5").update(str).digest("hex");
  const etag = hash(body);
  if (revalidate === 0) {
    return {
      "cache-control": "private, no-cache, no-store, max-age=0, must-revalidate",
      "x-opennext-cache": "ERROR",
      etag
    };
  }
  const isSSG = finalRevalidate === CACHE_ONE_YEAR;
  const remainingTtl = Math.max(finalRevalidate - age, 1);
  const isStaleFromTime = !isSSG && remainingTtl === 1;
  const isStale2 = isStaleFromTime || isStaleFromTagCache;
  if (!isSSG || isStaleFromTagCache) {
    const sMaxAge = isStaleFromTagCache ? 1 : remainingTtl;
    debug("sMaxAge", {
      finalRevalidate,
      age,
      lastModified,
      revalidate,
      isStaleFromTagCache
    });
    if (isStale2) {
      let url = NextConfig.trailingSlash ? `${path3}/` : path3;
      if (NextConfig.basePath) {
        url = `${NextConfig.basePath}${url}`;
      }
      await globalThis.queue.send({
        MessageBody: {
          host,
          url,
          eTag: etag,
          lastModified: lastModified ?? Date.now()
        },
        MessageDeduplicationId: hash(`${path3}-${lastModified}-${etag}`),
        MessageGroupId: generateMessageGroupId(path3)
      });
    }
    return {
      "cache-control": `s-maxage=${sMaxAge}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
      "x-opennext-cache": isStale2 ? "STALE" : "HIT",
      etag
    };
  }
  return {
    "cache-control": `s-maxage=${CACHE_ONE_YEAR}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
    "x-opennext-cache": "HIT",
    etag
  };
}
function getBodyForAppRouter(event, cachedValue) {
  if (cachedValue.type !== "app") {
    throw new Error("getBodyForAppRouter called with non-app cache value");
  }
  try {
    const segmentHeader = `${event.headers[NEXT_SEGMENT_PREFETCH_HEADER]}`;
    const isSegmentResponse = Boolean(segmentHeader) && segmentHeader in (cachedValue.segmentData || {}) && !NextConfig.experimental?.prefetchInlining;
    const body = isSegmentResponse ? cachedValue.segmentData[segmentHeader] : cachedValue.rsc;
    return {
      body,
      additionalHeaders: isSegmentResponse ? { [NEXT_PRERENDER_HEADER]: "1", [NEXT_POSTPONED_HEADER]: "2" } : {}
    };
  } catch (e) {
    error("Error while getting body for app router from cache:", e);
    return { body: cachedValue.rsc, additionalHeaders: {} };
  }
}
async function generateResult(event, localizedPath, cachedValue, lastModified, isStaleFromTagCache = false) {
  debug("Returning result from experimental cache");
  let body = "";
  let type = "application/octet-stream";
  let isDataRequest = false;
  let additionalHeaders = {};
  if (cachedValue.type === "app") {
    isDataRequest = event.headers.rsc === "1";
    if (isDataRequest) {
      const { body: appRouterBody, additionalHeaders: appHeaders } = getBodyForAppRouter(event, cachedValue);
      body = appRouterBody;
      additionalHeaders = appHeaders;
    } else {
      body = cachedValue.html;
    }
    type = isDataRequest ? "text/x-component" : "text/html; charset=utf-8";
  } else if (cachedValue.type === "page") {
    isDataRequest = Boolean(event.query.__nextDataReq);
    body = isDataRequest ? JSON.stringify(cachedValue.json) : cachedValue.html;
    type = isDataRequest ? "application/json" : "text/html; charset=utf-8";
  } else {
    throw new Error("generateResult called with unsupported cache value type, only 'app' and 'page' are supported");
  }
  const cacheControl = await computeCacheControl(localizedPath, body, event.headers.host, cachedValue.revalidate, lastModified, isStaleFromTagCache);
  return {
    type: "core",
    // Sometimes other status codes can be cached, like 404. For these cases, we should return the correct status code
    // Also set the status code to the rewriteStatusCode if defined
    // This can happen in handleMiddleware in routingHandler.
    // `NextResponse.rewrite(url, { status: xxx})
    // The rewrite status code should take precedence over the cached one
    statusCode: event.rewriteStatusCode ?? cachedValue.meta?.status ?? 200,
    body: toReadableStream(body, false),
    isBase64Encoded: false,
    headers: {
      ...cacheControl,
      "content-type": type,
      ...cachedValue.meta?.headers,
      vary: VARY_HEADER,
      ...additionalHeaders
    }
  };
}
function escapePathDelimiters(segment, escapeEncoded) {
  return segment.replace(new RegExp(`([/#?]${escapeEncoded ? "|%(2f|23|3f|5c)" : ""})`, "gi"), (char) => encodeURIComponent(char));
}
function decodePathParams(pathname) {
  return pathname.split("/").map((segment) => escapePathDelimiters(decodeURIComponent(segment), true)).join("/");
}
async function cacheInterceptor(event) {
  if (Boolean(event.headers["next-action"]) || Boolean(event.headers["x-prerender-revalidate"]))
    return event;
  const cookies = event.headers.cookie || "";
  const hasPreviewData = cookies.includes("__prerender_bypass") || cookies.includes("__next_preview_data");
  if (hasPreviewData) {
    debug("Preview mode detected, passing through to handler");
    return event;
  }
  let localizedPath = localizePath(event);
  if (NextConfig.basePath) {
    localizedPath = localizedPath.replace(NextConfig.basePath, "");
  }
  localizedPath = localizedPath.replace(/\/$/, "");
  try {
    localizedPath = decodePathParams(localizedPath) || "/";
  } catch {
    return event;
  }
  const cacheKey = localizedPath === "/" ? "/index" : localizedPath;
  debug("Checking cache for", localizedPath, PrerenderManifest);
  const isISR = Object.keys(PrerenderManifest?.routes ?? {}).includes(localizedPath) || Object.values(PrerenderManifest?.dynamicRoutes ?? {}).some((dr) => new RegExp(dr.routeRegex).test(localizedPath));
  debug("isISR", isISR);
  if (isISR) {
    try {
      const cachedData = await globalThis.incrementalCache.get(cacheKey);
      debug("cached data in interceptor", cachedData);
      if (!cachedData?.value) {
        return event;
      }
      const tags = getTagsFromValue(cachedData.value);
      if (cachedData.value?.type === "app" || cachedData.value?.type === "route") {
        const _hasBeenRevalidated = cachedData.shouldBypassTagCache ? false : await hasBeenRevalidated(cacheKey, tags, cachedData);
        if (_hasBeenRevalidated) {
          return event;
        }
      }
      const _isStale = cachedData.shouldBypassTagCache ? false : await isStale(cacheKey, tags, cachedData.lastModified ?? Date.now());
      const host = event.headers.host;
      switch (cachedData?.value?.type) {
        case "app":
        case "page":
          return generateResult(event, localizedPath, cachedData.value, cachedData.lastModified, _isStale);
        case "redirect": {
          const cacheControl = await computeCacheControl(localizedPath, "", host, cachedData.value.revalidate, cachedData.lastModified, _isStale);
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 307,
            body: emptyReadableStream(),
            headers: {
              ...cachedData.value.meta?.headers ?? {},
              ...cacheControl
            },
            isBase64Encoded: false
          };
        }
        case "route": {
          const cacheControl = await computeCacheControl(localizedPath, cachedData.value.body, host, cachedData.value.revalidate, cachedData.lastModified, _isStale);
          const isBinary = isBinaryContentType(String(cachedData.value.meta?.headers?.["content-type"]));
          return {
            type: "core",
            statusCode: event.rewriteStatusCode ?? cachedData.value.meta?.status ?? 200,
            body: toReadableStream(cachedData.value.body, isBinary),
            headers: {
              ...cacheControl,
              ...cachedData.value.meta?.headers,
              vary: VARY_HEADER
            },
            isBase64Encoded: isBinary
          };
        }
        default:
          return event;
      }
    } catch (e) {
      debug("Error while fetching cache", e);
      return event;
    }
  }
  return event;
}

// ../../node_modules/@opennextjs/aws/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path3 = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  var isSafe = function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  };
  var safePattern = function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path3 += prefix;
        prefix = "";
      }
      if (path3) {
        result.push(path3);
        path3 = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path3 += value;
      continue;
    }
    if (path3) {
      result.push(path3);
      path3 = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function compile(str, options) {
  return tokensToFunction(parse2(str, options), options);
}
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode, encode = _a === void 0 ? function(x) {
    return x;
  } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
  var matches = tokens.map(function(token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function(data) {
    var path3 = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path3 += token;
        continue;
      }
      var value = data ? data[token.name] : void 0;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
        }
        if (value.length === 0) {
          if (optional)
            continue;
          throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
          }
          path3 += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
        }
        path3 += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional)
        continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
    }
    return path3;
  };
}
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path3 = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path: path3, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path3, keys) {
  if (!keys)
    return path3;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path3.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path3.source);
  }
  return path3;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path3) {
    return pathToRegexp(path3, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path3, keys, options) {
  return tokensToRegexp(parse2(path3, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path3, keys, options) {
  if (path3 instanceof RegExp)
    return regexpToRegexp(path3, keys);
  if (Array.isArray(path3))
    return arrayToRegexp(path3, keys, options);
  return stringToRegexp(path3, keys, options);
}

// ../../node_modules/@opennextjs/aws/dist/utils/normalize-path.js
import path2 from "node:path";
function normalizeRepeatedSlashes(url) {
  const urlNoQuery = url.host + url.pathname;
  return `${url.protocol}//${urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/")}${url.search}`;
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/matcher.js
init_stream();
init_logger();

// ../../node_modules/@opennextjs/aws/dist/core/routing/routeMatcher.js
var optionalLocalePrefixRegex = `^/(?:${RoutesManifest.locales.map((locale) => `${locale}/?`).join("|")})?`;
var optionalBasepathPrefixRegex = RoutesManifest.basePath ? `^${RoutesManifest.basePath}/?` : "^/";
var optionalPrefix = optionalLocalePrefixRegex.replace("^/", optionalBasepathPrefixRegex);
function routeMatcher(routeDefinitions) {
  const regexp = routeDefinitions.map((route) => ({
    page: route.page,
    regexp: new RegExp(route.regex.replace("^/", optionalPrefix))
  }));
  const appPathsSet = /* @__PURE__ */ new Set();
  const routePathsSet = /* @__PURE__ */ new Set();
  for (const [k, v] of Object.entries(AppPathRoutesManifest)) {
    if (k.endsWith("page")) {
      appPathsSet.add(v);
    } else if (k.endsWith("route")) {
      routePathsSet.add(v);
    }
  }
  return function matchRoute(path3) {
    const foundRoutes = regexp.filter((route) => route.regexp.test(path3));
    return foundRoutes.map((foundRoute) => {
      let routeType = "page";
      if (appPathsSet.has(foundRoute.page)) {
        routeType = "app";
      } else if (routePathsSet.has(foundRoute.page)) {
        routeType = "route";
      }
      return {
        route: foundRoute.page,
        type: routeType
      };
    });
  };
}
var staticRouteMatcher = routeMatcher([
  ...RoutesManifest.routes.static,
  ...getStaticAPIRoutes()
]);
var dynamicRouteMatcher = routeMatcher(RoutesManifest.routes.dynamic);
function getStaticAPIRoutes() {
  const createRouteDefinition = (route) => ({
    page: route,
    regex: `^${route}(?:/)?$`
  });
  const dynamicRoutePages = new Set(RoutesManifest.routes.dynamic.map(({ page }) => page));
  const pagesStaticAPIRoutes = Object.keys(PagesManifest).filter((route) => route.startsWith("/api/") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  const appPathsStaticAPIRoutes = Object.values(AppPathRoutesManifest).filter((route) => (route.startsWith("/api/") || route === "/api") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  return [...pagesStaticAPIRoutes, ...appPathsStaticAPIRoutes];
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/matcher.js
var routeHasMatcher = (headers, cookies, query) => (redirect) => {
  switch (redirect.type) {
    case "header":
      return !!headers?.[redirect.key.toLowerCase()] && new RegExp(redirect.value ?? "").test(headers[redirect.key.toLowerCase()] ?? "");
    case "cookie":
      return !!cookies?.[redirect.key] && new RegExp(redirect.value ?? "").test(cookies[redirect.key] ?? "");
    case "query":
      return query[redirect.key] && Array.isArray(redirect.value) ? redirect.value.reduce((prev, current) => prev || new RegExp(current).test(query[redirect.key]), false) : new RegExp(redirect.value ?? "").test(query[redirect.key] ?? "");
    case "host":
      return headers?.host !== "" && new RegExp(redirect.value ?? "").test(headers.host);
    default:
      return false;
  }
};
function checkHas(matcher, has, inverted = false) {
  return has ? has.reduce((acc, cur) => {
    if (acc === false)
      return false;
    return inverted ? !matcher(cur) : matcher(cur);
  }, true) : true;
}
var getParamsFromSource = (source) => (value) => {
  debug("value", value);
  const _match = source(value);
  return _match ? _match.params : {};
};
var computeParamHas = (headers, cookies, query) => (has) => {
  if (!has.value)
    return {};
  const matcher = new RegExp(`^${has.value}$`);
  const fromSource = (value) => {
    const matches = value.match(matcher);
    return matches?.groups ?? {};
  };
  switch (has.type) {
    case "header":
      return fromSource(headers[has.key.toLowerCase()] ?? "");
    case "cookie":
      return fromSource(cookies[has.key] ?? "");
    case "query":
      return Array.isArray(query[has.key]) ? fromSource(query[has.key].join(",")) : fromSource(query[has.key] ?? "");
    case "host":
      return fromSource(headers.host ?? "");
  }
};
function convertMatch(match2, toDestination, destination) {
  if (!match2) {
    return destination;
  }
  const { params } = match2;
  const isUsingParams = Object.keys(params).length > 0;
  return isUsingParams ? toDestination(params) : destination;
}
function getNextConfigHeaders(event, configHeaders) {
  if (!configHeaders) {
    return {};
  }
  const matcher = routeHasMatcher(event.headers, event.cookies, event.query);
  const requestHeaders = {};
  const localizedRawPath = localizePath(event);
  for (const { headers, has, missing, regex, source, locale } of configHeaders) {
    const path3 = locale === false ? event.rawPath : localizedRawPath;
    if (new RegExp(regex).test(path3) && checkHas(matcher, has) && checkHas(matcher, missing, true)) {
      const fromSource = match(source);
      const _match = fromSource(path3);
      headers.forEach((h) => {
        try {
          const key = convertMatch(_match, compile(h.key), h.key);
          const value = convertMatch(_match, compile(h.value), h.value);
          requestHeaders[key] = value;
        } catch {
          debug(`Error matching header ${h.key} with value ${h.value}`);
          requestHeaders[h.key] = h.value;
        }
      });
    }
  }
  return requestHeaders;
}
function handleRewrites(event, rewrites) {
  const { rawPath, headers, query, cookies, url } = event;
  const localizedRawPath = localizePath(event);
  const matcher = routeHasMatcher(headers, cookies, query);
  const computeHas = computeParamHas(headers, cookies, query);
  const rewrite = rewrites.find((route) => {
    const path3 = route.locale === false ? rawPath : localizedRawPath;
    return new RegExp(route.regex).test(path3) && checkHas(matcher, route.has) && checkHas(matcher, route.missing, true);
  });
  let finalQuery = query;
  let rewrittenUrl = url;
  const isExternalRewrite = isExternal(rewrite?.destination);
  debug("isExternalRewrite", isExternalRewrite);
  if (rewrite) {
    const { pathname, protocol, hostname, queryString } = getUrlParts(rewrite.destination, isExternalRewrite);
    const pathToUse = rewrite.locale === false ? rawPath : localizedRawPath;
    debug("urlParts", { pathname, protocol, hostname, queryString });
    const toDestinationPath = compile(escapeRegex(pathname, { isPath: true }));
    const toDestinationHost = compile(escapeRegex(hostname));
    const toDestinationQuery = compile(escapeRegex(queryString));
    const params = {
      // params for the source
      ...getParamsFromSource(match(escapeRegex(rewrite.source, { isPath: true })))(pathToUse),
      // params for the has
      ...rewrite.has?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {}),
      // params for the missing
      ...rewrite.missing?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {})
    };
    const isUsingParams = Object.keys(params).length > 0;
    let rewrittenQuery = queryString;
    let rewrittenHost = hostname;
    let rewrittenPath = pathname;
    if (isUsingParams) {
      rewrittenPath = unescapeRegex(toDestinationPath(params));
      rewrittenHost = unescapeRegex(toDestinationHost(params));
      rewrittenQuery = unescapeRegex(toDestinationQuery(params));
    }
    if (NextConfig.i18n && !isExternalRewrite) {
      const strippedPathLocale = rewrittenPath.replace(new RegExp(`^/(${NextConfig.i18n.locales.join("|")})`), "");
      if (strippedPathLocale.startsWith("/api/")) {
        rewrittenPath = strippedPathLocale;
      }
    }
    rewrittenUrl = isExternalRewrite ? `${protocol}//${rewrittenHost}${rewrittenPath}` : new URL(rewrittenPath, event.url).href;
    finalQuery = {
      ...query,
      ...convertFromQueryString(rewrittenQuery)
    };
    rewrittenUrl += convertToQueryString(finalQuery);
    debug("rewrittenUrl", { rewrittenUrl, finalQuery, isUsingParams });
  }
  return {
    internalEvent: {
      ...event,
      query: finalQuery,
      rawPath: new URL(rewrittenUrl).pathname,
      url: rewrittenUrl
    },
    __rewrite: rewrite,
    isExternalRewrite
  };
}
function handleRepeatedSlashRedirect(event) {
  if (event.rawPath.match(/(\\|\/\/)/)) {
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: normalizeRepeatedSlashes(new URL(event.url))
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}
function handleTrailingSlashRedirect(event) {
  const url = new URL(event.rawPath, "http://localhost");
  if (
    // Someone is trying to redirect to a different origin, let's not do that
    url.host !== "localhost" || NextConfig.skipTrailingSlashRedirect || // We should not apply trailing slash redirect to API routes
    event.rawPath.startsWith("/api/")
  ) {
    return false;
  }
  const emptyBody = emptyReadableStream();
  if (NextConfig.trailingSlash && !(event.query.__nextDataReq === "1") && !event.rawPath.endsWith("/") && !event.rawPath.match(/[\w-]+\.[\w]+$/g)) {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0]}/${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  if (!NextConfig.trailingSlash && event.rawPath.endsWith("/") && event.rawPath !== "/") {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0].replace(/\/$/, "")}${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  return false;
}
function handleRedirects(event, redirects) {
  const repeatedSlashRedirect = handleRepeatedSlashRedirect(event);
  if (repeatedSlashRedirect)
    return repeatedSlashRedirect;
  const trailingSlashRedirect = handleTrailingSlashRedirect(event);
  if (trailingSlashRedirect)
    return trailingSlashRedirect;
  const localeRedirect = handleLocaleRedirect(event);
  if (localeRedirect)
    return localeRedirect;
  const { internalEvent, __rewrite } = handleRewrites(event, redirects.filter((r) => !r.internal));
  if (__rewrite && !__rewrite.internal) {
    return {
      type: event.type,
      statusCode: __rewrite.statusCode ?? 308,
      headers: {
        Location: internalEvent.url
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
}
function fixDataPage(internalEvent, buildId) {
  const { rawPath, query } = internalEvent;
  const basePath = NextConfig.basePath ?? "";
  const dataPattern = `${basePath}/_next/data/${buildId}`;
  if (rawPath.startsWith("/_next/data") && !rawPath.startsWith(dataPattern)) {
    return {
      type: internalEvent.type,
      statusCode: 404,
      body: toReadableStream("{}"),
      headers: {
        "Content-Type": "application/json"
      },
      isBase64Encoded: false
    };
  }
  if (rawPath.startsWith(dataPattern) && rawPath.endsWith(".json")) {
    const newPath = `${basePath}${rawPath.slice(dataPattern.length, -".json".length).replace(/^\/index$/, "/")}`;
    query.__nextDataReq = "1";
    return {
      ...internalEvent,
      rawPath: newPath,
      query,
      headers: {
        ...internalEvent.headers,
        "x-nextjs-data": "1"
      },
      url: new URL(`${newPath}${convertToQueryString(query)}`, internalEvent.url).href
    };
  }
  return internalEvent;
}
function handleFallbackFalse(internalEvent, prerenderManifest) {
  const { rawPath } = internalEvent;
  const { dynamicRoutes = {}, routes = {} } = prerenderManifest ?? {};
  const prerenderedFallbackRoutes = Object.entries(dynamicRoutes).filter(([, { fallback }]) => fallback === false);
  const routeFallback = prerenderedFallbackRoutes.some(([, { routeRegex }]) => {
    const routeRegexExp = new RegExp(routeRegex);
    return routeRegexExp.test(rawPath);
  });
  const locales = NextConfig.i18n?.locales;
  const routesAlreadyHaveLocale = locales?.includes(rawPath.split("/")[1]) || // If we don't use locales, we don't need to add the default locale
  locales === void 0;
  let localizedPath = routesAlreadyHaveLocale ? rawPath : `/${NextConfig.i18n?.defaultLocale}${rawPath}`;
  if (
    // Not if localizedPath is "/" tho, because that would not make it find `isPregenerated` below since it would be try to match an empty string.
    localizedPath !== "/" && NextConfig.trailingSlash && localizedPath.endsWith("/")
  ) {
    localizedPath = localizedPath.slice(0, -1);
  }
  const matchedStaticRoute = staticRouteMatcher(localizedPath);
  const prerenderedFallbackRoutesName = prerenderedFallbackRoutes.map(([name]) => name);
  const matchedDynamicRoute = dynamicRouteMatcher(localizedPath).filter(({ route }) => !prerenderedFallbackRoutesName.includes(route));
  const isPregenerated = Object.keys(routes).includes(localizedPath);
  if (routeFallback && !isPregenerated && matchedStaticRoute.length === 0 && matchedDynamicRoute.length === 0) {
    return {
      event: {
        ...internalEvent,
        rawPath: "/404",
        url: constructNextUrl(internalEvent.url, "/404"),
        headers: {
          ...internalEvent.headers,
          "x-invoke-status": "404"
        }
      },
      isISR: false
    };
  }
  return {
    event: internalEvent,
    isISR: routeFallback || isPregenerated
  };
}

// ../../node_modules/@opennextjs/aws/dist/core/routing/middleware.js
init_stream();
init_utils();
var middlewareManifest = MiddlewareManifest;
var functionsConfigManifest = FunctionsConfigManifest;
var middleMatch = getMiddlewareMatch(middlewareManifest, functionsConfigManifest);
var REDIRECTS = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function defaultMiddlewareLoader() {
  return Promise.resolve().then(() => (init_edgeFunctionHandler(), edgeFunctionHandler_exports));
}
async function handleMiddleware(internalEvent, initialSearch, middlewareLoader = defaultMiddlewareLoader) {
  const headers = internalEvent.headers;
  if (headers["x-isr"] && headers["x-prerender-revalidate"] === PrerenderManifest?.preview?.previewModeId)
    return internalEvent;
  const normalizedPath = localizePath(internalEvent);
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(normalizedPath);
  } catch {
  }
  const hasMatch = middleMatch.some((r) => r.test(normalizedPath) || decodedPath !== void 0 && r.test(decodedPath));
  if (!hasMatch)
    return internalEvent;
  const initialUrl = new URL(normalizedPath, internalEvent.url);
  initialUrl.search = initialSearch;
  const url = initialUrl.href;
  const middleware = await middlewareLoader();
  const result = await middleware.default({
    // `geo` is pre Next 15.
    geo: {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: decodeURIComponent(headers["x-open-next-city"]),
      country: headers["x-open-next-country"],
      region: headers["x-open-next-region"],
      latitude: headers["x-open-next-latitude"],
      longitude: headers["x-open-next-longitude"]
    },
    headers,
    method: internalEvent.method || "GET",
    nextConfig: {
      basePath: NextConfig.basePath,
      i18n: NextConfig.i18n,
      trailingSlash: NextConfig.trailingSlash
    },
    url,
    body: convertBodyToReadableStream(internalEvent.method, internalEvent.body)
  });
  const statusCode = result.status;
  const responseHeaders = result.headers;
  const reqHeaders = {};
  const resHeaders = {};
  const filteredHeaders = [
    "x-middleware-override-headers",
    "x-middleware-next",
    "x-middleware-rewrite",
    // We need to drop `content-encoding` because it will be decoded
    "content-encoding"
  ];
  const xMiddlewareKey = "x-middleware-request-";
  responseHeaders.forEach((value, key) => {
    if (key.startsWith(xMiddlewareKey)) {
      const k = key.substring(xMiddlewareKey.length);
      reqHeaders[k] = value;
    } else {
      if (filteredHeaders.includes(key.toLowerCase()))
        return;
      if (key.toLowerCase() === "set-cookie") {
        resHeaders[key] = resHeaders[key] ? [...resHeaders[key], value] : [value];
      } else if (REDIRECTS.has(statusCode) && key.toLowerCase() === "location") {
        resHeaders[key] = normalizeLocationHeader(value, internalEvent.url);
      } else {
        resHeaders[key] = value;
      }
    }
  });
  const rewriteUrl = responseHeaders.get("x-middleware-rewrite");
  let isExternalRewrite = false;
  let middlewareQuery = internalEvent.query;
  let newUrl = internalEvent.url;
  if (rewriteUrl) {
    newUrl = rewriteUrl;
    if (isExternal(newUrl, internalEvent.headers.host)) {
      isExternalRewrite = true;
    } else {
      const rewriteUrlObject = new URL(rewriteUrl);
      middlewareQuery = getQueryFromSearchParams(rewriteUrlObject.searchParams);
      if ("__nextDataReq" in internalEvent.query) {
        middlewareQuery.__nextDataReq = internalEvent.query.__nextDataReq;
      }
    }
  }
  if (!rewriteUrl && !responseHeaders.get("x-middleware-next")) {
    const body = result.body ?? emptyReadableStream();
    return {
      type: internalEvent.type,
      statusCode,
      headers: resHeaders,
      body,
      isBase64Encoded: false
    };
  }
  return {
    responseHeaders: resHeaders,
    url: newUrl,
    rawPath: new URL(newUrl).pathname,
    type: internalEvent.type,
    headers: { ...internalEvent.headers, ...reqHeaders },
    body: internalEvent.body,
    method: internalEvent.method,
    query: middlewareQuery,
    cookies: internalEvent.cookies,
    remoteAddress: internalEvent.remoteAddress,
    isExternalRewrite,
    rewriteStatusCode: rewriteUrl && !isExternalRewrite ? statusCode : void 0
  };
}

// ../../node_modules/@opennextjs/aws/dist/core/routingHandler.js
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-response-";
var MIDDLEWARE_HEADER_PREFIX_LEN = MIDDLEWARE_HEADER_PREFIX.length;
var INTERNAL_HEADER_PREFIX = "x-opennext-";
var INTERNAL_HEADER_INITIAL_URL = `${INTERNAL_HEADER_PREFIX}initial-url`;
var INTERNAL_HEADER_LOCALE = `${INTERNAL_HEADER_PREFIX}locale`;
var INTERNAL_HEADER_RESOLVED_ROUTES = `${INTERNAL_HEADER_PREFIX}resolved-routes`;
var INTERNAL_HEADER_REWRITE_STATUS_CODE = `${INTERNAL_HEADER_PREFIX}rewrite-status-code`;
var INTERNAL_EVENT_REQUEST_ID = `${INTERNAL_HEADER_PREFIX}request-id`;
var geoHeaderToNextHeader = {
  "x-open-next-city": "x-vercel-ip-city",
  "x-open-next-country": "x-vercel-ip-country",
  "x-open-next-region": "x-vercel-ip-country-region",
  "x-open-next-latitude": "x-vercel-ip-latitude",
  "x-open-next-longitude": "x-vercel-ip-longitude"
};
var NEXT_INTERNAL_HEADERS = [
  "x-middleware-rewrite",
  "x-middleware-redirect",
  "x-middleware-set-cookie",
  "x-middleware-skip",
  "x-middleware-override-headers",
  "x-middleware-next",
  "x-now-route-matches",
  "x-matched-path",
  "x-nextjs-data",
  "x-next-resume-state-length"
];
function applyMiddlewareHeaders(eventOrResult, middlewareHeaders) {
  const isResult = isInternalResult(eventOrResult);
  const headers = eventOrResult.headers;
  const keyPrefix = isResult ? "" : MIDDLEWARE_HEADER_PREFIX;
  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    if (value) {
      headers[keyPrefix + key] = Array.isArray(value) ? value.join(",") : value;
    }
  });
}
async function routingHandler(event, { assetResolver }) {
  try {
    for (const [openNextGeoName, nextGeoName] of Object.entries(geoHeaderToNextHeader)) {
      const value = event.headers[openNextGeoName];
      if (value) {
        event.headers[nextGeoName] = value;
      }
    }
    for (const key of Object.keys(event.headers)) {
      const lowerCaseKey = key.toLowerCase();
      if (lowerCaseKey.startsWith(INTERNAL_HEADER_PREFIX) || lowerCaseKey.startsWith(MIDDLEWARE_HEADER_PREFIX) || NEXT_INTERNAL_HEADERS.includes(lowerCaseKey)) {
        delete event.headers[key];
      }
    }
    let headers = getNextConfigHeaders(event, ConfigHeaders);
    let eventOrResult = fixDataPage(event, BuildId);
    if (isInternalResult(eventOrResult)) {
      return eventOrResult;
    }
    const redirect = handleRedirects(eventOrResult, RoutesManifest.redirects);
    if (redirect) {
      redirect.headers.Location = normalizeLocationHeader(redirect.headers.Location, event.url, true);
      debug("redirect", redirect);
      return redirect;
    }
    const middlewareEventOrResult = await handleMiddleware(
      eventOrResult,
      // We need to pass the initial search without any decoding
      // TODO: we'd need to refactor InternalEvent to include the initial querystring directly
      // Should be done in another PR because it is a breaking change
      new URL(event.url).search
    );
    if (isInternalResult(middlewareEventOrResult)) {
      return middlewareEventOrResult;
    }
    const middlewareHeadersPrioritized = globalThis.openNextConfig.dangerous?.middlewareHeadersOverrideNextConfigHeaders ?? false;
    if (middlewareHeadersPrioritized) {
      headers = {
        ...headers,
        ...middlewareEventOrResult.responseHeaders
      };
    } else {
      headers = {
        ...middlewareEventOrResult.responseHeaders,
        ...headers
      };
    }
    let isExternalRewrite = middlewareEventOrResult.isExternalRewrite ?? false;
    eventOrResult = middlewareEventOrResult;
    if (!isExternalRewrite) {
      const beforeRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.beforeFiles);
      eventOrResult = beforeRewrite.internalEvent;
      isExternalRewrite = beforeRewrite.isExternalRewrite;
      if (!isExternalRewrite) {
        const assetResult = await assetResolver?.maybeGetAssetResult?.(eventOrResult);
        if (assetResult) {
          applyMiddlewareHeaders(assetResult, headers);
          return assetResult;
        }
      }
    }
    const foundStaticRoute = staticRouteMatcher(eventOrResult.rawPath);
    const isStaticRoute = !isExternalRewrite && foundStaticRoute.length > 0;
    if (!(isStaticRoute || isExternalRewrite)) {
      const afterRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.afterFiles);
      eventOrResult = afterRewrite.internalEvent;
      isExternalRewrite = afterRewrite.isExternalRewrite;
    }
    let isISR = false;
    if (!isExternalRewrite) {
      const fallbackResult = handleFallbackFalse(eventOrResult, PrerenderManifest);
      eventOrResult = fallbackResult.event;
      isISR = fallbackResult.isISR;
    }
    const foundDynamicRoute = dynamicRouteMatcher(eventOrResult.rawPath);
    const isDynamicRoute = !isExternalRewrite && foundDynamicRoute.length > 0;
    if (!(isDynamicRoute || isStaticRoute || isExternalRewrite)) {
      const fallbackRewrites = handleRewrites(eventOrResult, RoutesManifest.rewrites.fallback);
      eventOrResult = fallbackRewrites.internalEvent;
      isExternalRewrite = fallbackRewrites.isExternalRewrite;
    }
    const isNextImageRoute = eventOrResult.rawPath.startsWith("/_next/image");
    const isRouteFoundBeforeAllRewrites = isStaticRoute || isDynamicRoute || isExternalRewrite;
    if (!(isRouteFoundBeforeAllRewrites || isNextImageRoute || // We need to check again once all rewrites have been applied
    staticRouteMatcher(eventOrResult.rawPath).length > 0 || dynamicRouteMatcher(eventOrResult.rawPath).length > 0)) {
      eventOrResult = {
        ...eventOrResult,
        rawPath: "/404",
        url: constructNextUrl(eventOrResult.url, "/404"),
        headers: {
          ...eventOrResult.headers,
          "x-middleware-response-cache-control": "private, no-cache, no-store, max-age=0, must-revalidate"
        }
      };
    }
    if (globalThis.openNextConfig.dangerous?.enableCacheInterception && !isInternalResult(eventOrResult)) {
      debug("Cache interception enabled");
      eventOrResult = await cacheInterceptor(eventOrResult);
      if (isInternalResult(eventOrResult)) {
        applyMiddlewareHeaders(eventOrResult, headers);
        return eventOrResult;
      }
    }
    applyMiddlewareHeaders(eventOrResult, headers);
    const resolvedRoutes = [
      ...foundStaticRoute,
      ...foundDynamicRoute
    ];
    debug("resolvedRoutes", resolvedRoutes);
    return {
      internalEvent: eventOrResult,
      isExternalRewrite,
      origin: false,
      isISR,
      resolvedRoutes,
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(eventOrResult, NextConfig.i18n) : void 0,
      rewriteStatusCode: middlewareEventOrResult.rewriteStatusCode
    };
  } catch (e) {
    error("Error in routingHandler", e);
    return {
      internalEvent: {
        type: "core",
        method: "GET",
        rawPath: "/500",
        url: constructNextUrl(event.url, "/500"),
        headers: {
          ...event.headers
        },
        query: event.query,
        cookies: event.cookies,
        remoteAddress: event.remoteAddress
      },
      isExternalRewrite: false,
      origin: false,
      isISR: false,
      resolvedRoutes: [],
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(event, NextConfig.i18n) : void 0
    };
  }
}
function isInternalResult(eventOrResult) {
  return eventOrResult != null && "statusCode" in eventOrResult;
}

// ../../node_modules/@opennextjs/aws/dist/adapters/middleware.js
globalThis.internalFetch = fetch;
globalThis.__openNextAls = new AsyncLocalStorage();
var defaultHandler = async (internalEvent, options) => {
  const middlewareConfig = globalThis.openNextConfig.middleware;
  const originResolver = await resolveOriginResolver(middlewareConfig?.originResolver);
  const externalRequestProxy = await resolveProxyRequest(middlewareConfig?.override?.proxyExternalRequest);
  const assetResolver = await resolveAssetResolver(middlewareConfig?.assetResolver);
  const requestId = Math.random().toString(36);
  return runWithOpenNextRequestContext({
    isISRRevalidation: internalEvent.headers["x-isr"] === "1",
    waitUntil: options?.waitUntil,
    requestId
  }, async () => {
    const result = await routingHandler(internalEvent, { assetResolver });
    if ("internalEvent" in result) {
      debug("Middleware intercepted event", internalEvent);
      if (!result.isExternalRewrite) {
        const origin = await originResolver.resolve(result.internalEvent.rawPath);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_HEADER_INITIAL_URL]: internalEvent.url,
              [INTERNAL_HEADER_RESOLVED_ROUTES]: JSON.stringify(result.resolvedRoutes),
              [INTERNAL_EVENT_REQUEST_ID]: requestId,
              [INTERNAL_HEADER_REWRITE_STATUS_CODE]: String(result.rewriteStatusCode)
            }
          },
          isExternalRewrite: result.isExternalRewrite,
          origin,
          isISR: result.isISR,
          initialURL: result.initialURL,
          resolvedRoutes: result.resolvedRoutes
        };
      }
      try {
        return externalRequestProxy.proxy(result.internalEvent);
      } catch (e) {
        error("External request failed.", e);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_EVENT_REQUEST_ID]: requestId
            },
            rawPath: "/500",
            url: constructNextUrl(result.internalEvent.url, "/500"),
            method: "GET"
          },
          // On error we need to rewrite to the 500 page which is an internal rewrite
          isExternalRewrite: false,
          origin: false,
          isISR: result.isISR,
          initialURL: result.internalEvent.url,
          resolvedRoutes: [{ route: "/500", type: "page" }]
        };
      }
    }
    if (process.env.OPEN_NEXT_REQUEST_ID_HEADER || globalThis.openNextDebug) {
      result.headers[INTERNAL_EVENT_REQUEST_ID] = requestId;
    }
    debug("Middleware response", result);
    return result;
  });
};
var handler2 = await createGenericHandler({
  handler: defaultHandler,
  type: "middleware"
});
var middleware_default = {
  fetch: handler2
};
export {
  middleware_default as default,
  handler2 as handler
};
