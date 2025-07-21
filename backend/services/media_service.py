import os
import base64
from io import BytesIO
from PIL import Image

async def save_image(b64: str, folder: str, filename: str) -> str:
    try:
        # Проверка и извлечение base64 (ожидается формат data:image/png;base64,...)
        if not b64.startswith("data:image"):
            raise ValueError("Неверный формат изображения. Ожидалась строка base64.")
        
        header, encoded = b64.split(",", 1)
        image_data = base64.b64decode(encoded)

        # Открытие изображения с помощью Pillow
        with Image.open(BytesIO(image_data)) as img:

            img = img.convert("RGBA")

            # Создание директории, если её нет
            save_dir = os.path.join("static", folder)
            os.makedirs(save_dir, exist_ok=True)

            # Сжатие (качество 85%)
            output_path = os.path.join(save_dir, f"{filename}.png")
            img.save(output_path, format="PNG", optimize=True, quality=85)

        return f"/static/{folder}/{filename}.png"

    except Exception as e:
        print(f"Ошибка при сохранении изображения: {e}")
        raise
