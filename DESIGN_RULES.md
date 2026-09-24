# Ne'ma for Foodstuffs - Design System & UI Rules

This document outlines the design tokens, aesthetics, and structural rules extracted from the Ne'ma ecommerce template. **AI Agents should strictly follow these rules** when building or styling UI components for this project.

## 1. Global Setup
- **Direction**: Right-to-Left (`rtl`)
- **Base Font Size**: `14px`
- **Global Background**: `#FBF5F5` (Light pinkish-white)
- **Global Text Color**: `#1A0505` (Dark red/black)
- **Font Family**: `'Cairo', sans-serif`

## 2. Typography
Use the **Cairo** font exclusively.
- **Regular (400)**: Used for secondary text, sub-brands (`11px`), and price units (`10px`).
- **SemiBold (600)**: Used for navigation links (`13px`), cart button, and category names (`13px`).
- **Bold (700)**: Used for section titles (`17px`), product names (`13px`), buttons, and footer highlights.
- **Black (900)**: Used for major headings like the Hero title (`32px`), Logo text (`20px`), Badge numbers (`28px`), and Prices (`14px`).

## 3. Color Palette
### Primary Colors
- **Brand Red**: `#CC1010` (Used for headers, hero backgrounds, primary buttons, borders on hover, active states, and prices).
- **Dark Background**: `#1A0505` (Used for primary text and footer background).
- **Pure White**: `#ffffff` (Used for card backgrounds, text on red backgrounds, and structural elements).

### Secondary & Accent Colors
- **Muted Text / Badges**: `#9E6060` (Used for product counts, brands, inactive weight pills).
- **Light Red Fill 1**: `#FFF0F0` (Used for category icon backgrounds and active weight pill backgrounds).
- **Light Red Fill 2**: `#FFE0E0` (Used alongside Fill 1 for product image gradients).
- **Border Color**: `#F0DADA` (Used for default card borders, inactive weight pills).

### Transparent Colors
- **White 85%**: `rgba(255, 255, 255, 0.85)` (Nav links default state).
- **White 80%**: `rgba(255, 255, 255, 0.8)` (Hero paragraphs).
- **White 75%**: `rgba(255, 255, 255, 0.75)` (Sub-brand text, small badge text).
- **White 30%**: `rgba(255, 255, 255, 0.3)` (Cart button border).
- **White 15%**: `rgba(255, 255, 255, 0.15)` (Cart button background).

## 4. Spacing & Borders
- **Container Padding**: Standard horizontal padding is `20px`. Section vertical padding is `24px`.
- **Border Radius**:
  - `50%`: Circular icons (Logo, Category Icons).
  - `12px`: Large elements (Cards, Hero Badges, Promo Banners).
  - `10px`: Hero CTA Button.
  - `8px`: Cart Button, Promo Banner Button.
  - `7px`: Add to Cart Button.
  - `6px`: Small tags (Weight tag).
  - `5px`: Weight Pills.

## 5. UI Component Rules

### Cards (Products & Categories)
- **Background**: `#ffffff`
- **Border**: `1px solid #F0DADA`
- **Border Radius**: `12px`
- **Hover State**: Border color changes to `#CC1010`.

### Buttons
- **Primary (Red)**: Background `#CC1010`, Text `#fff`, Border None.
- **Secondary (White on Red)**: Background `#fff`, Text `#CC1010`, Border None.
- **Outline (Transparent on Red)**: Background `rgba(255,255,255,0.15)`, Border `1px solid rgba(255,255,255,0.3)`, Text `#fff`.

### Weight Pills (`.ne-weight-pill`)
- **Default**: Border `#F0DADA`, Text `#9E6060`, Background Transparent.
- **Active (`.active`)**: Border `#CC1010`, Text `#CC1010`, Background `#FFF0F0`, Font Weight `700`.

### Background Patterns
Whenever displaying large primary red areas (Hero, Promo Banners), use subtle repeating patterns to add texture:
- **Hero Pattern**: `repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)` with `background-size: 20px 20px` and `opacity: 0.06`.
- **Banner Pattern**: `repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 0, transparent 40%)` with `background-size: 16px 16px` and `opacity: 0.07`.

### Section Titles
- Text: `#1A0505`, `17px`, `700` weight.
- Decoration: A left-aligned vertical bar (actually right-aligned in RTL), styled via `::before` pseudo-element: width `4px`, height `20px`, background `#CC1010`, border-radius `2px`.

## 6. Implementation Notes for AI
1. **Tailwind vs Vanilla CSS**: Follow the user's preference. If converting these rules to Tailwind, use exact hex values via arbitrary values (e.g., `text-[#CC1010]`) or configure the `tailwind.config` / `globals.css` theme variables to match these specific colors.
2. **Icons**: The design uses emojis (🌿, 🥜, 🌶️, 📦) for placeholder images and icons. Keep this playful aesthetic or replace them with high-quality icons/images that fit the bounding boxes.
3. **Typography Weights**: Pay strict attention to the font weights (400, 600, 700, 900). The visual hierarchy heavily depends on the contrast between `400` muted text and `900` prices/headers.
