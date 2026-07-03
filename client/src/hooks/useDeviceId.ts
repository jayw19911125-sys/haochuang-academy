/**
 * useDeviceId - 匿名裝置識別 Hook
 * 使用瀏覽器指紋生成穩定的 deviceId，存入 localStorage
 * 不需要用戶登入，即可跨頁面保持學習進度
 */

import { useState, useEffect } from "react";

function generateDeviceId(): string {
  // 使用多個瀏覽器特徵組合生成穩定指紋
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.textBaseline = "top";
    ctx.font = "14px Arial";
    ctx.fillText("好創學院", 2, 2);
  }
  const canvasHash = canvas.toDataURL().slice(-20);

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    canvasHash,
  ].join("|");

  // 簡單 hash 函數
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 轉為 32 位整數
  }

  // 轉為 hex 字串並加上隨機後綴確保唯一性
  const hexHash = Math.abs(hash).toString(16).padStart(8, "0");
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  return `dev_${hexHash}_${randomSuffix}`;
}

const DEVICE_ID_KEY = "haochuang-device-id";

/**
 * 從 URL 參數讀取分享的 deviceId
 * 支援格式：?share=dev_xxxxxxxx_xxxxxx
 */
export function getSharedDeviceIdFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const shared = params.get("share");
  if (shared && shared.startsWith("dev_")) return shared;
  return null;
}

export function useDeviceId(): string {
  const [deviceId, setDeviceId] = useState<string>(() => {
    // SSR 安全、先嘗試從 localStorage 讀取
    if (typeof window === "undefined") return "";
    
    const stored = localStorage.getItem(DEVICE_ID_KEY);
    if (stored && stored.startsWith("dev_")) return stored;
    
    // 生成新的 deviceId
    const newId = generateDeviceId();
    localStorage.setItem(DEVICE_ID_KEY, newId);
    return newId;
  });

  useEffect(() => {
    if (!deviceId) {
      const stored = localStorage.getItem(DEVICE_ID_KEY);
      if (stored && stored.startsWith("dev_")) {
        setDeviceId(stored);
      } else {
        const newId = generateDeviceId();
        localStorage.setItem(DEVICE_ID_KEY, newId);
        setDeviceId(newId);
      }
    }
  }, [deviceId]);

  return deviceId;
}

// 直接取得 deviceId（非 hook 版本，用於非 React 環境）
export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  
  const stored = localStorage.getItem(DEVICE_ID_KEY);
  if (stored && stored.startsWith("dev_")) return stored;
  
  const newId = generateDeviceId();
  localStorage.setItem(DEVICE_ID_KEY, newId);
  return newId;
}
