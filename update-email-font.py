#!/usr/bin/env python3
"""
Update the embedded font in email.ts with the OTF version
The OTF file is smaller and may have better compatibility
"""

import re
import base64

# Read the OTF font file and encode it
with open('static/fonts/Karma-FreeVersion.otf', 'rb') as f:
    font_data = f.read()
    font_base64 = base64.b64encode(font_data).decode('utf-8')

print(f"✓ Encoded OTF font: {len(font_base64)} characters")

# Read the email template
with open('src/lib/email.ts', 'r') as f:
    content = f.read()

# Pattern to match the @font-face declaration with quotes
# We're looking for: src: url('data:font/TYPE;base64,LONGHASH') format('truetype');
pattern = r"(src:\s*url\(['\"]data:font/)([^;]+)(;[^,]+base64,)([A-Za-z0-9+/=]+)(['\"]?\)\s*format\('[^']+'\);)"

def replacer(match):
    """Replace with OTF font data"""
    return f"{match.group(1)}opentype{match.group(3)}{font_base64}') format('opentype');"

# Perform the replacement
new_content = re.sub(pattern, replacer, content)

# Verify the replacement worked
if new_content != content:
    # Save the original as backup
    with open('src/lib/email.ts.backup2', 'w') as f:
        f.write(content)
    print("✓ Saved backup to email.ts.backup2")

    # Write the updated content
    with open('src/lib/email.ts', 'w') as f:
        f.write(new_content)
    print("✓ Updated email.ts with OTF font")
    print(f"  Font size reduced from {len(content)} to {len(new_content)} bytes")
    print("\n✅ Done! The email template now uses the OTF version of Karma font")
else:
    print("✗ No changes made - pattern not found or already using OTF")
    print("\nTrying alternate pattern...")

    # Try to find any @font-face with Karma
    karma_match = re.search(r"@font-face\s*\{[^}]*font-family:\s*'Karma'[^}]*\}", content, re.DOTALL)
    if karma_match:
        print(f"Found Karma font-face declaration:")
        print(karma_match.group(0)[:200] + "...")
    else:
        print("Could not find Karma font-face declaration")
