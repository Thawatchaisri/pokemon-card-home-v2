<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Pokémon Card Collection — README</title>
</head>
<body style="font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; line-height:1.6; color:#0f172a; background:#f8fafc; padding:40px;">

  <header style="max-width:900px; margin:0 auto 28px auto; background:#ffffff; padding:28px; border-radius:12px; box-shadow:0 6px 20px rgba(15,23,42,0.06);">
    <div style="display:flex; align-items:center; gap:16px;">
      <div style="width:72px; height:72px; background:linear-gradient(135deg,#06b6d4,#7c3aed); border-radius:12px; display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:20px;">
        PC
      </div>
      <div>
        <h1 style="margin:0; font-size:22px;">Pokémon Card Collection</h1>
        <p style="margin:6px 0 0 0; color:#475569;">เว็บสะสมการ์ด — แสดงราคาขายที่กำหนดเอง พร้อมกราฟราคาจากแหล่งข้อมูลภายนอก</p>
        <p style="margin:6px 0 0 0; color:#94a3b8; font-size:13px;">A collectible card web app with manual selling prices, real-time market charts, and admin management.</p>
      </div>
    </div>
  </header>

  <main style="max-width:900px; margin:0 auto;">

    <!-- Badges -->
    <section style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
      <div style="background:#eef2ff; color:#3730a3; padding:6px 10px; border-radius:999px; font-size:13px;">Next.js</div>
      <div style="background:#ecfeff; color:#065f46; padding:6px 10px; border-radius:999px; font-size:13px;">TypeScript</div>
      <div style="background:#f1f5f9; color:#1e293b; padding:6px 10px; border-radius:999px; font-size:13px;">TailwindCSS</div>
      <div style="background:#fff7ed; color:#7c2d12; padding:6px 10px; border-radius:999px; font-size:13px;">Express</div>
      <div style="background:#f0fdf4; color:#065f46; padding:6px 10px; border-radius:999px; font-size:13px;">PostgreSQL</div>
    </section>

    <!-- Features -->
    <section style="background:#ffffff; padding:20px; border-radius:12px; box-shadow:0 6px 18px rgba(2,6,23,0.03); margin-bottom:18px;">
      <h2 style="margin:0 0 12px 0; font-size:16px;">Features / ฟีเจอร์หลัก</h2>
      <ul style="margin:0; padding-left:18px; color:#334155;">
        <li>Sub-menus: Pokémon (EN / TH / JP), Baseball, Football</li>
        <li>Manual selling price per card (admin set)</li>
        <li>Real-time price history chart (PokePriceTracker) — สำหรับกราฟเท่านั้น</li>
        <li>View All Cards (เรียงตามราคาสูงสุด) + pagination (10/หน้า)</li>
        <li>Card detail modal with multi-image carousel (1–10 images)</li>
        <li>Buy → opens dynamic LINE QR code (managed in Admin)</li>
        <li>Admin panel: CRUD cards, upload images, manage QR, news</li>
      </ul>
    </section>

    <!-- Quick Demo / Screenshot -->
    <section style="display:flex; gap:14px; margin-bottom:18px;">
      <div style="flex:1; background:#fff; padding:14px; border-radius:12px; box-shadow:0 4px 12px rgba(2,6,23,0.03);">
        <h3 style="margin:0 0 10px 0; font-size:14px;">Quick Start / วิธีเริ่มต้น</h3>
        <pre style="background:#0f172a; color:#e6eef8; padding:12px; border-radius:8px; font-size:13px; overflow:auto;"># clone & install
git clone https://github.com/username/pokemon-card-collection.git
cd project

# frontend
cd frontend
npm install
npm run dev

# backend
cd ../backend
npm install
npm run dev
</pre>
      </div>

      <div style="width:260px; background:linear-gradient(180deg,#0ea5e9,#7c3aed); color:white; padding:14px; border-radius:12px; display:flex; flex-direction:column; justify-content:center;">
        <h4 style="margin:0 0 8px 0;">Deploy Tips</h4>
        <ul style="margin:0; padding-left:18px; font-size:13px;">
          <li>Use Docker + docker-compose</li>
          <li>Store secrets in env vars / secret manager</li>
          <li>Use CDN (images) and HTTPS</li>
        </ul>
      </div>
    </section>

    <!-- API & DB -->
    <section style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:18px;">
      <div style="background:#fff; padding:16px; border-radius:12px; box-shadow:0 4px 12px rgba(2,6,23,0.03);">
        <h3 style="margin-top:0; font-size:14px;">API Endpoints (selected)</h3>
        <ul style="padding-left:18px; color:#334155;">
          <li><code>/api/cards?language=</code> — list by language</li>
          <li><code>/api/cards/view-all?page=&perPage=</code> — view all sorted by price</li>
          <li><code>/api/cards/{id}/price-history</code> — chart data (proxy)</li>
          <li><code>/api/admin/cards</code> — CRUD (admin)</li>
          <li><code>/api/admin/line-qr</code> — manage QR code</li>
        </ul>
      </div>

      <div style="background:#fff; padding:16px; border-radius:12px; box-shadow:0 4px 12px rgba(2,6,23,0.03);">
        <h3 style="margin-top:0; font-size:14px;">Database (high level)</h3>
        <p style="margin:0; color:#475569; font-size:13px;">
          PostgreSQL with tables: <strong>cards</strong>, <strong>card_images</strong>, <strong>price_history</strong>, <strong>admins</strong>, <strong>line_qr</strong>.
        </p>
      </div>
    </section>

    <!-- How to contribute -->
    <section style="background:#ffffff; padding:18px; border-radius:12px; margin-bottom:18px; box-shadow:0 4px 12px rgba(2,6,23,0.03);">
      <h3 style="margin:0 0 8px 0; font-size:15px;">Contributing / ร่วมพัฒนา</h3>
      <ol style="padding-left:18px; color:#334155;">
        <li>Fork the repo</li>
        <li>Create a feature branch</li>
        <li>Write tests and update docs</li>
        <li>Submit a pull request</li>
      </ol>
    </section>

    <!-- Contact and License -->
    <section style="display:flex; gap:12px; align-items:center; justify-content:space-between; margin-bottom:40px;">
      <div style="background:#fff; padding:16px; border-radius:12px; box-shadow:0 4px 12px rgba(2,6,23,0.03); flex:1;">
        <h3 style="margin:0 0 8px 0; font-size:14px;">Contact / ติดต่อ</h3>
        <p style="margin:0; color:#475569; font-size:13px;">Line: <strong>@yourline</strong> · Email: <strong>you@example.com</strong></p>
      </div>

      <div style="background:#fff; padding:16px; border-radius:12px; box-shadow:0 4px 12px rgba(2,6,23,0.03); width:200px; text-align:center;">
        <h4 style="margin:0 0 6px 0;">License</h4>
        <p style="margin:0; color:#475569; font-size:13px;">MIT</p>
      </div>
    </section>

    <footer style="text-align:center; color:#94a3b8; font-size:13px; margin-bottom:10px;">
      <div>© <span id="year"></span> Pokémon Card Collection — Made with ❤️</div>
      <script>document.getElementById('year').textContent = new Date().getFullYear();</script>
    </footer>

  </main>
</body>
</html>
