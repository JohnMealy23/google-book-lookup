const Promise = require('promise-polyfill');

// const dummySearch = require('./dummy_query');
// const dummyBook = require('./dummy_book');
const config = {
    api: {
        search: (query) => `https://www.googleapis.com/books/v1/volumes?q=${query}`,
        book: (id) => `https://www.googleapis.com/books/v1/volumes/${id}`
    },
    containerParentId: 'big-vad',
    titleParentClass: 'bibliography-item-copy-text'
};

const kickIt = (config) => {
    const someElements = document.getElementsByClassName(config.titleParentClass);
    if(someElements.length === 0) {
        throw new Error('No title element container parent found');
    }
    const titleParent = someElements[0];
    const titleContainer = titleParent.querySelector('i');
    if(titleContainer === null) {
        throw new Error('No title container found');
    }
    // const title = titleContainer.innerText;
    const title = "Emperor of all Maladies";

    return tacoSolutions(title, config);
};

const tacoSolutions = (title, config) => {
    ajax(config.api.search(title))
        .then(getBookData)
        .then(getDedupedCategories)
        .then(injectLink.bind(this, title))
        .catch(injectLink.bind(this, title))
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

const getBookData = (queryResults) => {
    const id = queryResults.items[0].id;
    return ajax(config.api.book(id));
};

const getDedupedCategories = (bookData) => {
    const categoryStrings = bookData.volumeInfo.categories;
    if(categoryStrings === undefined) {
        throw new Error('No categories found.');
    }
    const dedupedCategories = categoryStrings.reduce((categories, categoryString) => {
        const newCaterogies = categoryString.split(' / ');
        newCaterogies.forEach((category) => {
            if(categories.indexOf(category) === -1) {
                categories.push(category);
            }
        });
        return categories;
    }, []);
    return dedupedCategories;
};

const injectLink = (title, categories = []) => {
    const url = `http://bibme.com/?suggestions=${title}+${categories.join('+')}`.replace(' ', '+');
    const parent = document.getElementById(config.containerParentId);
    if(parent === null) {
        throw new Error('Whaaaaaat?');
    }
    const container = document.createElement('div');
    const contents = `
        We've found additional citation sources that could strengthen your paper. 
        <div>
            <a href="${url}">See citation suggestions.</a>
        </div>
    `;
    container.innerHTML = contents;
    parent.appendChild(container);
    return parent;
};

kickIt(config);


/*<div class="col-xs-12 col-md-9 bibliography-item-actions-left"><div style="background: #1f9cc8;height:1px;width: 90%;margin: 16px auto;"></div>
 <div style="">
 <p>Great news!  We've found additional citation sources that might strengthen your paper.
 </p>
 <a class="" href="#">
 <i class="fa fa-quote-left"></i>
 See citation suggestions.
 </a>

 </div>
 </div>
*/

/*
 <div class="row">
 <div class="aligned-box col-md-12">
 <div class="row" id="new-citation">
 <div class="col-md-12">
 <h3>
 Your shiny new citation is located on top!
 </h3>
 <p>
 What's next? Great news!  We've found additional citation sources that might strengthen your paper.

 </p>
 <div style="
 text-align: center;
 ">

 <span style="
 border-bottom: 2px solid #DE6766;
 color: #000;
 font-weight: 500;
 ">
 <a class="" href="#" style="
 margin: 0 auto;
 width: 100%;
 color: #1f9cc8;
 ">
 <i class="fa"></i>
 See citation suggestions
 </a>
 </span>
 </div>
 </div>
 </div>
 </div>
 </div>
 */