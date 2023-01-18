let deck_id
let turn_pile_deck_id = "turn_pile"
let card_array = [...document.querySelectorAll(".card")]
let cards_remaining = document.getElementById("cards-remaining")
let turn_pile = document.getElementById("turn-pile")
let current_cards_hand = 0
let current_cards_remaining 
let startTimer


card_array.push(document.querySelector(".draw_card"))
card_array[card_array.length - 1].classList.add("card")


document.getElementById("start_game").addEventListener("click", startGame)
document.getElementById("check_win").addEventListener("click", checkWin)
document.getElementById("deck").addEventListener("click", () => {
    drawCard(document.querySelector(".draw_card"))
})
document.querySelector(".draw_card").addEventListener("click", addToTurnPile)
document.getElementById("turn-pile").addEventListener("click", drawCardTurnPile)
document.getElementById("re-shuffle").addEventListener("click", reShuffle)

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
        startTimer = setInterval(timer, 1000)
    })
}

// Draw a card from the deck

function drawCard(deck){
    if(current_cards_hand == 8 || current_cards_remaining == 0){
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
        current_cards_remaining = data.remaining
    })
}

// Create turn pile and add to turn pile
function turnPile(card_code){
    fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/pile/${turn_pile_deck_id}/add/?cards=${card_code}`)
    .then(response => response.json())
    
}

function turnPileDraw(){
    fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/pile/${turn_pile_deck_id}/draw/?count=1 `)
    .then(response => response.json())
}

// Return cards from the turn pile to the main deck and shuffle them
function reShuffle(){
    if(current_cards_remaining != 0){
        return
    }

    fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/pile/${turn_pile_deck_id}/shuffle/`)
    .then(response => response.json())
    .then(data => console.log("Shuffled"))

    fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/pile/${turn_pile_deck_id}/return/`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        current_cards_remaining = data.remaining
        cards_remaining.innerText = "Cards left: " + data.remaining
        turn_pile.src = ""
        turn_pile.data_value = ""
        turn_pile.data_suit = ""
        turn_pile.data_code = ""
        drawCard(turn_pile)
    })

    
}

// ----------- FETCH GET REQUESTS END ---------------

// Check win conditions

function checkWin(){
    // Win conditions: 
    // 3 x same card, 4 x same card
    // 3 x same card, 4 x run of same suit
    // 3 x run of same suit, 4 x same card
    // 3 x run of same ruit, 4 x run of same suit

    // ------------ FIX THIS -----------------
    // What happens if low run of 4 and high run of 3? Code doesn't work out because of the split...
    if(current_cards_hand == 0){
        return
    }

    let firstThree = [...document.querySelectorAll(".card")].filter(card => !card.className.includes("draw_card"))
    const lastFour = firstThree.splice(3)

    firstThree.sort((a, b) => a.data_value - b.data_value)
    lastFour.sort((a, b) => a.data_value - b.data_value)

    
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
        let time = document.getElementById("timer").innerText
        document.getElementById("win-loss-state").innerText = `You Win! Your time was ${time}`
        clearInterval(startTimer)
        seconds = 0
        minutes = 0
    }
    else
    {
        document.getElementById("win-loss-state").innerText = "You haven't won just yet..."
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

// ----------- DRAG AND SWAP CARD POSITIONS ------------------

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

// ----------- DRAG AND SWAP CARD POSITIONS END ------------------

function addToTurnPile(){
    if(current_cards_hand != 8){
        return
    }
    const current_draw_card = document.querySelector(".draw_card")
    
    turnPile(current_draw_card.data_code)
    turnPileAndDrawCardSwap(turn_pile, current_draw_card)
    
    current_cards_hand -= 1

}

function drawCardTurnPile(){
    if(current_cards_hand == 8){
        return
    }

    const current_turn_pile = document.getElementById("turn-pile")
    turnPileDraw()
    turnPileAndDrawCardSwap(document.querySelector(".draw_card"), current_turn_pile)

    current_cards_hand += 1

}

// Helper function for turn pile and draw card swap

function turnPileAndDrawCardSwap(card_new_location, card_to_move){
    card_new_location.src = card_to_move.src
    card_new_location.data_value = card_to_move.data_value
    card_new_location.data_suit = card_to_move.data_suit
    card_new_location.data_code = card_to_move.data_code

    card_to_move.src = ""
    card_to_move.data_value = ""
    card_to_move.data_suit = ""
    card_to_move.data_code = ""
}

let seconds = 0
let minutes = 0
function timer(){
    seconds++

    if(seconds >= 60){
        seconds = 0
        minutes++ 
    }

    if(seconds >= 10 && minutes >= 10){
        document.getElementById("timer").innerHTML = `${minutes}:${seconds}`
    }
    else if(seconds >= 10 && minutes < 10){
        document.getElementById("timer").innerHTML = `0${minutes}:${seconds}`
    }
    else if(seconds < 10 && minutes >= 10){
        document.getElementById("timer").innerHTML = `${minutes}:0${seconds}`
    }
    else{
        document.getElementById("timer").innerHTML = `0${minutes}:0${seconds}`
    }

}





