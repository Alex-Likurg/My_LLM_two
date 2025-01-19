import mysql from 'mysql2/promise'; // Импортируем модуль для работы с MySQL с использованием промисов.
import fs from 'fs/promises'; // Импортируем модуль для работы с файловой системой асинхронно.

async function getTexts(): Promise<string[][]> {
    // Устанавливаем соединение с базой данных MySQL, используя предоставленные параметры.
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'ZX060688',
        database: 'lord_of_rings'
    });

    try {
        // Выполняем SQL-запрос к базе данных для выбора столбца 'content' из таблицы 'scraped_data'.
        const [rows] = await connection.execute('SELECT content FROM scraped_data');
        
        // Обрабатываем результат запроса и создаем массив 'texts'.
        const texts = (rows as mysql.RowDataPacket[]).map((row, index) => {
            const content = row.content as string; // Извлекаем столбец 'content' как строку.

            // Если индекс строки меньше 5, выводим первые три строки текста для отладки.
            if (index < 5) {
                const firstThreeLines = content.split('\n').slice(0, 3).join('\n');
                console.log(`Retrieved text [${index}] (first three lines):\n${firstThreeLines}`);
            }

            // Разбиваем текст на строки и сохраняем в массив 'textLines'.
            const textLines = content.split('\n');
            return textLines; // Возвращаем массив строк.
        });

        console.log("Texts retrieved from database."); // Сообщение о том, что тексты успешно извлечены из базы данных.

        // Создаем объект 'jsonObject', содержащий массив 'texts', для сохранения в формате JSON.
        const jsonObject = { texts };

        try {
            // Сериализуем объект 'jsonObject' в JSON и записываем в файл 'texts.json'.
            await fs.writeFile('texts.json', JSON.stringify(jsonObject, null, 2));
            console.log('Texts have been saved to texts.json'); // Сообщение об успешном сохранении файла.
        } catch (writeError) {
            console.error('Error writing to file:', writeError); // Обработка ошибок при записи файла.
        }

        return texts; // Возвращаем массив текстов.
    } catch (error) {
        console.error('Error executing query:', error); // Обработка ошибок при выполнении SQL-запроса.
        throw error; // Повторно выбрасываем ошибку для дальнейшей обработки.
    } finally {
        await connection.end(); // Закрываем соединение с базой данных.
    }
}

// Вызываем функцию 'getTexts' и обрабатываем любые неожиданные ошибки.
getTexts().catch(err => console.error('Unexpected error:', err));






//import mysql from 'mysql2';

//const connection = mysql.createConnection({
   // host: 'localhost',
   // user: 'root',
   // password: 'ZX060688',
    //database: 'text_for_gangster'
//});

//connection.connect((err) => {
   // if (err) {
       // console.error('Error connecting to the database:', err);
       // return;
   // }
   // console.log('Connected to the database');
//});

//function getTexts(): Promise<string[]> {
   // return new Promise((resolve, reject) => {
       // connection.query('SELECT content FROM scraped_data', (error, results) => {
          //  if (error) {
               // console.error('Error executing query:', error);
               // connection.end();
               // reject(error);
               // return;
           // }

           // const rows = results as mysql.RowDataPacket[];
           // const texts = rows.map((row, index) => {
           //     const content = row.content as string;

                // Ограничиваем вывод первыми тремя строками для первых пяти текстов
             //   if (index < 5) { 
                //    const firstThreeLines = content.split('\n').slice(0, 3).join('\n');
                 //   console.log(`Retrieved text [${index}] (first three lines):\n${firstThreeLines}`);
               // }

              //  return content;
            //});

           // console.log("Texts retrieved from database.");
           // connection.end();
           // resolve(texts);
       // });
   // });
//}

//export { getTexts };