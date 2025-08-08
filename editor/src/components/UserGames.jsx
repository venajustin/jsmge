import { useEffect, useState } from "react";
import '../css/userGames.css';
const UserGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with setTimeout
    setTimeout(() => {
      const dummyGames = [
        {
          title: "The Witcher 3: Wild Hunt",
          description: "An epic open-world RPG where you play as Geralt of Rivia, hunting monsters and making choices that shape the world.",
          image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.webp"
        },
        {
          title: "Cyberpunk 2077",
          description: "A futuristic open-world action RPG set in the dystopian Night City with cybernetic enhancements and corporate intrigue.",
          image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2lbd.webp"
        },
        {
          title: "Elden Ring",
          description: "A challenging action RPG from FromSoftware set in a vast fantasy world created by Hidetaka Miyazaki and George R.R. Martin.",
          image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.webp"
        },
        {
          title: "God of War",
          description: "Follow Kratos and his son Atreus on their journey through Norse mythology in this action-adventure masterpiece.",
          image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1tmu.webp"
        },
        {
          title: "Hades",
          description: "A rogue-like dungeon crawler where you play as Zagreus, son of Hades, attempting to escape the underworld.",
          image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2i57.webp"
        }
      ];

      setGames(dummyGames);
      setLoading(false);
    }, 1000);
  }, []);


  // Return the rendered JSX
  return (
    // Wrapper div with padding and dark background
    <div className="mainBody">
      <h1>User Games</h1>
      {
        // Conditional rendering: if still loading
        loading ? (
            // Show loading message
            <p>Loading...</p>
          ) :
          // If not loading and no games found
          games.length === 0 ? (
            // Show no games message
            <p>No games found.</p>
          ) : (
            // If games are present, render a list
            <ul className="games-list">
              {
                games.map((game, index) => (
                  <li key={index} className="game-item">
                    <img src={game.image} alt={game.title} className="game-image"/>
                    <div className="game-info">
                      <h3 className="game-title">{game.title}</h3>
                      <p className="game-description">{game.description}</p>
                    </div>
                  </li>
                ))
              }
            </ul>
          )
      }
    </div>
  );
};

// Export the UserGames component for use elsewhere
export default UserGames;
