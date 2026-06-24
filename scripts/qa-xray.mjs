import { chromium } from "file:///C:/Users/Danie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.61.0/node_modules/playwright/index.mjs";
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join } from "node:path";

const publicRoot = "E:/MuShan/.output_build/public";
const mimeTypes = {
  ".css": "text/css",
  ".html": "text/html",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};
const server = createServer((request, response) => {
  const pathname = decodeURIComponent((request.url ?? "/").split("?")[0]);
  let filePath = join(publicRoot, pathname === "/" ? "index.html" : pathname);
  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, "index.html");
  }
  if (!existsSync(filePath)) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  response.setHeader(
    "Content-Type",
    mimeTypes[extname(filePath).toLowerCase()] ?? "application/octet-stream",
  );
  createReadStream(filePath).pipe(response);
});
await new Promise((resolve) => server.listen(4173, "127.0.0.1", resolve));

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const browserErrors = [];
page.on("pageerror", (error) => browserErrors.push(String(error)));
page.on("console", (message) => {
  if (message.type() === "error") browserErrors.push(message.text());
});
await page.goto("http://127.0.0.1:4173", { waitUntil: "networkidle" });
await page.locator(".xray-image-section").waitFor({ state: "visible" });
await page.locator(".xray-image-section").dispatchEvent("pointermove", {
  bubbles: true,
  clientX: 900,
  clientY: 430,
  pointerType: "mouse",
});
await page.mouse.move(900, 430);
await page.waitForTimeout(800);

const result = await page.evaluate(() => {
  const root = document.querySelector(".xray-image-section");
  const reveal = document.querySelector(".xray-image-section__reveal");
  const image = document.querySelector(".xray-image-section__image");
  if (!(root instanceof HTMLElement)) return { error: "root missing" };

  const rootStyle = getComputedStyle(root);
  const revealStyle = reveal ? getComputedStyle(reveal) : null;
  const imageStyle = image ? getComputedStyle(image) : null;
  const imageElement = image instanceof HTMLImageElement ? image : null;
  const bounds = root.getBoundingClientRect();

  return {
    className: root.className,
    bounds: {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
    },
    x: rootStyle.getPropertyValue("--x"),
    y: rootStyle.getPropertyValue("--y"),
    radius: rootStyle.getPropertyValue("--r"),
    rootPointerEvents: rootStyle.pointerEvents,
    revealOpacity: revealStyle?.opacity,
    revealZIndex: revealStyle?.zIndex,
    maskImage: revealStyle?.maskImage,
    webkitMaskImage: revealStyle?.webkitMaskImage,
    imageComplete: imageElement?.complete,
    imageNaturalWidth: imageElement?.naturalWidth,
    imageOpacity: imageStyle?.opacity,
    imageFilter: imageStyle?.filter,
    hitElement: document.elementFromPoint(900, 430)?.className,
  };
});

result.browserErrors = browserErrors;

await page.screenshot({ path: "C:/tmp/xray-qa.png", fullPage: false });
console.log(JSON.stringify(result, null, 2));
await browser.close();
await new Promise((resolve, reject) =>
  server.close((error) => (error ? reject(error) : resolve())),
);
