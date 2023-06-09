import ApiService from './api-service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import renderGallery from './render-gallery';

const form = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

const apiService = new ApiService();

form.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  clearGalleryContainer();
  apiService.searchQuery = form.elements.searchQuery.value;
  apiService.resetPage();

  apiService
    .fetchImages()
    .then(renderGallery)
    .then(addButton)
    .then(setObserver)
    .then(showSuccess)
    .catch(handleError);
}

function addButton() {
  const button = document.createElement('button');
  button.classList.add('load-more');
  galleryEl.after(button);
}

function handleScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
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
  });
}

function onLoadMore() {
  if (Math.ceil(apiService.totalImages / apiService.limit) < apiService.page) {
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    apiService
      .fetchImages()
      .then(renderGallery)
      .then(handleScroll)
      .catch(handleError);
  }
}

function clearGalleryContainer() {
  galleryEl.innerHTML = '';
  if (document.querySelector('.load-more')) {
    document.querySelector('.load-more').remove();
  }
  
}

function handleError(error) {
  Notify.failure(error.message);
}

function showSuccess() {
  Notify.success(`Hooray! We found ${apiService.totalImages} images.`);
}

export {apiService, galleryEl}