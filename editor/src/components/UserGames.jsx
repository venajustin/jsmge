import { useEffect, useState } from "react";
import '../css/userGames.css';
const UserGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const[showPopup, setShowPopup] = useState(false);

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
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co7497.webp"
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
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co39vc.webp"
  },
  {
    title: "Red Dead Redemption 2",
    description: "An immersive western epic following Arthur Morgan and the Van der Linde gang in 1899 America.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.webp"
  },
  {
    title: "The Last of Us Part II",
    description: "A post-apocalyptic survival game following Ellie's journey of revenge in a world overrun by infected.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5ziw.webp"
  },
  {
    title: "Horizon Zero Dawn",
    description: "Explore a beautiful post-apocalyptic world where robotic creatures roam and humanity lives in tribal societies.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2una.webp"
  },
  {
    title: "Spider-Man: Miles Morales",
    description: "Swing through New York City as Miles Morales discovers his unique spider powers in this action-adventure game.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2dwe.webp"
  },
  {
    title: "Assassin's Creed Valhalla",
    description: "Lead raids as Eivor, a Viking warrior, and build your settlement in 9th century England.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2ed3.webp"
  },
  {
    title: "Ghost of Tsushima",
    description: "Honor dies at the edge of a katana in this samurai adventure set during the Mongol invasion of Japan.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2crj.webp"
  },
  {
    title: "Doom Eternal",
    description: "Rip and tear through demons in this fast-paced first-person shooter sequel to the 2016 Doom reboot.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co3p5n.webp"
  },
  {
    title: "Animal Crossing: New Horizons",
    description: "Create your perfect island paradise in this relaxing life simulation game featuring adorable animal villagers.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co3wls.webp"
  },
  {
    title: "Minecraft",
    description: "Build, explore, and survive in this iconic sandbox game with infinite possibilities and creative freedom.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co8fu7.webp"
  }
];

      //setGames(dummyGames);
      setLoading(false);
    }, 1000);
  }, []);

   const handlePlay = (game) => {
    console.log(`Playing ${game.title}`);
    // TODO: add play logic
  };

   const handleEdit = (game) => {
    console.log(`Editing ${game.title}`);
    // TODO:Add edit logic
  };

    const handleCreate = () => {
      console.log("Create button pressed");
      setShowPopup(!showPopup);
      
    }
    const handleClosePopup = () => {
      setShowPopup(false);
    }
  // Return the rendered JSX
  return (
    <div className="mainBody">
      <div className="title-container">
        <h1>Your Games</h1>
        <button className="create-game-button" onClick={handleCreate}>
          Create Game
        </button>
      </div>
      {
        // Conditional rendering: if still loading
        loading ? (
            <p style={{display: 'flex', justifyContent: 'center', }}>Loading...</p>
          ) :
          games.length === 0 ? (
            <p style={{display: 'flex', justifyContent: 'center', }}>No games found.</p>
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
                    <div className="game-buttons">
                      <button
                        className="play-button"
                        onClick={() => handlePlay(game)}
                      >
                        Play
                      </button>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(game)}
                      >
                        Edit
                      </button>
                    </div>
                  </li>
                ))
              }
            </ul>
          )
      }
      {showPopup && (
        <div className="popup-overlay">
          <div className="createBody">
            <h2 style={{display:'flex', justifyContent: "center"}}>Create New Game</h2>
            <form>
              <input
                type="text"
                placeholder="Game Title"
                style={{
                  width: "90%",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <textarea
                placeholder="Game Description"
                style={{
                  width: "90%",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="text"
                placeholder="Image URL"
                style={{
                  width: "90%",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Add Game
                </button>
                <button
                  type="button"
                  onClick={handleClosePopup}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#ccc",
                    color: "black",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

      )}
    </div>
  );
};

export default UserGames;
