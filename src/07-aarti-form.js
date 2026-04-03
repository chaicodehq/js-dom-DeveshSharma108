/**
 * 🙏 Aarti Form - Form Handling, preventDefault & Validation
 *
 * Mandir ki aarti booking form bana rahe hain! Bhakton ka naam, aarti type,
 * aur date validate karke submit karna hai. Form submit hone pe page reload
 * nahi hona chahiye (preventDefault), pehle sab fields validate karo,
 * phir success ya error callback call karo. Jaise mandir mein pujari
 * entry check karta hai ki sab theek hai, waise hi form ko validate karo.
 *
 * Functions:
 *
 *   1. validateName(name)
 *      - Name must be a string, 2-50 characters long
 *      - Only letters (a-z, A-Z) and spaces allowed
 *      - Returns { valid: true, error: null } if valid
 *      - Returns { valid: false, error: "error message" } if invalid
 *      - Error messages (Hinglish):
 *        - Not string: "Naam string hona chahiye"
 *        - Too short: "Naam mein kam se kam 2 characters hone chahiye"
 *        - Too long: "Naam 50 characters se zyada nahi ho sakta"
 *        - Invalid chars: "Naam mein sirf letters aur spaces allowed hain"
 *
 *   2. validateDate(dateString)
 *      - Must be a valid date string in YYYY-MM-DD format
 *      - Must be today or a future date (past dates not allowed)
 *      - Returns { valid: true, error: null } if valid
 *      - Returns { valid: false, error: "error message" } if invalid
 *      - Error messages:
 *        - Not string: "Date string honi chahiye"
 *        - Invalid format: "Date YYYY-MM-DD format mein honi chahiye"
 *        - Past date: "Date aaj ya future ki honi chahiye"
 *
 *   3. validateAartiType(type)
 *      - Must be one of: "morning", "evening", "special"
 *      - Returns { valid: true, error: null } if valid
 *      - Returns { valid: false, error: "error message" } if invalid
 *      - Error messages:
 *        - Not string: "Aarti type string hona chahiye"
 *        - Invalid type: "Aarti type morning, evening, ya special mein se hona chahiye"
 *
 *   4. setupAartiForm(formElement, onSuccess, onError)
 *      - Adds "submit" event listener on formElement with preventDefault()
 *      - On submit: reads form fields:
 *        - name: from input/element with name="name" (formElement.elements.name.value)
 *        - date: from input with name="date"
 *        - aartiType: from select/input with name="aartiType"
 *      - Validates all three fields using above functions
 *      - If ALL valid: calls onSuccess({ name, date, aartiType })
 *      - If ANY invalid: calls onError(errorsArray) where errorsArray contains
 *        error strings from each failed validation
 *      - Returns cleanup function that removes the submit listener
 *      - Agar formElement null/undefined, return null
 *      - Agar onSuccess or onError not functions, return null
 *
 *   5. createBookingSummary(booking)
 *      - Takes { name, date, aartiType } object
 *      - Creates a div.booking-summary containing:
 *        - h3 with text "Booking Confirmation"
 *        - p.booking-name with text "Bhakt: {name}"
 *        - p.booking-date with text "Date: {date}"
 *        - p.booking-type with text "Aarti: {aartiType}"
 *      - Returns the div element
 *      - Agar booking null/undefined or missing fields, return null
 *
 * Hint: event.preventDefault() form ka default submit behavior rokta hai.
 *   formElement.elements se form ke inputs access karo by name attribute.
 *
 * @example
 *   validateName("Rahul Sharma");
 *   // => { valid: true, error: null }
 *
 *   validateName("R");
 *   // => { valid: false, error: "Naam mein kam se kam 2 characters hone chahiye" }
 *
 *   validateDate("2025-12-25");
 *   // => { valid: true, error: null } (if date is in future)
 *
 *   validateAartiType("morning");
 *   // => { valid: true, error: null }
 *
 *   const summary = createBookingSummary({
 *     name: "Rahul", date: "2025-12-25", aartiType: "morning"
 *   });
 *   // => <div class="booking-summary">...</div>
 */

