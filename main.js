let deck_id
let card_array = document.querySelectorAll(".card")
let cards_remaining = document.getElementById("cards-remaining")

// When start game button clicked, new deck create and 7 cards drawn

document.getElementById("start_game").addEventListener("click", startGame)
document.getElementById("check_win").addEventListener("click", checkWin)

// Check win conditions

function checkWin(){
    // Win conditions: 
    // 3 x same card, 4 x same card
    // 3 x same card, 4 x run of same suit
    // 3 x run of same suit, 4 x same card
    // 3 x run of same ruit, 4 x run of same suit

    // ------------ FIX THIS -----------------
    // What happens if low run of 4 and high run of 3? Code doesn't work out because of the split...

    let firstThree = [...document.querySelectorAll(".card")]
    const lastFour = firstThree.splice(3)

    firstThree.sort((a, b) => a.data_value - b.data_value)
    lastFour.sort((a, b) => a.data_value - b.data_value)

    console.log(firstThree)
    console.log(lastFour)
    
    function winConditionSameCard(array){
        for(let i = 0; i < array.length - 1; i++){
            if(array[i].data_value != array[i+1].data_value){
                return false
            }
        }
        return true
    }

    function winConditionRun(array){
        for(let i = 0; i < array.length - 1; i++){
            if(array[i].data_value + 1 != array[i+1].data_value || array[i].data_suit != array[i+1].data_suit){
                return false
            }
        }
        return true
    }

    if((winConditionSameCard(firstThree) || winConditionRun(firstThree)) && (winConditionSameCard(lastFour) || winConditionRun(lastFour)))
    {
        console.log("You win")
    }
    else
    {
        console.log("You lose")
    }
}

// Helper function to convert the value of face cards to numeric values

function convertCardValues(card){
    if(card == "ACE")
        return 1
    else if(card == "JACK")
        return 11
    else if(card == "QUEEN")
        return 12
    else if(card == "KING")
        return 13
    else 
        return Number(card)
}

// Deal cards at start of game, set deck_id

function startGame(){
    fetch("https://www.deckofcardsapi.com/api/deck/new/draw/?count=7")
    .then(response => response.json())
    .then(data => {
        console.log(data)
        for(let i = 0; i < data.cards.length; i++){
            card_array[i].src = data.cards[i].image
            card_array[i].data_value = convertCardValues(data.cards[i].value)
            card_array[i].data_suit = data.cards[i].suit
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


