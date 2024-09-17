// Load the pre-trained model (MobileNet)
async function loadModel() {
    const model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
    return model;
  }

  // Function to classify the uploaded image
  async function classifyImage() {
    const model = await loadModel();
    const imageElement = document.getElementById('uploaded-image');
    const tensor = tf.browser.fromPixels(imageElement).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
    const predictions = await model.predict(tensor).data();
    const topPrediction = Array.from(predictions).indexOf(Math.max(...predictions));
    
    document.getElementById('prediction').innerText = `Prediction: Class ${topPrediction}`;
  }

  // Event listener for image upload
  document.getElementById('image-upload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function () {
      const img = new Image();
      img.src = reader.result;
      img.id = 'uploaded-image';
      document.body.appendChild(img);
      classifyImage();
    };
    reader.readAsDataURL(file);
  });


  const colorThief = new ColorThief();

  // Function to generate color palette
  function generatePalette(imageElement) {
    const palette = colorThief.getPalette(imageElement, 5); // Get the top 5 dominant colors
    const paletteContainer = document.getElementById('palette-container');
    paletteContainer.innerHTML = ''; // Clear previous palette

    // Display the palette
    palette.forEach(color => {
      const colorBox = document.createElement('div');
      colorBox.className = 'color-box';
      colorBox.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      paletteContainer.appendChild(colorBox);
    });
  }

  // Event listener for image upload
  document.getElementById('image-upload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function () {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        document.getElementById('image-container').innerHTML = ''; // Clear previous image
        document.getElementById('image-container').appendChild(img);
        generatePalette(img); // Generate color palette when image loads
      };
    };
    reader.readAsDataURL(file);
  });