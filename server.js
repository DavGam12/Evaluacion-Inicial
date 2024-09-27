/* NODE JS */

const port = 3000;
const express = require('express')
const server = express()

/* example */
/*server.get('/products', (req, res) => {
    const products = [
        { id: 1, name: 'hammer' },
        { id: 2, name: 'screwdriver' },
        { id: 3, name: 'wrench' }
    ]
    res.json(products)
})*/


let categoriesData
let eventsData
let currentLocData

const fetchData = async() => {
  const coor = '41.669841685814625, -0.8788074741911481'

  const categoriesURL = "https://eonet.gsfc.nasa.gov/api/v3/categories"
  const eventURL = "https://eonet.gsfc.nasa.gov/api/v3/events"
  const weatherURL = `https://api.weatherapi.com/v1/current.json?key=3212cc342f1b43fe9ab184207242509%20&q=${coor}`

  const [ categoriesRes, eventsRes, weatherRes ] = await Promise.all([fetch(categoriesURL), fetch(eventURL), fetch(weatherURL)])

  categoriesData = await categoriesRes.json()
  eventsData = await eventsRes.json()
  currentLocData = await weatherRes.json()

}

fetchData()


server.get('/', (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  res.json({
    'events': eventsData,
    'categories': categoriesData,
    'weather': currentLocData
  })

  console.log('General Data Loaded');
})

server.get('/events', (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  res.json(eventsData)
})
server.get('/categories', (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  res.json(categoriesData)
})
server.get('/weather/coor', async(req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");


  const coor = req.params.coor
  const weatherURL = `https://api.weatherapi.com/v1/current.json?key=3212cc342f1b43fe9ab184207242509%20&q=${coor}`
  const weatherRes = await fetch(weatherURL)
  currentLocData = await weatherRes.json()

  res.json(currentLocData)
})




server.listen(port, () => console.log(`Listening on port ${port}! http://localhost:${port}/`))