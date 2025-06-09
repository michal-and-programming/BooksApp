{
  const select = {
    templates: {
      books: '#template-book',
    },

    cart:{
      listBooks: '.books-list',
      booksImage: '.book__image',
      checkboxWrapper: '.filters',
    }
  };

  const templates = {
    productBooks: Handlebars.compile(document.querySelector(select.templates.books).innerHTML), 
  };

  class BooksList{
    constructor(){
      this.favoriteBooks = [];
      this.filters = [];
      this.initData();
      this.getElements();
      this.render();
      this.initActions();
    }
    
    initData() {
      this.data = dataSource.books; // access to object in js/data.js
    }

    getElements(){
      this.renderList = document.querySelector(select.cart.listBooks); // target ul list
      this.checkboxWrapper = document.querySelector(select.cart.checkboxWrapper);
    }
    
    render(){
      for(let book of this.data){
        const generatedHtml = templates.productBooks(Object.assign( {}, book, {
          ratingBgc: this.determineRatingBgc(book.rating), ratingWidth: book.rating * 10,})); // build html element in the form of string
        
        const elem = utils.createDOMFromHTML(generatedHtml); // use html/string and build DOM element
        this.renderList.appendChild(elem); // create this element as child ul
      }
    }

    determineRatingBgc(rating){
      if(rating < 6){
        return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      }
      else if(rating >= 6 && rating <= 8){
        return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      }
      else if(rating > 8 && rating <= 9){
        return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      }
      else if(rating > 9){
        return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
    }

    initActions(){
      this.favoriteImageBooks = document.querySelectorAll(select.cart.booksImage); //must be here not in getElements because this element doesn't exists in HTML-render() create and put in to HTML 
                                                                            
      for(let fav of this.favoriteImageBooks){
        fav.addEventListener('dblclick', (event) => {
          event.preventDefault();
          if(event.target.offsetParent.classList.contains('book__image')){
            fav.classList.toggle('favorite');
          }
          const bookId = fav.getAttribute('data-id'); // getAttribute needs string to find something
          if(!this.favoriteBooks.includes(bookId)){
            this.favoriteBooks.push(bookId);
          }
        });
      }

      this.checkboxWrapper.addEventListener('click', (event) => {
        const input = event.target; // point clicked element
        //tagName check element of DOM input div button... return big letters INPUT 
        if(input.tagName === 'INPUT' && input.type === 'checkbox' && input.name === 'filter'){
          if(input.checked){
            this.filters.push(input.value);
          }
          else if (!input.checked){
            const index = this.filters.indexOf(input.value); // check is something in table and if it is there return index position 
            if(index !== -1){ // check element is in the table
              this.filters.splice(index, 1); //delete one element from table if it exists
            }
          }
        }
        this.filterBooks();
      });
    }

    filterBooks(){
      for(let book of this.data){
        const bookId = book.id;
        //image book find element in class .book_image with data-id 
        const imageBook = document.querySelector('.book__image[data-id="' + bookId + '"]');
        let shouldBeHidden = false;
        
        for(let filter of this.filters){ 
          if(!book.details[filter]){ //check if element details dont have correct property
            shouldBeHidden = true;
            break;
          }
        }
        if(shouldBeHidden==true){
          imageBook.classList.add('hidden');
        }
        else{
          imageBook.classList.remove('hidden');
        }
      }
    }
  }
  new BooksList(); 
}
  