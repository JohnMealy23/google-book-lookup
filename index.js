const Promise = require('promise-polyfill');

const dummySearch = require('./dummy_query');
const dummyBook = require('./dummy_book');
const config = {
    api: {
        search: (query) => `https://www.googleapis.com/books/v1/volumes?q=${query}`,
        book: (id) => `https://www.googleapis.com/books/v1/volumes/${id}`
    }
};

const getBook = (query) => {
    ajax(config.api.search(query))
        .then((queryResults) => {
            const id = queryResults.items[0].id;
            return ajax(config.api.book(id));
        })
        .then((bookData) => {
            const categoryStrings = bookData.volumeInfo.categories;
            console.log({categoryStrings});

            categoryStrings.reduce((hierarchy, categoryString) => {
                categoryString.split(' / ')
                    .map((path) => {

                    });
                hierarchy
            }, []);
        });
};

const ajax = (url) => {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.addEventListener("load", () => {
            resolve(JSON.parse(request.responseText));
        });
        request.open("GET", url);
        request.send();
    });
};

const $field = document.createElement('input');
$field.type = 'text';
$field.value = 'The Emperor of All Maladies';
$field.addEventListener('keyup', (event) => {
   if(event.keyCode === 13) {
       const query = $field.value.replace(' ', '+');
       getBook(query);
   }
});
document.body.appendChild($field);
$field.focus();




