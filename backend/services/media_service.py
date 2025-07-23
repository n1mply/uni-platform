import os
import base64
from io import BytesIO
from PIL import Image

async def save_image(b64: str, folder: str, filename: str) -> str:
    try:
        if not b64.startswith("data:image"):
            raise ValueError("Неверный формат изображения. Ожидалась строка base64.")
        
        header, encoded = b64.split(",", 1)
        image_data = base64.b64decode(encoded)

        with Image.open(BytesIO(image_data)) as img:

            img = img.convert("RGBA")

            save_dir = os.path.join("static", folder)
            os.makedirs(save_dir, exist_ok=True)

            output_path = os.path.join(save_dir, f"{filename}.png")
            img.save(output_path, format="PNG", optimize=True, quality=85)

        return f"/static/{folder}/{filename}.png"

    except Exception as e:
        print(f"Ошибка при сохранении изображения: {e}")
        raise
    
    
async def delete_image(folder: str, filename: str) -> bool:
    try:
        file_path = os.path.join("static", folder, f"{filename}.png")
        if not os.path.exists(file_path):
            print(f"Файл {file_path} не найден")
            return False
            
        os.remove(file_path)
            
        return True
        
    except Exception as e:
        print(f"Ошибка при удалении изображения: {e}")
        raise 
