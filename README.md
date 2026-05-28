## 项目说明
个人91站<img width="30" height="30" alt="1f913" src="https://github.com/user-attachments/assets/606c8c18-e727-41fd-9431-5a053e416673" />个人91站
<img width="120" height="120" alt="91" src="https://github.com/user-attachments/assets/5b323c94-bbd3-4dce-bbc8-adc86935b7de" />
个人91站<img width="30" height="30" alt="1f913" src="https://github.com/user-attachments/assets/606c8c18-e727-41fd-9431-5a053e416673" />个人91站

支持115云盘，PikPak云盘作为视频播放后端 ▶

采用115云盘和PikPak云盘的302重定向，不占用服务器带宽（也不会受服务器带宽小而影响视频播放体验）✨

服务器只会扫描云盘中的视频文件，给每个视频文件生成封面图和预览片段 📷 

你可以通过封面图和预览片段在网站首页快速选择想看的视频 ✅

支持91爬虫，爬取91的本月最热视频 🕷

两种可选主题黑黄主题（91经典主题），粉白主题🎨

支持短视频模式（一键切换成熟悉的抖音）


---

## 预览图
电脑端
<img width="1867" height="1778" alt="91-电脑版002" src="https://github.com/user-attachments/assets/9808fceb-760b-4dd5-b7d2-8622b95b90d5" />
<img width="2559" height="1266" alt="PixPin_2026-05-28_21-05-24" src="https://github.com/user-attachments/assets/859db4aa-1fba-44f2-bb46-1db07c2f964f" />
<img width="2338" height="1777" alt="91-电脑版" src="https://github.com/user-attachments/assets/96bea37a-8764-413e-9b70-1856b4ae0cd2" />
<img width="2560" height="1250" alt="PixPin_2026-05-28_21-05-55" src="https://github.com/user-attachments/assets/29c1e27a-7651-4dfc-93dd-556331844214" />

手机端
<img width="1260" height="2476" alt="91-手机端" src="https://github.com/user-attachments/assets/991338bc-914f-42f1-8331-722cb4b155e2" />
<img width="1260" height="2472" alt="91-手机端002" src="https://github.com/user-attachments/assets/ed9e6240-9864-45a3-8206-0740a702692f" />

## 快速开始

一键安装脚本
```bash
sudo apt update
sudo apt install -y curl ca-certificates
curl -fsSL https://raw.githubusercontent.com/nianzhibai/91/main/install.sh -o install.sh
sudo bash install.sh
```

部署完成后访问：

- 前台：`http://服务器IP:9191/`
- 后台：`http://服务器IP:9191/admin`

安装后会自动创建 `91` 指令

```bash
91          # 打开管理菜单
91 status   # 查看状态
91 logs     # 查看日志
91 update   # 更新
91 restart  # 重启
91 stop     # 停止
```

同时也保留 `video-site-91` 作为同等别名。

想换端口：

```bash
FRONTEND_PORT=8080 sudo -E bash install.sh
```
---

## 数据存放位置

项目会把运行数据保存在本地：

- `/opt/video-site-91/config.yaml`：本地配置、管理员账号、网盘凭证。
- `/opt/video-site-91/data/video-site.db`：SQLite 数据库。
- `/opt/video-site-91/data/previews/`：本地生成的封面和 teaser。

---
## 了解项目更多细节

根目录 README 只保留项目介绍和最短上手路径。更细的实现、接口、网盘字段和部署方式可以看：

- [backend/README.md](backend/README.md)
- [video-site-implementation-plan.md](video-site-implementation-plan.md)

---

## 使用边界

这个项目面向个人私有部署。请只接入你有权访问和管理的内容，并遵守对应网盘、站点服务条款以及所在地法律法规。

不要传播，仅限个人使用，个人视频站

----
## 致谢
感谢开源项目OpenList

感谢LinuxDo社区，学AI上L站
