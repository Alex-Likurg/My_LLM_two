from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import sys
import json
from huggingface_hub import login
import contextlib

# Использование переменной окружения для токена
token = "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"  # Токен для аутентификации в Hugging Face.

# Аутентификация в Hugging Face, без вывода сообщений
login(token=token, add_to_git_credential=True)  # Вход в Hugging Face с использованием токена.

# Отключение стандартных предупреждений
import warnings
warnings.filterwarnings("ignore", category=UserWarning)  # Игнорируем предупреждения типа UserWarning.

# Определение устройства (CPU или GPU)
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')  # Определяем, использовать ли GPU или CPU.

# Загрузка обученной модели и исходного токенизатора
try:
    model = AutoModelForSeq2SeqLM.from_pretrained('./trained_model').to(device)  # Загружаем модель и отправляем на выбранное устройство.
    tokenizer = AutoTokenizer.from_pretrained('t5-small', token=token)  # Загружаем токенизатор, используя токен.
except Exception as e:
    # В случае ошибки загрузки модели или токенизатора выводим сообщение об ошибке и завершаем программу.
    print(json.dumps({"error": f"Failed to load model or tokenizer: {str(e)}"}), file=sys.stderr)
    sys.exit(1)

def generate_response(userInput):
    try:
        # Токенизируем ввод пользователя
        inputs = tokenizer(userInput, return_tensors='pt').to(device)
        
        # Генерируем ответ с явным указанием max_new_tokens
        outputs = model.generate(**inputs, max_new_tokens=100, temperature=1.2, top_p=0.8, top_k=50)
        
        # Декодируем ответ в строку
        response = tokenizer.decode(outputs[0], skip_special_tokens=True, clean_up_tokenization_spaces=True)
        return response
    except Exception as e:
        # В случае ошибки генерации ответа выводим сообщение об ошибке
        print(json.dumps({"error": f"Error generating response: {str(e)}"}), file=sys.stderr)
        return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        # Проверяем, был ли передан ввод пользователем через командную строку
        print(json.dumps({"error": "No input provided"}), file=sys.stderr)
        sys.exit(1)

    # Объединяем все аргументы командной строки в одну строку и удаляем лишние пробелы
    userInput = " ".join(sys.argv[1:]).strip()
    
    # Генерируем ответ на основе ввода пользователя
    response = generate_response(userInput) #user_input 
    
    if response:
        # Если ответ успешно сгенерирован, выводим его в формате JSON
        print(json.dumps({"response": response}))  # Выводим только JSON-объект.
    else:
        sys.exit(1)  # Завершаем программу с ошибкой, если ответ не был сгенерирован.
