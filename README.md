<div align="center">

# 🛡️ RedCloud VPN (نسخه ری‌اکت و وب)

### کلاینت نسل جدید ضدسانسور، فوق‌سریع و هوشمند

**Next-Generation Multi-Core Anti-Censorship Client Powered by React 18, Vite, TypeScript, and Tailwind CSS**

[![License](https://img.shields.io/badge/License-Apache_2.0-F9D423?style=for-the-badge&logo=apache&logoColor=black)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Telegram](https://img.shields.io/badge/Telegram-Channel-229ED9?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/DevTaha_project)

<br>

<img src="/assets/images/logo.png" width="115" height="115" alt="RedCloud Logo">

<p align="center">
<b>ردکلاود (RedCloud VPN)</b> یک کلاینت جامع، سبک و مقاوم در برابر فیلترینگ اینترنت است که به فریم‌ورک مدرن <b>React + TypeScript</b> بازنویسی شده است. این برنامه کلیه قابلیت‌ها و منطق تجاری نسخه اصلی از جمله اکانت‌های اشتراکی هوشمند VLESS، اسکنر آی‌پی تمیز لایه ۷ کلودفلر، موتور اَتر (WARP/MASQUE)، هدایت شبکه پیازی تور، تله‌متری زنده و مدیریت پیشرفته لاگ‌های سیستم را در خود جای داده است.
</p>

</div>

---

## 🌟 قابلیت‌های کلیدی (Core Features)

1. **داشبورد (Dashboard)**:
   - دریافت و انتخاب خودکار اکانت‌های اشتراکی بهینه VLESS over WebSocket از گیتهاب
   - اسکنر زنده آی‌پی‌های تمیز لایه ۷ کلودفلر (Layer 7 Clean IP Scanner)
   - دکمه اتصال دایره‌ای با انیمیشن‌های وضعیت (متصل، در حال اتصال، قطع)
   - سنجشگر پینگ و تله‌متری سرور خروجی (Public IP، کشور، پرچم، تاخیر میلی‌ثانیه)
   - ورودی دستی کانفیگ و کپی خودکار از کلیپ‌بورد

2. **هسته ضدسانسور اَتر (Aether WARP Engine)**:
   - پشتیبانی از حالت‌های Auto Failover، MASQUE (HTTP/2 TCP فرگمنت TLS)، MASQUE (HTTP/3 QUIC)، Gool (دو لایه WARP) و WireGuard

3. **شبکه پیازی تور (Tor Onion Routing)**:
   - خط لوله ۳ مرحله‌ای ساخت مدارهای امن: پل اَتر مسک -> مدارهای پیازی تور (۰ تا ۱۰۰ درصد) -> تونل سراسری
   - پشتیبانی از حالت‌های Aether MASQUE + Tor، Aether QUIC + Tor، Snowflake، اتصال مستقیم و پل‌های سفارشی (Custom Bridges)

4. **تنظیمات و سفارشی‌سازی (Settings)**:
   - بایپس هوشمند سایت‌های ایرانی و دامنه‌های داخلی (.ir)
   - بهینه‌سازی باتری و ثبات اتصال در پس‌زمینه
   - پشتیبانی کامل از زبان‌های فارسی (RTL) و انگلیسی (LTR)
   - تم تاریک و روشن (Dark / Light Mode)
   - پنجره مشاهده، فیلتر و خروجی کامل لاگ‌ها و گزارشات تشخیصی سیستم (System Logs & Diagnostics)

5. **حمایت مالی و ارتباط (Contact & Donate)**:
   - آدرس کیف پول تتر شبکه بایننس اسمارت چین (USDT BEP20)
   - لینک کانال رسمی تلگرام پروژه

---

## 🛠️ راه‌اندازی و اجرا (Development & Build)

```bash
# نصب وابستگی‌ها
npm install

# اجرای سرور توسعه
npm run dev

# ساخت نسخه پروداکشن
npm run build
```
