/**
 * 💒 Wedding Card Maker - Event Delegation
 *
 * Sharma ji ki beti ki shaadi ka digital card banana hai! Event delegation
 * use karke dynamic elements handle karo. Ek parent pe listener lagao,
 * aur child elements ke events handle karo. Jaise shaadi mein ek event
 * manager saare kaam coordinate karta hai, waise hi ek parent listener
 * saare child events manage karta hai.
 *
 * Functions:
 *
 *   1. setupGuestList(containerElement)
 *      - Sets up event delegation on containerElement for click events
 *      - Clicking any .remove-btn inside container removes its parent .guest-item
 *      - Returns object with:
 *        addGuest(name, side): creates div.guest-item with:
 *          - data-name attribute = name
 *          - data-side attribute = side ("bride" or "groom")
 *          - span with textContent = name
 *          - button.remove-btn with textContent "Remove"
 *          Appends to container. Returns the created element.
 *        removeGuest(name): finds .guest-item with data-name matching name,
 *          removes it. Returns true if found and removed, false otherwise.
 *        getGuests(): returns array of {name, side} objects from current
 *          .guest-item children in the container
 *      - Agar containerElement null/undefined, return null
 *
 *   2. setupThemeSelector(containerElement, previewElement)
 *      - Creates 3 button.theme-btn elements inside containerElement:
 *        "traditional", "modern", "royal" (textContent and data-theme)
 *      - Event delegation on containerElement: clicking any .theme-btn:
 *        - Sets previewElement.className to the clicked theme name
 *        - Sets previewElement's data-theme attribute to the theme name
 *      - Returns object with:
 *        getTheme(): returns previewElement's current data-theme value or null
 *      - Agar containerElement or previewElement null/undefined, return null
 *
 *   3. setupCardEditor(cardElement)
 *      - Event delegation on cardElement for click events
 *      - Clicking any element with [data-editable] attribute:
 *        - Removes "editing" class and contentEditable from any currently
 *          editing element inside cardElement
 *        - Sets clicked element's contentEditable = "true"
 *        - Adds class "editing" to clicked element
 *      - Clicking on cardElement itself (not on a [data-editable] child):
 *        - Removes "editing" class and contentEditable from any editing element
 *      - Returns object with:
 *        getContent(field): finds element with data-editable=field,
 *          returns its textContent. Returns null if not found.
 *      - Agar cardElement null/undefined, return null
 *
 * Hint: Event delegation means: ek parent pe listener lagao, then
 *   event.target se check karo ki actual click kahan hua. event.target.closest()
 *   use karo parent elements check karne ke liye.
 *
 * @example
 *   const container = document.createElement("div");
 *   const guestList = setupGuestList(container);
 *
 *   guestList.addGuest("Rahul", "groom");
 *   guestList.addGuest("Priya", "bride");
 *   guestList.getGuests();
 *   // => [{ name: "Rahul", side: "groom" }, { name: "Priya", side: "bride" }]
 *
 *   guestList.removeGuest("Rahul"); // => true
 *   guestList.getGuests();
 *   // => [{ name: "Priya", side: "bride" }]
 */

export function setupGuestList(containerElement) {
  if (!containerElement) {
    return null;
  }

  function handleClick(event) {
    const button = event.target.closest(".remove-btn");

    if (button) {
      const guestItem = button.closest(".guest-item");
      if (guestItem) {
        guestItem.remove();
      }
    }
  }

  containerElement.addEventListener("click", handleClick);

  return {
    addGuest(name, side) {
      const div = document.createElement("div");
      div.classList.add("guest-item");

      div.dataset.name = name;
      div.dataset.side = side;

      const span = document.createElement("span");
      span.textContent = name;

      const button = document.createElement("button");
      button.classList.add("remove-btn");
      button.textContent = "Remove";

      div.append(span, button);

      containerElement.appendChild(div);
      return div;
    },

    removeGuest(name) {
      const guest = containerElement.querySelector(
        `.guest-item[data-name="${name}"]`
      );

      if (guest) {
        guest.remove();
        return true;
      }
      return false;
    },

    getGuests() {
      return [...containerElement.querySelectorAll(".guest-item")].map(
        (guest) => ({
          name: guest.dataset.name,
          side: guest.dataset.side,
        })
      );
    },
  };
}

export function setupThemeSelector(containerElement, previewElement) {
  if (!containerElement || !previewElement) {
    return null;
  }

  function handleClick(event) {
    const button = event.target.closest(".theme-btn");

    if (button) {
      const prevTheme = previewElement.dataset.theme;

      if (prevTheme) {
        previewElement.classList.remove(prevTheme);
      }

      previewElement.classList.add(button.dataset.theme);
      previewElement.dataset.theme = button.dataset.theme;
    }
  }

  const traditionalButton = document.createElement("button");
  traditionalButton.classList.add("theme-btn");
  traditionalButton.textContent = "traditional";
  traditionalButton.dataset.theme = "traditional";

  const modernButton = document.createElement("button");
  modernButton.classList.add("theme-btn");
  modernButton.textContent = "modern";
  modernButton.dataset.theme = "modern";

  const royalButton = document.createElement("button");
  royalButton.classList.add("theme-btn");
  royalButton.textContent = "royal";
  royalButton.dataset.theme = "royal";

  containerElement.append(traditionalButton, modernButton, royalButton);
  containerElement.addEventListener("click", handleClick);

  return {
    getTheme() {
      return !previewElement.dataset.theme
        ? null
        : previewElement.dataset.theme;
    },
  };
}

export function setupCardEditor(cardElement) {
  if (!cardElement) {
    return null;
  }

  function handleClick(event) {
    const clickedElement = event.target.closest("[data-editable]");
    const prevEditingEle = cardElement.querySelector(".editing");

    if (prevEditingEle) {
      prevEditingEle.classList.remove("editing");
      prevEditingEle.contentEditable = "false";
    }

    if (clickedElement) {
      clickedElement.classList.add("editing");
      clickedElement.contentEditable = "true";
    }
  }
  cardElement.addEventListener("click", handleClick);

  return {
    getContent(field) {
      const element = cardElement.querySelector(`[data-editable="${field}"]`);
      if (element) {
        return element.textContent;
      } else {
        return null;
      }
    },
  };
}
