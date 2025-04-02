// DOM Elements
const map = L.map('map', {
  minZoom: 2,          // Set minimum zoom level
  maxBoundsViscosity: 1.0,  // Make bounds "sticky"
  worldCopyJump: true  // Enable smooth wrapping at date line
}).setView([20, 0], 2);

// Set map bounds to prevent dragging too far from the map area
const southWest = L.latLng(-89.98, -180);
const northEast = L.latLng(89.98, 180);
const bounds = L.latLngBounds(southWest, northEast);
map.setMaxBounds(bounds);

const tooltip = document.getElementById('tooltip');
const searchBox = document.getElementById('searchBox');
const searchSuggestions = document.getElementById('search-suggestions');
const infoPanel = document.getElementById('info');
const welcomeMessage = document.getElementById('welcome-message');
const startExploringBtn = document.getElementById('start-exploring');
const darkModeToggle = document.getElementById('dark-mode-toggle');

let highlightedLayer = null;
let countryLayers = {};
let isDarkMode = false;
let currentBaseLayer;

// Initialize the map with a smoother tile layer
currentBaseLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 19,
  noWrap: false  // Allow the map to be displayed continuously
}).addTo(map);

// Welcome message
startExploringBtn.addEventListener('click', () => {
  welcomeMessage.classList.add('hidden');
  // Add a slight delay before showing the info panel for a smooth sequence
  setTimeout(() => {
      infoPanel.classList.add('active');
  }, 300);
});

// Dark mode toggle
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  isDarkMode = !isDarkMode;
  
  // Update the icon
  if (isDarkMode) {
      darkModeToggle.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
      `;
  } else {
      darkModeToggle.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3V4M12 20V21M4 12H3M21 12H20M6.31 6.31L5.6 5.6M18.4 18.4L17.69 17.69M18.4 5.6L17.69 6.31M6.31 17.69L5.6 18.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" stroke="currentColor" stroke-width="2"/>
          </svg>
      `;
  }
  
  // Update map tiles for dark mode
  if (isDarkMode) {
      map.removeLayer(currentBaseLayer);
      currentBaseLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
          noWrap: false
      }).addTo(map);
  } else {
      map.removeLayer(currentBaseLayer);
      currentBaseLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
          noWrap: false
      }).addTo(map);
  }
});

