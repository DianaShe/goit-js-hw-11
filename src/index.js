import ApiService from './api-service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

const apiService = new ApiService();

form.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  clearGalleryContainer();
  apiService.searchQuery = form.elements.searchQuery.value;
  apiService.resetPage();

  apiService.fetchImages().then(renderGallery).then(addButton).then(setObserver).then(showSuccess).catch(handleError);
}

function addButton() {
  const button = document.createElement('button');
  button.classList.add('load-more');
  galleryEl.after(button);
}

function createMarkup(data) {
  return markup = data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<a class="gallery-item" href="${largeImageURL}">
          <div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" title="${tags}" loading="lazy" width=300 height=200/>
            <div class="info">
              <p class="info-item">
                <b>Likes</b>: ${likes}
              </p>
              <p class="info-item">
                <b>Views</b>: ${views}
              </p>
              <p class="info-item">
                <b>Comments</b>: ${comments}
              </p>
              <p class="info-item">
                <b>Downloads</b>: ${downloads}
              </p>
            </div>
          </div>
        </a>`
    )
    .join('');
}


function renderGallery(data) {
  if (data.hits.length === 0) {
    throw new Error(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } 
  apiService.totalImages = data.totalHits;
  
  createMarkup(data);
  
  galleryEl.insertAdjacentHTML('beforeend', markup);
  
  const gallery = new SimpleLightbox('.gallery a', {captionDelay : 250});
  gallery.refresh();
  
}

function handleScroll() {
  const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
  window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    }); 
}

function setObserver() {
  const target = document.querySelector('.load-more');
  const observer = new IntersectionObserver(handleIntersection);
  observer.observe(target);
  
}

function handleIntersection(entries) {
  entries.map(entry => {
    if (entry.isIntersecting) {
      onLoadMore();
    } else {
      return;
    }
  })
}

function onLoadMore() {
  
  if (Math.ceil(apiService.totalImages / apiService.limit) < apiService.page) {
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  
  } else {
    apiService.fetchImages().then(renderGallery).then(handleScroll).catch(handleError);

  }
}

function clearGalleryContainer() {
  galleryEl.innerHTML = '';
  document.querySelector('.load-more').remove();
}  

function handleError(error) {
  Notify.failure(error.message);
} 

function showSuccess() {
  Notify.success(`Hooray! We found ${apiService.totalImages} images.`);
}

