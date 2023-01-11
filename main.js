let deck_id
let turn_pile_deck_id = "turn_pile"
let card_array = [...document.querySelectorAll(".card")]
let cards_remaining = document.getElementById("cards-remaining")
let turn_pile = document.getElementById("turn-pile")
let current_cards_hand = 0

card_array.push(document.querySelector(".draw_card"))
card_array[card_array.length - 1].classList.add("card")


document.getElementById("start_game").addEventListener("click", startGame)
document.getElementById("check_win").addEventListener("click", checkWin)
document.getElementById("deck").addEventListener("click", () => {
    drawCard(document.querySelector(".draw_card"))
})
document.querySelector(".draw_card").addEventListener("click", addToTurnPile)

// -------- FETCH GET REQUESTS ------------

// Deal cards at start of game, set deck_id

function startGame(){
    fetch("https://www.deckofcardsapi.com/api/deck/new/draw/?count=7")
    .then(response => response.json())
    .then(data => {
        for(let i = 0; i < data.cards.length; i++){
            card_array[i].src = data.cards[i].image
            card_array[i].data_value = convertCardValues(data.cards[i].value)
            card_array[i].data_suit = data.cards[i].suit
            card_array[i].data_code = data.cards[i].code
        }
        current_cards_hand = 7
        deck_id = data.deck_id
        cards_remaining.innerText = "Cards left: " + data.remaining
        drawCard(turn_pile)
    })
}

// Draw a card from the deck

function drawCard(deck){
    if(current_cards_hand == 8){
        return
    }
    fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`)
    .then(response => response.json())
    .then(data => {
        if(deck == turn_pile){
            turnPile(data.cards[0].code)
        }
        else{
            current_cards_hand += 1
        }
        deck.src = data.cards[0].image
        deck.data_value = convertCardValues(data.cards[0].value)
        deck.data_suit = data.cards[0].suit
        deck.data_code = data.cards[0].code
        cards_remaining.innerText = "Cards left: " + data.remaining
    })
}

// Create turn pile and add to turn pile
function turnPile(card_code){
    fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/pile/${turn_pile_deck_id}/add/?cards=${card_code}`)
    .then(response => response.json())
    
}

// Check win conditions

function checkWin(){
    // Win conditions: 
    // 3 x same card, 4 x same card
    // 3 x same card, 4 x run of same suit
    // 3 x run of same suit, 4 x same card
    // 3 x run of same ruit, 4 x run of same suit

    // ------------ FIX THIS -----------------
    // What happens if low run of 4 and high run of 3? Code doesn't work out because of the split...

    let firstThree = [...document.querySelectorAll(".card")].filter(card => !card.className.includes("draw_card"))
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

    if(current_cards_hand != 8 && (firstCard.className.includes("draw_card") || secondCard.className.includes("draw_card"))){
        return
    }

    let firstCardPosition = 0

    for(let i = 0; i < nodeList.length; i++){
        if(nodeList[i].id == id){
            firstCardPosition = i
        }
    }

    if(firstCard.className.includes("draw_card")){
        firstCard.classList.remove("draw_card")
        firstCard.classList.add("cards--colour")
        firstCard.removeEventListener("click", addToTurnPile)

        secondCard.classList.remove("cards--colour")
        secondCard.classList.add("draw_card")
        secondCard.addEventListener("click", addToTurnPile)
    }
    else if(secondCard.className.includes("draw_card")){
        firstCard.classList.add("draw_card")
        firstCard.classList.remove("cards--colour")
        firstCard.addEventListener("click", addToTurnPile)

        secondCard.classList.add("cards--colour")
        secondCard.classList.remove("draw_card")
        secondCard.removeEventListener("click", addToTurnPile)
    }

    cards.replaceChild(firstCard, secondCard)
    cards.insertBefore(secondCard, nodeList[firstCardPosition])
}

function addToTurnPile(){
    if(current_cards_hand != 8){
        return
    }
    const draw_card = document.querySelector(".draw_card")
    
    turnPile(draw_card.data_code)
    turn_pile.src = draw_card.src
    turn_pile.data_value = draw_card.data_value
    turn_pile.data_suit = draw_card.data_suit
    turn_pile.data_code = draw_card.data_code

    document.querySelector(".draw_card").src = ""
    document.querySelector(".draw_card").data_value = ""
    document.querySelector(".draw_card").data_suit = ""
    document.querySelector(".draw_card").data_code = ""

    current_cards_hand -= 1

}





