# iamjimui.github.io
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Valentine Letter</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="./assets/css/valentine.css" />
    <title>Valentine Letter</title>
  </head>
  <body>
    <audio id="song" autoplay="true" src="./assets/sounds/song.mp3"></audio>
    <audio id="popsound" src="./assets/sounds/popsound.mp3"></audio>
    <div id="envelope-container">
      <img src="./assets/images/envelope.png" alt="Envelope" id="envelope" />
      <p>Letter for You</p>
    </div>
    <div id="letter-container">
      <div class="letter-window">
        
        <div id="letter-content">
          <div id="letter-body">
            <div class="no-wrapper" style="margin-top: 15vh;">
              <img src="./assets/images/maltesedogcheerup.gif" class="dog" id="letter-dog" />
            </div>
            
            <h1 id="letter-title">Will you be my Valentine?</h1>

            <div class="buttons" id="letter-buttons">
              <div class="no-wrapper">
                <img src="./assets/images/yes.png" class="btn yes-btn" alt="Yes" />
              </div>

              <div class="no-wrapper">
                <img src="./assets/images/no.png" class="btn no-btn" alt="No" />
              </div>
            </div>

            <p id="final-text" class="final-text" style="display: none">
              <strong>Valentine Date:</strong> Meow Restaurant at 1pm for some dumplings
            </p>
          </div>
        </div>
      </div>
    </div>
    <script src="./assets/js/script.js"></script>
  </body>
</html>