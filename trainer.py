import os
import json
import torch
import numpy as np
from transformers import Trainer, TrainingArguments, AutoTokenizer, default_data_collator
from transformers import AutoTokenizer, AutoModelForCausalLM

print("Начало выполнения trainer.py")

# Определяем устройство (GPU, если доступно, иначе CPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Загрузка модели Llama, Т5, DistilGPT-2
#model = AutoModelForSeq2SeqLM.from_pretrained("t5-small").to(device)
#model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.2-1B").to(device)
model = AutoModelForCausalLM.from_pretrained("distilbert/distilgpt2").to(device)

# Загрузка токенизатора T5 с указанием модели
#tokenizer = AutoTokenizer.from_pretrained("t5-small")
# Загрузка токенизатора Llama с указанием модели
#tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.2-1B")
# Загрузка токенизатора DistilGPT-2 с указанием модели
tokenizer = AutoTokenizer.from_pretrained("distilbert/distilgpt2")

# Проверяем наличие pad_token, если его нет, добавляем
if tokenizer.pad_token is None:
    tokenizer.add_special_tokens({'pad_token': '[PAD]'})

# Увеличиваем размер эмбеддингов модели для учёта нового токена
model.resize_token_embeddings(len(tokenizer))

try:
    # Проверяем, существует ли файл с токенизированными данными
    if os.path.exists('tokenized_data_3.json'):
        with open('tokenized_data_3.json', 'r', encoding='utf-8') as f:
            tokenized_data = json.load(f)  # Загружаем токенизированные данные из файла
            print("Данные успешно загружены")
    else:
        print("Файл tokenized_data_3.json не найден.")
        tokenized_data = None

    if tokenized_data:
        # Определяем пользовательский набор данных
        class CustomDataset(torch.utils.data.Dataset):
            def __init__(self, data, tokenizer, max_length=512):
                self.inputs = data  # Сохраняем токенизированные данные
                self.tokenizer = tokenizer  # Сохраняем токенизатор для преобразования
                self.max_length = max_length  # Максимальная длина последовательностей

            def __len__(self):
                return len(self.inputs)  # Возвращаем количество данных в наборе

            def __getitem__(self, idx):
                # Извлекаем токенизированную последовательность по индексу
                input_ids = self.inputs[idx]
                # Преобразуем токены обратно в текст, затем заново кодируем с ограничением длины
                input_ids = self.tokenizer.encode(
                    self.tokenizer.decode(
                        input_ids,
                        clean_up_tokenization_spaces=True  # Указываем параметр для предотвращения предупреждения
                    ),
                    max_length=self.max_length,  # Ограничиваем длину до max_length
                    truncation=True,  # Усекаем текст, если он длиннее max_length
                    padding='max_length'  # Дополняем нулями до максимальной длины
                )
                attention_mask = [1] * len(input_ids)  # Генерируем маску внимания (1 для активных токенов)
                labels = input_ids[:]  # Метки (labels) те же, что и входные токены

                # Преобразуем списки в numpy массивы перед созданием тензоров
                input_ids = np.array(input_ids)
                attention_mask = np.array(attention_mask)
                labels = np.array(labels)

                # Возвращаем входные данные, маску и метки в формате numpy.array
                return {
                    'input_ids': input_ids,
                    'attention_mask': attention_mask,
                    'labels': labels
                }
        # Создаем экземпляр пользовательского набора данных
        dataset = CustomDataset(tokenized_data, tokenizer, max_length=512)

        # Определяем собственную функцию collate_fn
        def collate_fn(batch):
            input_ids = np.array([item['input_ids'] for item in batch])
            attention_mask = np.array([item['attention_mask'] for item in batch])
            labels = np.array([item['labels'] for item in batch])

            # Преобразуем numpy массивы в тензоры
            return {
                'input_ids': torch.tensor(input_ids, dtype=torch.long),
                'attention_mask': torch.tensor(attention_mask, dtype=torch.long),
                'labels': torch.tensor(labels, dtype=torch.long)
            }

        # Передаем collate_fn как data_collator в Trainer
        data_collator = default_data_collator if collate_fn is None else collate_fn

        # Настраиваем параметры обучения
        training_args = TrainingArguments(
            output_dir='./results',  # Директория для сохранения результатов
            num_train_epochs=3,  # Количество эпох обучения
            per_device_train_batch_size=8,  # Размер батча на одно устройство
            save_steps=20_000,  # Количество шагов между сохранениями модели
            save_total_limit=2,  # Максимальное количество сохраненных моделей
            learning_rate=3e-5,  # Скорость обучения
            weight_decay=0.01,  # Коэффициент L2 регуляризации
            logging_dir='./logs',  # Директория для логов
            logging_steps=500,  # Количество шагов между логгированием
            fp16=True,  # Использование 16-битных чисел с плавающей точкой (ускорение на GPU)
        )

        # Инициализируем Trainer для обучения модели
        trainer = Trainer(
            model=model,  # Модель, которую будем обучать
            args=training_args,  # Аргументы для настройки процесса обучения
            train_dataset=dataset,  # Наш пользовательский набор данных
            data_collator=data_collator  # Используем кастомный data_collator
        )

        print("Модель загружена. Начало обучения...")
        trainer.train()  # Запускаем процесс обучения
        print("Обучение завершено.")

        # Сохраняем обученную модель
        model.save_pretrained('./trained_model')
        print("Модель сохранена")

    else:
        print("Нет данных для обучения")

except Exception as e:
    # Обработка ошибок, возникающих во время выполнения скрипта
    print(f"Произошла ошибка: {e}")










