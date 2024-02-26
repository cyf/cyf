import axios from "axios";
import { v4 as uuidV4 } from "uuid";
import { isPlainObject, isEmpty } from "lodash";
import Cookies from "js-cookie";
import { fallbackLng } from "@/i18n/settings";
import { domain, cacheTokenKey, cacheLngKey } from "@/constants";
import { encryptSensitiveInfo, sign } from "@/utils";
import pkgInfo from "../package.json";

const baseURL = process.env.API_BASE_URL,
  isServer = typeof window === "undefined";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  // 服务端设置Access-Control-Allow-Credentials后, 前端无需设置
  // withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    config.params = config.params || {};
    config.params["timestamp"] = Date.now();
    config.params["nonce"] = uuidV4();

    if (config.method?.toUpperCase() === "GET") {
      config.params = {
        ...config.params,
        ...encryptSensitiveInfo(config.url || "", config.params),
      };
    }

    const data = config.data;
    if (
      config.method?.toUpperCase() === "POST" &&
      isPlainObject(data) &&
      !isEmpty(data)
    ) {
      config.data = {
        ...config.data,
        ...encryptSensitiveInfo(config.url || "", config.data),
      };
    }

    config.headers = config.headers || {};
    config.headers["x-sign"] = sign(config.params);
    config.headers["x-channel"] = "WEB";
    config.headers["x-version"] = pkgInfo.version;

    if (isServer) {
      const { cookies } = await import("next/headers"),
        token = cookies().get(cacheTokenKey)?.value;

      config.headers["x-locale"] =
        cookies().get(cacheLngKey)?.value || fallbackLng;
      if (token) {
        config.headers["x-token"] = `Bearer ${token}`;
      }
    } else {
      const token = document.cookie.replace(
        new RegExp(`(?:(?:^|.*;\\s*)${cacheTokenKey}\\s*=\\s*([^;]*).*$)|^.*$`),
        "$1",
      );
      const locale = document.cookie.replace(
        new RegExp(`(?:(?:^|.*;\\s*)${cacheLngKey}\\s*=\\s*([^;]*).*$)|^.*$`),
        "$1",
      );

      config.headers["x-locale"] = locale || fallbackLng;
      if (token) {
        config.headers["x-token"] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  async (response) => {
    if (![200, 201].includes(response.status)) {
      throw response;
    }
    return response.data;
  },
  async (error) => {
    const { response, request, code } = error;
    const { status } = response || {};
    if (status === 401) {
      Cookies.remove(cacheTokenKey);
      if (isServer) {
        const { cookies } = await import("next/headers"),
          locale = cookies().get(cacheLngKey)?.value || fallbackLng;
        const { useRouter, usePathname } = await import("next/navigation"),
          router = useRouter(),
          path = usePathname();
        const loginUrl = `${domain}/${locale}/login?r=${encodeURIComponent(`${domain}/${locale}${path}`)}`;
        router.replace(loginUrl);
      } else {
        const locale =
          document.cookie.replace(
            new RegExp(
              `(?:(?:^|.*;\\s*)${cacheLngKey}\\s*=\\s*([^;]*).*$)|^.*$`,
            ),
            "$1",
          ) || fallbackLng;

        const loginUrl = `${domain}/${locale}/login?r=${encodeURIComponent(window.location.href)}`;
        window.location.replace(loginUrl);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
