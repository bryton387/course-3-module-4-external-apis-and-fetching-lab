// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Cache DOM elements
const stateInput = document.getElementById('state-input')
const fetchButton = document.getElementById('fetch-alerts')
const alertsDisplay = document.getElementById('alerts-display')
const errorMessage = document.getElementById('error-message')

// Event listener for the fetch button
fetchButton.addEventListener('click', async () => {
  try {
    const state = stateInput.value.trim()
    
    if (!state) {
      throw new Error('Please enter a state abbreviation')
    }

    // Fetch alerts for the given state
    const response = await fetch(weatherApi + state)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch alerts: ${response.statusText}`)
    }

    const data = await response.json()
    
    // Display the alerts
    displayAlerts(data)
    
    // Clear the error message on successful fetch
    errorMessage.textContent = ''
    errorMessage.classList.add('hidden')
    
    // Clear the input field
    stateInput.value = ''
  } catch (error) {
    // Display error message
    showError(error.message)
  }
})

/**
 * Display alerts data in the DOM
 * @param {Object} data - The API response data
 */
function displayAlerts(data) {
  const alertCount = data.features ? data.features.length : 0
  
  let html = `<p>${data.title}: ${alertCount}</p>`
  
  // Add individual alert headlines
  if (data.features && data.features.length > 0) {
    data.features.forEach(feature => {
      if (feature.properties && feature.properties.headline) {
        html += `<p>${feature.properties.headline}</p>`
      }
    })
  }
  
  alertsDisplay.innerHTML = html
}

/**
 * Display error message
 * @param {string} message - The error message to display
 */
function showError(message) {
  errorMessage.textContent = message
  errorMessage.classList.remove('hidden')
  alertsDisplay.innerHTML = ''
}