const BASE_URL = "https://api.exchangerate-api.com/v4/latest/";

const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const fromFlag = document.getElementById("from-flag");
const toFlag = document.getElementById("to-flag");
const amountInput = document.querySelector("input");
const convertedAmount = document.getElementById("converted-amount");
const swapBtn = document.querySelector(".swap-btn");
const btn = document.querySelector("form button");

// Populate dropdown with currency options
for (let currency in countryList) {
    let option1 = document.createElement("option");
    let option2 = document.createElement("option");
    option1.value = option2.value = currency;
    option1.innerText = option2.innerText = currency;
    fromCurrency.appendChild(option1);
    toCurrency.appendChild(option2);
}

// Update flag when currency changes
const updateFlag = (element, flagElement) => {
    let currencyCode = element.value;
    let countryCode = countryList[currencyCode];
    flagElement.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

// Swap currency selection
swapBtn.addEventListener("click", () => {
    let temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    updateFlag(fromCurrency, fromFlag);
    updateFlag(toCurrency, toFlag);
});

// Fetch and display exchange rate
const fetchExchangeRate = async () => {
    let amount = amountInput.value.trim(); // Remove unnecessary spaces
    if (amount === "" || amount === "0") {
        convertedAmount.innerText = ""; // Clear the result if input is empty or 0
        return;
    }

    let numericAmount = parseFloat(amount);
    let from = fromCurrency.value;
    let to = toCurrency.value;
    let URL = `${BASE_URL}${from}`;

    try {
        let response = await fetch(URL);
        if (!response.ok) throw new Error("Failed to fetch exchange rates");
        
        let data = await response.json();
        let rate = data.rates[to];
        if (!rate) throw new Error("Invalid currency selected");

        let convertedValue = (numericAmount * rate).toFixed(2);
        convertedAmount.innerText = `${numericAmount} ${from} = ${convertedValue} ${to}`;
    } catch (error) {
        convertedAmount.innerText = "Error fetching exchange rate.";
        console.error("Exchange Rate Fetch Error:", error);
    }
};

// Event Listeners
fromCurrency.addEventListener("change", () => {
    updateFlag(fromCurrency, fromFlag);
});

toCurrency.addEventListener("change", () => {
    updateFlag(toCurrency, toFlag);
});

// Start button click event
btn.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent form submission
    fetchExchangeRate(); // Trigger conversion on button click
});

// Set default values for currencies and flags
window.addEventListener("load", () => {
    // Set default currencies (e.g., USD to INR)
    fromCurrency.value = "USD";
    toCurrency.value = "INR";

    // Update flags
    updateFlag(fromCurrency, fromFlag);
    updateFlag(toCurrency, toFlag);

    // Optionally, start conversion automatically for default values (optional)
    fetchExchangeRate();
});
