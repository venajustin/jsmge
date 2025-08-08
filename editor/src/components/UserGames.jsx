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
  },
  {
    title: "Red Dead Redemption 2",
    description: "An immersive western epic following Arthur Morgan and the Van der Linde gang in 1899 America.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.webp"
  },
  {
    title: "The Last of Us Part II",
    description: "A post-apocalyptic survival game following Ellie's journey of revenge in a world overrun by infected.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2s3v.webp"
  },
  {
    title: "Horizon Zero Dawn",
    description: "Explore a beautiful post-apocalyptic world where robotic creatures roam and humanity lives in tribal societies.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2d0z.webp"
  },
  {
    title: "Spider-Man: Miles Morales",
    description: "Swing through New York City as Miles Morales discovers his unique spider powers in this action-adventure game.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2lcy.webp"
  },
  {
    title: "Assassin's Creed Valhalla",
    description: "Lead raids as Eivor, a Viking warrior, and build your settlement in 9th century England.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2a7r.webp"
  },
  {
    title: "Ghost of Tsushima",
    description: "Honor dies at the edge of a katana in this samurai adventure set during the Mongol invasion of Japan.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2132.webp"
  },
  {
    title: "Doom Eternal",
    description: "Rip and tear through demons in this fast-paced first-person shooter sequel to the 2016 Doom reboot.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1tg4.webp"
  },
  {
    title: "Animal Crossing: New Horizons",
    description: "Create your perfect island paradise in this relaxing life simulation game featuring adorable animal villagers.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1njr.webp"
  },
  {
    title: "Minecraft",
    description: "Build, explore, and survive in this iconic sandbox game with infinite possibilities and creative freedom.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co49wj.webp"
  },
  {
    title: "Among Us",
    description: "Work together to complete tasks on a spaceship while trying to identify the imposters among your crew.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r0n.webp"
  },
  {
    title: "Fall Guys",
    description: "Compete with dozens of other players in wacky obstacle courses and party games to be the last one standing.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co20dh.webp"
  },
  {
    title: "Valorant",
    description: "A tactical first-person shooter where precise gunplay meets unique agent abilities in competitive 5v5 matches.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2mvt.webp"
  },
  {
    title: "Call of Duty: Warzone",
    description: "Drop into a massive battle royale with up to 150 players in this free-to-play Call of Duty experience.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co20qi.webp"
  },
  {
    title: "Genshin Impact",
    description: "Explore the fantasy world of Teyvat in this free-to-play action RPG with gacha mechanics and elemental combat.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2as5.webp"
  },
  {
    title: "Stardew Valley",
    description: "Leave city life behind and rebuild your grandfather's farm in this charming farming simulation and RPG hybrid.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co49c5.webp"
  },
  {
    title: "Hollow Knight",
    description: "Explore a vast underground kingdom filled with challenging combat and beautiful hand-drawn art in this metroidvania.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1rgi.webp"
  },
  {
    title: "Super Mario Odyssey",
    description: "Join Mario and his new ally Cappy on a globe-trotting adventure to rescue Princess Peach from Bowser's wedding plans.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1suk.webp"
  },
  {
    title: "The Legend of Zelda: Breath of the Wild",
    description: "Explore Hyrule like never before in this open-world adventure that redefines the Zelda formula.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1nme.webp"
  },
  {
    title: "Celeste",
    description: "Help Madeline overcome her inner demons while climbing the treacherous Celeste Mountain in this challenging platformer.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1tef.webp"
  },
  {
    title: "Ori and the Will of the Wisps",
    description: "Embark on a new journey as Ori in this emotionally-driven metroidvania with stunning visuals and music.",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1rak.webp"
  }
];

      setGames(dummyGames);
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
    </div>
  );
};

// Export the UserGames component for use elsewhere
export default UserGames;
