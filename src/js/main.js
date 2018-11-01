// add to favorite
let products = document.querySelectorAll('.product__item')

products.forEach(item => {
  let id = item.querySelector('.product__id').innerHTML
  let favButton = item.querySelector('.product__favorite')
  favButton.addEventListener('click', () => {
    query(id)
  })
})

const query = (id) => {
  fetch(`https://react-handbook-e1877.firebaseio.com/test/${id}.json`)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error.code, error.message))
}

// filter
const filterItems = document.querySelectorAll('.filter__item')
const filterReset = document.querySelector('.filter__reset')
const filterShowResult = document.querySelector('.filter__show-result')

// fiter reset
const resetFilter = () => {
  filterItems.forEach(item => {
    item.querySelector('.filter__checkbox').checked = false
  })
}

filterReset.addEventListener('click', resetFilter)

// filter apply
const filterApply = () => {
  let filterData = []
  filterItems.forEach(item => {
    let brand = item.querySelector('span').innerText
    let checked = item.querySelector('.filter__checkbox').checked
    
    checked
      ? filterData.push(brand)
      : null
  })
  fetch('https://react-handbook-e1877.firebaseio.com/test', {
      method: 'post',
      body: filterData
    })
    .then(response => console.log(response))
    .catch(error => console.error(error.code, error.message))
}

filterShowResult.addEventListener('click', filterApply)