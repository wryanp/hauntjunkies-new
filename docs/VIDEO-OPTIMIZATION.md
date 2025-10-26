# 🎥 Video File Optimization Guide

**Performance Recommendation for Production**

---

## Current Video Files

Located in `/static/videos/`:

| File | Size | Usage | Priority |
|------|------|-------|----------|
| `fox5-news.mp4` | **50 MB** | Press coverage | 🔴 HIGH |
| `mccloud-manor.mp4` | **19 MB** | Manor page | 🟡 MEDIUM |
| `haunt.mp4` | **3.7 MB** | General haunt | ✅ OK |

**Total:** 72.7 MB of video files

---

## Performance Impact

### Current State
- ❌ **50 MB fox5-news.mp4** - Very large, slow to load
- ⚠️ **19 MB mccloud-manor.mp4** - Large, especially on mobile
- ✅ **3.7 MB haunt.mp4** - Acceptable size

### User Impact
- Slow page load times
- High bandwidth usage (mobile data)
- Potential buffering issues
- Poor experience on slow connections

---

## Optimization Recommendations

### 1. Compress Existing Videos

Use FFmpeg to reduce file sizes by 60-80% without quality loss:

```bash
# Install FFmpeg
# macOS: brew install ffmpeg
# Windows: Download from ffmpeg.org
# Linux: sudo apt install ffmpeg

# Optimize fox5-news.mp4 (50MB → ~10-15MB)
ffmpeg -i static/videos/fox5-news.mp4 \
  -c:v libx264 \
  -crf 28 \
  -preset slow \
  -c:a aac \
  -b:a 128k \
  static/videos/fox5-news-optimized.mp4

# Optimize mccloud-manor.mp4 (19MB → ~5-7MB)
ffmpeg -i static/videos/mccloud-manor.mp4 \
  -c:v libx264 \
  -crf 26 \
  -preset slow \
  -c:a aac \
  -b:a 128k \
  static/videos/mccloud-manor-optimized.mp4
```

**CRF Values:**
- `23` = High quality (larger file)
- `26` = Good quality (recommended)
- `28` = Lower quality (smaller file)
- `30+` = Noticeable quality loss

### 2. Create WebM Versions

WebM format offers better compression than MP4:

```bash
# Create WebM version (usually 30-50% smaller)
ffmpeg -i static/videos/fox5-news.mp4 \
  -c:v libvpx-vp9 \
  -crf 30 \
  -b:v 0 \
  -c:a libopus \
  static/videos/fox5-news.webm

ffmpeg -i static/videos/mccloud-manor.mp4 \
  -c:v libvpx-vp9 \
  -crf 28 \
  -b:v 0 \
  -c:a libopus \
  static/videos/mccloud-manor.webm
```

### 3. Use Multiple Resolutions

Create versions for different screen sizes:

```bash
# 1080p (desktop)
ffmpeg -i input.mp4 -vf scale=1920:1080 output-1080p.mp4

# 720p (tablets)
ffmpeg -i input.mp4 -vf scale=1280:720 output-720p.mp4

# 480p (mobile)
ffmpeg -i input.mp4 -vf scale=854:480 output-480p.mp4
```

---

## Implementation Examples

### Modern `<video>` Tag with Multiple Formats

```html
<video controls preload="metadata" poster="/video-poster.jpg">
  <!-- WebM for modern browsers (best compression) -->
  <source src="/videos/fox5-news.webm" type="video/webm">

  <!-- MP4 fallback for older browsers -->
  <source src="/videos/fox5-news-optimized.mp4" type="video/mp4">

  <!-- Fallback text for browsers without video support -->
  Your browser doesn't support video playback.
</video>
```

### Lazy Loading Videos

For below-the-fold videos:

```html
<video
  controls
  preload="none"
  loading="lazy"
  poster="/video-poster.jpg"
>
  <source src="/videos/mccloud-manor.webm" type="video/webm">
  <source src="/videos/mccloud-manor-optimized.mp4" type="video/mp4">
</video>
```

### Responsive Video with Srcset

```html
<video controls>
  <source
    srcset="/videos/haunt-1080p.webm 1920w,
            /videos/haunt-720p.webm 1280w,
            /videos/haunt-480p.webm 854w"
    type="video/webm"
  >
  <source src="/videos/haunt.mp4" type="video/mp4">
</video>
```

---

## Quick Wins (Do First)

### Priority 1: Optimize fox5-news.mp4 (50 MB → ~10 MB)

```bash
# Single command to compress fox5-news.mp4
ffmpeg -i static/videos/fox5-news.mp4 \
  -c:v libx264 -crf 28 -preset slow \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  static/videos/fox5-news-opt.mp4

# Replace original after verifying quality
mv static/videos/fox5-news-opt.mp4 static/videos/fox5-news.mp4
```

**Expected Results:**
- Size: 50 MB → 8-12 MB (80% reduction)
- Quality: Nearly identical to original
- Load time: 10-15s → 2-3s (on 10 Mbps connection)

### Priority 2: Optimize mccloud-manor.mp4 (19 MB → ~5 MB)

