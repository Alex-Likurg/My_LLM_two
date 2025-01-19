import sys
import json
from transformers import AutoTokenizer

def main(input_file, output_file):
    try:
        # Загрузка токенизатора с автоматическим подбором класса для указанной модели
        tokenizer = AutoTokenizer.from_pretrained("meta-llama/Meta-Llama-3.1-8B-Instruct")

        print(f"Reading input from: {input_file}")
        # Открываем входной файл и читаем текстовое содержимое
        with open(input_file, 'r', encoding='utf-8') as f:
            text = f.read()
        
        # Токенизация текста (преобразование текста в последовательность токенов)
        tokens = tokenizer.encode(text)

        print(f"Writing output to: {output_file}")
        # Открываем выходной файл и записываем токены в формате JSON
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(tokens, f)
    except Exception as e:
        # Обрабатываем ошибки, возникающие в процессе работы
        print(f"Error processing file {input_file}: {e}")

if __name__ == "__main__":
    # Проверяем, что переданы два аргумента командной строки (входной и выходной файлы)
    if len(sys.argv) != 3:
        print("Usage: python tokenize_data.py <input_file> <output_file>")
    else:
        # Если аргументы переданы правильно, вызываем основную функцию
        main(sys.argv[1], sys.argv[2])