// Generate a visually pleasing color palette for countries
function generateColorPalette(count) {
  const colors = [];
  const baseHues = [210, 180, 120, 45, 330, 270];
  
  for (let i = 0; i < count; i++) {
      const hue = baseHues[i % baseHues.length];
      const saturation = 70 + Math.random() * 20;
      const lightness = 50 + Math.random() * 20;
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  
  return colors;
}

// Load GeoJSON data with enhanced styling
fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
  .then(response => response.json())
  .then(data => {
      const colorPalette = generateColorPalette(data.features.length);
      
      const geoJsonLayer = L.geoJSON(data, {
          onEachFeature: (feature, layer) => {
              const countryName = feature.properties.ADMIN;
              countryLayers[countryName.toLowerCase()] = layer;
              
              // Enhanced mouseover effect
              layer.on('mouseover', (e) => {
                  tooltip.style.display = 'block';
                  tooltip.innerHTML = countryName;
                  tooltip.style.left = e.originalEvent.pageX + 'px';
                  tooltip.style.top = e.originalEvent.pageY + 'px';
                  
                  // Animated highlight
                  layer.setStyle({ 
                      fillOpacity: 0.8,
                      weight: 2,
                      dashArray: ''
                  });
                  
                  layer.bringToFront();
              });

              // Reset on mouseout
              layer.on('mouseout', () => {
                  tooltip.style.display = 'none';
                  
                  if (highlightedLayer !== layer) {
                      layer.setStyle({ 
                          fillOpacity: 0.6,
                          weight: 1,
                          dashArray: '3'
                      });
                  }
              });

              // Enhanced click interaction
              layer.on('click', () => {
                  // Reset previous highlight if any
                  if (highlightedLayer) {
                      geoJsonLayer.resetStyle(highlightedLayer);
                      highlightedLayer.setStyle({ 
                          fillOpacity: 0.6,
                          weight: 1,
                          dashArray: '3'
                      });
                  }
                  
                  // Highlight selected country
                  layer.setStyle({
                      weight: 3,
                      color: '#ff6b6b',
                      dashArray: '',
                      fillOpacity: 0.7
                  });
                  
                  highlightedLayer = layer;
                  
                  // Animate map to selected country
                  map.flyToBounds(layer.getBounds(), {
                      padding: [100, 100],
                      duration: 1
                  });
                  
                  // Show loading state
                  document.getElementById('details').innerHTML = '<div class="loading"></div>';
                  
                  // Ensure info panel is visible
                  if (!infoPanel.classList.contains('active')) {
                      infoPanel.classList.add('active');
                  }
                  
                  // Fetch country data with animation
                  const countryName = feature.properties.ADMIN;
                  fetch(`https://restcountries.com/v3.1/name/${countryName}`)
                      .then(response => response.json())
                      .then(countryData => {
                          if (countryData && countryData[0]) {
                              const country = countryData[0];
                              
                              // Format currency
                              let currencyInfo = 'N/A';
                              if (country.currencies) {
                                  const currencies = Object.values(country.currencies);
                                  if (currencies.length > 0) {
                                      currencyInfo = currencies.map(c => `${c.name} (${c.symbol || ''})`).join(', ');
                                  }
                              }
                              
                              // Format languages
                              let languageInfo = 'N/A';
                              if (country.languages) {
                                  languageInfo = Object.values(country.languages).join(', ');
                              }
                              
                              // Build detailed info with animation classes
                              const details = `
                                  <div class="country-details">
                                      <div class="flag-container">
                                          <img src="${country.flags.png}" alt="Flag of ${country.name.common}" style="width:60px; height:auto;">
                                          <h3>${country.name.common}</h3>
                                      </div>
                                      
                                      <div class="detail-item">
                                          <div class="detail-label">Capital</div>
                                          <div>${country.capital ? country.capital[0] : 'N/A'}</div>
                                      </div>
                                      
                                      <div class="detail-item">
                                          <div class="detail-label">Population</div>
                                          <div>${country.population.toLocaleString()}</div>
                                      </div>
                                      
                                      <div class="detail-item">
                                          <div class="detail-label">Region</div>
                                          <div>${country.region} ${country.subregion ? `(${country.subregion})` : ''}</div>
                                      </div>
                                      
                                      <div class="detail-item">
                                          <div class="detail-label">Currency</div>
                                          <div>${currencyInfo}</div>
                                      </div>
                                      
                                      <div class="detail-item">
                                          <div class="detail-label">Languages</div>
                                          <div>${languageInfo}</div>
                                      </div>
                                      
                                      <div class="detail-item">
                                          <div class="detail-label">Area</div>
                                          <div>${country.area ? country.area.toLocaleString() + ' km²' : 'N/A'}</div>
                                      </div>
                                  </div>
                              `;
                              
                              document.getElementById('details').innerHTML = details;
                              
                              // Trigger animations with slight delays
                              setTimeout(() => {
                                  document.querySelector('.country-details').classList.add('active');
                              }, 100);
                          } else {
                              document.getElementById('details').innerHTML = 'Country information not found.';
                          }
                      })
                      .catch(error => {
                          console.error('Error fetching country data:', error);
                          document.getElementById('details').innerHTML = 'Error loading country information.';
                      });
              });
          },
          style: (feature, index) => {
              const colorIndex = data.features.indexOf(feature) % colorPalette.length;
              return {
                  fillColor: colorPalette[colorIndex],
                  weight: 1,
                  opacity: 1,
                  color: 'white',
                  dashArray: '3',
                  fillOpacity: 0.6
              };
          }
      }).addTo(map);

      // Enhanced search functionality
      searchBox.addEventListener('input', () => {
          const searchTerm = searchBox.value.toLowerCase();
          searchSuggestions.innerHTML = '';
          searchSuggestions.style.display = 'none';

          if (searchTerm.length > 0) {
              const suggestions = data.features
                  .filter(feature => feature.properties.ADMIN.toLowerCase().includes(searchTerm))
                  .map(feature => feature.properties.ADMIN)
                  .slice(0, 5); // Limit to top 5 suggestions

              if (suggestions.length > 0) {
                  searchSuggestions.style.display = 'block';
                  suggestions.forEach(suggestion => {
                      const suggestionDiv = document.createElement('div');
                      suggestionDiv.textContent = suggestion;
                      suggestionDiv.addEventListener('click', () => {
                          searchBox.value = suggestion;
                          searchSuggestions.style.display = 'none';
                          triggerSearch(suggestion);
                      });
                      searchSuggestions.appendChild(suggestionDiv);
                  });
              }
          }
      });

      // Search on Enter key
      searchBox.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
              const searchTerm = searchBox.value;
              triggerSearch(searchTerm);
          }
      });

      // Enhanced search trigger function
      const triggerSearch = (searchTerm) => {
          // Close suggestions
          searchSuggestions.style.display = 'none';
          
          // Normalize search term
          const normalizedTerm = searchTerm.toLowerCase().trim();
          
          // Find country layer
          const matchedCountry = Object.keys(countryLayers).find(
              country => country.toLowerCase().includes(normalizedTerm)
          );
          
          if (matchedCountry) {
              const layer = countryLayers[matchedCountry];
              
              // Trigger the click event on the country
              layer.fire('click');
              
              // Add pulse animation to highlight the search result
              layer.setStyle({
                  weight: 3,
                  color: '#ff6b6b',
                  dashArray: '',
                  fillOpacity: 0.7
              });
              
              // Add and then remove pulse class for animation
              searchBox.classList.add('pulse');
              setTimeout(() => {
                  searchBox.classList.remove('pulse');
              }, 2000);
          } else {
              // Show error message with animation
              searchBox.classList.add('pulse');
              searchBox.style.borderColor = '#ff6b6b';
              
              setTimeout(() => {
                  searchBox.classList.remove('pulse');
                  searchBox.style.borderColor = '';
                  alert('Country not found. Please check the spelling.');
              }, 1000);
          }
      };
  })
  .catch(error => {
      console.error('Error loading GeoJSON data:', error);
      document.getElementById('details').innerHTML = 'Error loading map data. Please try refreshing the page.';
  });

// Enhanced tooltip positioning
document.addEventListener('mousemove', (e) => {
  if (tooltip.style.display === 'block') {
      tooltip.style.left = e.pageX + 'px';
      tooltip.style.top = e.pageY + 'px';
  }
});

// Close search suggestions when clicking outside
document.addEventListener('click', (e) => {
  if (!searchBox.contains(e.target) && !searchSuggestions.contains(e.target)) {
      searchSuggestions.style.display = 'none';
  }
});