function isValidFutureDate(dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }

  const [futureYear, futureMonth, futureDay] = dateString
    .split("-")
    .map(Number);

  const today = new Date();
  const currDay = today.getDate();
  const currMonth = today.getMonth() + 1;
  const currYear = today.getFullYear();

  const isLeapYear =
    (futureYear % 4 === 0 && futureYear % 100 !== 0) || futureYear % 400 === 0;

  const daysInMonth = {
    1: 31,
    2: isLeapYear ? 29 : 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
  };

  if (futureMonth < 1 || futureMonth > 12) {
    return false;
  }
  if (futureDay < 1 || daysInMonth[futureMonth] < futureDay) {
    return false;
  }

  return (
    new Date(currYear, currMonth - 1, currYear) <=
    new Date(futureYear, futureMonth - 1, futureDay)
  );
}
function allValidationsCheck(name, date, type) {
  const validationErrors = [];

  const nameValidationResult = validateName(name);
  const dateValidationResult = validateDate(date);
  const typeValidationResult = validateAartiType(type);

  if (!nameValidationResult.valid) {
    validationErrors.push(nameValidationResult.error);
  }
  if (!dateValidationResult.valid) {
    validationErrors.push(dateValidationResult.error);
  }
  if (!typeValidationResult.valid) {
    validationErrors.push(typeValidationResult.error);
  }

  if (!validationErrors.length) {
    return { status: true, errors: null };
  } else {
    return { status: false, errors: validationErrors };
  }
}

export function validateName(name) {
  if (typeof name !== "string") {
    return { valid: false, error: "Naam string hona chahiye" };
  }
  if (!name.trim() || name.length < 2) {
    return {
      valid: false,
      error: "Naam mein kam se kam 2 characters hone chahiye",
    };
  }
  if (name.length > 50) {
    return { valid: false, error: "Naam 50 characters se zyada nahi ho sakta" };
  }
  if (/[^A-Za-z ]/.test(name)) {
    return {
      valid: false,
      error: "Naam mein sirf letters aur spaces allowed hain",
    };
  }
  return { valid: true, error: null };
}

export function validateDate(dateString) {
  if (typeof dateString !== "string") {
    return { valid: false, error: "Date string honi chahiye" };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return { valid: false, error: "Date YYYY-MM-DD format mein honi chahiye" };
  }

  if (isValidFutureDate(dateString)) {
    return { valid: true, error: null };
  } else {
    return { valid: false, error: "Date aaj ya future ki honi chahiye" };
  }
}

export function validateAartiType(type) {
  const aartiTypes = new Set(["morning", "evening", "special"]);

  if (typeof type !== "string") {
    return { valid: false, error: "Aarti type string hona chahiye" };
  }
  if (!aartiTypes.has(type)) {
    return {
      valid: false,
      error: "Aarti type morning, evening, ya special mein se hona chahiye",
    };
  }
  return { valid: true, error: null };
}

export function setupAartiForm(formElement, onSuccess, onError) {
  if (!formElement) {
    return null;
  }
  if (typeof onSuccess !== "function" || typeof onError !== "function") {
    return null;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const name = formElement.elements.name.value;
    const date = formElement.elements.date.value;
    const type = formElement.elements.aartiType.value;

    const validationsResult = allValidationsCheck(name, date, type);

    if (validationsResult.status) {
      onSuccess({ name, date, aartiType: type });
    } else {
      onError(validationsResult.errors);
    }
  }

  formElement.addEventListener("submit", handleSubmit);
  return () => {
    formElement.removeEventListener("submit", handleSubmit);
  };
}

export function createBookingSummary(booking) {
  if (!booking || typeof booking !== "object" || Array.isArray(booking)) {
    return null;
  }

  if (!booking.name || !booking.date || !booking.aartiType) {
    return null;
  }

  // container
  const container = document.createElement("div");
  container.className = "booking-summary";

  const heading = document.createElement("h3");
  heading.textContent = "Booking Confirmation";

  const namePara = document.createElement("p");
  namePara.className = "booking-name";
  namePara.textContent = `Bhakt: ${booking.name}`;

  const datePara = document.createElement("p");
  datePara.className = "booking-date";
  datePara.textContent = `Date: ${booking.date}`;

  const typePara = document.createElement("p");
  typePara.className = "booking-type";
  typePara.textContent = `Aarti: ${booking.aartiType}`;

  container.append(heading, namePara, datePara, typePara);

  return container;
}
