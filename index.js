import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Convergent Car Dealership</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.22.5/babel.min.js"></script>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #dfe7e5;
            color: #384b5a;
            font-family: Arial, sans-serif;
          }

          .header {
            background-color: #384b5a;
            color: white;
            padding: 20px;
          }

          .controls {
            max-width: 1200px;
            margin: 20px auto;
            padding: 0 20px;
            display: flex;
            gap: 20px;
            align-items: center;
          }

          .search-input {
            padding: 10px;
            border: 2px solid #00bfeb;
            border-radius: 4px;
            width: 300px;
            font-size: 16px;
            color: #384b5a;
          }

          .sort-select {
            padding: 10px;
            border: 2px solid #00bfeb;
            border-radius: 4px;
            font-size: 16px;
            color: #384b5a;
            background: white;
            cursor: pointer;
          }

          .car-grid { 
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
          }

          .car-card {
            background: white;
            border: none;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(56, 75, 90, 0.1);
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
          }

          .car-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 8px rgba(56, 75, 90, 0.2);
          }

          .car-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 4px;
          }

          .price {
            color: #00bfeb;
            font-size: 24px;
            font-weight: bold;
          }

          .detail-view {
            background: white;
            padding: 30px;
            max-width: 1000px;
            margin: 20px auto;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(56, 75, 90, 0.1);
          }

          .back-button {
            padding: 10px 20px;
            background: #00bfeb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-bottom: 20px;
            font-size: 16px;
            transition: background-color 0.2s;
          }

          .back-button:hover {
            background: #0095b8;
          }

          .specs-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
            background: #dfe7e5;
            padding: 20px;
            border-radius: 8px;
          }

          .spec-item {
            background: white;
            padding: 10px;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel">
          function CarDealership() {
            const [cars, setCars] = React.useState([]);
            const [selectedCar, setSelectedCar] = React.useState(null);
            const [searchTerm, setSearchTerm] = React.useState('');
            const [sortOrder, setSortOrder] = React.useState('asc');

            React.useEffect(() => {
              fetchCars(sortOrder);
            }, [sortOrder]);

            const fetchCars = async (direction) => {
              try {
                const response = await fetch('/cars/sort?key=price&direction=' + direction);
                const data = await response.json();
                setCars(data);
              } catch (err) {
                console.error('Error fetching cars:', err);
              }
            };

            const showCarDetail = (id) => {
              fetch('/car/' + id)
                .then(res => res.json())
                .then(car => setSelectedCar(car))
                .catch(err => console.error('Error fetching car details:', err));
            };

            const filteredCars = cars.filter(car => {
              const searchString = car.make + ' ' + car.model + ' ' + car.year;
              return searchString.toLowerCase().includes(searchTerm.toLowerCase());
            });

            if (selectedCar) {
              return React.createElement(React.Fragment, null,
                React.createElement("div", { className: "header" },
                  React.createElement("h1", null, "Convergent Car Dealership 🚗")
                ),
                React.createElement("div", { className: "detail-view" },
                  React.createElement("button", { 
                    className: "back-button", 
                    onClick: () => setSelectedCar(null)
                  }, "← Back to Listings"),
                  React.createElement("img", {
                    src: selectedCar.image,
                    alt: selectedCar.make + ' ' + selectedCar.model,
                    style: { width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }
                  }),
                  React.createElement("h2", null, selectedCar.make + " " + selectedCar.model),
                  React.createElement("p", { className: "price" }, "$" + selectedCar.price.toLocaleString()),
                  React.createElement("div", { className: "specs-grid" },
                    React.createElement("div", { className: "spec-item" },
                      React.createElement("strong", null, "Year: "), selectedCar.year
                    ),
                    React.createElement("div", { className: "spec-item" },
                      React.createElement("strong", null, "Mileage: "), selectedCar.mileage.toLocaleString()
                    ),
                    React.createElement("div", { className: "spec-item" },
                      React.createElement("strong", null, "Condition: "), selectedCar.condition
                    ),
                    React.createElement("div", { className: "spec-item" },
                      React.createElement("strong", null, "Fuel Type: "), selectedCar.fuel_type
                    ),
                    React.createElement("div", { className: "spec-item" },
                      React.createElement("strong", null, "Transmission: "), selectedCar.transmission
                    ),
                    React.createElement("div", { className: "spec-item" },
                      React.createElement("strong", null, "Color: "), selectedCar.color
                    )
                  ),
                  React.createElement("p", null,
                    React.createElement("strong", null, "VIN: "), selectedCar.vin
                  ),
                  React.createElement("p", { style: { lineHeight: '1.6' } }, selectedCar.description)
                )
              );
            }

            return React.createElement(React.Fragment, null,
              React.createElement("div", { className: "header" },
                React.createElement("h1", null, "Convergent Car Dealership 🚗")
              ),
              React.createElement("div", { className: "controls" },
                React.createElement("input", {
                  type: "text",
                  placeholder: "Search cars...",
                  className: "search-input",
                  value: searchTerm,
                  onChange: (e) => setSearchTerm(e.target.value)
                }),
                React.createElement("select", {
                  className: "sort-select",
                  value: sortOrder,
                  onChange: (e) => setSortOrder(e.target.value)
                },
                  React.createElement("option", { value: "asc" }, "Price: Low to High"),
                  React.createElement("option", { value: "desc" }, "Price: High to Low")
                )
              ),
              React.createElement("div", { className: "car-grid" },
                filteredCars.map(car => 
                  React.createElement("div", {
                    key: car.id,
                    className: "car-card",
                    onClick: () => showCarDetail(car.id)
                  },
                    React.createElement("img", {
                      src: car.image,
                      alt: car.make + ' ' + car.model,
                      className: "car-image"
                    }),
                    React.createElement("h3", null, car.make + " " + car.model),
                    React.createElement("p", null, car.year),
                    React.createElement("p", { className: "price" }, "$" + car.price.toLocaleString())
                  )
                )
              )
            );
          }

          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(React.createElement(CarDealership));
        </script>
      </body>
    </html>
  `);
});

app.get('/cars/sort', async (req, res) => {
  try {
    const direction = req.query.direction || 'asc';
    const key = req.query.key || 'price';
    const response = await fetch('https://dealership.naman.zip/cars/sort?key=' + key + '&direction=' + direction);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

app.get('/car/:id', async (req, res) => {
  try {
    const response = await fetch('https://dealership.naman.zip/car/' + req.params.id);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch car details' });
  }
});

app.listen(port, () => {
  console.log('Server running at http://localhost:' + port);
});