import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const shortsPageSource = readFileSync(
  new URL("../src/pages/ShortsPage.tsx", import.meta.url),
  "utf8"
);

test("shorts recommendation preference follows successful likes instead of watch time", () => {
  assert.doesNotMatch(shortsPageSource, /currentTime\s*>=\s*3/);
  assert.doesNotMatch(shortsPageSource, /onPreferenceReady/);

  const match = /const handleLikeToggle[\s\S]*?const hasLiked/.exec(
    shortsPageSource
  );
  assert.ok(match, "handleLikeToggle block should be present");

  assert.match(
    match[0],
    /if \(liked\) \{\s*preferredFromVideoIdRef\.current = videoId;\s*\} else if \(preferredFromVideoIdRef\.current === videoId\) \{\s*preferredFromVideoIdRef\.current = null;/
  );
});

test("shorts progress dragging uses immediate pointer state", () => {
  assert.match(shortsPageSource, /const scrubbingRef = useRef\(false\)/);
  assert.match(shortsPageSource, /scrubbingRef\.current = true;/);
  assert.match(shortsPageSource, /if \(!scrubbingRef\.current\) return;/);
  assert.doesNotMatch(shortsPageSource, /if \(!scrubbing\) return;/);
  assert.match(shortsPageSource, /function getSeekDuration/);
  assert.match(shortsPageSource, /onLostPointerCapture=\{handleProgressPointerEnd\}/);
});

test("shorts progress listeners rebind when deferred videos mount", () => {
  assert.match(
    shortsPageSource,
    /MOUNT_RADIUS 会让远离当前屏的 slide 先以海报占位/
  );
  assert.match(shortsPageSource, /if \(!shouldMount\) \{\s*setDuration\(0\);\s*setCurrentTime\(0\);/);
  assert.match(
    shortsPageSource,
    /\}, \[shouldMount, shouldLoad, item\.id, index, isActive, muted, volume, setMuted, setVolume, onActiveReadyForPreload, onActiveNeedsPriority, onSourceCached\]\);/
  );
});

test("shorts preloads the next original video only after the active video has comfortable buffer", () => {
  assert.match(shortsPageSource, /const \[activeReadyForPreload, setActiveReadyForPreload\] = useState\(false\);/);
  assert.match(shortsPageSource, /const ACTIVE_PRELOAD_BUFFER_SECONDS = 12;/);
  assert.match(shortsPageSource, /const shouldPreload = activeReadyForPreload && index === activeIndex \+ 1;/);
  assert.match(shortsPageSource, /const shouldLoad = isActiveSlide \|\| shouldPreload \|\| shouldRetainCached;/);
  assert.match(shortsPageSource, /shouldLoad=\{shouldLoad\}/);
  assert.match(shortsPageSource, /setActiveReadyForPreload\(false\);\s*setActiveIndex\(bestIndex\);/);
  assert.match(shortsPageSource, /function syncActivePreloadReadiness\(currentVideo: HTMLVideoElement\)/);
  assert.match(shortsPageSource, /if \(videoHasComfortableBuffer\(currentVideo\)\) \{\s*onActiveReadyForPreload\(index\);/);
  assert.match(shortsPageSource, /if \(isActive\) onActiveNeedsPriority\(index\);/);
  assert.match(shortsPageSource, /video\.addEventListener\("progress", handleProgress\);/);
  assert.match(shortsPageSource, /src=\{shouldLoad \? item\.videoSrc : undefined\}/);
  assert.match(shortsPageSource, /video\.removeAttribute\("src"\)/);
  assert.doesNotMatch(shortsPageSource, /src=\{shouldLoad \? item\.previewSrc/);
});

test("shorts preload grant uses high/low watermark hysteresis", () => {
  // 高水位 12s 授权、低水位 4s 收回，之间维持现状，避免阈值附近抖动
  assert.match(shortsPageSource, /const ACTIVE_PRELOAD_KEEP_SECONDS = 4;/);
  assert.match(
    shortsPageSource,
    /\} else if \(videoBufferIsCritical\(currentVideo\)\) \{[\s\S]*?onActiveNeedsPriority\(index\);/
  );
  assert.match(shortsPageSource, /function videoBufferIsCritical\(video: HTMLVideoElement\)/);
  // 已缓冲到片尾时既视为健康也不视为告急，避免临近结尾误收回授权
  assert.match(shortsPageSource, /function videoBufferedToEnd\(video: HTMLVideoElement\)/);
  assert.match(
    shortsPageSource,
    /if \(videoBufferedToEnd\(video\)\) return true;[\s\S]*?>= ACTIVE_PRELOAD_BUFFER_SECONDS;/
  );
  assert.match(
    shortsPageSource,
    /if \(videoBufferedToEnd\(video\)\) return false;[\s\S]*?< ACTIVE_PRELOAD_KEEP_SECONDS;/
  );
});

test("shorts keeps adjacent buffered sources as a lightweight cache", () => {
  assert.match(shortsPageSource, /const \[cacheableSourceIds, setCacheableSourceIds\] = useState<Set<string>>/);
  assert.match(shortsPageSource, /setCacheableSourceIds\(\(prev\) => \{/);
  // 相邻屏内（前一条或后一条）已缓冲过的视频都保留 src，回滑/再前滑均复用缓存
  assert.match(
    shortsPageSource,
    /const shouldRetainCached =\s*shouldMount && !isActiveSlide && cacheableSourceIds\.has\(item\.id\);/
  );
  // 活跃视频一旦 canplay 就标记可复用，快速划走的视频回滑也有缓存
  assert.match(
    shortsPageSource,
    /if \(isActive\) onSourceCached\(item\.id\);/
  );
  // 预加载中的下一条积累到足够缓冲后同样标记，授权收回时不丢弃其数据
  assert.match(
    shortsPageSource,
    /if \(!isActive && shouldLoad && videoHasComfortableBuffer\(video\)\) \{\s*onSourceCached\(item\.id\);/
  );
  assert.match(shortsPageSource, /shouldEagerLoad=\{shouldEagerLoad\}/);
  assert.match(shortsPageSource, /preload=\{shouldLoad \? \(shouldEagerLoad \? "auto" : "metadata"\) : "none"\}/);
});

test("shorts fullscreen changes preserve the active slide", () => {
  assert.match(shortsPageSource, /const activeIndexRef = useRef\(0\)/);
  assert.match(shortsPageSource, /const ignoreIntersectionUntilRef = useRef\(0\)/);
  assert.match(
    shortsPageSource,
    /if \(Date\.now\(\) < ignoreIntersectionUntilRef\.current\) return;/
  );
  assert.match(shortsPageSource, /function scheduleFullscreenActiveRestore\(\)/);
  assert.match(shortsPageSource, /scheduleFullscreenActiveRestore\(\);\s*setIsFullscreen/);
  assert.match(
    shortsPageSource,
    /function toggleFullscreen\(\) \{\s*scheduleFullscreenActiveRestore\(\);/
  );
  assert.match(shortsPageSource, /scrollIntoView\(\{ block: "start", inline: "nearest", behavior: "auto" \}\)/);
});
