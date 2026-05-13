import sys

def patch_file(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()

    new_lines = []
    for line in lines:
        if "ctx.drawImage(img," in line:
            # We want to replace the whole line with the correct centered version
            # We can detect if it's already patched or not
            if "targetW" in line:
                line = line.split("ctx.drawImage")[0] + "ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);\n"
            elif "256" in line:
                line = line.split("ctx.drawImage")[0] + "ctx.drawImage(img, -128, -128, 256, 256);\n"
        
        # Other replacements
        if "const lidTopTex = createSALogoTexture('#ffffff');" in line:
            line = line.replace("createSALogoTexture('#ffffff')", "createSALogoTexture('#ffffff', 0)")
        if "const baseBottomTex = new THREE.MeshStandardMaterial({ color: 0xffffff });" in line:
            line = line.replace("new THREE.MeshStandardMaterial({ color: 0xffffff })", "createSALogoTexture('#ffffff', Math.PI)")
        if "new THREE.MeshStandardMaterial({ color: 0xffffff }),    // -y (bottom)" in line:
            line = line.replace("new THREE.MeshStandardMaterial({ color: 0xffffff })", "new THREE.MeshStandardMaterial({ map: baseBottomTex })")
        
        new_lines.append(line)

    with open(filepath, 'w') as f:
        f.writelines(new_lines)

if __name__ == "__main__":
    patch_file(sys.argv[1])
