import base64
import re
import os

logo_path = '/Users/simonthomasallmer/Gemini/Antigravity/Simon Allmer App/Simon Allmer/American Portrait Developer/Simon Allmer Assets/simonallmertitlewhite.png'
with open(logo_path, 'rb') as f:
    title_b64 = base64.b64encode(f.read()).decode()

js_path = '/Users/simonthomasallmer/Gemini/Antigravity/Simon Allmer App/Simon Allmer/American Portrait Developer/American Playing Cards 3D Box/index.html'
with open(js_path, 'r') as f:
    content = f.read()

# Ensure TITLE_B64 is declared
if 'const TITLE_B64' not in content:
    title_decl = f'        const TITLE_B64 = "data:image/png;base64,{title_b64}";\n'
    content = content.replace('        const BARCODE_B64', title_decl + '        const BARCODE_B64')
else:
    content = re.sub(r'const TITLE_B64 = ".*?";', f'const TITLE_B64 = "data:image/png;base64,{title_b64}";', content)

# Define the new back panel company info and barcode blocks
new_company_info = """
                <!-- Company Info Bottom Left -->
                <g transform="translate(50, 1150)" fill="white" font-family="'GT America Thin', sans-serif" font-size="18">
                    <text x="0" y="0" font-size="24">www.simonallmer.com</text>
                    <image href="${TITLE_B64}" x="0" y="20" width="300" height="80" preserveAspectRatio="xMinYMin meet" />
                    <text x="0" y="140">G013 American Playing Cards. Made in USA</text>
                    <text x="0" y="170">Design: Simon Allmer</text>
                    <text x="0" y="200">© 2026 Simon Allmer Entertainment</text>
                    <text x="0" y="230">Kolschitzkygasse 14-18 1040 Vienna, Austria.</text>
                </g>"""

new_barcode_info = """
                <!-- Barcode Bottom Right -->
                <rect x="650" y="1220" width="300" height="130" fill="white"/>
                <image href="${BARCODE_B64}" x="660" y="1230" width="280" height="110" preserveAspectRatio="xMidYMid meet" />"""

company_pattern = r'<!-- Company Info Bottom Left -->.*?Kolschitzkygasse 14-18 1040 Vienna, Austria\.</text>\s*</g>'
content = re.sub(company_pattern, new_company_info, content, flags=re.DOTALL)

barcode_pattern = r'<!-- Barcode Bottom Right -->.*?<rect.*?/>\s*<image.*?/>'
content = re.sub(barcode_pattern, new_barcode_info, content, flags=re.DOTALL)

with open(js_path, 'w') as f:
    f.write(content)