```bash
ffmpeg -i static/videos/mccloud-manor.mp4 \
  -c:v libx264 -crf 26 -preset slow \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  static/videos/mccloud-manor-opt.mp4

mv static/videos/mccloud-manor-opt.mp4 static/videos/mccloud-manor.mp4
```

**Expected Results:**
- Size: 19 MB → 4-6 MB (70% reduction)
- Quality: Excellent
- Load time: 4-5s → 1-2s

---

## Advanced Optimizations

### 1. Adaptive Bitrate Streaming (HLS)

For professional video delivery:

```bash
# Generate HLS playlist with multiple quality levels
ffmpeg -i input.mp4 \
  -c:v libx264 -b:v 5000k -maxrate 5350k -bufsize 7500k -s 1920x1080 -hls_time 6 -hls_playlist_type vod output-1080p.m3u8 \
  -c:v libx264 -b:v 2800k -maxrate 2996k -bufsize 4200k -s 1280x720 -hls_time 6 -hls_playlist_type vod output-720p.m3u8
```

Then use video.js or similar player for adaptive streaming.

### 2. Cloudflare Stream (Managed Video)

Upload videos to Cloudflare Stream:
- Automatic optimization
- Adaptive bitrate
- Global CDN delivery
- Cost: $1/1000 minutes viewed

```html
<stream src="video-id"></stream>
<script src="https://embed.cloudflare.com/embed/r4xu.fla9.latest.js"></script>
```

### 3. YouTube Embedding

If videos are already on YouTube:

```html
<!-- Lightweight YouTube embed -->
<lite-youtube videoid="YOUR_VIDEO_ID"></lite-youtube>
<script src="https://cdn.jsdelivr.net/npm/lite-youtube-embed@0.2.0"></script>
```

Benefits:
- 224x smaller than iframe embed
- YouTube handles all optimization
- Free CDN delivery

---

## Checklist for Video Optimization

### Before Optimization
- [x] Identified video files
- [x] Measured current sizes
- [x] Assessed performance impact

### Basic Optimization
- [ ] Install FFmpeg
- [ ] Compress fox5-news.mp4
- [ ] Compress mccloud-manor.mp4
- [ ] Test compressed videos for quality
- [ ] Replace original files

### Advanced Optimization
- [ ] Create WebM versions
- [ ] Generate multiple resolutions
- [ ] Add poster images
- [ ] Implement lazy loading
- [ ] Test on mobile devices

### Deployment
- [ ] Verify all videos load correctly
- [ ] Check file sizes reduced
- [ ] Test on slow connection
- [ ] Monitor bandwidth usage

---

## Tools & Resources

### Video Compression Tools

**Online (No Install Required):**
- https://www.freeconvert.com/video-compressor
- https://www.videosmaller.com/
- https://cloudconvert.com/

**Desktop Apps:**
- **HandBrake** (Free, GUI) - https://handbrake.fr/
- **FFmpeg** (Free, CLI) - https://ffmpeg.org/
- **Adobe Media Encoder** (Paid)

### Testing Tools

**Page Speed:**
- https://pagespeed.web.dev/
- Check "Serve videos in next-gen formats"

**Video Analysis:**
- https://www.videofileanalyzer.com/
- Check codec, bitrate, resolution

### Hosting Options

**Free:**
- YouTube (embed)
- Vimeo Free (limited)
- Your own server (bandwidth costs)

**Paid:**
- Cloudflare Stream ($5/1000 minutes stored)
- Mux ($0.003/minute delivered)
- AWS S3 + CloudFront (varies)

---

## Expected Improvements

### After Basic Compression

**Before:**
- Total video size: 72.7 MB
- Homepage load (with video): ~8-10s
- Mobile data usage: High

**After:**
- Total video size: ~18-20 MB (72% reduction)
- Homepage load (with video): ~2-3s
- Mobile data usage: Medium

### After Full Optimization (WebM + Lazy Load)

**Before:**
- Total video size: 72.7 MB
- All videos load immediately
- Poor mobile experience

**After:**
- Total video size: ~12-15 MB (80% reduction)
- Videos load on demand
- Fast mobile experience

---

## Quick Reference

### FFmpeg Compression Cheat Sheet

```bash
# High quality, smaller size (recommended)
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k output.mp4

# Good quality, much smaller
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k output.mp4

# WebM (next-gen format)
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -c:a libopus output.webm

# Mobile-optimized (480p)
ffmpeg -i input.mp4 -vf scale=854:480 -c:v libx264 -crf 28 -c:a aac -b:a 96k output-mobile.mp4
```

---

## Summary

**Immediate Action:**
1. Compress `fox5-news.mp4` (50 MB → ~10 MB)
2. Compress `mccloud-manor.mp4` (19 MB → ~5 MB)
3. Add `preload="metadata"` to video tags
4. Add poster images

**Time Required:** 30-60 minutes
**Difficulty:** Easy (copy/paste commands)
**Impact:** 🚀 Massive (70-80% size reduction)

---

<div align="center">

**🎬 Video Optimization Guide Complete!**

*Faster load times, better user experience*

</div>
