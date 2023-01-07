let deck_id

// Variables to store each card's image slot in HTML
let card_one = document.getElementById("one")
let card_two = document.getElementById("two")
let card_three = document.getElementById("three")
let card_four = document.getElementById("four")
let card_five = document.getElementById("five")
let card_six = document.getElementById("six")
let card_seven = document.getElementById("seven")

// Array of card variables
let cards_array = [card_one, card_two, card_three, card_four, card_five, card_six, card_seven]

// When start game button clicked, new deck create and 7 cards drawn
document.getElementById('start_game').addEventListener('click', startGame)

function startGame(){
    fetch("https://www.deckofcardsapi.com/api/deck/new/draw/?count=7")
    .then(response => response.json())
    .then(data => {
        console.log(data)
        for(let i = 0; i < data.cards.length; i++){
            cards_array[i].src = data.cards[i].image
        }
        deck_id = data.deck_id
        console.log(deck_id)
    })
}