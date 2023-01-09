let deck_id
let card_array = document.querySelectorAll(".card")
let cards_remaining = document.getElementById("cards-remaining")

// When start game button clicked, new deck create and 7 cards drawn
document.getElementById('start_game').addEventListener('click', startGame)

// Deal cards at start of game, set deck_id

function startGame(){
    fetch("https://www.deckofcardsapi.com/api/deck/new/draw/?count=7")
    .then(response => response.json())
    .then(data => {
        console.log(data)
        for(let i = 0; i < data.cards.length; i++){
            card_array[i].src = data.cards[i].image
            card_array[i].data_value = data.cards[i].value
            console.log(card_array[i].data_value)
        }
        deck_id = data.deck_id
        cards_remaining.innerText = "Cards left: " + data.remaining
    })
}

// Dragging and swapping card positions

card_array.forEach(card => {
    card.addEventListener("dragstart", dragStart)
    card.addEventListener("dragover", dragOver)
    card.addEventListener("drop", drop)
})

function dragStart(e){
    e.dataTransfer.setData("text", e.target.id)
}

function dragOver(e){
    e.preventDefault()
}

function drop(e){
    const id = e.dataTransfer.getData("text")
    const cards = document.querySelector(".cards")
    const firstCard = document.getElementById(id)
    const secondCard = e.target
    const nodeList = document.querySelector(".cards").childNodes
    let firstCardPosition = 0

    for(let i = 0; i < nodeList.length; i++){
        if(nodeList[i].id == id){
            firstCardPosition = i
        }
    }

    cards.replaceChild(firstCard, secondCard)
    cards.insertBefore(secondCard, nodeList[firstCardPosition])
}


