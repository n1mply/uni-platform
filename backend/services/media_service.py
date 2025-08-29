import os
import base64
from io import BytesIO
from PIL import Image
import re
import uuid
from typing import List, Dict, Any
import aiofiles

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

async def parse_desc_object(desc_object: List[Dict[str, Any]], folder: str = 'specialty_data') -> List[Dict[str, Any]]:
    static_folder = f"../static/{folder}"
    absolute_static_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', folder))
    
    os.makedirs(absolute_static_folder, exist_ok=True)

    modified_object = desc_object.copy()
    
    for item in modified_object:
        if 'content' in item and isinstance(item['content'], str):
            base64_images = re.findall(r'src="data:image/(\w+);base64,([^">]+)"', item['content'])
            
            if not base64_images:
                continue
                
            for img_format, base64_data in base64_images:
                try:
                    unique_id = str(uuid.uuid4())[:8]
                    filename = f"image_{unique_id}_{base64_data[:10]}.png".replace('/', '_').replace('+', '_')
                    filepath = os.path.join(absolute_static_folder, filename)
                    web_path = f"/static/{folder}/{filename}"

                    image_data = base64.b64decode(base64_data)
                    
                    with Image.open(BytesIO(image_data)) as img:
                        if img.mode in ('RGBA', 'LA'):
                            background = Image.new('RGB', img.size, (255, 255, 255))
                            background.paste(img, mask=img.split()[-1])
                            img = background
                        elif img.mode != 'RGB':
                            img = img.convert('RGB')
                        output_buffer = BytesIO()
                        img.save(output_buffer, format='PNG', optimize=True, quality=85)
                        compressed_image_data = output_buffer.getvalue()

                    async with aiofiles.open(filepath, 'wb') as f:
                        await f.write(compressed_image_data)

                    old_src = f'src="data:image/{img_format};base64,{base64_data}"'
                    new_src = f'src="{web_path}"'
                    item['content'] = item['content'].replace(old_src, new_src)
                    
                except Exception as e:
                    print(f"Ошибка обработки изображения: {e}")
                    continue
    
    return modified_object
