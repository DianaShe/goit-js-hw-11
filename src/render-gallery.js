import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { apiService, galleryEl } from '.';

export default function renderGallery(data) {
    if (data.hits.length === 0) {
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    apiService.totalImages = data.totalHits;
  
    const markup = data.hits
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
  
    galleryEl.insertAdjacentHTML('beforeend', markup);
  
    const gallery = new SimpleLightbox('.gallery a', { captionDelay: 250 });
    gallery.refresh();
  }