'use client'
//commenting to update commit
import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const generateDeck = (): string[] => {
    return suits.flatMap(suit => ranks.map(rank => `${rank} of ${suit}`));
};

const shuffleDeck = (deck: string[]): string[] => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export default function ShufflePage() {
    //const [deck, setDeck] = useState<string[]>(generateDeck());
    //const [deck] = useState<string[]>(generateDeck());
    const [shuffledDeck, setShuffledDeck] = useState<string[]>([]);
    //const [history, setHistory] = useState<string[]>([]);
    const [shuffleCount, setShuffleCount] = useState<number | null>(null);
    const [email, setEmail] = useState<string>('');
    const [isEmailEntered, setIsEmailEntered] = useState<boolean>(false);
    
    const fetchShuffleCount = async () => {
        try {
          const response = await axios.get('https://api.unshuffled.net/api/shuffles/count');
          setShuffleCount(response.data.count);
        } catch (error) {
          console.error('Error fetching shuffle count:', error);
        }
      };

    //old useeffect code?
    /*
    useEffect(() => {
        axios.get('https://api.unshuffled.net/api/shuffles/count')
          .then(response => {
            setShuffleCount(response.data.count);
          })
          .catch(error => {
            console.error('Error fetching shuffle count:', error);
          });
      }, []);
    */

    useEffect(() => {
        fetchShuffleCount();
    }, []);
    

    const handleShuffle = async () => {
        const deck = generateDeck()
        const newShuffle = shuffleDeck(deck);
        //setDeck(newShuffle);  // This updates the deck state
        setShuffledDeck(newShuffle);

        if (isEmailEntered) {
            try {
                await axios.post('https://api.unshuffled.net/api/shuffles', { shuffle: newShuffle, email });
                fetchShuffleCount(); // update count after posting
            } catch (error) {
                console.error('Error saving shuffle:', error);
            }
        } else {
            alert("Please enter your username to shuffle the deck.")
        }
    };
        /*
        axios.post('https://api.unshuffled.net/api/shuffles', { shuffleData: newShuffle })
            //.then(response => setHistory(response.data.history))
            //.catch(error => console.error('Error saving shuffle:', error))
            ;
        */

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };
    
    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsEmailEntered(true);
        } else {
        alert('Please enter a username');
        }
    };
    
    // card images
    const cardNameToFilename = (card: string): string => {
        const [rank, , suit] = card.split(' ');
        const suitInitials: Record<string, string> = {
          Hearts: 'H',
          Diamonds: 'D',
          Clubs: 'C',
          Spades: 'S',
        };
        return `/images/${rank}${suitInitials[suit]}.png`;
      };
    
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h1 className="title">Virtual Card Shuffle</h1>
          <p className="count">Total shuffles saved: {shuffleCount !== null ? shuffleCount : 'Loading...'}</p>
          
          {!isEmailEntered && (
            <div className="email-prompt">
              <h2>Enter your username to shuffle</h2>
              <form onSubmit={handleEmailSubmit}>
                <input
                  type="text"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your username: "
                  required
                  style={{ padding: '10px', margin: '10px', fontSize: '16px' }}
                />
                <button type="submit" className="submit-email-btn" style={{ padding: '10px', fontSize: '16px' }}>
                  Submit
                </button>
              </form>
            </div>
          )}
    
          {isEmailEntered && (
            <button onClick={handleShuffle} className="shuffle-button">
              Shuffle Deck
            </button>
          )}
    
          <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {shuffledDeck.map((card, index) => (
              <img
                key={index}
                src={cardNameToFilename(card)}
                alt={card}
                style={{ width: '75px', height: 'auto', margin: '5px' }}
              />
            ))}
          </div>
        </div>
      );;
}