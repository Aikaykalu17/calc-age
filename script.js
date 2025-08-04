'use strict';
const container = document.querySelector('.main_container');
const yearInput = document.querySelector('.year_input');
const inputYear = document.querySelector('.input_year');
const inputMonth = document.querySelector('.input_month');
const inputDay = document.querySelector('.input_day');
const svgIcon = document.querySelector('.svg_icon');
const daySpan = document.querySelector('.day_output_span');
const monthSpan = document.querySelector('.month_output_span');
const yearSpan = document.querySelector('.year_output_span');
const inputFields = document.querySelectorAll('.input_field');
const label = document.querySelectorAll('.hidden_label');
const spanDesc = document.querySelectorAll('.input_desc');
const dayError = document.querySelector('.day_error');
const monthError = document.querySelector('.month_error');
const yearError = document.querySelector('.year_error');
const descDay = document.querySelector('.input_desc_day');
const descMonth = document.querySelector('.input_desc_month');
const descYear = document.querySelector('.input_desc_year');

// Handle Hover
svgIcon.addEventListener('mouseover', () => {
  svgIcon.style.backgroundColor = 'black';
});
svgIcon.addEventListener('mouseout', () => {
  svgIcon.style.backgroundColor = 'hsl(259, 100%, 65%)';
});

// Handle Age Calcultion

const calcAge = function (birthDate) {
  let today = new Date();
  let birthDateObj = new Date(birthDate);
  let years = today.getFullYear() - birthDateObj.getFullYear();
  let months = today.getMonth() - birthDateObj.getMonth();
  let days = today.getDate() - birthDateObj.getDate();

  if (days < 0) {
    months--;
    let prevMonthDate = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonthDate.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, days };
};

// Function to update age spans

const updateAgeSpans = function () {
  const dobYear = inputYear.value;
  const dobMonth = inputMonth.value;
  const dobDay = inputDay.value;
  const currentYear = new Date().getFullYear();

  // Rest spans and eror messages
  yearSpan.textContent = '--';
  monthSpan.textContent = '--';
  daySpan.textContent = '--';

  inputFields.forEach((field, index) => {
    let span = spanDesc[index];
    let labels = label[index];
    if (field.value.trim() === '') {
      field.style.border = '1px solid red';
      labels.style.display = 'block';
      span.style.color = 'red';
    } else {
      field.style.border = '';
      labels.style.display = '';
      span.style.color = '';
    }
  });

  // //   Check for valid year

  if (dobYear > currentYear) {
    yearError.textContent = 'Must be in the past';
    yearError.style.display = 'block';
    descYear.style.color = 'red';
    inputYear.style.border = '1px solid red';
  } else {
    yearError.textContent = '';
  }

  // // Check for valid month
  if (dobMonth < 0 || dobMonth > 12) {
    monthError.textContent = 'Must be a valid month';
    monthError.style.display = 'block';
    descMonth.style.color = 'red';
    inputMonth.style.border = '1px solid red';
  } else {
    monthError.textContent = '';
  }

  // // Check for valid day

  if (dobDay < 0 || dobDay > 31) {
    dayError.style.display = 'block';
    descDay.style.color = 'red';
    inputDay.style.border = '1px solid red';
    dayError.textContent = 'Must be a valid day';
  } else {
    dayError.textContent = '';
  }

  // // Check for valid date

  const dob = `${dobYear}-${padZero(dobMonth)}-${padZero(dobDay)}`;
  const birthDate = new Date(dob);
  const daysInMonth = new Date(dobYear, dobMonth, 0).getDate();

  // To check if the day is greater than the days in the month

  if (dobDay > daysInMonth) {
    descDay.style.color = 'red';
    descMonth.style.color = 'red';
    descYear.style.color = 'red';
    inputDay.style.border = '1px solid red';
    inputMonth.style.border = '1px solid red';
    inputYear.style.border = '1px solid red';
    dayError.textContent = 'Must be a valid date';
    dayError.style.display = 'block';
    yearSpan.textContent = '--';
    monthSpan.textContent = '--';
    daySpan.textContent = '--';
  } else if (isNaN(birthDate.getTime())) {
    yearSpan.textContent = '--';
    monthSpan.textContent = '--';
    daySpan.textContent = '--';
  } else {
    const age = calcAge(dob);
    yearSpan.textContent = age.years;
    monthSpan.textContent = age.months;
    daySpan.textContent = age.days;
  }
};

const padZero = function (num) {
  return num.toString().padStart(2, '0');
};

// Event listener for SVG icon
svgIcon.addEventListener('click', updateAgeSpans);

//  Event lisnter to calculate age only when
inputFields.forEach(field => {
  field.addEventListener('keydown', e => {
    if (e.key === 'Enter') updateAgeSpans(e);
  });
});

// Functions to get user's live location

const renderError = function (msg) {
  container.insertAdjacentText('afterbegin', msg);
  container.style.opacity = 1;
};
const renderCountry = function (data) {
  const html = `<div style=" " class="countries">
  <article style=" height: 0; transform:translateY(-55px)" class="country">
          
          <div style="display: flex; gap: 1rem; height: 100%; justify-items: centre; align-items:centre;" class="country__data">
          <h4 style="color:hsl(259, 100%, 65%);" class="country_city">${data.city}</h4>
            <h4 style="color:hsl(259, 100%, 65%);" class="country_name">${data.countryCode}</h4>
            <h4 style="text-transform:none; color:hsl(259, 100%, 65%);" class="country__region">${data.continent}</h4>
          </div>
        </article>
       </div>`;
  container.insertAdjacentHTML('afterbegin', html);
  container.style.opacity = 1;
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async function () {
  try {
    // Geolocation
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    // Reverse geocoding
    const resGeo = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
    );
    if (!resGeo.ok) throw new Error('Problem fetching location');

    const dataGeo = await resGeo.json();
    console.log(dataGeo);

    renderCountry(dataGeo);
    // Country data
  } catch (err) {
    renderError(`❌ Couldn't fetch your location`);
    throw err;
  }
};
whereAmI();
