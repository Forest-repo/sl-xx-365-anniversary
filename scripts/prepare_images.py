from pathlib import Path
import json
import re
import shutil
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "images"
OUTPUT = ROOT / "public" / "memories"

COPY = {
    "2025年5月--两人一起看车和买车--车名星舰7": ("2025.05", "我们的第一辆车", "一起看车、一起做决定，星舰 7 成了我们奔向未来的第一位伙伴。", "从这一天起，远方不再只是地图上的名字。"),
    "2025年7月06--一起去水上乐园玩水": ("2025.07.06", "盛夏的水花", "阳光、笑声和猝不及防的水花，把那个夏天变得格外明亮。", "快乐很简单，就是转过头时你也在笑。"),
    "2025年7月15--正式表白在一起": ("2025.07.15", "故事真正开始", "那一天，我们认真地选择了彼此。从此以后，生活里的每一个普通日子都有了新的意义。", "我很庆幸，那天鼓起勇气走向了你。"),
    "2025年7月--公司团建--仙女山和漂流": ("2025.07", "山风与漂流", "仙女山的风和漂流的浪，见证了我们并肩去体验世界的热烈。", "有你在身边，冒险也会变成温柔的回忆。"),
    "2025年8月--一起去金刀峡游玩": ("2025.08", "峡谷里的我们", "沿着山路向前，看瀑布、听风声，也把彼此放进了更多风景里。", "路可以很长，但我想一直和你同路。"),
    "2025年9月--一起去南川区游玩": ("2025.09", "南川的秋日", "初秋的南川，藏着我们放慢脚步的一天，也藏着许多自然流露的笑容。", "旅行的意义，是我们一起经过。"),
    "2025年10月--一起去西安游玩": ("2025.10", "长安一夜", "灯火映着城墙，你穿着汉服站在长安的夜色里，像一幅我舍不得移开目光的画。", "跨过千年灯火，我最想遇见的仍然是你。"),
    "2026年2月--鲜艳的生日": ("2026.02", "为你庆祝的日子", "花束、祝福和认真准备的小惊喜，因为是你的生日，所以每个细节都值得被珍藏。", "愿你永远被爱，也永远自由明亮。"),
    "2026年2月--邀请鲜艳来我家过年玩": ("2026.02", "一起回家过年", "当你走进我的生活，也走进我的家，关于“我们”的想象忽然有了更具体的模样。", "希望往后的团圆里，身边一直有你。"),
    "2026年4月--一起去贵州游玩": ("2026.04", "春天驶向贵州", "春天的山水、一路的风景，还有车里说不完的话，共同拼成了这次旅程。", "想和你看遍山河，也认真过好朝夕。"),
    "2026年6月--公司团建--三亚游玩": ("2026.06", "海风吹向夏天", "海浪、椰影和晴朗的天空，是第一周年到来之前，生活送给我们的蓝色浪漫。", "海有尽头，而我想与你走得更远。"),
}

def sort_key(name: str):
    match = re.match(r"(\d{4})年(\d+)月(?:([0-9]+))?", name)
    if not match:
        return (9999, 99, 99)
    year, month, day = match.groups()
    return (int(year), int(month), int(day or 1))

def save_webp(source: Path, target: Path, max_side: int, quality: int):
    with Image.open(source) as raw:
        image = ImageOps.exif_transpose(raw).convert("RGB")
        image.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
        target.parent.mkdir(parents=True, exist_ok=True)
        image.save(target, "WEBP", quality=quality, method=6)
        return image.width, image.height

def main():
    if not SOURCE.exists():
        raise SystemExit(f"未找到原图目录：{SOURCE}")
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir(parents=True)
    memories = []
    folders = sorted((p for p in SOURCE.iterdir() if p.is_dir()), key=lambda p: sort_key(p.name))
    for index, folder in enumerate(folders, 1):
        slug = f"chapter-{index:02d}"
        photos = []
        sources = sorted(folder.glob("*.jpg"))
        for photo_index, source in enumerate(sources, 1):
            filename = f"{photo_index:02d}.webp"
            full = OUTPUT / slug / "full" / filename
            thumb = OUTPUT / slug / "thumb" / filename
            width, height = save_webp(source, full, 1800, 82)
            save_webp(source, thumb, 640, 74)
            photos.append({
                "full": f"memories/{slug}/full/{filename}",
                "thumb": f"memories/{slug}/thumb/{filename}",
                "width": width,
                "height": height,
                "alt": f"森林和鲜艳的回忆 · {COPY[folder.name][1]} · 第 {photo_index} 张"
            })
        date, title, story, quote = COPY[folder.name]
        memories.append({
            "id": slug,
            "date": date,
            "title": title,
            "story": story,
            "quote": quote,
            "photos": photos,
        })
    (ROOT / "public" / "memories.json").write_text(
        json.dumps(memories, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    total = sum(p.stat().st_size for p in OUTPUT.rglob("*.webp"))
    print(f"已生成 {sum(len(m['photos']) for m in memories)} 张全图和缩略图，共 {total / 1024 / 1024:.2f} MB")

if __name__ == "__main__":
    main()
