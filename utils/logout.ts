import Cookies from "js-cookie";
import { persistStore } from "@/model/store";
import { cacheIdKey, cacheTokenKey } from "@/constants";

const logout = async () => {
  persistStore.pause();
  persistStore
    .flush()
    .then(() => {
      return persistStore.purge();
    })
    .then(() => {
      Cookies.remove(cacheTokenKey);
      Cookies.remove(cacheIdKey);
    });
};

export default logout;
