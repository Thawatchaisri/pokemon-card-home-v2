# 🎴 Pokémon Card Collection  
เว็บสะสมการ์ดที่แสดงราคาตั้งขายเอง (Manual Price) พร้อมกราฟราคาจาก API ราคาตลาดจริง (PokePriceTracker)

<p align="left">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
</p>

---

## 🧩 Features / ฟีเจอร์หลัก

### 🔹 Frontend (Next.js)
- เมนูแนะนำเว็บ / ข่าวสาร  
- เมนูติดต่อฉัน  
- Pokémon Card Collection  
  - English Version Cards  
  - Thai Version Cards  
  - Japanese Version Cards  
- Baseball Card Collection  
- Football Card Collection  
- หน้า **View All Cards** (แสดงเฉพาะการ์ด Pokémon ราคาแพงสุด 50 อันดับ)  
- Pagination หน้า 10 ใบ  
- หน้าแสดงรายละเอียด:  
  - แสดงรูปได้หลายรูป (multi-image carousel)  
  - แสดงราคาขายที่ admin ตั้งเอง (Manual Price)  
  - กราฟราคาแบบ real-time จาก PokePriceTracker API  
- ปุ่ม Buy → เปิด Popup QR Code สำหรับเพิ่มเพื่อน LINE  
  - QR Code อัปเดตได้ผ่านหลังบ้าน

---

## 🛠️ Backend Features (Express)
- ระบบจัดการเมนูทุกหน้า
- ระบบเพิ่ม / แก้ไขการ์ด
- อัปโหลดหลายรูปต่อการ์ดได้
- ตั้งราคาขายเองได้ (Manual Price)
- เชื่อมต่อ API ภายนอกเพื่อดึง real-time price history
- จัดการ QR Code สำหรับปุ่ม “Buy”

---

## 🗄️ Database Structure (PostgreSQL)

### **cards**
| field | type | description |
|-------|------|-------------|
| id | uuid | primary key |
| name | text | ชื่อการ์ด |
| language | text | EN / TH / JP |
| set_name | text | ชื่อเซ็ต |
| release_year | int | ปี |
| condition | text | ตำหนิ |
| manual_price | numeric | ราคาที่ขายจริง |
| market_price | numeric | ราคาตลาดปัจจุบัน (optional) |
| created_at | timestamptz | — |

### **card_images**
| field | type | description |
|-------|------|-------------|
| id | uuid | PK |
| card_id | uuid | FK → cards |
| image_url | text | รูปแต่ละใบ (1–10 รูป) |

### **line_qr**
| field | type |
|-------|-------|
| id | uuid |
| qr_image_url | text |
| updated_at | timestamptz |

---

## 📌 API Endpoints

### Public
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/cards?language=EN` | ดึงการ์ดตามภาษา |
| GET | `/api/cards/view-all?page=1&perPage=10` | การ์ด Pokémon ราคาแพงสุด 50 อันดับ |
| GET | `/api/cards/:id` | รายละเอียดการ์ด |
| GET | `/api/cards/:id/price-history` | กราฟราคาจาก API ภายนอก |

### Admin
| Method | Endpoint |
|--------|----------|
| POST | `/api/admin/cards` |
| PUT | `/api/admin/cards/:id` |
| DELETE | `/api/admin/cards/:id` |
| POST | `/api/admin/upload/images` |
| PUT | `/api/admin/line-qr` |

---

## 📦 Installation & Run

```bash
git clone https://github.com/username/pokemon-card-collection.git
cd pokemon-card-collection
