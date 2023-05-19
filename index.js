// Wait for the DOM to be ready
$(document).ready(function () {
  // Function to load Pokemon card images from the API
  function loadPokemonImages() {
    // Array to store the Pokemon image URLs
    var pokemonImages = [];

    // Loop through each card element and push the image source URL twice
    $('.card').each(function (index) {
      var card = $(this);

      // Make a request to the Pokemon API with a cache-busting query parameter
      $.ajax({
        url: 'https://pokeapi.co/api/v2/pokemon/' + (index + 1),
        cache: false // Add cache: false to prevent caching
      })
        .done(function (response) {
          // Get the front sprite URL from the response
          var frontSpriteUrl = response.sprites.front_default;

          // Push the URL twice to the pokemonImages array
          pokemonImages.push(frontSpriteUrl);
          pokemonImages.push(frontSpriteUrl);

          // If the pokemonImages array has enough URLs for all cards, update the image sources
          if (pokemonImages.length === $('.card').length) {
            updateCardImages();
          }
        })
        .fail(function () {
          console.error('Failed to load Pokemon data for card ' + (index + 1));
        });
    });


    // Function to update the image sources of the cards
    function updateCardImages() {
      $('.card').each(function (index) {
        var card = $(this);
        var frontFace = card.find('.front_face');

        // Set the image source of the front face to a random URL from the pokemonImages array
        var randomIndex = Math.floor(Math.random() * pokemonImages.length);
        var imageUrl = pokemonImages[randomIndex];
        frontFace.attr('src', imageUrl);

        // Remove the used URL from the pokemonImages array
        pokemonImages.splice(randomIndex, 1);
      });
    }
  }

  // Call the loadPokemonImages function to replace the card images
  loadPokemonImages();
});

$(document).ready(function () {
  loadPokemonImages();
  setup();
});

const setup = () => {
  let firstCard = undefined;
  let secondCard = undefined;
  let powerUpActive = false;
  let totalPairs = $(".card").length / 2; // Total number of pairs
  let matches = 0; // Number of pairs matched
  let clicks = 0; // Number of clicks
  let pairsLeft = totalPairs; // Number of pairs left to be matched
  let timerSeconds = 0;
  const timeValue = 30; // Define the time value (in seconds) for the game
  const powerUpInterval = 30;

  $("#start").on("click", function () {
    $(this).hide();
    $("#game_grid").show();
    startTimer();
    startPowerUpMessage();
  });
  // Update the timer every second
  const startTimer = () => {
    const startTime = Date.now(); // Record the start time

    timerInterval = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = Math.floor((currentTime - startTime) / 1000); // Calculate elapsed time in seconds

      $("#timer").text(timeValue); // Update the timer display
      $("#time").text(elapsedTime); // Update the timer display

      // Check if the desired time has passed (e.g., 100 seconds)
      if (elapsedTime >= timeValue) {
        console.log("You lose!");
        $("#winMessage").text("You lose!");
        clearInterval(timerInterval);
        clearInterval(powerUpMessageInterval);
      }
    }, 1000);
  };


  $("input[name='options']").on("change", function () {
    const difficulty = $(this).val();
    if (difficulty === "medium") {
      addExtraCards(3);
    } else if (difficulty === "hard") {
      addExtraCards(5);
    }
  });

  $(".card").on("click", function () {
    if ($(this).hasClass("matched") || $(this).hasClass("flip")) {
      // Clicked on a matched card or the same card twice, do nothing
      return;
    }
  });

  // Define the handleCardClick function
  const handleCardClick = function () {
    if ($(this).hasClass("matched") || $(this).hasClass("flip")) {
      // Clicked on a matched card or the same card twice, do nothing
      return;
    }

    $(this).toggleClass("flip");
    clicks++; // Increment the number of clicks

    let flippedCards = $(".card.flip");

    if (flippedCards.length === 2) {
      const firstCard = flippedCards.eq(0).find(".front_face")[0];
      const secondCard = flippedCards.eq(1).find(".front_face")[0];

      if (firstCard.src === secondCard.src) {
        console.log("match");
        flippedCards.addClass("matched");

        // Remove the back_face class from matched cards
        flippedCards.find(".back_face").removeClass("back_face");

        // Remove the back image from matched cards
        flippedCards.find(".back_face").attr("src", "");

        matches++; // Increment the number of pairs matched
        pairsLeft = totalPairs - matches; // Update the number of pairs left

        // Check if all cards matched
        if (matches === totalPairs) {
          console.log("You win!");
          $("#winMessage").text("You win!");
        }
      } else {
        console.log("no match");
        setTimeout(() => {
          flippedCards.removeClass("flip");
        }, 1000);
      }
    }

    // Check if more than two cards are flipped
    if (flippedCards.length > 2) {
      // Flip back all flipped cards except the current clicked card
      flippedCards.not(this).removeClass("flip");
    }

    // Update the header information for every individual click
    $("#total").text(totalPairs);
    $("#clicks").text(clicks);
    $("#left").text(pairsLeft);
    $("#matches").text(matches);
  };

  const flipAllCards = () => {
    $(".card").addClass("flip");

    setTimeout(() => {
      $(".card").removeClass("flip");
    }, 2000);
  };

  const startPowerUpMessage = () => {
    powerUpMessageInterval = setInterval(() => {
      alert("Power up activated!");

      // Display the power-up message using a popup or any other method you prefer

      // Flip all cards for one seconds
      flipAllCards();
    }, 500);
  };

  // Attach the handleCardClick function to the card click event
  $(".card").on("click", handleCardClick);

  $("#goldColorBtn").on("click", function () {
    $("#game_grid").toggleClass("gold-color");
  });

  $("#lightColorBtn").on("click", function () {
    $('#game_grid').removeClass("gold-color");
  });

  const difficulty = $('input[name="options"]:checked').val();
  if (difficulty === "medium") {
    addExtraCards(2);
  } else if (difficulty === "hard") {
    addExtraCards(4);
  }

  $("#reset").on("click", function () {
    resetGame();
    $("#start").show();
  });

  $("#start").show(); // Initially hide the Start button
};

const addExtraCards = (numCards) => {
  let extraCards = "";
  for (let i = 0; i < numCards; i++) {
    extraCards += `
      <div class="card extra-card">
        <img id="img${i + 7}" class="front_face" src="" alt="">
        <img class="back_face" src="back.webp" alt="">
      </div>
    `;
  }

  $("#game_grid").append(extraCards);

  //load extra cards' front face images
  loadPokemonImages();
};

const startPowerUpMessage = () => {
  powerUpMessageInterval = setInterval(() => {
    console.log("Power up activated!");
    // Display the power up message using a popup or any other method you prefer
  }, powerUpInterval * 1000);
};


const resetGame = () => {
  // Reset card flips
  $(".card").removeClass("flip");

  // Reset matched cards
  $(".card").removeClass("matched");

  // Enable click events on all cards
  $(".card").off("click").on("click", handleCardClick);

  // Reset variables
  firstCard = undefined;
  secondCard = undefined;
  powerUpActive = false;

  // Reset win message
  $("#winMessage").text("");

  // Reset timer (if applicable)
  clearInterval(timerInterval);
  clearInterval(powerUpMessageInterval);
  timerSeconds = 100;
  $("#timer").text(timerSeconds);

  // Remove extra cards (if present)
  $(".extra-card").remove();

  // Load new Pokemon images and shuffle cards
  loadPokemonImages();
  shuffleCards();
};

$(document).ready(() => {
  $("#game_grid").hide();
  $("#start").show();
});

$(document).ready(setup);