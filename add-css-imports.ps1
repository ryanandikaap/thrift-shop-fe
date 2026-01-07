# Script to add CSS imports to all React components and pages

Write-Host "Adding CSS imports to all components and pages..." -ForegroundColor Green

# Component imports
$components = @(
    @{File="src/components/Hero.jsx"; CSS="../styles/components/Hero.css"},
    @{File="src/components/Features.jsx"; CSS="../styles/components/Features.css"},
    @{File="src/components/Footer.jsx"; CSS="../styles/components/Footer.css"},
    @{File="src/components/ProductCard.jsx"; CSS="../styles/components/ProductCard.css"},
    @{File="src/components/ProductGrid.jsx"; CSS="../styles/components/ProductGrid.css"},
    @{File="src/components/CategoryFilter.jsx"; CSS="../styles/components/CategoryFilter.css"},
    @{File="src/components/AuthModal.jsx"; CSS="../styles/components/AuthModal.css"}
)

# Page imports
$pages = @(
    @{File="src/pages/Products.jsx"; CSS="../styles/pages/Products.css"},
    @{File="src/pages/ProductDetail.jsx"; CSS="../styles/pages/ProductDetail.css"},
    @{File="src/pages/checkout/CartPage.jsx"; CSS="../../styles/pages/Cart.css"},
    @{File="src/pages/checkout/CheckoutPage.jsx"; CSS="../../styles/pages/Checkout.css"},
    @{File="src/pages/checkout/PaymentPage.jsx"; CSS="../../styles/pages/Payment.css"},
    @{File="src/pages/info/Contact.jsx"; CSS="../../styles/pages/Contact.css"},
    @{File="src/pages/info/AboutUs.jsx"; CSS="../../styles/pages/AboutUs.css"},
    @{File="src/pages/info/Category.jsx"; CSS="../../styles/pages/Category.css"},
    @{File="src/pages/info/HowToShop.jsx"; CSS="../../styles/pages/InfoPages.css"},
    @{File="src/pages/info/ReturnsPolicy.jsx"; CSS="../../styles/pages/InfoPages.css"},
    @{File="src/pages/info/PrivacyPolicy.jsx"; CSS="../../styles/pages/InfoPages.css"},
    @{File="src/pages/info/TermsAndConditions.jsx"; CSS="../../styles/pages/InfoPages.css"}
)

# Admin imports
$admin = @(
    @{File="src/pages/admin/AdminLayout.jsx"; CSS="../../styles/admin/AdminLayout.css"},
    @{File="src/pages/admin/AdminDashboard.jsx"; CSS="../../styles/admin/AdminDashboard.css"},
    @{File="src/pages/admin/AdminLoginPage.jsx"; CSS="../../styles/admin/AdminLogin.css"},
    @{File="src/pages/admin/AdminProductForm.jsx"; CSS="../../styles/admin/AdminForms.css"},
    @{File="src/pages/admin/AdminProductList.jsx"; CSS="../../styles/admin/AdminTable.css"},
    @{File="src/pages/admin/AdminUserList.jsx"; CSS="../../styles/admin/AdminTable.css"},
    @{File="src/pages/admin/AdminOrderList.jsx"; CSS="../../styles/admin/AdminTable.css"},
    @{File="src/pages/admin/AdminOrderDetail.jsx"; CSS="../../styles/admin/AdminOrderDetail.css"}
)

# User imports
$user = @(
    @{File="src/pages/user/UserProfilePage.jsx"; CSS="../../styles/user/UserProfile.css"},
    @{File="src/components/OrderHistory.jsx"; CSS="../styles/user/OrderHistory.css"},
    @{File="src/components/ProfileEditor.jsx"; CSS="../styles/user/ProfileEditor.css"}
)

# Function to add import if not exists
function Add-CSSImport {
    param($FilePath, $ImportStatement)
    
    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath -Raw
        
        # Check if import already exists
        $escapedImport = [regex]::Escape($ImportStatement)
        if ($content -notmatch $escapedImport) {
            # Find the last import statement
            $lines = Get-Content $FilePath
            $lastImportIndex = -1
            
            for ($i = 0; $i -lt $lines.Count; $i++) {
                if ($lines[$i] -match "^import ") {
                    $lastImportIndex = $i
                }
            }
            
            if ($lastImportIndex -ge 0) {
                # Insert after last import
                $newLines = @()
                $newLines += $lines[0..$lastImportIndex]
                $newLines += $ImportStatement
                if ($lastImportIndex + 1 -lt $lines.Count) {
                    $newLines += $lines[($lastImportIndex + 1)..($lines.Count - 1)]
                }
                $newLines | Set-Content $FilePath
                Write-Host "Added import to $FilePath" -ForegroundColor Green
            }
        } else {
            Write-Host "Import already exists in $FilePath" -ForegroundColor Yellow
        }
    } else {
        Write-Host "File not found: $FilePath" -ForegroundColor Red
    }
}

# Process all files
Write-Host "`nProcessing Components..." -ForegroundColor Cyan
foreach ($item in $components) {
    Add-CSSImport -FilePath $item.File -ImportStatement "import '$($item.CSS)';"
}

Write-Host "`nProcessing Pages..." -ForegroundColor Cyan
foreach ($item in $pages) {
    Add-CSSImport -FilePath $item.File -ImportStatement "import '$($item.CSS)';"
}

Write-Host "`nProcessing Admin Pages..." -ForegroundColor Cyan
foreach ($item in $admin) {
    Add-CSSImport -FilePath $item.File -ImportStatement "import '$($item.CSS)';"
}

Write-Host "`nProcessing User Pages..." -ForegroundColor Cyan
foreach ($item in $user) {
    Add-CSSImport -FilePath $item.File -ImportStatement "import '$($item.CSS)';"
}

Write-Host "`nDone! All CSS imports have been added." -ForegroundColor Green
Write-Host "Please check the browser console for any errors." -ForegroundColor Yellow
