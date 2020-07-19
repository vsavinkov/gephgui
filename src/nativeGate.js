// this module will eventually be a wrapper for every platform.

import axios from "axios";
import semver from "semver";
import { getl10n } from "./redux/l10n";
import { version } from "../package.json";
import { AirlineSeatReclineExtra } from "@material-ui/icons";
import * as tauri from "tauri/api/tauri";

export { version } from "../package.json";
export const platform = window.__TAURI__ ? "tauri" : "android";

export function getVersion() {
  return "0.0.0";
}

var globl10n;

export function startUpdateChecks(l10n) {
  globl10n = l10n;
  if (platform === "tauri") {
  }
}

export function getPlatform() {
  return platform;
}

export function daemonRunning() {
  alert("daemonRunning cannot be used");
  return false;
}

export function checkAccount(uname, pwd) {
  if (platform === "android") {
    return new Promise((resolve, reject) => {
      window._CALLBACK = resolve;
      window.Android.jsCheckAccount(uname, pwd, "window._CALLBACK");
    });
  } else {
    return tauri.promisified({ cmd: "checkAccount", uname: uname, pwd: pwd });
  }
}

// spawn geph-client in binder proxy mode
export function startBinderProxy() {
  if (platform === "android") {
    let x = window.Android.jsStartProxBinder();
    return new Promise((resolve, reject) => {
      resolve(x);
    });
  } else {
    return tauri.promisified({ cmd: "startBinderProxy" });
  }
}

// stop the binder proxy by handle
export function stopBinderProxy(pid) {
  if (platform === "android") {
    window.Android.jsStopProxBinder(pid);
    return;
  } else {
    console.log(pid);
    tauri.invoke({ cmd: "stopBinderProxy", id: pid });
    return;
  }
}

// spawn the geph-client daemon
export async function startDaemon(
  exitName,
  exitKey,
  username,
  password,
  listenAll,
  forceBridges,
  autoProxy,
  bypassChinese
) {
  if (platform === "android") {
    window.Android.jsStartDaemon(
      username,
      password,
      exitName,
      exitKey,
      listenAll,
      forceBridges,
      bypassChinese
    );
  } else {
    alert("tauri start daemon");
  }
}

var proxySet = false;

// kill the daemon
export async function stopDaemon() {
  // before anything else, send a kill request
  if (platform === "android") {
    window.Android.jsStopDaemon();
  } else {
    alert("tauri stop daemon");
  }
}

// // kill the daemon when we exit
// if (isElectron) {
//   window.onbeforeunload = function (e) {
//     if (daemonPID != null) {
//       e.preventDefault();
//       e.returnValue = false;
//       const { remote } = window.require("electron");
//       remote.BrowserWindow.getFocusedWindow().hide();
//       return false;
//     }
//   };
// // }

// function arePermsCorrect() {
//   const fs = window.require("fs");
//   let stats = fs.statSync(getBinaryPath() + "pac");
//   console.log("UID of pac is", stats.uid, ", root is zero");
//   return stats.uid == 0;
// }

// function forceElevatePerms() {
//   return new Promise((resolve, reject) => {
//     const spawn = window.require("child_process").spawn;
//     let lol = spawn(getBinaryPath() + "cocoasudo", [
//       "--prompt=" + globl10n["macpacblurb"],
//       getBinaryPath() + "pac",
//       "setuid",
//     ]);
//     console.log(
//       "** PAC path is " + getBinaryPath() + "pac" + ", trying to elevate **"
//     );
//     lol.stderr.on("data", (data) => console.log(`stderr: ${data}`));
//     lol.on("close", (code) => {
//       resolve(code);
//     });
//   });
// }

// async function elevatePerms() {
//   const fs = window.require("fs");
//   let stats = fs.statSync(getBinaryPath() + "pac");
//   if (!arePermsCorrect()) {
//     console.log(
//       "We have to elevate perms for pac. But to prevent running into that infamous problem, we clear setuid bits first"
//     );
//     const spawnSync = window.require("child_process").spawnSync;
//     spawnSync("/bin/chmod", ["ug-s", getBinaryPath() + "pac"]);
//     console.log("Setuid cleared on pac, now we run cocoasudo!");
//     await forceElevatePerms();
//   }
// }
