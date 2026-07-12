# 森林 × 鲜艳｜我们的第一年

写给鲜艳的一封时光长信，纪念从 2025 年 7 月 15 日开始，我们一起走过的第一个春夏秋冬。

## 本地运行

```bash
npm install
npm run dev
```

## 更新照片

原始照片放在 `images/活动文件夹/` 中，不会提交到 GitHub。运行以下命令生成去除 EXIF 信息、适合网页加载的 WebP 全图和缩略图：

```bash
python scripts/prepare_images.py
```

活动文案位于 `scripts/prepare_images.py` 的 `COPY` 配置中。更新后重新执行脚本并提交 `public/memories/` 和 `public/memories.json`。

## 部署

推送到 `main` 分支后，GitHub Actions 会自动构建并部署到 GitHub Pages。
