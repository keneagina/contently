import axios from 'axios';
import './style.css';

const app = document.querySelector('#app');

app.innerHTML = `
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Hero Section -->
    <div class="relative overflow-hidden pt-6 sm:pt-8 md:pt-12">
      <div class="max-w-7xl mx-auto">
        <div class="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main class="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6 md:mt-40">
            <div class="sm:text-center lg:text-left">
              <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl leading-[1.1]">
                <span class="block">Transform Web</span>
                <span class="block">Content</span>
                <span class="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">into Clean Markdown</span>
              </h1>
              <p class="mt-6 text-xl text-gray-600 sm:mt-8 sm:text-2xl max-w-2xl mx-auto lg:mx-0">
                Extract, convert, and repurpose web content effortlessly. Perfect for developers, content creators, and researchers.
              </p>
              <div class="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start gap-4">
                <div class="rounded-md shadow">
                  <a href="#converter" class="w-full flex items-center justify-center px-8 py-4 text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 md:text-lg">
                    Try it now
                  </a>
                </div>
                <div class="mt-3 sm:mt-0">
                  <a href="#features" class="w-full flex items-center justify-center px-8 py-4 text-base font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 md:text-lg">
                    Learn more
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>

    <!-- Converter Section -->
    <div id="converter" class="max-w-6xl mx-auto px-4 py-16">
      <div class="max-w-xl mx-auto">
        <form id="scrape-form" class="space-y-4">
          <input 
            type="url" 
            id="url-input"
            placeholder="Enter website URL"
            required
            class="input"
          />
          <button type="submit" class="btn btn-primary w-full">
            Convert to Markdown
          </button>
        </form>

        <div id="result" class="mt-8 hidden">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Result:</h2>
            <button id="copy-btn" class="btn bg-gray-100 hover:bg-gray-200 text-gray-700">
              Copy to Clipboard
            </button>
          </div>
          <div class="bg-white p-4 rounded-lg shadow">
            <pre id="markdown-output" class="whitespace-pre-wrap max-h-[300px] overflow-hidden"></pre>
            <div id="fade-overlay" class="h-12 bg-gradient-to-t from-white to-transparent relative -mt-12"></div>
            <button id="read-more-btn" class="mt-4 text-primary hover:text-primary/80 font-medium">
              Read More
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div id="features" class="bg-gray-50 py-16">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-xl font-semibold mb-3">Quick Conversion</h3>
            <p class="text-gray-600">Transform any webpage into clean, structured Markdown with just one click.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-xl font-semibold mb-3">AI-Powered</h3>
            <p class="text-gray-600">Smart content extraction that preserves the important elements of your content.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-xl font-semibold mb-3">Developer Friendly</h3>
            <p class="text-gray-600">Perfect for documentation, content migration, and data collection.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

function initScraper() {
  const form = document.querySelector('#scrape-form');
  const urlInput = document.querySelector('#url-input');
  const result = document.querySelector('#result');
  const output = document.querySelector('#markdown-output');
  const readMoreBtn = document.querySelector('#read-more-btn');
  const fadeOverlay = document.querySelector('#fade-overlay');
  const copyBtn = document.querySelector('#copy-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      const url = urlInput.value;
      showToast('Scraping website...', 'info');
      
      const data = await scrapeWebsite(url);
      output.textContent = data.markdown || data.content;
      result.classList.remove('hidden');
      
      showToast('Website scraped successfully!', 'success');
    } catch (error) {
      console.error('Scraping error:', error);
      showToast('Error: ' + error.message, 'error');
    }
  });

  readMoreBtn.addEventListener('click', () => {
    if (output.classList.contains('max-h-[300px]')) {
      output.classList.remove('max-h-[300px]');
      fadeOverlay.classList.add('hidden');
      readMoreBtn.textContent = 'Show Less';
    } else {
      output.classList.add('max-h-[300px]');
      fadeOverlay.classList.remove('hidden');
      readMoreBtn.textContent = 'Read More';
    }
  });

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(output.textContent);
      showToast('Copied to clipboard!', 'success');
    } catch (err) {
      showToast('Failed to copy text', 'error');
    }
  });
}

function showToast(message, type = 'info') {
  const container = document.querySelector('#toast-container');
  const toast = document.createElement('div');
  
  toast.className = `
    p-4 mb-4 rounded-md shadow-lg transition-all transform translate-y-0 opacity-100
    ${type === 'error' ? 'bg-red-500' : ''}
    ${type === 'success' ? 'bg-green-500' : ''}
    ${type === 'info' ? 'bg-blue-500' : ''}
    text-white
  `;
  
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

async function scrapeWebsite(url) {
  const options = {
    method: 'POST',
    url: 'https://ai-content-scraper.p.rapidapi.com/scrape',
    headers: {
      'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
      'x-rapidapi-host': 'ai-content-scraper.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: { url }
  };

  try {
    const response = await axios.request(options);
    if (!response.data) {
      throw new Error('No data received from the API');
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`API Error: ${error.response.data.message || 'Unknown API error'}`);
    }
    throw new Error(`Failed to scrape website: ${error.message}`);
  }
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });
}

initScraper();
initSmoothScroll();