export default function generateTag(str: string, setFunction?: (str: string) => void) {
    if (!str) return;

    const abbreviation = str
        .split(/\s+/)
        .map(word => word[0])
        .join('')
        .toLowerCase();

    const translitMap: Record<string, string> = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
        'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
        'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
        'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
        'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
        'э': 'e', 'ю': 'yu', 'я': 'ya'
    };

    let tag = '';
    for (const char of abbreviation) {
        tag += translitMap[char] || char;
    }

    tag = tag.replace(/[^a-z0-9]/g, '');
    if (setFunction) {
        setFunction(tag);
    }
    else{
        return tag
    }

};