/*Из-за так называемой CORS Police
*Это механизм безопасности, который позволяет веб-странице из одного домена обращаться к ресурсу с другим доменом (кросс-доменным запросом)
*Т.к. файл подключается не через localhost, то просто при открытии файла index.html он не будет работать
*Поэтому файл лучше открывать через редактор, я пользуюсь WebStorm, но можно и через любой другой
*Решить эту проблему можно путём загрузки файла data.json на какой-нибудь свой хостинг и делать асинхронный запрос к нему через new XMLHttpRequest() и в дальнейшем работать с этим файлом, но т.к. этого в задании не было, то был выбран наикратчайший путь решения этой проблемы
*Также можно было решить эту проблему путём использования библиотеки jQuery через функцию $.getJSON(), но её по заданию использовать было нельзя
* */
fetch("./js/data.json")//Создаём запрос на доступ и получение данных из json файла, методом fetch запроса
    .then(response => response.json())
    .then(json => {
        //Создаем переменную для заполнения tbody, она каждый раз будет обновляться
        let cont = '';
        for (let i = 0; i < json.length; i++) {
            //Обрезаем длинну данных из свойства about до 100 символов, все, что больше заменяем ...
            if (json[i].about.length > 100) {
                json[i].about = json[i].about.slice(0, 100) + '...'
            }
            //Методом итерации, перебирая все элементы, заполняем переменную cont
            cont += `<tr class="row-${i}"><td class="firstName">${json[i].name.firstName}</td><td class="lastName">${json[i].name.lastName}</td><td class="about">${json[i].about}</td><td class="eyeColor">${json[i].eyeColor}</td></tr>`
        }
        //Вставляем нашу переменную cont в таблицу
        document.querySelector('table').insertAdjacentHTML('afterbegin', cont);
        /*
        Добавляем события клика на нашем документе, и он сработает только тогда, когда
        элемент, на котором произошло события будет table row (tr) и записываем его индекс
        для дальнейшего изменения массива json.
        Создаём объект obj в который буем передавать поля нашего tr при каждом нажатии он будет обновлять
        И к элменту edit добавляем стили для того чтобы этот блок появился и спозиционировался, когда изначально он скрыт
        Далее создается функция fill для заполнения input`ов и textarea и в нее передаем созданный ранее объект obj методом переадресации вызова call
        * */
        document.addEventListener('click', (event) => {
            let tar = event.target;
            if (tar.closest("TR")) {
                let elem = tar.closest("TR");
                let index = +elem.className.slice(-1);
                let obj = {
                    firstName: null,
                    lastName: null,
                    about: null,
                    eyeColor: null,
                    top:null,
                    left:null,
                }
                obj.firstName = elem.querySelector('.firstName').innerHTML;
                obj.lastName = elem.querySelector('.lastName').innerHTML;
                obj.about = elem.querySelector('.about').innerHTML;
                obj.eyeColor = elem.querySelector('.eyeColor').innerHTML;
                obj.top = elem.offsetTop;
                obj.left = elem.offsetLeft;
                document.querySelector('.edit').style.display = "block";
                document.querySelector('.edit').style.top = obj.top + 'px';
                document.querySelector('.edit').style.left = obj.left + elem.offsetWidth + 10 + 'px';

                function fill() {
                    document.querySelector('.editName').value = this.firstName;
                    document.querySelector('.editSurname').value = this.lastName;
                    document.querySelector('.editDescription').value = this.about;
                    document.querySelector('.editEye').value = this.eyeColor;
                }
                fill.call(obj);

                /*
                * Создание события нажатия на кнопку подтверждения с пердотвращением стандартного поведения ссылки, методом preventDefault()
                * Далее перезаписываем те поля, которые были записаны в input`ы формы edit
                * Перерисовка таблицы
                * Перекрашивание ячеек eyeColor
                * */
                document.querySelector('.apply').onclick = function(e){
                    e.preventDefault();

                    json[index].name.firstName = document.querySelector('.editName').value;
                    json[index].name.lastName = document.querySelector('.editSurname').value;
                    json[index].about = document.querySelector('.editDescription').value;;
                    json[index].eyeColor = document.querySelector('.editEye').value;

                    let cont = '';
                    for (let i = 0; i < json.length; i++) {
                        if (json[i].about.length > 100) {
                            json[i].about = json[i].about.slice(0, 100) + '...'
                        }
                        cont += `<tr class="row-${i}"><td class="firstName">${json[i].name.firstName}</td><td class="lastName">${json[i].name.lastName}</td><td class="about">${json[i].about}</td><td class="eyeColor">${json[i].eyeColor}</td></tr>`
                    }
                    document.querySelector('tbody').innerHTML = cont;
                    let items = document.querySelectorAll('.eyeColor');

                    for (let i = 0; i < json.length; i++){
                        items[i].style.background = `${json[i].eyeColor}`;
                        items[i].style.color = "transparent"
                    }
                    document.querySelector('.edit').style.display = "none";

                }
            }
        })

        //Закрашивания ячеек eyeColor цветом, который был в них передан
        let items = document.querySelectorAll('.eyeColor');

        for (let i = 0; i < json.length; i++){
            items[i].style.background = `${json[i].eyeColor}`;
            items[i].style.color = "transparent"
        }

        /*
        * Создание логики сортировки столбцов Имя, Фамили, Цвет по алфавиту и напротив
        * Реализовано простой сортировкой json массива методом arr.sort(()=>{})
        * Далее просто перерисовываем всю таблицу
        * Добавляем необходимые css свойства
        * */
        document.querySelector('.Name').addEventListener('click', function (e) {
                if (!document.querySelector('.Name').classList.contains('sort')) {
                    json.sort((Obj1, Obj2) => {
                        if (Obj1.name.firstName < Obj2.name.firstName) return 1;
                        if (Obj1.name.firstName > Obj2.name.firstName) return -1;
                        return 0;
                    })
                    cont = '';
                    for (let k = 0; k < json.length; k++) {
                        if (json[k].about.length > 100) {
                            json[k].about = json[k].about.slice(0, 100) + '...'
                        }
                        cont += `<tr class="row-${k}"><td class="firstName">${json[k].name.firstName}</td><td class="lastName">${json[k].name.lastName}</td><td class="about">${json[k].about}</td><td class="eyeColor">${json[k].eyeColor}</td></tr>`
                    }
                    document.querySelector('tbody').innerHTML = cont;
                    document.querySelector('.Name').classList.add('sort')
                    let items = document.querySelectorAll('.eyeColor');

                    for (let i = 0; i < json.length; i++){
                        items[i].style.background = `${json[i].eyeColor}`;
                        items[i].style.color = "transparent"
                    }

                } else if (document.querySelector('.Name').classList.contains('sort')) {
                    json.sort((Obj1, Obj2) => {
                        if (Obj1.name.firstName < Obj2.name.firstName) return -1;
                        if (Obj1.name.firstName > Obj2.name.firstName) return 1;
                        return 0;
                    })
                    cont = '';
                    for (let k = 0; k < json.length; k++) {
                        if (json[k].about.length > 100) {
                            json[k].about = json[k].about.slice(0, 100) + '...'
                        }
                        cont += `<tr class="row-${k}"><td class="firstName">${json[k].name.firstName}</td><td class="lastName">${json[k].name.lastName}</td><td class="about">${json[k].about}</td><td class="eyeColor">${json[k].eyeColor}</td></tr>`
                    }
                    document.querySelector('tbody').innerHTML = cont;
                    document.querySelector('.Name').classList.remove('sort')
                    let items = document.querySelectorAll('.eyeColor');

                    for (let i = 0; i < json.length; i++){
                        items[i].style.background = `${json[i].eyeColor}`;
                        items[i].style.color = "transparent"
                    }
                }
        })
        document.querySelector('.Surname').addEventListener('click', function (e) {
            if (!document.querySelector('.Surname').classList.contains('sort')){
                json.sort((Obj1, Obj2) => {
                    if (Obj1.name.lastName < Obj2.name.lastName) return 1;
                    if (Obj1.name.lastName > Obj2.name.lastName) return -1;
                    return 0;
                })
                cont = '';
                for (let k = 0; k < json.length; k++) {
                    if (json[k].about.length > 100) {
                        json[k].about = json[k].about.slice(0, 100) + '...'
                    }
                    cont += `<tr class="row-${k}"><td class="firstName">${json[k].name.firstName}</td><td class="lastName">${json[k].name.lastName}</td><td class="about">${json[k].about}</td><td class="eyeColor">${json[k].eyeColor}</td></tr>`
                }
                document.querySelector('tbody').innerHTML = cont;
                document.querySelector('.Surname').classList.add('sort')
            }
            else if (document.querySelector('.Surname').classList.contains('sort')){
                json.sort((Obj1, Obj2) => {
                    if (Obj1.name.lastName < Obj2.name.lastName) return -1;
                    if (Obj1.name.lastName > Obj2.name.lastName) return 1;
                    return 0;
                })
                cont = '';
                for (let k = 0; k < json.length; k++) {
                    if (json[k].about.length > 100) {
                        json[k].about = json[k].about.slice(0, 100) + '...'
                    }
                    cont += `<tr class="row-${k}"><td class="firstName">${json[k].name.firstName}</td><td class="lastName">${json[k].name.lastName}</td><td class="about">${json[k].about}</td><td class="eyeColor">${json[k].eyeColor}</td></tr>`
                }
                document.querySelector('tbody').innerHTML = cont;
                document.querySelector('.Surname').classList.remove('sort')
            }
            let items = document.querySelectorAll('.eyeColor');

            for (let i = 0; i < json.length; i++){
                items[i].style.background = `${json[i].eyeColor}`;
                items[i].style.color = "transparent"
            }
        })
        document.querySelector('.eye').addEventListener('click', function (e) {
            if (!document.querySelector('.eye').classList.contains('sort')){
                json.sort((Obj1, Obj2) => {
                    if (Obj1.eyeColor < Obj2.eyeColor) return 1;
                    if (Obj1.eyeColor > Obj2.eyeColor) return -1;
                    return 0;
                })
                cont = '';
                for (let k = 0; k < json.length; k++) {
                    if (json[k].about.length > 100) {
                        json[k].about = json[k].about.slice(0, 100) + '...'
                    }
                    cont += `<tr class="row-${k}"><td class="firstName">${json[k].name.firstName}</td><td class="lastName">${json[k].name.lastName}</td><td class="about">${json[k].about}</td><td class="eyeColor">${json[k].eyeColor}</td></tr>`
                }
                document.querySelector('tbody').innerHTML = cont;
                document.querySelector('.eye').classList.add('sort')
                let items = document.querySelectorAll('.eyeColor');

                for (let i = 0; i < json.length; i++){
                    items[i].style.background = `${json[i].eyeColor}`;
                    items[i].style.color = "transparent"
                }
            }
            else if (document.querySelector('.eye').classList.contains('sort')){
                json.sort((Obj1, Obj2) => {
                    if (Obj1.eyeColor < Obj2.eyeColor) return -1;
                    if (Obj1.eyeColor > Obj2.eyeColor) return 1;
                    return 0;
                })
                cont = '';
                for (let k = 0; k < json.length; k++) {
                    if (json[k].about.length > 100) {
                        json[k].about = json[k].about.slice(0, 100) + '...'
                    }
                    cont += `<tr class="row-${k}"><td class="firstName">${json[k].name.firstName}</td><td class="lastName">${json[k].name.lastName}</td><td class="about">${json[k].about}</td><td class="eyeColor">${json[k].eyeColor}</td></tr>`
                }
                document.querySelector('tbody').innerHTML = cont;
                document.querySelector('.eye').classList.remove('sort');
                let items = document.querySelectorAll('.eyeColor');

                for (let i = 0; i < json.length; i++){
                    items[i].style.background = `${json[i].eyeColor}`;
                    items[i].style.color = "transparent"
                }
            }
        })

        //Логика скрытия столбцов, путём определения индекса элемента нажатого реализовано через конструкцию switch case
        document.querySelectorAll('span').forEach((el, i) => {
            el.addEventListener("click", function() {
                switch (i) {
                    case 0:
                        document.querySelectorAll('.firstName').forEach(item=>{
                            item.classList.toggle('hide')
                        })
                        el.classList.toggle('spec')
                        break;
                    case 1:
                        document.querySelectorAll('.lastName').forEach(item=>{
                            item.classList.toggle('hide')
                        })
                        el.classList.toggle('spec')
                        break;
                    case 2:
                        document.querySelectorAll('.about').forEach(item=>{
                            item.classList.toggle('hide')
                        })
                        el.classList.toggle('spec')
                        break;
                    case 3:
                        document.querySelectorAll('.eyeColor').forEach(item=>{
                            item.classList.toggle('hide')
                        })
                        el.classList.toggle('spec')
                        break;
                }
            });
        })
    })