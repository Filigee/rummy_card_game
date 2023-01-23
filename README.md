# Single Player Rummy Card Game
This is a single player version of the card game 'Rummy' that I made to practise using Fetch APIs.

**Link to project:** https://filigee.github.io/rummy_card_game/

![Full Rummy](https://user-images.githubusercontent.com/121239324/214083928-2e4cb8c5-b9e9-49ae-8d7d-fe100c2ad37e.PNG)

## How It's Made:

**Tech used:** HTML, CSS, JavaScript

I made this game using the <a href="deckofcardsapi.com">deckofcardsapi.com</a> API. The player can start the game by clicking the "Start Game" button, a full hand of cards will be dealt from the deck and a turn pile card will be drawn. The player can then swap and draw cards until the cards remaining count reaches 0, at which point they will have to re-shuffle the turn pile back into the main deck using the "Re-shuffle"button. If they want to check if they have won the game they can click the "Rummy?!" button, if they have won the time taken to win will be returned along with a message in a h1 telling them they have won.

## Lessons Learned:

I came across a few challenges whilst making this game. One being that I didn't know how to implement the drag and swap feature, during the process of building that feature I learned a lot about that particular event listener and what it takes to implement that kind of functionality, which I would now feel comfortable adding to my future projects!

## Things I'd Change:

Towards the end of the project I felt that my code was becoming messy, so in the next iteration I would like to refactor the code and use less global variables. 

In a future iteration I'd like to build out a full 2-player multiplayer version of this game.
