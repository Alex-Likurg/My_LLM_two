import express, { Request, Response } from 'express'; // Импортируем express и типы для работы с запросами и ответами.
import { PythonShell, Options } from 'python-shell'; // Импортируем PythonShell и тип Options для выполнения Python-скриптов.
import cors from 'cors'; // Импортируем модуль CORS для разрешения кросс-доменных запросов.
import fs from 'fs'; // Импортируем модуль fs для работы с файловой системой.

const app = express(); // Создаем экземпляр приложения express.
const port = 3000; // Устанавливаем порт, на котором будет работать сервер.

app.use(cors()); // Разрешаем CORS для всех маршрутов.
app.use(express.static('public')); // Указываем директорию для статических файлов.
app.use(express.json()); // Включаем парсинг JSON в теле запросов.

// Новый маршрут для сохранения текстов в JSON-файл
app.post('/save', (req: Request, res: Response) => {
    const texts = req.body.texts; // Получаем массив текстов из тела запроса

    if (!texts || !Array.isArray(texts)) {
        // Проверяем, что тексты были переданы и что это массив
        return res.status(400).json({ error: 'Valid texts array is required' });
    }

    const jsonObject = { texts }; // Формируем объект для записи в JSON-файл

    // Записываем объект в файл textsData.json
    fs.writeFile('textsData.json', JSON.stringify(jsonObject, null, 2), (err) => {
        if (err) {
            console.error('Ошибка при записи файла:', err);
            return res.status(500).json({ error: 'Error saving texts to file' });
        }

        console.log('Тексты успешно сохранены в textsData.json');
        return res.json({ message: 'Тексты успешно сохранены' });
    });
});

// Оригинальный маршрут для работы с Python-скриптом
app.post('/chat', (req: Request, res: Response) => {
    const userInput: string = req.body.input; // Получаем пользовательский ввод из тела запроса.

    if (!userInput) {
        // Если ввод не был передан, возвращаем ошибку 400.
        return res.status(400).json({ error: 'Input is required' });
    }

    const options: Options = {
        mode: 'text', // Устанавливаем режим работы PythonShell в текстовый режим.
        pythonOptions: ['-u'], // Включаем небуферизованный вывод в Python.
        args: [userInput] // Передаем пользовательский ввод как аргумент в Python-скрипт.
    };

    let jsonResponse: string = ''; // Переменная для хранения JSON-ответа от Python-скрипта.

    const pyshell = new PythonShell('process_input.py', options); // Запускаем Python-скрипт с указанными параметрами.

    pyshell.on('message', (message) => {
        // Обрабатываем сообщения, полученные от Python-скрипта.
        try {
            const parsedMessage = JSON.parse(message); // Пытаемся распарсить сообщение как JSON.
            jsonResponse = JSON.stringify(parsedMessage); // Если удается, сохраняем результат.
        } catch (e) {
            // Если сообщение не является JSON, игнорируем его.
        }
    });

    pyshell.end((err) => {
        // Выполняется при завершении работы Python-скрипта.
        if (err) {
            console.error(err); // Логируем ошибку, если что-то пошло не так.
            return res.status(500).json({ error: 'Error processing request' }); // Возвращаем ошибку 500 в случае сбоя.
        }

        if (jsonResponse) {
            // Если JSON-ответ был получен, возвращаем его клиенту.
            res.json(JSON.parse(jsonResponse));
        } else {
            // Если ответ от Python-скрипта не был получен или был некорректен, возвращаем ошибку 500.
            res.status(500).json({ error: 'No valid response from Python script' });
        }
    });
});

app.listen(port, () => {
    // Запускаем сервер и логируем информацию о том, что он запущен.
    console.log(`Server running at http://localhost:${port}/`);
});





//import express, { Request, Response } from 'express'; // Импортируем express и типы для работы с запросами и ответами.
//import { PythonShell, Options } from 'python-shell'; // Импортируем PythonShell и тип Options для выполнения Python-скриптов.
//import cors from 'cors'; // Импортируем модуль CORS для разрешения кросс-доменных запросов.

//const app = express(); // Создаем экземпляр приложения express.
//const port = 3000; // Устанавливаем порт, на котором будет работать сервер.

//app.use(cors()); // Разрешаем CORS для всех маршрутов.
//app.use(express.static('public')); // Указываем директорию для статических файлов.
//app.use(express.json()); // Включаем парсинг JSON в теле запросов.

//app.post('/chat', (req: Request, res: Response) => {
    //const userInput: string = req.body.input; // Получаем пользовательский ввод из тела запроса.

   // if (!userInput) {
        //// Если ввод не был передан, возвращаем ошибку 400.
        //return res.status(400).json({ error: 'Input is required' });
    //}

    //const options: Options = {
       // mode: 'text', // Устанавливаем режим работы PythonShell в текстовый режим.
       // pythonOptions: ['-u'], // Включаем небуферизованный вывод в Python.
       // args: [userInput] // Передаем пользовательский ввод как аргумент в Python-скрипт.
    //};

    //let jsonResponse: string = ''; // Переменная для хранения JSON-ответа от Python-скрипта.

    //const pyshell = new PythonShell('process_input.py', options); // Запускаем Python-скрипт с указанными параметрами.

    //pyshell.on('message', (message) => {
        // Обрабатываем сообщения, полученные от Python-скрипта.
        //try {
            //const parsedMessage = JSON.parse(message); // Пытаемся распарсить сообщение как JSON.
            //jsonResponse = JSON.stringify(parsedMessage); // Если удается, сохраняем результат.
        //} catch (e) {
            // Если сообщение не является JSON, игнорируем его.
        //}
    //});

   // pyshell.end((err) => {
        // Выполняется при завершении работы Python-скрипта.
       // if (err) {
         //   console.error(err); // Логируем ошибку, если что-то пошло не так.
         //   return res.status(500).json({ error: 'Error processing request' }); // Возвращаем ошибку 500 в случае сбоя.
       // }

       // if (jsonResponse) {
            // Если JSON-ответ был получен, возвращаем его клиенту.
           // res.json(JSON.parse(jsonResponse));
        //} else {
            // Если ответ от Python-скрипта не был получен или был некорректен, возвращаем ошибку 500.
           // res.status(500).json({ error: 'No valid response from Python script' });
       // }
    //});
//});

//app.listen(port, () => {
    // Запускаем сервер и логируем информацию о том, что он запущен.
    //console.log(`Server running at http://localhost:${port}/`);
//});















