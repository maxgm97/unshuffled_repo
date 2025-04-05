'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

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
    const [deck] = useState<string[]>(generateDeck());
    const [shuffledDeck, setShuffledDeck] = useState<string[]>([]);
    //const [history, setHistory] = useState<string[]>([]);
    const [shuffleCount, setShuffleCount] = useState<number | null>(null);
    
    useEffect(() => {
        axios.get('https://api.unshuffled.net/api/shuffles/count')
          .then(response => setShuffleCount(response.data.count))
          .catch(error => console.error('Error fetching shuffle count:', error));
      }, []);

    const handleShuffle = () => {
        const newShuffle = shuffleDeck(deck);
        //setDeck(newShuffle);  // This updates the deck state
        setShuffledDeck(newShuffle);
        
        
        axios.post('https://api.unshuffled.net/api/shuffles', { shuffleData: newShuffle })
            //.then(response => setHistory(response.data.history))
            //.catch(error => console.error('Error saving shuffle:', error))
            ;
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Virtual Card Shuffle</h1>
            <p>Total shuffles saved: {shuffleCount !== null ? shuffleCount : 'Loading...'}</p>
            <button onClick={handleShuffle}>Shuffle Deck</button>
            <div style={{ marginTop: '20px' }}>
                {shuffledDeck.map((card, index) => (
                    <div key={index}>{card}</div>
                ))}
            </div>
        </div>
    );
}