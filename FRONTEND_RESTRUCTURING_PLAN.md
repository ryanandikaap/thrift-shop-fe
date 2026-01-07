# Frontend Restructuring Plan - Thrift FE

## 🎯 Tujuan
Memisahkan CSS dari App.css menjadi file-file terpisah untuk setiap komponen agar lebih mudah di-maintain dan dikelola.

## 📋 Rencana Pemisahan CSS

### 1. **Global Styles** (tetap di App.css atau pindah ke styles/)
- CSS Reset & Box Sizing
- CSS Variables (:root)
- Global styles (html, body, .app, .container)
- Utility classes (.text-gradient, .bg-gradient)
- Animations (@keyframes)

### 2. **Component Styles** (buat folder styles/components/)
- Header.css - Header component
- Hero.css - Hero component
- Features.css - Features component
- Footer.css - Footer component
- ProductCard.css - Product card
- ProductGrid.css - Product grid
- CategoryFilter.css - Category filter
- AuthModal.css - Authentication modal
- CartSummary.css - Cart summary

### 3. **Page Styles** (buat folder styles/pages/)
- Home.css - Home page
- Products.css - Products page
- ProductDetail.css - Product detail page
- Cart.css - Cart page
- Checkout.css - Checkout page
- Payment.css - Payment page
- Contact.css - Contact page
- AboutUs.css - About us page
- Category.css - Category page
- InfoPages.css - Info pages (Terms, Privacy, etc)

### 4. **Admin Styles** (buat folder styles/admin/)
- AdminLayout.css - Admin layout & sidebar
- AdminDashboard.css - Admin dashboard
- AdminTable.css - Admin tables
- AdminForms.css - Admin forms
- AdminLogin.css - Admin login page

### 5. **User Profile Styles** (buat folder styles/user/)
- UserProfile.css - User profile page
- OrderHistory.css - Order history
- ProfileEditor.css - Profile editor

## 📁 Struktur Folder Baru

```
thrift-fe/src/
├── styles/
│   ├── global.css           # Global styles & variables
│   ├── components/
│   │   ├── Header.css
│   │   ├── Hero.css
│   │   ├── Features.css
│   │   ├── Footer.css
│   │   ├── ProductCard.css
│   │   ├── ProductGrid.css
│   │   ├── CategoryFilter.css
│   │   ├── AuthModal.css
│   │   └── CartSummary.css
│   ├── pages/
│   │   ├── Home.css
│   │   ├── Products.css
│   │   ├── ProductDetail.css
│   │   ├── Cart.css
│   │   ├── Checkout.css
│   │   ├── Payment.css
│   │   ├── Contact.css
│   │   ├── AboutUs.css
│   │   ├── Category.css
│   │   └── InfoPages.css
│   ├── admin/
│   │   ├── AdminLayout.css
│   │   ├── AdminDashboard.css
│   │   ├── AdminTable.css
│   │   ├── AdminForms.css
│   │   └── AdminLogin.css
│   └── user/
│       ├── UserProfile.css
│       ├── OrderHistory.css
│       └── ProfileEditor.css
├── components/
├── pages/
├── App.jsx
└── main.jsx
```

## 🔄 Langkah Implementasi

### Phase 1: Setup Structure
1. Buat folder `styles/` dengan subfolder
2. Buat file global.css dengan variables & global styles

### Phase 2: Extract Component Styles
1. Extract Header styles
2. Extract Hero styles
3. Extract Features styles
4. Extract Footer styles
5. Extract Product-related styles
6. Extract Auth & Cart styles

### Phase 3: Extract Page Styles
1. Extract Home page styles
2. Extract Products page styles
3. Extract Product Detail styles
4. Extract Cart & Checkout styles
5. Extract Info pages styles

### Phase 4: Extract Admin Styles
1. Extract Admin layout styles
2. Extract Admin dashboard styles
3. Extract Admin table & form styles

### Phase 5: Extract User Profile Styles
1. Extract User profile styles
2. Extract Order history styles

### Phase 6: Update Imports
1. Update App.jsx to import global.css
2. Update each component to import its CSS
3. Remove old App.css

### Phase 7: Testing
1. Test all pages
2. Verify all styles working
3. Check responsive design

## ✅ Benefits
- ✅ Easier to maintain
- ✅ Better organization
- ✅ Faster development
- ✅ Easier to find styles
- ✅ Better code splitting
- ✅ Reduced CSS conflicts
