document.addEventListener("DOMContentLoaded", () => {
  const progressBar = document.getElementById("progress-bar");
  const progressBarFill = progressBar.querySelector(".fill");

  function updateProgressBar() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const progress = (scrollTop / (documentHeight - windowHeight)) * 100;

    progressBarFill.style.width = `${progress}%`;
  }

  window.addEventListener("scroll", updateProgressBar);
  window.addEventListener("resize", updateProgressBar);

  const returnToTopBtn = document.getElementById("return-to-top-btn");

  function scrollToTop() {
    if (window.scrollY != 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  returnToTopBtn.addEventListener("click", () => {
    setTimeout(scrollToTop, 200);
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      returnToTopBtn.style.display = "block";
    } else {
      returnToTopBtn.style.display = "none";
    }
  });
  //VALIDACIÓN FORMULARIO

  // Obtener el formulario
  const form = document.getElementById("myForm");

  // Agregar el evento de envío del formulario
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío por defecto

    // Resetear los estilos de los campos
    resetStyles();

    // Validar los campos
    if (!validateName() || !validateEmail() || !validateCheckbox()) {
      return; // Detener el envío si hay campos no válidos
    }

    // Recoger los datos del formulario
    const formData = new FormData(form);

    // Mandar los datos al servidor JSON
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  });

  // Validar el campo de nombre
  function validateName() {
    const nameInput = document.getElementById("name");
    const nameValue = nameInput.value.trim();

    if (nameValue.length < 2 || nameValue.length > 100) {
      nameInput.classList.add("error");
      return false;
    }

    return true;
  }

  // Validar el campo de correo electrónico
  function validateEmail() {
    const emailInput = document.getElementById("email");
    const emailValue = emailInput.value.trim();

    // Expresión regular para validar el formato del email
    const emailRegex = /^[\w.-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(emailValue)) {
      emailInput.classList.add("error");
      return false;
    }

    return true;
  }
  function subscribeModal() {
    var modal = document.getElementById("Modal");
    var closeButton = document.getElementsByClassName("close")[0];
    var submitButton = document.querySelector("#subscribeForm button");
    var emailInput = document.getElementById("emailInput");

    function showModal() {
      modal.style.display = "block";
    }

    function hideModal() {
      modal.style.display = "none";
    }

    function validateEmail(email) {
      var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }

    function saveEmailAddress(email) {
      // Envía la dirección de correo electrónico al servidor aquí
      console.log("Dirección de correo electrónico guardada: " + email);
    }

    function handleFormSubmit(event) {
      event.preventDefault();
      var email = emailInput.value.trim();

      if (validateEmail(email)) {
        saveEmailAddress(email);
        hideModal();

        // Guarda que ya se ha cerrado el popup en localStorage
        localStorage.setItem("popupClosed", "true");
      } else {
        alert(
          "Por favor, introduce una dirección de correo electrónico válida."
        );
      }
    }

    // Cierra el modal al hacer clic en la 'X'
    closeButton.addEventListener("click", hideModal);

    // Cierra el modal al hacer clic fuera del contenido
    window.addEventListener("click", function (event) {
      if (event.target === modal) {
        hideModal();
      }
    });

    // Cierra el modal al pulsar la tecla 'ESC'
    window.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        hideModal();
      }
    });

    // Evita mostrar el popup nuevamente si ya ha sido cerrado
    if (localStorage.getItem("popupClosed") !== "true") {
      showModal();
    }

    // Agrega el evento de envío del formulario para validar y guardar la dirección de correo electrónico
    submitButton.addEventListener("click", handleFormSubmit);
  }

  // Mostrar el popup después de 5 segundos o cuando el usuario haya bajado el 25% de la página
  var pageHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );
  var scrollThreshold = pageHeight * 0.25;

  function showPopup() {
    if (window.scrollY >= scrollThreshold) {
      subscribeModal();
    } else {
      window.addEventListener("scroll", checkScrollThreshold);
    }
  }

  function checkScrollThreshold() {
    if (window.scrollY >= scrollThreshold) {
      subscribeModal();
      window.removeEventListener("scroll", checkScrollThreshold);
    }
  }

  setTimeout(showPopup, 5000);

  //CONVERSOR DE MONEDAS

  const moneyURL =
    "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json";

  let euro;
  let pounds;

  // llamada a la API
  const callApiMoney = async (url) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        euro = json.usd["eur"];
        pounds = json.usd["gbp"];
      }
    } catch (error) {
      console.log(error);
    }
  };

  // precios predefinidos en usd
  document.getElementById("priceBasic").innerHTML = "$" + 0;
  document.getElementById("priceProfessional").innerHTML = "$" + 20;
  document.getElementById("pricePremium").innerHTML = "$" + 60;

  let selector = document.querySelector(".pricing-currency");

  (async function () {
    await callApiMoney(moneyURL);

    selector.addEventListener("change", () => {
      let index = selector.selectedIndex;

      if (index === 0) {
        document.getElementById("priceBasic").innerHTML =
          "£" + Math.round(0 * pounds);
        document.getElementById("priceProfessional").innerHTML =
          "£" + Math.round(20 * pounds);
        document.getElementById("pricePremium").innerHTML =
          "£" + Math.round(60 * pounds);
      } else if (index === 1) {
        document.getElementById("priceBasic").innerHTML =
          Math.round(0 * euro) + "€";
        document.getElementById("priceProfessional").innerHTML =
          Math.round(20 * euro) + "€";
        document.getElementById("pricePremium").innerHTML =
          Math.round(60 * euro) + "€";
      } else if (index === 2) {
        document.getElementById("priceBasic").innerHTML = "$" + 0;
        document.getElementById("priceProfessional").innerHTML = "$" + 20;
        document.getElementById("pricePremium").innerHTML = "$" + 60;
      }
    });
  })();

  /* SLIDER */

  //botones de las flechas
  const slider = document.querySelectorAll("#slider"); //slider section

  const botones = document.querySelectorAll(".slide-btn-container"); // sección de botones debajo de la imagen

  const botonesChildren = botones[0].children; // coger propiedad children que es donde están los botones

  // guardar posición de los botones
  const boton1 = botonesChildren[0];
  const boton2 = botonesChildren[1];
  const boton3 = botonesChildren[2];
  const boton4 = botonesChildren[3];

  const arrayBotones = [boton1, boton2, boton3, boton4]; // array de los botones

  const sliderChildren = slider[0].children; //coger propiedad children que es donde están las imgs

  //guardar la posición de las imágenes
  const image1 = sliderChildren[0];
  const image2 = sliderChildren[1];
  const image3 = sliderChildren[2];
  const image4 = sliderChildren[3];

  const arrayImages = [image1, image2, image3, image4]; //array de las imágenes

  const arrowRight = document.querySelector("#arrow-right"); //botón flecha derecha

  const arrowLeft = document.querySelector("#arrow-left"); // botón flecha izquierda

  // eventos para los botones de flecha
  let indice = 0;

  //Botones de flecha
  arrowRight.addEventListener("click", () => {
    arrayImages[indice].classList.remove("slide-img-active");
    arrayBotones[indice].classList.remove("slide-btn-active");
    indice++;

    if (indice > arrayImages.length - 1) {
      indice = 0;
    }

    arrayImages[indice].classList.add("slide-img-active");
    arrayBotones[indice].classList.add("slide-btn-active");
  });

  arrowLeft.addEventListener("click", () => {
    arrayImages[indice].classList.remove("slide-img-active");
    arrayBotones[indice].classList.remove("slide-btn-active");
    indice--;
    if (indice < 0) {
      indice = arrayImages.length - 1;
      boton1.classList.remove("slide-btn-active");
    }

    arrayImages[indice].classList.add("slide-img-active");
    arrayBotones[indice].classList.add("slide-btn-active");
  });

  //Slider auto
  let i = 0;
  setInterval(function () {
    arrayImages[i].classList.remove("slide-img-active");
    arrayBotones[i].classList.remove("slide-btn-active");
    i++;

    if (i > arrayImages.length - 1) {
      i = 0;
    }

    arrayImages[i].classList.add("slide-img-active");
    arrayBotones[i].classList.add("slide-btn-active");
  }, 3200);
});
